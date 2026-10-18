import { fileUrl } from "@/lib/api";

export default function Hero({ products }) {
  const pics = products.map((p) => p.colors?.[1]?.image || p.colors?.[0]?.image).filter(Boolean);

  return (
    <section id="top" className="bg-gradient-to-b from-pink-100 via-pink-50 to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="text-center md:text-start">
          <span className="inline-block rounded-full bg-white px-4 py-1 text-xs font-bold text-pink-500 shadow-sm">
            صناعة يدوية · رزين
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
            لمسة فنية <span className="text-pink-500">تزيّن مساحتك</span>
          </h1>
          <p className="mt-4 text-base leading-8 text-neutral-600 md:text-lg">
            قطع ديكورية مصنوعة من الرزين، بتصاميم فنية وألوان مختلفة، لتضيف لمسة خاصة لمنزلك.
          </p>
          <a
            href="#products"
            className="mt-7 inline-block rounded-full bg-ink px-9 py-3.5 text-base font-bold text-white shadow-lg transition-colors hover:bg-pink-500"
          >
            تسوّق الآن
          </a>
        </div>

        {pics.length > 0 && (
          <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4">
            {pics.slice(0, 2).map((src, i) => (
              <div
                key={src}
                className={`aspect-[3/4] overflow-hidden rounded-3xl bg-white shadow-xl ring-4 ring-white ${
                  i === 1 ? "mt-8" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fileUrl(src)} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
