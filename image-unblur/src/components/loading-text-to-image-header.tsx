import { Skeleton } from "./ui/skeleton";

export function LoadingTextToImageHeader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-10 text-center">
      <Skeleton className="h-10 w-64 rounded-xl" /> {/* 对应h1标题 */}
      <Skeleton className="h-6 w-80 rounded-lg" /> {/* 对应p描述 */}
    </div>
  );
}
