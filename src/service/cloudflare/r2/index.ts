import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";

const ACCOUNT_ID = env.CLOUDFLARE_R2_ACCOUNT_ID;
const ACCESS_KEY_ID = env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

export const BUCKET_NAME = "unblur-image";
