import ImageDeblur from "~/components/image-deblur";
import { Badge } from "~/components/ui/badge";
import { Sparkles, Zap, ArrowRight } from "lucide-react";

export default async function ImageDeblurPage() {
  return (
    <div
      id="ImageDeblurPage"
      className="from-background via-muted/20 to-background relative min-h-screen bg-gradient-to-br"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="bg-primary absolute top-20 left-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="absolute right-20 bottom-20 h-80 w-80 rounded-full bg-purple-500 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center gap-8 py-16 text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Enhancement
          </Badge>

          <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
            Transform
            <span className="from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-transparent">
              {" "}
              Blurry Images{" "}
            </span>
            to Crystal Clear
          </h1>

          <p className="text-muted-foreground max-w-3xl text-xl md:text-2xl">
            Upload any blurred image and watch as our advanced AI technology
            enhances its clarity and detail in seconds
          </p>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="text-primary h-4 w-4" />
              <span>Lightning Fast Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-4 w-4" />
              <span>AI-Powered Enhancement</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="text-primary h-4 w-4" />
              <span>One-Click Download</span>
            </div>
          </div>
        </div>

        {/* Main Image Deblur Component */}
        <div className="container mx-auto px-6 pb-16">
          <ImageDeblur className="bg-card/50 border-border/50 rounded-2xl border p-8 shadow-2xl backdrop-blur-sm" />
        </div>

        {/* Additional Info Section */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <Sparkles className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">AI Enhancement</h3>
              <p className="text-muted-foreground">
                Our advanced AI algorithms analyze and enhance every pixel for
                maximum clarity
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <Zap className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Process images in 30-60 seconds with our optimized processing
                pipeline
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <ArrowRight className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Easy to Use</h3>
              <p className="text-muted-foreground">
                Simply upload your image and download the enhanced result
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
