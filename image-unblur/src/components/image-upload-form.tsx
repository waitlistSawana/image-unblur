"use client";

import { cn } from "~/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Loader2, RotateCcw, X } from "lucide-react";
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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import CreditButton from "./credit-button";
import { useState, useCallback } from "react";

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

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      form.setError('image_url', {
        type: 'manual',
        message: 'Please select a valid image file'
      });
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setUploadedFile(file);
    setPreviewUrl(url);
    form.setValue('image_url', url);
    form.clearErrors('image_url');
  }, [form]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [disabled, handleFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;

    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleReset = () => {
    form.reset();
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
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
              <CardAction>
                <CreditButton />
              </CardAction>
            </CardHeader>

            <CardContent className="w-full space-y-4">
              {/* File Upload Area */}
              <div className="space-y-4">
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                    dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    onChange={handleFileSelect}
                    accept="image/*"
                    disabled={disabled}
                  />

                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 10MB
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full max-h-64 object-contain rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleReset}
                      disabled={disabled}
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
                    <span className="bg-background px-2 text-muted-foreground">
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
                        disabled={isLoading ?? disabled}
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
                    const exampleUrl = "https://example.com/blurry-photo.jpg";
                    form.setValue('image_url', exampleUrl);
                    handleUrlChange(exampleUrl);
                  }}
                  disabled={isLoading ?? disabled}
                >
                  Sample Blurry Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={isLoading ?? disabled}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full cursor-pointer transition-all"
                disabled={isLoading ?? disabled ?? !form.watch('image_url')}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Processing...
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
