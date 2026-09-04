"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash, FaPlus, FaUndo } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection } from "@/lib/localStore";
import { getIcon } from "@/lib/iconMap";
import IconPicker from "@/components/admin/IconPicker";
import Field from "@/components/forms/Field";
import TextAreaField from "@/components/forms/TextAreaField";

const STORE_KEY = "programs";

// ✅ Default Programs (for reset)
const defaultServices = [
  { id: "default-1", title: "মেধাবী শিক্ষার্থী খোঁজা", text: "সারা বাংলাদেশ থেকে প্রকৃত মেধাবী ও অর্থনৈতিকভাবে দুর্বল শিক্ষার্থীদের খুঁজে বের করা — যাদের পড়াশোনা চালিয়ে যেতে আর্থিক সহায়তা প্রয়োজন।", icon: "FaSearch" },
  { id: "default-2", title: "শিক্ষাবৃত্তি প্রদান", text: "নির্বাচিত শিক্ষার্থীদের নিয়মিত আর্থিক সহায়তা প্রদান, যাতে তারা পড়াশোনায় মনোযোগ দিতে পারে এবং ভালো ফলাফল অর্জন করতে পারে।", icon: "FaMoneyBillWave" },
  { id: "default-3", title: "পরিবারকে সহায়তা", text: "শুধু শিক্ষার্থী নয়, তাদের পরিবারকেও সহায়তা করা — যাতে পরিবারের আর্থিক চাপ শিক্ষার্থীর পড়াশোনায় বাধা না হয়ে দাঁড়ায়।", icon: "FaUserGraduate" },
  { id: "default-4", title: "দক্ষতা উন্নয়ন", text: "শিক্ষার্থীদের পড়াশোনার পাশাপাশি দক্ষতা উন্নয়নে প্রশিক্ষণ প্রদান, যাতে তারা ভবিষ্যতে কর্মসংস্থানের জন্য প্রস্তুত থাকে।", icon: "FaRocket" },
  { id: "default-5", title: "বাংলাদেশের উন্নয়নে অবদান", text: "শিক্ষিত ও দক্ষ জনশক্তি তৈরি করে বাংলাদেশের সামগ্রিক উন্নয়নে অবদান রাখা — প্রতিটি শিক্ষার্থী আমাদের ভবিষ্যতের সম্পদ।", icon: "FaGlobeAsia" },
];

const emptyForm = { title: "", text: "", icon: "FaHandsHelping" };

export default function AdminProgramsPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  //Data Fetch - Real API থেকে
  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getPrograms();
      console.log("📥 Programs fetch data:", data);
      
      if (Array.isArray(data) && data.length) {
        setServices(data);
        saveCollection(STORE_KEY, data);
      } else {
        // ✅ API খালি থাকলে খালি array
        setServices([]);
        saveCollection(STORE_KEY, []);
      }
    } catch (error) {
      console.error("Failed to fetch programs:", error);
      setServices([]);
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
        const updatedServices = services.map((s) => 
          (s._id || s.id) === editingId ? savedItem : s
        );
        setServices(updatedServices);
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
    console.log("🗑️ Deleting with ID:", id);
    
    if (!confirm("এই সেবাটি মুছে ফেলতে চান?")) return;
    
    try {
      //1. Real API Delete
      await api.deleteProgram(id);
      
      //2. UI থেকে Remove
      const updatedServices = services.filter((s) => {
        const itemId = s._id || s.id;
        return itemId !== id;
      });
      
      console.log("✅ After delete, remaining:", updatedServices.length);
      
      setServices(updatedServices);
      
      //3. localStorage Update
      saveCollection(STORE_KEY, updatedServices);
      
      toast.success("সেবা মুছে ফেলা হয়েছে ✅");
      
      if (editingId === id) resetForm();
      
      //4. Refetch to confirm
      await fetchPrograms();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("মুছে ফেলতে সমস্যা হয়েছে।");
      
      //5. Error হলে আবার Fetch করে Refresh
      await fetchPrograms();
    }
  }

  // ✅ Reset to Default Programs
  async function handleReset() {
    if (!confirm("সব সেবা ডিলিট করে ডিফল্ট সেবা রিস্টোর করতে চান?")) return;
    
    setResetting(true);
    try {
      // 1. Delete all existing programs
      for (const service of services) {
        const id = service._id || service.id;
        await api.deleteProgram(id);
      }
      
      // 2. Create default programs
      for (const defaultItem of defaultServices) {
        await api.createProgram({
          title: defaultItem.title,
          text: defaultItem.text,
          icon: defaultItem.icon,
        });
      }
      
      // 3. Update UI with default items
      const mappedDefaults = defaultServices.map(item => ({
        id: item.id,
        title: item.title,
        text: item.text,
        icon: item.icon,
      }));
      
      setServices(mappedDefaults);
      saveCollection(STORE_KEY, mappedDefaults);
      
      toast.success("ডিফল্ট সেবা রিস্টোর করা হয়েছে ✅");
      
      // 4. Refetch to confirm
      await fetchPrograms();
    } catch (error) {
      console.error("Failed to reset:", error);
      toast.error("রিসেট করতে সমস্যা হয়েছে।");
    } finally {
      setResetting(false);
    }
  }

  if (loading) {
    return <p className="font-body text-sm text-ink-muted">লোড হচ্ছে...</p>;
  }

  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      
      <div className="flex items-center justify-between mt-2 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-semibold">Manage Programs</h1>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              resetForm();
              document.getElementById('programForm')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-marigold flex items-center gap-2"
          >
            <FaPlus size={14} /> নতুন সেবা যোগ করুন
          </button>
          {/* ✅ Reset Button */}
          <button
            onClick={handleReset}
            disabled={resetting}
            className="border border-orange-500 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <FaUndo size={14} /> 
            {resetting ? "রিস্টোর হচ্ছে..." : "রিসেট করুন"}
          </button>
        </div>
      </div>
      
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের &quot;সেবাসমূহ&quot; সেকশনে যেসব প্রোগ্রাম দেখা যাবে তা
        এখান থেকে যোগ, এডিট বা মুছে ফেলুন।
        <span className="block mt-1 text-orange-500 text-xs">
          ⚡ রিসেট বাটনে ক্লিক করলে ডিফল্ট সেবা ফিরে আসবে।
        </span>
      </p>

      <form
        id="programForm"
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
        {services.length === 0 ? (
          <div className="bg-paper border border-line rounded-xl p-12 text-center text-ink-muted">
            <p className="font-body">এখনো কোনো সেবা যোগ করা হয়নি।</p>
            <p className="font-body text-sm mt-2">"নতুন সেবা যোগ করুন" বাটনে ক্লিক করুন।</p>
          </div>
        ) : (
          services.map((s) => {
            const Icon = getIcon(s.icon);
            const itemId = s._id || s.id;
            
            console.log("🔍 Rendering item:", { title: s.title, id: itemId });
            
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
          })
        )}
      </div>
    </section>
  );
}