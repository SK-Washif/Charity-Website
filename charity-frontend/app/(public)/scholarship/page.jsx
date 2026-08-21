"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitScholarship } from '@/lib/scholarshipService';

const initialForm = {
  studentNameEn: "",
  fatherNameEn: "",
  motherNameEn: "",
  studentMobile: "",
  gender: "",
  hscGroup: "", // ✅ নতুন
  permanentDivision: "",
  permanentDistrict: "",
  permanentUpazila: "",
  permanentMunicipality: "",
  permanentVillage: "",
  currentDivision: "",
  currentDistrict: "",
  currentUpazila: "",
  currentMunicipality: "",
  currentVillage: "",
  gpa: "",
  gpaWithout4th: "",
  guardianYearlyIncome: "",
  hasDisability: "",
  disabilityType: "",
  siblingsCount: "",
};

function Field({ label, children, required }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-sm text-ink-muted">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-stamp/30 bg-white px-3 py-2 font-body text-base text-ink outline-none transition focus:border-stamp focus:ring-1 focus:ring-stamp";

export default function ScholarshipPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await submitScholarship(form);

      if (result.success) {
        localStorage.setItem("scholarshipFormData", JSON.stringify(form));
        router.push("/scholarship/print");
      } else {
        setError(`দুঃখিত, ফর্ম জমা দেওয়া যায়নি: ${result.error || "অজানা ত্রুটি"}`);
        setSubmitting(false);
      }
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "দুঃখিত, সার্ভারের সাথে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।"
        );
      } else {
        setError(`দুঃখিত, ফর্ম জমা দেওয়া যায়নি: ${err.message}`);
      }
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <span className="label-caps text-stamp">
        নূরুল বাছেরা শিক্ষা বৃত্তি প্রকল্প — আবেদন (ধাপ ১)
      </span>
      <h1 className="mt-2 font-display text-3xl font-semibold">
        Scholarship Application
      </h1>
      <p className="mt-4 max-w-xl font-body text-ink-muted">
        নিচের তথ্যগুলো পূরণ করে জমা দিন। Submit হলে আপনাকে প্রিন্টযোগ্য পূর্ণাঙ্গ ফর্ম পেজে নিয়ে যাওয়া
        হবে, যেখানে এই তথ্যগুলো আগে থেকেই পূরণ করা থাকবে।
      </p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-10">
        {/* শিক্ষার্থীর তথ্য */}
        <fieldset className="space-y-4">
          <legend className="label-caps mb-2 text-stamp">
            শিক্ষার্থীর তথ্য
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="শিক্ষার্থীর নাম (ইংরেজি)" required>
              <input
                required
                className={inputClass}
                value={form.studentNameEn}
                onChange={(e) => update("studentNameEn", e.target.value)}
              />
            </Field>
            
            <Field label="শিক্ষার্থীর মোবাইল নম্বর" required>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-ink-muted">
                  +880
                </span>
                <input
                  required
                  type="tel"
                  className={`${inputClass} pl-14`}
                  value={form.studentMobile}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    const limited = raw.slice(0, 10);
                    update("studentMobile", limited);
                  }}
                  maxLength="10"
                />
              </div>
              
            </Field>

            <Field label="এইচ.এস.সি বিভাগ" required>
              <select
                required
                className={inputClass}
                value={form.hscGroup}
                onChange={(e) => update("hscGroup", e.target.value)}
              >
                <option value="">নির্বাচন করুন</option>
                <option value="বিজ্ঞান">বিজ্ঞান</option>
                <option value="মানবিক">মানবিক</option>
                <option value="ব্যবসা শিক্ষা">ব্যবসা শিক্ষা</option>
              </select>
            </Field>

            <Field label="কতজন ভাই-বোন আছে?" required>
              <input
                required
                type="number"
                min="0"
                className={inputClass}
                value={form.siblingsCount}
                onChange={(e) => update("siblingsCount", e.target.value)}
              />
            </Field>

            <Field label="লিঙ্গ" required>
              <div className="flex items-center gap-5 py-2">
                {["পুরুষ", "মহিলা", "অন্যান্য"].map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-2 font-body text-sm"
                  >
                    <input
                      required
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={(e) => update("gender", e.target.value)}
                    />
                    {g}
                  </label>
                ))}
              </div>
            </Field>

            
          </div>
        </fieldset>

        {/* অভিভাবকের তথ্য */}
        <fieldset className="space-y-4">
          <legend className="label-caps mb-2 text-stamp">
            অভিভাবকের তথ্য
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="পিতার নাম (ইংরেজি)" required>
              <input
                required
                className={inputClass}
                value={form.fatherNameEn}
                onChange={(e) => update("fatherNameEn", e.target.value)}
              />
            </Field>
            <Field label="মাতার নাম (ইংরেজি)" required>
              <input
                required
                className={inputClass}
                value={form.motherNameEn}
                onChange={(e) => update("motherNameEn", e.target.value)}
              />
            </Field>
            <Field label="অভিভাবকের বাৎসরিক আয় (টাকায়)" required>
              <input
                required
                type="number"
                min="0"
                className={inputClass}
                value={form.guardianYearlyIncome}
                onChange={(e) =>
                  update("guardianYearlyIncome", e.target.value)
                }
              />
            </Field>
          </div>
        </fieldset>

        {/* ঠিকানা */}
        <fieldset className="space-y-6">
          <legend className="label-caps mb-2 text-stamp">ঠিকানা</legend>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="space-y-4">
              <p className="font-body text-sm font-semibold text-ink">
                স্থায়ী ঠিকানা
              </p>
              <Field label="বিভাগ" required>
                <input
                  required
                  className={inputClass}
                  value={form.permanentDivision}
                  onChange={(e) => update("permanentDivision", e.target.value)}
                />
              </Field>
              <Field label="জেলা" required>
                <input
                  required
                  className={inputClass}
                  value={form.permanentDistrict}
                  onChange={(e) => update("permanentDistrict", e.target.value)}
                />
              </Field>
              <Field label="উপজেলা" required>
                <input
                  required
                  className={inputClass}
                  value={form.permanentUpazila}
                  onChange={(e) => update("permanentUpazila", e.target.value)}
                />
              </Field>
              <Field label="পৌরসভা/ইউনিয়ন/সিটি কর্পোরেশন" required>
                <input
                  required
                  className={inputClass}
                  value={form.permanentMunicipality}
                  onChange={(e) =>
                    update("permanentMunicipality", e.target.value)
                  }
                />
              </Field>
              <Field label="গ্রাম" required>
                <input
                  required
                  className={inputClass}
                  value={form.permanentVillage}
                  onChange={(e) => update("permanentVillage", e.target.value)}
                />
              </Field>
            </div>

            <div className="space-y-4">
              <p className="font-body text-sm font-semibold text-ink">
                বর্তমান ঠিকানা
              </p>
              <Field label="বিভাগ" required>
                <input
                  required
                  className={inputClass}
                  value={form.currentDivision}
                  onChange={(e) => update("currentDivision", e.target.value)}
                />
              </Field>
              <Field label="জেলা" required>
                <input
                  required
                  className={inputClass}
                  value={form.currentDistrict}
                  onChange={(e) => update("currentDistrict", e.target.value)}
                />
              </Field>
              <Field label="উপজেলা" required>
                <input
                  required
                  className={inputClass}
                  value={form.currentUpazila}
                  onChange={(e) => update("currentUpazila", e.target.value)}
                />
              </Field>
              <Field label="পৌরসভা/ইউনিয়ন/সিটি কর্পোরেশন" required>
                <input
                  required
                  className={inputClass}
                  value={form.currentMunicipality}
                  onChange={(e) =>
                    update("currentMunicipality", e.target.value)
                  }
                />
              </Field>
              <Field label="গ্রাম" required>
                <input
                  required
                  className={inputClass}
                  value={form.currentVillage}
                  onChange={(e) => update("currentVillage", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </fieldset>

        {/* শিক্ষা ফলাফল - এখানে hscGroup যোগ করা হয়েছে */}
        <fieldset className="space-y-4">
          <legend className="label-caps mb-2 text-stamp">
            শিক্ষা ফলাফল (এস.এস.সি)
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* <Field label="এইচ.এস.সি বিভাগ" required>
              <select
                required
                className={inputClass}
                value={form.hscGroup}
                onChange={(e) => update("hscGroup", e.target.value)}
              >
                <option value="">নির্বাচন করুন</option>
                <option value="বিজ্ঞান">বিজ্ঞান</option>
                <option value="মানবিক">মানবিক</option>
                <option value="ব্যবসা শিক্ষা">ব্যবসা শিক্ষা</option>
              </select>
            </Field> */}
            <Field label="ফলাফল (জিপিএ)" required>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                max="5"
                className={inputClass}
                value={form.gpa}
                onChange={(e) => update("gpa", e.target.value)}
              />
            </Field>
            <Field label="ফলাফল (জিপিএ) — ৪র্থ বিষয় ছাড়া" required>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                max="5"
                className={inputClass}
                value={form.gpaWithout4th}
                onChange={(e) => update("gpaWithout4th", e.target.value)}
              />
            </Field>
          </div>
        </fieldset>

        {/* প্রতিবন্ধকতা */}
        <fieldset className="space-y-4">
          <legend className="label-caps mb-2 text-stamp">
            অতিরিক্ত তথ্য
          </legend>
          <Field label="আবেদনকারীর কি কোনো শারীরিক প্রতিবন্ধকতা আছে?" required>
            <div className="flex items-center gap-5 py-2">
              {["হ্যাঁ", "না"].map((v) => (
                <label
                  key={v}
                  className="flex items-center gap-2 font-body text-sm"
                >
                  <input
                    required
                    type="radio"
                    name="hasDisability"
                    value={v}
                    checked={form.hasDisability === v}
                    onChange={(e) => update("hasDisability", e.target.value)}
                  />
                  {v}
                </label>
              ))}
            </div>
          </Field>

          {form.hasDisability === "হ্যাঁ" && (
            <Field label="কি ধরনের প্রতিবন্ধকতা?" required>
              <input
                required
                className={inputClass}
                value={form.disabilityType}
                onChange={(e) => update("disabilityType", e.target.value)}
              />
            </Field>
          )}
        </fieldset>

        {error && (
          <p className="font-body text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-stamp px-6 py-3 font-body font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "জমা হচ্ছে..." : "জমা দিন এবং প্রিন্ট ফর্ম দেখুন"}
        </button>
      </form>
    </section>
  );
}