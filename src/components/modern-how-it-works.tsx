"use client";

import { cn } from "~/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Upload, Cpu, Download, ArrowDown } from "lucide-react";

interface ModernHowItWorksProps {
  className?: string;
}

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Image",
    description: "Simply drag and drop your blurry image or paste a URL. We support JPEG, PNG, GIF, and WebP formats up to 10MB.",
    color: "from-blue-500 to-purple-500",
    details: ["Drag & drop interface", "Multiple format support", "Secure upload process"]
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Processing",
    description: "Our advanced neural networks analyze your image and apply sophisticated deblurring algorithms to restore clarity and detail.",
    color: "from-purple-500 to-pink-500",
    details: ["Deep learning models", "Edge enhancement", "Noise reduction"]
  },
  {
    number: "03",
    icon: Download,
    title: "Download Result",
    description: "Get your crystal-clear image in seconds. Download in original resolution with enhanced details and improved sharpness.",
    color: "from-pink-500 to-orange-500",
    details: ["Original resolution", "Instant download", "Multiple formats"]
  }
];

export default function ModernHowItWorks({
  className,
  ...props
}: React.ComponentProps<"section"> & ModernHowItWorksProps) {
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
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Transform Images in
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> 3 Simple Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process makes it incredibly easy to enhance your images with professional results
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Timeline line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-24 w-0.5 h-32 bg-gradient-to-b from-primary to-purple-500 hidden md:block" />
              )}

              <div className="flex flex-col md:flex-row gap-8 mb-16 last:mb-0">
                {/* Step indicator */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-4 relative z-10`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <Card className="flex-1 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Main content */}
                      <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                          {step.description}
                        </p>

                        {/* Details */}
                        <div className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              <span className="text-sm text-muted-foreground">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Visual element */}
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${step.color} p-6 opacity-20`}
                        >
                          <step.icon className="w-full h-full text-white" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Arrow indicator for mobile */}
              {index < steps.length - 1 && (
                <div className="flex justify-center mb-8 md:hidden">
                  <ArrowDown className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who trust ImageUnblur for their image enhancement needs
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary">✓ No Installation Required</Badge>
              <Badge variant="secondary">✓ Privacy Protected</Badge>
              <Badge variant="secondary">✓ Professional Results</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
