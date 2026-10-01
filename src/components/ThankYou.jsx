import { formatRM } from '../data/fulfilment.js'
import Sparkle from './Sparkle.jsx'

export default function ThankYou({ order, onNewOrder }) {
  const { customer, fulfilment, items, subtotal, deliveryFee, total } = order
  return (
    <section className="bg-batik px-4 py-14 sm:py-20" aria-live="polite">
      <div className="scallop relative mx-auto max-w-lg px-6 py-10 text-center">
        <Sparkle className="absolute left-6 top-6 h-8 w-8 text-coral" />
        <Sparkle className="absolute right-6 top-10 h-8 w-8 text-leaf" variant="flower" />

        <h1 className="-rotate-2 font-display text-5xl text-royal">Order received!</h1>
        <p className="mt-4 text-lg font-bold text-cocoa">
          Thank you for your order! We will contact you via WhatsApp shortly to confirm your details, delivery time,
          and arrange payment.
        </p>
        <p className="mt-2 text-sm text-cocoa/60">Order ref: {order.orderId}</p>

        <div className="mt-8 rounded-2xl bg-cream p-5 text-left">
          <h2 className="font-display text-2xl text-royal">Order summary</h2>
          <ul className="mt-3 divide-y-2 divide-dashed divide-royal/15">
            {items.map((item) => (
              <li key={`${item.product}-${item.size}`} className="flex justify-between gap-3 py-2">
                <span>
                  <span className="font-bold">
                    {item.quantity} × {item.product}
                  </span>
                  <span className="block text-sm text-cocoa/70">{item.size}</span>
                </span>
                <span className="font-bold tabular-nums">{formatRM(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 border-t-2 border-royal pt-3 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatRM(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{fulfilment.method === 'delivery' ? 'Delivery' : 'Self-pickup'}</dt>
              <dd>{deliveryFee ? formatRM(deliveryFee) : 'Free'}</dd>
            </div>
            <div className="flex justify-between pt-1 text-lg font-extrabold text-royal">
              <dt>Estimated total</dt>
              <dd>{formatRM(total)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-cocoa/80">
            {fulfilment.method === 'delivery' ? 'Delivery' : 'Pickup'} on <strong>{fulfilment.day}</strong>
            {fulfilment.method === 'delivery' && <> to {fulfilment.address}</>}. We’ll message{' '}
            <strong>{customer.name}</strong> at <strong>{customer.whatsapp}</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewOrder}
          className="mt-8 rounded-full border-2 border-royal px-6 py-3 text-sm font-extrabold uppercase tracking-[0.15em] text-royal transition hover:bg-royal hover:text-cream"
        >
          Place another order
        </button>
      </div>
    </section>
  )
}
