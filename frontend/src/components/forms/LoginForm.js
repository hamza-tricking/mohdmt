"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";

const field =
  "w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-base outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { token } = await login(email, password);
      setToken(token);
      router.replace("/admin");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-3 rounded-3xl bg-white p-7 shadow-xl">
      <h1 className="mb-2 text-center text-2xl font-extrabold">لوحة التحكم</h1>
      <input required type="email" dir="ltr" className={field} placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
      <input required type="password" dir="ltr" className={field} placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-ink py-3 font-bold text-white hover:bg-pink-500 disabled:opacity-60">
        {busy ? "..." : "دخول"}
      </button>
    </form>
  );
}
