"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaGraduationCap, FaArrowRight, FaSpinner } from "react-icons/fa";
import { api } from "@/lib/api";
import DonateButton from "@/components/ui/DonateButton";

//Default Image
const DEFAULT_IMAGE = "/images/scholarship-preview.jpg";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.92, x: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ScholarshipPreview() {
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  //Real API থেকে Data Fetch + Default Fallback
  const fetchScholarshipPreview = useCallback(async () => {
    try {
      setLoading(true);
      setImageError(false);
      
      const data = await api.getScholarshipPreview();
      
      console.log("📥 Client fetch data:", data);
      
      //Check if data exists and has imageUrl
      if (data && data.imageUrl && data.imageUrl.trim() !== '') {
        console.log("✅ Scholarship image loaded:", data.imageUrl);
        setImageUrl(data.imageUrl);
        setImageError(false);
      } else {
        console.log("ℹ️ No scholarship image found, using default");
        setImageUrl(DEFAULT_IMAGE);
      }
    } catch (error) {
      console.error("❌ Failed to fetch scholarship preview:", error);
      setImageUrl(DEFAULT_IMAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScholarshipPreview();
  }, [fetchScholarshipPreview]);

  //Handle image error
  const handleImageError = useCallback(() => {
    console.error("❌ Image failed to load:", imageUrl);
    setImageError(true);
    setImageUrl(DEFAULT_IMAGE);
  }, [imageUrl]);

  // Loading State
  if (loading) {
    return (
      <section id="scholarship" className="anchor-section section border-t border-line bg-ink text-kraft mb-24">
        <div className="container-xl">
          <div className="flex items-center justify-center py-16">
            <FaSpinner className="animate-spin text-marigold text-3xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="scholarship" className="anchor-section section border-t border-line bg-ink text-kraft mb-24">
      <div className="container-xl">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Left Side - Text Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span variants={fadeUp} custom={0} className="label-caps text-marigold font-semibold">
              শিক্ষাবৃত্তি কার্যক্রম
            </motion.span>

            <motion.h2
              variants={fadeUp}
              custom={0.1}
              className="mt-2 max-w-2xl font-display text-3xl font-semibold text-paper md:text-4xl"
            >
              নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={0.2}
              className="mt-4 max-w-2xl font-body text-kraft/80 leading-relaxed"
            >
              মেধাবী কিন্তু আর্থিকভাবে অসচ্ছল শিক্ষার্থীদের নিয়মিত শিক্ষা
              চালিয়ে যাওয়ার জন্য <span className="text-marigold font-medium">"নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প"</span>-এর
              আওতায় বৃত্তি প্রদান করা হয়। আবেদনের জন্য প্রয়োজনীয় তথ্যসহ একটি
              সংক্ষিপ্ত ফর্ম পূরণ করলেই আবেদন প্রক্রিয়া শুরু হয়ে যাবে।
            </motion.p>

            {/* Features */}
            <motion.div
              variants={fadeUp}
              custom={0.3}
              className="mt-5 flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2 text-kraft/70 text-sm">
                <span className="text-marigold">✓</span>
                সম্পূর্ণ বিনামূল্যে
              </div>
              <div className="flex items-center gap-2 text-kraft/70 text-sm">
                <span className="text-marigold">✓</span>
                মেধাভিত্তিক নির্বাচন
              </div>
              <div className="flex items-center gap-2 text-kraft/70 text-sm">
                <span className="text-marigold">✓</span>
                নিয়মিত সহায়তা
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={0.4}
              className="mt-6 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/scholarship"
                className="inline-flex items-center gap-2 rounded-lg bg-marigold px-6 py-3 font-body text-sm font-semibold text-ink transition-all hover:bg-marigold/90 hover:shadow-lg hover:scale-105"
              >
                <FaGraduationCap />
                শিক্ষাবৃত্তির জন্য আবেদন করুন
                <FaArrowRight size={14} />
              </Link>
              <DonateButton variant="outline" />
            </motion.div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="relative h-[250px] md:h-[280px] w-full overflow-hidden rounded-2xl bg-marigold/10 shadow-2xl">
              {/*Use img tag instead of Next.js Image for better error handling */}
              <img
                src={imageUrl}
                alt="শিক্ষাবৃত্তি প্রদান অনুষ্ঠান"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={handleImageError}
                loading="eager"
              />
              
              {/* Fallback placeholder - shows when image fails */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-marigold/5 pointer-events-none">
                <FaGraduationCap className="text-6xl text-marigold/30" />
                <span className="text-ink/30 font-display text-sm mt-2">শিক্ষাবৃত্তি</span>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute -bottom-4 -left-4 bg-ink/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border border-marigold/20"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-marigold text-ink">
                    <FaGraduationCap size={18} />
                  </span>
                  <span>
                    <span className="block font-mono text-lg font-semibold text-paper">
                      ১০০+
                    </span>
                    <span className="label-caps text-kraft/60 text-[10px]">
                      শিক্ষার্থী পেয়েছে বৃত্তি
                    </span>
                  </span>
                </div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -top-3 -right-3 h-12 w-12 rounded-full border-2 border-marigold/30"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full border-2 border-marigold/20"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}