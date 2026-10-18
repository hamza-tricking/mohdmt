"use client";

import { useEffect, useState } from "react";
import { getProducts, getSettings, getDeliveryRates } from "@/lib/api";

// يجلب المنتجات والأسعار وجدول التوصيل مرة واحدة.
export default function useStore() {
  const [data, setData] = useState({ products: [], settings: null, rates: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getProducts(), getSettings(), getDeliveryRates()])
      .then(([products, settings, rates]) => setData({ products, settings, rates }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading, error };
}
