import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedAdminRoute(req)) {
    await auth.protect();
  }
},
{
    clockSkewInMs: 120_000, // ২ মিনিট পর্যন্ত ঘড়ি-গরমিল সহ্য করবে
  });

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};