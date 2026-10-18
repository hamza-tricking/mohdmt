import { fileUrl } from "@/lib/api";

export default function Hero({ products, settings }) {
  const pics = products.map((p) => p.colors?.[1]?.image || p.colors?.[0]?.image).filter(Boolean);

  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-pink-100 via-pink-50 to-white">
      {/* زخارف خلفية */}
      <div className="pointer-events-none absolute -top-24 -start-24 h-72 w-72 rounded-full bg-pink-200/60 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -end-20 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="text-center md:text-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-pink-500 shadow-sm ring-1 ring-pink-100">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-500" /> صناعة يدوية · رزين
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.25] md:text-6xl">
            لمسة فنية
            <br />
            <span className="bg-gradient-to-l from-pink-500 to-pink-400 bg-clip-text text-transparent">
              تزيّن مساحتك
            </span>
          </h1>
          <p className="mt-5 text-base leading-8 text-neutral-600 md:text-lg">
            قطع ديكورية مصنوعة من الرزين، بتصاميم فنية وألوان مختلفة، لتضيف لمسة خاصة لمنزلك.
          </p>
          <a
            href="#products"
            className="mt-8 inline-block rounded-full bg-ink px-10 py-4 text-base font-extrabold text-white shadow-xl shadow-pink-200 transition hover:-translate-y-0.5 hover:bg-pink-500"
          >
            تسوّق الآن
          </a>
        </div>

        {pics.length > 0 && (
          <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4">
            {pics.slice(0, 2).map((src, i) => (
              <div
                key={src}
                className={`aspect-[3/4] overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-pink-200 ring-4 ring-white ${
                  i === 1 ? "mt-10" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fileUrl(src)} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {settings && <OfferBanner settings={settings} />}
    </section>
  );
}

function OfferBanner({ settings }) {
  return (
    <div id="offer" className="relative mx-auto max-w-4xl scroll-mt-20 px-4 pb-10">
      <div className="rounded-3xl bg-gradient-to-l from-ink via-neutral-800 to-ink p-1 shadow-2xl shadow-pink-200">
        <div className="rounded-[1.35rem] border border-white/10 px-5 py-6 text-center text-white md:py-8">
          <p className="text-lg font-extrabold leading-relaxed text-pink-200 sm:text-xl md:text-3xl">
            ✨ قطعة بـ{settings.unitPrice} دج | زوج بـ{settings.pairPrice} دج ✨
          </p>
          <p className="mt-3 text-sm leading-7 text-white/80 md:text-base">
            اختار الموديلات والألوان اللي تحبها، والتوصيل متوفر إلى 58 ولاية جزائرية.
          </p>
        </div>
      </div>
    </div>
  );
}
