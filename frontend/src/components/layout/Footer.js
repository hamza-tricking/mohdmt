import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center">
        <Logo className="[&_span]:!text-white [&>span:first-child]:!bg-pink-200 [&>span:first-child]:!text-ink" />
        <p className="text-sm text-white/70">
          قطع ديكورية مصنوعة يدوياً من الرزين · التوصيل لجميع ولايات الجزائر · الدفع عند الاستلام
        </p>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} DMT Art Designer</p>
      </div>
    </footer>
  );
}
