// قاعدة الأسعار: أي قطعتين (من أي موديل أو لون) بسعر الزوج، والقطعة المتبقية بسعر القطعة.
// مثال: قطعة = 999، زوج = 1600، ثلاث قطع = 1600 + 999 = 2599.
exports.calcSubtotal = (pieces, { unitPrice, pairPrice }) => {
  const pairs = Math.floor(pieces / 2);
  const singles = pieces % 2;
  return { pairs, singles, subtotal: pairs * pairPrice + singles * unitPrice };
};
