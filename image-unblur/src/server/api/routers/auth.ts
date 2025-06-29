import { currentUser } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const authRouter = createTRPCRouter({
  syncUser: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.clerkId;
    const user = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkId, userId),
    });

    if (user?.email) {
      return {
        isSynced: true,
      };
    }

    const clerkUser = await currentUser();

    if (user) {
      await ctx.db
        .update(users)
        .set({
          email: clerkUser?.emailAddresses[0]?.emailAddress,
        })
        .where(eq(users.clerkId, userId));

      return {
        isSynced: true,
      };
    }

    if (!clerkUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized: Clerk user not found",
      });
    }

    await ctx.db
      .insert(users)
      .values({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
      })
      // 幂等性 如果极短时间内多次调用 不会出现报错
      .onConflictDoNothing();

    return {
      isSynced: true,
    };
  }),
});
