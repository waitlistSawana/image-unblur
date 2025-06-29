import ImageDeblur from "~/components/image-deblur";

export default async function ImageDeblurPage() {
  return (
    <div id="ImageDeblurPage">
      <div className="flex flex-col items-center justify-center gap-6 py-10 text-center">
        <h1 className="text-4xl font-bold">Image Deblur</h1>
        <p className="text-lg max-w-2xl text-muted-foreground">
          Transform your blurry photos into crystal-clear images using advanced AI technology.
          Upload any blurred image and watch as our AI enhances its clarity and detail.
        </p>
      </div>
      <ImageDeblur />
    </div>
  );
}
