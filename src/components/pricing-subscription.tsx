import { cn } from "~/lib/utils";

import { buttonVariants } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import PlanCard from "./plan-card";

interface PricingSubscriptionProps {
  className?: string;
}

const plansOptions = [
  {
    id: "free",
    title: "Free Plan",
    description: "Try our image generator for free.",
    price: {
      yearly: "Free",
      monthly: "Free",
    },
    currency: "$",
    isPopular: false,
    features: [
      {
        label: "5 images per day",
        isGood: true,
      },
      {
        label: "Basic resolution",
        isGood: true,
      },
      {
        label: "Standard generation speed",
        isGood: true,
      },
      {
        label: "Advanced editing tools",
        isGood: false,
      },
    ],
  },
  {
    id: "basic",
    title: "Basic Plan",
    description: "Perfect for casual creators.",
    price: {
      yearly: 10,
      monthly: 12,
    },
    currency: "$",
    isPopular: true,
    features: [
      {
        label: "50 images per day",
        isGood: true,
      },
      {
        label: "HD resolution",
        isGood: true,
      },
      {
        label: "Faster generation speed",
        isGood: true,
      },
      {
        label: "Basic editing tools",
        isGood: true,
      },
    ],
  },
  {
    id: "pro",
    title: "Pro Plan",
    description: "For professional creators and artists.",
    price: {
      yearly: 25,
      monthly: 30,
    },
    currency: "$",
    isPopular: false,
    features: [
      {
        label: "200 images per day",
        isGood: true,
      },
      {
        label: "4K resolution",
        isGood: true,
      },
      {
        label: "Priority generation speed",
        isGood: true,
      },
      {
        label: "Priority generation speed",
        isGood: true,
      },
      {
        label: "Priority generation speed",
        isGood: true,
      },
      {
        label: "Priority generation speed",
        isGood: true,
      },
      {
        label: "Advanced editing tools",
        isGood: true,
      },
    ],
  },
];

export default function PricingSubscription({
  className,
  ...props
}: React.ComponentProps<"div"> & PricingSubscriptionProps) {
  return (
    <div className={cn("", className)} {...props}>
      <Tabs defaultValue="yearly" className="gap-6 lg:gap-10">
        <TabsList className="mx-auto grid grid-cols-2">
          <TabsTrigger value="yearly" className="flex gap-4 px-4 py-2 text-lg">
            Yearly
            <p
              className={cn(
                "text-xs",
                buttonVariants({ variant: "default", size: "badge" }),
              )}
            >
              -16.66%
            </p>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="px-4 py-2 text-lg">
            Monthly
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plansOptions.map((plan) => (
            <PlanCard key={plan.id} planId={plan.id} {...plan} />
          ))}
        </div>
      </Tabs>
    </div>
  );
}
