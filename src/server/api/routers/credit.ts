import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { checkCreditRefreshStatus } from "~/lib/credit";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { getPlanByPriceId } from "~/service/stripe/lib/plans";

export const creditRouter = createTRPCRouter({
  // 获取用户当前的 plan, credit, bonusCredit
  getUserCredit: publicProcedure.query(async ({ ctx }) => {
    const { userId: clerkId } = await ctx.auth();

    if (!clerkId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkId, clerkId),
      columns: {
        plan: true,
        credit: true,
        bonusCredit: true,
        stripeSubscriptionCurrentPeriodEnd: true,
        stripeSubscriptionCycleAnchor: true,
        lastRefreshCredit: true,
        stripePriceId: true,
        clerkId: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // check is need to refresh credit
    const { shouldRefresh } = checkCreditRefreshStatus({
      plan: user.plan ?? "free",
      stripeSubscriptionCurrentPeriodEnd:
        user.stripeSubscriptionCurrentPeriodEnd,
      stripeSubscriptionCycleAnchor: user.stripeSubscriptionCycleAnchor,
      lastRefreshCredit: user.lastRefreshCredit,
    });

    if (shouldRefresh && user.stripePriceId) {
      const priceId = user.stripePriceId;
      const { credit } = getPlanByPriceId(priceId);

      let updatedCredit: number;
      if (user.credit && user.credit < 0) {
        updatedCredit = user.credit + credit;
      } else {
        updatedCredit = credit;
      }

      await ctx.db
        .update(users)
        .set({
          credit: updatedCredit,
          lastRefreshCredit: new Date(),
        })
        .where(eq(users.clerkId, user.clerkId));
    }

    return {
      plan: user.plan,
      credit: user.credit ?? 0,
      bonusCredit: user.bonusCredit ?? 0,
      totalCredit: Math.max(user.credit ?? 0, 0) + (user.bonusCredit ?? 0),
    };
  }),

  // 提前检查，实施刷新
  // example: checkCreditRefresStates --yes--> refreshCredit
  refreshCredit: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkId, ctx.clerkId),
    });
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const { shouldRefresh } = checkCreditRefreshStatus({
      plan: user.plan ?? "free",
      stripeSubscriptionCurrentPeriodEnd:
        user.stripeSubscriptionCurrentPeriodEnd,
      stripeSubscriptionCycleAnchor: user.stripeSubscriptionCycleAnchor,
      lastRefreshCredit: user.lastRefreshCredit,
    });

    if (!shouldRefresh) {
      return {
        isRefreshed: false,
        message: "No need to refresh credit",
      };
    }

    const priceId = user.stripePriceId;

    if (!priceId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Price id not found",
      });
    }

    const { credit } = getPlanByPriceId(priceId);

    let updatedCredit: number;
    if (user.credit && user.credit < 0) {
      updatedCredit = user.credit + credit;
    } else {
      updatedCredit = credit;
    }

    await ctx.db
      .update(users)
      .set({
        credit: updatedCredit,
        lastRefreshCredit: new Date(),
      })
      .where(eq(users.clerkId, ctx.clerkId));

    return {
      isRefreshed: true,
      message: "Credit refreshed",
    };
  }),
});
