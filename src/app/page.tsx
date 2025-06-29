import { GoogleOneTap } from "@clerk/nextjs";
import { Navbar } from "~/components/navbar";
import ModernHero from "~/components/modern-hero";
import ModernFeatures from "~/components/modern-features";
import ImageDeblur from "~/components/image-deblur";
import ModernHowItWorks from "~/components/modern-how-it-works";
import ModernPricing from "~/components/modern-pricing";
import ModernFAQ from "~/components/modern-faq";
import ModernFooter from "~/components/modern-footer";
import { Badge } from "~/components/ui/badge";
import { Sparkles } from "lucide-react";

export default async function Home() {
  return (
    <div className="mx-auto w-full">
      <GoogleOneTap />

      <Navbar id="navbar" />

      <ModernHero />

      {/* Demo Section with same ImageDeblur component */}
      <section id="demo" className="bg-muted/30 relative py-24">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="bg-primary absolute top-20 left-20 h-64 w-64 rounded-full blur-3xl" />
          <div className="absolute right-20 bottom-20 h-80 w-80 rounded-full bg-purple-500 blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          {/* Section header */}
          <div className="mb-16 text-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Sparkles className="mr-2 h-4 w-4" />
              Try It Now
            </Badge>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              See the Magic in
              <span className="from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-transparent">
                {" "}Action
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
              Upload a blurry image and watch our AI transform it into crystal
              clear perfection in seconds
            </p>
          </div>

          {/* Same ImageDeblur component used in /image-deblur page */}
          <ImageDeblur className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl" />
        </div>
      </section>

      <ModernFeatures />

      <ModernHowItWorks />

      <ModernPricing />

      <ModernFAQ />

      <ModernFooter />
    </div>
  );
}
