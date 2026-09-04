"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Stamp from "@/components/ui/Stamp";
import DonateButton from "@/components/ui/DonateButton";

const links = [
  { href: "/#about", label: "আমাদের কথা" },
  { href: "/#services", label: "সেবাসমূহ" },
  { href: "/#gallery", label: "গ্যালারি" },
  { href: "/#scholarship", label: "শিক্ষাবৃত্তি" },
  { href: "/#contact", label: "যোগাযোগ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header 
      className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur"
      role="banner"
    >
      <nav 
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10"
        aria-label="প্রধান নেভিগেশন"
      >
        <Link href="/" className="flex items-center gap-3" aria-label="হোম পেজে যান">
          <span className="font-display text-2xl font-semibold text-ink">
            ঐক্যতান ফাউন্ডেশন
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex" role="list">
          {links.map((l) => (
            <li key={l.href} role="listitem">
              <Link href={l.href} className="label-caps hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/scholarship" className="btn-marigold inline-flex">
            শিক্ষাবৃত্তি আবেদন
          </Link>
          <DonateButton size="sm" variant="outline" />
        </div>

        <button
          className="text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          aria-expanded={open}
        >
          {open ? <HiX size={26} aria-hidden="true" /> : <HiMenu size={26} aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <ul 
          className="flex flex-col gap-1 border-t border-line bg-paper px-6 py-4 md:hidden"
          role="list"
        >
          {links.map((l) => (
            <li key={l.href} role="listitem">
              <Link
                href={l.href}
                className="block py-2 label-caps"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="flex flex-wrap gap-3 pt-2" role="listitem">
            <Link
              href="/scholarship"
              className="btn-marigold inline-flex"
              onClick={() => setOpen(false)}
            >
              শিক্ষাবৃত্তি আবেদন
            </Link>
            <DonateButton size="sm" variant="outline" />
          </li>
        </ul>
      )}
    </header>
  );
}