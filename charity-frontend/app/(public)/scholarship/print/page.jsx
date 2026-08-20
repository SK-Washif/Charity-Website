export default function ScholarshipPrintPage() {
  return (
    <section className="section print:mx-0 print:max-w-none print:px-0 print:py-0">
      <span className="label-caps text-stamp print:hidden">
        নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প — আবেদন ধাপ ২ (প্রিন্টযোগ্য)
      </span>
      <h1 className="mt-2 font-display text-3xl font-semibold print:hidden">
        Printable Scholarship Form
      </h1>
      <p className="mt-4 max-w-xl font-body text-ink-muted print:hidden">
        Stage 1-এর ১০টা ডেটা এখানে prefilled থাকবে (client state থেকে),
        বাকি ফিল্ড ফাঁকা থাকবে হাতে পূরণের জন্য। A4-friendly,
        print-only CSS ধাপ ২-এ যোগ হবে।
      </p>
    </section>
  );
}
