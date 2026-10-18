// خياران فقط للشراء:
// 1) قطعة واحدة بالسعر العادي (unitPrice).
// 2) زوج = قطعتان (أي موديلين أو لونين، بنفس المنتج أو مختلفين) بسعر العرض (pairPrice).
exports.calcSubtotal = (pieces, { unitPrice, pairPrice }) => {
  if (pieces === 1) return { pairs: 0, singles: 1, subtotal: unitPrice };
  if (pieces === 2) return { pairs: 1, singles: 0, subtotal: pairPrice };
  return { pairs: 0, singles: 0, subtotal: 0 };
};
