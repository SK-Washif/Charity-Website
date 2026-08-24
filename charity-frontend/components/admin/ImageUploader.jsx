"use client";

import { useRef, useState } from "react";
import { FaCloudUploadAlt, FaTrash, FaSpinner } from "react-icons/fa";
import { api } from "@/lib/api";

export default function ImageUploader({
  label,
  value,
  onChange,
  aspect = "aspect-video",
  helpText,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const result = await api.uploadImage(file);
      if (!result?.url) {
        throw new Error("আপলোড ব্যর্থ হয়েছে — সার্ভার থেকে url পাওয়া যায়নি।");
      }
      onChange(result.url);
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
          err.message ||
          "আপলোড ব্যর্থ হয়েছে, আবার চেষ্টা করুন।"
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange("");
    setError("");
  }

  return (
    <div>
      {label && <label className="label-caps mb-1 block">{label}</label>}

      <div
        className={`relative ${aspect} w-full overflow-hidden rounded-sm border border-line bg-kraft/40`}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/0 opacity-0 transition-all hover:bg-ink/50 hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-sm bg-paper/90 px-3 py-1.5 font-body text-xs font-semibold text-ink hover:bg-paper"
              >
                বদলান
              </button>
              <button
                type="button"
                onClick={handleRemove}
                aria-label="ছবি মুছে ফেলুন"
                className="rounded-sm bg-red-600/90 p-2 text-white hover:bg-red-600"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-muted transition-colors hover:text-ink"
          >
            {uploading ? (
              <FaSpinner className="animate-spin" size={22} />
            ) : (
              <FaCloudUploadAlt size={22} />
            )}
            <span className="font-body text-xs">
              {uploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করতে ক্লিক করুন"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {helpText && (
        <p className="mt-1.5 font-body text-xs text-ink-muted">{helpText}</p>
      )}
      {error && (
        <p className="mt-1.5 font-body text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
