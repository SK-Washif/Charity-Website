"use client";

import { useState } from "react";
import Field from "@/components/forms/Field";
import TextAreaField from "@/components/forms/TextAreaField";

// TODO: ব্যাকএন্ড রেডি হলে GET /api/content/about থেকে initial state আনতে হবে
const initialData = {
  title: "ঐক্যতান ফাউন্ডেশন সম্পর্কে",
  description:
    "২০১৫ সাল থেকে ঐক্যতান ফাউন্ডেশন একটি রেজিস্টার্ড অলাভজনক সংস্থা হিসেবে কাজ করে যাচ্ছে। শিক্ষাবৃত্তি, স্বাস্থ্যসেবা, খাদ্য বিতরণ ও জরুরি সহায়তার মাধ্যমে আমরা প্রান্তিক ও সুবিধাবঞ্চিত পরিবারগুলোর পাশে দাঁড়াই।",
  mission:
    "শিক্ষা, স্বাস্থ্য ও জরুরি ত্রাণ কার্যক্রমের মাধ্যমে সমাজের সুবিধাবঞ্চিত মানুষদের পাশে দাঁড়ানো এবং তাদের স্বনির্ভর জীবনযাত্রায় সহায়তা করা।",
  vision:
    "এমন একটি সমাজ গড়া যেখানে অর্থনৈতিক সীমাবদ্ধতা কারো শিক্ষা বা মৌলিক অধিকার অর্জনের পথে বাধা হয়ে দাঁড়ায় না।",
  imageUrl: "",
};

export default function AdminAboutPage() {
  const [form, setForm] = useState(initialData);
  const [status, setStatus] = useState(null); // "saving" | "saved" | "error"

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    try {
      // TODO: ব্যাকএন্ড রেডি হলে -> await api.put("/api/content/about", form);
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
        Edit About Us
      </h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের &quot;আমাদের কথা&quot; সেকশনে যা দেখা যাবে তা এখান থেকে
        সম্পাদনা করুন।
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-5">
        <Field
          label="শিরোনাম"
          name="title"
          value={form.title}
          onChange={handleChange}
        />
        <TextAreaField
          label="সংক্ষিপ্ত বিবরণ"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
        />
        <TextAreaField
          label="লক্ষ্য (Mission)"
          name="mission"
          rows={3}
          value={form.mission}
          onChange={handleChange}
        />
        <TextAreaField
          label="দৃষ্টিভঙ্গি (Vision)"
          name="vision"
          rows={3}
          value={form.vision}
          onChange={handleChange}
        />
        <Field
          label="ছবির URL"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://i.ibb.co/..."
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
