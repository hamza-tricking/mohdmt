"use client";

import { useState } from "react";
import { createOrder, fileUrl } from "@/lib/api";
import { calcSubtotal, getDeliveryFee } from "@/lib/pricing";
import { DELIVERY_TYPES, formatDA } from "@/constants/site";

const field =
  "w-full rounded-xl border border-pink-200 bg-white px-4 py-3 text-base outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200";

export default function CheckoutForm({ items, products, onPick, mode, limit, settings, rates, onQty, onRemove, onOrdered, onClose }) {
  const [f, setF] = useState({
    customerName: "",
    phone: "",
    wilaya: "",
    commune: "",
    address: "",
    deliveryType: "domicile",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const pieces = items.reduce((n, it) => n + it.quantity, 0);
  const { subtotal } = calcSubtotal(pieces, settings);
  const countOk = pieces === limit; // قطعة واحدة للشراء العادي، أو قطعتان للزوج
  const optionLabel = mode === "pair" ? "عرض الزوج (قطعتان)" : "قطعة واحدة بالسعر العادي";
  const fee = getDeliveryFee(rates, f.wilaya, f.deliveryType); // undefined | null | number
  const feeKnown = typeof fee === "number";
  const total = feeKnown ? subtotal + fee : null;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await createOrder({
        mode,
        ...f,
        items: items.map((it) => ({ productId: it.product._id, color: it.color.name, quantity: it.quantity })),
      });
      setDone({ ...res, snapshot: { items, form: f } });
      onOrdered();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) return <Success done={done} settings={settings} onClose={onClose} />;


  return (
    <form onSubmit={submit} className="space-y-4">
      {/* اختيار القطع مباشرة من صفحة الطلب */}
      {pieces < limit && products?.length > 0 && (
        <div className="space-y-3 rounded-2xl border-2 border-dashed border-pink-300 p-3">
          <p className="text-sm font-extrabold">
            {limit === 1 ? "اختاري الموديل واللون" : `اختاري القطعة ${pieces + 1} من ${limit}: الموديل واللون`}
          </p>
          {products.map((p) => (
            <div key={p._id} className="space-y-1.5">
              <p className="text-xs font-bold text-neutral-600">{p.nameAr}</p>
              <div className="flex flex-wrap gap-2">
                {p.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => onPick(p, c)}
                    className="flex items-center gap-1.5 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs font-bold hover:border-pink-500"
                  >
                    <span className="h-3.5 w-3.5 rounded-full border border-white shadow" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* السلة */}
      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.key} className="flex items-center gap-3 rounded-2xl bg-pink-50 p-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fileUrl(it.color.image)} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-extrabold">{it.product.nameAr}</p>
              <p className="text-neutral-500">{it.color.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => onQty(it.key, it.quantity - 1)} className="h-8 w-8 rounded-full bg-white text-lg font-bold shadow-sm">−</button>
              <span className="w-5 text-center font-extrabold">{it.quantity}</span>
              <button type="button" disabled={pieces >= limit} onClick={() => onQty(it.key, it.quantity + 1)} className="h-8 w-8 rounded-full bg-white text-lg font-bold shadow-sm disabled:opacity-40">+</button>
            </div>
            <button type="button" onClick={() => onRemove(it.key)} aria-label="حذف" className="px-1 text-xl text-red-400">×</button>
          </div>
        ))}
        {!countOk && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
            {limit === 1 ? "الشراء بالسعر العادي يكون لقطعة واحدة فقط." : "عرض الزوج يكون لقطعتين بالضبط."}
          </p>
        )}
      </div>

      {/* بيانات الزبون */}
      <div className="space-y-3">
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
            {rates.map((r) => (
              <option key={r.code} value={r.name}>{String(r.code).padStart(2, "0")} - {r.name}</option>
            ))}
          </select>
          <input required className={field} placeholder="البلدية" value={f.commune} onChange={set("commune")} />
        </div>
      </div>

      {/* طريقة التوصيل */}
      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-bold">طريقة التوصيل</legend>
        {Object.entries(DELIVERY_TYPES).map(([key, label]) => {
          const price = getDeliveryFee(rates, f.wilaya, key);
          const unavailable = price === null;
          return (
            <label
              key={key}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 ${
                f.deliveryType === key ? "border-pink-500 bg-pink-50" : "border-pink-100"
              } ${unavailable ? "opacity-60" : ""}`}
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <input
                  type="radio"
                  name="deliveryType"
                  value={key}
                  checked={f.deliveryType === key}
                  onChange={set("deliveryType")}
                  className="accent-pink-500"
                />
                {label}
              </span>
              <span className="text-sm font-extrabold">
                {price === undefined ? "اختاري الولاية" : price === null ? "غير متوفر" : formatDA(price)}
              </span>
            </label>
          );
        })}
      </fieldset>

      {f.deliveryType === "domicile" && (
        <input required className={field} placeholder="العنوان الكامل" value={f.address} onChange={set("address")} />
      )}

      {/* الملخص */}
      <div className="space-y-1.5 rounded-2xl bg-ink p-4 text-sm text-white">
        <Row label={optionLabel} value={formatDA(subtotal)} />
        <Row label="المجموع الجزئي" value={formatDA(subtotal)} />
        <Row
          label="التوصيل"
          value={feeKnown ? formatDA(fee) : fee === null ? "غير متوفر" : "—"}
        />
        <div className="flex items-center justify-between border-t border-white/20 pt-2 text-base font-extrabold">
          <span>الإجمالي (الدفع عند الاستلام)</span>
          <span className="text-pink-200">{total === null ? "—" : formatDA(total)}</span>
        </div>
      </div>

      {fee === null && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          سعر هذه الطريقة غير متوفر لولايتك حالياً، جرّبي الطريقة الأخرى.
        </p>
      )}
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <button
        disabled={busy || !feeKnown || !countOk}
        className="w-full rounded-full bg-pink-500 py-3.5 text-base font-extrabold text-white shadow-lg shadow-pink-200 hover:bg-ink disabled:opacity-50"
      >
        {busy ? "جارٍ الإرسال..." : "تأكيد الطلب"}
      </button>
    </form>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-white/80">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function whatsappLink(number, done) {
  const { items, form } = done.snapshot;
  const lines = [
    `طلب جديد رقم ${done.orderNumber}`,
    ...items.map((it) => `- ${it.product.nameAr} | ${it.color.name} × ${it.quantity}`),
    `الاسم: ${form.customerName}`,
    `الهاتف: ${form.phone}`,
    `الولاية: ${form.wilaya} - ${form.commune}`,
    `التوصيل: ${DELIVERY_TYPES[form.deliveryType]}${form.address ? ` - ${form.address}` : ""}`,
    `المجموع: ${formatDA(done.subtotal)} + توصيل ${formatDA(done.deliveryFee)} = ${formatDA(done.total)}`,
  ];
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function Success({ done, settings, onClose }) {
  return (
    <div className="py-2 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-600">✓</div>
      <h4 className="text-xl font-extrabold">تم استلام طلبك بنجاح!</h4>
      <p className="mt-3 text-sm text-neutral-500">رقم الطلب</p>
      <p className="mt-1 inline-block rounded-xl bg-pink-100 px-5 py-2 text-2xl font-extrabold tracking-wider" dir="ltr">
        {done.orderNumber}
      </p>
      <p className="mt-4 leading-7 text-neutral-600">
        سنتصل بك قريباً لتأكيد الطلب.
        <br />
        المبلغ عند الاستلام: <b>{formatDA(done.total)}</b>
      </p>
      <div className="mt-6 flex flex-col gap-2">
        {settings.whatsappNumber && (
          <a
            href={whatsappLink(settings.whatsappNumber, done)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-500 py-3 font-extrabold text-white hover:bg-emerald-600"
          >
            إرسال تفاصيل الطلب عبر واتساب
          </a>
        )}
        <button type="button" onClick={onClose} className="rounded-full bg-ink py-3 font-bold text-white hover:bg-pink-500">
          حسناً
        </button>
      </div>
    </div>
  );
}
