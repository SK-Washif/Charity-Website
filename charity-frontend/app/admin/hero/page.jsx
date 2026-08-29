"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash, FaPlus, FaGripLines, FaUndo } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection } from "@/lib/localStore";
import ImageUploader from "@/components/admin/ImageUploader";
import Field from "@/components/forms/Field";
import TextAreaField from "@/components/forms/TextAreaField";

const STORE_KEY = "banners";

//Default Banners
const defaultBanners = [
  {
    id: "1",
    imageUrl: "/images/banner-1.jpg",
    title: "শিক্ষাই আলো, শিক্ষাই মুক্তি",
    subtitle: "প্রতিটি শিশুর জন্য মানসম্মত শিক্ষা নিশ্চিত করি",
    description:
      "আমাদের শিক্ষা কার্যক্রমে ৫০০+ শিক্ষার্থী শিক্ষা গ্রহণ করছে। জ্ঞান অর্জনের মাধ্যমে তারা নিজেদের ভবিষ্যত গড়ছে।",
    ctaText: "শিক্ষাবৃত্তির জন্য আবেদন করুন",
    ctaLink: "/scholarship",
    order: 1,
    isActive: true,
  },
  {
    id: "2",
    imageUrl: "/images/banner-2.jpg",
    title: "স্মার্ট বাংলাদেশ গড়ার স্বপ্ন",
    subtitle: "প্রযুক্তি ও শিক্ষার সমন্বয়ে নতুন প্রজন্ম",
    description:
      "ডিজিটাল শিক্ষার মাধ্যমে আমরা তৈরি করছি দক্ষ ও আত্মনির্ভরশীল জনগোষ্ঠী।",
    ctaText: "শিক্ষাবৃত্তির জন্য আবেদন করুন",
    ctaLink: "/scholarship",
    order: 2,
    isActive: true,
  },
  {
    id: "3",
    imageUrl: "/images/banner-3.jpg",
    title: "শিক্ষা ছাড়া কোনো জাতি উন্নত হতে পারে না",
    subtitle: "আমাদের লক্ষ্য - সবার জন্য শিক্ষা",
    description:
      "সাতক্ষীরার প্রতিটি প্রান্তে পৌঁছে দিচ্ছি শিক্ষার আলো। আপনার সহযোগিতা আমাদের শক্তি।",
    ctaText: "শিক্ষাবৃত্তির জন্য আবেদন করুন",
    ctaLink: "/scholarship",
    order: 3,
    isActive: true,
  },
];

const emptyForm = {
  imageUrl: "",
  title: "",
  subtitle: "",
  description: "",
  ctaText: "শিক্ষাবৃত্তির জন্য আবেদন করুন",
  ctaLink: "/scholarship",
  isActive: true,
};

