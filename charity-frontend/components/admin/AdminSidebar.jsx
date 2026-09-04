"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { memo, useMemo, useCallback } from "react";
import {
  FaTachometerAlt,
  FaImages as FaHeroImages,
  FaChartBar,
  FaInfoCircle,
  FaHandsHelping,
  FaImages,
  FaGraduationCap,
  FaPhoneAlt,
  FaHandHoldingHeart,
  FaSignOutAlt,
} from "react-icons/fa";
import Stamp from "@/components/ui/Stamp";

const links = [
  { href: "/admin/dashboard", label: "ড্যাশবোর্ড", icon: FaTachometerAlt },
  { href: "/admin/hero", label: "ব্যানার (Hero)", icon: FaHeroImages },
  //{ href: "/admin/stats", label: "পরিসংখ্যান", icon: FaChartBar },
  { href: "/admin/about", label: "আমাদের কথা", icon: FaInfoCircle },
  { href: "/admin/programs", label: "সেবাসমূহ", icon: FaHandsHelping },
  { href: "/admin/gallery", label: "গ্যালারি", icon: FaImages },
  { href: "/admin/scholarship-preview", label: "শিক্ষাবৃত্তি প্রিভিউ", icon: FaGraduationCap },
  { href: "/admin/contact", label: "যোগাযোগ", icon: FaPhoneAlt },
  { href: "/admin/donation", label: "অনুদান তথ্য", icon: FaHandHoldingHeart },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem('oikkotan_admin_about');
      localStorage.removeItem('oikkotan_admin_gallery');
      localStorage.removeItem('oikkotan_admin_banners');
      
      await signOut({ redirectUrl: "/admin/login" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [signOut]);

  const isActive = useMemo(() => {
    return (href) => pathname === href || pathname.startsWith(`${href}/`);
  }, [pathname]);

  return (
    <aside 
      className="border-b border-line bg-paper md:w-64 md:shrink-0 md:border-b-0 md:border-r md:h-screen md:sticky md:top-0"
      role="navigation"
      aria-label="প্রশাসনিক মেনু"
    >
      <div className="flex items-center gap-3 border-b border-line px-6 py-5">
        <Stamp size={36} rotate={-6} lines={["ঐক্য", "তান"]} />
        <span className="font-display text-sm font-semibold text-ink">
          অ্যাডমিন প্যানেল
        </span>
      </div>

      <nav className="flex flex-col gap-1 overflow-y-auto px-3 py-4 h-[calc(100vh-73px)] justify-between">
        <ul className="flex flex-col gap-1" role="list">
          {links.map((l) => {
            const Icon = l.icon;
            const active = isActive(l.href);
            return (
              <li key={l.href} role="listitem">
                <Link
                  href={l.href}
                  prefetch={true}
                  className={`flex items-center gap-3 rounded-sm px-3 py-2 font-body text-sm transition-colors duration-150 ${
                    active ? "bg-ink text-kraft" : "text-ink-muted hover:bg-kraft"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={14} aria-hidden="true" />
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-sm px-3 py-2 text-left font-body text-sm text-ink-muted transition-colors hover:bg-kraft"
          aria-label="লগআউট করুন"
        >
          <FaSignOutAlt size={14} aria-hidden="true" />
          লগআউট
        </button>
      </nav>
    </aside>
  );
}

export default memo(AdminSidebar);