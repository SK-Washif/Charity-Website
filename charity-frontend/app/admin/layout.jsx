"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!isLoginPage && !loading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isLoginPage, loading, isAuthenticated, router]);

  // লগইন পেজ সাইডবার ছাড়া, নিজস্ব সেন্টার্ড লেআউটে দেখানো হয়
  if (isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-kraft px-6 py-10 font-body text-ink">
        {children}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-kraft font-body text-sm text-ink-muted">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!isAuthenticated) {
    // redirect চলাকালীন সংক্ষিপ্ত মুহূর্তের জন্য কিছু রেন্ডার হবে না
    return null;
  }

  return (
    <div className="min-h-screen bg-kraft font-body text-ink md:flex">
      <AdminSidebar />
      <main className="flex-1 px-6 py-10 md:px-10">{children}</main>
    </div>
  );
}
