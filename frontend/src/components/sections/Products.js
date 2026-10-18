"use client";

import { useCallback, useState } from "react";
import ProductCard from "./ProductCard";
import Modal from "@/components/ui/Modal";
import CheckoutForm from "@/components/forms/CheckoutForm";
import CartBar from "@/components/cart/CartBar";
import { calcSubtotal, OPTION_LIMIT } from "@/lib/pricing";
import { formatDA } from "@/constants/site";

export default function Products({ products, settings, rates, loading, error }) {
  const [cart, setCart] = useState([]); // [{ key, product, color, quantity }]
  const [mode, setMode] = useState("single"); // "single" | "pair"
  const [notice, setNotice] = useState("");
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const pieces = cart.reduce((n, it) => n + it.quantity, 0);
  const limit = OPTION_LIMIT[mode];

  const add = (product, color) => {
    if (pieces >= limit) {
      setNotice(
        mode === "single"
          ? "الشراء بالسعر العادي يشمل قطعة واحدة فقط. غيّري الخيار إلى «زوج» لاختيار قطعتين."
          : "عرض الزوج يشمل قطعتين فقط. احذفي قطعة من السلة لإضافة غيرها."
      );
      return false;
    }
    setNotice("");
    setCart((list) => {
      const key = `${product._id}|${color.name}`;
      const found = list.find((it) => it.key === key);
      if (found) return list.map((it) => (it.key === key ? { ...it, quantity: it.quantity + 1 } : it));
      return [...list, { key, product, color, quantity: 1 }];
    });
    return true;
  };

  const setQty = (key, quantity) => {
    const current = cart.find((it) => it.key === key);
    const others = pieces - (current?.quantity || 0);
    const allowed = Math.min(quantity, limit - others);
    if (allowed < 1) {
      setQtyRemove(key);
      return;
    }
    setCart((list) => list.map((it) => (it.key === key ? { ...it, quantity: allowed } : it)));
  };
  const setQtyRemove = (key) => setCart((list) => list.filter((it) => it.key !== key));
  const remove = (key) => setQtyRemove(key);

  const changeMode = (next) => {
    setMode(next);
    setNotice(
      pieces > OPTION_LIMIT[next]
        ? "السلة تحتوي على عدد قطع أكبر من هذا الخيار. عدّلي الكمية قبل المتابعة."
        : ""
    );
  };

  // الضغط على أي خيار يفتح صفحة الطلب مباشرة بالعرض المختار (وتُفرَّغ السلة إن لم تطابقه).
  const openFor = (next) => {
    if (pieces > OPTION_LIMIT[next]) setCart([]);
    setMode(next);
    setNotice("");
    setOpen(true);
  };

  const orderNow = (product, color) => {
    add(product, color);
    setOpen(true);
  };

  const subtotal = settings ? calcSubtotal(pieces, settings).subtotal : 0;
  const savings = settings ? settings.unitPrice * 2 - settings.pairPrice : 0;

  return (
    <section id="products" className="relative scroll-mt-20 overflow-hidden bg-pink-100 py-16 pb-32">
      <div
        className="pointer-events-none absolute -top-20 start-1/2 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full opacity-60"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.7) 0deg 5deg, transparent 5deg 14deg)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-pink-500">Shop</p>
          <h2 className="mt-2 text-4xl font-extrabold md:text-5xl">المنتجات المميزة</h2>
          <p className="mt-3 text-neutral-600">اختاري الموديل واللون · الدفع عند الاستلام</p>
        </div>

        {/* خيارا الشراء */}
        {settings && (
          <div className="mx-auto mb-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            <OptionCard
              active={mode === "single"}
              onClick={() => openFor("single")}
              title="قطعة واحدة"
              price={formatDA(settings.unitPrice)}
              text="بالسعر العادي، اختاري موديلاً ولوناً"
            />
            <OptionCard
              active={mode === "pair"}
              onClick={() => openFor("pair")}
              title="عرض الزوج (قطعتان)"
              price={formatDA(settings.pairPrice)}
              text={`أي موديلين أو لونين، لكل قطعة لونها · وفّري ${formatDA(savings)}`}
              badge="عرض خاص"
            />
          </div>
        )}

        {notice && (
          <p className="mx-auto mb-6 max-w-3xl rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-bold text-amber-700">
            {notice}
          </p>
        )}

        {loading && <p className="text-center text-neutral-500">جارٍ التحميل...</p>}
        {error && <p className="text-center text-red-500">تعذّر تحميل المتجر: {error}</p>}

        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p._id} className="w-[72%] shrink-0 snap-center sm:w-[45%] md:w-auto">
              <ProductCard
                product={p}
                unitPrice={settings?.unitPrice ?? 0}
                onOrderNow={orderNow}
                onAdd={add}
              />
            </div>
          ))}
        </div>
      </div>

      <CartBar pieces={pieces} subtotal={subtotal} onCheckout={() => setOpen(true)} />

      {open && settings && (
        <Modal title="إتمام الطلب" onClose={close}>
          <CheckoutForm
            items={cart}
            products={products}
            onPick={add}
            mode={mode}
            limit={limit}
            settings={settings}
            rates={rates}
            onQty={setQty}
            onRemove={remove}
            onOrdered={() => setCart([])}
            onClose={close}
          />
        </Modal>
      )}
    </section>
  );
}

function OptionCard({ active, onClick, title, price, text, badge }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative rounded-[1.75rem] border-2 p-5 text-start transition ${
        active ? "border-ink bg-white shadow-xl" : "border-transparent bg-white/70 hover:bg-white"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 end-4 rounded-full bg-pink-500 px-3 py-1 text-xs font-extrabold text-white">
          {badge}
        </span>
      )}
      <p className="text-lg font-extrabold">{title}</p>
      <p className="mt-1 text-2xl font-extrabold text-pink-500">{price}</p>
      <p className="mt-2 text-sm text-neutral-600">{text}</p>
    </button>
  );
}
