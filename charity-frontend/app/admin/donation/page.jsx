"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash, FaPlus, FaTimes, FaUndo, FaImage } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection } from "@/lib/localStore";
import ImageUploader from "@/components/admin/ImageUploader";
import Field from "@/components/forms/Field";
import TextAreaField from "@/components/forms/TextAreaField";

const METHODS_KEY = "donationMethods";
const BANK_ITEMS_KEY = "bankItems";
const SETTINGS_KEY = "donationSettings";

//Default Methods
const defaultMethods = [
  { id: "1", name: "bKash", logo: "/images/bkash-logo.png", color: "#E2136E", number: "+৮৮০ ১XXX-XXXXXX", note: "Send Money (Personal)" },
  { id: "2", name: "Nagad", logo: "/images/nagad-logo.png", color: "#F6921E", number: "+৮৮০ ১XXX-XXXXXX", note: "Send Money (Personal)" },
  { id: "3", name: "Rocket", logo: "/images/rocket-logo.png", color: "#8C3494", number: "+৮৮০ ১XXX-XXXXXXX", note: "Send Money (Personal)" },
];

//Default Settings
const defaultSettings = {
  confirmationEmail: "",
};

//Default Bank Items
const defaultBankItems = [
  { 
    id: "1", 
    type: "bank", 
    name: "ব্যাংক ট্রান্সফার", 
    logo: "/images/bank-logo.png", 
    accountName: "ঐক্যতান ফাউন্ডেশন", 
    accountNumber: "XXXX-XXXXXXX-XXX", 
    bankBranch: "XXXX ব্যাংক লিমিটেড, সাতক্ষীরা শাখা", 
    routingNumber: "XXXXXXXXX" 
  },
  { 
    id: "2", 
    type: "card", 
    name: "কার্ড / অনলাইন পেমেন্ট", 
    logo: "/images/card-logo.png",
    note: "ক্রেডিট/ডেবিট কার্ড দিয়ে অনলাইনে অনুদান দেওয়ার ব্যবস্থা শীঘ্রই চালু হচ্ছে।" 
  },
];

const emptyMethodForm = { name: "", logo: "", color: "#E0A83A", number: "", note: "" };
const emptyBankItemForm = { type: "bank", name: "", logo: "", accountName: "", accountNumber: "", bankBranch: "", routingNumber: "", note: "" };

