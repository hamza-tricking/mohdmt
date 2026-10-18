import Logo from "@/components/ui/Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-pink-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" aria-label="DMT Art Designer">
          <Logo />
        </a>
        <a
          href="#products"
          className="rounded-full bg-ink px-5 py-2 text-sm font-bold text-white hover:bg-pink-500 transition-colors"
        >
          المنتجات
        </a>
      </div>
    </header>
  );
}
