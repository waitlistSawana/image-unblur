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
      setProgress(prev => {
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
      className={cn(
        "py-24 bg-muted/30 relative",
        className,
      )}
      {...props}
    >
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Try It Now
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            See the Magic in
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload a blurry image and watch our AI transform it into crystal clear perfection
          </p>
        </div>

        {/* Demo interface */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Upload area */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-0">
                <div
                  className={cn(
                    "relative aspect-video bg-gradient-to-br from-muted to-muted/50 border-2 border-dashed transition-all duration-300 flex items-center justify-center",
                    isDragOver && "border-primary bg-primary/5",
                    isComplete && "border-green-500 bg-green-50 dark:bg-green-950"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {!isComplete ? (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Upload Your Blurry Image</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop or click to select
                      </p>
                      <Button
                        variant="outline"
                        onClick={startDemo}
                        disabled={isProcessing}
                      >
                        <Image className="w-4 h-4 mr-2" />
                        Try Demo Image
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Processing Complete!</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your image has been enhanced
                      </p>
                      <Button onClick={resetDemo} variant="outline">
                        Try Another Image
                      </Button>
                    </div>
                  )}

                  {/* Processing overlay */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <div className="space-y-2">
                          <p className="font-medium">AI Processing...</p>
                          <Progress value={progress} className="w-64" />
                          <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Arrow */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>

            {/* Result area */}
            <Card className="relative overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 flex items-center justify-center">
                  {isComplete ? (
                    <div className="text-center p-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Crystal Clear Result</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Amazing detail restoration
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Badge variant="secondary">HD Quality</Badge>
                        <Badge variant="secondary">Original Size</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 text-muted-foreground">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <Image className="w-8 h-8" />
                      </div>
                      <h3 className="font-medium mb-2">Enhanced Result</h3>
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
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-[var(--color-accent-orange)] hover:bg-[var(--color-accent-orange)]/90 text-white text-lg px-8 py-6 h-auto"
              asChild
            >
              <a href="/image-deblur">
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              No registration required • Process up to 3 images free
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
