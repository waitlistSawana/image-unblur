"use client";

import { UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface OnboardingPageComponentProps {
  className?: string;
  clerkId: string;
}

export default function OnboardingPageComponent({
  className,
  clerkId,
  ...props
}: React.ComponentProps<"div"> & OnboardingPageComponentProps) {
  const router = useRouter();

  const { mutate: syncUser } = api.auth.syncUser.useMutation({
    mutationKey: ["syncUser", clerkId],
    onSuccess: () => {
      router.push("/");
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    syncUser();
  }, [syncUser]);

  return (
    <div
      className={cn(
        "flex h-screen flex-col items-center justify-center",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <h1 className="text-2xl font-bold">Onboarding...</h1>
        <p className="text-muted-foreground text-sm">
          Please wait seconds while we sync your account.
        </p>
        <div className="flex min-h-12 items-center justify-center">
          <Button variant={"outline"} size={"icon"} asChild>
            <UserButton />
          </Button>
        </div>
      </div>
    </div>
  );
}
