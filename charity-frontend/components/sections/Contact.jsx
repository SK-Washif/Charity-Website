"use client";

import { motion } from "framer-motion";
import { 
  FaFacebook, 
  FaYoutube, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
  FaGlobe
} from "react-icons/fa";

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

        {/* Contact Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Phone */}
          <motion.div
            variants={cardVariants}
            className="group bg-kraft/60 rounded-2xl p-6 transition-all hover:bg-paper hover:shadow-xl border border-line hover:border-marigold/30"
          >
            <div className="flex items-start gap-4">
              <div className="bg-marigold/10 p-3 rounded-xl group-hover:bg-marigold/20 transition-colors shrink-0">
                <FaPhone className="text-marigold text-xl" />
              </div>
              <div>
                <p className="label-caps text-ink-muted">ফোন</p>
                <p className="mt-1 font-body text-sm text-ink">
                  +৮৮০ ১XXX-XXXXXX
                </p>
                <p className="text-xs text-ink-muted/60 mt-1">সকাল ৯টা - সন্ধ্যা ৬টা</p>
              </div>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            variants={cardVariants}
            className="group bg-kraft/60 rounded-2xl p-6 transition-all hover:bg-paper hover:shadow-xl border border-line hover:border-marigold/30"
          >
            <div className="flex items-start gap-4">
              <div className="bg-marigold/10 p-3 rounded-xl group-hover:bg-marigold/20 transition-colors shrink-0">
                <FaEnvelope className="text-marigold text-xl" />
              </div>
              <div>
                <p className="label-caps text-ink-muted">ইমেইল</p>
                <p className="mt-1 font-body text-sm text-ink break-all">
                  info@example.org
                </p>
                <p className="text-xs text-ink-muted/60 mt-1">২৪ ঘন্টা উত্তর</p>
              </div>
            </div>
          </motion.div>

          {/* Address */}
          <motion.div
            variants={cardVariants}
            className="group bg-kraft/60 rounded-2xl p-6 transition-all hover:bg-paper hover:shadow-xl border border-line hover:border-marigold/30"
          >
            <div className="flex items-start gap-4">
              <div className="bg-marigold/10 p-3 rounded-xl group-hover:bg-marigold/20 transition-colors shrink-0">
                <FaMapMarkerAlt className="text-marigold text-xl" />
              </div>
              <div>
                <p className="label-caps text-ink-muted">ঠিকানা</p>
                <p className="mt-1 font-body text-sm text-ink">
                  ঢাকা, বাংলাদেশ
                </p>
                <p className="text-xs text-ink-muted/60 mt-1">সরকারি কার্যালয়</p>
              </div>
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            variants={cardVariants}
            className="group bg-kraft/60 rounded-2xl p-6 transition-all hover:bg-paper hover:shadow-xl border border-line hover:border-marigold/30"
          >
            <div className="flex items-start gap-4">
              <div className="bg-marigold/10 p-3 rounded-xl group-hover:bg-marigold/20 transition-colors shrink-0">
                <FaGlobe className="text-marigold text-xl" />
              </div>
              <div>
                <p className="label-caps text-ink-muted">সোশ্যাল মিডিয়া</p>
                <div className="mt-2 flex gap-4 text-ink">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="transition-all hover:text-marigold hover:scale-110"
                  >
                    <FaFacebook size={22} />
                  </a>
                  <a
                    href="#"
                    aria-label="YouTube"
                    className="transition-all hover:text-marigold hover:scale-110"
                  >
                    <FaYoutube size={22} />
                  </a>
                  <a
                    href="#"
                    aria-label="WhatsApp"
                    className="transition-all hover:text-marigold hover:scale-110"
                  >
                    <FaWhatsapp size={22} />
                  </a>
                </div>
                <p className="text-xs text-ink-muted/60 mt-2">সর্বশেষ আপডেট</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 text-sm text-ink-muted">
            <FaClock className="text-marigold" />
            <span>সকল প্রশ্নের উত্তর দেওয়া হয় <span className="text-ink font-medium">২৪ ঘন্টার মধ্যে</span></span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}