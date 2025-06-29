import { Skeleton } from "./ui/skeleton";

export function LoadingTestimonials() {
  return (
    <div className="relative w-full py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header skeletons - matching SectionHeader component */}
        <div className="mx-auto mb-12 w-full max-w-3xl text-center">
          <Skeleton className="bg-primary/10 mb-2 inline-block h-8 w-24 rounded-full" />
          <Skeleton className="mx-auto h-10 w-full max-w-lg rounded-lg" />
          <Skeleton className="mx-auto mt-4 h-6 w-full max-w-xl rounded-md" />
        </div>

        {/* Testimonials grid skeleton */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-card flex flex-col rounded-lg border p-6 shadow-sm"
            >
              {/* Rating skeleton */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-5 rounded-full" />
                ))}
              </div>

              {/* Content skeleton */}
              <div className="flex-1 text-lg font-medium italic">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="mt-2 h-4 w-full rounded-md" />
                <Skeleton className="mt-2 h-4 w-3/4 rounded-md" />
                <Skeleton className="mt-2 h-4 w-5/6 rounded-md" />
              </div>

              {/* Author info skeleton */}
              <div className="mt-6 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="text-muted-foreground mt-1 h-4 w-32 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
