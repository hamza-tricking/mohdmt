"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "@/lib/api";
import { ORDER_STATUSES, formatDA } from "@/constants/site";

export default function OrdersPanel({ onAuthError }) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    getAdminOrders()
      .then(setOrders)
      .catch((e) => (e.status === 401 ? onAuthError() : setError(e.message)))
      .finally(() => setLoading(false));
  }, [onAuthError]);

  useEffect(load, [load]);

  async function changeStatus(id, status) {
    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((list) => list.map((o) => (o._id === id ? updated : o)));
    } catch (e) {
      setError(e.message);
    }
  }

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["all", ...Object.keys(ORDER_STATUSES)].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${
              filter === s ? "bg-ink text-white" : "bg-pink-100 text-ink"
            }`}
          >
            {s === "all" ? `الكل (${orders.length})` : ORDER_STATUSES[s].label}
          </button>
        ))}
        <button onClick={load} className="ms-auto rounded-full border border-pink-200 px-4 py-1.5 text-sm font-bold">
          تحديث
        </button>
      </div>

      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {loading && <p className="text-neutral-400">جارٍ التحميل...</p>}
      {!loading && shown.length === 0 && <p className="py-10 text-center text-neutral-400">لا توجد طلبات</p>}

      <div className="grid gap-3">
        {shown.map((o) => (
          <div key={o._id} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-extrabold">{o.customerName}</p>
                <a href={`tel:${o.phone}`} dir="ltr" className="text-sm font-bold text-pink-500">{o.phone}</a>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${ORDER_STATUSES[o.status].cls}`}>
                {ORDER_STATUSES[o.status].label}
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-600">
              {o.productName} · {o.color} · ×{o.quantity} · <b>{formatDA(o.total)}</b>
            </p>
            <p className="text-sm text-neutral-500">
              {o.wilaya} - {o.commune}{o.address ? ` - ${o.address}` : ""}
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-xs text-neutral-400">{new Date(o.createdAt).toLocaleString("ar-DZ")}</span>
              <select
                value={o.status}
                onChange={(e) => changeStatus(o._id, e.target.value)}
                className="rounded-lg border border-pink-200 bg-white px-3 py-1.5 text-sm"
              >
                {Object.entries(ORDER_STATUSES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
