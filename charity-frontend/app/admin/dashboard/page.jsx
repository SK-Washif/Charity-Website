"use client";

import Link from "next/link";
import { FaInfoCircle, FaHandsHelping, FaImages, FaPhoneAlt } from "react-icons/fa";

const shortcuts = [
  {
    href: "/admin/about",
    label: "আমাদের কথা",
    desc: "মিশন, ভিশন ও সংস্থার পরিচিতি এডিট করুন",
    icon: FaInfoCircle,
  },
  {
    href: "/admin/services",
    label: "সেবাসমূহ",
    desc: "প্রোগ্রাম যোগ করুন, এডিট বা মুছে ফেলুন",
    icon: FaHandsHelping,
  },
  {
    href: "/admin/gallery",
    label: "গ্যালারি",
    desc: "কার্যক্রমের ছবি আপলোড ও ম্যানেজ করুন",
    icon: FaImages,
  },
  {
    href: "/admin/contact",
    label: "যোগাযোগ",
    desc: "ফোন, ইমেইল, ঠিকানা ও সোশ্যাল লিংক",
    icon: FaPhoneAlt,
  },
];

export default function AdminDashboardPage() {
  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      <h1 className="mt-2 font-display text-2xl font-semibold">ড্যাশবোর্ড</h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        ওয়েবসাইটের যেকোনো সেকশনের কনটেন্ট আপডেট করতে নিচের কার্ডগুলো থেকে
        বেছে নিন।
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
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
