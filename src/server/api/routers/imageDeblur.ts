import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { deblurRequests, users } from "~/server/db/schema";
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
  error?: string;
}

interface ApiErrorResponse {
  error: string;
}

// MagicAPI service functions
async function submitImageForDeblur(imageUrl: string): Promise<string> {
  const response = await fetch("https://api.market/magicapi/deblurer/process", {
    method: "POST",
    headers: {
      "x-magicapi-key": env.MAGICAPI_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: imageUrl,
    }),
  });

  if (!response.ok) {
    const errorData = (await response
      .json()
      .catch(() => ({ error: "Unknown error" }))) as ApiErrorResponse;
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to submit image for deblurring: ${errorData.error ?? response.statusText}`,
    });
  }

  const data = (await response.json()) as SubmitDeblurResponse;
  return data.request_id;
}

async function getDeblurResult(
  requestId: string,
): Promise<DeblurStatusResponse> {
  const response = await fetch(
    `https://api.market/magicapi/deblurer/${requestId}`,
    {
      headers: {
        "x-magicapi-key": env.MAGICAPI_KEY,
      },
    },
  );

  if (!response.ok) {
    const errorData = (await response
      .json()
      .catch(() => ({ error: "Unknown error" }))) as ApiErrorResponse;
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
      const clerkId = ctx.clerkId;

      if (!clerkId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User session not found",
        });
      }

      // Check if user has enough credits
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Define credit cost for deblurring (you can adjust this)
      const creditCost = 1;

      if (
        !hasEnoughCredits(user.credit ?? 0, user.bonusCredit ?? 0, creditCost)
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Insufficient credits. Please purchase more credits to continue.",
        });
      }

      try {
        // Submit image to MagicAPI for deblurring
        const requestId = await submitImageForDeblur(input.image_url);

        // Deduct credits from user
        const newCreditBalance = calculateRemainingCredits(
          user.credit ?? 0,
          user.bonusCredit ?? 0,
          creditCost,
        );
        await ctx.db
          .update(users)
          .set({
            credit: newCreditBalance.credit,
            bonusCredit: newCreditBalance.bonusCredit,
          })
          .where(eq(users.clerkId, clerkId));

        // Save the deblur request to database for tracking
        const savedRequest = await ctx.db
          .insert(deblurRequests)
          .values({
            userId: user.id,
            clerkId: clerkId,
            requestId: requestId,
            status: "processing",
            originalImageUrl: input.image_url,
            creditsCost: creditCost,
            processingStartedAt: new Date(),
          })
          .returning();

        return {
          success: true,
          requestId: requestId,
          deblurRequestId: savedRequest[0]?.id,
          creditsRemaining: newCreditBalance,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to process image",
        });
      }
    }),

  // Check deblur status and get result - 公共 API，无需登录
  getDeblurStatus: publicProcedure
    .input(
      z.object({
        requestId: z.string(),
        deblurRequestId: z.string().uuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        // Get result from MagicAPI
        const result = await getDeblurResult(input.requestId);

        // Find the deblur request in our database
        const dbRequest = await ctx.db.query.deblurRequests.findFirst({
          where: eq(deblurRequests.requestId, input.requestId),
        });

        if (!dbRequest) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Deblur request not found in database",
          });
        }

        // Update database status based on API result
        if (result.status === "completed" && result.image_url) {
          try {
            const expirationTime = new Date();
            expirationTime.setMinutes(expirationTime.getMinutes() + 10); // Expires in 10 minutes

            await ctx.db
              .update(deblurRequests)
              .set({
                status: "completed",
                processedImageUrl: result.image_url,
                processingCompletedAt: new Date(),
                expiresAt: expirationTime,
              })
              .where(eq(deblurRequests.requestId, input.requestId));
          } catch (dbError) {
            console.error("Failed to update database:", dbError);
            // Continue anyway, don't block the response
          }
        } else if (result.status === "failed") {
          try {
            await ctx.db
              .update(deblurRequests)
              .set({
                status: "failed",
                errorMessage: result.error ?? "Processing failed",
                processingCompletedAt: new Date(),
              })
              .where(eq(deblurRequests.requestId, input.requestId));
          } catch (dbError) {
            console.error("Failed to update database:", dbError);
          }
        }

        return {
          ...result,
          original_url: dbRequest.originalImageUrl,
          // Add expiration warning for frontend
          expires_in_minutes: result.status === "completed" ? 10 : undefined,
          warning: result.status === "completed"
            ? "Processed image URL expires in 10 minutes. Download or cache locally."
            : undefined,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to get deblur status",
        });
      }
    }),

  // Get user's deblur history
  getDeblurHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.clerkId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User session not found",
        });
      }

      const clerkId = ctx.clerkId;

      const userRequests = await ctx.db.query.deblurRequests.findMany({
        where: eq(deblurRequests.clerkId, clerkId),
        limit: input.limit,
        offset: input.offset,
        orderBy: (deblurRequests, { desc }) => [desc(deblurRequests.createdAt)],
      });

      return userRequests;
    }),

  // Add cleanup method for expired requests
  cleanupExpiredRequests: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (!ctx.clerkId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User session not found",
        });
      }

      try {
        // Clean up requests where processedImageUrl has expired
        const now = new Date();
        await ctx.db
          .update(deblurRequests)
          .set({
            processedImageUrl: null,
          })
          .where(
            sql`${deblurRequests.expiresAt} < ${now} AND ${deblurRequests.processedImageUrl} IS NOT NULL`
          );

        return {
          success: true,
          message: "Expired image URLs have been cleaned up",
        };
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to cleanup expired requests",
        });
      }
    }),
});
