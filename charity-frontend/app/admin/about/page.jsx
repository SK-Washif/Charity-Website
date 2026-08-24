"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { loadCollection, saveCollection } from "@/lib/localStore";
import ImageUploader from "@/components/admin/ImageUploader";
import Field from "@/components/forms/Field";
import TextAreaField from "@/components/forms/TextAreaField";

const STORE_KEY = "about";


const defaultData = {
  title: "ঐক্যতান ফাউন্ডেশন সম্পর্কে",
  description:
    "২০১৫ সাল থেকে ঐক্যতান ফাউন্ডেশন একটি রেজিস্টার্ড অলাভজনক সংস্থা হিসেবে কাজ করে যাচ্ছে। শিক্ষাবৃত্তি, স্বাস্থ্যসেবা, খাদ্য বিতরণ ও জরুরি সহায়তার মাধ্যমে আমরা প্রান্তিক ও সুবিধাবঞ্চিত পরিবারগুলোর পাশে দাঁড়াই — যাতে তারা মর্যাদার সাথে নিজেদের জীবন গড়ে তুলতে পারে।",
  mission:
    "শিক্ষা, স্বাস্থ্য ও জরুরি ত্রাণ কার্যক্রমের মাধ্যমে সমাজের সুবিধাবঞ্চিত মানুষদের পাশে দাঁড়ানো এবং তাদের স্বনির্ভর জীবনযাত্রায় সহায়তা করা।",
  vision:
    "এমন একটি সমাজ গড়া যেখানে অর্থনৈতিক সীমাবদ্ধতা কারো শিক্ষা বা মৌলিক অধিকার অর্জনের পথে বাধা হয়ে দাঁড়ায় না।",
  transparency:
    "প্রতিটি অনুদান ও ব্যয়ের হিসাব প্রকাশ্যে রাখা হয় — আমরা বিশ্বাস করি জবাবদিহিতাই একটি সংস্থার আসল ভিত্তি।",
  primaryPhoto: "/images/about-primary.jpg",
  secondaryPhoto: "/images/about-secondary.jpg",
};

export default function AdminAboutPage() {
  const [form, setForm] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getAbout();
        setForm(data && Object.keys(data).length ? data : defaultData);
      } catch {
        setForm(loadCollection(STORE_KEY, defaultData));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    saveCollection(STORE_KEY, form);
    try {
      await api.updateAbout(form);
    } catch {
      /* ব্যাকএন্ড আনরিচেবল — localStorage-ই এখন সোর্স অফ ট্রুথ */
    } finally {
      setSaving(false);
      toast.success("সংরক্ষিত হয়েছে।");
    }
  }

  if (loading) {
    return <p className="font-body text-sm text-ink-muted">লোড হচ্ছে...</p>;
  }

  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      <h1 className="mt-2 font-display text-2xl font-semibold">
        Edit About Us
      </h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের &quot;আমাদের কথা&quot; সেকশনের দুটো ছবি ও লেখা এখান থেকে
        সম্পাদনা করুন।
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <ImageUploader
            label="প্রধান ছবি (বড়)"
            value={form.primaryPhoto}
            onChange={(url) => setForm((f) => ({ ...f, primaryPhoto: url }))}
            aspect="aspect-[3/4]"
          />
          <ImageUploader
            label="দ্বিতীয় ছবি (ছোট, ওভারল্যাপিং)"
            value={form.secondaryPhoto}
            onChange={(url) => setForm((f) => ({ ...f, secondaryPhoto: url }))}
            aspect="aspect-square"
          />
        </div>

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
        <TextAreaField
          label="স্বচ্ছতা (Transparency)"
          name="transparency"
          rows={3}
          value={form.transparency}
          onChange={handleChange}
        />

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-marigold disabled:opacity-60"
          >
            {saving ? "সেভ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
        </div>
      </form>
    </section>
  );
}
