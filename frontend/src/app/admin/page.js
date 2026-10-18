"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import OrdersPanel from "@/components/admin/OrdersPanel";
import ProductsPanel from "@/components/admin/ProductsPanel";
import DeliveryRatesPanel from "@/components/admin/DeliveryRatesPanel";
import SettingsPanel from "@/components/admin/SettingsPanel";
import { clearToken, getToken } from "@/lib/auth";

const TABS = [
  ["orders", "الطلبات"],
  ["products", "المنتجات والألوان"],
  ["delivery", "أسعار التوصيل"],
  ["settings", "الأسعار والواتساب"],
];

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("orders");

  const logout = useCallback(() => {
    clearToken();
    router.replace("/admin/login");
  }, [router]);

  useEffect(() => {
    if (!getToken()) router.replace("/admin/login");
    else setReady(true);
  }, [router]);

  if (!ready) return null;

  const panels = {
    orders: <OrdersPanel onAuthError={logout} />,
    products: <ProductsPanel onAuthError={logout} />,
    delivery: <DeliveryRatesPanel onAuthError={logout} />,
    settings: <SettingsPanel onAuthError={logout} />,
  };

  return (
    <main className="min-h-screen bg-pink-50">
      <header className="border-b border-pink-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <a href="/" aria-label="الموقع"><Logo /></a>
          <div className="flex items-center gap-2">
            <a href="/" className="rounded-full px-4 py-1.5 text-sm font-bold hover:bg-pink-100">الموقع</a>
            <button onClick={logout} className="rounded-full border border-pink-200 px-4 py-1.5 text-sm font-bold">
              خروج
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-5 flex flex-wrap gap-2">
          {TABS.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-full px-5 py-2 text-sm font-bold ${tab === k ? "bg-ink text-white" : "bg-white"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {panels[tab]}
      </div>
    </main>
  );
}
