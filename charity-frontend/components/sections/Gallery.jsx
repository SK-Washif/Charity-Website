// প্লেসহোল্ডার গ্যালারি — পরবর্তীতে real ইমেজ (ImageBB URL) দিয়ে বদলানো হবে।
const placeholders = Array.from({ length: 6 }, (_, i) => i + 1);

export default function Gallery() {
  return (
    <section id="gallery" className="anchor-section section border-t border-line">
      <span className="label-caps text-stamp">গ্যালারি</span>
      <h2 className="mt-2 font-display text-3xl font-semibold">
        কার্যক্রমের কিছু মুহূর্ত
      </h2>
      <p className="mt-4 max-w-2xl font-body text-ink-muted">
        মাঠপর্যায়ের কার্যক্রম, বিতরণ অনুষ্ঠান ও উপকারভোগীদের কিছু ছবি।
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {placeholders.map((n) => (
          <div
            key={n}
            className="flex aspect-square items-center justify-center rounded-sm border border-dashed border-line bg-kraft/50 font-mono text-xs text-ink-muted"
          >
            ছবি {n}
          </div>
        ))}
      </div>
    </section>
  );
}
