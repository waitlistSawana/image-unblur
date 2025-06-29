import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

export async function requireClerk() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  return {
    clerkId: userId,
  };
}

export async function requireUser() {
  const { clerkId } = await requireClerk();

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.clerkId, clerkId),
  });

  if (!user) {
    return redirect("/onboarding");
  }

  return {
    clerkId: clerkId,
    user: user, // TODO: 去掉隐私内容
  };
}
