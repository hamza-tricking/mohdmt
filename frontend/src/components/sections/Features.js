import { fileUrl } from "@/lib/api";

// بطاقات الموديلات (تُعرض بصورة كل منتج)، ومثل التصميم المرجعي.
export default function Categories({ products }) {
  const tiles = products.map((p) => ({ id: p._id, name: p.nameAr, img: p.colors[0]?.image })).filter((t) => t.img);
  if (tiles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {tiles.map((t) => (
          <a
            key={t.id}
            href="#products"
            className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-pink-100 shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileUrl(t.img)}
              alt={t.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-x-3 bottom-3 rounded-full bg-white/95 py-2 text-center text-sm font-extrabold shadow">
              {t.name}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
