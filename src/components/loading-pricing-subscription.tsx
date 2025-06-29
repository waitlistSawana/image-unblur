import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export function LoadingPricingSubscription() {
  return (
    <div>
      {/* Tabs skeleton */}
      <div className="mx-auto mb-8 grid w-64 grid-cols-2 rounded-md border">
        <Skeleton className="h-10 rounded-l-md" />
        <Skeleton className="h-10 rounded-r-md" />
      </div>

      {/* Plans grid skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="mx-auto w-full md:w-full md:max-w-sm">
            <CardHeader>
              <Skeleton className="h-7 w-32 rounded-md" />
              <CardContent className="px-0">
                <Skeleton className="h-5 w-48 rounded-md" />
              </CardContent>
              {index === 1 && <Skeleton className="h-6 w-24 rounded-full" />}
            </CardHeader>

            <CardContent>
              {/* Price skeleton */}
              <div className="mb-6 flex flex-row flex-wrap items-baseline gap-2">
                <Skeleton className="h-12 w-24 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>

              {/* Button skeleton */}
              <Skeleton className="h-9 w-full rounded-md" />

              {/* Features list skeleton */}
              <ul className="mt-6 space-y-2">
                {Array.from({ length: 4 + (index === 2 ? 3 : 0) }).map(
                  (_, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-5 w-full rounded-md" />
                    </li>
                  ),
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
