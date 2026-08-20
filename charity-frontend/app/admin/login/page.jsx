"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import Stamp from "@/components/ui/Stamp";
import Field from "@/components/forms/Field";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err.message || "লগইন ব্যর্থ হয়েছে, তথ্য যাচাই করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex flex-col items-center text-center">
        <Stamp size={56} rotate={-6} lines={["ঐক্য", "তান"]} />
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
          অ্যাডমিন লগইন
        </h1>
        <p className="mt-1 font-body text-sm text-ink-muted">
          ঐক্যতান ফাউন্ডেশন কনটেন্ট ম্যানেজমেন্ট
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-sm border border-line bg-paper p-6"
      >
        <Field
          label="ইমেইল"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="admin@example.org"
        />
        <Field
          label="পাসওয়ার্ড"
          name="password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
        />

        {error && <p className="font-body text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-marigold w-full justify-center disabled:opacity-60"
        >
          {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
        </button>
      </form>
    </div>
  );
}
