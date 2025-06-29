import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env";

export const PackageSchema = z.object({
  package: z.enum(["TRIAL_PACK"]),
  credit: z.number().positive(),
  bonusCredit: z.number().positive(),
});

export const PackageTableSchema = z.record(
  z.string().startsWith("price_"),
  PackageSchema,
);

export type Package = z.infer<typeof PackageSchema>;
export type PackageTable = z.infer<typeof PackageTableSchema>;

export const packageTable: PackageTable = {
  [`${env.NEXT_PUBLIC_STRIPE_PACK_TRIAL_PACK}`]: {
    package: "TRIAL_PACK",
    credit: 0,
    bonusCredit: 15,
  },
};

export const getPackageByPriceId = (priceId: string | undefined): Package => {
  if (!priceId)
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "PriceId is invalid when getting package.",
    });

  const pack = packageTable[priceId];

  if (!pack)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Package not found according price id.",
    });

  return pack;
};
