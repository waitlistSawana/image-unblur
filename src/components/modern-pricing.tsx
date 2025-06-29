"use client";

import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Check, Star, Zap } from "lucide-react";
import Link from "next/link";

interface ModernPricingProps {
  className?: string;
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our service",
    badge: null,
    features: [
      "3 images per month",
      "Standard processing speed",
      "Basic image formats",
      "720p resolution limit",
      "Email support",
    ],
    cta: "Get Started Free",
    href: "/image-deblur",
    popular: false,
    gradient: "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "For professionals and frequent users",
    badge: "Most Popular",
    features: [
      "100 images per month",
      "Priority processing speed",
      "All image formats",
      "Full resolution output",
      "Priority email support",
      "Batch processing",
      "API access",
    ],
    cta: "Start Pro Trial",
    href: "/pricing",
    popular: true,
    gradient: "from-primary/20 to-purple-500/20",
  },
  {
    name: "Enterprise",
    price: "$49.99",
    period: "per month",
    description: "For teams and high-volume processing",
    badge: "Best Value",
    features: [
      "Unlimited images",
      "Fastest processing speed",
      "All premium features",
      "Custom integrations",
      "24/7 phone support",
      "Team management",
      "Custom API limits",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
    gradient: "from-orange-100 to-red-200 dark:from-orange-900 dark:to-red-900",
  },
];

export default function ModernPricing({
  className,
  ...props
}: React.ComponentProps<"section"> & ModernPricingProps) {
  return (
    <section
      className={cn("bg-muted/30 relative overflow-hidden py-24", className)}
      {...props}
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="bg-primary absolute top-20 left-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="absolute right-20 bottom-20 h-80 w-80 rounded-full bg-purple-500 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Pricing Plans
          </Badge>
          <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            Choose Your
            <span className="from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-transparent">
              {" "}
              Perfect Plan
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
            Transparent pricing with no hidden fees. Upgrade or downgrade at any
            time.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto mb-16 grid max-w-6xl gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={cn(
                "relative border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl",
                plan.popular
                  ? "border-primary scale-105 shadow-lg"
                  : "border-border hover:border-primary/50",
              )}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute z-10 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Star className="mr-1 h-4 w-4" />
                    {plan.badge}
                  </Badge>
                </div>
              )}

              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-50`}
              />

              <CardHeader className="relative z-10 pb-4 text-center">
                <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold md:text-5xl">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="relative z-10">
                {/* Features list */}
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={cn(
                    "h-12 w-full text-lg transition-all duration-300",
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                      : "variant-outline hover:bg-primary hover:text-primary-foreground",
                  )}
                  asChild
                >
                  <Link href={plan.href}>
                    {plan.popular && <Zap className="mr-2 h-5 w-5" />}
                    {plan.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="space-y-8 text-center">
          {/* Money back guarantee */}
          <div className="mx-auto max-w-2xl rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                30-Day Money Back Guarantee
              </h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Not satisfied? Get a full refund within 30 days, no questions
              asked.
            </p>
          </div>

          {/* Features comparison */}
          <div className="text-muted-foreground flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
