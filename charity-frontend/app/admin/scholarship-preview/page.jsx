"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { loadCollection, saveCollection } from "@/lib/localStore";
import ImageUploader from "@/components/admin/ImageUploader";

const STORE_KEY = "scholarshipPreview";
const defaultData = { imageUrl: "/images/scholarship-preview.jpg" };

export default function AdminScholarshipPreviewPage() {
  const [form, setForm] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getScholarshipPreview();
        setForm(data && data.imageUrl ? data : defaultData);
      } catch {
        setForm(loadCollection(STORE_KEY, defaultData));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave(next) {
    setForm(next);
    setSaving(true);
    saveCollection(STORE_KEY, next);
    try {
      await api.updateScholarshipPreview(next);
    } catch {
     
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
        শিক্ষাবৃত্তি প্রিভিউ ছবি
      </h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের &quot;নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প&quot; সেকশনে যে
        ছবিটি দেখা যায়, সেটি এখান থেকে বদলান বা মুছুন।
      </p>

      <div className="mt-6 max-w-sm">
        <ImageUploader
          label="ছবি"
          value={form.imageUrl}
          onChange={(url) => handleSave({ ...form, imageUrl: url })}
          aspect="aspect-[4/3]"
          helpText={saving ? "সেভ হচ্ছে..." : undefined}
        />
      </div>
    </section>
  );
}
