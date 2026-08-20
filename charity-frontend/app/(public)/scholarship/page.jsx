export default function ScholarshipPage() {
  return (
    <section className="section">
      <span className="label-caps text-stamp">
        নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প — আবেদন (ধাপ ১)
      </span>
      <h1 className="mt-2 font-display text-3xl font-semibold">
        Scholarship Application
      </h1>
      <p className="mt-4 max-w-xl font-body text-ink-muted">
        ১০ ফিল্ডের সংক্ষিপ্ত ফর্ম এখানে বসবে (ধাপ ২)। Submit হলে ডেটা
        Google Sheets-এ যাবে এবং ইউজারকে{" "}
        <code className="font-mono text-sm">/scholarship/print</code> পেজে
        নিয়ে যাওয়া হবে prefilled বড় ফর্ম দেখাতে।
      </p>
    </section>
  );
}
