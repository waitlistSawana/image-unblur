"use client";

import { cn } from "~/lib/utils";

export default function PricingHero({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      <h1 className="mx-auto max-w-5xl font-mono text-3xl font-bold sm:text-4xl lg:text-5xl">
        Pricing of AI Image Generator Starter
      </h1>
      <p className="mx-auto max-w-6xl text-center font-mono text-lg">
        清晰的定价策略，开启你的 AI 图片生成之旅。
      </p>
    </div>
  );
}
