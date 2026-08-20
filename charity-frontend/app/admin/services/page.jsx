"use client";

import { useState } from "react";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";
import Field from "@/components/forms/Field";
import TextAreaField from "@/components/forms/TextAreaField";

// TODO: ব্যাকএন্ড রেডি হলে GET /api/services থেকে লিস্ট আনতে হবে
const initialServices = [
  { id: 1, title: "শিক্ষা সহায়তা", description: "মেধাবী ও অসচ্ছল শিক্ষার্থীদের জন্য শিক্ষাবৃত্তি, বই-খাতা ও ভর্তি সহায়তা।" },
  { id: 2, title: "স্বাস্থ্যসেবা", description: "বিনামূল্যে স্বাস্থ্য শিবির, ওষুধ বিতরণ ও জরুরি চিকিৎসা সহায়তা।" },
  { id: 3, title: "খাদ্য বিতরণ", description: "দুস্থ পরিবারের জন্য নিয়মিত খাদ্যসামগ্রী ও ঈদ/রমজান বিশেষ প্যাকেজ।" },
  { id: 4, title: "জরুরি ত্রাণ", description: "বন্যা, ঝড় বা যেকোনো দুর্যোগে দ্রুত ত্রাণ ও পুনর্বাসন সহায়তা।" },
  { id: 5, title: "দক্ষতা উন্নয়ন", description: "তরুণ-তরুণীদের জন্য বিনামূল্যে প্রশিক্ষণ ও কর্মসংস্থান সংযোগ।" },
];

const emptyForm = { title: "", description: "" };

export default function AdminServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingId) {
      // TODO: ব্যাকএন্ড রেডি হলে -> await api.put(`/api/services/${editingId}`, form);
      setServices((list) =>
        list.map((s) => (s.id === editingId ? { ...s, ...form } : s))
      );
    } else {
      // TODO: ব্যাকএন্ড রেডি হলে -> await api.post("/api/services", form);
      setServices((list) => [...list, { id: Date.now(), ...form }]);
    }
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(service) {
    setEditingId(service.id);
    setForm({ title: service.title, description: service.description });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleDelete(id) {
    // TODO: ব্যাকএন্ড রেডি হলে -> await api.delete(`/api/services/${id}`);
    setServices((list) => list.filter((s) => s.id !== id));
    if (editingId === id) handleCancelEdit();
  }

  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      <h1 className="mt-2 font-display text-2xl font-semibold">
        Manage Services
      </h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের &quot;সেবাসমূহ&quot; সেকশনে যেসব প্রোগ্রাম দেখা যাবে তা
        এখান থেকে যোগ, এডিট বা মুছে ফেলুন।
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-xl space-y-4 rounded-sm border border-line bg-paper p-5"
      >
        <h2 className="label-caps text-ink-muted">
          {editingId ? "সেবা এডিট করুন" : "নতুন সেবা যোগ করুন"}
        </h2>
        <Field
          label="শিরোনাম"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="যেমন: শিক্ষা সহায়তা"
        />
        <TextAreaField
          label="বিবরণ"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="সংক্ষিপ্ত বিবরণ লিখুন"
        />
        <div className="flex gap-3">
          <button type="submit" className="btn-marigold">
            <FaPlus size={12} />
            {editingId ? "আপডেট করুন" : "যোগ করুন"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="btn-outline-ink"
            >
              বাতিল
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {services.map((s) => (
          <div
            key={s.id}
            className="flex items-start justify-between gap-4 rounded-sm border border-line bg-paper p-5"
          >
            <div>
              <h3 className="font-display text-base font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-1 font-body text-sm text-ink-muted">
                {s.description}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => handleEdit(s)}
                aria-label="Edit"
                className="rounded-sm border border-line p-2 text-ink-muted hover:bg-kraft hover:text-ink"
              >
                <FaPen size={12} />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                aria-label="Delete"
                className="rounded-sm border border-line p-2 text-ink-muted hover:bg-red-50 hover:text-red-600"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="font-body text-sm text-ink-muted">
            এখনো কোনো সেবা যোগ করা হয়নি।
          </p>
        )}
      </div>
    </section>
  );
}
