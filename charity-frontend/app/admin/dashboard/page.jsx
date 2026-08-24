"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  FaImages as FaHeroImages,
  FaChartBar,
  FaInfoCircle,
  FaHandsHelping,
  FaImages,
  FaGraduationCap,
  FaPhoneAlt,
  FaHandHoldingHeart,
} from "react-icons/fa";

const shortcuts = [
  {
    href: "/admin/hero",
    label: "ব্যানার (Hero)",
    desc: "হোম পেজের ৩টা স্লাইড-শো ছবি ও লেখা আপলোড/এডিট করুন",
    icon: FaHeroImages,
  },
  {
    href: "/admin/stats",
    label: "পরিসংখ্যান",
    desc: "\"২১৪+ শিক্ষার্থী\"-এর মতো স্ট্যাট কার্ড যোগ/এডিট/মুছুন",
    icon: FaChartBar,
  },
  {
    href: "/admin/about",
    label: "আমাদের কথা",
    desc: "দুটো ছবি, মিশন, ভিশন ও সংস্থার পরিচিতি এডিট করুন",
    icon: FaInfoCircle,
  },
  {
    href: "/admin/programs",
    label: "সেবাসমূহ",
    desc: "প্রোগ্রাম কার্ড যোগ করুন, এডিট বা মুছে ফেলুন",
    icon: FaHandsHelping,
  },
  {
    href: "/admin/gallery",
    label: "গ্যালারি",
    desc: "কার্যক্রমের ছবি আপলোড, শিরোনাম ও ম্যানেজ করুন",
    icon: FaImages,
  },
  {
    href: "/admin/scholarship-preview",
    label: "শিক্ষাবৃত্তি প্রিভিউ",
    desc: "হোম পেজের শিক্ষাবৃত্তি সেকশনের ছবি বদলান",
    icon: FaGraduationCap,
  },
  {
    href: "/admin/contact",
    label: "যোগাযোগ",
    desc: "ফোন, ইমেইল, ঠিকানা ও সোশ্যাল লিংক কার্ড ম্যানেজ করুন",
    icon: FaPhoneAlt,
  },
  {
    href: "/admin/donation",
    label: "অনুদান তথ্য",
    desc: "Donate পপআপের bKash/Nagad/Rocket, ব্যাংক ও কার্ড তথ্য",
    icon: FaHandHoldingHeart,
  },
];

export default function AdminDashboardPage() {
   const { user } = useUser(); 
  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      <h1 className="mt-2 font-display text-2xl font-semibold">ড্যাশবোর্ড</h1>
      {/* Welcome Message with User Email */}
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        স্বাগতম, {user?.emailAddresses?.[0]?.emailAddress || "Admin"}! 🎉
      </p>
      
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        ওয়েবসাইটের যেকোনো সেকশনের কনটেন্ট আপডেট করতে নিচের কার্ডগুলো থেকে
        বেছে নিন।
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-start gap-4 rounded-sm border border-line bg-paper p-5 transition-shadow hover:shadow-md"
            >
              <span className="rounded-full bg-kraft p-3 text-stamp">
                <Icon size={18} />
              </span>
              <span>
                <span className="block font-display text-base font-semibold text-ink">
                  {s.label}
                </span>
                <span className="mt-1 block font-body text-sm text-ink-muted">
                  {s.desc}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
