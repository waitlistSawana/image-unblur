import { Skeleton } from "./ui/skeleton";

export function LoadingOnboarding() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      {/* User avatar skeleton */}
      <Skeleton className="h-16 w-16 rounded-full" />

      {/* Welcome text skeleton */}
      <Skeleton className="mt-6 h-8 w-64 rounded-lg" />
      <Skeleton className="mt-2 h-5 w-80 rounded-md" />

      {/* Form skeleton */}
      <div className="mt-8 w-full max-w-md space-y-4">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />

        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />

        <Skeleton className="mt-6 h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
