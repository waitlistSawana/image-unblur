import { Skeleton } from "./ui/skeleton";

export function LoadingNavbar() {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-4 border-b px-2 py-2 md:px-4 xl:px-6">
      {/* Logo skeleton */}
      <div className="flex flex-nowrap justify-start">
        <Skeleton className="h-7 w-48 rounded-md" />
      </div>

      {/* Navigation items skeleton */}
      <div className="flex-1">
        <div className="flex justify-center">
          <ul className="flex flex-row gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index}>
                <Skeleton className="h-6 w-24 rounded-md" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Auth buttons skeleton */}
      <div className="flex flex-row gap-2">
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    </div>
  );
}
