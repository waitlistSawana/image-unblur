import { Skeleton } from "./ui/skeleton";

export function LoadingPricingHero() {
  return (
    <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-6 py-10 text-center">
      {/* Title skeleton - matching font-mono text-3xl sm:text-4xl lg:text-5xl */}
      <Skeleton className="mx-auto h-8 w-full max-w-xl rounded-lg sm:h-10 lg:h-12" />

      {/* Subtitle skeleton - matching font-mono text-lg */}
      <Skeleton className="mx-auto h-6 w-full max-w-2xl rounded-md" />
    </div>
  );
}
