import { GoogleOneTap } from "@clerk/nextjs";
import { Navbar } from "~/components/navbar";
import ModernHero from "~/components/modern-hero";
import ModernFeatures from "~/components/modern-features";
import ModernDemo from "~/components/modern-demo";
import ModernHowItWorks from "~/components/modern-how-it-works";
import ModernPricing from "~/components/modern-pricing";
import ModernFAQ from "~/components/modern-faq";

export default async function Home() {
  return (
    <div className="mx-auto w-full">
      <GoogleOneTap />

      <Navbar id="navbar" />

      <ModernHero />

      <ModernDemo />

      <ModernFeatures />

      <ModernHowItWorks />

      <ModernPricing />

      <ModernFAQ />
    </div>
  );
}
