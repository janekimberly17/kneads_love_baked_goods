export default function Hero() {
  return (
    <section id="top" className="scroll-mt-20 bg-royal px-4 pb-20 pt-14 text-center sm:pb-28 sm:pt-20">
      <h1 className="mx-auto max-w-5xl font-sans text-5xl font-black leading-[0.95] tracking-tight text-cream sm:text-7xl">
        Try our baked goods.
        <br />
        <span className="text-sky-light">You “knead” the real deal.</span>
      </h1>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="#menu"
          className="w-full max-w-xs rounded-full bg-cream px-8 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-royal shadow transition hover:-translate-y-0.5 hover:bg-white sm:w-auto"
        >
          Order now
        </a>
        <a
          href="#delivery"
          className="w-full max-w-xs rounded-full border-2 border-cream/70 px-8 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-cream transition hover:bg-cream/10 sm:w-auto"
        >
          Pickup &amp; delivery
        </a>
      </div>
    </section>
  )
}
