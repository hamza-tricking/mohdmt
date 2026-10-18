"use client";

import { useCallback, useState } from "react";
import ProductCard from "./ProductCard";
import Modal from "@/components/ui/Modal";
import CheckoutForm from "@/components/forms/CheckoutForm";
import CartBar from "@/components/cart/CartBar";
import { calcSubtotal } from "@/lib/pricing";

export default function Products({ products, settings, rates, loading, error }) {
  const [cart, setCart] = useState([]); // [{ key, product, color, quantity }]
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const add = (product, color) =>
    setCart((list) => {
      const key = `${product._id}|${color.name}`;
      const found = list.find((it) => it.key === key);
      if (found) return list.map((it) => (it.key === key ? { ...it, quantity: Math.min(20, it.quantity + 1) } : it));
      return [...list, { key, product, color, quantity: 1 }];
    });

  const setQty = (key, quantity) =>
    setCart((list) =>
      quantity < 1
        ? list.filter((it) => it.key !== key)
        : list.map((it) => (it.key === key ? { ...it, quantity: Math.min(20, quantity) } : it))
    );
  const remove = (key) => setCart((list) => list.filter((it) => it.key !== key));

  const orderNow = (product, color) => {
    add(product, color);
    setOpen(true);
  };

  const pieces = cart.reduce((n, it) => n + it.quantity, 0);
  const subtotal = settings ? calcSubtotal(pieces, settings).subtotal : 0;

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
          <p className="mt-3 text-neutral-600">اختاري الموديل واللون اللي يناسبك · الدفع عند الاستلام</p>
        </div>

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
