"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection, makeId } from "@/lib/localStore";
import { getIcon } from "@/lib/iconMap";
import IconPicker from "@/components/admin/IconPicker";
import Field from "@/components/forms/Field";
import TextAreaField from "@/components/forms/TextAreaField";

const METHODS_KEY = "donationMethods";
const SETTINGS_KEY = "donationSettings";


const defaultMethods = [
  { id: "1", name: "bKash", icon: "FaMobileAlt", color: "#E2136E", number: "+৮৮০ ১XXX-XXXXXX", note: "Send Money (Personal)" },
  { id: "2", name: "Nagad", icon: "FaMobileAlt", color: "#F6921E", number: "+৮৮০ ১XXX-XXXXXX", note: "Send Money (Personal)" },
  { id: "3", name: "Rocket", icon: "FaMobileAlt", color: "#8C3494", number: "+৮৮০ ১XXX-XXXXXXX", note: "Send Money (Personal)" },
];


const defaultSettings = {
  bankAccountName: "ঐক্যতান ফাউন্ডেশন",
  bankAccountNumber: "XXXX-XXXXXXX-XXX",
  bankNameBranch: "XXXX ব্যাংক লিমিটেড, সাতক্ষীরা শাখা",
  bankRoutingNumber: "XXXXXXXXX",
  cardNote:
    "ক্রেডিট/ডেবিট কার্ড দিয়ে অনলাইনে অনুদান দেওয়ার ব্যবস্থা শীঘ্রই চালু হচ্ছে। এখন পর্যন্ত উপরের মাধ্যমগুলো ব্যবহার করুন অথবা আমাদের সাথে যোগাযোগ করুন।",
  confirmationEmail: "info@oikkotan.org",
};

const emptyMethodForm = { name: "", icon: "FaMobileAlt", color: "#E0A83A", number: "", note: "" };

