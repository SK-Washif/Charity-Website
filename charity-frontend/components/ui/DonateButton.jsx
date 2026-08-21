"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaHeart,
  FaTimes,
  FaMobileAlt,
  FaUniversity,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";

const mobileBanking = [
  {
    name: "bKash",
    color: "#E2136E",
    number: "+৮৮০ ১XXX-XXXXXX",
    note: "Send Money (Personal)",
  },
  {
    name: "Nagad",
    color: "#F6921E",
    number: "+৮৮০ ১XXX-XXXXXX",
    note: "Send Money (Personal)",
  },
  {
    name: "Rocket",
    color: "#8C3494",
    number: "+৮৮০ ১XXX-XXXXXXX",
    note: "Send Money (Personal)",
  },
];

function DonateModal({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 px-4 py-8 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-paper shadow-2xl"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-ink px-6 py-8 text-center">
          <button
            onClick={onClose}
            aria-label="বন্ধ করুন"
            className="absolute right-4 top-4 rounded-full bg-kraft/10 p-2 text-kraft/70 transition hover:bg-kraft/20 hover:text-white"
          >
            <FaTimes size={16} />
          </button>
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-marigold text-ink">
            <FaHeart size={22} />
          </span>
          <h3 className="mt-4 font-display text-2xl font-semibold text-paper">
            আমাদের পাশে থাকুন
          </h3>
          <p className="mx-auto mt-2 max-w-sm font-body text-sm leading-relaxed text-kraft/70">
            আপনার প্রতিটি অনুদান একজন শিক্ষার্থীর স্বপ্নপূরণের পথে একধাপ
            এগিয়ে নিয়ে যায়। নিচের যেকোনো মাধ্যমে সরাসরি অনুদান পাঠাতে
            পারেন।
          </p>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-6">
          {/* Mobile banking */}
          <div>
            <h4 className="label-caps mb-3 text-ink-muted">
              মোবাইল ব্যাংকিং
            </h4>
            <div className="space-y-3">
              {mobileBanking.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-kraft/30 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: m.color }}
                    >
                      <FaMobileAlt size={16} />
                    </span>
                    <div>
                      <p className="font-body text-sm font-semibold text-ink">
                        {m.name}
                      </p>
                      <p className="font-mono text-xs text-ink-muted">
                        {m.number}
                      </p>
                    </div>
                  </div>
                  <span className="label-caps text-[10px] text-marigold">
                    {m.note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bank */}
          <div>
            <h4 className="label-caps mb-3 text-ink-muted">
              ব্যাংক অ্যাকাউন্ট
            </h4>
            <div className="space-y-1.5 rounded-xl border border-line bg-kraft/30 px-4 py-4">
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-marigold">
                  <FaUniversity size={16} />
                </span>
                <p className="font-body text-sm font-semibold text-ink">
                  ব্যাংক ট্রান্সফার
                </p>
              </div>
              <p className="font-body text-xs text-ink-muted">
                হিসাবের নাম:{" "}
                <span className="text-ink">ঐক্যতান ফাউন্ডেশন</span>
              </p>
              <p className="font-body text-xs text-ink-muted">
                হিসাব নম্বর:{" "}
                <span className="font-mono text-ink">
                  XXXX-XXXXXXX-XXX
                </span>
              </p>
              <p className="font-body text-xs text-ink-muted">
                ব্যাংক ও শাখা:{" "}
                <span className="text-ink">
                  XXXX ব্যাংক লিমিটেড, সাতক্ষীরা শাখা
                </span>
              </p>
              <p className="font-body text-xs text-ink-muted">
                রাউটিং নম্বর:{" "}
                <span className="font-mono text-ink">XXXXXXXXX</span>
              </p>
            </div>
          </div>

          {/* Card */}
          <div>
            <h4 className="label-caps mb-3 text-ink-muted">
              কার্ড / অনলাইন পেমেন্ট
            </h4>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-marigold/40 bg-marigold/5 px-4 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-marigold/15 text-marigold">
                <FaCreditCard size={16} />
              </span>
              <p className="font-body text-xs leading-relaxed text-ink-muted">
                ক্রেডিট/ডেবিট কার্ড দিয়ে অনলাইনে অনুদান দেওয়ার ব্যবস্থা
                শীঘ্রই চালু হচ্ছে। এখন পর্যন্ত উপরের মাধ্যমগুলো ব্যবহার
                করুন অথবা{" "}
                <a
                  href="/#contact"
                  className="text-marigold underline underline-offset-2"
                >
                  আমাদের সাথে যোগাযোগ করুন
                </a>
                ।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-ink/5 px-4 py-3">
            <FaCheckCircle
              className="mt-0.5 shrink-0 text-marigold"
              size={14}
            />
            <p className="font-body text-xs leading-relaxed text-ink-muted">
              অনুদান পাঠানোর পর একটি স্ক্রিনশট{" "}
              <span className="font-medium text-ink">
                info@oikkotan.org
              </span>{" "}
              এ পাঠিয়ে দিলে আমরা রশিদ নিশ্চিত করব।
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DonateButton({
  className = "",
  variant = "solid",
  size = "md",
  children,
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal শুধু ব্রাউজারে (client-side) কাজ করে, তাই mount হওয়ার
  // পর document.body পাওয়া নিশ্চিত করা হচ্ছে (SSR-এ document নেই)।
  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClass =
    size === "sm" ? "px-5 py-2.5 text-xs" : "px-6 py-3 text-sm";

  const variantClass =
    variant === "outline"
      ? "border-2 border-marigold text-marigold hover:bg-marigold hover:text-ink"
      : "bg-marigold text-ink hover:bg-marigold/90 hover:shadow-lg";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-lg font-body font-semibold transition-all hover:scale-105 ${sizeClass} ${variantClass} ${className}`}
      >
        <FaHeart size={size === "sm" ? 12 : 14} />
        {children || "অনুদান করুন"}
      </button>

      {/*
        document.body-তে পোর্টাল করে রেন্ডার করা হচ্ছে, যাতে Navbar-এর
        মতো backdrop-blur/filter থাকা কোনো ancestor-এর ভেতরে আটকে না
        থেকে পপআপটা সবসময় পুরো স্ক্রিনের মাঝখানে দেখায়।
      */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && <DonateModal onClose={() => setOpen(false)} />}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}