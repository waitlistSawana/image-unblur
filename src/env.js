import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    // Base
    BASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // Database
    DATABASE_URL: z.string().url(),
    // Clerk
    CLERK_SECRET_KEY: z.string().min(1),
    // Replicate
    REPLICATE_API_TOKEN: z.string().min(1),
    // Cloudflare
    CLOUDFLARE_R2_ACCOUNT_ID: z.string().min(1),
    CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1),
    // Stripe
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // Base
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    // Clerk 重定向 URLs
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().default("/"),
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().default("/"),
    // Cloudflare
    NEXT_PUBLIC_CLOUDFLARE_R2_URL: z.string().url(),
    // Stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    // Stripe - Plans Price Ids
    NEXT_PUBLIC_STRIPE_PLAN_BASIC_MONTHLY: z
      .string()
      .min(1)
      .startsWith("price_"),
    NEXT_PUBLIC_STRIPE_PLAN_BASIC_YEARLY: z
      .string()
      .min(1)
      .startsWith("price_"),
    NEXT_PUBLIC_STRIPE_PLAN_PRO_MONTHLY: z.string().min(1).startsWith("price_"),
    NEXT_PUBLIC_STRIPE_PLAN_PRO_YEARLY: z.string().min(1).startsWith("price_"),
    // Stripe - Packages Price Ids
    NEXT_PUBLIC_STRIPE_PACK_TRIAL_PACK: z.string().min(1).startsWith("price_"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // Base
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    // Database
    DATABASE_URL: process.env.DATABASE_URL,
    // Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    // Clerk 重定向 URLs
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
    // Replicate
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    // Cloudflare
    CLOUDFLARE_R2_ACCOUNT_ID: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
    CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY:
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    NEXT_PUBLIC_CLOUDFLARE_R2_URL: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL,
    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    // Stripe - Plans Price Ids
    NEXT_PUBLIC_STRIPE_PLAN_BASIC_MONTHLY:
      process.env.NEXT_PUBLIC_STRIPE_PLAN_BASIC_MONTHLY,
    NEXT_PUBLIC_STRIPE_PLAN_BASIC_YEARLY:
      process.env.NEXT_PUBLIC_STRIPE_PLAN_BASIC_YEARLY,
    NEXT_PUBLIC_STRIPE_PLAN_PRO_MONTHLY:
      process.env.NEXT_PUBLIC_STRIPE_PLAN_PRO_MONTHLY,
    NEXT_PUBLIC_STRIPE_PLAN_PRO_YEARLY:
      process.env.NEXT_PUBLIC_STRIPE_PLAN_PRO_YEARLY,
    // Stripe - Packages Price Ids
    NEXT_PUBLIC_STRIPE_PACK_TRIAL_PACK:
      process.env.NEXT_PUBLIC_STRIPE_PACK_TRIAL_PACK,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
