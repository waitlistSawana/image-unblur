import ModernPricing from "~/components/modern-pricing";
import { Badge } from "~/components/ui/badge";
import { Star, Zap, Shield } from "lucide-react";

export default async function PricingPage() {
  return (
    <div id="PricingPage" className="relative min-h-screen">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="bg-primary absolute top-20 left-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="absolute right-20 bottom-20 h-80 w-80 rounded-full bg-purple-500 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center gap-8 py-16 text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Star className="mr-2 h-4 w-4" />
            Transparent Pricing
          </Badge>

          <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
            Simple,
            <span className="from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-transparent">
              {" "}Fair Pricing{" "}
            </span>
            for Everyone
          </h1>

          <p className="text-muted-foreground max-w-3xl text-xl md:text-2xl">
            Choose the perfect plan for your image enhancement needs.
            No hidden fees, cancel anytime.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Instant activation</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Modern Pricing Component */}
        <ModernPricing />
      </div>
    </div>
  );
}
