"use client";

import { cn } from "~/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface LoadingHeroProps {
  className?: string;
}

export default function LoadingHero({
  className,
  ...props
}: React.ComponentProps<"div"> & LoadingHeroProps) {
  return (
    <div
      className={cn(
        "flex min-h-[70vh] flex-col items-center justify-center gap-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      {/* Title skeleton - matching font-mono text-7xl font-bold */}
      <Skeleton className="mx-auto h-20 w-full max-w-5xl rounded-xl" />

      {/* Subtitle skeleton */}
      <Skeleton className="mx-auto h-8 w-full max-w-3xl rounded-lg" />

      {/* Buttons skeleton */}
      <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-6 text-center">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
}
