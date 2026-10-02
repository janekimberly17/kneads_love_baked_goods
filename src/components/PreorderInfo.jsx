import { ORDER_CUTOFF, PICKUP_AREA } from '../data/fulfilment.js'

const STEPS = [
  { title: `Order by ${ORDER_CUTOFF} for this weekend's bake`, text: 'Pick your treats and send your order through this page.' },
  { title: 'We confirm on WhatsApp', text: 'We’ll message you to confirm your details, timing and payment.' },
  {
    title: 'Pickup or delivery',
    text: `Collect for free in ${PICKUP_AREA}, or have it delivered around Kuching on Saturday or Sunday.`,
  },
]

export default function PreorderInfo() {
  return (
    <section id="preorder" className="scroll-mt-16 bg-cream px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="font-display text-4xl text-royal sm:text-5xl">Open for Preorder</h2>
        <p className="mx-auto mt-3 max-w-lg font-hand text-xl text-cocoa">
          Every batch is baked fresh after standard working hours, so orders knead a little bit of time.
        </p>

        <ol className="mt-10 grid gap-5 text-left sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="paper rounded-2xl p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-royal font-display text-xl text-cream">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-extrabold text-royal">{step.title}</h3>
              <p className="mt-1 text-cocoa/80">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
