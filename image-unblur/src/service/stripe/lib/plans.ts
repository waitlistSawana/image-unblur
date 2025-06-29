import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env";

export const PlanSchema = z.object({
  plan: z.enum(["free", "basic", "pro", "enterprise"]),
  planKey: z.enum([
    "BASIC_MONTHLY",
    "BASIC_YEARLY",
    "PRO_MONTHLY",
    "PRO_YEARLY",
  ]),
  credit: z.number().positive(),
  bonusCredit: z.number().positive(),
});

export const PlanTableSchema = z.record(
  z.string().startsWith("price_"),
  PlanSchema,
);

export type Plan = z.infer<typeof PlanSchema>;
export type PlanTable = z.infer<typeof PlanTableSchema>;

export const planTable: PlanTable = {
  [`${env.NEXT_PUBLIC_STRIPE_PLAN_BASIC_MONTHLY}`]: {
    plan: "basic",
    planKey: "BASIC_MONTHLY",
    credit: 100,
    bonusCredit: 0,
  },
  [`${env.NEXT_PUBLIC_STRIPE_PLAN_BASIC_YEARLY}`]: {
    plan: "basic",
    planKey: "BASIC_YEARLY",
    credit: 100,
    bonusCredit: 0,
  },
  [`${env.NEXT_PUBLIC_STRIPE_PLAN_PRO_MONTHLY}`]: {
    plan: "pro",
    planKey: "PRO_MONTHLY",
    credit: 400,
    bonusCredit: 0,
  },
  [`${env.NEXT_PUBLIC_STRIPE_PLAN_PRO_YEARLY}`]: {
    plan: "pro",
    planKey: "PRO_YEARLY",
    credit: 400,
    bonusCredit: 0,
  },
};

export const getPlanByPriceId = (priceId: string | undefined): Plan => {
  if (!priceId)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "PriceId is invalid when getting plan.",
    });

  const plan = planTable[priceId];

  if (!plan)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Plan not found according price id.",
    });

  return plan;
};
