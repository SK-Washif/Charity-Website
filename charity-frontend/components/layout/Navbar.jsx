"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Stamp from "@/components/ui/Stamp";

// সিঙ্গেল-পেজ সাইট: প্রতিটি নেভিগেশন আইটেম হোম পেজের একটি সেকশন id-কে
// পয়েন্ট করে ("/#id")। হোম পেজে থাকলে এটি স্মুথ-স্ক্রল করবে, আর অন্য
// রুটে (যেমন /scholarship) থাকলে আগে হোমে নিয়ে গিয়ে তারপর ওই সেকশনে
// জাম্প করবে।
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
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Stamp size={44} rotate={-6} lines={["ঐক্য", "তান"]} />
          <span className="font-display text-lg font-semibold text-ink">
            ঐক্যতান ফাউন্ডেশন
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="label-caps hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/scholarship" className="btn-marigold hidden md:inline-flex">
          শিক্ষাবৃত্তি আবেদন
        </Link>

        <button
          className="text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <HiX size={26} /> : <HiMenu size={26} />}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-1 border-t border-line bg-paper px-6 py-4 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block py-2 label-caps"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link
              href="/scholarship"
              className="btn-marigold inline-flex"
              onClick={() => setOpen(false)}
            >
              শিক্ষাবৃত্তি আবেদন
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
}
