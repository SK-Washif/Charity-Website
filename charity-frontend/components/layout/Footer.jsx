import Link from "next/link";
import { FaFacebook, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import DonateButton from "@/components/ui/DonateButton";

export default function Footer() {
  return (
    <footer className="bg-ink text-kraft">
      {/* Main Footer Content */}
      <div className="container-custom mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          
          {/* Brand / About */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="bg-marigold/20 p-2 rounded-full">
                <FaHeart className="text-marigold text-xl" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                ঐক্যতান <span className="text-marigold">ফাউন্ডেশন</span>
              </h2>
            </div>
            <p className="text-kraft/60 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              শিক্ষা, চিকিৎসা ও মানবিক সহায়তার মাধ্যমে 
              সমাজের উন্নয়নে কাজ করছে একটি অলাভজনক সংস্থা।
            </p>
          </div>

          {/* সংস্থা */}
          <div className="text-center md:text-left">
            <h3 className="label-caps mb-4 text-kraft/50 font-semibold tracking-wider">
              সংস্থা
            </h3>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link href="/#about" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  আমাদের কথা
                </Link>
              </li>
              <li>
                <Link href="/#services" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  সেবাসমূহ
                </Link>
              </li>
              <li>
                <Link href="/#gallery" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  গ্যালারি
                </Link>
              </li>
            </ul>
          </div>

          {/* সহায়তা */}
          <div className="text-center md:text-left">
            <h3 className="label-caps mb-4 text-kraft/50 font-semibold tracking-wider">
              সহায়তা
            </h3>
            <ul className="space-y-3 font-body text-sm">
              <li>
                <Link href="/#scholarship" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প
                </Link>
              </li>
              <li>
                <Link href="/scholarship" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  শিক্ষাবৃত্তি আবেদন
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-kraft/70 hover:text-marigold transition-colors duration-200">
                  যোগাযোগ করুন
                </Link>
              </li>
            </ul>
          </div>

          {/* যোগাযোগ */}
          <div className="text-center md:text-left">
            <h3 className="label-caps mb-4 text-kraft/50 font-semibold tracking-wider">
              যোগাযোগ
            </h3>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-center justify-center md:justify-start gap-3 text-kraft/70">
                <FaPhone className="text-marigold text-sm flex-shrink-0" />
                <span>+৮৮০ ১XXX-XXXXXX</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 text-kraft/70">
                <FaEnvelope className="text-marigold text-sm flex-shrink-0" />
                <span>info@oikkotan.org</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 text-kraft/70">
                <FaMapMarkerAlt className="text-marigold text-sm flex-shrink-0" />
                <span className="text-sm">সাতক্ষীরা, বাংলাদেশ</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <a 
                href="#" 
                aria-label="Facebook" 
                className="bg-kraft/10 p-2.5 rounded-full hover:bg-marigold hover:text-ink transition-all duration-300 hover:scale-110"
              >
                <FaFacebook className="text-kraft/70 hover:text-ink text-lg" />
              </a>
              <a 
                href="#" 
                aria-label="YouTube" 
                className="bg-kraft/10 p-2.5 rounded-full hover:bg-marigold hover:text-ink transition-all duration-300 hover:scale-110"
              >
                <FaYoutube className="text-kraft/70 hover:text-ink text-lg" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Donate CTA Banner */}
      <div className="border-t border-kraft/10 bg-gradient-to-r from-marigold/15 via-marigold/5 to-transparent px-6 py-10">
        <div className="container-custom mx-auto flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <h3 className="font-display text-xl font-semibold text-white md:text-2xl">
              আপনার একটি ছোট অনুদান বদলে দিতে পারে একজন শিক্ষার্থীর ভবিষ্যৎ
            </h3>
            <p className="mt-2 max-w-lg font-body text-sm text-kraft/60">
              আজই আমাদের পাশে দাঁড়ান এবং শিক্ষার আলো ছড়িয়ে দিতে সহায়তা করুন।
            </p>
          </div>
          <DonateButton className="shrink-0" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-kraft/10 px-6 py-5">
        <div className="container-custom mx-auto flex flex-col items-center justify-between gap-3 md:flex-row">
          <p className="font-mono text-xs tracking-wide text-kraft/40 text-center md:text-left">
            © {new Date().getFullYear()} ঐক্যতান ফাউন্ডেশন · সর্বস্বত্ব সংরক্ষিত
          </p>
          <p className="font-mono text-xs tracking-wide text-kraft/40 text-center md:text-right">
            রেজিস্টার্ড অলাভজনক সংস্থা · প্রতিষ্ঠিত ২০১৫
          </p>
        </div>
      </div>
    </footer>
  );
}