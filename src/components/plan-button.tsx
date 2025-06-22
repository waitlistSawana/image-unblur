"use client";

import { useClerk } from "@clerk/nextjs";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";

interface PlanButtonProps {
  planId: string;
  isPopular: boolean;
  email?: string;
  priceId: string;
}

export default function PlanButton({
  className,
  planId,
  isPopular,
  priceId,
  ...props
}: React.ComponentProps<"button"> & PlanButtonProps) {
  const router = useRouter();
  const { openSignIn, user, loaded, isSignedIn } = useClerk();
  const email = user?.emailAddresses[0]?.emailAddress;

  const { data: userCredit } = api.credit.getUserCredit.useQuery(undefined, {
    enabled: loaded && isSignedIn,
  });

  const {
    mutate: createSubscriptionCheckoutSession,
    isPending: isCheckoutPending,
    isSuccess,
  } = api.billing.createSubscriptionCheckoutSession.useMutation({
    mutationKey: ["createCheckoutSession"],
    onSuccess: (data) => {
      router.push(data.url);
    },
    onError: (error) => {
      if (error.data?.code === "NOT_FOUND") {
        toast.warning("Please sync your account first.", {
          description: "We are redirecting you to the onboarding page.",
        });
        router.push("/onboarding");
        return;
      }

      toast.error(error.data?.code ?? "Something went wrong", {
        description: error.message,
      });
    },
  });

  const {
    mutate: createBillingPortalSession,
    isPending: isBillingPortalPending,
  } = api.billing.createBillingPortalSession.useMutation({
    mutationKey: ["createBillingPortalSession"],
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        window.open(data.url, "_blank");
      } else {
        router.push(data.url);
      }
    },
  });

  const handleClick = () => {
    if (!loaded) {
      toast.warning("Waiting Secondes", {
        description: "We are loading your auth...",
      });
      return;
    } else if (!email) {
      openSignIn();
    } else if (isSubscription) {
      createBillingPortalSession();
    } else {
      createSubscriptionCheckoutSession({ email: email, priceId: priceId });
    }
  };

  const isPending = isCheckoutPending || isBillingPortalPending;
  const isCurrentPlan = planId === userCredit?.plan;
  const isSubscription = userCredit?.plan !== "free";

  return (
    <Button
      className={cn("w-full cursor-pointer transition-all", className)}
      {...props}
      variant={
        planId === userCredit?.plan
          ? "outline"
          : isPopular
            ? "default"
            : "secondary"
      }
      size={"lg"}
      onClick={() => {
        handleClick();
      }}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Session...
        </>
      ) : isSuccess ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Session Created!
        </>
      ) : (
        <>{isCurrentPlan ? "Current Plan" : "Subscribe"}</>
      )}
    </Button>
  );
}
