"use client";

import { useState } from "react";
import Field from "@/components/forms/Field";

// TODO: ব্যাকএন্ড রেডি হলে GET /api/content/contact থেকে initial state আনতে হবে
const initialData = {
  phone: "+৮৮০ ১XXX-XXXXXX",
  email: "info@example.org",
  address: "ঢাকা, বাংলাদেশ",
  facebook: "",
  youtube: "",
};

export default function AdminContactPage() {
  const [form, setForm] = useState(initialData);
  const [status, setStatus] = useState(null); // "saving" | "saved" | "error"

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    try {
      // TODO: ব্যাকএন্ড রেডি হলে -> await api.put("/api/content/contact", form);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      <h1 className="mt-2 font-display text-2xl font-semibold">
        Edit Contact Info
      </h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের &quot;যোগাযোগ&quot; সেকশন ও ফুটারে যা দেখা যাবে তা এখান
        থেকে সম্পাদনা করুন।
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-5">
        <Field
          label="ফোন নম্বর"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
        <Field
          label="ইমেইল"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <Field
          label="ঠিকানা"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
        <Field
          label="ফেসবুক লিংক"
          name="facebook"
          value={form.facebook}
          onChange={handleChange}
          placeholder="https://facebook.com/..."
        />
        <Field
          label="ইউটিউব লিংক"
          name="youtube"
          value={form.youtube}
          onChange={handleChange}
          placeholder="https://youtube.com/..."
        />

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === "saving"}
            className="btn-marigold disabled:opacity-60"
          >
            {status === "saving" ? "সেভ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
          {status === "saved" && (
            <span className="font-body text-sm text-ink">
              ✓ সংরক্ষিত হয়েছে
            </span>
          )}
          {status === "error" && (
            <span className="font-body text-sm text-red-600">
              সংরক্ষণ ব্যর্থ হয়েছে
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
