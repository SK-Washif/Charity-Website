"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaTimes, FaEye, FaSpinner } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection } from "@/lib/localStore";
import ImageUploader from "@/components/admin/ImageUploader";

const STORE_KEY = "scholarshipPreview";
const defaultData = { imageUrl: "/images/scholarship-preview.jpg" };

export default function AdminScholarshipPreviewPage() {
  const [form, setForm] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getScholarshipPreview();
      console.log("📥 Admin fetch data:", data);
      
      if (data && data.imageUrl && data.imageUrl.trim() !== '') {
        setForm({ imageUrl: data.imageUrl });
        saveCollection(STORE_KEY, { imageUrl: data.imageUrl });
      } else {
        const localData = loadCollection(STORE_KEY, defaultData);
        setForm(localData);
      }
    } catch (error) {
      console.error("❌ Failed to fetch:", error);
      setForm(loadCollection(STORE_KEY, defaultData));
    } finally {
      setLoading(false);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!form.imageUrl || !form.imageUrl.trim()) {
      toast.error("ছবি আপলোড করা আবশ্যক।");
      return;
    }

    setSaving(true);
    try {
      console.log("📤 Saving image:", form.imageUrl);
      
      // Save to backend
      await api.updateScholarshipPreview({ imageUrl: form.imageUrl });
      
      //Save to localStorage
      saveCollection(STORE_KEY, { imageUrl: form.imageUrl });
      
      toast.success("ছবি সংরক্ষিত হয়েছে ✅");
      setIsEditing(false);
      
      //Refetch to confirm
      await fetchData();
    } catch (error) {
      console.error("❌ Failed to save:", error);
      toast.error(error?.message || "সেভ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm("আপনি কি ডিফল্ট ছবি রিস্টোর করতে চান?")) return;

    setSaving(true);
    try {
      await api.updateScholarshipPreview(defaultData);
      setForm(defaultData);
      saveCollection(STORE_KEY, defaultData);
      toast.success("ডিফল্ট ছবি রিস্টোর করা হয়েছে ✅");
      setIsEditing(false);
      await fetchData();
    } catch (error) {
      console.error("❌ Failed to reset:", error);
      toast.error("রিস্টোর করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-marigold text-2xl" />
        <span className="ml-2 text-ink-muted">লোড হচ্ছে...</span>
      </div>
    );
  }

  const isDefault = form.imageUrl === defaultData.imageUrl;

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <span className="label-caps text-stamp">Admin / Scholarship</span>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <h1 className="font-display text-2xl font-semibold text-ink">
          শিক্ষাবৃত্তি প্রিভিউ ছবি
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
              {!isDefault && (
                <button
                  onClick={handleReset}
                  disabled={saving}
                  className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <FaTrash size={14} /> রিস্টোর করুন
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                fetchData();
              }}
              className="border border-ink text-ink px-4 py-2 rounded-lg hover:bg-ink hover:text-white transition-colors flex items-center gap-2"
            >
              <FaTimes size={14} /> বাতিল
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের &quot;নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প&quot; সেকশনে যে
        ছবিটি দেখা যায়, সেটি এখান থেকে বদলান বা মুছুন।
        {isDefault && (
          <span className="block mt-1 text-marigold font-semibold">
            ⚡ বর্তমানে ডিফল্ট ছবি দেখাচ্ছে।
          </span>
        )}
        {!isDefault && (
          <span className="block mt-1 text-green-600 font-semibold break-all">
            ✅ কাস্টম ছবি
          </span>
        )}
      </p>

      {/* Preview Section */}
      {!isEditing ? (
        <div className="mt-6 bg-paper border border-line rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FaEye className="text-marigold" />
            <h2 className="font-display text-lg font-semibold text-ink">
              বর্তমান প্রিভিউ
            </h2>
            {isDefault ? (
              <span className="ml-auto text-xs bg-marigold/20 text-marigold px-2 py-1 rounded-full">
                ডিফল্ট
              </span>
            ) : (
              <span className="ml-auto text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded-full">
                কাস্টম
              </span>
            )}
          </div>

          <div className="max-w-sm mx-auto">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-paper shadow-sm">
              <img
                src={form.imageUrl}
                alt="Scholarship Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  console.error("❌ Admin preview image failed:", form.imageUrl);
                  e.target.src = defaultData.imageUrl;
                }}
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-ink-muted">
              {isDefault 
                ? "📷 ডিফল্ট ছবি ব্যবহার হচ্ছে" 
                : "🖼️ কাস্টম ছবি ব্যবহার হচ্ছে"}
            </p>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-6 border border-line rounded-xl p-6 bg-paper shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="label-caps text-ink-muted">
              ✏️ ছবি সম্পাদনা করুন
            </h2>
          </div>

          <ImageUploader
            label="ছবি"
            value={form.imageUrl}
            onChange={(url) => {
              console.log("📸 New image URL:", url);
              setForm((f) => ({ ...f, imageUrl: url }));
            }}
            aspect="aspect-[4/3]"
            helpText="JPG, PNG, WEBP - সর্বোচ্চ ১০MB"
          />

          <div className="flex items-center gap-4 pt-4 border-t border-line">
            <button
              type="submit"
              disabled={saving}
              className="btn-marigold disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" size={14} />
                  সেভ হচ্ছে...
                </>
              ) : (
                "💾 সংরক্ষণ করুন"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                fetchData();
              }}
              className="btn-outline-ink"
            >
              বাতিল
            </button>
            {!isDefault && (
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
              >
                ডিফল্ট রিস্টোর করুন
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}