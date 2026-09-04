"use client";

import { useRef, useState } from "react";
import { FaCloudUploadAlt, FaTrash, FaSpinner } from "react-icons/fa";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

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
  const [preview, setPreview] = useState(value || "");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setError("");
    setUploading(true);

    try {
      const result = await api.uploadImage(file);
      
      console.log("📸 Upload result:", result);
      
      if (!result?.url) {
        throw new Error("আপলোড ব্যর্থ হয়েছে — সার্ভার থেকে url পাওয়া যায়নি।");
      }
      
      setPreview(result.url);
      onChange(result.url);
      toast.success("ছবি আপলোড হয়েছে ✅");
    } catch (err) {
      const errorMsg = err?.response?.data?.error?.message || err.message || "আপলোড ব্যর্থ হয়েছে, আবার চেষ্টা করুন।";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    setPreview("");
    onChange("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    toast.success("ছবি সরানো হয়েছে");
  }

  return (
    <div role="group" aria-label={label || "ছবি আপলোডার"}>
      {label && (
        <label 
          className="label-caps mb-1 block" 
          id={`${label}-label`}
        >
          {label}
        </label>
      )}

      <div 
        className={`relative ${aspect} w-full overflow-hidden rounded-sm border border-line bg-kraft/40 transition-all hover:border-marigold/50`}
        role="img"
        aria-label={preview ? "আপলোড করা ছবি" : "ছবি আপলোডের স্থান"}
      >
        {preview ? (
          <div className="relative h-full w-full">
            <img 
              src={preview} 
              alt={label || "আপলোড করা ছবি"} 
              className="h-full w-full object-cover"
              onError={(e) => {
                console.error("❌ Preview image failed:", preview);
                e.target.src = "/images/placeholder.jpg";
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/0 opacity-0 transition-all hover:bg-ink/50 hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-sm bg-paper/90 px-3 py-1.5 font-body text-xs font-semibold text-ink hover:bg-paper"
                aria-label={`${label || "ছবি"} পরিবর্তন করুন`}
              >
                বদলান
              </button>
              <button
                type="button"
                onClick={handleRemove}
                aria-label={`${label || "ছবি"} মুছে ফেলুন`}
                className="rounded-sm bg-red-600/90 p-2 text-white hover:bg-red-600"
              >
                <FaTrash size={12} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-muted transition-colors hover:text-ink"
            aria-label={uploading ? "আপলোড হচ্ছে..." : `${label || "ছবি"} আপলোড করতে ক্লিক করুন`}
            aria-disabled={uploading}
          >
            {uploading ? (
              <FaSpinner className="animate-spin" size={22} aria-hidden="true" />
            ) : (
              <FaCloudUploadAlt size={22} aria-hidden="true" />
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
        aria-label={label || "ছবি আপলোড"}
      />

      {helpText && (
        <p className="mt-1.5 font-body text-xs text-ink-muted" id={`${label}-help`}>
          {helpText}
        </p>
      )}
      {error && (
        <p className="mt-1.5 font-body text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}