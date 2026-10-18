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
        active: p.active,
        defaultColor: p.defaultColor,
        colors: p.colors.map(({ name, hex, image, available }) => ({ name, hex, image, available: available !== false })),
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
    <div className="space-y-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold">الاسم بالعربية
          <input className={field} value={p.nameAr} onChange={(e) => set("nameAr", e.target.value)} />
        </label>
        <label className="text-sm font-bold">الاسم بالإنجليزية
          <input className={field} dir="ltr" value={p.name} onChange={(e) => set("name", e.target.value)} />
        </label>
      </div>
      <label className="block text-sm font-bold">اللون الذي يظهر أولاً للزبون
        <select className={field} value={p.defaultColor || ""} onChange={(e) => set("defaultColor", e.target.value)}>
          {p.colors.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" checked={p.active} onChange={(e) => set("active", e.target.checked)} />
        المنتج ظاهر في الموقع
      </label>
      <label className="block text-sm font-bold">الوصف
        <textarea rows={3} className={field} value={p.description} onChange={(e) => set("description", e.target.value)} />
      </label>

      <div>
        <p className="mb-2 text-sm font-bold">الألوان والصور</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {p.colors.map((c, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-xl p-2 ${c.available === false ? "bg-neutral-100 opacity-70" : "bg-pink-50"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileUrl(c.image)} alt="" className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1 space-y-1.5">
                <div className="flex gap-2">
                  <input className={field} value={c.name} onChange={(e) => setColor(i, { name: e.target.value })} />
                  <input type="color" value={c.hex} onChange={(e) => setColor(i, { hex: e.target.value })} className="h-9 w-10 shrink-0 cursor-pointer rounded" />
                </div>
                <label className="flex items-center gap-1.5 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={c.available !== false}
                    onChange={(e) => setColor(i, { available: e.target.checked })}
                  />
                  متوفر (إلغاء التحديد يخفيه عن الزبائن)
                </label>
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
          onClick={() =>
            set("colors", [...p.colors, { name: "لون جديد", hex: "#f4b6c8", image: p.colors[0]?.image || "", available: true }])
          }
          className="mt-2 text-sm font-bold text-pink-500"
        >
          + إضافة لون (ثم ارفعي صورته)
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
