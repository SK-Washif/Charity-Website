"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaInfoCircle,
  FaHandsHelping,
  FaImages,
  FaPhoneAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { logout } from "@/lib/auth";
import Stamp from "@/components/ui/Stamp";

const links = [
  { href: "/admin/dashboard", label: "ড্যাশবোর্ড", icon: FaTachometerAlt },
  { href: "/admin/about", label: "আমাদের কথা", icon: FaInfoCircle },
  { href: "/admin/services", label: "সেবাসমূহ", icon: FaHandsHelping },
  { href: "/admin/gallery", label: "গ্যালারি", icon: FaImages },
  { href: "/admin/contact", label: "যোগাযোগ", icon: FaPhoneAlt },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // ব্যাকএন্ড না থাকলেও UI থেকে সেশন ক্লিয়ার করে লগইন পেজে পাঠানো হবে
    } finally {
      router.replace("/admin/login");
    }
  }

  return (
    <aside className="border-b border-line bg-paper md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center gap-3 border-b border-line px-6 py-5">
        <Stamp size={36} rotate={-6} lines={["ঐক্য", "তান"]} />
        <span className="font-display text-sm font-semibold text-ink">
          অ্যাডমিন প্যানেল
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4 md:h-[calc(100vh-73px)] md:justify-between">
        <div className="flex flex-col gap-1">
          {links.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 rounded-sm px-3 py-2 font-body text-sm transition-colors ${
                  active ? "bg-ink text-kraft" : "text-ink-muted hover:bg-kraft"
                }`}
              >
                <Icon size={14} />
                {l.label}
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-sm px-3 py-2 text-left font-body text-sm text-ink-muted transition-colors hover:bg-kraft"
        >
          <FaSignOutAlt size={14} />
          লগআউট
        </button>
      </nav>
    </aside>
  );
}
