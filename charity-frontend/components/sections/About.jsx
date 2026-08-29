"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHandsHelping } from "react-icons/fa";
import Image from "next/image";
import { api } from "@/lib/api";

const defaultData = {
  title: "ঐক্যতান ফাউন্ডেশন সম্পর্কে",
  description:
    "২০১৫ সাল থেকে ঐক্যতান ফাউন্ডেশন একটি রেজিস্টার্ড অলাভজনক সংস্থা হিসেবে কাজ করে যাচ্ছে। শিক্ষাবৃত্তি, স্বাস্থ্যসেবা, খাদ্য বিতরণ ও জরুরি সহায়তার মাধ্যমে আমরা প্রান্তিক ও সুবিধাবঞ্চিত পরিবারগুলোর পাশে দাঁড়াই — যাতে তারা মর্যাদার সাথে নিজেদের জীবন গড়ে তুলতে পারে।",
  mission:
    "শিক্ষা, স্বাস্থ্য ও জরুরি ত্রাণ কার্যক্রমের মাধ্যমে সমাজের সুবিধাবঞ্চিত মানুষদের পাশে দাঁড়ানো এবং তাদের স্বনির্ভর জীবনযাত্রায় সহায়তা করা।",
  vision:
    "এমন একটি সমাজ গড়া যেখানে অর্থনৈতিক সীমাবদ্ধতা কারো শিক্ষা বা মৌলিক অধিকার অর্জনের পথে বাধা হয়ে দাঁড়ায় না।",
  transparency:
    "প্রতিটি অনুদান ও ব্যয়ের হিসাব প্রকাশ্যে রাখা হয় — আমরা বিশ্বাস করি জবাবদিহিতাই একটি সংস্থার আসল ভিত্তি।",
  primaryPhoto: "/images/about-primary.jpg",
  secondaryPhoto: "/images/about-secondary.jpg",
};

// Animation variants (Same as before)
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.92, rotate: -2 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const imageVariantsSecondary = {
  hidden: { opacity: 0, scale: 0.85, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
};

const floatingBadge = {
  hidden: { opacity: 0, y: -20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 },
  },
};

export default function About() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await api.getAbout();
      if (response && Object.keys(response).length > 0) {
        setData(response);
      }
    } catch (error) {
      console.error("Failed to fetch about data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="about" className="anchor-section section border-t border-line mb-24">
        <div className="container-9xl">
          <div className="text-center py-12">
            <p className="text-ink-muted">লোড হচ্ছে...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="anchor-section section border-t border-line mb-24">
      <div className="container-9xl">
        <div className="grid items-center gap-14 md:grid-cols-2">
          {/* Left: Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span variants={fadeUp} custom={0} className="label-caps text-stamp">
              আমাদের কথা
            </motion.span>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-3 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl"
            >
              {data.title}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 max-w-md font-body text-ink-muted"
            >
              {data.description}
            </motion.p>
          </motion.div>

          {/* Right: Images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto h-[420px] w-full max-w-md"
          >
            {/* Primary Image */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute left-0 top-0 h-full w-[62%] overflow-hidden rounded-[46%_46%_10px_10px/60%_60%_10px_10px] bg-marigold/20 shadow-xl"
            >
              <Image
                src={data.primaryPhoto || defaultData.primaryPhoto}
                alt="আমাদের কার্যক্রমে একজন শিক্ষার্থী"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
                onError={(e) => { e.target.src = defaultData.primaryPhoto; }}
              />
            </motion.div>

            {/* Secondary Image */}
            <motion.div
              variants={imageVariantsSecondary}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute bottom-0 right-0 h-[55%] w-[52%] overflow-hidden rounded-3xl border-4 border-paper shadow-2xl"
            >
              <Image
                src={data.secondaryPhoto || defaultData.secondaryPhoto}
                alt="আমাদের কার্যক্রমে একজন শিশু"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                onError={(e) => { e.target.src = defaultData.secondaryPhoto; }}
              />
            </motion.div>

            {/* Badge */}
            <motion.div
              variants={floatingBadge}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute right-2 top-2 flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-kraft shadow-2xl"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marigold text-ink">
                <FaHandsHelping size={16} />
              </span>
              <span>
                <span className="block font-mono text-lg font-semibold leading-none">214+</span>
                <span className="label-caps text-kraft/70">শিক্ষার্থী সহায়তা</span>
              </span>
            </motion.div>

            {/* Decorative */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -top-3 -left-3 h-12 w-12 rounded-full border-2 border-marigold/30"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full border-2 border-marigold/20"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-marigold/10"
            />
          </motion.div>
        </div>

        {/* Mission / Vision / Transparency */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            { title: "লক্ষ্য (Mission)", text: data.mission },
            { title: "দৃষ্টিভঙ্গি (Vision)", text: data.vision },
            { title: "স্বচ্ছতা (Transparency)", text: data.transparency },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border-t-2 border-marigold pt-4"
            >
              <h3 className="font-display text-lg font-semibold text-ink">{v.title}</h3>
              <p className="mt-2 font-body text-sm text-ink-muted">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}