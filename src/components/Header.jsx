const NAV = [
  { href: '#preorder', label: 'How it works' },
  { href: '#delivery', label: 'Delivery' },
  { href: '#menu', label: 'Menu' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-royal">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-20">
        <a href="#top" className="leading-none" aria-label="Kneads Love home">
          <span className="block font-display text-3xl tracking-wide text-cream sm:text-4xl">Kneads Love</span>
          <span className="block text-[10px] font-extrabold uppercase tracking-[0.25em] text-sky-light">Baked Goods</span>
        </a>
        <nav className="flex items-center gap-1 sm:gap-6">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden px-2 text-xs font-extrabold uppercase tracking-[0.18em] text-sky-light transition hover:text-cream sm:inline"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#menu"
            className="rounded-full bg-cream px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-royal shadow-sm transition hover:bg-white"
          >
            Order now
          </a>
        </nav>
      </div>
    </header>
  )
}
