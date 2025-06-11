import TextToImage from "~/components/text-to-image";

export default function TextToImagePage() {
  return (
    <div id="TextToImagePage">
      <div className="flex flex-col items-center justify-center gap-6 py-10 text-center">
        <h1 className="text-4xl font-bold">Text to Image</h1>
        <p className="text-lg">Generate an image from a text prompt.</p>
      </div>
      <TextToImage />
    </div>
  );
}
