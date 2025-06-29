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
    description:
      "Simply drag and drop your blurry image or paste a URL. We support JPEG, PNG, GIF, and WebP formats up to 10MB.",
    color: "from-blue-500 to-purple-500",
    details: [
      "Drag & drop interface",
      "Multiple format support",
      "Secure upload process",
    ],
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI Processing",
    description:
      "Our advanced neural networks analyze your image and apply sophisticated deblurring algorithms to restore clarity and detail.",
    color: "from-purple-500 to-pink-500",
    details: ["Deep learning models", "Edge enhancement", "Noise reduction"],
  },
  {
    number: "03",
    icon: Download,
    title: "Download Result",
    description:
      "Get your crystal-clear image in seconds. Download in original resolution with enhanced details and improved sharpness.",
    color: "from-pink-500 to-orange-500",
    details: ["Original resolution", "Instant download", "Multiple formats"],
  },
];

export default function ModernHowItWorks({
  className,
  ...props
}: React.ComponentProps<"section"> & ModernHowItWorksProps) {
  return (
    <section
      className={cn("bg-background relative overflow-hidden py-24", className)}
      {...props}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="bg-primary absolute top-1/4 left-10 h-32 w-32 rounded-full blur-3xl" />
        <div className="absolute right-10 bottom-1/4 h-40 w-40 rounded-full bg-purple-500 blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <div className="mb-20 text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            How It Works
          </Badge>
          <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            Transform Images in
            <span className="from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-transparent">
              {" "}
              3 Simple Steps
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
            Our streamlined process makes it incredibly easy to enhance your
            images with professional results
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto max-w-4xl">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Timeline line */}
              {index < steps.length - 1 && (
                <div className="from-primary absolute top-24 left-8 hidden h-32 w-0.5 bg-gradient-to-b to-purple-500 md:block" />
              )}

              <div className="mb-16 flex flex-col gap-8 last:mb-0 md:flex-row">
                {/* Step indicator */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${step.color} z-10 p-4`}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <Card className="flex-1 border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                  <CardContent className="p-8">
                    <div className="grid gap-6 md:grid-cols-3">
                      {/* Main content */}
                      <div className="md:col-span-2">
                        <h3 className="mb-4 text-2xl font-bold">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                          {step.description}
                        </p>

                        {/* Details */}
                        <div className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <div
                              key={detailIndex}
                              className="flex items-center gap-2"
                            >
                              <div className="bg-primary h-2 w-2 rounded-full" />
                              <span className="text-muted-foreground text-sm">
                                {detail}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Visual element */}
                      <div className="flex items-center justify-center">
                        <div
                          className={`h-24 w-24 rounded-2xl bg-gradient-to-br ${step.color} p-6 opacity-20`}
                        >
                          <step.icon className="h-full w-full text-white" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Arrow indicator for mobile */}
              {index < steps.length - 1 && (
                <div className="mb-8 flex justify-center md:hidden">
                  <ArrowDown className="text-primary h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="from-primary/10 border-primary/20 mx-auto max-w-2xl rounded-3xl border bg-gradient-to-r to-purple-500/10 p-8">
            <h3 className="mb-4 text-2xl font-bold">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of users who trust ImageUnblur for their image
              enhancement needs
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
