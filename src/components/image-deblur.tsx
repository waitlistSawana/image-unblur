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
  deblurRequestId?: string;
  original_url: string;
  processed_url?: string;
  local_processed_url?: string; // 本地缓存的 blob URL
  status: "processing" | "completed" | "failed";
  isDownloading?: boolean; // 是否正在下载缓存
}



export default function ImageDeblur({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { openSignIn, isSignedIn } = useClerk();
  const [currentResult, setCurrentResult] = useState<DeblurResult | null>(null);
  const trpcUtils = api.useUtils();

  const { mutate: submitDeblurMutate, isPending: isSubmitting } =
    api.imageDeblur.submitDeblur.useMutation({
      onSuccess(data) {
        toast.success("Image submitted for deblurring!");

        // Set initial result state
        setCurrentResult({
          requestId: data.requestId,
          deblurRequestId: data.deblurRequestId,
          original_url: "", // Will be set by form
          status: "processing",
        });
      },
      onError(error) {
        const code = error.data?.code;
        const message = error.message;

        toast.error(code, {
          description: message,
        });
      },
      onSettled() {
        void trpcUtils.credit.getUserCredit.invalidate();
      },
    });

  const { data: statusData, isLoading: isCheckingStatus } =
    api.imageDeblur.getDeblurStatus.useQuery(
      {
        requestId: currentResult?.requestId ?? "",
        deblurRequestId: currentResult?.deblurRequestId,
      },
      {
        enabled:
          !!currentResult?.requestId && currentResult.status === "processing",
        refetchInterval: () => {
          // Stop polling if completed or failed
          if (
            statusData?.status === "completed" ||
            statusData?.status === "failed"
          ) {
            return false;
          }
          return 3000; // Poll every 3 seconds
        },
      },
    );

  // Handle status data changes
  useEffect(() => {
    if (statusData && currentResult?.requestId) {
      if (statusData.status === "completed" && statusData.image_url) {
        // 立即开始下载和缓存图片
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

        // 异步下载和缓存图片
        const cacheKey = `deblurred-${currentResult.requestId}`;
        downloadAndCacheImage(statusData.image_url, cacheKey)
          .then((localUrl) => {
            setCurrentResult((prev) =>
              prev
                ? {
                    ...prev,
                    local_processed_url: localUrl,
                    isDownloading: false,
                  }
                : null,
            );

            if (statusData.expires_in_minutes) {
              toast.success(
                `Image deblurring completed! Cached locally for offline viewing.`,
                {
                  description: `Original link expires in ${statusData.expires_in_minutes} minutes.`,
                },
              );
            } else {
              toast.success(
                "Image deblurring completed and cached locally!",
              );
            }
          })
          .catch((error) => {
            console.error("Failed to cache image:", error);
            setCurrentResult((prev) =>
              prev
                ? {
                    ...prev,
                    isDownloading: false,
                  }
                : null,
            );
            toast.success("Image deblurring completed!", {
              description: "Image caching failed, but result is available.",
            });
          });
      } else if (statusData.status === "failed") {
        setCurrentResult((prev) =>
          prev
            ? {
                ...prev,
                status: "failed",
              }
            : null,
        );
        toast.error("Image deblurring failed. Please try again.");
      }
    }
  }, [statusData, currentResult?.requestId]);

  const handleSubmit = async (imageUrl: string) => {
    if (!isSignedIn) {
      openSignIn();
      return false;
    }

    // Reset current result and clear any cached URLs
    setCurrentResult({
      requestId: "",
      original_url: imageUrl,
      status: "processing",
    });

    submitDeblurMutate({
      image_url: imageUrl,
    });

    return true;
  };

  const handleReset = () => {
    setCurrentResult(null);
  };

  const _isLoading =
    isSubmitting || isCheckingStatus || Boolean(currentResult?.isDownloading);
  const showComparison = currentResult?.original_url;
  const isProcessing = currentResult?.status === "processing";

  // 优先使用本地缓存的图片URL
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
        isLoading={_isLoading}
        handleSubmit={handleSubmit}
        onReset={handleReset}
        disabled={isProcessing}
      />
      <ImageComparisonPreview
        className="flex-3"
        isLoading={_isLoading}
        originalImageUrl={currentResult?.original_url}
        processedImageUrl={displayProcessedUrl}
        status={currentResult?.status}
        showComparison={!!showComparison}
        isDownloading={currentResult?.isDownloading}
      />
    </div>
  );
}
