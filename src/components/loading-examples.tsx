import { Skeleton } from "./ui/skeleton";

export function LoadingExamples() {
  return (
    <div className="container mx-auto py-12">
      {/* Header skeleton */}
      <div className="mb-12 flex flex-col items-center justify-center text-center">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="mt-4 h-6 w-96 rounded-md" />
      </div>

      {/* Examples grid skeleton */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-lg border shadow-sm"
          >
            {/* Image skeleton */}
            <Skeleton className="aspect-square w-full" />

            {/* Content skeleton */}
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="mt-2 h-4 w-full rounded-md" />
              <Skeleton className="mt-1 h-4 w-5/6 rounded-md" />

              {/* Tags skeleton */}
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
