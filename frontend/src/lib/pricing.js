// نفس قاعدة الباك أند (للعرض فقط؛ الحساب الرسمي يتم في السيرفر):
// خياران فقط: قطعة واحدة بالسعر العادي، أو زوج (قطعتان) بسعر العرض.
export function calcSubtotal(pieces, { unitPrice, pairPrice }) {
  if (pieces === 1) return { pairs: 0, singles: 1, subtotal: unitPrice };
  if (pieces === 2) return { pairs: 1, singles: 0, subtotal: pairPrice };
  return { pairs: 0, singles: 0, subtotal: 0 };
}

// سعر التوصيل من جدول الولايات: رقم، أو null إذا لم يُحدَّد، أو undefined إذا لم تُختَر الولاية.
export function getDeliveryFee(rates, wilaya, type) {
  const rate = rates.find((r) => r.name === wilaya);
  if (!rate) return undefined;
  return type === "domicile" ? rate.home : rate.stopDesk;
}

// عدد القطع المسموح بها لكل خيار شراء.
export const OPTION_LIMIT = { single: 1, pair: 2 };
