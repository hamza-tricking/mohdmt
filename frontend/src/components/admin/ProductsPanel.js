"use client";

import { useEffect, useState } from "react";
import { getAdminProducts } from "@/lib/api";
import ProductEditor from "./ProductEditor";

export default function ProductsPanel({ onAuthError }) {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminProducts()
      .then(setProducts)
      .catch((e) => (e.status === 401 ? onAuthError() : setError(e.message)));
  }, [onAuthError]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!products) return <p className="text-neutral-400">جارٍ التحميل...</p>;

  return (
    <div className="grid gap-4">
      {products.map((p) => (
        <ProductEditor key={p._id} product={p} />
      ))}
    </div>
  );
}
