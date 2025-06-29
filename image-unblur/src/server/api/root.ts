import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { generateImageRouter } from "./routers/generateImage";
import { imageDeblurRouter } from "./routers/imageDeblur";
import { cloudflareRouter } from "./routers/cloudflare";
import { billingRouter } from "./routers/billing";
import { creditRouter } from "./routers/credit";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  generateImage: generateImageRouter,
  imageDeblur: imageDeblurRouter,
  cloudflare: cloudflareRouter,
  billing: billingRouter,
  credit: creditRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
