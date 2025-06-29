import { TRPCError } from "@trpc/server";
import z from "zod";
import { env } from "~/env";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { stripe } from "~/service/stripe";

export const billingRouter = createTRPCRouter({
  createSubscriptionCheckoutSession: protectedProcedure
    .input(
      z.object({
        email: z
          .string()
          .email({
            message: "Invalid email address.",
          })
          .optional(),
        priceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { clerkId } = ctx;
      const { email, priceId } = input;

      if (!priceId) {
        return {
          url: `${env.BASE_URL}/`,
        };
      }

      if (!email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email is required. Please login and try again.",
        });
      }

      // user should sync
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.clerkId, clerkId),
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found. Please sync your account first.",
        });
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, price_1234) of the product you want to sell
            price: priceId, // "price_1RadPHQpTNcDfTEvSiglPuVw",
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${env.BASE_URL}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.BASE_URL}/pricing?canceled=true`,
        metadata: {
          clerkId,
        },
        customer_email: email,
      });

      const url = session.url;
      if (!url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return {
        url,
      };
    }),

  createPackageCheckoutSession: protectedProcedure
    .input(
      z.object({
        email: z
          .string()
          .email({
            message: "Invalid email address.",
          })
          .optional(),
        priceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { clerkId } = ctx;
      const { email, priceId } = input;

      if (!email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email is required. Please login and try again.",
        });
      }

      // user should sync
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.clerkId, clerkId),
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found. Please sync your account first.",
        });
      }

      // Create Checkout Sessions for one-time payment
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.BASE_URL}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.BASE_URL}/pricing?canceled=true`,
        metadata: {
          clerkId,
        },
        customer_email: email,
      });

      const url = session.url;
      if (!url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return {
        url,
      };
    }),

  createBillingPortalSession: protectedProcedure
    .input(
      z
        .object({
          returnUrl: z.string().optional().default(`${env.BASE_URL}/pricing`),
        })
        .optional(),
    )
    .mutation(async ({ ctx, input }) => {
      const returnUrl = input?.returnUrl;
      const { clerkId } = ctx;

      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.clerkId, clerkId),
        columns: {
          stripeCustomerId: true,
          stripeSubscriptionId: true,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found. Please sync your account first.",
        });
      }
      if (!user.stripeCustomerId || !user.stripeSubscriptionId) {
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message:
            "You are not subscribed to any plan. Please subscribe to a plan first.",
        });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: returnUrl,
      });

      const url = session.url;
      if (!url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create billing portal session",
        });
      }

      return {
        url,
      };
    }),
});
