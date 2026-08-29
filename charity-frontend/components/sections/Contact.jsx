"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaClock,
  FaGlobe
} from "react-icons/fa";
import { getIcon } from "@/lib/iconMap";
import { api } from "@/lib/api";

//Default Contact Cards (শুধু API fail হলে)
const defaultCards = [
  { id: "1", icon: "FaPhone", label: "ফোন", value: "+৮৮০ ১XXX-XXXXXX", note: "সকাল ৯টা - সন্ধ্যা ৬টা" },
  { id: "2", icon: "FaEnvelope", label: "ইমেইল", value: "info@oikkotan.org", note: "২৪ ঘন্টা উত্তর" },
  { id: "3", icon: "FaMapMarkerAlt", label: "ঠিকানা", value: "সাতক্ষীরা, বাংলাদেশ", note: "সরকারি কার্যালয়" },
];

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
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Contact() {
  const [cards, setCards] = useState([]);
  const [social, setSocial] = useState([]);
  const [loading, setLoading] = useState(true);

  //Fetch Data from API
  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      const [cardsData, socialData] = await Promise.all([
        api.getContactCards(),
        api.getSocialLinks(),
      ]);

      if (Array.isArray(cardsData) && cardsData.length > 0) {
        setCards(cardsData);
      } else {
        setCards([]);
      }

      if (Array.isArray(socialData) && socialData.length > 0) {
        setSocial(socialData);
      } else {
        setSocial([]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch contact data:", error);
      setCards([]);
      setSocial([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="contact" className="anchor-section section border-t border-line bg-paper">
        <div className="container-xl">
          <div className="text-center py-16">
            <p className="text-ink-muted">লোড হচ্ছে...</p>
          </div>
        </div>
      </section>
    );
  }

  //Dynamic grid columns based on number of cards
  const getGridCols = () => {
    const count = cards.length;
    if (count === 0) return '';
    if (count === 1) return 'grid-cols-1 max-w-xs';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-2xl';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-5xl';
  };

  return (
    <section id="contact" className="anchor-section section border-t border-line bg-paper">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-12"
        >
          <motion.span variants={fadeUp} custom={0} className="label-caps text-marigold font-semibold">
            যোগাযোগ
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={0.1}
            className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl"
          >
            আমাদের সাথে যোগাযোগ করুন
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={0.2}
            className="mt-4 max-w-xl mx-auto font-body text-ink-muted"
          >
            কোনো প্রশ্ন, পরামর্শ বা সহযোগিতার প্রস্তাব থাকলে নিচের যেকোনো
            মাধ্যমে আমাদের সাথে যোগাযোগ করতে পারেন।
          </motion.p>
        </motion.div>

        {/*Contact Cards - Center Aligned with Dynamic Columns */}
        {cards.length === 0 ? (
          <div className="text-center py-8 text-ink-muted">
            <p className="font-body text-sm">যোগাযোগের তথ্য পাওয়া যায়নি।</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className={`grid gap-6 mx-auto ${getGridCols()}`}
          >
            {cards.map((card, index) => {
              const Icon = getIcon(card.icon || "FaStar");
              return (
                <motion.div
                  key={card.id || index}
                  variants={cardVariants}
                  className="group bg-kraft/60 rounded-2xl p-6 transition-all hover:bg-paper hover:shadow-xl border border-line hover:border-marigold/30 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-marigold/10 p-3 rounded-xl group-hover:bg-marigold/20 transition-colors">
                      <Icon className="text-marigold text-2xl" />
                    </div>
                    <div>
                      <p className="label-caps text-ink-muted">{card.label || "—"}</p>
                      <p className="mt-1 font-body text-sm text-ink">
                        {card.value || "—"}
                      </p>
                      {card.note && (
                        <p className="text-xs text-ink-muted/60 mt-1">{card.note}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ✅ Social Links - Center Aligned */}
        {social.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="label-caps text-ink-muted mb-4">সোশ্যাল মিডিয়ায় আমাদের সাথে থাকুন</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {social.map((item) => {
                const Icon = getIcon(item.icon || "FaGlobe");
                return (
                  <a
                    key={item.id}
                    href={item.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.platform}
                    className="bg-kraft/60 p-3 rounded-full hover:bg-marigold hover:text-ink transition-all duration-300 hover:scale-110 border border-line hover:border-marigold/30"
                  >
                    <Icon className="text-ink-muted hover:text-ink text-xl" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
        </motion.div>
      </div>
    </section>
  );
}