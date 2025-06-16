import { Check, X } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TabsContent } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import PlanButton from "./plan-button";

export default function PlanCard({
  planId,
  title,
  description,
  price,
  currency,
  features,
  isPopular,
}: {
  planId: string;
  title: string;
  description: string;
  price: {
    yearly: string | number;
    monthly: string | number;
  };
  currency: string;
  isPopular: boolean;
  features: {
    label: string;
    isGood: boolean;
  }[];
}) {
  return (
    <Card className="mx-auto w-full md:w-full md:max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardContent className="px-0">{description}</CardContent>
        {isPopular && (
          <CardAction
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "flex items-center justify-center rounded-full text-xs",
            )}
          >
            🔥 Popular
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        <div className="mb-6 flex flex-row flex-wrap items-baseline gap-2">
          <div className="text-4xl font-bold md:text-5xl">
            <TabsContent value="yearly">
              {price.yearly} {currency}
            </TabsContent>
            <TabsContent value="monthly">
              {price.monthly} {currency}
            </TabsContent>
          </div>
          <p className="text-sm opacity-80 md:text-base">/month</p>
        </div>

        <PlanButton planId={planId} isPopular={isPopular} />

        <ul className="mt-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              {feature.isGood ? (
                <Check className="text-primary h-4 w-4" />
              ) : (
                <X className="text-secondary h-4 w-4" />
              )}
              <span>{feature.label}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
