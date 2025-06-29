"use client";

import { useClerk } from "@clerk/nextjs";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";

interface PackageButtonProps {
  packageId: string;
  priceId: string;
}

export default function PackageButton({
  className,
  packageId,
  priceId,
  ...props
}: React.ComponentProps<"button"> & PackageButtonProps) {
  const router = useRouter();
  const { openSignIn, user } = useClerk();
  const email = user?.emailAddresses[0]?.emailAddress;

  const {
    mutate: createPackageCheckoutSession,
    isPending,
    isSuccess,
  } = api.billing.createPackageCheckoutSession.useMutation({
    mutationKey: ["createPackageCheckoutSession"],
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

  const handleClick = () => {
    if (!email) {
      openSignIn();
    } else {
      createPackageCheckoutSession({
        email: email,
        priceId: priceId,
      });
    }
  };

  return (
    <Button
      className={cn("w-full cursor-pointer transition-all", className)}
      {...props}
      variant="default"
      size={"lg"}
      onClick={() => {
        handleClick();
      }}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Your Checkout...
        </>
      ) : isSuccess ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Checkout Created!
        </>
      ) : (
        "Buy Now"
      )}
    </Button>
  );
}
