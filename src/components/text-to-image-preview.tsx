"use client";

import { cn } from "~/lib/utils";

import { Download, Loader2, Repeat, Share2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";

interface TextToImagePreviewProps {
  className?: string;
  isLoading: boolean;
  generatedImageUrl?: string[];
  onRegenerate?: () => void;
}

export default function TextToImagePreview({
  className,
  isLoading,
  generatedImageUrl,
  onRegenerate,
  ...props
}: React.ComponentProps<"div"> & TextToImagePreviewProps) {
  return (
    <div className={cn("", className)} {...props}>
      {isLoading ? (
        <LoadingPreview />
      ) : generatedImageUrl ? (
        <ResultPreview
          imageUrl={generatedImageUrl}
          onRegenerate={onRegenerate}
        />
      ) : (
        <DefaultPreview />
      )}
    </div>
  );
}

const DefaultPreview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Text to Image</CardTitle>
        <CardDescription>
          <p>This is a preview of the image that will be generated.</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-background rounded-lg border p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="col-span-3 space-y-4 md:col-span-3">
              <div className="flex items-baseline justify-start gap-2 rounded-lg border bg-blue-50 p-3 transition-all dark:bg-blue-950">
                <p className="text-center font-medium">1. </p>
                <p className="text-muted-foreground text-center text-sm">
                  Enter your text prompt
                </p>
              </div>
              <div className="flex flex-row items-baseline justify-start gap-2 rounded-lg border bg-purple-50 p-3 transition-all dark:bg-purple-950">
                <p className="text-center font-medium">2.</p>
                <p className="text-muted-foreground text-center text-sm">
                  Customize settings
                </p>
              </div>
              <div className="flex flex-row items-baseline justify-start gap-2 rounded-lg border bg-green-50 p-3 transition-all dark:bg-green-950">
                <p className="text-center font-medium">3.</p>
                <p className="text-muted-foreground text-center text-sm">
                  Generate your image
                </p>
              </div>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <div className="h-full w-full rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50 p-4 shadow-sm dark:from-blue-950 dark:to-purple-950">
                <div className="flex h-full flex-col items-center justify-center">
                  <Sparkles className="mb-2 h-8 w-8 text-purple-500" />
                  <p className="text-center text-sm font-medium">
                    Create stunning images with AI
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative h-[300px] w-full overflow-hidden rounded-lg border md:h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1470217957101-da7150b9b681?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Default AI generated image preview"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingPreview = () => {
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setStartTime(Date.now());
    setProgress(3); // Start at 3%

    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsedSeconds = (currentTime - startTime) / 1000;

      if (elapsedSeconds < 1) {
        // First second: stay at 3%
        return 3;
      } else if (elapsedSeconds < 3) {
        // From 1s to 3s: gradually increase to 10%
        const ratio = (elapsedSeconds - 1) / 2; // 0 to 1 over 2 seconds
        return 3 + ratio * 7; // 3% to 10%
      } else if (elapsedSeconds < 4) {
        // From 3s to 4s: stay at 10%
        return 10;
      } else {
        // After 4s: gradually increase to 90% and stay there
        const ratio = Math.min((elapsedSeconds - 4) / 10, 1); // 0 to 1 over 10 seconds, max at 1
        return 10 + ratio * 80; // 10% to 90%
      }
    };

    const timer = setInterval(() => {
      const newProgress = updateProgress();
      setProgress(Math.round(newProgress));
    }, 100);

    return () => clearInterval(timer);
    // TODO: 依赖数组 放入 setStartTime 或 setProgress
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text to Image</CardTitle>
        <CardDescription>
          <p>Your image is being generated. Please wait...</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="flex justify-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
            <div className="bg-background absolute inset-0 flex flex-col items-center justify-center">
              <Loader2 className="text-primary mb-4 h-16 w-16 animate-spin" />
              <div className="w-3/4 space-y-2">
                <Progress value={progress} className="h-2 w-full" />
                <p className="text-muted-foreground text-center text-sm">
                  Generating your image...
                </p>
              </div>
              <p className="mt-4 max-w-md px-4 text-center text-sm">
                Our AI is working on your masterpiece. This may take a few
                moments.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ResultPreview = ({
  imageUrl,
  onRegenerate,
}: {
  imageUrl: string[];
  onRegenerate?: () => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Text to Image</CardTitle>
        <CardDescription>
          <p>Your image has been generated successfully!</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {imageUrl.map((url, index) => (
          <div key={url + index} className="flex justify-center">
            <div className="relative w-full overflow-hidden rounded-lg border">
              <img
                src={url}
                alt="AI generated image"
                className="h-full w-full"
              />

              <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex justify-center gap-2">
                  <Button variant="secondary" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  {onRegenerate && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onRegenerate}
                    >
                      <Repeat className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
