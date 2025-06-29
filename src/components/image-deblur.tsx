"use client";

import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import ImageUploadForm from "./image-upload-form";
import ImageComparisonPreview from "./image-comparison-preview";
import { useClerk } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { downloadAndCacheImage } from "~/lib/image-cache";

interface DeblurResult {
  requestId: string;
  original_url: string;
  processed_url?: string;
  local_processed_url?: string;
  status: "processing" | "completed" | "failed";
  isDownloading?: boolean;
  error?: string;
}

export default function ImageDeblur({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { openSignIn, loaded, isSignedIn } = useClerk();
  const [currentResult, setCurrentResult] = useState<DeblurResult | null>(null);

  const { mutate: submitDeblurMutate, isPending: isSubmitting } =
    api.imageDeblur.submitDeblur.useMutation({
      onSuccess(data) {
        toast.success("Image submitted for deblurring!");
        console.log("Submit success response:", data);
        setCurrentResult({
          requestId: data.requestId,
          original_url: data.originalUrl,
          status: "processing",
        });
      },
      onError(error) {
        console.error("Submit error:", error);
        toast.error(error.data?.code ?? "Error", {
          description: error.message,
        });
      },
    });

  const { data: statusData, isLoading: isCheckingStatus } =
    api.imageDeblur.getDeblurStatus.useQuery(
      {
        requestId: currentResult?.requestId ?? "",
      },
      {
        enabled:
          !!currentResult?.requestId && currentResult.status === "processing",
        refetchInterval: 3000,
      },
    );

  // Handle status data changes
  useEffect(() => {
    if (!statusData || !currentResult?.requestId) return;

    console.log("Status update received:", statusData);

    // Stop refetching if completed or failed
    if (statusData.status === "completed" || statusData.status === "failed") {
      // 停止轮询，不使用cancel
    }

    if (statusData.status === "completed" && statusData.image_url) {
      handleCompletedStatus({
        image_url: statusData.image_url,
        expires_in_minutes: statusData.expires_in_minutes,
      });
    } else if (statusData.status === "failed") {
      setCurrentResult((prev) =>
        prev
          ? {
              ...prev,
              status: "failed",
              error: statusData.error ?? "Unknown error",
            }
          : null,
      );
      toast.error(
        `Image deblurring failed: ${statusData.error ?? "Unknown error"}. Please try again.`,
      );
    }
  }, [statusData, currentResult?.requestId]);

  const handleCompletedStatus = (statusData: {
    image_url: string;
    expires_in_minutes?: number;
  }) => {
    if (!currentResult) return;

    console.log("Processing completed with image URL:", statusData.image_url);

    // Update state to show we're downloading
    setCurrentResult((prev) =>
      prev
        ? {
            ...prev,
            processed_url: statusData.image_url,
            status: "completed",
            isDownloading: true,
          }
        : null,
    );

    // Cache the image
    const cacheKey = `deblurred-${currentResult.requestId}`;
    void downloadAndCacheImage(statusData.image_url, cacheKey)
      .then((localUrl) => {
        console.log("Image cached locally at:", localUrl);
        setCurrentResult((prev) =>
          prev
            ? {
                ...prev,
                local_processed_url: localUrl,
                isDownloading: false,
              }
            : null,
        );

        const message = "Image deblurring completed and cached locally!";
        const description = statusData.expires_in_minutes
          ? `Original link expires in ${statusData.expires_in_minutes} minutes.`
          : undefined;

        toast.success(message, { description });
      })
      .catch((error) => {
        console.error("Failed to cache image:", error);
        setCurrentResult((prev) =>
          prev ? { ...prev, isDownloading: false } : null,
        );
        toast.success("Image deblurring completed!", {
          description: "Image caching failed, but result is available.",
        });
      });
  };

  const handleSubmit = async (imageUrl: string) => {
    // 暂时关闭检查登录，留着
    // if (!loaded || !isSignedIn) {
    //   openSignIn();
    //   return false;
    // }

    console.log("Submitting image for deblurring:", imageUrl);
    setCurrentResult({
      requestId: "",
      original_url: imageUrl,
      status: "processing",
    });

    submitDeblurMutate({ image_url: imageUrl });
    return true;
  };

  const handleReset = () => {
    console.log("Resetting deblur process");
    setCurrentResult(null);
  };

  // Derived state
  const isLoading =
    isSubmitting || isCheckingStatus || Boolean(currentResult?.isDownloading);
  const showComparison = Boolean(currentResult?.original_url);
  const isProcessing = currentResult?.status === "processing";
  const displayProcessedUrl =
    currentResult?.local_processed_url ?? currentResult?.processed_url;

  return (
    <div
      className={cn(
        "mx-auto flex max-w-6xl flex-col gap-4 p-4 md:flex-row",
        className,
      )}
      {...props}
    >
      <ImageUploadForm
        className="flex-2"
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        onReset={handleReset}
        disabled={isProcessing}
      />
      <ImageComparisonPreview
        className="flex-3"
        isLoading={isLoading}
        originalImageUrl={currentResult?.original_url}
        processedImageUrl={displayProcessedUrl}
        status={currentResult?.status}
        showComparison={showComparison}
        isDownloading={currentResult?.isDownloading}
      />
    </div>
  );
}
