"use client";

import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PlanButtonProps {
  planId: string;
  isPopular: boolean;
}

export default function PlanButton({
  className,
  planId,
  isPopular,
  ...props
}: React.ComponentProps<"button"> & PlanButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // TODO: trpc
  const testFC = async (id: string) => {
    setIsLoading(true);

    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    toast.success(`Plan ${id} selected`);

    setIsLoading(false);
  };

  return (
    <Button
      className={cn("w-full cursor-pointer transition-all", className)}
      {...props}
      variant={isPopular ? "default" : "secondary"}
      size={"lg"}
      onClick={async () => {
        await testFC(planId);
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Your Checkout...
        </>
      ) : (
        "Subscribe"
      )}
    </Button>
  );
}
