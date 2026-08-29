"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FaImages, FaSpinner } from "react-icons/fa";
import { api } from "@/lib/api";

//Default Gallery Images (যখন Admin থেকে কিছু আসবে না)
const DEFAULT_GALLERY_IMAGES = [
  { 
    id: 1, 
    title: "শিক্ষা উপকরণ বিতরণ অনুষ্ঠান", 
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=800&fit=crop&crop=center" 
  },
  { 
    id: 2, 
    title: "বিদ্যালয়ে শিক্ষা কার্যক্রম", 
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=450&fit=crop&crop=center" 
  },
  { 
    id: 3, 
    title: "শিক্ষাবৃত্তি প্রদান অনুষ্ঠান", 
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=750&fit=crop&crop=center" 
  },
  { 
    id: 4, 
    title: "পাঠ্যবই বিতরণ কার্যক্রম", 
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop&crop=center" 
  },
  { 
    id: 5, 
    title: "কমিউনিটি শিক্ষা সচেতনতা", 
    imageUrl: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=900&fit=crop&crop=center" 
  },
  { 
    id: 6, 
    title: "শিশু শিক্ষা কার্যক্রম", 
    imageUrl: "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=600&h=500&fit=crop&crop=center" 
  },
  { 
    id: 7, 
    title: "গ্রামীণ শিক্ষা কার্যক্রম", 
    imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=800&fit=crop&crop=center" 
  },
  { 
    id: 8, 
    title: "শিক্ষা সহায়তা ও উন্নয়ন", 
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop&crop=center" 
  },
];

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function Gallery() {
  const [items, setItems] = useState(DEFAULT_GALLERY_IMAGES);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  //Real API থেকে Data Fetch + Default Fallback
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await api.getGallery();
      
      //API থেকে ডেটা আসলে সেটা দেখাবে, না হলে Default দেখাবে
      if (Array.isArray(data) && data.length > 0) {
        const mappedData = data.map((item) => ({
          id: item._id || item.id,
          title: item.title || "গ্যালারি ছবি",
          imageUrl: item.imageUrl,
        }));
        setItems(mappedData);
      } else {
        //API খালি থাকলে Default দেখাবে
        setItems(DEFAULT_GALLERY_IMAGES);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
      //Error হলে Default দেখাবে
      setItems(DEFAULT_GALLERY_IMAGES);
    } finally {
      setLoading(false);
    }
  };

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + items.length) % items.length
      ),
    [items.length]
  );
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % items.length)),
    [items.length]
  );

  // Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, showPrev, showNext]);

  const active = activeIndex !== null ? items[activeIndex] : null;

  // Loading State
  if (loading) {
    return (
      <section id="gallery" className="anchor-section section border-t border-line mb-24">
        <div className="container-9xl">
          <div className="text-center py-12">
            <p className="text-ink-muted">লোড হচ্ছে...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="anchor-section section border-t border-line mb-24">
      <div className="container-9xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-12"
        >
          <motion.span variants={fadeUp} custom={0} className="label-caps text-marigold font-semibold">
            গ্যালারি
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={0.1}
            className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl"
          >
            কার্যক্রমের কিছু মুহূর্ত
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="mt-4 max-w-2xl font-body text-ink-muted"
          >
            মাঠপর্যায়ের কার্যক্রম, বিতরণ অনুষ্ঠান ও উপকারভোগীদের কিছু ছবি —
            আমাদের কাজের প্রতিটি মুহূর্ত আপনার সাথে শেয়ার করছি।
          </motion.p>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-10 columns-2 gap-4 sm:columns-3 md:columns-3 lg:columns-4"
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              variants={fadeUp}
              custom={i}
              className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-line bg-paper shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://picsum.photos/seed/fallback/600/800";
                }}
              />
              {/* Overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/90 via-ink/30 to-transparent opacity-0 transition-all duration-400 group-hover:opacity-100">
                <div className="w-full p-4">
                  <span className="label-caps text-kraft text-xs md:text-sm">
                    {item.title}
                  </span>
                  <div className="mt-2 flex items-center gap-2 text-kraft/70 text-xs">
                    <FaImages size={12} />
                    <span>দেখুন</span>
                  </div>
                </div>
              </div>
              {/* Counter Badge */}
              <div className="absolute top-3 right-3 bg-ink/60 backdrop-blur-sm text-kraft text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {i + 1}/{items.length}
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md"
            onClick={close}
          >
            {/* Close Button */}
            <motion.button
              type="button"
              onClick={close}
              aria-label="বন্ধ করুন"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="absolute right-5 top-5 z-10 text-kraft/80 transition-all hover:scale-110 hover:text-marigold"
            >
              <HiX size={32} />
            </motion.button>

            {/* Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 top-5 z-10 text-kraft/60 text-sm font-mono"
            >
              {activeIndex + 1} / {items.length}
            </motion.div>

            {/* Navigation Buttons */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              aria-label="আগের ছবি"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-ink/60 p-3 text-kraft transition-all hover:bg-marigold hover:text-ink hover:scale-110 md:left-6"
            >
              <HiChevronLeft size={28} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              aria-label="পরের ছবি"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-ink/60 p-3 text-kraft transition-all hover:bg-marigold hover:text-ink hover:scale-110 md:right-6"
            >
              <HiChevronRight size={28} />
            </button>

            {/* Image */}
            <motion.figure
              key={active.id}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-4xl w-full"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={active.imageUrl}
                  alt={active.title}
                  className="max-h-[75vh] w-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://picsum.photos/seed/fallback/800/600";
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-4">
                  <figcaption className="text-center font-body text-sm text-kraft/90">
                    {active.title}
                  </figcaption>
                </div>
              </div>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}