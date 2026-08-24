"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaPen, FaPlus, FaImage } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection, makeId } from "@/lib/localStore";
import ImageUploader from "@/components/admin/ImageUploader";
import Field from "@/components/forms/Field";

const STORE_KEY = "gallery";
const emptyForm = { title: "", imageUrl: "" };

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getGallery();
        setItems(Array.isArray(data) ? data : []);
      } catch {
        setItems(loadCollection(STORE_KEY, []));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function persist(next) {
    setItems(next);
    saveCollection(STORE_KEY, next);
  }

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.imageUrl.trim()) {
      setError("ছবি আপলোড করা আবশ্যক।");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        try {
          await api.updateGalleryItem(editingId, form);
        } catch {
         
        }
        persist(items.map((it) => (it.id === editingId ? { ...it, ...form } : it)));
        toast.success("ছবি আপডেট হয়েছে।");
      } else {
        const newItem = { id: makeId(), ...form };
        try {
          await api.createGalleryItem(newItem);
        } catch {
          
        }
        persist([...items, newItem]);
        toast.success("নতুন ছবি যোগ হয়েছে।");
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item) {
    setEditingId(item.id);
    setForm({ title: item.title || "", imageUrl: item.imageUrl });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("এই ছবিটি মুছে ফেলতে চান?")) return;
    try {
      await api.deleteGalleryItem(id);
    } catch {
      
    }
    persist(items.filter((it) => it.id !== id));
    toast.success("ছবি মুছে ফেলা হয়েছে।");
    if (editingId === id) resetForm();
  }

  if (loading) {
    return <p className="font-body text-sm text-ink-muted">লোড হচ্ছে...</p>;
  }

  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      <h1 className="mt-2 font-display text-2xl font-semibold">
        Manage Gallery
      </h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        ছবি আপলোড করুন ও শিরোনাম লিখুন — হোম পেজের &quot;গ্যালারি&quot;
        সেকশনে এগুলো দেখা যাবে।
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-xl space-y-4 rounded-sm border border-line bg-paper p-5"
      >
        <h2 className="label-caps text-ink-muted">
          {editingId ? "ছবি এডিট করুন" : "নতুন ছবি যোগ করুন"}
        </h2>

        <ImageUploader
          label="ছবি"
          value={form.imageUrl}
          onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          aspect="aspect-[4/3]"
        />
        <Field
          label="শিরোনাম (ঐচ্ছিক)"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="যেমন: খাদ্য বিতরণ কার্যক্রম"
        />

        {error && <p className="font-body text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-marigold disabled:opacity-60">
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

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-sm border border-line bg-kraft/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title || "গ্যালারি ছবি"}
              className="h-full w-full object-cover"
            />
            <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => handleEdit(item)}
                aria-label="Edit"
                className="rounded-sm bg-ink/80 p-2 text-kraft hover:bg-stamp"
              >
                <FaPen size={12} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                aria-label="Delete"
                className="rounded-sm bg-ink/80 p-2 text-kraft hover:bg-red-600"
              >
                <FaTrash size={12} />
              </button>
            </div>
            {item.title && (
              <span className="absolute inset-x-0 bottom-0 bg-ink/70 px-2 py-1 font-body text-xs text-kraft">
                {item.title}
              </span>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-2 rounded-sm border border-dashed border-line py-12 text-ink-muted">
            <FaImage size={22} />
            <p className="font-body text-sm">এখনো কোনো ছবি যোগ করা হয়নি।</p>
          </div>
        )}
      </div>
    </section>
  );
}
