import { formatDA } from "@/constants/site";

// شريط ثابت أسفل الشاشة يظهر عند وجود قطع في السلة.
export default function CartBar({ pieces, subtotal, onCheckout }) {
  if (pieces === 0) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-pink-100 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(224,112,154,0.25)] backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div className="text-sm">
          <p className="font-extrabold">
            🛍 {pieces} {pieces === 1 ? "قطعة" : "قطع"}
          </p>
          <p className="text-neutral-500">
            المجموع: <b className="text-pink-500">{formatDA(subtotal)}</b> + التوصيل
          </p>
        </div>
        <button
          type="button"
          onClick={onCheckout}
          className="rounded-full bg-pink-500 px-7 py-3 font-extrabold text-white shadow-lg shadow-pink-200 hover:bg-ink"
        >
          إتمام الطلب
        </button>
      </div>
    </div>
  );
}
