import Link from "next/link";
import { FaFacebook, FaYoutube, FaEnvelope, FaPhone } from "react-icons/fa";
import Stamp from "@/components/ui/Stamp";

export default function Footer() {
  return (
    <footer className="bg-ink text-kraft">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[auto_1fr_1fr_1fr] md:px-10">
        <Stamp size={64} rotate={5} tone="marigold" lines={["ঐক্য", "তান"]} />

        <div>
          <h3 className="label-caps mb-3 text-kraft/70">সংস্থা</h3>
          <ul className="space-y-2 font-body text-sm">
            <li><Link href="/#about" className="hover:text-marigold">আমাদের কথা</Link></li>
            <li><Link href="/#services" className="hover:text-marigold">সেবাসমূহ</Link></li>
            <li><Link href="/#gallery" className="hover:text-marigold">গ্যালারি</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="label-caps mb-3 text-kraft/70">সহায়তা</h3>
          <ul className="space-y-2 font-body text-sm">
            <li><Link href="/#scholarship" className="hover:text-marigold">নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প</Link></li>
            <li><Link href="/scholarship" className="hover:text-marigold">শিক্ষাবৃত্তি আবেদন</Link></li>
            <li><Link href="/#contact" className="hover:text-marigold">যোগাযোগ করুন</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="label-caps mb-3 text-kraft/70">যোগাযোগ</h3>
          <ul className="space-y-2 font-body text-sm">
            <li className="flex items-center gap-2"><FaPhone size={12} /> +৮৮০ ১XXX-XXXXXX</li>
            <li className="flex items-center gap-2"><FaEnvelope size={12} /> info@example.org</li>
          </ul>
          <div className="mt-4 flex gap-4 text-lg">
            <a href="#" aria-label="Facebook" className="hover:text-marigold"><FaFacebook /></a>
            <a href="#" aria-label="YouTube" className="hover:text-marigold"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-kraft/15 px-6 py-4 text-center font-mono text-xs tracking-wide text-kraft/60 md:px-10">
        রেজিস্টার্ড অলাভজনক সংস্থা · প্রতিষ্ঠিত ২০১৫ · © {new Date().getFullYear()} ঐক্যতান ফাউন্ডেশন
      </div>
    </footer>
  );
}
