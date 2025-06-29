import { eq, sql } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "~/env";
import { TRPCErrorResponse } from "~/lib/error-handle/route-response";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { stripe } from "~/service/stripe";
import { getPackageByPriceId } from "~/service/stripe/lib/package";
import { getPlanByPriceId } from "~/service/stripe/lib/plans";

// 注意：这里的逻辑可能不够严谨，不建议直接用于生产环境
// 如果你坚持上线到生产环境，请严格检查相关逻辑

export interface PostSuccessResponse {
  message: string;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const event = stripe.webhooks.constructEvent(
    body,
    signature ?? "",
    env.STRIPE_WEBHOOK_SECRET,
  );

  const eventType = event.type;

  switch (eventType) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const { clerkId } = session.metadata ?? { clerkId: null };
      if (!clerkId) {
        return TRPCErrorResponse({
          code: "BAD_REQUEST",
          message: "No clerkId found in metadata.",
          request,
        });
      }

      const sesId = session.id;
      const mode = session.mode;

      const checkoutSession = await stripe.checkout.sessions.retrieve(sesId, {
        expand: ["line_items"],
      });

      if (checkoutSession.payment_status == "unpaid") {
        return TRPCErrorResponse({
          code: "BAD_REQUEST",
          message: "Payment status is unpaid.",
          request,
        });
      }

      switch (mode) {
        case "subscription": {
          // 更新他们的数据库状态
          // 1. 获取 stripe 4 条信息
          const cusId = session.customer;
          const subId = session.subscription;

          if (!cusId || typeof cusId !== "string") {
            return TRPCErrorResponse({
              code: "BAD_REQUEST",
              message: "No customer id found.",
              request,
            });
          }
          if (!subId || typeof subId !== "string") {
            return TRPCErrorResponse({
              code: "BAD_REQUEST",
              message: "No subscription id found.",
              request,
            });
          }

          const subscription = await stripe.subscriptions.retrieve(subId, {
            expand: ["items.data"],
          });

          const subscriptionCycleAnchor = subscription.billing_cycle_anchor;
          const currentPeriodEnd =
            subscription.items.data[0]?.current_period_end;
          const priceId = subscription.items.data[0]?.price.id;

          if (!currentPeriodEnd) {
            return TRPCErrorResponse({
              code: "INTERNAL_SERVER_ERROR",
              message: "No current period end found.",
              request,
            });
          }

          // 2. 计算他们应该得到的 credit, bonusCredit. plan，pricid 表
          // TODO: 处理抛出的 TRPCError
          const { plan, credit, bonusCredit } = getPlanByPriceId(priceId);

          // 3. 更新 user 表
          await db
            .update(users)
            .set({
              // stripe
              stripeCustomerId: cusId,
              stripeSubscriptionId: subId,
              stripePriceId: priceId,
              stripeSubscriptionCurrentPeriodEnd: new Date(
                currentPeriodEnd * 1000, // unix(s) to date(ms)
              ),
              // plan, credit, bonusCredit, etc.
              plan: plan,
              credit: sql`${users.credit} + ${credit}`, // 默认为 5
              bonusCredit: sql`${users.bonusCredit} + ${bonusCredit}
            `, // 默认为 0
              lastRefreshCredit: new Date(),
              // subscriptoin info
              stripeSubscriptionCycleAnchor: new Date(
                subscriptionCycleAnchor * 1000, // unix(s) to date(ms)
              ),
            })
            .where(eq(users.clerkId, clerkId));

          break;
        }
        case "payment": {
          const priceId = checkoutSession.line_items?.data[0]?.price?.id;

          if (!priceId) {
            return TRPCErrorResponse({
              code: "INTERNAL_SERVER_ERROR",
              message: "No price id found.",
              request,
            });
          }

          const { bonusCredit } = getPackageByPriceId(priceId);

          await db
            .update(users)
            .set({
              bonusCredit: sql`${users.bonusCredit} + ${bonusCredit}`,
            })
            .where(eq(users.clerkId, clerkId));

          break;
        }
        default:
          return TRPCErrorResponse({
            code: "BAD_REQUEST",
            message: "Invalid mode.",
            request,
          });
      }

