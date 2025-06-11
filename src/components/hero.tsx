"use client";

import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";

interface HeroProps {
  className?: string;
}

export default function Hero({
  className,
  ...props
}: React.ComponentProps<"div"> & HeroProps) {
  return (
    <div
      className={cn(
        "flex min-h-[70vh] flex-col items-center justify-center gap-6 py-10 text-center",
        className,
      )}
      {...props}
    >
      <h1 className="mx-auto max-w-5xl font-mono text-7xl font-bold">
        欢迎使用 AI Image Generator Starter
      </h1>
      <p className="mx-auto max-w-6xl text-center font-mono text-lg">
        在几小时内启动你的 图片生成 SAAS 应用，而不是几天
      </p>
      <div className="mx-auto grid grid-cols-2 gap-6 text-center">
        <Button variant={"outline"} size={"huge"} asChild>
          <Link href={"/examples"}>Examples</Link>
        </Button>
        <Button variant={"default"} size={"huge"} asChild>
          <Link href={"/text-to-image"}>生成图片</Link>
        </Button>
      </div>
    </div>
  );
}
