"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection } from "@/lib/localStore";
import { getIcon } from "@/lib/iconMap";
import IconPicker from "@/components/admin/IconPicker";
import Field from "@/components/forms/Field";

const STORE_KEY = "stats";

const defaultStats = [
  // { id: "1", label: "মেধাবী শিক্ষার্থী পেয়েছে বৃত্তি", value: "214", suffix: "+", icon: "FaUsers" },
  // { id: "2", label: "শিক্ষার্থী পেয়েছে A+", value: "1,340", suffix: "+", icon: "FaStar" },
  // { id: "3", label: "সক্রিয় শিক্ষা কার্যক্রম", value: "5", suffix: "", icon: "FaHandsHelping" },
  // { id: "4", label: "কার্যকর বছর", value: "9", suffix: "+", icon: "FaClock" },
];

const emptyForm = { label: "", value: "", suffix: "+", icon: "FaStar" };

export default function AdminStatsPage() {
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  //Fetch Stats - Real API থেকে ডেটা আনে
  const fetchStats = useCallback(async () => {
    // try {
    //   setLoading(true);
    //   const data = await api.getStats();
      
    //   if (Array.isArray(data) && data.length > 0) {
    //     const mappedData = data.map((item) => ({
    //       id: item._id || item.id,
    //       label: item.label,
    //       value: item.value,
    //       suffix: item.suffix || "",
    //       icon: item.icon || "FaStar",
    //     }));
    //     setStats(mappedData);
    //     saveCollection(STORE_KEY, mappedData);
    //   } else {
    //     setStats(loadCollection(STORE_KEY, defaultStats));
    //   }
    // } catch (error) {
    //   console.error("Failed to fetch stats:", error);
    //   setStats(loadCollection(STORE_KEY, defaultStats));
    // } finally {
    //   setLoading(false);
    // }
  }, []);

  // useEffect(() => {
  //   fetchStats();
  // }, [fetchStats]);

  //Real API + localStorage Backup
  // const persist = useCallback(async (next) => {
  //   setStats(next);
  //   saveCollection(STORE_KEY, next);
  //   try {
  //     await api.updateStats(next);
  //   } catch (error) {
  //     console.error("Failed to save to backend:", error);
  //     toast.error("ব্যাকএন্ডে সংরক্ষণ করতে সমস্যা হয়েছে। স্থানীয়ভাবে সেভ করা হয়েছে।");
  //   }
  // }, []);

  // function handleChange(e) {
  //   setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  // }

  // function resetForm() {
  //   setForm(emptyForm);
  //   setEditingId(null);
  // }

  //Create/Update - Real API
  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   if (!form.label.trim() || !form.value.trim()) {
  //     toast.error("লেবেল ও মান আবশ্যক।");
  //     return;
  //   }
  //   setSaving(true);

  //   try {
  //     let next;
  //     let savedItem;

  //     if (editingId) {
  //       //Update - Real API
  //       const updateData = {
  //         label: form.label,
  //         value: form.value,
  //         suffix: form.suffix || "",
  //         icon: form.icon,
  //       };
  //       savedItem = await api.updateStats([...stats.map(s => 
  //         s.id === editingId ? { ...s, ...updateData } : s
  //       )]);
  //       //UI Update
  //       next = stats.map((s) => 
  //         (s.id === editingId) ? { ...s, ...updateData } : s
  //       );
  //       toast.success("কার্ড আপডেট হয়েছে ✅");
  //     } else {
  //       //Create - Real API
  //       const newData = {
  //         id: Date.now().toString(),
  //         label: form.label,
  //         value: form.value,
  //         suffix: form.suffix || "",
  //         icon: form.icon,
  //       };
  //       next = [...stats, newData];
  //       savedItem = await api.updateStats(next);
  //       toast.success("নতুন কার্ড যোগ হয়েছে ✅");
  //     }

  //     //UI Update + localStorage Backup
  //     await persist(next);
  //     resetForm();

  //   } catch (error) {
  //     console.error("Submit error:", error);
  //     toast.error("সংরক্ষণ করতে সমস্যা হয়েছে।");
  //     //Rollback - আবার ডেটা fetch করে
  //     await fetchStats();
  //   } finally {
  //     setSaving(false);
  //   }
  // }

  // function handleEdit(stat) {
  //   setEditingId(stat.id);
  //   setForm({
  //     label: stat.label,
  //     value: stat.value,
  //     suffix: stat.suffix || "",
  //     icon: stat.icon || "FaStar",
  //   });
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }

  // async function handleDelete(id) {
  //   if (!confirm("এই কার্ডটি মুছে ফেলতে চান?")) return;
    
  //   try {
  //     //UI থেকে Remove
  //     const next = stats.filter((s) => s.id !== id);
  //     await persist(next);
  //     toast.success("কার্ড মুছে ফেলা হয়েছে ✅");
      
  //     if (editingId === id) resetForm();
  //   } catch (error) {
  //     console.error("Delete error:", error);
  //     toast.error("মুছে ফেলতে সমস্যা হয়েছে।");
  //     //Rollback
  //     await fetchStats();
  //   }
  // }

  // if (loading) {
  //   return <p className="font-body text-sm text-ink-muted">লোড হচ্ছে...</p>;
  // }

  return (
    <section>
      {/* <span className="label-caps text-stamp">Admin</span>
      <h1 className="mt-2 font-display text-2xl font-semibold">
        এক নজরে পরিসংখ্যান
      </h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের পরিসংখ্যান কার্ডগুলো (যেমন &quot;২১৪+ শিক্ষার্থী পেয়েছে
        বৃত্তি&quot;) এখান থেকে যোগ, এডিট বা মুছে ফেলুন।
      </p> */}

      {/* <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-xl space-y-4 rounded-sm border border-line bg-paper p-5"
      >
        <h2 className="label-caps text-ink-muted">
          {editingId ? "কার্ড এডিট করুন" : "নতুন কার্ড যোগ করুন"}
        </h2>

        <IconPicker
          label="আইকন"
          value={form.icon}
          onChange={(name) => setForm((f) => ({ ...f, icon: name }))}
        />

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="মান (Value)"
            name="value"
            value={form.value}
            onChange={handleChange}
            placeholder="যেমন: 214"
          />
          <Field
            label="সাফিক্স"
            name="suffix"
            value={form.suffix}
            onChange={handleChange}
            placeholder="যেমন: +"
          />
        </div>
        <Field
          label="লেবেল"
          name="label"
          value={form.label}
          onChange={handleChange}
          placeholder="যেমন: মেধাবী শিক্ষার্থী পেয়েছে বৃত্তি"
        />

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
      </form> */}

      {/* <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {stats.map((s) => {
          const Icon = getIcon(s.icon);
          return (
            <div
              key={s.id}
              className="flex items-start justify-between gap-4 rounded-sm border border-line bg-paper p-5"
            >
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-kraft p-2.5 text-stamp">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="font-mono text-xl font-semibold text-ink">
                    {s.value}
                    {s.suffix}
                  </p>
                  <p className="mt-0.5 font-body text-sm text-ink-muted">
                    {s.label}
                  </p>
                </div>
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
          );
        })}
        {stats.length === 0 && (
          <p className="font-body text-sm text-ink-muted">
            এখনো কোনো পরিসংখ্যান কার্ড যোগ করা হয়নি।
          </p>
        )}
      </div> */}
    </section>
  );
}