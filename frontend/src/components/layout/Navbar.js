import Logo from "@/components/ui/Logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-pink-100/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <a href="#top" aria-label="DMT Art Designer">
          <Logo />
        </a>
        <nav className="flex items-center gap-2 text-sm font-bold">
          <a href="#products" className="hidden rounded-full px-4 py-2 hover:bg-pink-100 sm:block">
            المنتجات
          </a>
          <a href="#offer" className="hidden rounded-full px-4 py-2 hover:bg-pink-100 sm:block">
            العرض
          </a>
          <a
            href="/admin/login"
            className="rounded-full border-2 border-ink px-4 py-1.5 transition-colors hover:bg-ink hover:text-white"
          >
            تسجيل الدخول
          </a>
        </nav>
      </div>
    </header>
  );
}