export default function AdminHeroPage() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  //Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getBanners();
      
      console.log('📥 Admin fetch banners:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        setBanners(data);
        saveCollection(STORE_KEY, data);
      } else {
        setBanners([]);
        saveCollection(STORE_KEY, []);
      }
    } catch (error) {
      console.error("❌ Failed to fetch banners:", error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function persist(next) {
    setBanners(next);
    saveCollection(STORE_KEY, next);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  //Reset to Default
  async function handleReset() {
    if (!confirm("সব ব্যানার ডিফল্টে রিসেট করতে চান?")) return;

    setSaving(true);
    try {
      for (const banner of banners) {
        await api.deleteBanner(banner.id);
      }
      for (const banner of defaultBanners) {
        await api.createBanner({
          imageUrl: banner.imageUrl,
          title: banner.title,
          subtitle: banner.subtitle,
          description: banner.description,
          ctaText: banner.ctaText,
          ctaLink: banner.ctaLink,
          order: banner.order,
          isActive: banner.isActive,
        });
      }
      setBanners(defaultBanners);
      saveCollection(STORE_KEY, defaultBanners);
      toast.success("ব্যানার ডিফল্টে রিসেট করা হয়েছে ✅");
      await fetchData();
    } catch (error) {
      console.error("❌ Reset error:", error);
      toast.error("রিসেট করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim()) {
      toast.error("ছবি ও শিরোনাম আবশ্যক।");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.updateBanner(editingId, {
          imageUrl: form.imageUrl,
          title: form.title,
          subtitle: form.subtitle,
          description: form.description,
          ctaText: form.ctaText,
          ctaLink: form.ctaLink,
          isActive: form.isActive,
        });
        const next = banners.map((b) =>
          b.id === editingId ? { ...b, ...form } : b
        );
        persist(next);
        toast.success("ব্যানার আপডেট হয়েছে ✅");
      } else {
        const newBanner = {
          imageUrl: form.imageUrl,
          title: form.title,
          subtitle: form.subtitle,
          description: form.description,
          ctaText: form.ctaText,
          ctaLink: form.ctaLink,
          order: banners.length + 1,
          isActive: form.isActive,
        };
        const saved = await api.createBanner(newBanner);
        const newItem = {
          id: saved.id || saved._id || Date.now().toString(),
          ...newBanner,
        };
        persist([...banners, newItem]);
        toast.success("নতুন ব্যানার যোগ হয়েছে ✅");
      }
      resetForm();
    } catch (error) {
      console.error("❌ Save error:", error);
      toast.error(error?.message || "সেভ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(banner) {
    setEditingId(banner.id);
    setForm({
      imageUrl: banner.imageUrl || "",
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      ctaText: banner.ctaText || "শিক্ষাবৃত্তির জন্য আবেদন করুন",
      ctaLink: banner.ctaLink || banner.ctaLinks || "/scholarship",
      isActive: banner.isActive !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("এই ব্যানারটি মুছে ফেলতে চান?")) return;
    
    try {
      await api.deleteBanner(id);
      persist(banners.filter((b) => b.id !== id));
      toast.success("ব্যানার মুছে ফেলা হয়েছে ✅");
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("❌ Delete error:", error);
      toast.error(error?.message || "মুছতে সমস্যা হয়েছে।");
    }
  }

  async function toggleActive(banner) {
    const next = banners.map((b) =>
      b.id === banner.id ? { ...b, isActive: !b.isActive } : b
    );
    persist(next);
    try {
      await api.updateBanner(banner.id, { isActive: !banner.isActive });
    } catch (error) {
      console.error("❌ Toggle error:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-ink-muted">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <span className="label-caps text-stamp">Admin / Hero</span>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <h1 className="font-display text-2xl font-semibold text-ink">
          হোম পেজের ব্যানার (Hero)
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={saving}
            className="border border-orange-500 text-orange-500 px-3 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <FaUndo size={12} /> রিসেট
          </button>
        </div>
      </div>

      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের উপরে যে স্লাইড-শো ব্যানার দেখা যায়, তার ছবি ও লেখা এখান থেকে যোগ, এডিট বা মুছে ফেলুন।
        <span className="block mt-1 text-orange-500 text-xs">
          ⚡ সব ডিলিট করলে ফাকা থাকবে। রিসেট বাটনে ক্লিক করলে ডিফল্ট ফিরে আসবে।
        </span>
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-xl space-y-4 rounded-xl border border-line bg-paper p-5 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="label-caps text-ink-muted">
            {editingId ? "✏️ ব্যানার এডিট করুন" : "➕ নতুন ব্যানার যোগ করুন"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-ink-muted hover:text-ink transition-colors"
            >
              <FaPlus size={16} className="rotate-45" />
            </button>
          )}
        </div>

        <ImageUploader
          label="ব্যানারের ছবি"
          value={form.imageUrl}
          onChange={(url) => {
            console.log('📸 Banner image URL:', url);
            setForm((f) => ({ ...f, imageUrl: url }));
          }}
          aspect="aspect-[16/7]"
        />

        <Field
          label="শিরোনাম (Title)"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="যেমন: শিক্ষাই আলো, শিক্ষাই মুক্তি"
        />
        <Field
          label="সাব-টাইটেল (Subtitle)"
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          placeholder="যেমন: প্রতিটি শিশুর জন্য মানসম্মত শিক্ষা নিশ্চিত করি"
        />
        <TextAreaField
          label="বিবরণ (Description)"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="বাটনের লেখা (CTA)"
            name="ctaText"
            value={form.ctaText}
            onChange={handleChange}
          />
          <Field
            label="বাটনের লিংক"
            name="ctaLink"
            value={form.ctaLink}
            onChange={handleChange}
          />
        </div>

        <label className="flex items-center gap-2 font-body text-sm text-ink cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-line accent-marigold"
          />
          সক্রিয় (হোম পেজে দেখানো হবে)
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-marigold disabled:opacity-60 flex items-center gap-2"
          >
            <FaPlus size={12} />
            {saving ? "⏳ সেভ হচ্ছে..." : editingId ? "আপডেট করুন" : "যোগ করুন"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-outline-ink">
              বাতিল
            </button>
          )}
        </div>
      </form>

      {/* Banners List */}
      {banners.length === 0 ? (
        <div className="mt-8 text-center py-8 text-ink-muted border border-dashed border-line rounded-xl">
          <p className="font-body text-sm">এখনো কোনো ব্যানার যোগ করা হয়নি।</p>
          <p className="font-body text-xs mt-1">উপরের ফর্ম ব্যবহার করে নতুন ব্যানার যোগ করুন।</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {banners
            .slice()
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((b) => (
              <div
                key={b.id}
                className="flex flex-col gap-4 rounded-xl border border-line bg-paper p-4 shadow-sm hover:shadow-md transition-shadow sm:flex-row sm:items-center"
              >
                <FaGripLines className="hidden shrink-0 text-ink-muted sm:block" />
                <div className="relative aspect-[16/7] w-full shrink-0 overflow-hidden rounded-lg border border-line bg-kraft/40 sm:w-48">
                  {b.imageUrl && (
                    <img 
                      src={b.imageUrl} 
                      alt={b.title} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/banner-1.jpg';
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base font-semibold text-ink truncate">
                    {b.title}
                  </h3>
                  <p className="mt-1 font-body text-sm text-ink-muted truncate">
                    {b.subtitle}
                  </p>
                  <button
                    onClick={() => toggleActive(b)}
                    className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${
                      b.isActive !== false
                        ? "bg-green-100 text-green-700"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {b.isActive !== false ? "● সক্রিয়" : "○ নিষ্ক্রিয়"}
                  </button>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleEdit(b)}
                    aria-label="Edit"
                    className="rounded-lg border border-line p-2 text-ink-muted hover:bg-kraft hover:text-ink transition-colors"
                  >
                    <FaPen size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    aria-label="Delete"
                    className="rounded-lg border border-line p-2 text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}