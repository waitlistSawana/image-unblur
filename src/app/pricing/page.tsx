import PricingHero from "~/components/pricing-hero";
import PricingPackage from "~/components/pricing-package";
import PricingSubscription from "~/components/pricing-subscription";
import { SectionWrapper } from "~/components/ui/section-wrapper";

export default function PricingPage() {
  return (
    <div id="PricingPage" className="flex flex-col items-center justify-center">
      <PricingHero />

      <SectionWrapper className="py-10 md:py-14">
        <PricingPackage />
      </SectionWrapper>

      <p className="text-muted-foreground text-center text-lg">
        Or subscribe to our yearly/monthly plan
      </p>

      <SectionWrapper className="py-10 md:py-14">
        <PricingSubscription />
      </SectionWrapper>
    </div>
  );
}
