import { Skeleton } from "./ui/skeleton";

export function LoadingFeatures() {
  return (
    <div className="relative w-full py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header skeletons - matching SectionHeader component */}
        <div className="mx-auto mb-12 w-full max-w-3xl text-center">
          <Skeleton className="bg-primary/10 mb-2 inline-block h-8 w-24 rounded-full" />
          <Skeleton className="mx-auto h-10 w-full max-w-lg rounded-lg" />
          <Skeleton className="mx-auto mt-4 h-6 w-full max-w-xl rounded-md" />
        </div>

        {/* Features grid skeleton */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-card flex flex-col rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
            >
              {/* Icon skeleton */}
              <Skeleton className="bg-primary/10 mb-4 h-12 w-12 rounded-full" />

              {/* Title skeleton */}
              <Skeleton className="mb-2 h-7 w-32 rounded-md" />

              {/* Description skeleton */}
              <Skeleton className="text-muted-foreground h-16 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
