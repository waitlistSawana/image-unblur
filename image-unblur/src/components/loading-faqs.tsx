import { Skeleton } from "./ui/skeleton";

export function LoadingFAQs() {
  return (
    <div className="bg-muted/50 relative w-full py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header skeletons - matching SectionHeader component */}
        <div className="mx-auto mb-12 w-full max-w-3xl text-center">
          <Skeleton className="bg-primary/10 mb-2 inline-block h-8 w-24 rounded-full" />
          <Skeleton className="mx-auto h-10 w-full max-w-lg rounded-lg" />
          <Skeleton className="mx-auto mt-4 h-6 w-full max-w-xl rounded-md" />
        </div>

        {/* FAQ items skeleton */}
        <div className="mx-auto mt-16 max-w-3xl">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-lg border">
                {/* FAQ question skeleton */}
                <div className="flex items-center justify-between p-4">
                  <Skeleton className="h-6 w-3/4 rounded-md text-lg font-medium" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                {/* Hidden answer area */}
                <div className="hidden px-4 pb-4">
                  <Skeleton className="text-muted-foreground h-16 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
