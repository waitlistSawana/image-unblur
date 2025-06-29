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
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{
        background: "var(--gradient-hero)",
      }}
      {...props}
    >
      {/* Animated background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/25 transition-all duration-300">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Image Enhancement
            </Badge>
          </div>

          {/* Main title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            Transform
            <span className="block bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Blurry Images
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 text-white/90">
              into Crystal Clear
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Harness the power of advanced AI to restore clarity and detail to your blurred photos.
            Professional-grade results in seconds.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">500K+</div>
              <div className="text-white/70">Images Enhanced</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">98%</div>
              <div className="text-white/70">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">< 30s</div>
              <div className="text-white/70">Processing Time</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-[var(--color-accent-orange)] hover:bg-[var(--color-accent-orange)]/90 text-white border-0 text-lg px-8 py-6 h-auto group transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/image-deblur" className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Start Deblurring Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent text-lg px-8 py-6 h-auto transition-all duration-300"
              asChild
            >
              <Link href="#demo">
                See Demo
              </Link>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-8 w-4 h-4 bg-white/40 rounded-full animate-ping" />
      <div className="absolute top-3/4 right-12 w-6 h-6 bg-white/30 rounded-full animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/50 rounded-full animate-bounce delay-300" />
    </div>
  );
}
