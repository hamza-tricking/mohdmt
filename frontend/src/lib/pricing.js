// نفس قاعدة الباك أند (للعرض فقط؛ الحساب الرسمي يتم في السيرفر):
// أي قطعتين بسعر الزوج، والقطعة المتبقية بسعر القطعة.
export function calcSubtotal(pieces, { unitPrice, pairPrice }) {
  const pairs = Math.floor(pieces / 2);
  const singles = pieces % 2;
  return { pairs, singles, subtotal: pairs * pairPrice + singles * unitPrice };
}

// سعر التوصيل من جدول الولايات: رقم، أو null إذا لم يُحدَّد، أو undefined إذا لم تُختَر الولاية.
export function getDeliveryFee(rates, wilaya, type) {
  const rate = rates.find((r) => r.name === wilaya);
  if (!rate) return undefined;
  return type === "domicile" ? rate.home : rate.stopDesk;
}
