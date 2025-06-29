"use client";

import { cn } from "~/lib/utils";
import {
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Save,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { useState, useEffect } from "react";
import { saveImageToLocal } from "~/lib/image-cache";

interface ImageComparisonPreviewProps {
  className?: string;
  isLoading: boolean;
  originalImageUrl?: string;
  processedImageUrl?: string;
  status?: "processing" | "completed" | "failed";
  showComparison?: boolean;
  isDownloading?: boolean;
}

export default function ImageComparisonPreview({
  className,
  isLoading: _isLoading,
  originalImageUrl,
  processedImageUrl,
  status,
  showComparison,
  isDownloading = false,
  ...props
}: React.ComponentProps<"div"> & ImageComparisonPreviewProps) {
  const [progress, setProgress] = useState(0);

  // Simulate progress when processing
  useEffect(() => {
    if (status === "processing") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev; // Stop at 90% until actually complete
          return prev + Math.random() * 15;
        });
      }, 1500);

      return () => clearInterval(interval);
    } else if (status === "completed") {
      setProgress(100);
    } else if (status === "failed") {
      setProgress(0);
    }
  }, [status]);

  const handleDownload = (imageUrl: string, filename: string) => {
    try {
      saveImageToLocal(imageUrl, filename);
    } catch (error) {
      console.error("Failed to download image:", error);
      // Fallback to traditional download
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    if (isDownloading) {
      return "Caching image locally...";
    }

    switch (status) {
      case "processing":
        return "Processing your image...";
      case "completed":
        return "Image processing completed!";
      case "failed":
        return "Image processing failed";
      default:
        return "Upload an image to get started";
    }
  };

  return (
    <div className={cn("", className)} {...props}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Preview
          </CardTitle>
          <CardDescription>{getStatusText()}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Bar */}
          {(status === "processing" || isDownloading) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{isDownloading ? "Caching" : "Processing"}</span>
                <span>
                  {isDownloading ? "95%" : `${Math.round(progress)}%`}
                </span>
              </div>
              <Progress
                value={isDownloading ? 95 : progress}
                className="w-full"
              />
            </div>
          )}

          {/* Image Comparison */}
          {showComparison ? (
            <div className="space-y-4">
              {/* Original Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Original (Blurry)</h4>
                </div>
                <div className="relative">
                  <img
                    src={originalImageUrl}
                    alt="Original blurry image"
                    className="bg-muted max-h-64 w-full rounded-lg border object-contain"
                  />
                </div>
              </div>

              {/* Processed Image */}
              {processedImageUrl ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Enhanced (Clear)</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownload(processedImageUrl, "deblurred-image.jpg")
                      }
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Caching...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="relative">
                    <img
                      src={processedImageUrl}
                      alt="Processed clear image"
                      className="bg-muted max-h-64 w-full rounded-lg border object-contain"
                    />
                  </div>
                </div>
              ) : status === "processing" ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">
                    Enhanced (Processing...)
                  </h4>
                  <div className="bg-muted flex h-64 items-center justify-center rounded-lg border">
                    <div className="space-y-2 text-center">
                      <Loader2 className="text-muted-foreground mx-auto h-8 w-8 animate-spin" />
                      <p className="text-muted-foreground text-sm">
                        AI is enhancing your image
                      </p>
                    </div>
                  </div>
                </div>
              ) : status === "failed" ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-500">
                    Processing Failed
                  </h4>
                  <div className="flex h-64 items-center justify-center rounded-lg border border-red-200 bg-red-50">
                    <div className="space-y-2 text-center">
                      <XCircle className="mx-auto h-8 w-8 text-red-500" />
                      <p className="text-sm text-red-600">
                        Failed to process the image. Please try again.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            // Placeholder
            <div className="border-muted-foreground/25 flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
              <div className="space-y-2 text-center">
                <div className="text-muted-foreground">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground text-sm">
                  Your enhanced image will appear here
                </p>
              </div>
            </div>
          )}

          {/* Processing Info */}
          {status === "processing" && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-start gap-2">
                <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-blue-500" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">
                    Processing in progress
                  </p>
                  <p className="text-blue-700">
                    Our AI is analyzing and enhancing your image. This usually
                    takes 30-60 seconds.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Info */}
          {status === "completed" && processedImageUrl && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                <div className="text-sm">
                  <p className="font-medium text-green-900">
                    Enhancement completed!
                  </p>
                  <p className="text-green-700">
                    {isDownloading
                      ? "Caching image locally for offline viewing..."
                      : "Your image has been successfully deblurred and cached locally. Click download to save to your device."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cache Info */}
          {isDownloading && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-start gap-2">
                <Save className="mt-0.5 h-4 w-4 text-blue-500" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">
                    Caching for offline access
                  </p>
                  <p className="text-blue-700">
                    Saving image locally to ensure it remains available even
                    after the original link expires.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
