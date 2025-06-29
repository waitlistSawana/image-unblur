import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";

export function LoadingPricingPlans() {
  return (
    <div className="mx-auto grid grid-cols-1 gap-4 md:max-w-[50vw]">
      <Card className="mx-auto w-full overflow-hidden rounded-xl border shadow-sm md:w-full">
        {/* Card content - horizontal layout */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left content area */}
          <div className="flex-grow p-6">
            {/* Title and description */}
            <Skeleton className="h-7 w-32 rounded-md" />
            <Skeleton className="mt-2 h-5 w-64 rounded-md" />

            {/* Divider */}
            <div className="bg-border my-4 h-px w-full"></div>

            {/* Features list - two columns layout */}
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-5 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Right price and button area */}
          <div className="bg-muted/30 flex w-full flex-col items-center justify-center p-6 md:w-full md:rounded-l-2xl">
            {/* Price */}
            <div className="mb-4 text-center">
              <Skeleton className="mx-auto h-8 w-20 rounded-md" />
              <Skeleton className="mx-auto mt-1 h-4 w-24 rounded-md" />
            </div>

            {/* Button */}
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>
      </Card>
    </div>
  );
}