export default function AdminDonationPage() {
  const [methods, setMethods] = useState([]);
  const [methodForm, setMethodForm] = useState(emptyMethodForm);
  const [editingId, setEditingId] = useState(null);

  const [settings, setSettings] = useState(defaultSettings);
  const [savingSettings, setSavingSettings] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [methodsData, settingsData] = await Promise.all([
          api.getDonationMethods(),
          api.getDonationSettings(),
        ]);
        setMethods(Array.isArray(methodsData) && methodsData.length ? methodsData : defaultMethods);
        setSettings(
          settingsData && Object.keys(settingsData).length ? settingsData : defaultSettings
        );
      } catch {
        setMethods(loadCollection(METHODS_KEY, defaultMethods));
        setSettings(loadCollection(SETTINGS_KEY, defaultSettings));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- (bKash/Nagad/Rocket ) ---------------- */

  function persistMethods(next) {
    setMethods(next);
    saveCollection(METHODS_KEY, next);
  }

  async function handleMethodSubmit(e) {
    e.preventDefault();
    if (!methodForm.name.trim()) {
      toast.error("মাধ্যমের নাম আবশ্যক (যেমন: bKash)।");
      return;
    }
    if (editingId) {
      try {
        await api.updateDonationMethod(editingId, methodForm);
      } catch {
        /* ব্যাকএন্ড আনরিচেবল */
      }
      persistMethods(methods.map((m) => (m.id === editingId ? { ...m, ...methodForm } : m)));
      toast.success("মাধ্যম আপডেট হয়েছে।");
    } else {
      const newMethod = { id: makeId(), ...methodForm };
      try {
        await api.createDonationMethod(newMethod);
      } catch {
        
      }
      persistMethods([...methods, newMethod]);
      toast.success("নতুন মাধ্যম যোগ হয়েছে।");
    }
    setMethodForm(emptyMethodForm);
    setEditingId(null);
  }

  function handleMethodEdit(method) {
    setEditingId(method.id);
    setMethodForm({
      name: method.name || "",
      icon: method.icon || "FaMobileAlt",
      color: method.color || "#E0A83A",
      number: method.number || "",
      note: method.note || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleMethodDelete(id) {
    if (!confirm("এই মাধ্যমটি মুছে ফেলতে চান?")) return;
    try {
      await api.deleteDonationMethod(id);
    } catch {
      
    }
    persistMethods(methods.filter((m) => m.id !== id));
    toast.success("মাধ্যম মুছে ফেলা হয়েছে।");
    if (editingId === id) {
      setEditingId(null);
      setMethodForm(emptyMethodForm);
    }
  }

  /* ----------------Bank account , card ---------------- */

  function handleSettingsChange(e) {
    setSettings((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleSettingsSubmit(e) {
    e.preventDefault();
    setSavingSettings(true);
    saveCollection(SETTINGS_KEY, settings);
    try {
      await api.updateDonationSettings(settings);
    } catch {
      
    } finally {
      setSavingSettings(false);
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
        অনুদান তথ্য (Donate পপআপ)
      </h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        &quot;অনুদান করুন&quot; বাটনে ক্লিক করলে যে পপআপ দেখা যায়, তার
        মোবাইল ব্যাংকিং মাধ্যম, ব্যাংক অ্যাকাউন্ট ও কার্ড/অনলাইন পেমেন্টের
        তথ্য এখান থেকে ম্যানেজ করুন। যেকোনো ফিল্ড খালি রেখেও সেভ করা যাবে।
      </p>

      {/* ---------- মোবাইল ব্যাংকিং ---------- */}
      <h2 className="mt-8 font-display text-lg font-semibold text-ink">
        মোবাইল ব্যাংকিং (bKash, Nagad, Rocket...)
      </h2>

      <form
        onSubmit={handleMethodSubmit}
        className="mt-4 max-w-xl space-y-4 rounded-sm border border-line bg-paper p-5"
      >
        <h3 className="label-caps text-ink-muted">
          {editingId ? "মাধ্যম এডিট করুন" : "নতুন মাধ্যম যোগ করুন"}
        </h3>

        <IconPicker
          label="আইকন / লোগো"
          value={methodForm.icon}
          onChange={(name) => setMethodForm((f) => ({ ...f, icon: name }))}
        />

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="নাম"
            value={methodForm.name}
            onChange={(e) => setMethodForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="যেমন: bKash"
          />
          <div>
            <label className="label-caps mb-1 block">ব্যাজের রং</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={methodForm.color}
                onChange={(e) => setMethodForm((f) => ({ ...f, color: e.target.value }))}
                className="h-[38px] w-12 shrink-0 rounded-sm border border-line bg-paper p-1"
              />
              <input
                type="text"
                value={methodForm.color}
                onChange={(e) => setMethodForm((f) => ({ ...f, color: e.target.value }))}
                className="w-full rounded-sm border border-line bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus:border-stamp"
                placeholder="#E2136E"
              />
            </div>
          </div>
        </div>

        <Field
          label="নম্বর"
          value={methodForm.number}
          onChange={(e) => setMethodForm((f) => ({ ...f, number: e.target.value }))}
          placeholder="+৮৮০ ১XXX-XXXXXX"
        />
        <Field
          label="নোট (ঐচ্ছিক)"
          value={methodForm.note}
          onChange={(e) => setMethodForm((f) => ({ ...f, note: e.target.value }))}
          placeholder="যেমন: Send Money (Personal)"
        />

        <div className="flex gap-3">
          <button type="submit" className="btn-marigold">
            <FaPlus size={12} />
            {editingId ? "আপডেট করুন" : "যোগ করুন"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setMethodForm(emptyMethodForm);
              }}
              className="btn-outline-ink"
            >
              বাতিল
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {methods.map((m) => {
          const Icon = getIcon(m.icon);
          return (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-sm border border-line bg-paper p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: m.color || "#E0A83A" }}
                >
                  <Icon size={16} />
                </span>
                <div>
                  <p className="font-body text-sm font-semibold text-ink">{m.name}</p>
                  <p className="font-mono text-xs text-ink-muted">{m.number || "নম্বর নেই"}</p>
                  {m.note && <p className="font-body text-xs text-ink-muted">{m.note}</p>}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => handleMethodEdit(m)} aria-label="Edit" className="rounded-sm border border-line p-2 text-ink-muted hover:bg-kraft hover:text-ink">
                  <FaPen size={12} />
                </button>
                <button onClick={() => handleMethodDelete(m.id)} aria-label="Delete" className="rounded-sm border border-line p-2 text-ink-muted hover:bg-red-50 hover:text-red-600">
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          );
        })}
        {methods.length === 0 && (
          <p className="font-body text-sm text-ink-muted">এখনো কোনো মোবাইল ব্যাংকিং মাধ্যম যোগ করা হয়নি।</p>
        )}
      </div>

      {/* ---------- ব্যাংক অ্যাকাউন্ট + কার্ড নোট ---------- */}
      <h2 className="mt-12 font-display text-lg font-semibold text-ink">
        ব্যাংক অ্যাকাউন্ট ও কার্ড/অনলাইন পেমেন্ট
      </h2>

      <form
        onSubmit={handleSettingsSubmit}
        className="mt-4 max-w-xl space-y-4 rounded-sm border border-line bg-paper p-5"
      >
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="হিসাবের নাম"
            name="bankAccountName"
            value={settings.bankAccountName}
            onChange={handleSettingsChange}
          />
          <Field
            label="হিসাব নম্বর"
            name="bankAccountNumber"
            value={settings.bankAccountNumber}
            onChange={handleSettingsChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="ব্যাংক ও শাখা"
            name="bankNameBranch"
            value={settings.bankNameBranch}
            onChange={handleSettingsChange}
          />
          <Field
            label="রাউটিং নম্বর"
            name="bankRoutingNumber"
            value={settings.bankRoutingNumber}
            onChange={handleSettingsChange}
          />
        </div>

        <TextAreaField
          label="কার্ড / অনলাইন পেমেন্ট নোট"
          name="cardNote"
          rows={3}
          value={settings.cardNote}
          onChange={handleSettingsChange}
        />

        <Field
          label="অনুদান নিশ্চিতকরণ ইমেইল"
          name="confirmationEmail"
          type="email"
          value={settings.confirmationEmail}
          onChange={handleSettingsChange}
          placeholder="info@oikkotan.org"
        />

        <button
          type="submit"
          disabled={savingSettings}
          className="btn-marigold disabled:opacity-60"
        >
          {savingSettings ? "সেভ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
      </form>
    </section>
  );
}
