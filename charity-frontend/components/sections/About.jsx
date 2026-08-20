const values = [
  {
    title: "লক্ষ্য (Mission)",
    text: "শিক্ষা, স্বাস্থ্য ও জরুরি ত্রাণ কার্যক্রমের মাধ্যমে সমাজের সুবিধাবঞ্চিত মানুষদের পাশে দাঁড়ানো এবং তাদের স্বনির্ভর জীবনযাত্রায় সহায়তা করা।",
  },
  {
    title: "দৃষ্টিভঙ্গি (Vision)",
    text: "এমন একটি সমাজ গড়া যেখানে অর্থনৈতিক সীমাবদ্ধতা কারো শিক্ষা বা মৌলিক অধিকার অর্জনের পথে বাধা হয়ে দাঁড়ায় না।",
  },
  {
    title: "স্বচ্ছতা (Transparency)",
    text: "প্রতিটি অনুদান ও ব্যয়ের হিসাব প্রকাশ্যে রাখা হয় — আমরা বিশ্বাস করি জবাবদিহিতাই একটি সংস্থার আসল ভিত্তি।",
  },
];

export default function About() {
  return (
    <section id="about" className="anchor-section section border-t border-line">
      <span className="label-caps text-stamp">আমাদের কথা</span>
      <h2 className="mt-2 font-display text-3xl font-semibold">
        ঐক্যতান ফাউন্ডেশন সম্পর্কে
      </h2>
      <p className="mt-4 max-w-2xl font-body text-ink-muted">
        ২০১৫ সাল থেকে ঐক্যতান ফাউন্ডেশন একটি রেজিস্টার্ড অলাভজনক সংস্থা
        হিসেবে কাজ করে যাচ্ছে। শিক্ষাবৃত্তি, স্বাস্থ্যসেবা, খাদ্য বিতরণ ও
        জরুরি সহায়তার মাধ্যমে আমরা প্রান্তিক ও সুবিধাবঞ্চিত পরিবারগুলোর
        পাশে দাঁড়াই — যাতে তারা মর্যাদার সাথে নিজেদের জীবন গড়ে তুলতে পারে।
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="border-t-2 border-marigold pt-4">
            <h3 className="font-display text-lg font-semibold text-ink">
              {v.title}
            </h3>
            <p className="mt-2 font-body text-sm text-ink-muted">{v.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
