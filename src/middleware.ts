import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 仅保护 examples 路由，其他页面允许未登录访问
const isProtectedRoute = createRouteMatcher([
  "/examples"
]);

export default clerkMiddleware(async (auth, req) => {
  // 如果是受保护的路由，要求认证
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
