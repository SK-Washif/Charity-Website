"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();
  const isLoginPage = pathname === "/admin/login";

  //Security: Prevent browser back button after logout
  useEffect(() => {
    if (!isSignedIn && isLoaded && !isLoginPage) {
      window.history.replaceState(null, '', '/admin/login');
    }
  }, [isSignedIn, isLoaded, isLoginPage]);

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
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-marigold"></div>
          লোড হচ্ছে...
        </div>
      </div>
    );
  }

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
      <main className="flex-1 px-6 py-10 md:px-10 overflow-y-auto max-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}