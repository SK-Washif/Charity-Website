"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye } from "react-icons/fa";
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
  const [isEditing, setIsEditing] = useState(false);

  //Fetch Data - Real API + localStorage Backup
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAbout();
      if (data && Object.keys(data).length > 0) {
        setForm(data);
        saveCollection(STORE_KEY, data);
      } else {
        setForm(loadCollection(STORE_KEY, defaultData));
      }
    } catch (error) {
      console.error("Failed to fetch about data:", error);
      setForm(loadCollection(STORE_KEY, defaultData));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  //Save - Real API + localStorage Backup
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.updateAbout(form);
      saveCollection(STORE_KEY, form);
      toast.success("সংরক্ষিত হয়েছে");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save to backend:", error);
      saveCollection(STORE_KEY, form);
      toast.success("স্থানীয়ভাবে সংরক্ষিত হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  //Delete - Reset to Default
  async function handleDelete() {
    if (!confirm("আপনি কি সব কন্টেন্ট ডিলিট করে ডিফল্টে রিসেট করতে চান?")) return;
    
    try {
      await api.updateAbout(defaultData);
      setForm(defaultData);
      saveCollection(STORE_KEY, defaultData);
      toast.success("ডিফল্ট কন্টেন্ট রিস্টোর করা হয়েছে");
    } catch (error) {
      console.error("Failed to reset:", error);
      toast.error("রিসেট করতে সমস্যা হয়েছে।");
    }
  }

  if (loading) {
    return <p className="font-body text-sm text-ink-muted">লোড হচ্ছে...</p>;
  }

  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      
      <div className="flex items-center justify-between mt-2">
        <h1 className="font-display text-2xl font-semibold">
          আমাদের কথা (About Us)
        </h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-marigold flex items-center gap-2"
              >
                <FaEdit size={14} /> সম্পাদনা করুন
              </button>
              <button
                onClick={handleDelete}
                className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2"
              >
                <FaTrash size={14} /> রিসেট করুন
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="border border-ink text-ink px-4 py-2 rounded-lg hover:bg-ink hover:text-white transition-colors"
            >
              বাতিল
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের &quot;আমাদের কথা&quot; সেকশনের দুটো ছবি ও লেখা এখান থেকে সম্পাদনা করুন।
      </p>

      {/* ✅ Preview Section - সব কন্টেন্ট দেখায় */}
      {!isEditing ? (
        <div className="mt-6 bg-paper border border-line rounded-xl p-6">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            বর্তমান কন্টেন্ট প্রিভিউ
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="label-caps text-ink-muted">শিরোনাম</h3>
              <p className="text-ink font-medium mt-1">{form.title}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="label-caps text-ink-muted">বিবরণ</h3>
              <p className="text-ink-muted mt-1 text-sm leading-relaxed">{form.description}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mt-6">
            <div>
              <h3 className="label-caps text-ink-muted">লক্ষ্য (Mission)</h3>
              <p className="text-ink-muted mt-1 text-sm leading-relaxed">{form.mission}</p>
            </div>
            <div>
              <h3 className="label-caps text-ink-muted">দৃষ্টিভঙ্গি (Vision)</h3>
              <p className="text-ink-muted mt-1 text-sm leading-relaxed">{form.vision}</p>
            </div>
            <div>
              <h3 className="label-caps text-ink-muted">স্বচ্ছতা (Transparency)</h3>
              <p className="text-ink-muted mt-1 text-sm leading-relaxed">{form.transparency}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div>
              <h3 className="label-caps text-ink-muted">প্রধান ছবি</h3>
              {form.primaryPhoto && (
                <img 
                  src={form.primaryPhoto} 
                  alt="Primary" 
                  className="mt-2 w-32 h-32 object-cover rounded-lg border border-line"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>
            <div>
              <h3 className="label-caps text-ink-muted">দ্বিতীয় ছবি</h3>
              {form.secondaryPhoto && (
                <img 
                  src={form.secondaryPhoto} 
                  alt="Secondary" 
                  className="mt-2 w-32 h-32 object-cover rounded-lg border border-line"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ✅ Edit Mode - ফর্ম দেখায় */
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
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-outline-ink"
            >
              বাতিল
            </button>
          </div>
        </form>
      )}
    </section>
  );
}