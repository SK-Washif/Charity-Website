"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getIcon } from "@/lib/iconMap"; //iconMap থেকে Import
import DonateButton from "@/components/ui/DonateButton";
import { api } from "@/lib/api";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// ✅ Default fallback data (যদি API থেকে না আসে)
const defaultServices = [
  {
    title: "মেধাবী শিক্ষার্থী খোঁজা",
    text: "প্রকৃত মেধাবী ও অর্থনৈতিকভাবে দুর্বল শিক্ষার্থীদের খুঁজে বের করা — যাদের পড়াশোনা চালিয়ে যেতে আর্থিক সহায়তা প্রয়োজন।",
    icon: getIcon("FaSearch"), //iconMap থেকে নেওয়া
  },
  {
    title: "শিক্ষাবৃত্তি প্রদান",
    text: "নির্বাচিত শিক্ষার্থীদের নিয়মিত আর্থিক সহায়তা প্রদান, যাতে তারা পড়াশোনায় মনোযোগ দিতে পারে এবং ভালো ফলাফল অর্জন করতে পারে।",
    icon: getIcon("FaMoneyBillWave"),
  },
  {
    title: "বাংলাদেশের উন্নয়নে অবদান",
    text: "শিক্ষিত ও দক্ষ জনশক্তি তৈরি করে বাংলাদেশের সামগ্রিক উন্নয়নে অবদান রাখা — প্রতিটি শিক্ষার্থী আমাদের ভবিষ্যতের সম্পদ। শিক্ষা হোক ভবিষ্যতের ভিত্তি।",
    icon: getIcon("FaGlobeAsia"),
  },
];

export default function Services() {
  const [services, setServices] = useState(defaultServices);
  const [loading, setLoading] = useState(true);

  //Real API থেকে Data Fetch
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await api.getPrograms();
      console.log("📥 API Response:", data);

      if (Array.isArray(data) && data.length) {
        //API থেকে Data ম্যাপিং (icon string → component)
        const mappedData = data.map((item) => ({
          title: item.title,
          text: item.text,
          icon: getIcon(item.icon), //iconMap থেকে Auto Detect
        }));
        console.log("📊 Mapped Data:", mappedData);
        setServices(mappedData);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="services" className="anchor-section section border-t border-line bg-paper mb-24">
        <div className="container-6xl">
          <div className="text-center py-12">
            <p className="text-ink-muted">লোড হচ্ছে...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="anchor-section section border-t border-line bg-paper mb-24">
      <div className="container-6xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-12"
        >
          <motion.span variants={fadeUp} custom={0} className="label-caps text-marigold font-semibold">
            আমাদের সেবাসমূহ
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={0.1}
            className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl"
          >
            আমরা যা করি
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="mt-4 max-w-2xl font-body text-ink-muted"
          >
            আমাদের মূল লক্ষ্য — দেশের প্রকৃত মেধাবী ও অর্থনৈতিকভাবে দুর্বল শিক্ষার্থীদের খুঁজে বের করা 
            এবং তাদের আর্থিক সহায়তা প্রদান করা, যাতে তারা নির্বিঘ্নে পড়াশোনা চালিয়ে যেতে পারে 
            এবং বাংলাদেশের উন্নয়নে অবদান রাখতে পারে। অভাব যেন কোনো মেধাবী শিক্ষার্থীর স্বপ্ন থামিয়ে না দেয়।
          </motion.p>
        </motion.div>

        {/* Services Grid - Dynamic */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title + index}
                variants={cardVariants}
                custom={index}
                className="group rounded-2xl bg-kraft/60 p-6 transition-all hover:bg-paper hover:shadow-xl border border-line hover:border-marigold/30"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-marigold/10 p-3 rounded-xl group-hover:bg-marigold/20 transition-colors shrink-0">
                    <Icon className="text-marigold text-xl" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {service.title}
                    </h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-ink-muted">
                      {service.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Note & Donate CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <div className="inline-block bg-marigold/5 border border-marigold/20 rounded-xl px-6 py-4 max-w-2xl">
            <p className="text-sm text-ink-muted leading-relaxed">
              <span className="text-marigold font-semibold">✦</span>{' '}
              আমাদের বিশ্বাস —{' '}
              <span className="font-medium text-ink">প্রতিটি মেধাবী শিক্ষার্থীর স্বপ্ন পূরণের সুযোগ পাওয়া উচিত</span>
              , অর্থনৈতিক সীমাবদ্ধতা যেন কারো পড়াশোনার পথে বাধা না হয়ে দাঁড়ায়।{' '}
              <span className="text-marigold font-semibold">✦</span>
            </p>
          </div>
          <div className="mt-5 flex justify-center">
            <DonateButton />
          </div>
        </motion.div>
      </div>
    </section>
  );
}