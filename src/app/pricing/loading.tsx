import { LoadingPricingHero } from "~/components/loading-pricing-hero";
import { LoadingPricingPlans } from "~/components/loading-pricing-plans";
import { LoadingPricingSubscription } from "~/components/loading-pricing-subscription";
import { Skeleton } from "~/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div
      id="PricingLoading"
      className="flex flex-col items-center justify-center"
    >
      <LoadingPricingHero />

      <div className="relative w-full py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <LoadingPricingPlans />
        </div>
      </div>

      <Skeleton className="h-6 w-64 rounded-md" />

      <div className="relative w-full py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <LoadingPricingSubscription />
        </div>
      </div>
    </div>
  );
}
