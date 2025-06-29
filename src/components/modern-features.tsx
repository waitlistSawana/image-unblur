"use client";

import { cn } from "~/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Brain, Upload, Download, Zap, Shield, Clock } from "lucide-react";

interface ModernFeaturesProps {
  className?: string;
}

const features = [
  {
    icon: Brain,
    title: "Advanced AI Algorithm",
    description:
      "State-of-the-art machine learning models trained on millions of images to restore perfect clarity",
    badge: "AI-Powered",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast Processing",
    description:
      "Get professional results in under 30 seconds. No waiting, no delays - just instant transformation",
    badge: "Ultra Fast",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description:
      "Your images are processed securely and automatically deleted after 24 hours. Complete privacy guaranteed",
    badge: "Secure",
    color: "from-green-500 to-teal-500",
  },
];

const stats = [
  { icon: Upload, label: "Drag & Drop Upload", value: "Multiple Formats" },
  {
    icon: Download,
    label: "High Quality Output",
    value: "Original Resolution",
  },
  { icon: Clock, label: "Batch Processing", value: "Up to 10 Images" },
];

export default function ModernFeatures({
  className,
  ...props
}: React.ComponentProps<"section"> & ModernFeaturesProps) {
  return (
    <section
      className={cn("bg-background relative overflow-hidden py-24", className)}
      {...props}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, var(--primary) 2px, transparent 2px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Core Features
          </Badge>
          <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            Why Choose
            <span className="from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-transparent">
              {" "}
              ImageUnblur
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
            Experience the perfect combination of cutting-edge technology,
            speed, and reliability
          </p>
        </div>

        {/* Main features grid */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              style={{ background: "var(--gradient-card)" }}
            >
              <CardContent className="h-full p-8">
                <div className="space-y-6">
                  {/* Icon with gradient background */}
                  <div className="relative">
                    <div
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <Badge className="bg-primary text-primary-foreground absolute -top-2 -right-2">
                      {feature.badge}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="group-hover:text-primary mb-3 text-xl font-bold transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="from-primary/5 absolute inset-0 bg-gradient-to-r to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary features */}
        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-muted/50 hover:bg-muted flex items-center gap-4 rounded-2xl p-6 transition-colors duration-300"
            >
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                <stat.icon className="text-primary h-6 w-6" />
              </div>
              <div>
                <div className="text-foreground font-semibold">
                  {stat.label}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
