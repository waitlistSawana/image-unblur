"use client";

import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import ImageUploadForm from "./image-upload-form";
import ImageComparisonPreview from "./image-comparison-preview";
import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

// 定义API返回的类型
type DeblurStatus = "idle" | "processing" | "completed" | "failed";

export default function ImageDeblur({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // 暂时保留Clerk相关代码，但移除未使用的变量
  const {
    /* openSignIn, loaded, isSignedIn */
  } = useClerk();

  const {
    mutate: submitDeblurMutate,
    isPending: isSubmitting,
    data: submitData,
    isSuccess: isSubmitSuccess,
    reset: resetSubmit,
  } = api.imageDeblur.submitDeblur.useMutation({
    onSuccess(data) {
      toast.success("Image submitted for deblurring!");
      console.log("Submit success response:", data);
    },
    onError(error) {
      console.error("Submit error:", error);
      toast.error(error.data?.code ?? "Error", {
        description: error.message,
      });
    },
  });

  const {
    data: deblurResult,
    isLoading: isCheckingStatus,
    // 移除未使用的变量
    // isSuccess: isStatusSuccess,
  } = api.imageDeblur.getDeblurStatus.useQuery(
    {
      requestId: submitData?.requestId ?? "",
    },
    {
      enabled: isSubmitSuccess && !!submitData?.requestId,
      refetchInterval: 3000,
    },
  );

  // 使用useEffect处理状态变化和通知
  useEffect(() => {
    if (!deblurResult) return;

    // 当状态变为completed时显示成功消息
    if (deblurResult.status === "completed" && deblurResult.image_url) {
      const message = "Image deblurring completed!";
      const description = deblurResult.expires_in_minutes
        ? `Result expires in ${deblurResult.expires_in_minutes} minutes.`
        : undefined;
      toast.success(message, { description });
    }

    // 当状态变为failed时显示错误消息
    if (deblurResult.status === "failed") {
      toast.error(
        `Image deblurring failed: ${deblurResult.error ?? "Unknown error"}. Please try again.`,
      );
    }
  }, [deblurResult]);

  const handleSubmit = async (imageUrl: string) => {
    // 暂时关闭检查登录，留着
    // if (!loaded || !isSignedIn) {
    //   openSignIn();
    //   return false;
    // }

    console.log("Submitting image for deblurring:", imageUrl);
    submitDeblurMutate({ image_url: imageUrl });
    return true;
  };

  const handleReset = () => {
    console.log("Resetting deblur process");
    resetSubmit();
  };

  // Derived state
  const isLoading = isSubmitting || isCheckingStatus;
  const showComparison = isSubmitSuccess && !!submitData?.originalUrl;

  // 只有当有提交成功且deblurResult状态为processing时，才认为是处理中
  const isProcessing = isSubmitSuccess && deblurResult?.status === "processing";

  // 状态计算
  let status: DeblurStatus = "idle";
  if (isSubmitSuccess) {
    status = (deblurResult?.status as DeblurStatus) ?? "processing";
  }

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
        originalImageUrl={submitData?.originalUrl}
        processedImageUrl={deblurResult?.image_url}
        status={status}
        showComparison={showComparison}
        isDownloading={false}
      />
    </div>
  );
}
