"use client";

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash, FaPlus, FaTimes, FaUndo } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection } from "@/lib/localStore";
import { getIcon } from "@/lib/iconMap";
import IconPicker from "@/components/admin/IconPicker";
import Field from "@/components/forms/Field";

const CARDS_KEY = "contactCards";
const SOCIAL_KEY = "socialLinks";

//Default Contact Cards (শুধু Reset এর জন্য)
const defaultCards = [
  { id: "1", icon: "FaPhone", label: "ফোন", value: "+৮৮০ ১XXX-XXXXXX", note: "সকাল ৯টা - সন্ধ্যা ৬টা" },
  { id: "2", icon: "FaEnvelope", label: "ইমেইল", value: "info@oikkotan.org", note: "২৪ ঘন্টা উত্তর" },
  { id: "3", icon: "FaMapMarkerAlt", label: "ঠিকানা", value: "সাতক্ষীরা, বাংলাদেশ", note: "সরকারি কার্যালয়" },
];

//Default Social Links (শুধু Reset এর জন্য)
const defaultSocial = [
  { id: "1", platform: "Facebook", icon: "FaFacebook", url: "https://facebook.com/oikkotan" },
  { id: "2", platform: "YouTube", icon: "FaYoutube", url: "https://youtube.com/oikkotan" },
  { id: "3", platform: "WhatsApp", icon: "FaWhatsapp", url: "https://wa.me/8801XXXXXXXXX" },
];

const emptyCardForm = { icon: "FaPhone", label: "", value: "", note: "" };
const emptySocialForm = { platform: "", icon: "FaGlobe", url: "" };

