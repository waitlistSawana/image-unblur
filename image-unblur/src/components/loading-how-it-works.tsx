import { Skeleton } from "./ui/skeleton";

export function LoadingHowItWorks() {
  return (
    <div className="bg-muted/50 relative w-full py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header skeletons - matching SectionHeader component */}
        <div className="mx-auto mb-12 w-full max-w-3xl text-center">
          <Skeleton className="bg-primary/10 mb-2 inline-block h-8 w-24 rounded-full" />
          <Skeleton className="mx-auto h-10 w-full max-w-lg rounded-lg" />
          <Skeleton className="mx-auto mt-4 h-6 w-full max-w-xl rounded-md" />
        </div>

        {/* Steps skeleton */}
        <div className="relative mx-auto mt-16 w-fit">
          {/* Connection line */}
          <div className="bg-border absolute top-0 left-[calc(2.5rem)] hidden h-full w-0.5 md:block" />

          <div className="space-y-12 md:space-y-16">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative flex flex-col md:flex-row md:gap-12"
              >
                {/* Step number skeleton */}
                <Skeleton className="bg-primary/10 text-primary h-20 w-20 flex-none rounded-full" />

                {/* Step content skeleton */}
                <div className="mt-6 md:mt-0">
                  <Skeleton className="h-8 w-40 rounded-md" />
                  <Skeleton className="text-muted-foreground mt-3 h-6 w-64 rounded-md" />

                  {/* Step example card skeleton */}
                  <div className="bg-card mt-6 rounded-lg border p-6 shadow-sm">
                    <Skeleton className="bg-muted/50 text-muted-foreground h-32 w-full rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
