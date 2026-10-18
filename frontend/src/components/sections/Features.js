const ITEMS = [
  { icon: "🎨", title: "صناعة يدوية", text: "كل قطعة مصنوعة يدوياً من الرزين" },
  { icon: "🚚", title: "توصيل لـ58 ولاية", text: "إلى المنزل أو إلى مكتب الاستلام" },
  { icon: "💵", title: "الدفع عند الاستلام", text: "لا دفع إلكتروني، تدفعين عند وصول الطلب" },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {ITEMS.map((f) => (
          <div key={f.title} className="flex items-center gap-4 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-pink-100 text-2xl">{f.icon}</span>
            <div>
              <h3 className="font-extrabold">{f.title}</h3>
              <p className="text-sm text-neutral-500">{f.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
