"use client";


import { usePathname} from "next/navigation";
import { useUser } from "@clerk/nextjs";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-kraft px-6 py-10 font-body text-ink">
        {children}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-kraft font-body text-sm text-ink-muted">
        লোড হচ্ছে...
      </div>
    );
  }

   // Not authenticated - redirect to login
  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-kraft font-body text-sm text-ink-muted">
        <p>অনুগ্রহ করে লগইন করুন।</p>
        <a href="/admin/login" className="text-marigold underline ml-2">
          লগইন পেজে যান
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kraft font-body text-ink md:flex">
      <AdminSidebar />
      <main className="flex-1 px-6 py-10 md:px-10">{children}</main>
    </div>
  );
}
