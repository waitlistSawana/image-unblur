import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const blackForestLabsKontextProSchema = z.object({
  prompt: z
    .string()
    .describe(
      "Text description of what you want to generate, or the instruction on how to edit the given image.",
    ),
  input_image: z
    .string()
    .url()
    .nullable()
    .optional()
    .describe("Image to use as reference. Must be jpeg, png, gif, or webp."),
  aspect_ratio: z
    .enum([
      "match_input_image",
      "1:1",
      "16:9",
      "9:16",
      "4:3",
      "3:4",
      "3:2",
      "2:3",
      "4:5",
      "5:4",
      "21:9",
      "9:21",
      "2:1",
      "1:2",
    ])
    .default("match_input_image")
    .describe(
      "Aspect ratio of the generated image. Use 'match_input_image' to match the aspect ratio of the input image.",
    ),
  seed: z
    .number()
    .int()
    .nullable()
    .describe("Random seed. Set for reproducible generation"),
  output_format: z
    .enum(["jpg", "png"])
    .default("png")
    .describe("Output format for the generated image"),
  safety_tolerance: z
    .number()
    .int()
    .min(0)
    .max(6)
    .default(2)
    .describe(
      "Safety tolerance, 0 is most strict and 6 is most permissive. 2 is currently the maximum allowed when input images are used.",
    ),
});
export type BlackForestLabsKontextPro = z.infer<
  typeof blackForestLabsKontextProSchema
>;

export const generateImageRouter = createTRPCRouter({
  kontextPro: protectedProcedure
    .input(blackForestLabsKontextProSchema)
    .mutation(async ({ ctx, input }) => {
      const { clerkId } = ctx;

      const user = await ctx.db.query.users.findFirst({
        where: (user, { eq }) => eq(user.clerkId, clerkId),
        columns: {
          id: true,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found: please sync user at [/onboarding] page.",
        });
      }

      // TODO: 校验积分

      // 1. generate image - replicate
      const replicateInput: BlackForestLabsKontextPro = {
        prompt: input.prompt,
        aspect_ratio: input.aspect_ratio,
        seed: input.seed,
        output_format: input.output_format,
        safety_tolerance: input.safety_tolerance,
        ...(input.input_image && { input_image: input.input_image }),
      };

      // const output = await replicate.run("black-forest-labs/flux-kontext-pro", {
      //   input: replicateInput,
      // });

      // // 2. save image - cloudlare r2
      // const outputs = Array.isArray(output)
      //   ? (output as FileOutput[])
      //   : ([output] as FileOutput[]);

      // const uploadedImages: {
      //   url: string;
      //   size: number;
      //   contentType: string | null;
      //   filename: string;
      //   fullFilename: string;
      // }[] = [];

      // for (const output of outputs) {
      //   const url = output.url();
      //   const blob = await output.blob();

      //   const contentType = await getContentTypeFromUrlAndBlob(url, blob);
      //   const size = blob.size;

      //   const filename = url.pathname.split("/").pop() ?? `${Date.now()}`;
      //   const fullFilename = `${clerkId}/${filename}`;

      //   const uploadUrl = await getSignedUrl(
      //     S3,
      //     new PutObjectCommand({ Bucket: BUCKET_NAME, Key: fullFilename }),
      //     { expiresIn: 60 * 10 },
      //   );

      //   const uploadResponse = await fetch(uploadUrl, {
      //     method: "PUT",
      //     body: blob,
      //     ...(contentType && {
      //       headers: {
      //         "Content-Type": contentType,
      //       },
      //     }),
      //   });

      //   // TODO: 上传失败后的重试操作

      //   if (!uploadResponse.ok) {
      //     console.error({ uploadResponse });

      //     throw new TRPCError({
      //       code: "INTERNAL_SERVER_ERROR",
      //       message: `Failed to upload image: ${uploadResponse.status} - ${uploadResponse.statusText}`,
      //     });
      //   }

      //   // record uploaded image
      //   uploadedImages.push({
      //     url: url.href,
      //     size,
      //     contentType,
      //     filename,
      //     fullFilename,
      //   });
      // }

      // // 3. save to database
      // const savedImages: string[] = [];

      // // TODO: 循环改到 语句内 传入数组 values
      // // TODO：上传失败的重试处理
      // // TODO：shape - aspect_ratio
      // for (const image of uploadedImages) {
      //   const imageUrl = `${env.NEXT_PUBLIC_CLOUDFLARE_R2_URL}/${image.fullFilename}`;

      //   await ctx.db.insert(images).values({
      //     clerkId: clerkId,
      //     userId: user.id,
      //     name: `${image.filename.split(".").shift()}_${Date.now()}`,
      //     url: imageUrl,
      //     displayStatus: "public",
      //     size: BigInt(image.size),
      //     uploadStatus: "completed",
      //   });

      //   savedImages.push(imageUrl);
      // }

      // 4. return image url
      // return savedImages;
      return [
        "https://pub-7a337e316c9a498aafa764c221c1a7d8.r2.dev/user_2yHQq73CeeXmrNdZ9hFTin30zIK/tmpndy8osoq.jpg",
      ];
    }),
});

async function getContentTypeFromUrlAndBlob(url: URL, blob: Blob) {
  // 1. 首先尝试从 Blob 获取
  if (blob.type) {
    return blob.type;
  }

  // 2. 如果 Blob 没有类型信息，从 URL 扩展名推断
  const contentTypeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    // 其他类型...
  };
  const extension = url.pathname.split(".").pop()?.toLowerCase();
  if (extension && contentTypeMap[extension]) {
    return contentTypeMap[extension];
  }

  // 3. 如果以上方法都失败，尝试发送 HEAD 请求
  try {
    const response = await fetch(url.toString(), { method: "HEAD" });
    const serverContentType = response.headers.get("Content-Type");
    if (serverContentType) {
      return serverContentType;
    }
  } catch (error) {
    console.error("获取 Content-Type 失败:", error);
  }

  // 4. 默认返回空
  return null;
}