      break;
    }
    case "customer.subscription.updated": {
      // ✅ 用户切换订阅

      const subscription = event.data.object;
      const previousSubscription = event.data.previous_attributes;

      if (!previousSubscription) {
        return NextResponse.json(
          {
            message:
              "Previous subscription not found. No previous attributes found.",
          },
          {
            status: 200,
            statusText: "OK",
          },
        );
      }

      const status = subscription.status;
      if (status !== "active" && status !== "trialing") {
        return TRPCErrorResponse({
          code: "PAYMENT_REQUIRED",
          message: "Subscription is not active or trialing.",
          request,
        });
      }

      const cusId = subscription.customer;
      const subId = subscription.id;
      const priceId = subscription.items.data[0]?.price?.id;
      const periodEnd = subscription.items.data[0]?.current_period_end;
      const subscriptionCycleAnchor = subscription.billing_cycle_anchor;

      if (!cusId || typeof cusId !== "string") {
        return TRPCErrorResponse({
          code: "INTERNAL_SERVER_ERROR",
          message: `No customer id found. [subId: ${subId}]`,
          request,
        });
      }
      if (!periodEnd) {
        return TRPCErrorResponse({
          code: "INTERNAL_SERVER_ERROR",
          message: `No period end found. [subId: ${subId}, cusId: ${cusId}]`,
          request,
        });
      }

      // previous subscription
      const previousPriceId = previousSubscription.items?.data[0]?.price?.id;
      if (!previousPriceId) {
        return NextResponse.json(
          {
            message: `Previous price id not found. [subId: ${subId}, cusId: ${cusId}]`,
          },
          {
            status: 200,
            statusText: "OK",
          },
        );
      }

      // credit 数据
      const { plan, credit, bonusCredit } = getPlanByPriceId(priceId);
      const { plan: previousPlan, credit: previousCredit } =
        getPlanByPriceId(previousPriceId);

      // 使用事务处理
      await db.transaction(async (tx) => {
        // 先查询用户当前数据
        const [user] = await tx
          .select({
            id: users.id,
            currentCredit: users.credit,
            currentBonusCredit: users.bonusCredit,
          })
          .from(users)
          .where(eq(users.stripeCustomerId, cusId));

        if (!user) {
          return TRPCErrorResponse({
            code: "INTERNAL_SERVER_ERROR",
            message: `User not found with Customer ID: ${cusId}`,
            request,
          });
        }

        // 计算信用点变化
        let changeCredits: number;
        // basic -> pro
        if (previousPlan === "basic" && plan === "pro") {
          changeCredits = credit - previousCredit; // eg. 400 - 100 = 300
        } else if (previousPlan === "pro" && plan === "basic") {
          changeCredits = credit - previousCredit; // eg. 100 - 400 = -300
        } else {
          changeCredits = 0;
        }

        const updatedCredit = (user.currentCredit ?? 0) + changeCredits;
        const updatedBonusCredit = (user.currentBonusCredit ?? 0) + bonusCredit;

        // 更新用户数据
        await tx
          .update(users)
          .set({
            stripeSubscriptionId: subId,
            stripePriceId: priceId,
            stripeSubscriptionCurrentPeriodEnd: new Date(periodEnd * 1000),
            plan: plan,
            credit: updatedCredit,
            bonusCredit: updatedBonusCredit,
            lastRefreshCredit: new Date(),
            // subscription info
            stripeSubscriptionCycleAnchor: new Date(
              subscriptionCycleAnchor * 1000, // unix(s) to date(ms)
            ),
          })
          .where(eq(users.stripeCustomerId, cusId));
      });

      break;
    }

    case "customer.subscription.deleted": {
      // ✅ 用户取消订阅

      const subscription = event.data.object;

      const cusId = subscription.customer;

      if (!cusId || typeof cusId !== "string") {
        return TRPCErrorResponse({
          code: "INTERNAL_SERVER_ERROR",
          message: `No customer id found.`,
          request,
        });
      }

      // database update
      await db
        .update(users)
        .set({
          stripePriceId: null,
          stripeSubscriptionCurrentPeriodEnd: null,
          // plan, credit, bonusCredit, etc.
          plan: "free",
          credit: 0,
          lastRefreshCredit: null,
          // subscription info
          stripeSubscriptionCycleAnchor: null,
        })
        .where(eq(users.stripeCustomerId, cusId));
      break;
    }

    default: {
      // 默认
      break;
    }
  }

  return NextResponse.json({ message: "success" } as PostSuccessResponse, {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
