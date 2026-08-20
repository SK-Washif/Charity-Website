const services = [
  {
    title: "শিক্ষা সহায়তা",
    text: "মেধাবী ও অসচ্ছল শিক্ষার্থীদের জন্য শিক্ষাবৃত্তি, বই-খাতা ও ভর্তি সহায়তা।",
  },
  {
    title: "স্বাস্থ্যসেবা",
    text: "বিনামূল্যে স্বাস্থ্য শিবির, ওষুধ বিতরণ ও জরুরি চিকিৎসা সহায়তা।",
  },
  {
    title: "খাদ্য বিতরণ",
    text: "দুস্থ পরিবারের জন্য নিয়মিত খাদ্যসামগ্রী ও ঈদ/রমজান বিশেষ প্যাকেজ।",
  },
  {
    title: "জরুরি ত্রাণ",
    text: "বন্যা, ঝড় বা যেকোনো দুর্যোগে দ্রুত ত্রাণ ও পুনর্বাসন সহায়তা।",
  },
  {
    title: "দক্ষতা উন্নয়ন",
    text: "তরুণ-তরুণীদের জন্য বিনামূল্যে প্রশিক্ষণ ও কর্মসংস্থান সংযোগ।",
  },
];

export default function Services() {
  return (
    <section id="services" className="anchor-section section border-t border-line bg-paper">
      <span className="label-caps text-stamp">সেবাসমূহ</span>
      <h2 className="mt-2 font-display text-3xl font-semibold">
        আমাদের কার্যক্রম
      </h2>
      <p className="mt-4 max-w-2xl font-body text-ink-muted">
        পাঁচটি মূল খাতে আমরা নিয়মিত কাজ করে যাচ্ছি — প্রতিটি কার্যক্রমের
        অগ্রগতি ও সুবিধাভোগীর সংখ্যা প্রকাশ্যে রাখা হয়।
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-sm border border-line bg-kraft/40 p-6 transition-shadow hover:shadow-md"
          >
            <h3 className="font-display text-lg font-semibold text-ink">
              {s.title}
            </h3>
            <p className="mt-2 font-body text-sm text-ink-muted">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
