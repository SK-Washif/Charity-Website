"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection } from "@/lib/localStore";
import { getIcon } from "@/lib/iconMap";
import IconPicker from "@/components/admin/IconPicker";
import Field from "@/components/forms/Field";
import TextAreaField from "@/components/forms/TextAreaField";

const STORE_KEY = "programs";

const defaultServices = [
  { id: "1", title: "মেধাবী শিক্ষার্থী খোঁজা", text: "সারা বাংলাদেশ থেকে প্রকৃত মেধাবী ও অর্থনৈতিকভাবে দুর্বল শিক্ষার্থীদের খুঁজে বের করা — যাদের পড়াশোনা চালিয়ে যেতে আর্থিক সহায়তা প্রয়োজন।", icon: "FaSearch" },
  { id: "2", title: "শিক্ষাবৃত্তি প্রদান", text: "নির্বাচিত শিক্ষার্থীদের নিয়মিত আর্থিক সহায়তা প্রদান, যাতে তারা পড়াশোনায় মনোযোগ দিতে পারে এবং ভালো ফলাফল অর্জন করতে পারে।", icon: "FaMoneyBillWave" },
  { id: "3", title: "পরিবারকে সহায়তা", text: "শুধু শিক্ষার্থী নয়, তাদের পরিবারকেও সহায়তা করা — যাতে পরিবারের আর্থিক চাপ শিক্ষার্থীর পড়াশোনায় বাধা না হয়ে দাঁড়ায়।", icon: "FaUserGraduate" },
  { id: "4", title: "দক্ষতা উন্নয়ন", text: "শিক্ষার্থীদের পড়াশোনার পাশাপাশি দক্ষতা উন্নয়নে প্রশিক্ষণ প্রদান, যাতে তারা ভবিষ্যতে কর্মসংস্থানের জন্য প্রস্তুত থাকে।", icon: "FaRocket" },
  { id: "5", title: "বাংলাদেশের উন্নয়নে অবদান", text: "শিক্ষিত ও দক্ষ জনশক্তি তৈরি করে বাংলাদেশের সামগ্রিক উন্নয়নে অবদান রাখা — প্রতিটি শিক্ষার্থী আমাদের ভবিষ্যতের সম্পদ।", icon: "FaGlobeAsia" },
];

const emptyForm = { title: "", text: "", icon: "FaHandsHelping" };

export default function AdminProgramsPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  //Data Fetch - Real API থেকে
  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getPrograms();
      if (Array.isArray(data) && data.length) {
        setServices(data);
        saveCollection(STORE_KEY, data);
      } else {
        setServices(loadCollection(STORE_KEY, defaultServices));
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error);
      setServices(loadCollection(STORE_KEY, defaultServices));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  //Create/Update - Real API
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("শিরোনাম আবশ্যক।");
      return;
    }

    setSaving(true);
    try {
      let savedItem;
      
      if (editingId) {
        //Update - Real API
        savedItem = await api.updateProgram(editingId, form);
        //Update UI with backend response
        setServices(services.map((s) => 
          (s._id || s.id) === editingId ? savedItem : s
        ));
        toast.success("সেবা আপডেট হয়েছে ✅");
      } else {
        //Create - Real API
        savedItem = await api.createProgram(form);
        //Add to UI with backend response
        setServices([...services, savedItem]);
        toast.success("নতুন সেবা যোগ হয়েছে ✅");
      }
      
      //Backup localStorage
      saveCollection(STORE_KEY, services);
      resetForm();
      
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("সংরক্ষণ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  //Edit - UI তে Data Load
  function handleEdit(service) {
    const id = service._id || service.id;
    setEditingId(id);
    setForm({
      title: service.title,
      text: service.text,
      icon: service.icon || "FaHandsHelping",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  //Delete - Real API + Proper ID
  async function handleDelete(id) {
    console.log("🗑️ Deleting with ID:", id); // ✅ ডিবাগ লগ
    
    if (!confirm("এই সেবাটি মুছে ফেলতে চান?")) return;
    
    try {
      //1. Real API Delete (সঠিক ID দিয়ে)
      await api.deleteProgram(id);
      
      //2. UI থেকে Remove (সঠিক ID দিয়ে)
      const updatedServices = services.filter((s) => {
        const itemId = s._id || s.id;
        return itemId !== id;
      });
      
      console.log("✅ After delete, remaining:", updatedServices.length); // ✅ ডিবাগ লগ
      
      setServices(updatedServices);
      
      //3. localStorage Update
      saveCollection(STORE_KEY, updatedServices);
      
      toast.success("সেবা মুছে ফেলা হয়েছে ✅");
      
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("মুছে ফেলতে সমস্যা হয়েছে।");
      
      //4. Error হলে আবার Fetch করে Refresh
      await fetchPrograms();
    }
  }

  if (loading) {
    return <p className="font-body text-sm text-ink-muted">লোড হচ্ছে...</p>;
  }

  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      <h1 className="mt-2 font-display text-2xl font-semibold">
        Manage Programs
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
        <IconPicker
          label="আইকন / লোগো"
          value={form.icon}
          onChange={(name) => setForm((f) => ({ ...f, icon: name }))}
        />
        <Field
          label="শিরোনাম"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="যেমন: শিক্ষা সহায়তা"
        />
        <TextAreaField
          label="বিবরণ"
          name="text"
          rows={3}
          value={form.text}
          onChange={handleChange}
          placeholder="সংক্ষিপ্ত বিবরণ লিখুন"
        />
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

      <div className="mt-8 space-y-4">
        {services.map((s) => {
          const Icon = getIcon(s.icon);
          //সঠিক ID নেওয়া - _id priority
          const itemId = s._id || s.id;
          
          console.log("🔍 Rendering item:", { title: s.title, id: itemId }); // ✅ ডিবাগ লগ
          
          return (
            <div
              key={itemId}
              className="flex items-start justify-between gap-4 rounded-sm border border-line bg-paper p-5"
            >
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-kraft p-2.5 text-stamp">
                  <Icon size={16} />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-1 font-body text-sm text-ink-muted">
                    {s.text}
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
                  onClick={() => handleDelete(itemId)}
                  aria-label="Delete"
                  className="rounded-sm border border-line p-2 text-ink-muted hover:bg-red-50 hover:text-red-600"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          );
        })}
        {services.length === 0 && (
          <p className="font-body text-sm text-ink-muted">
            এখনো কোনো সেবা যোগ করা হয়নি।
          </p>
        )}
      </div>
    </section>
  );
}