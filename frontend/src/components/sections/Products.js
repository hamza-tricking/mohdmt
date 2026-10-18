"use client";

import { useCallback, useState } from "react";
import ProductCard from "./ProductCard";
import Modal from "@/components/ui/Modal";
import OrderForm from "@/components/forms/OrderForm";

export default function Products({ products, loading, error }) {
  const [order, setOrder] = useState(null); // { product, color }
  const close = useCallback(() => setOrder(null), []);

  return (
    <section id="products" className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 py-14">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold">منتجاتنا</h2>
        <p className="mt-2 text-neutral-500">اختاري اللون الذي يناسب ذوقك واطلبي بسهولة · الدفع عند الاستلام</p>
      </div>

      {loading && <p className="text-center text-neutral-400">جارٍ التحميل...</p>}
      {error && <p className="text-center text-red-500">تعذّر تحميل المنتجات: {error}</p>}

      <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} onOrder={(product, color) => setOrder({ product, color })} />
        ))}
      </div>

      {order && (
        <Modal title="إتمام الطلب" onClose={close}>
          <OrderForm product={order.product} color={order.color} onDone={close} />
        </Modal>
      )}
    </section>
  );
}
