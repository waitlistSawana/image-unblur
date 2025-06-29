"use client";

import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Sparkles, Zap, ArrowRight } from "lucide-react";

interface ModernHeroProps {
  className?: string;
}

export default function ModernHero({
  className,
  ...props
}: React.ComponentProps<"div"> & ModernHeroProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden",
        className,
      )}
      style={{
        background: "var(--gradient-hero)",
      }}
      {...props}
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-white/5 blur-3xl delay-700" />
        <div className="animate-spin-slow absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="space-y-8 text-center">
          {/* Badge */}
          <div className="flex justify-center">
            <Button className="border-white/30 bg-white/20 text-white transition-all duration-300 hover:bg-white/25">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Image Enhancement
            </Button>
          </div>

          {/* Main title */}
          <h1 className="text-5xl leading-tight font-bold text-white md:text-7xl lg:text-8xl">
            Transform
            <span className="block bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Blurry Images
            </span>
            <span className="mt-4 block text-4xl text-white/90 md:text-5xl lg:text-6xl">
              into Crystal Clear
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-white/80 md:text-2xl">
            Harness the power of advanced AI to restore clarity and detail to
            your blurred photos. Professional-grade results in seconds.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white md:text-4xl">
                500K+
              </div>
              <div className="text-white/70">Images Enhanced</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white md:text-4xl">
                98%
              </div>
              <div className="text-white/70">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white md:text-4xl">
                {" "}
                30s
              </div>
              <div className="text-white/70">Processing Time</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Button
              size="lg"
              className="group h-auto border-0 bg-[var(--color-accent-orange)] px-8 py-6 text-lg text-white transition-all duration-300 hover:scale-105 hover:bg-[var(--color-accent-orange)]/90"
              asChild
            >
              <Link href="/image-deblur" className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Start Deblurring Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-auto border-white/30 bg-transparent px-8 py-6 text-lg text-white transition-all duration-300 hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="#demo">See Demo</Link>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/50">
              <div className="mt-2 h-3 w-1 rounded-full bg-white/70"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-8 h-4 w-4 animate-ping rounded-full bg-white/40" />
      <div className="absolute top-3/4 right-12 h-6 w-6 animate-pulse rounded-full bg-white/30" />
      <div className="absolute top-1/2 right-1/4 h-2 w-2 animate-bounce rounded-full bg-white/50 delay-300" />
    </div>
  );
}
