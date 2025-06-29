import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { images, users } from "~/server/db/schema";
import { calculateRemainingCredits, hasEnoughCredits } from "~/lib/credit";
import { env } from "~/env";

// MagicAPI Deblurer schema
export const imageDeblurSchema = z.object({
  image_url: z
    .string()
    .url()
    .describe("URL of the blurred image to be processed"),
});

// API Response types
interface SubmitDeblurResponse {
  request_id: string;
}

interface DeblurStatusResponse {
  status: string;
  image_url?: string;
}

interface ApiErrorResponse {
  error: string;
}

// MagicAPI service functions
async function submitImageForDeblur(imageUrl: string): Promise<string> {
  const response = await fetch('https://api.market/magicapi/deblurer/process', {
    method: 'POST',
    headers: {
      'x-magicapi-key': env.MAGICAPI_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image_url: imageUrl
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as ApiErrorResponse;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to submit image for deblurring: ${errorData.error ?? response.statusText}`,
    });
  }

  const data = await response.json() as SubmitDeblurResponse;
  return data.request_id;
}

async function getDeblurResult(requestId: string): Promise<DeblurStatusResponse> {
  const response = await fetch(`https://api.market/magicapi/deblurer/${requestId}`, {
    headers: {
      'x-magicapi-key': env.MAGICAPI_KEY
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as ApiErrorResponse;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to get deblur result: ${errorData.error ?? response.statusText}`,
    });
  }

  return response.json() as Promise<DeblurStatusResponse>;
}



export const imageDeblurRouter = createTRPCRouter({
  // Submit image for deblurring
  submitDeblur: protectedProcedure
    .input(imageDeblurSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User session not found",
        });
      }

      const userId = ctx.session.userId;

      // Check if user has enough credits
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Define credit cost for deblurring (you can adjust this)
      const creditCost = 1;

      if (!hasEnoughCredits(user.creditBalance, creditCost)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient credits. Please purchase more credits to continue.",
        });
      }

      try {
        // Submit image to MagicAPI for deblurring
        const requestId = await submitImageForDeblur(input.image_url);

        // Deduct credits from user
        const newCreditBalance = calculateRemainingCredits(user.creditBalance, creditCost);
        await ctx.db
          .update(users)
          .set({ creditBalance: newCreditBalance })
          .where(eq(users.id, userId));

        // Save the request to database (optional, for tracking)
        const savedImage = await ctx.db.insert(images).values({
          userId: userId,
          prompt: `Image deblurring request`, // or store original image URL
          imageUrl: "", // Will be updated when processing is complete
          requestId: requestId,
          status: "processing",
        }).returning();

        return {
          success: true,
          requestId: requestId,
          imageId: savedImage[0]?.id,
          creditsRemaining: newCreditBalance,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to process image",
        });
      }
    }),

  // Check deblur status and get result - 公共 API，无需登录
  getDeblurStatus: publicProcedure
    .input(z.object({
      requestId: z.string(),
      imageId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const result = await getDeblurResult(input.requestId);

        // If processing is complete, update database status (no image storage needed)
        if (result.status === "completed" && input.imageId) {
          try {
            // Update the database record with completion status only
            await ctx.db
              .update(images)
              .set({
                status: "completed",
                // Don't store imageUrl since it expires in 10 minutes
              })
              .where(eq(images.id, input.imageId));
          } catch (dbError) {
            console.error("Failed to update database:", dbError);
            // Continue anyway, don't block the response
          }
        } else if (result.status === "failed" && input.imageId) {
          try {
            await ctx.db
              .update(images)
              .set({
                status: "failed",
              })
              .where(eq(images.id, input.imageId));
          } catch (dbError) {
            console.error("Failed to update database:", dbError);
          }
        }

        return {
          ...result,
          // Add expiration warning for frontend
          expires_in_minutes: result.status === "completed" ? 10 : undefined,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to get deblur status",
        });
      }
    }),

  // Get user's deblur history
  getDeblurHistory: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User session not found",
        });
      }

      const userId = ctx.session.userId;

      const userImages = await ctx.db.query.images.findMany({
        where: eq(images.userId, userId),
        limit: input.limit,
        offset: input.offset,
        orderBy: (images, { desc }) => [desc(images.createdAt)],
      });

      return userImages;
    }),
});
