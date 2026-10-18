import Logo from "@/components/ui/Logo";

const LINKS = [
  ["#top", "الرئيسية"],
  ["#products", "المنتجات"],
  ["#offer", "العرض"],
  ["#about", "عنّا"],
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <nav className="hidden items-center gap-6 text-[13px] font-bold uppercase tracking-wider text-neutral-700 md:flex">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className="transition-colors hover:text-pink-500">
              {label}
            </a>
          ))}
        </nav>

        <a href="#top" aria-label="DMT Art Designer" className="justify-self-center">
          <Logo />
        </a>

        <a
          href="/admin/login"
          className="rounded-full bg-pink-400 px-5 py-2 text-sm font-extrabold text-white shadow-md shadow-pink-200 transition hover:bg-ink"
        >
          تسجيل الدخول
        </a>
      </div>
    </header>
  );
}
