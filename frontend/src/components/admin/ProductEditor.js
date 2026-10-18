"use client";

import { useState } from "react";
import { fileUrl, updateProduct, uploadFile } from "@/lib/api";

const field = "w-full rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm outline-none focus:border-pink-500";

export default function ProductEditor({ product, onSaved }) {
  const [p, setP] = useState(product);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setP((s) => ({ ...s, [k]: v }));
  const setColor = (i, patch) =>
    setP((s) => ({ ...s, colors: s.colors.map((c, j) => (j === i ? { ...c, ...patch } : c)) }));

  async function onImage(i, file) {
    if (!file) return;
    try {
      const { url } = await uploadFile(file);
      setColor(i, { image: url });
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function save() {
    setBusy(true);
    setMsg("");
    try {
      const saved = await updateProduct(p._id, {
        name: p.name,
        nameAr: p.nameAr,
        description: p.description,
        price: Number(p.price),
        active: p.active,
        colors: p.colors.map(({ name, hex, image }) => ({ name, hex, image })),
      });
      setP(saved);
      onSaved?.(saved);
      setMsg("تم الحفظ ✓");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold">الاسم بالعربية
          <input className={field} value={p.nameAr} onChange={(e) => set("nameAr", e.target.value)} />
        </label>
        <label className="text-sm font-bold">الاسم بالإنجليزية
          <input className={field} dir="ltr" value={p.name} onChange={(e) => set("name", e.target.value)} />
        </label>
        <label className="text-sm font-bold">السعر (د.ج)
          <input className={field} type="number" min="0" value={p.price} onChange={(e) => set("price", e.target.value)} />
        </label>
        <label className="flex items-center gap-2 pt-6 text-sm font-bold">
          <input type="checkbox" checked={p.active} onChange={(e) => set("active", e.target.checked)} />
          ظاهر في الموقع
        </label>
      </div>
      <label className="block text-sm font-bold">الوصف
        <textarea rows={3} className={field} value={p.description} onChange={(e) => set("description", e.target.value)} />
      </label>

      <div>
        <p className="mb-2 text-sm font-bold">الألوان والصور</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {p.colors.map((c, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-pink-50 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileUrl(c.image)} alt="" className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1 space-y-1.5">
                <div className="flex gap-2">
                  <input className={field} value={c.name} onChange={(e) => setColor(i, { name: e.target.value })} />
                  <input type="color" value={c.hex} onChange={(e) => setColor(i, { hex: e.target.value })} className="h-9 w-10 shrink-0 cursor-pointer rounded" />
                </div>
                <input type="file" accept="image/*" className="w-full text-xs" onChange={(e) => onImage(i, e.target.files[0])} />
              </div>
              <button
                type="button"
                onClick={() => set("colors", p.colors.filter((_, j) => j !== i))}
                className="text-lg text-red-500"
                aria-label="حذف اللون"
              >×</button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => set("colors", [...p.colors, { name: "لون جديد", hex: "#f4b6c8", image: p.colors[0]?.image || "" }])}
          className="mt-2 text-sm font-bold text-pink-500"
        >
          + إضافة لون
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy} className="rounded-full bg-ink px-6 py-2 text-sm font-bold text-white hover:bg-pink-500 disabled:opacity-60">
          {busy ? "..." : "حفظ"}
        </button>
        {msg && <span className="text-sm text-neutral-600">{msg}</span>}
      </div>
    </div>
  );
}
