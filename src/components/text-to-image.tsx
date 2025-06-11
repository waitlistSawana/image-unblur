"use client";

import { cn } from "~/lib/utils";
import TextToImageForm from "./text-to-image-form";
import TextToImagePreview from "./text-to-image-preview";
import { useState } from "react";

export default function TextToImage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);

  const testHandleSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 20000));
    setIsLoading(false);
  };

  return (
    <div
      className={cn(
        "mx-auto flex max-w-6xl flex-col gap-4 p-4 md:flex-row",
        className,
      )}
      {...props}
    >
      <TextToImageForm
        className="flex-2"
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        handleSubmit={testHandleSubmit}
      />
      <TextToImagePreview
        className="flex-3"
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        generatedImageUrl="https://images.unsplash.com/photo-1444084316824-dc26d6657664"
      />
    </div>
  );
}
