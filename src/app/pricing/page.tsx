import PricingHero from "~/components/pricing-hero";
import PricingSubscription from "~/components/pricing-subscription";
import { SectionWrapper } from "~/components/ui/section-wrapper";

export default function PricingPage() {
  return (
    <div id="PricingPage" className="flex flex-col items-center justify-center">
      <PricingHero />

      <SectionWrapper>
        <PricingSubscription />
      </SectionWrapper>
    </div>
  );
}
