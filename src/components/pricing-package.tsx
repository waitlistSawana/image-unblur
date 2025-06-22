import { cn } from "~/lib/utils";
import PackageCard from "./package-card";
import { env } from "~/env";

interface PricingPackageProps {
  className?: string;
}

const packagesOptions = [
  {
    id: "trial",
    title: "Trial Pack",
    description: "Perfect for trying out our image generator.",
    price: 3,
    priceId: env.NEXT_PUBLIC_STRIPE_PACK_TRIAL_PACK, // 这里需要替换为实际的价格ID
    currency: "$",
    creditAmount: 15,
    features: [
      {
        label: "15 image credits",
        isGood: true,
      },
      {
        label: "HD resolution",
        isGood: true,
      },
      {
        label: "No expiration date",
        isGood: true,
      },
      {
        label: "Access to all models",
        isGood: true,
      },
    ],
  },
];

export default function PricingPackage({
  className,
  ...props
}: React.ComponentProps<"div"> & PricingPackageProps) {
  return (
    <div className={cn("", className)} {...props}>
      <div className="mx-auto grid grid-cols-1 gap-4 md:max-w-[50vw]">
        {packagesOptions.map((pack) => (
          <PackageCard key={pack.id} packageId={pack.id} {...pack} />
        ))}
      </div>
    </div>
  );
}
