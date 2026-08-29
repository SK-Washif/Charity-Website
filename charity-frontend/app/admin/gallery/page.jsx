"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaEye } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection } from "@/lib/localStore";
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
  const [isEditing, setIsEditing] = useState(false);

  //Fetch Data - Real API + localStorage Backup (About স্টাইলে)
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getGallery();
      if (Array.isArray(data) && data.length > 0) {
        //_id → id mapping (About এর মতো)
        const mappedData = data.map((item) => ({
          id: item._id || item.id,
          title: item.title || "",
          imageUrl: item.imageUrl,
        }));
        setItems(mappedData);
        saveCollection(STORE_KEY, mappedData);
      } else {
        setItems(loadCollection(STORE_KEY, []));
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
      setItems(loadCollection(STORE_KEY, []));
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

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  //Save - Real API + localStorage Backup (About এর মতো)
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.imageUrl.trim()) {
      toast.error("ছবি আপলোড করা আবশ্যক।");
      return;
    }

    setSaving(true);
    try {
      let newItems;

      if (editingId) {
        // Update
        await api.updateGalleryItem(editingId, {
          title: form.title,
          imageUrl: form.imageUrl,
        });
        newItems = items.map((it) =>
          it.id === editingId ? { ...it, ...form } : it
        );
        toast.success("ছবি আপডেট হয়েছে ✅");
      } else {
        // Create
        const savedItem = await api.createGalleryItem({
          title: form.title,
          imageUrl: form.imageUrl,
        });
        const newItem = {
          id: savedItem.id || savedItem._id || Date.now().toString(),
          title: form.title,
          imageUrl: form.imageUrl,
        };
        newItems = [...items, newItem];
        toast.success("নতুন ছবি যোগ হয়েছে ✅");
      }

      setItems(newItems);
      saveCollection(STORE_KEY, newItems);
      resetForm();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save:", error);
      toast.error(error?.message || "সেভ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  //Delete - Real API + localStorage Backup (About এর মতো)
  async function handleDelete(id) {
    if (!confirm("এই ছবিটি মুছে ফেলতে চান?")) return;

    try {
      await api.deleteGalleryItem(id);
      const newItems = items.filter((it) => it.id !== id);
      setItems(newItems);
      saveCollection(STORE_KEY, newItems);
      toast.success("ছবি মুছে ফেলা হয়েছে ✅");
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error(error?.message || "মুছতে সমস্যা হয়েছে।");
    }
  }

  //Edit Mode এ যাওয়া
  function handleEdit(item) {
    setEditingId(item.id);
    setForm({ title: item.title || "", imageUrl: item.imageUrl });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return <p className="font-body text-sm text-ink-muted">লোড হচ্ছে...</p>;
  }

  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>

      <div className="flex items-center justify-between mt-2">
        <h1 className="font-display text-2xl font-semibold">গ্যালারি ম্যানেজ করুন</h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => {
                  resetForm();
                  setIsEditing(true);
                }}
                className="btn-marigold flex items-center gap-2"
              >
                <FaPlus size={14} /> নতুন ছবি যোগ করুন
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                resetForm();
              }}
              className="border border-ink text-ink px-4 py-2 rounded-lg hover:bg-ink hover:text-white transition-colors"
            >
              বাতিল
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        ছবি আপলোড করুন ও শিরোনাম লিখুন — হোম পেজের &quot;গ্যালারি&quot; সেকশনে এগুলো দেখা যাবে।
      </p>

      {/* ✅ Edit Mode - ফর্ম দেখায় (About এর মতো) */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-6 border border-line rounded-xl p-6 bg-paper">
          <div className="flex items-center justify-between">
            <h2 className="label-caps text-ink-muted">
              {editingId ? "✏️ ছবি এডিট করুন" : "➕ নতুন ছবি যোগ করুন"}
            </h2>
          </div>

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

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="btn-marigold disabled:opacity-60"
            >
              {saving ? "সেভ হচ্ছে..." : editingId ? "আপডেট করুন" : "যোগ করুন"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                resetForm();
              }}
              className="btn-outline-ink"
            >
              বাতিল
            </button>
          </div>
        </form>
      ) : (
        /*Preview Section - সব কন্টেন্ট দেখায় (About এর মতো) */
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-ink">
              বর্তমান গ্যালারি প্রিভিউ
            </h2>
            <span className="text-sm text-ink-muted">{items.length} টি ছবি</span>
          </div>

          {items.length === 0 ? (
            <div className="bg-paper border border-line rounded-xl p-12 text-center text-ink-muted">
              <p className="font-body">এখনো কোনো ছবি যোগ করা হয়নি।</p>
              <p className="font-body text-sm mt-2">"নতুন ছবি যোগ করুন" বাটনে ক্লিক করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-paper shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title || "গ্যালারি ছবি"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://picsum.photos/seed/fallback/400/400";
                    }}
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {item.title && (
                        <p className="font-body text-sm text-kraft line-clamp-2">
                          {item.title}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(item)}
                      aria-label="Edit"
                      className="rounded-lg bg-ink/80 p-2 text-kraft hover:bg-marigold hover:text-ink transition-colors backdrop-blur-sm"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete"
                      className="rounded-lg bg-ink/80 p-2 text-kraft hover:bg-red-500 transition-colors backdrop-blur-sm"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}