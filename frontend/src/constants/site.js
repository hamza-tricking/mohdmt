export const BRAND = "DMT Art Designer";

export const ORDER_STATUSES = {
  new: { label: "جديد", cls: "bg-pink-100 text-pink-500" },
  confirmed: { label: "مؤكد", cls: "bg-blue-100 text-blue-700" },
  shipped: { label: "قيد الشحن", cls: "bg-amber-100 text-amber-700" },
  delivered: { label: "تم التسليم", cls: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "ملغى", cls: "bg-neutral-200 text-neutral-600" },
};

export const DELIVERY_TYPES = {
  domicile: "إلى المنزل (Domicile)",
  stopdesk: "مكتب الاستلام (Stop Desk)",
};

export const formatDA = (n) => `${Number(n).toLocaleString("en-US")} د.ج`;
