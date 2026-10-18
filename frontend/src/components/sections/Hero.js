import { fileUrl } from "@/lib/api";
import { formatDA } from "@/constants/site";
import { defaultColorOf } from "@/lib/product";

const SUNBURST = {
  background:
    "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.55) 0deg 6deg, transparent 6deg 15deg)",
};

export default function Hero({ products, settings }) {
  const pics = products.map((p) => defaultColorOf(p)?.image).filter(Boolean);

  return (
    <section id="top" className="relative overflow-hidden bg-pink-200">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 md:grid-cols-2 md:py-20">
        {/* النص */}
        <div className="relative z-10 text-center md:text-start">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-pink-500">DMT Art Designer</p>
          <h1 className="mt-3 text-5xl font-extrabold leading-[1.05] text-ink md:text-7xl">
            تسوّق
            <span className="block text-white [text-shadow:0_3px_0_#e0709a,0_6px_18px_rgba(224,112,154,0.4)]">
              الجديد
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-8 text-neutral-700 md:mx-0 md:text-lg">
            قطع ديكورية مصنوعة يدوياً من الرزين، بتصاميم فنية وألوان مختلفة، لتضيف لمسة خاصة لمنزلك.
          </p>
          <a
            href="#products"
            className="mt-8 inline-block rounded-full bg-white px-10 py-4 text-base font-extrabold text-ink shadow-lg transition hover:-translate-y-0.5 hover:bg-ink hover:text-white"
          >
            تسوّق الآن
          </a>
        </div>

        {/* الصورة */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-full bg-pink-300/60" style={SUNBURST} />
          <div className="absolute inset-6 overflow-hidden rounded-[45%] bg-white shadow-2xl">
            {pics[0] && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={fileUrl(pics[0])} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          {pics[1] && (
            <div className="absolute -bottom-2 -start-2 h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl md:h-36 md:w-36">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileUrl(pics[1])} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          {settings && (
            <div className="absolute -top-2 -end-2 grid h-28 w-28 rotate-12 place-items-center rounded-full bg-ink text-center text-white shadow-xl md:h-32 md:w-32">
              <div className="leading-tight">
                <p className="text-[11px] font-bold text-pink-200">قطعة</p>
                <p className="text-lg font-extrabold">{formatDA(settings.unitPrice)}</p>
                <p className="text-[11px] font-bold text-pink-200">زوج {formatDA(settings.pairPrice)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// شريط متحرك كالذي في التصميم المرجعي
export function OfferTicker({ settings }) {
  if (!settings) return null;
  const text = `✨ قطعة بـ${settings.unitPrice} دج | زوج بـ${settings.pairPrice} دج ✨ · التوصيل لـ58 ولاية · الدفع عند الاستلام`;
  const row = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="shrink-0 px-6 text-sm font-extrabold tracking-wider text-white md:text-base">
      {text}
    </span>
  ));
  return (
    <div id="offer" className="overflow-hidden bg-pink-500 py-3">
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}
