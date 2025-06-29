import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { cn } from "~/lib/utils";

interface LoadingTextToImageFormProps {
  className?: string;
}

export function LoadingTextToImageForm({
  className,
  ...props
}: React.ComponentProps<"div"> & LoadingTextToImageFormProps) {
  return (
    <div className={cn("w-full max-w-4xl", className)} {...props}>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <Skeleton className="h-7 w-36 rounded-md" />
            <Skeleton className="mt-2 h-5 w-64 rounded-md" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt input skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-28 rounded-md" />
              <Skeleton className="h-9 w-36 rounded-md" />
              <Skeleton className="h-9 w-36 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>

          {/* Input image field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Aspect ratio selection skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-md" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-16 rounded-md" />
              ))}
            </div>
          </div>

          {/* Output format selection skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-16 rounded-md" />
              <Skeleton className="h-9 w-16 rounded-md" />
            </div>
          </div>

          {/* Seed field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full rounded-md" />
        </CardFooter>
      </Card>
    </div>
  );
}
