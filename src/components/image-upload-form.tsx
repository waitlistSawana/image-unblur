"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RotateCcw, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const imageUploadFormSchema = z.object({
  image_url: z.string().url("Please enter a valid image URL"),
});

interface ImageUploadFormProps {
  className?: string;
  isLoading: boolean;
  handleSubmit?: (imageUrl: string) => Promise<boolean> | boolean;
  onReset?: () => void;
  disabled?: boolean;
}

export default function ImageUploadForm({
  className,
  handleSubmit,
  onReset,
  isLoading,
  disabled,
  ...props
}: React.ComponentProps<"div"> & ImageUploadFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // 使用上传文件的mutation
  const uploadFileMutation = api.cloudflare.uploadFile.useMutation();

  const form = useForm<z.infer<typeof imageUploadFormSchema>>({
    resolver: zodResolver(imageUploadFormSchema),
    defaultValues: {
      image_url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof imageUploadFormSchema>) => {
    if (handleSubmit) {
      const success = await handleSubmit(values.image_url);
      if (success) {
        // Don't reset form to keep the preview
      }
    }
  };

  // 上传文件到R2并获取公共URL
  const uploadFileToR2 = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(10);
    setErrorDetails(null);

    try {
      // 检查文件大小
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size exceeds 10MB limit");
      }

      // 生成唯一文件名，添加时间戳以便后续清理（10分钟后自动过期）
      const timestamp = Date.now();
      // 生成唯一ID
      const uniqueId = Math.random().toString(36).substring(2, 10);
      const extension = file.name.split(".").pop() ?? "jpg";
      const filename = `uploads/${timestamp}-${uniqueId}.${extension}`;

      setUploadProgress(20);
      // toast.info("Preparing file for upload...");

      // 将文件转换为base64
      const fileContent = await readFileAsBase64(file);
      if (!fileContent) {
        throw new Error("Failed to read file content");
      }

      setUploadProgress(40);
      // toast.info("Uploading file to server...");
      console.log("Uploading file to server:", filename);

      try {
        // 通过服务器上传文件
        const publicUrl = await uploadFileMutation.mutateAsync({
          filename,
          fileContent,
          contentType: file.type,
        });

        console.log("Upload successful, public URL:", publicUrl);

        setUploadProgress(100);
        toast.success("File successfully uploaded!");
        return publicUrl;
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        if (uploadError instanceof Error) {
          setErrorDetails(uploadError.message);
          toast.error(`Upload error: ${uploadError.message}`);
        } else {
          setErrorDetails("Unknown upload error");
          toast.error("Upload error: Unknown error occurred");
        }
        throw uploadError;
      }
    } catch (error) {
      console.error("Upload process error:", error);
      if (error instanceof Error) {
        setErrorDetails(error.message);
        form.setError("image_url", {
          type: "manual",
          message: error.message,
        });
        toast.error(`Upload failed: ${error.message}`);
      } else {
        setErrorDetails("Unknown error");
        form.setError("image_url", {
          type: "manual",
          message: "Failed to upload image",
        });
        toast.error("Upload failed: Unknown error");
      }
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // 将文件读取为base64
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as base64"));
        }
      };
      reader.onerror = () => {
        reject(new Error(reader.error?.message ?? "Error reading file"));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        form.setError("image_url", {
          type: "manual",
          message: "Please select a valid image file",
        });
        toast.error("Invalid file type. Please select an image file.");
        return;
      }

      // 创建本地预览
      const url = URL.createObjectURL(file);
      setUploadedFile(file);
      setPreviewUrl(url);

      try {
        // toast.info(`Uploading ${file.name}...`);
        // 立即上传文件到R2并获取URL
        const publicUrl = await uploadFileToR2(file);

        // 将R2 URL设置到表单中
        form.setValue("image_url", publicUrl);
        form.clearErrors("image_url");
      } catch (error) {
        // 错误已在uploadFileToR2中处理
        console.error("Error uploading file:", error);
      }
    },
    [form],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (disabled) return;

      if (e.dataTransfer.files?.[0]) {
        void handleFileUpload(e.dataTransfer.files[0]);
      }
    },
    [disabled, handleFileUpload],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (e.target.files?.[0]) {
      void handleFileUpload(e.target.files[0]);
    }
  };

  const handleReset = () => {
    form.reset();
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setErrorDetails(null);
    onReset?.();
  };

  const handleUrlChange = (value: string) => {
    if (value !== previewUrl) {
      // User is typing a URL, clear file upload
      if (uploadedFile) {
        setUploadedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl("");
      }
    }
  };

  const isFormDisabled = disabled ?? isLoading ?? isUploading;

  return (
    <div className={cn("", className)} {...props}>
      <Form {...form}>
        <Card>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardHeader>
              <CardTitle>Image Deblur</CardTitle>
              <CardDescription>
                Upload a blurry image to enhance its clarity with AI
              </CardDescription>
            </CardHeader>

            <CardContent className="w-full space-y-4">
              {/* File Upload Area */}
              <div className="space-y-4">
                <div
                  className={cn(
                    "relative rounded-lg border-2 border-dashed p-6 text-center transition-colors",
                    dragActive
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground/25",
                    isFormDisabled && "cursor-not-allowed opacity-50",
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                    onChange={handleFileSelect}
                    accept="image/*"
                    disabled={isFormDisabled}
                  />

                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-muted-foreground h-8 w-8" />
                    <div className="text-sm">
                      <span className="font-medium">Click to upload</span> or
                      drag and drop
                    </div>
                    <div className="text-muted-foreground text-xs">
                      PNG, JPG, GIF up to 10MB
                    </div>
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && uploadProgress > 0 && (
                  <div className="w-full space-y-1">
                    <div className="text-muted-foreground text-center text-xs">
                      Uploading image... {uploadProgress}%
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Error Details */}
                {errorDetails && (
                  <div className="w-full">
                    <div className="text-destructive border-destructive rounded-md border p-2 text-xs">
                      <strong>Error Details:</strong> {errorDetails}
                    </div>
                  </div>
                )}

                {/* Preview */}
                {previewUrl && (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 w-full rounded-lg border object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleReset}
                      disabled={isFormDisabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">
                      Or use image URL
                    </span>
                  </div>
                </div>
              </div>

              {/* URL Input */}
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleUrlChange(e.target.value);
                        }}
                        disabled={isFormDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Example URLs */}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const exampleUrl =
                      "https://replicate.delivery/mgxm/e7a66188-34c6-483b-813f-be5c96a3952b/blurry-reds-0.jpg";
                    form.setValue("image_url", exampleUrl);
                    handleUrlChange(exampleUrl);
                  }}
                  disabled={isFormDisabled}
                >
                  Sample Blurry Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={isFormDisabled}
                >
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Reset
                </Button>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full cursor-pointer transition-all"
                disabled={
                  isLoading ??
                  isUploading ??
                  disabled ??
                  !form.watch("image_url")
                }
              >
                {isLoading || isUploading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    {isUploading ? "Uploading..." : "Processing..."}
                  </>
                ) : (
                  "Deblur Image"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Form>
    </div>
  );
}
