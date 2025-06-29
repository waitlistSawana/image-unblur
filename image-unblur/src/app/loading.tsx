import { LoadingNavbar } from "~/components/loading-navbar";
import LoadingHero from "~/components/loading-hero";
import { LoadingFeatures } from "~/components/loading-features";
import { LoadingHowItWorks } from "~/components/loading-how-it-works";
import { LoadingTestimonials } from "~/components/loading-testimonials";
import { LoadingFAQs } from "~/components/loading-faqs";

export default function HomeLoading() {
  return (
    <div className="mx-auto w-full">
      <LoadingNavbar />
      <LoadingHero />
      <LoadingFeatures />
      <LoadingHowItWorks />
      <LoadingTestimonials />
      <LoadingFAQs />
    </div>
  );
}
