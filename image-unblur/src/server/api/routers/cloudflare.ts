import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BUCKET_NAME, S3 } from "~/service/cloudflare/r2/indext";

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

  getUploadPresignedUrl: protectedProcedure
    .input(z.object({ filename: z.string() }))
    .query(async ({ input }) => {
      const { filename } = input;

      const url = await getSignedUrl(
        S3,
        new PutObjectCommand({ Bucket: BUCKET_NAME, Key: filename }),
        { expiresIn: 60 * 10 },
      );

      return url;
    }),
});
