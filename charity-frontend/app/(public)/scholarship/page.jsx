"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitScholarship } from '@/lib/scholarshipService';

const initialForm = {
  studentNameEn: "",
  fatherNameEn: "",
  motherNameEn: "",
  studentMobile: "",
  gender: "",
  hscGroup: "",
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

// ✅ Field validation helper
const requiredFields = {
  studentNameEn: "শিক্ষার্থীর নাম (ইংরেজি)",
  studentMobile: "শিক্ষার্থীর মোবাইল নম্বর",
  hscGroup: "এইচ.এস.সি বিভাগ",
  siblingsCount: "কতজন ভাই-বোন আছে?",
  gender: "লিঙ্গ",
  fatherNameEn: "পিতার নাম (ইংরেজি)",
  motherNameEn: "মাতার নাম (ইংরেজি)",
  guardianYearlyIncome: "অভিভাবকের বাৎসরিক আয়",
  permanentDivision: "স্থায়ী বিভাগ",
  permanentDistrict: "স্থায়ী জেলা",
  permanentUpazila: "স্থায়ী উপজেলা",
  permanentMunicipality: "স্থায়ী পৌরসভা/ইউনিয়ন",
  permanentVillage: "স্থায়ী গ্রাম",
  currentDivision: "বর্তমান বিভাগ",
  currentDistrict: "বর্তমান জেলা",
  currentUpazila: "বর্তমান উপজেলা",
  currentMunicipality: "বর্তমান পৌরসভা/ইউনিয়ন",
  currentVillage: "বর্তমান গ্রাম",
  gpa: "ফলাফল (জিপিএ)",
  gpaWithout4th: "ফলাফল (জিপিএ) — ৪র্থ বিষয় ছাড়া",
  hasDisability: "শারীরিক প্রতিবন্ধকতা",
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
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // ✅ Prefetch print page on mount
  useEffect(() => {
    router.prefetch("/scholarship/print");
  }, [router]);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error for this field when user types
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }

  // ✅ Custom validation function
  function validateForm() {
    const errors = {};
    
    for (const [key, label] of Object.entries(requiredFields)) {
      const value = form[key];
      // Check for empty values
      if (value === undefined || value === null || value.toString().trim() === "") {
        errors[key] = `"${label}" ফিল্ডটি পূরণ করুন`;
      }
    }

    // Special validation for disability
    if (form.hasDisability === "হ্যাঁ" && !form.disabilityType.trim()) {
      errors.disabilityType = '"প্রতিবন্ধকতার ধরন" ফিল্ডটি পূরণ করুন';
    }

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});

    // ✅ Run custom validation
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      
      // ✅ Scroll to first error field
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorKey}"]`);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitting(true);

    // ✅ Save to localStorage
    localStorage.setItem("scholarshipFormData", JSON.stringify(form));
    console.log("📤 Data saved to localStorage, redirecting to print page...");

    // ✅ Use startTransition for smooth navigation
    startTransition(() => {
      router.push("/scholarship/print");
    });

    // ✅ Background API call
    try {
      const result = await submitScholarship(form);
      if (result.success) {
        console.log("✅ Scholarship submitted successfully to Google Sheets");
      } else {
        console.error("❌ Scholarship submission failed:", result.error);
      }
    } catch (err) {
      console.error("❌ Background API error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  // ✅ Helper to check if field has error
  function hasError(fieldName) {
    return !!fieldErrors[fieldName];
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
        নিচের তথ্যগুলো পূরণ করে Submit করুন। Submit হলে আপনাকে প্রিন্ট যোগ্য পূর্ণাঙ্গ ফর্ম পেজে নিয়ে যাওয়া হবে এবং সেটি ডাউনলোড করুন। 
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 max-w-3xl space-y-10">
        {/* শিক্ষার্থীর তথ্য */}
        <fieldset className="space-y-4">
          <legend className="label-caps mb-2 text-stamp">
            শিক্ষার্থীর তথ্য
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Field label="শিক্ষার্থীর নাম (ইংরেজি)" required>
                <input
                  name="studentNameEn"
                  className={`${inputClass} ${hasError('studentNameEn') ? 'border-red-500 ring-red-500' : ''}`}
                  value={form.studentNameEn}
                  onChange={(e) => update("studentNameEn", e.target.value)}
                />
              </Field>
              {hasError('studentNameEn') && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.studentNameEn}</p>
              )}
            </div>
            
            <div>
              <Field label="শিক্ষার্থীর মোবাইল নম্বর" required>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-ink-muted">
                    +880
                  </span>
                  <input
                    name="studentMobile"
                    type="tel"
                    className={`${inputClass} pl-14 ${hasError('studentMobile') ? 'border-red-500 ring-red-500' : ''}`}
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
              {hasError('studentMobile') && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.studentMobile}</p>
              )}
            </div>

            <div>
              <Field label="এইচ.এস.সি বিভাগ" required>
                <select
                  name="hscGroup"
                  className={`${inputClass} ${hasError('hscGroup') ? 'border-red-500 ring-red-500' : ''}`}
                  value={form.hscGroup}
                  onChange={(e) => update("hscGroup", e.target.value)}
                >
                  <option value="">নির্বাচন করুন</option>
                  <option value="বিজ্ঞান">বিজ্ঞান</option>
                  <option value="মানবিক">মানবিক</option>
                  <option value="ব্যবসা শিক্ষা">ব্যবসা শিক্ষা</option>
                </select>
              </Field>
              {hasError('hscGroup') && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.hscGroup}</p>
              )}
            </div>

            <div>
              <Field label="কতজন ভাই-বোন আছে?" required>
                <input
                  name="siblingsCount"
                  type="number"
                  min="0"
                  className={`${inputClass} ${hasError('siblingsCount') ? 'border-red-500 ring-red-500' : ''}`}
                  value={form.siblingsCount}
                  onChange={(e) => update("siblingsCount", e.target.value)}
                />
              </Field>
              {hasError('siblingsCount') && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.siblingsCount}</p>
              )}
            </div>

            <div>
              <Field label="লিঙ্গ" required>
                <div className="flex items-center gap-5 py-2">
                  {["পুরুষ", "মহিলা", "অন্যান্য"].map((g) => (
                    <label
                      key={g}
                      className="flex items-center gap-2 font-body text-sm"
                    >
                      <input
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
              {hasError('gender') && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.gender}</p>
              )}
            </div>
          </div>
        </fieldset>

        {/* অভিভাবকের তথ্য */}
        <fieldset className="space-y-4">
          <legend className="label-caps mb-2 text-stamp">
            অভিভাবকের তথ্য
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Field label="পিতার নাম (ইংরেজি)" required>
                <input
                  name="fatherNameEn"
                  className={`${inputClass} ${hasError('fatherNameEn') ? 'border-red-500 ring-red-500' : ''}`}
                  value={form.fatherNameEn}
                  onChange={(e) => update("fatherNameEn", e.target.value)}
                />
              </Field>
              {hasError('fatherNameEn') && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.fatherNameEn}</p>
              )}
            </div>
            <div>
              <Field label="মাতার নাম (ইংরেজি)" required>
                <input
                  name="motherNameEn"
                  className={`${inputClass} ${hasError('motherNameEn') ? 'border-red-500 ring-red-500' : ''}`}
                  value={form.motherNameEn}
                  onChange={(e) => update("motherNameEn", e.target.value)}
                />
              </Field>
              {hasError('motherNameEn') && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.motherNameEn}</p>
              )}
            </div>
            <div>
              <Field label="অভিভাবকের বাৎসরিক আয় (টাকায়)" required>
                <input
                  name="guardianYearlyIncome"
                  type="number"
                  min="0"
                  className={`${inputClass} ${hasError('guardianYearlyIncome') ? 'border-red-500 ring-red-500' : ''}`}
                  value={form.guardianYearlyIncome}
                  onChange={(e) =>
                    update("guardianYearlyIncome", e.target.value)
                  }
                />
              </Field>
              {hasError('guardianYearlyIncome') && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.guardianYearlyIncome}</p>
              )}
            </div>
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
              <div>
                <Field label="বিভাগ" required>
                  <input
                    name="permanentDivision"
                    className={`${inputClass} ${hasError('permanentDivision') ? 'border-red-500 ring-red-500' : ''}`}
                    value={form.permanentDivision}
                    onChange={(e) => update("permanentDivision", e.target.value)}
                  />
                </Field>
                {hasError('permanentDivision') && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.permanentDivision}</p>
                )}
              </div>
              <div>
                <Field label="জেলা" required>
                  <input
                    name="permanentDistrict"
                    className={`${inputClass} ${hasError('permanentDistrict') ? 'border-red-500 ring-red-500' : ''}`}
                    value={form.permanentDistrict}
                    onChange={(e) => update("permanentDistrict", e.target.value)}
                  />
                </Field>
                {hasError('permanentDistrict') && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.permanentDistrict}</p>
                )}
              </div>
              <div>
                <Field label="উপজেলা" required>
                  <input
                    name="permanentUpazila"
                    className={`${inputClass} ${hasError('permanentUpazila') ? 'border-red-500 ring-red-500' : ''}`}
                    value={form.permanentUpazila}
                    onChange={(e) => update("permanentUpazila", e.target.value)}
                  />
                </Field>
                {hasError('permanentUpazila') && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.permanentUpazila}</p>
                )}
              </div>
              <div>
                <Field label="পৌরসভা/ইউনিয়ন/সিটি কর্পোরেশন" required>
                  <input
                    name="permanentMunicipality"
                    className={`${inputClass} ${hasError('permanentMunicipality') ? 'border-red-500 ring-red-500' : ''}`}
                    value={form.permanentMunicipality}
                    onChange={(e) =>
                      update("permanentMunicipality", e.target.value)
                    }
                  />
                </Field>
                {hasError('permanentMunicipality') && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.permanentMunicipality}</p>
                )}
              </div>
              <div>
                <Field label="গ্রাম" required>
                  <input
                    name="permanentVillage"
                    className={`${inputClass} ${hasError('permanentVillage') ? 'border-red-500 ring-red-500' : ''}`}
                    value={form.permanentVillage}
                    onChange={(e) => update("permanentVillage", e.target.value)}
                  />
                </Field>
                {hasError('permanentVillage') && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.permanentVillage}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-body text-sm font-semibold text-ink">
                বর্তমান ঠিকানা
              </p>
              <div>
                <Field label="বিভাগ" required>
                  <input
                    name="currentDivision"
                    className={`${inputClass} ${hasError('currentDivision') ? 'border-red-500 ring-red-500' : ''}`}
                    value={form.currentDivision}
                    onChange={(e) => update("currentDivision", e.target.value)}
                  />
                </Field>
                {hasError('currentDivision') && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.currentDivision}</p>
                )}
              </div>
              <div>
                <Field label="জেলা" required>
                  <input
                    name="currentDistrict"
                    className={`${inputClass} ${hasError('currentDistrict') ? 'border-red-500 ring-red-500' : ''}`}
                    value={form.currentDistrict}
                    onChange={(e) => update("currentDistrict", e.target.value)}
                  />
                </Field>
                {hasError('currentDistrict') && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.currentDistrict}</p>
                )}
              </div>
              <div>
                <Field label="উপজেলা" required>
                  <input
                    name="currentUpazila"
                    className={`${inputClass} ${hasError('currentUpazila') ? 'border-red-500 ring-red-500' : ''}`}
                    value={form.currentUpazila}
                    onChange={(e) => update("currentUpazila", e.target.value)}
                  />
                </Field>
                {hasError('currentUpazila') && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.currentUpazila}</p>
                )}
              </div>
              <div>
                <Field label="পৌরসভা/ইউনিয়ন/সিটি কর্পোরেশন" required>
                  <input
                    name="currentMunicipality"
                    className={`${inputClass} ${hasError('currentMunicipality') ? 'border-red-500 ring-red-500' : ''}`}
                    value={form.currentMunicipality}
                    onChange={(e) =>
                      update("currentMunicipality", e.target.value)
                    }
                  />
                </Field>
                {hasError('currentMunicipality') && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.currentMunicipality}</p>
                )}
              </div>
              <div>
                <Field label="গ্রাম" required>
                  <input
                    name="currentVillage"
                    className={`${inputClass} ${hasError('currentVillage') ? 'border-red-500 ring-red-500' : ''}`}
                    value={form.currentVillage}
                    onChange={(e) => update("currentVillage", e.target.value)}
                  />
                </Field>
                {hasError('currentVillage') && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.currentVillage}</p>
                )}
              </div>
            </div>
          </div>
        </fieldset>

        {/* শিক্ষা ফলাফল */}
        <fieldset className="space-y-4">
          <legend className="label-caps mb-2 text-stamp">
            শিক্ষা ফলাফল (এস.এস.সি)
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Field label="ফলাফল (জিপিএ)" required>
                <input
                  name="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  className={`${inputClass} ${hasError('gpa') ? 'border-red-500 ring-red-500' : ''}`}
                  value={form.gpa}
                  onChange={(e) => update("gpa", e.target.value)}
                />
              </Field>
              {hasError('gpa') && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.gpa}</p>
              )}
            </div>
            <div>
              <Field label="ফলাফল (জিপিএ) — ৪র্থ বিষয় ছাড়া" required>
                <input
                  name="gpaWithout4th"
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  className={`${inputClass} ${hasError('gpaWithout4th') ? 'border-red-500 ring-red-500' : ''}`}
                  value={form.gpaWithout4th}
                  onChange={(e) => update("gpaWithout4th", e.target.value)}
                />
              </Field>
              {hasError('gpaWithout4th') && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.gpaWithout4th}</p>
              )}
            </div>
          </div>
        </fieldset>

        {/* প্রতিবন্ধকতা */}
        <fieldset className="space-y-4">
          <legend className="label-caps mb-2 text-stamp">
            অতিরিক্ত তথ্য
          </legend>
          <div>
            <Field label="আবেদনকারীর কি কোনো শারীরিক প্রতিবন্ধকতা আছে?" required>
              <div className="flex items-center gap-5 py-2">
                {["হ্যাঁ", "না"].map((v) => (
                  <label
                    key={v}
                    className="flex items-center gap-2 font-body text-sm"
                  >
                    <input
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
            {hasError('hasDisability') && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.hasDisability}</p>
            )}
          </div>

          {form.hasDisability === "হ্যাঁ" && (
            <div>
              <Field label="কি ধরনের প্রতিবন্ধকতা?" required>
                <input
                  name="disabilityType"
                  className={`${inputClass} ${hasError('disabilityType') ? 'border-red-500 ring-red-500' : ''}`}
                  value={form.disabilityType}
                  onChange={(e) => update("disabilityType", e.target.value)}
                />
              </Field>
              {hasError('disabilityType') && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.disabilityType}</p>
              )}
            </div>
          )}
        </fieldset>

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