"use client";

import { useEffect, useMemo, useState } from "react";
import { getDeliveryRates, saveDeliveryRates } from "@/lib/api";

const input =
  "w-24 rounded-lg border border-pink-200 bg-white px-2 py-1.5 text-center text-sm outline-none focus:border-pink-500 sm:w-32";

// جدول الولايات الـ58: سعر المنزل وسعر Stop Desk. الخانة الفارغة = غير محدد (لا يُقبل الطلب بها).
export default function DeliveryRatesPanel({ onAuthError }) {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getDeliveryRates()
      .then((r) => setRows(r.map((x) => ({ ...x, home: x.home ?? "", stopDesk: x.stopDesk ?? "" }))))
      .catch((e) => setMsg(e.message));
  }, []);

  const unset = useMemo(
    () => (rows ? rows.filter((r) => r.home === "" || r.stopDesk === "").length : 0),
    [rows]
  );

  const setField = (code, key, value) =>
    setRows((list) => list.map((r) => (r.code === code ? { ...r, [key]: value } : r)));

  async function save() {
    setBusy(true);
    setMsg("");
    try {
      await saveDeliveryRates(
        rows.map((r) => ({ code: r.code, home: r.home === "" ? null : Number(r.home), stopDesk: r.stopDesk === "" ? null : Number(r.stopDesk) }))
      );
      setMsg("تم حفظ أسعار التوصيل ✓");
    } catch (e) {
      if (e.status === 401) return onAuthError();
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!rows) return <p className="text-neutral-400">{msg || "جارٍ التحميل..."}</p>;

  const shown = q ? rows.filter((r) => r.name.includes(q) || String(r.code) === q.replace(/^0+/, "")) : rows;

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <input
          className="min-w-0 flex-1 rounded-lg border border-pink-200 px-3 py-2 text-sm outline-none focus:border-pink-500"
          placeholder="ابحث عن ولاية..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button onClick={save} disabled={busy} className="rounded-full bg-ink px-6 py-2 text-sm font-bold text-white hover:bg-pink-500 disabled:opacity-60">
          {busy ? "..." : "حفظ الأسعار"}
        </button>
      </div>
      {unset > 0 && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-sm font-bold text-amber-700">
          ⚠ {unset} ولاية بدون سعر كامل. لن يستطيع الزبون الطلب بالطريقة التي لا سعر لها.
        </p>
      )}
      {msg && <p className="mb-3 text-sm font-bold text-emerald-600">{msg}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-pink-100 text-neutral-500">
              <th className="px-2 py-2 text-start">#</th>
              <th className="px-2 py-2 text-start">الولاية</th>
              <th className="px-2 py-2">المنزل (د.ج)</th>
              <th className="px-2 py-2">Stop Desk (د.ج)</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.code} className="border-b border-pink-50">
                <td className="px-2 py-1.5 text-neutral-400">{String(r.code).padStart(2, "0")}</td>
                <td className="px-2 py-1.5 font-bold">{r.name}</td>
                <td className="px-2 py-1.5 text-center">
                  <input type="number" min="0" inputMode="numeric" className={input} placeholder="غير محدد" value={r.home} onChange={(e) => setField(r.code, "home", e.target.value)} />
                </td>
                <td className="px-2 py-1.5 text-center">
                  <input type="number" min="0" inputMode="numeric" className={input} placeholder="غير محدد" value={r.stopDesk} onChange={(e) => setField(r.code, "stopDesk", e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
