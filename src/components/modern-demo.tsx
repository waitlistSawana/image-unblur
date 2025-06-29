"use client";

import { cn } from "~/lib/utils";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Upload, Image, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ModernDemoProps {
  className?: string;
}

export default function ModernDemo({
  className,
  ...props
}: React.ComponentProps<"section"> & ModernDemoProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    startDemo();
  };

  const startDemo = () => {
    setIsProcessing(true);
    setProgress(0);
    setIsComplete(false);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsComplete(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const resetDemo = () => {
    setIsComplete(false);
    setProgress(0);
  };

  return (
    <section
      id="demo"
      className={cn("bg-muted/30 relative py-24", className)}
      {...props}
    >
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Try It Now
          </Badge>
          <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            See the Magic in
            <span className="from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-transparent">
              {" "}
              Action
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
            Upload a blurry image and watch our AI transform it into crystal
            clear perfection
          </p>
        </div>

        {/* Demo interface */}
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Upload area */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-0">
                <div
                  className={cn(
                    "from-muted to-muted/50 relative flex aspect-video items-center justify-center border-2 border-dashed bg-gradient-to-br transition-all duration-300",
                    isDragOver && "border-primary bg-primary/5",
                    isComplete &&
                      "border-green-500 bg-green-50 dark:bg-green-950",
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {!isComplete ? (
                    <div className="p-8 text-center">
                      <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                        <Upload className="text-primary h-8 w-8" />
                      </div>
                      <h3 className="mb-2 font-semibold">
                        Upload Your Blurry Image
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Drag and drop or click to select
                      </p>
                      <Button
                        variant="outline"
                        onClick={startDemo}
                        disabled={isProcessing}
                      >
                        <Image className="mr-2 h-4 w-4" />
                        Try Demo Image
                      </Button>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="mb-2 font-semibold">
                        Processing Complete!
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Your image has been enhanced
                      </p>
                      <Button onClick={resetDemo} variant="outline">
                        Try Another Image
                      </Button>
                    </div>
                  )}

                  {/* Processing overlay */}
                  {isProcessing && (
                    <div className="bg-background/90 absolute inset-0 flex items-center justify-center">
                      <div className="space-y-4 text-center">
                        <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
                        <div className="space-y-2">
                          <p className="font-medium">AI Processing...</p>
                          <Progress value={progress} className="w-64" />
                          <p className="text-muted-foreground text-sm">
                            {Math.round(progress)}% complete
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Arrow */}
            <div className="flex justify-center lg:justify-start">
              <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-full">
                <ArrowRight className="text-primary-foreground h-8 w-8" />
              </div>
            </div>

            {/* Result area */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-0">
                <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
                  {isComplete ? (
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="mb-2 font-semibold">
                        Crystal Clear Result
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Amazing detail restoration
                      </p>
                      <div className="flex justify-center gap-2">
                        <Badge variant="secondary">HD Quality</Badge>
                        <Badge variant="secondary">Original Size</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground p-8 text-center">
                      <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                        <Image className="h-8 w-8" />
                      </div>
                      <h3 className="mb-2 font-medium">Enhanced Result</h3>
                      <p className="text-sm">
                        Your processed image will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="h-auto bg-[var(--color-accent-orange)] px-8 py-6 text-lg text-white hover:bg-[var(--color-accent-orange)]/90"
              asChild
            >
              <a href="/image-deblur">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <p className="text-muted-foreground mt-3 text-sm">
              No registration required • Process up to 3 images free
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
