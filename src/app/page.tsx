import { FAQs } from "~/components/faqs";
import { Features } from "~/components/features";
import Hero from "~/components/hero";
import { HowItWorks } from "~/components/how-it-works";
import { Navbar } from "~/components/navbar";
import { Testimonials } from "~/components/testimonials";

export default async function Home() {
  return (
    <div className="mx-auto w-full">
      <Navbar id="navbar" />

      <Hero />

      <Features />

      <HowItWorks />

      <Testimonials />

      <FAQs />
    </div>
  );
}
