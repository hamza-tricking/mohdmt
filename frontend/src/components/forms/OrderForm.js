"use client";

import { useState } from "react";
import { createOrder, fileUrl } from "@/lib/api";
import { WILAYAS } from "@/constants/wilayas";
import { formatDA } from "@/constants/site";

const field =
  "w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-base outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

export default function OrderForm({ product, color, onDone }) {
  const [f, setF] = useState({ customerName: "", phone: "", wilaya: "", commune: "", address: "", quantity: 1 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const total = product.price * f.quantity;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await createOrder({ ...f, productId: product._id, color: color.name });
      setDone(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-pink-100 text-3xl">✓</div>
        <h4 className="text-xl font-extrabold">تم استلام طلبك!</h4>
        <p className="mt-2 text-neutral-600 leading-7">
          سنتصل بك قريباً على رقمك لتأكيد الطلب.
          <br />
          المبلغ المطلوب عند الاستلام: <b>{formatDA(done.total)}</b>
        </p>
        <button onClick={onDone} className="mt-6 rounded-full bg-ink px-8 py-3 font-bold text-white hover:bg-pink-500">
          حسناً
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex items-center gap-3 rounded-2xl bg-pink-50 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fileUrl(color.image)} alt="" className="h-16 w-16 rounded-xl object-cover" />
        <div className="text-sm">
          <p className="font-extrabold">{product.nameAr} <span dir="ltr" className="font-medium text-neutral-400">{product.name}</span></p>
          <p className="text-neutral-500">اللون: {color.name}</p>
        </div>
      </div>

      <input required className={field} placeholder="الاسم الكامل" value={f.customerName} onChange={set("customerName")} autoComplete="name" />
      <input
        required
        className={field}
        placeholder="رقم الهاتف (05XXXXXXXX)"
        inputMode="tel"
        dir="ltr"
        pattern="0[567][0-9]{8}"
        title="رقم جزائري يبدأ بـ 05 أو 06 أو 07"
        value={f.phone}
        onChange={set("phone")}
        autoComplete="tel"
      />
      <div className="grid grid-cols-2 gap-3">
        <select required className={field} value={f.wilaya} onChange={set("wilaya")}>
          <option value="">الولاية</option>
          {WILAYAS.map((w, i) => (
            <option key={w} value={w}>{String(i + 1).padStart(2, "0")} - {w}</option>
          ))}
        </select>
        <input required className={field} placeholder="البلدية" value={f.commune} onChange={set("commune")} />
      </div>
      <input className={field} placeholder="العنوان (اختياري)" value={f.address} onChange={set("address")} />

      <div className="flex items-center justify-between rounded-xl border border-pink-200 px-4 py-2">
        <span className="font-bold">الكمية</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setF((s) => ({ ...s, quantity: Math.max(1, s.quantity - 1) }))} className="h-8 w-8 rounded-full bg-pink-100 text-lg font-bold">−</button>
          <span className="w-6 text-center font-extrabold">{f.quantity}</span>
          <button type="button" onClick={() => setF((s) => ({ ...s, quantity: Math.min(20, s.quantity + 1) }))} className="h-8 w-8 rounded-full bg-pink-100 text-lg font-bold">+</button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-white">
        <span>المجموع (الدفع عند الاستلام)</span>
        <b className="text-lg">{formatDA(total)}</b>
      </div>
      <p className="text-xs text-neutral-500">رسوم التوصيل تُؤكَّد معك عند الاتصال.</p>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <button disabled={busy} className="w-full rounded-full bg-pink-500 py-3.5 text-base font-extrabold text-white hover:bg-ink disabled:opacity-60">
        {busy ? "جارٍ الإرسال..." : "تأكيد الطلب"}
      </button>
    </form>
  );
}
