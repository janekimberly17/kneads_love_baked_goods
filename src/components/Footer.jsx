const LINKS = [
  // Replace the placeholders with your real handles / number.
  { label: 'Instagram', href: 'https://instagram.com/' },
]

export default function Footer() {
  return (
    <footer className="bg-royal-dark px-4 py-12 text-cream">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-3xl">Kneads Love</p>
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-sky-light">Baked goods · Kuching, Sarawak</p>
        </div>
        <ul className="flex gap-6 text-xs font-extrabold uppercase tracking-[0.2em]">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noreferrer" className="hover:text-sky-light">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-8 text-center text-xs text-cream/60">© {new Date().getFullYear()} Kneads Love Baked Goods</p>
    </footer>
  )
}
