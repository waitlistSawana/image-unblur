import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";
import { cn } from "~/lib/utils";

interface LoadingTextToImagePreviewProps {
  className?: string;
}

export function LoadingTextToImagePreview({
  className,
  ...props
}: React.ComponentProps<"div"> & LoadingTextToImagePreviewProps) {
  return (
    <div className={cn("", className)} {...props}>
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-36 rounded-md" />
          <Skeleton className="mt-2 h-5 w-64 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
              <Skeleton className="h-full w-full" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
