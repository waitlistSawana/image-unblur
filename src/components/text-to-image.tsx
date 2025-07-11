"use client";

import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import TextToImageForm, {
  type textToImageFormSchema,
} from "./text-to-image-form";
import TextToImagePreview from "./text-to-image-preview";
import type z from "zod";
import { useClerk } from "@clerk/nextjs";

export default function TextToImage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { openSignIn, isSignedIn } = useClerk();
  const trpcUtils = api.useUtils();

  const {
    mutate: generateImgeKontextProMutate,
    data,
    isPending,
  } = api.generateImage.kontextPro.useMutation({
    mutationKey: ["kontext-pro"],
    onSuccess() {
      toast.success("Generate image successfully!");
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

  const handleSubmit = async (
    values: z.infer<typeof textToImageFormSchema>,
  ) => {
    if (!isSignedIn) {
      openSignIn();
      return false;
    }

    generateImgeKontextProMutate({
      prompt: values.prompt,
      input_image: values.input_image ?? null,
      seed: values.seed ?? null,
      aspect_ratio: values.aspect_ratio,
      output_format: values.output_format,
    });
    return true;
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
        isLoading={isPending}
        handleSubmit={handleSubmit}
      />
      <TextToImagePreview
        className="flex-3"
        isLoading={isPending}
        generatedImageUrl={data}
      />
    </div>
  );
}
