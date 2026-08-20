import Link from "next/link";

export default function ScholarshipPreview() {
  return (
    <section id="scholarship" className="anchor-section section border-t border-line bg-ink text-kraft">
      <span className="label-caps text-marigold">শিক্ষাবৃত্তি কার্যক্রম</span>
      <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-paper">
        নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প
      </h2>
      <p className="mt-4 max-w-2xl font-body text-kraft/80">
        মেধাবী কিন্তু আর্থিকভাবে অসচ্ছল শিক্ষার্থীদের নিয়মিত শিক্ষা
        চালিয়ে যাওয়ার জন্য &quot;নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প&quot;-এর
        আওতায় বৃত্তি প্রদান করা হয়। আবেদনের জন্য প্রয়োজনীয় তথ্যসহ একটি
        সংক্ষিপ্ত ফর্ম পূরণ করলেই আবেদন প্রক্রিয়া শুরু হয়ে যাবে।
      </p>
      <div className="mt-8">
        <Link href="/scholarship" className="btn-marigold">
          শিক্ষাবৃত্তির জন্য আবেদন করুন
        </Link>
      </div>
    </section>
  );
}