export default function AdminDonationPage() {
  const [methods, setMethods] = useState([]);
  const [methodForm, setMethodForm] = useState(emptyMethodForm);
  const [editingMethodId, setEditingMethodId] = useState(null);

  const [bankItems, setBankItems] = useState([]);
  const [bankItemForm, setBankItemForm] = useState(emptyBankItemForm);
  const [editingBankItemId, setEditingBankItemId] = useState(null);

  const [settings, setSettings] = useState(defaultSettings);
  const [savingSettings, setSavingSettings] = useState(false);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("methods");

  //Fetch Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [methodsData, bankItemsData, settingsData] = await Promise.all([
        api.getDonationMethods().catch(() => null),
        api.getBankItems().catch(() => null),
        api.getDonationSettings().catch(() => null),
      ]);

      console.log("📥 Methods Data:", methodsData);
      console.log("📥 Bank Items Data:", bankItemsData);
      console.log("📥 Settings Data:", settingsData);

      //Methods
      if (Array.isArray(methodsData) && methodsData.length > 0) {
        const mappedMethods = methodsData.map((item) => ({
          id: item._id || item.id,
          name: item.name || "",
          logo: item.logo || "",
          color: item.color || "#E0A83A",
          number: item.number || "",
          note: item.note || "",
        }));
        setMethods(mappedMethods);
        saveCollection(METHODS_KEY, mappedMethods);
      } else {
        const localMethods = loadCollection(METHODS_KEY, defaultMethods);
        setMethods(localMethods);
      }

      //Bank Items
      if (Array.isArray(bankItemsData) && bankItemsData.length > 0) {
        const mappedBankItems = bankItemsData.map((item) => ({
          id: item._id || item.id,
          type: item.type || "bank",
          name: item.name || "",
          logo: item.logo || "",
          accountName: item.accountName || "",
          accountNumber: item.accountNumber || "",
          bankBranch: item.bankBranch || "",
          routingNumber: item.routingNumber || "",
          note: item.note || "",
        }));
        setBankItems(mappedBankItems);
        saveCollection(BANK_ITEMS_KEY, mappedBankItems);
      } else {
        const localBankItems = loadCollection(BANK_ITEMS_KEY, defaultBankItems);
        setBankItems(localBankItems);
      }

      //Settings
      if (settingsData && Object.keys(settingsData).length > 0) {
        setSettings({ 
          confirmationEmail: settingsData.confirmationEmail || "" 
        });
        saveCollection(SETTINGS_KEY, { 
          confirmationEmail: settingsData.confirmationEmail || "" 
        });
      } else {
        setSettings(loadCollection(SETTINGS_KEY, defaultSettings));
      }

    } catch (error) {
      console.error("❌ Failed to fetch donation data:", error);
      setMethods(loadCollection(METHODS_KEY, defaultMethods));
      setBankItems(loadCollection(BANK_ITEMS_KEY, defaultBankItems));
      setSettings(loadCollection(SETTINGS_KEY, defaultSettings));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------------- Methods ---------------- */

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

    try {
      if (editingMethodId) {
        await api.updateDonationMethod(editingMethodId, {
          name: methodForm.name,
          logo: methodForm.logo,
          color: methodForm.color,
          number: methodForm.number,
          note: methodForm.note,
        });
        const updatedMethods = methods.map((m) =>
          m.id === editingMethodId ? { ...m, ...methodForm } : m
        );
        persistMethods(updatedMethods);
        toast.success("মাধ্যম আপডেট হয়েছে ✅");
      } else {
        const saved = await api.createDonationMethod({
          name: methodForm.name,
          logo: methodForm.logo,
          color: methodForm.color,
          number: methodForm.number,
          note: methodForm.note,
        });
        const newItem = {
          id: saved.id || saved._id || Date.now().toString(),
          ...methodForm,
        };
        persistMethods([...methods, newItem]);
        toast.success("নতুন মাধ্যম যোগ হয়েছে ✅");
      }
      resetMethodForm();
      //Save করার পর ডেটা রিফ্রেশ
      await fetchData();
    } catch (error) {
      console.error("❌ Method save error:", error);
      toast.error(error?.message || "সেভ করতে সমস্যা হয়েছে।");
    }
  }

  function resetMethodForm() {
    setMethodForm(emptyMethodForm);
    setEditingMethodId(null);
  }

  function handleMethodEdit(method) {
    setEditingMethodId(method.id);
    setMethodForm({
      name: method.name || "",
      logo: method.logo || "",
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
      persistMethods(methods.filter((m) => m.id !== id));
      toast.success("মাধ্যম মুছে ফেলা হয়েছে ✅");
      if (editingMethodId === id) resetMethodForm();
      await fetchData();
    } catch (error) {
      console.error("❌ Method delete error:", error);
      toast.error(error?.message || "মুছতে সমস্যা হয়েছে।");
    }
  }

  async function handleResetMethods() {
    if (!confirm("সব মাধ্যম ডিফল্টে রিসেট করতে চান?")) return;

    try {
      for (const method of methods) {
        await api.deleteDonationMethod(method.id);
      }
      for (const method of defaultMethods) {
        await api.createDonationMethod({
          name: method.name,
          logo: method.logo,
          color: method.color,
          number: method.number,
          note: method.note,
        });
      }
      setMethods(defaultMethods);
      saveCollection(METHODS_KEY, defaultMethods);
      toast.success("মাধ্যম ডিফল্টে রিসেট করা হয়েছে ✅");
      await fetchData();
    } catch (error) {
      console.error("❌ Reset error:", error);
      toast.error("রিসেট করতে সমস্যা হয়েছে।");
    }
  }

  /* ---------------- Bank Items ---------------- */

  function persistBankItems(next) {
    setBankItems(next);
    saveCollection(BANK_ITEMS_KEY, next);
  }

  async function handleBankItemSubmit(e) {
    e.preventDefault();
    if (!bankItemForm.name.trim()) {
      toast.error("নাম আবশ্যক।");
      return;
    }

    try {
      if (editingBankItemId) {
        await api.updateBankItem(editingBankItemId, {
          type: bankItemForm.type,
          name: bankItemForm.name,
          logo: bankItemForm.logo,
          accountName: bankItemForm.accountName,
          accountNumber: bankItemForm.accountNumber,
          bankBranch: bankItemForm.bankBranch,
          routingNumber: bankItemForm.routingNumber,
          note: bankItemForm.note,
        });
        const updatedItems = bankItems.map((item) =>
          item.id === editingBankItemId ? { ...item, ...bankItemForm } : item
        );
        persistBankItems(updatedItems);
        toast.success(`${bankItemForm.type === "bank" ? "ব্যাংক" : "কার্ড"} আপডেট হয়েছে ✅`);
      } else {
        const saved = await api.createBankItem({
          type: bankItemForm.type,
          name: bankItemForm.name,
          logo: bankItemForm.logo,
          accountName: bankItemForm.accountName,
          accountNumber: bankItemForm.accountNumber,
          bankBranch: bankItemForm.bankBranch,
          routingNumber: bankItemForm.routingNumber,
          note: bankItemForm.note,
        });
        const newItem = {
          id: saved.id || saved._id || Date.now().toString(),
          ...bankItemForm,
        };
        persistBankItems([...bankItems, newItem]);
        toast.success(`${bankItemForm.type === "bank" ? "ব্যাংক" : "কার্ড"} যোগ হয়েছে ✅`);
      }
      resetBankItemForm();
      await fetchData();
    } catch (error) {
      console.error("❌ Bank item save error:", error);
      toast.error(error?.message || "সেভ করতে সমস্যা হয়েছে।");
    }
  }

  function resetBankItemForm() {
    setBankItemForm(emptyBankItemForm);
    setEditingBankItemId(null);
  }

  function handleBankItemEdit(item) {
    setEditingBankItemId(item.id);
    setBankItemForm({
      type: item.type || "bank",
      name: item.name || "",
      logo: item.logo || "",
      accountName: item.accountName || "",
      accountNumber: item.accountNumber || "",
      bankBranch: item.bankBranch || "",
      routingNumber: item.routingNumber || "",
      note: item.note || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleBankItemDelete(id) {
    if (!confirm("এই আইটেমটি মুছে ফেলতে চান?")) return;

    try {
      await api.deleteBankItem(id);
      persistBankItems(bankItems.filter((item) => item.id !== id));
      toast.success("আইটেম মুছে ফেলা হয়েছে ✅");
      if (editingBankItemId === id) resetBankItemForm();
      await fetchData();
    } catch (error) {
      console.error("❌ Bank item delete error:", error);
      toast.error(error?.message || "মুছতে সমস্যা হয়েছে।");
    }
  }

  async function handleResetBankItems() {
    if (!confirm("সব ব্যাংক/কার্ড আইটেম ডিফল্টে রিসেট করতে চান?")) return;

    try {
      for (const item of bankItems) {
        await api.deleteBankItem(item.id);
      }
      for (const item of defaultBankItems) {
        await api.createBankItem({
          type: item.type,
          name: item.name,
          logo: item.logo,
          accountName: item.accountName,
          accountNumber: item.accountNumber,
          bankBranch: item.bankBranch,
          routingNumber: item.routingNumber,
          note: item.note || "",
        });
      }
      setBankItems(defaultBankItems);
      saveCollection(BANK_ITEMS_KEY, defaultBankItems);
      toast.success("ব্যাংক/কার্ড আইটেম ডিফল্টে রিসেট করা হয়েছে ✅");
      await fetchData();
    } catch (error) {
      console.error("❌ Reset error:", error);
      toast.error("রিসেট করতে সমস্যা হয়েছে।");
    }
  }

  /* ---------------- Settings ---------------- */

  function handleSettingsChange(e) {
    setSettings((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function handleSettingsSubmit(e) {
    e.preventDefault();
    setSavingSettings(true);

    try {
      await api.updateDonationSettings(settings);
      saveCollection(SETTINGS_KEY, settings);
      toast.success("সংরক্ষিত হয়েছে ✅");
      await fetchData();
    } catch (error) {
      console.error("❌ Settings save error:", error);
      saveCollection(SETTINGS_KEY, settings);
      toast.success("স্থানীয়ভাবে সংরক্ষিত হয়েছে।");
    } finally {
      setSavingSettings(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-ink-muted">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <span className="label-caps text-stamp">Admin / Donation</span>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <h1 className="font-display text-2xl font-semibold text-ink">
          অনুদান তথ্য (Donate পপআপ)
        </h1>
        <span className="text-sm text-ink-muted">
          {methods.length} মাধ্যম · {bankItems.length} আইটেম
        </span>
      </div>

      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        &quot;অনুদান করুন&quot; বাটনে ক্লিক করলে যে পপআপ দেখা যায়, তার
        মোবাইল ব্যাংকিং মাধ্যম, ব্যাংক অ্যাকাউন্ট ও কার্ড/অনলাইন পেমেন্টের
        তথ্য এখান থেকে ম্যানেজ করুন।
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mt-6 border-b border-line">
        <button
          onClick={() => setActiveTab("methods")}
          className={`px-4 py-2 font-body text-sm transition-colors ${
            activeTab === "methods"
              ? "border-b-2 border-marigold text-ink font-semibold"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          মোবাইল ব্যাংকিং
        </button>
        <button
          onClick={() => setActiveTab("bankitems")}
          className={`px-4 py-2 font-body text-sm transition-colors ${
            activeTab === "bankitems"
              ? "border-b-2 border-marigold text-ink font-semibold"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          ব্যাংক / কার্ড
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 font-body text-sm transition-colors ${
            activeTab === "settings"
              ? "border-b-2 border-marigold text-ink font-semibold"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          সেটিংস
        </button>
      </div>

      {/* Tab: Mobile Banking */}
      {activeTab === "methods" && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-display text-xl font-semibold text-ink">
              মোবাইল ব্যাংকিং (bKash, Nagad, Rocket...)
            </h2>
            <div className="flex gap-2">
              {!editingMethodId && (
                <button
                  onClick={() => {
                    resetMethodForm();
                    document.getElementById('methodForm')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-marigold flex items-center gap-2 text-sm"
                >
                  <FaPlus size={12} /> নতুন মাধ্যম
                </button>
              )}
              <button
                onClick={handleResetMethods}
                className="border border-orange-500 text-orange-500 px-3 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2 text-sm"
              >
                <FaUndo size={12} /> রিসেট
              </button>
            </div>
          </div>

          <form
            id="methodForm"
            onSubmit={handleMethodSubmit}
            className="mb-6 max-w-xl space-y-4 rounded-xl border border-line bg-paper p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="label-caps text-ink-muted">
                {editingMethodId ? "✏️ মাধ্যম এডিট করুন" : "➕ নতুন মাধ্যম যোগ করুন"}
              </h3>
              {editingMethodId && (
                <button
                  type="button"
                  onClick={resetMethodForm}
                  className="text-ink-muted hover:text-ink transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              )}
            </div>

            <ImageUploader
              label="লোগো আপলোড করুন"
              value={methodForm.logo}
              onChange={(url) => setMethodForm((f) => ({ ...f, logo: url }))}
              aspect="aspect-square"
              helpText="বর্গাকার ছবি আপলোড করুন (png, jpg, webp)"
            />

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="নাম"
                name="name"
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
                    className="h-[38px] w-12 shrink-0 rounded-sm border border-line bg-paper p-1 cursor-pointer"
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
              name="number"
              value={methodForm.number}
              onChange={(e) => setMethodForm((f) => ({ ...f, number: e.target.value }))}
              placeholder="+৮৮০ ১XXX-XXXXXX"
            />
            <Field
              label="নোট (ঐচ্ছিক)"
              name="note"
              value={methodForm.note}
              onChange={(e) => setMethodForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="যেমন: Send Money (Personal)"
            />

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-marigold">
                <FaPlus size={12} />
                {editingMethodId ? "আপডেট করুন" : "যোগ করুন"}
              </button>
              {editingMethodId && (
                <button
                  type="button"
                  onClick={resetMethodForm}
                  className="btn-outline-ink"
                >
                  বাতিল
                </button>
              )}
            </div>
          </form>

          {/* Methods Grid */}
          {methods.length === 0 ? (
            <div className="text-center py-8 text-ink-muted border border-dashed border-line rounded-xl">
              <p className="font-body text-sm">এখনো কোনো মোবাইল ব্যাংকিং মাধ্যম যোগ করা হয়নি।</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {methods.map((m) => (
                <div
                  key={m.id}
                  className="group relative rounded-xl border border-line bg-paper p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    {m.logo ? (
                      <img
                        src={m.logo}
                        alt={m.name}
                        className="w-12 h-12 rounded-full object-cover border border-line"
                        onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                      />
                    ) : (
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white text-xl font-bold"
                        style={{ backgroundColor: m.color || "#E0A83A" }}
                      >
                        {m.name?.charAt(0) || "?"}
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold text-ink">{m.name}</p>
                      <p className="font-mono text-xs text-ink-muted truncate">{m.number || "নম্বর নেই"}</p>
                      {m.note && <p className="font-body text-xs text-ink-muted truncate">{m.note}</p>}
                    </div>
                  </div>
                  <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMethodEdit(m)}
                      className="rounded-lg border border-line p-1.5 text-ink-muted hover:bg-kraft hover:text-ink transition-colors"
                    >
                      <FaPen size={11} />
                    </button>
                    <button
                      onClick={() => handleMethodDelete(m.id)}
                      className="rounded-lg border border-line p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Bank/Card Items */}
      {activeTab === "bankitems" && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-display text-xl font-semibold text-ink">
              ব্যাংক অ্যাকাউন্ট ও কার্ড (একাধিক)
            </h2>
            <div className="flex gap-2">
              {!editingBankItemId && (
                <button
                  onClick={() => {
                    resetBankItemForm();
                    document.getElementById('bankItemForm')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-marigold flex items-center gap-2 text-sm"
                >
                  <FaPlus size={12} /> নতুন আইটেম
                </button>
              )}
              <button
                onClick={handleResetBankItems}
                className="border border-orange-500 text-orange-500 px-3 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2 text-sm"
              >
                <FaUndo size={12} /> রিসেট
              </button>
            </div>
          </div>

          <form
            id="bankItemForm"
            onSubmit={handleBankItemSubmit}
            className="mb-6 max-w-xl space-y-4 rounded-xl border border-line bg-paper p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="label-caps text-ink-muted">
                {editingBankItemId ? "✏️ আইটেম এডিট করুন" : "➕ নতুন আইটেম যোগ করুন"}
              </h3>
              {editingBankItemId && (
                <button
                  type="button"
                  onClick={resetBankItemForm}
                  className="text-ink-muted hover:text-ink transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-caps mb-1 block">টাইপ</label>
                <select
                  value={bankItemForm.type}
                  onChange={(e) => setBankItemForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-stamp"
                >
                  <option value="bank">ব্যাংক</option>
                  <option value="card">কার্ড</option>
                </select>
              </div>
              <Field
                label="নাম"
                name="name"
                value={bankItemForm.name}
                onChange={(e) => setBankItemForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="যেমন: ব্যাংক ট্রান্সফার"
              />
            </div>

            <ImageUploader
              label="লোগো আপলোড করুন"
              value={bankItemForm.logo}
              onChange={(url) => setBankItemForm((f) => ({ ...f, logo: url }))}
              aspect="aspect-square"
              helpText="বর্গাকার ছবি আপলোড করুন (png, jpg, webp)"
            />

            {bankItemForm.type === "bank" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="হিসাবের নাম"
                    name="accountName"
                    value={bankItemForm.accountName}
                    onChange={(e) => setBankItemForm((f) => ({ ...f, accountName: e.target.value }))}
                  />
                  <Field
                    label="হিসাব নম্বর"
                    name="accountNumber"
                    value={bankItemForm.accountNumber}
                    onChange={(e) => setBankItemForm((f) => ({ ...f, accountNumber: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="ব্যাংক ও শাখা"
                    name="bankBranch"
                    value={bankItemForm.bankBranch}
                    onChange={(e) => setBankItemForm((f) => ({ ...f, bankBranch: e.target.value }))}
                  />
                  <Field
                    label="রাউটিং নম্বর"
                    name="routingNumber"
                    value={bankItemForm.routingNumber}
                    onChange={(e) => setBankItemForm((f) => ({ ...f, routingNumber: e.target.value }))}
                  />
                </div>
              </>
            ) : (
              <TextAreaField
                label="কার্ড নোট"
                name="note"
                rows={3}
                value={bankItemForm.note}
                onChange={(e) => setBankItemForm((f) => ({ ...f, note: e.target.value }))}
              />
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-marigold">
                <FaPlus size={12} />
                {editingBankItemId ? "আপডেট করুন" : "যোগ করুন"}
              </button>
              {editingBankItemId && (
                <button
                  type="button"
                  onClick={resetBankItemForm}
                  className="btn-outline-ink"
                >
                  বাতিল
                </button>
              )}
            </div>
          </form>

          {/* Bank Items Grid */}
          {bankItems.length === 0 ? (
            <div className="text-center py-8 text-ink-muted border border-dashed border-line rounded-xl">
              <p className="font-body text-sm">এখনো কোনো ব্যাংক/কার্ড আইটেম যোগ করা হয়নি।</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bankItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl border border-line bg-paper p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="w-12 h-12 rounded-full object-cover border border-line"
                        onError={(e) => { e.target.src = "/images/placeholder.png"; }}
                      />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-marigold/20 text-marigold text-xl">
                        <FaImage />
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-semibold text-ink">{item.name}</p>
                      {item.type === "bank" ? (
                        <>
                          <p className="font-mono text-xs text-ink-muted truncate">{item.accountNumber}</p>
                          <p className="font-body text-xs text-ink-muted truncate">{item.bankBranch}</p>
                        </>
                      ) : (
                        <p className="font-body text-xs text-ink-muted line-clamp-2">{item.note}</p>
                      )}
                    </div>
                  </div>
                  <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleBankItemEdit(item)}
                      className="rounded-lg border border-line p-1.5 text-ink-muted hover:bg-kraft hover:text-ink transition-colors"
                    >
                      <FaPen size={11} />
                    </button>
                    <button
                      onClick={() => handleBankItemDelete(item.id)}
                      className="rounded-lg border border-line p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === "settings" && (
        <div className="mt-6">
          <h2 className="font-display text-xl font-semibold text-ink mb-4">
            সাধারণ সেটিংস
          </h2>

          <form
            onSubmit={handleSettingsSubmit}
            className="max-w-xl space-y-4 rounded-xl border border-line bg-paper p-5 shadow-sm"
          >
            <Field
              label="অনুদান নিশ্চিতকরণ ইমেইল"
              name="confirmationEmail"
              type=""
              value={settings.confirmationEmail}
              onChange={handleSettingsChange}
              placeholder="info@oikkotan.org"
            />

            <button
              type="submit"
              disabled={savingSettings}
              className="btn-marigold disabled:opacity-60"
            >
              {savingSettings ? "⏳ সেভ হচ্ছে..." : "💾 সংরক্ষণ করুন"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}