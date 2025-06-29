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
        欢迎使用 AI 图像去模糊
      </h1>
      <p className="mx-auto max-w-6xl text-center font-mono text-lg">
        使用先进的AI技术，让模糊照片变得清晰锐利
      </p>
      <div className="mx-auto grid grid-cols-2 gap-6 text-center">
        <Button variant={"outline"} size={"huge"} asChild>
          <Link href={"/pricing"}>查看定价</Link>
        </Button>
        <Button variant={"default"} size={"huge"} asChild>
          <Link href={"/image-deblur"}>开始去模糊</Link>
        </Button>
      </div>
    </div>
  );
}