export default function AdminContactPage() {
  const [cards, setCards] = useState([]);
  const [cardForm, setCardForm] = useState(emptyCardForm);
  const [editingCardId, setEditingCardId] = useState(null);

  const [social, setSocial] = useState([]);
  const [socialForm, setSocialForm] = useState(emptySocialForm);
  const [editingSocialId, setEditingSocialId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  //Fetch Data - Real API + localStorage Backup
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [cardsData, socialData] = await Promise.all([
        api.getContactCards(),
        api.getSocialLinks(),
      ]);

      if (Array.isArray(cardsData) && cardsData.length > 0) {
        setCards(cardsData);
        saveCollection(CARDS_KEY, cardsData);
      } else {
        //API খালি থাকলে খালি array রাখব, ডিফল্ট দেব না
        setCards([]);
        saveCollection(CARDS_KEY, []);
      }

      if (Array.isArray(socialData) && socialData.length > 0) {
        setSocial(socialData);
        saveCollection(SOCIAL_KEY, socialData);
      } else {
        //API খালি থাকলে খালি array রাখব, ডিফল্ট দেব না
        setSocial([]);
        saveCollection(SOCIAL_KEY, []);
      }
    } catch (error) {
      console.error("❌ Failed to fetch contact data:", error);
      setCards([]);
      setSocial([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------------- Contact Cards ---------------- */

  function persistCards(next) {
    setCards(next);
    saveCollection(CARDS_KEY, next);
  }

  async function handleCardSubmit(e) {
    e.preventDefault();
    if (!cardForm.label.trim() && !cardForm.value.trim()) {
      toast.error("অন্তত লেবেল বা মান একটি পূরণ করুন।");
      return;
    }

    setSaving(true);
    try {
      if (editingCardId) {
        await api.updateContactCard(editingCardId, {
          icon: cardForm.icon,
          label: cardForm.label,
          value: cardForm.value,
          note: cardForm.note,
        });
        const updatedCards = cards.map((c) => 
          (c.id === editingCardId) ? { ...c, ...cardForm } : c
        );
        persistCards(updatedCards);
        toast.success("কার্ড আপডেট হয়েছে ✅");
      } else {
        const saved = await api.createContactCard({
          icon: cardForm.icon,
          label: cardForm.label,
          value: cardForm.value,
          note: cardForm.note,
        });
        const newItem = {
          id: saved.id || saved._id || Date.now().toString(),
          icon: cardForm.icon,
          label: cardForm.label,
          value: cardForm.value,
          note: cardForm.note,
        };
        persistCards([...cards, newItem]);
        toast.success("নতুন কার্ড যোগ হয়েছে ✅");
      }
      resetCardForm();
    } catch (error) {
      console.error("❌ Card save error:", error);
      toast.error(error?.message || "সেভ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  function resetCardForm() {
    setCardForm(emptyCardForm);
    setEditingCardId(null);
  }

  function handleCardEdit(card) {
    setEditingCardId(card.id);
    setCardForm({
      icon: card.icon || "FaPhone",
      label: card.label || "",
      value: card.value || "",
      note: card.note || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleCardDelete(id) {
    if (!confirm("এই কার্ডটি মুছে ফেলতে চান?")) return;

    try {
      await api.deleteContactCard(id);
      const newCards = cards.filter((c) => c.id !== id);
      persistCards(newCards);
      toast.success("কার্ড মুছে ফেলা হয়েছে ✅");
      if (editingCardId === id) resetCardForm();
    } catch (error) {
      console.error("❌ Card delete error:", error);
      toast.error(error?.message || "মুছতে সমস্যা হয়েছে।");
    }
  }

  //Reset Cards to Default
  async function handleResetCards() {
    if (!confirm("সব কার্ড ডিফল্টে রিসেট করতে চান?")) return;

    setSaving(true);
    try {
      // Delete all existing cards
      for (const card of cards) {
        await api.deleteContactCard(card.id);
      }
      // Create default cards
      for (const card of defaultCards) {
        await api.createContactCard({
          icon: card.icon,
          label: card.label,
          value: card.value,
          note: card.note || "",
        });
      }
      setCards(defaultCards);
      saveCollection(CARDS_KEY, defaultCards);
      toast.success("কার্ড ডিফল্টে রিসেট করা হয়েছে ✅");
      await fetchData();
    } catch (error) {
      console.error("❌ Reset error:", error);
      toast.error("রিসেট করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  /* ---------------- Social Links ---------------- */

  function persistSocial(next) {
    setSocial(next);
    saveCollection(SOCIAL_KEY, next);
  }

  async function handleSocialSubmit(e) {
    e.preventDefault();
    if (!socialForm.platform.trim()) {
      toast.error("প্ল্যাটফর্মের নাম আবশ্যক।");
      return;
    }

    setSaving(true);
    try {
      if (editingSocialId) {
        await api.updateSocialLink(editingSocialId, {
          platform: socialForm.platform,
          icon: socialForm.icon,
          url: socialForm.url,
        });
        const updatedSocial = social.map((s) => 
          (s.id === editingSocialId) ? { ...s, ...socialForm } : s
        );
        persistSocial(updatedSocial);
        toast.success("লিংক আপডেট হয়েছে ✅");
      } else {
        const saved = await api.createSocialLink({
          platform: socialForm.platform,
          icon: socialForm.icon,
          url: socialForm.url,
        });
        const newItem = {
          id: saved.id || saved._id || Date.now().toString(),
          platform: socialForm.platform,
          icon: socialForm.icon,
          url: socialForm.url,
        };
        persistSocial([...social, newItem]);
        toast.success("নতুন সোশ্যাল লিংক যোগ হয়েছে ✅");
      }
      resetSocialForm();
    } catch (error) {
      console.error("❌ Social save error:", error);
      toast.error(error?.message || "সেভ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  }

  function resetSocialForm() {
    setSocialForm(emptySocialForm);
    setEditingSocialId(null);
  }

  function handleSocialEdit(link) {
    setEditingSocialId(link.id);
    setSocialForm({
      platform: link.platform || "",
      icon: link.icon || "FaGlobe",
      url: link.url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSocialDelete(id) {
    if (!confirm("এই লিংকটি মুছে ফেলতে চান?")) return;

    try {
      await api.deleteSocialLink(id);
      const newSocial = social.filter((s) => s.id !== id);
      persistSocial(newSocial);
      toast.success("সোশ্যাল লিংক মুছে ফেলা হয়েছে ✅");
      if (editingSocialId === id) resetSocialForm();
    } catch (error) {
      console.error("❌ Social delete error:", error);
      toast.error(error?.message || "মুছতে সমস্যা হয়েছে।");
    }
  }

  //Reset Social to Default
  async function handleResetSocial() {
    if (!confirm("সব সোশ্যাল লিংক ডিফল্টে রিসেট করতে চান?")) return;

    setSaving(true);
    try {
      // Delete all existing social links
      for (const link of social) {
        await api.deleteSocialLink(link.id);
      }
      // Create default social links
      for (const link of defaultSocial) {
        await api.createSocialLink({
          platform: link.platform,
          icon: link.icon,
          url: link.url || "",
        });
      }
      setSocial(defaultSocial);
      saveCollection(SOCIAL_KEY, defaultSocial);
      toast.success("সোশ্যাল লিংক ডিফল্টে রিসেট করা হয়েছে ✅");
      await fetchData();
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("রিসেট করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
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
      <span className="label-caps text-stamp">Admin / Contact</span>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <h1 className="font-display text-2xl font-semibold text-ink">
          যোগাযোগ তথ্য ম্যানেজ করুন
        </h1>
        <span className="text-sm text-ink-muted">
          {cards.length} কার্ড · {social.length} লিংক
        </span>
      </div>

      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের &quot;যোগাযোগ&quot; সেকশন ও ফুটারের কার্ড ও সোশ্যাল মিডিয়া লিংক
        এখান থেকে ম্যানেজ করুন।
        <span className="block mt-1 text-orange-500 text-xs">
          ⚡ সব ডিলিট করলে ফাকা থাকবে। রিসেট বাটনে ক্লিক করলে ডিফল্ট ফিরে আসবে।
        </span>
      </p>

      {/* ---------- Contact Cards ---------- */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-display text-xl font-semibold text-ink">
            তথ্য কার্ড (ফোন, ইমেইল, ঠিকানা...)
          </h2>
          <div className="flex gap-2">
            {!editingCardId && (
              <button
                onClick={() => {
                  resetCardForm();
                  document.getElementById('cardForm')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-marigold flex items-center gap-2 text-sm"
              >
                <FaPlus size={12} /> নতুন কার্ড
              </button>
            )}
            <button
              onClick={handleResetCards}
              disabled={saving}
              className="border border-orange-500 text-orange-500 px-3 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <FaUndo size={12} /> রিসেট
            </button>
          </div>
        </div>

        {/* Card Form */}
        <form
          id="cardForm"
          onSubmit={handleCardSubmit}
          className="mb-6 max-w-xl space-y-4 rounded-xl border border-line bg-paper p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="label-caps text-ink-muted">
              {editingCardId ? "✏️ কার্ড এডিট করুন" : "➕ নতুন কার্ড যোগ করুন"}
            </h3>
            {editingCardId && (
              <button
                type="button"
                onClick={resetCardForm}
                className="text-ink-muted hover:text-ink transition-colors"
              >
                <FaTimes size={16} />
              </button>
            )}
          </div>

          <IconPicker
            label="আইকন"
            value={cardForm.icon}
            onChange={(name) => setCardForm((f) => ({ ...f, icon: name }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="লেবেল"
              name="label"
              value={cardForm.label}
              onChange={(e) => setCardForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="যেমন: ফোন"
            />
            <Field
              label="মান"
              name="value"
              value={cardForm.value}
              onChange={(e) => setCardForm((f) => ({ ...f, value: e.target.value }))}
              placeholder="যেমন: +৮৮০ ১XXX-XXXXXX"
            />
          </div>

          <Field
            label="নোট (ঐচ্ছিক)"
            name="note"
            value={cardForm.note}
            onChange={(e) => setCardForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="যেমন: সকাল ৯টা - সন্ধ্যা ৬টা"
          />

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-marigold disabled:opacity-60">
              {saving ? "⏳ সেভ হচ্ছে..." : editingCardId ? "আপডেট করুন" : "যোগ করুন"}
            </button>
            {editingCardId && (
              <button
                type="button"
                onClick={resetCardForm}
                className="btn-outline-ink"
              >
                বাতিল
              </button>
            )}
          </div>
        </form>

        {/* Cards Grid */}
        {cards.length === 0 ? (
          <div className="text-center py-8 text-ink-muted border border-dashed border-line rounded-xl">
            <p className="font-body text-sm">এখনো কোনো কার্ড যোগ করা হয়নি।</p>
            <p className="font-body text-xs mt-1">উপরের ফর্ম ব্যবহার করে নতুন কার্ড যোগ করুন।</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => {
              const Icon = getIcon(c.icon);
              return (
                <div
                  key={c.id}
                  className="group flex items-start justify-between gap-3 rounded-xl border border-line bg-paper p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <span className="rounded-full bg-kraft p-2.5 text-stamp shrink-0">
                      <Icon size={16} />
                    </span>
                    <div>
                      <p className="label-caps text-ink-muted">{c.label || "—"}</p>
                      <p className="mt-0.5 font-body text-sm text-ink">{c.value || "—"}</p>
                      {c.note && (
                        <p className="mt-0.5 font-body text-xs text-ink-muted">{c.note}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCardEdit(c)}
                      aria-label="Edit"
                      className="rounded-lg border border-line p-2 text-ink-muted hover:bg-kraft hover:text-ink transition-colors"
                    >
                      <FaPen size={12} />
                    </button>
                    <button
                      onClick={() => handleCardDelete(c.id)}
                      aria-label="Delete"
                      className="rounded-lg border border-line p-2 text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------- Social Links ---------- */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-display text-xl font-semibold text-ink">
            সোশ্যাল মিডিয়া লিংক
          </h2>
          <div className="flex gap-2">
            {!editingSocialId && (
              <button
                onClick={() => {
                  resetSocialForm();
                  document.getElementById('socialForm')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-marigold flex items-center gap-2 text-sm"
              >
                <FaPlus size={12} /> নতুন লিংক
              </button>
            )}
            <button
              onClick={handleResetSocial}
              disabled={saving}
              className="border border-orange-500 text-orange-500 px-3 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <FaUndo size={12} /> রিসেট
            </button>
          </div>
        </div>

        {/* Social Form */}
        <form
          id="socialForm"
          onSubmit={handleSocialSubmit}
          className="mb-6 max-w-xl space-y-4 rounded-xl border border-line bg-paper p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="label-caps text-ink-muted">
              {editingSocialId ? "✏️ লিংক এডিট করুন" : "➕ নতুন সোশ্যাল লিংক যোগ করুন"}
            </h3>
            {editingSocialId && (
              <button
                type="button"
                onClick={resetSocialForm}
                className="text-ink-muted hover:text-ink transition-colors"
              >
                <FaTimes size={16} />
              </button>
            )}
          </div>

          <IconPicker
            label="আইকন / লোগো"
            value={socialForm.icon}
            onChange={(name) => setSocialForm((f) => ({ ...f, icon: name }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="প্ল্যাটফর্মের নাম"
              name="platform"
              value={socialForm.platform}
              onChange={(e) => setSocialForm((f) => ({ ...f, platform: e.target.value }))}
              placeholder="যেমন: Facebook"
            />
            <Field
              label="লিংক (URL)"
              name="url"
              value={socialForm.url}
              onChange={(e) => setSocialForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://facebook.com/..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-marigold disabled:opacity-60">
              {saving ? "⏳ সেভ হচ্ছে..." : editingSocialId ? "আপডেট করুন" : "যোগ করুন"}
            </button>
            {editingSocialId && (
              <button
                type="button"
                onClick={resetSocialForm}
                className="btn-outline-ink"
              >
                বাতিল
              </button>
            )}
          </div>
        </form>

        {/* Social Links Display */}
        {social.length === 0 ? (
          <div className="text-center py-8 text-ink-muted border border-dashed border-line rounded-xl">
            <p className="font-body text-sm">এখনো কোনো সোশ্যাল লিংক যোগ করা হয়নি।</p>
            <p className="font-body text-xs mt-1">উপরের ফর্ম ব্যবহার করে নতুন লিংক যোগ করুন।</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {social.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <div
                  key={s.id}
                  className="group flex items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="rounded-full bg-kraft p-2 text-stamp">
                    <Icon size={14} />
                  </span>
                  <div>
                    <p className="font-body text-sm font-medium text-ink">{s.platform}</p>
                    <p className="font-mono text-xs text-ink-muted truncate max-w-[150px]">
                      {s.url || "লিংক নেই"}
                    </p>
                  </div>
                  <div className="flex gap-1.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleSocialEdit(s)}
                      aria-label="Edit"
                      className="rounded-lg border border-line p-1.5 text-ink-muted hover:bg-kraft hover:text-ink transition-colors"
                    >
                      <FaPen size={11} />
                    </button>
                    <button
                      onClick={() => handleSocialDelete(s.id)}
                      aria-label="Delete"
                      className="rounded-lg border border-line p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}