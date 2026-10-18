"use client";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "@/lib/api";

const field = "w-full rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm outline-none focus:border-pink-500";

export default function SettingsPanel({ onAuthError }) {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getSettings().then(setS).catch((e) => setMsg(e.message));
  }, []);

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      setS(await saveSettings(s));
      setMsg("تم الحفظ ✓");
    } catch (err) {
      if (err.status === 401) return onAuthError();
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!s) return <p className="text-neutral-400">{msg || "جارٍ التحميل..."}</p>;

  return (
    <form onSubmit={save} className="max-w-lg space-y-4 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
      <label className="block text-sm font-bold">سعر القطعة الواحدة (د.ج)
        <input required type="number" min="0" className={field} value={s.unitPrice} onChange={(e) => setS({ ...s, unitPrice: e.target.value })} />
      </label>
      <label className="block text-sm font-bold">سعر أي قطعتين معاً - العرض الخاص (د.ج)
        <input required type="number" min="0" className={field} value={s.pairPrice} onChange={(e) => setS({ ...s, pairPrice: e.target.value })} />
      </label>
      <p className="rounded-lg bg-pink-50 px-3 py-2 text-xs leading-6 text-neutral-600">
        الحساب: كل قطعتين (من أي موديل أو لون) بسعر الزوج، والقطعة المتبقية بسعر القطعة. مثال: 3 قطع = زوج + قطعة.
      </p>
      <label className="block text-sm font-bold">رقم واتساب المتجر (اختياري)
        <input
          className={field}
          dir="ltr"
          placeholder="مثال: 213550123456"
          value={s.whatsappNumber}
          onChange={(e) => setS({ ...s, whatsappNumber: e.target.value })}
        />
        <span className="mt-1 block text-xs font-normal text-neutral-500">
          أرقام فقط مع رمز الدولة بدون + (الجزائر 213). إذا تُرك فارغاً لا يظهر زر واتساب للزبون.
        </span>
      </label>
      <div className="flex items-center gap-3">
        <button disabled={busy} className="rounded-full bg-ink px-6 py-2 text-sm font-bold text-white hover:bg-pink-500 disabled:opacity-60">
          {busy ? "..." : "حفظ"}
        </button>
        {msg && <span className="text-sm text-neutral-600">{msg}</span>}
      </div>
    </form>
  );
}
