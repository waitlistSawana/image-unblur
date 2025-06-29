import { LoadingTextToImageHeader } from "~/components/loading-text-to-image-header";
import { LoadingTextToImageForm } from "~/components/loading-text-to-image-form";
import { LoadingTextToImagePreview } from "~/components/loading-text-to-image-preview";

export default function TextToImageLoading() {
  return (
    <div className="mx-auto w-full" id="TextToImageLoading">
      <LoadingTextToImageHeader />

      <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4 md:flex-row">
        <LoadingTextToImageForm className="flex-2" />
        <LoadingTextToImagePreview className="flex-3" />
      </div>
    </div>
  );
}
