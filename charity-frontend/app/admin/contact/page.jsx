"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";
import { api } from "@/lib/api";
import { loadCollection, saveCollection, makeId } from "@/lib/localStore";
import { getIcon } from "@/lib/iconMap";
import IconPicker from "@/components/admin/IconPicker";
import Field from "@/components/forms/Field";

const CARDS_KEY = "contactCards";
const SOCIAL_KEY = "socialLinks";


const defaultCards = [
  { id: "1", icon: "FaPhone", label: "ফোন", value: "+৮৮০ ১XXX-XXXXXX", note: "সকাল ৯টা - সন্ধ্যা ৬টা" },
  { id: "2", icon: "FaEnvelope", label: "ইমেইল", value: "info@example.org", note: "২৪ ঘন্টা উত্তর" },
  { id: "3", icon: "FaMapMarkerAlt", label: "ঠিকানা", value: "ঢাকা, বাংলাদেশ", note: "সরকারি কার্যালয়" },
];

const defaultSocial = [
  { id: "1", platform: "Facebook", icon: "FaFacebook", url: "" },
  { id: "2", platform: "YouTube", icon: "FaYoutube", url: "" },
  { id: "3", platform: "WhatsApp", icon: "FaWhatsapp", url: "" },
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

  useEffect(() => {
    (async () => {
      try {
        const [cardsData, socialData] = await Promise.all([
          api.getContactCards(),
          api.getSocialLinks(),
        ]);
        setCards(Array.isArray(cardsData) && cardsData.length ? cardsData : defaultCards);
        setSocial(Array.isArray(socialData) && socialData.length ? socialData : defaultSocial);
      } catch {
        setCards(loadCollection(CARDS_KEY, defaultCards));
        setSocial(loadCollection(SOCIAL_KEY, defaultSocial));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- তথ্য কার্ড (Phone/Email/Address...) ---------------- */

  function persistCards(next) {
    setCards(next);
    saveCollection(CARDS_KEY, next);
  }

  async function handleCardSubmit(e) {
    e.preventDefault();
    // কোনো ফিল্ড খালি রেখেও সেভ করা যাবে — শুধু সম্পূর্ণ খালি কার্ড আটকানো হচ্ছে
    if (!cardForm.label.trim() && !cardForm.value.trim()) {
      toast.error("অন্তত লেবেল বা মান একটি পূরণ করুন।");
      return;
    }
    if (editingCardId) {
      try {
        await api.updateContactCard(editingCardId, cardForm);
      } catch {
        /* ব্যাকএন্ড আনরিচেবল */
      }
      persistCards(cards.map((c) => (c.id === editingCardId ? { ...c, ...cardForm } : c)));
      toast.success("কার্ড আপডেট হয়েছে।");
    } else {
      const newCard = { id: makeId(), ...cardForm };
      try {
        await api.createContactCard(newCard);
      } catch {
        /* ব্যাকএন্ড আনরিচেবল */
      }
      persistCards([...cards, newCard]);
      toast.success("নতুন কার্ড যোগ হয়েছে।");
    }
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
    } catch {
      /* ব্যাকএন্ড আনরিচেবল */
    }
    persistCards(cards.filter((c) => c.id !== id));
    toast.success("কার্ড মুছে ফেলা হয়েছে।");
    if (editingCardId === id) {
      setEditingCardId(null);
      setCardForm(emptyCardForm);
    }
  }

  /* ---------------- সোশ্যাল মিডিয়া লিংক ---------------- */

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
    if (editingSocialId) {
      try {
        await api.updateSocialLink(editingSocialId, socialForm);
      } catch {
        /* ব্যাকএন্ড আনরিচেবল */
      }
      persistSocial(social.map((s) => (s.id === editingSocialId ? { ...s, ...socialForm } : s)));
      toast.success("লিংক আপডেট হয়েছে।");
    } else {
      const newLink = { id: makeId(), ...socialForm };
      try {
        await api.createSocialLink(newLink);
      } catch {
        /* ব্যাকএন্ড আনরিচেবল */
      }
      persistSocial([...social, newLink]);
      toast.success("নতুন সোশ্যাল লিংক যোগ হয়েছে।");
    }
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
    } catch {
      /* ব্যাকএন্ড আনরিচেবল */
    }
    persistSocial(social.filter((s) => s.id !== id));
    toast.success("সোশ্যাল লিংক মুছে ফেলা হয়েছে।");
    if (editingSocialId === id) {
      setEditingSocialId(null);
      setSocialForm(emptySocialForm);
    }
  }

  if (loading) {
    return <p className="font-body text-sm text-ink-muted">লোড হচ্ছে...</p>;
  }

  return (
    <section>
      <span className="label-caps text-stamp">Admin</span>
      <h1 className="mt-2 font-display text-2xl font-semibold">
        Edit Contact Info
      </h1>
      <p className="mt-2 max-w-xl font-body text-sm text-ink-muted">
        হোম পেজের &quot;যোগাযোগ&quot; সেকশনের কার্ড ও সোশ্যাল মিডিয়া লিংক
        এখান থেকে ম্যানেজ করুন। যেকোনো ফিল্ড খালি রেখেও সেভ করা যাবে।
      </p>

      {/* ---------- তথ্য কার্ড ---------- */}
      <h2 className="mt-8 font-display text-lg font-semibold text-ink">
        তথ্য কার্ড (ফোন, ইমেইল, ঠিকানা...)
      </h2>

      <form
        onSubmit={handleCardSubmit}
        className="mt-4 max-w-xl space-y-4 rounded-sm border border-line bg-paper p-5"
      >
        <h3 className="label-caps text-ink-muted">
          {editingCardId ? "কার্ড এডিট করুন" : "নতুন কার্ড যোগ করুন"}
        </h3>
        <IconPicker
          label="আইকন"
          value={cardForm.icon}
          onChange={(name) => setCardForm((f) => ({ ...f, icon: name }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="লেবেল"
            value={cardForm.label}
            onChange={(e) => setCardForm((f) => ({ ...f, label: e.target.value }))}
            placeholder="যেমন: ফোন"
          />
          <Field
            label="মান"
            value={cardForm.value}
            onChange={(e) => setCardForm((f) => ({ ...f, value: e.target.value }))}
            placeholder="যেমন: +৮৮০ ১XXX-XXXXXX"
          />
        </div>
        <Field
          label="নোট (ঐচ্ছিক)"
          value={cardForm.note}
          onChange={(e) => setCardForm((f) => ({ ...f, note: e.target.value }))}
          placeholder="যেমন: সকাল ৯টা - সন্ধ্যা ৬টা"
        />
        <div className="flex gap-3">
          <button type="submit" className="btn-marigold">
            <FaPlus size={12} />
            {editingCardId ? "আপডেট করুন" : "যোগ করুন"}
          </button>
          {editingCardId && (
            <button
              type="button"
              onClick={() => {
                setEditingCardId(null);
                setCardForm(emptyCardForm);
              }}
              className="btn-outline-ink"
            >
              বাতিল
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => {
          const Icon = getIcon(c.icon);
          return (
            <div
              key={c.id}
              className="flex items-start justify-between gap-3 rounded-sm border border-line bg-paper p-4"
            >
              <div className="flex items-start gap-3">
                <span className="rounded-full bg-kraft p-2.5 text-stamp">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="label-caps">{c.label || "—"}</p>
                  <p className="mt-0.5 font-body text-sm text-ink">{c.value || "—"}</p>
                  {c.note && <p className="mt-0.5 font-body text-xs text-ink-muted">{c.note}</p>}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => handleCardEdit(c)} aria-label="Edit" className="rounded-sm border border-line p-2 text-ink-muted hover:bg-kraft hover:text-ink">
                  <FaPen size={12} />
                </button>
                <button onClick={() => handleCardDelete(c.id)} aria-label="Delete" className="rounded-sm border border-line p-2 text-ink-muted hover:bg-red-50 hover:text-red-600">
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          );
        })}
        {cards.length === 0 && (
          <p className="font-body text-sm text-ink-muted">এখনো কোনো কার্ড যোগ করা হয়নি।</p>
        )}
      </div>

      {/* ---------- সোশ্যাল মিডিয়া ---------- */}
      <h2 className="mt-12 font-display text-lg font-semibold text-ink">
        সোশ্যাল মিডিয়া লিংক
      </h2>

      <form
        onSubmit={handleSocialSubmit}
        className="mt-4 max-w-xl space-y-4 rounded-sm border border-line bg-paper p-5"
      >
        <h3 className="label-caps text-ink-muted">
          {editingSocialId ? "লিংক এডিট করুন" : "নতুন সোশ্যাল লিংক যোগ করুন"}
        </h3>
        <IconPicker
          label="আইকন / লোগো"
          value={socialForm.icon}
          onChange={(name) => setSocialForm((f) => ({ ...f, icon: name }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="প্ল্যাটফর্মের নাম"
            value={socialForm.platform}
            onChange={(e) => setSocialForm((f) => ({ ...f, platform: e.target.value }))}
            placeholder="যেমন: Facebook"
          />
          <Field
            label="লিংক (URL)"
            value={socialForm.url}
            onChange={(e) => setSocialForm((f) => ({ ...f, url: e.target.value }))}
            placeholder="https://facebook.com/..."
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-marigold">
            <FaPlus size={12} />
            {editingSocialId ? "আপডেট করুন" : "যোগ করুন"}
          </button>
          {editingSocialId && (
            <button
              type="button"
              onClick={() => {
                setEditingSocialId(null);
                setSocialForm(emptySocialForm);
              }}
              className="btn-outline-ink"
            >
              বাতিল
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 flex flex-wrap gap-3">
        {social.map((s) => {
          const Icon = getIcon(s.icon);
          return (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-sm border border-line bg-paper px-4 py-3"
            >
              <span className="rounded-full bg-kraft p-2 text-stamp">
                <Icon size={14} />
              </span>
              <div>
                <p className="font-body text-sm font-medium text-ink">{s.platform}</p>
                <p className="font-mono text-xs text-ink-muted">{s.url || "লিংক নেই"}</p>
              </div>
              <div className="ml-2 flex gap-1.5">
                <button onClick={() => handleSocialEdit(s)} aria-label="Edit" className="rounded-sm border border-line p-1.5 text-ink-muted hover:bg-kraft hover:text-ink">
                  <FaPen size={11} />
                </button>
                <button onClick={() => handleSocialDelete(s.id)} aria-label="Delete" className="rounded-sm border border-line p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-600">
                  <FaTrash size={11} />
                </button>
              </div>
            </div>
          );
        })}
        {social.length === 0 && (
          <p className="font-body text-sm text-ink-muted">এখনো কোনো সোশ্যাল লিংক যোগ করা হয়নি।</p>
        )}
      </div>
    </section>
  );
}
