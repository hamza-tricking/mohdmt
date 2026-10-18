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
      quantity < 1 ? list.filter((it) => it.key !== key) : list.map((it) => (it.key === key ? { ...it, quantity: Math.min(20, quantity) } : it))
    );
  const remove = (key) => setCart((list) => list.filter((it) => it.key !== key));

  const orderNow = (product, color) => {
    add(product, color);
    setOpen(true);
  };

  const pieces = cart.reduce((n, it) => n + it.quantity, 0);
  const subtotal = settings ? calcSubtotal(pieces, settings).subtotal : 0;

  return (
    <section id="products" className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 py-14 pb-28">
      <div className="mb-10 text-center">
        <span className="text-sm font-bold text-pink-500">المجموعة</span>
        <h2 className="mt-1 text-3xl font-extrabold md:text-4xl">منتجاتنا</h2>
        <p className="mt-2 text-neutral-500">اختاري الموديلات والألوان واطلبي بسهولة · الدفع عند الاستلام</p>
      </div>

      {loading && <p className="text-center text-neutral-400">جارٍ التحميل...</p>}
      {error && <p className="text-center text-red-500">تعذّر تحميل المتجر: {error}</p>}

      <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} onOrderNow={orderNow} onAdd={add} />
        ))}
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
