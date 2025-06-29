import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BUCKET_NAME, S3 } from "~/service/cloudflare/r2";
import { TRPCError } from "@trpc/server";

export const cloudflareRouter = createTRPCRouter({
  getDownloadPresignedUrl: protectedProcedure
    .input(z.object({ filename: z.string() }))
    .query(async ({ input }) => {
      const { filename } = input; // eg. dog.png new/dog.png

      const url = await getSignedUrl(
        S3,
        new GetObjectCommand({ Bucket: BUCKET_NAME, Key: filename }),
        { expiresIn: 60 * 10 },
      );

      return url;
    }),

  getUploadPresignedUrl: publicProcedure
    .input(z.object({ filename: z.string() }))
    .mutation(async ({ input }) => {
      const { filename } = input;

      const url = await getSignedUrl(
        S3,
        new PutObjectCommand({ Bucket: BUCKET_NAME, Key: filename }),
        { expiresIn: 60 * 10 },
      );

      return url;
    }),

  uploadFile: publicProcedure
    .input(
      z.object({
        filename: z.string(),
        fileContent: z.string(), // base64编码的文件内容
        contentType: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const { filename, fileContent, contentType } = input;

        // 解码base64
        const buffer = Buffer.from(
          fileContent.replace(/^data:image\/\w+;base64,/, ""),
          "base64",
        );

        console.log(
          `Uploading file ${filename} to R2, size: ${buffer.length} bytes`,
        );

        // 直接使用S3客户端上传文件
        await S3.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: buffer,
            ContentType: contentType,
          }),
        );

        // 构建公共访问URL
        const r2PublicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL;
        if (!r2PublicUrl) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Missing R2 public URL in environment variables",
          });
        }

        const publicUrl = `${r2PublicUrl}/${filename}`;
        return publicUrl;
      } catch (error) {
        console.error("Error uploading file to R2:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to upload file",
        });
      }
    }),
});
