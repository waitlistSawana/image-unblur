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
    description: "State-of-the-art machine learning models trained on millions of images to restore perfect clarity",
    badge: "AI-Powered",
    color: "from-purple-500 to-blue-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast Processing",
    description: "Get professional results in under 30 seconds. No waiting, no delays - just instant transformation",
    badge: "Ultra Fast",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your images are processed securely and automatically deleted after 24 hours. Complete privacy guaranteed",
    badge: "Secure",
    color: "from-green-500 to-teal-500"
  }
];

const stats = [
  { icon: Upload, label: "Drag & Drop Upload", value: "Multiple Formats" },
  { icon: Download, label: "High Quality Output", value: "Original Resolution" },
  { icon: Clock, label: "Batch Processing", value: "Up to 10 Images" }
];

export default function ModernFeatures({
  className,
  ...props
}: React.ComponentProps<"section"> & ModernFeaturesProps) {
  return (
    <section
      className={cn(
        "py-24 bg-background relative overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--primary) 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Core Features
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Why Choose
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> ImageUnblur</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the perfect combination of cutting-edge technology, speed, and reliability
          </p>
        </div>

        {/* Main features grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              style={{ background: "var(--gradient-card)" }}
            >
              <CardContent className="p-8 h-full">
                <div className="space-y-6">
                  {/* Icon with gradient background */}
                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                      {feature.badge}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary features */}
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
