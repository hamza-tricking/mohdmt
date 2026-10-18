import { BRAND } from "@/constants/site";

export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-pink-200 font-extrabold text-sm tracking-tight">
        DMT
      </span>
      <span className="leading-tight" dir="ltr">
        <span className="block text-base font-extrabold tracking-wide">{BRAND.split(" ")[0]}</span>
        <span className="block text-[11px] tracking-[0.25em] text-pink-500 uppercase">Art Designer</span>
      </span>
    </div>
  );
}
