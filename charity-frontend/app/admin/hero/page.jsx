"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash, FaPlus, FaGripLines } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection, makeId } from "@/lib/localStore";
import ImageUploader from "@/components/admin/ImageUploader";
import Field from "@/components/forms/Field";
import TextAreaField from "@/components/forms/TextAreaField";

const STORE_KEY = "banners";

const defaultBanners = [
  {
    id: "1",
    imageUrl: "/images/banner-1.jpg",
    title: "শিক্ষাই আলো, শিক্ষাই মুক্তি",
    subtitle: "প্রতিটি শিশুর জন্য মানসম্মত শিক্ষা নিশ্চিত করি",
    description:
      "আমাদের শিক্ষা কার্যক্রমে ৫০০+ শিক্ষার্থী শিক্ষা গ্রহণ করছে। জ্ঞান অর্জনের মাধ্যমে তারা নিজেদের ভবিষ্যত গড়ছে।",
    ctaText: "শিক্ষাবৃত্তির জন্য আবেদন করুন",
    ctaLink: "/scholarship",
    order: 1,
    isActive: true,
  },
  {
    id: "2",
    imageUrl: "/images/banner-2.jpg",
    title: "স্মার্ট বাংলাদেশ গড়ার স্বপ্ন",
    subtitle: "প্রযুক্তি ও শিক্ষার সমন্বয়ে নতুন প্রজন্ম",
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
    title: "শিক্ষা ছাড়া কোনো জাতি উন্নত হতে পারে না",
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

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getBanners();
        setBanners(Array.isArray(data) && data.length ? data : defaultBanners);
      } catch {
        
        setBanners(loadCollection(STORE_KEY, defaultBanners));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim()) {
      toast.error("ছবি ও শিরোনাম আবশ্যক।");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        try {
          await api.updateBanner(editingId, form);
        } catch {
          
        }
        const next = banners.map((b) =>
          b.id === editingId ? { ...b, ...form } : b
        );
        persist(next);
        toast.success("ব্যানার আপডেট হয়েছে।");
      } else {
        const newBanner = {
          id: makeId(),
          order: banners.length + 1,
          ...form,
        };
        try {
          await api.createBanner(newBanner);
        } catch {
          
        }
        persist([...banners, newBanner]);
        toast.success("নতুন ব্যানার যোগ হয়েছে।");
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(banner) {
    setEditingId(banner.id);
    setForm({
      imageUrl: banner.imageUrl,
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      ctaText: banner.ctaText || "শিক্ষাবৃত্তির জন্য আবেদন করুন",
      ctaLink: banner.ctaLink || "/scholarship",
      isActive: banner.isActive !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("এই ব্যানারটি মুছে ফেলতে চান?")) return;
    try {
      await api.deleteBanner(id);
    } catch {
      
    }
    persist(banners.filter((b) => b.id !== id));
    toast.success("ব্যানার মুছে ফেলা হয়েছে।");
    if (editingId === id) resetForm();
  }

  async function toggleActive(banner) {
    const next = banners.map((b) =>
      b.id === banner.id ? { ...b, isActive: !b.isActive } : b
    );
    persist(next);
    try {
      await api.updateBanner(banner.id, { isActive: !banner.isActive });
    } catch {
      
    }
  }

  if (loading) {
    return <p className="font-body text-sm text-ink-muted">লোড হচ্ছে...</p>;
  }

  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      <h1 className="mt-2 font-display text-2xl font-semibold">
        হোম পেজের ব্যানার (Hero)
      </h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের উপরে যে স্লাইড-শো ব্যানার দেখা যায় (৩টা ছবি), তার ছবি ও
        লেখা এখান থেকে যোগ, এডিট বা মুছে ফেলুন।
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-xl space-y-4 rounded-sm border border-line bg-paper p-5"
      >
        <h2 className="label-caps text-ink-muted">
          {editingId ? "ব্যানার এডিট করুন" : "নতুন ব্যানার যোগ করুন"}
        </h2>

        <ImageUploader
          label="ব্যানারের ছবি"
          value={form.imageUrl}
          onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
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

        <label className="flex items-center gap-2 font-body text-sm text-ink">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-line"
          />
          সক্রিয় (হোম পেজে দেখানো হবে)
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-marigold disabled:opacity-60"
          >
            <FaPlus size={12} />
            {saving ? "সেভ হচ্ছে..." : editingId ? "আপডেট করুন" : "যোগ করুন"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-outline-ink">
              বাতিল
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {banners
          .slice()
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-4 rounded-sm border border-line bg-paper p-4 sm:flex-row sm:items-center"
            >
              <FaGripLines className="hidden shrink-0 text-ink-muted sm:block" />
              <div className="relative aspect-[16/7] w-full shrink-0 overflow-hidden rounded-sm border border-line bg-kraft/40 sm:w-48">
                {b.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.imageUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-semibold text-ink">
                  {b.title}
                </h3>
                <p className="mt-1 font-body text-sm text-ink-muted">
                  {b.subtitle}
                </p>
                <button
                  onClick={() => toggleActive(b)}
                  className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${
                    b.isActive !== false
                      ? "bg-ink/10 text-ink"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {b.isActive !== false ? "সক্রিয়" : "নিষ্ক্রিয়"}
                </button>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => handleEdit(b)}
                  aria-label="Edit"
                  className="rounded-sm border border-line p-2 text-ink-muted hover:bg-kraft hover:text-ink"
                >
                  <FaPen size={12} />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  aria-label="Delete"
                  className="rounded-sm border border-line p-2 text-ink-muted hover:bg-red-50 hover:text-red-600"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        {banners.length === 0 && (
          <p className="font-body text-sm text-ink-muted">
            এখনো কোনো ব্যানার যোগ করা হয়নি।
          </p>
        )}
      </div>
    </section>
  );
}
