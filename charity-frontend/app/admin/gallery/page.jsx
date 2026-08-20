"use client";

import { useState } from "react";
import Image from "next/image";
import { FaTrash, FaPlus, FaImage } from "react-icons/fa";
import Field from "@/components/forms/Field";

// TODO: ব্যাকএন্ড রেডি হলে GET /api/gallery থেকে লিস্ট আনতে হবে
const initialItems = [];

const emptyForm = { title: "", imageUrl: "" };

export default function AdminGalleryPage() {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.imageUrl.trim()) {
      setError("ছবির URL আবশ্যক।");
      return;
    }
    // TODO: ব্যাকএন্ড রেডি হলে -> await api.post("/api/gallery", form);
    // ছবি হোস্টিং ImageBB (i.ibb.co) ব্যবহার করে হবে, তাই এখানে সরাসরি URL যোগ করা হচ্ছে
    setItems((list) => [...list, { id: Date.now(), ...form }]);
    setForm(emptyForm);
  }

  function handleDelete(id) {
    // TODO: ব্যাকএন্ড রেডি হলে -> await api.delete(`/api/gallery/${id}`);
    setItems((list) => list.filter((item) => item.id !== id));
  }

  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      <h1 className="mt-2 font-display text-2xl font-semibold">
        Manage Gallery
      </h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        ছবির URL (ImageBB বা যেকোনো হোস্টেড লিংক) দিয়ে গ্যালারিতে ছবি যোগ
        করুন। হোম পেজের &quot;গ্যালারি&quot; সেকশনে এগুলো দেখা যাবে।
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-xl space-y-4 rounded-sm border border-line bg-paper p-5"
      >
        <h2 className="label-caps text-ink-muted">নতুন ছবি যোগ করুন</h2>
        <Field
          label="শিরোনাম (ঐচ্ছিক)"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="যেমন: খাদ্য বিতরণ কার্যক্রম"
        />
        <Field
          label="ছবির URL"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://i.ibb.co/..."
        />
        {error && <p className="font-body text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-marigold">
          <FaPlus size={12} />
          যোগ করুন
        </button>
      </form>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-sm border border-line bg-kraft/40"
          >
            <Image
              src={item.imageUrl}
              alt={item.title || "গ্যালারি ছবি"}
              fill
              unoptimized
              className="object-cover"
            />
            <button
              onClick={() => handleDelete(item.id)}
              aria-label="Delete"
              className="absolute right-2 top-2 rounded-sm bg-ink/80 p-2 text-kraft opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
            >
              <FaTrash size={12} />
            </button>
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
