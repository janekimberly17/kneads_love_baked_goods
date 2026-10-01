import { DELIVERY_ZONES, FULFILMENT_DAYS, ORDER_CUTOFF, PICKUP_AREA, formatRM } from '../data/fulfilment.js'

const inputClass =
  'mt-1 w-full rounded-xl border-2 border-royal/20 bg-white px-4 py-3 text-base text-cocoa outline-none transition placeholder:text-cocoa/40 focus:border-royal focus:ring-4 focus:ring-sky/40'

function Field({ id, label, error, hint, children }) {
  return (
    <div id={`field-${id}`} className="scroll-mt-24">
      <label htmlFor={id} className="block font-bold text-royal">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-sm text-cocoa/60">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-bold text-phone">
          {error}
        </p>
      )}
    </div>
  )
}

function OrderItems({ items }) {
  if (items.length === 0) {
    return (
      <p className="mt-3 rounded-xl border-2 border-dashed border-royal/25 px-4 py-5 text-center font-hand text-lg text-cocoa/70">
        Your tray is empty. Tap + on the menu to add treats here.
      </p>
    )
  }
  return (
    <ul className="mt-3 divide-y-2 divide-dashed divide-royal/15">
      {items.map((item) => (
        <li key={item.key} className="flex justify-between gap-3 py-2">
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
  )
}

// One card for the whole checkout: what's in the order, who it's for, and the single submit button.
export default function Checkout({
  items,
  subtotal,
  deliveryFee,
  total,
  form,
  errors,
  onChange,
  onSubmit,
  submitting,
  submitError,
  className = '',
}) {
  const isDelivery = form.method === 'delivery'
  const errorProps = (id) => (errors[id] ? { 'aria-invalid': true, 'aria-describedby': `${id}-error` } : {})

  return (
    <form
      id="checkout"
      onSubmit={onSubmit}
      noValidate
      className={`paper relative scroll-mt-24 rounded-2xl px-5 py-8 sm:px-8 ${className}`}
    >
      <p className="font-hand text-2xl text-sky">Step 2</p>
      <h2 className="font-display text-4xl text-royal">Your order</h2>
      <OrderItems items={items} />

      <h3 className="mt-8 border-t-2 border-royal/15 pt-6 font-display text-2xl text-royal">Your details</h3>
      <p className="mt-1 font-hand text-lg text-cocoa/80">
        Orders close {ORDER_CUTOFF}. We’ll confirm everything with you on WhatsApp.
      </p>

      <div className="mt-5 space-y-5">
        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            type="text"
            maxLength={80}
            autoComplete="name"
            className={inputClass}
            placeholder="e.g. Nur Aisyah"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            {...errorProps('name')}
          />
        </Field>

        <Field id="whatsapp" label="WhatsApp number" error={errors.whatsapp} hint="Malaysian mobile number">
          <input
            id="whatsapp"
            type="tel"
            maxLength={20}
            inputMode="tel"
            autoComplete="tel"
            className={inputClass}
            placeholder="012-345 6789"
            value={form.whatsapp}
            onChange={(e) => onChange('whatsapp', e.target.value)}
            {...errorProps('whatsapp')}
          />
        </Field>

        {/* Pickup vs delivery toggle */}
        <fieldset>
          <legend className="font-bold text-royal">How would you like it?</legend>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-full bg-sky-light p-1" role="radiogroup">
            {[
              { value: 'pickup', label: 'Self-Pickup (Kuching)' },
              { value: 'delivery', label: 'Delivery' },
            ].map((option) => {
              const active = form.method === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onChange('method', option.value)}
                  className={`rounded-full px-3 py-3 text-sm font-extrabold transition sm:text-base ${
                    active ? 'bg-royal text-cream shadow' : 'text-royal hover:bg-white/60'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-sm text-cocoa/70">
            {isDelivery
              ? 'Delivery fee depends on your area.'
              : `Free pickup in ${PICKUP_AREA}. We’ll send the exact location on WhatsApp.`}
          </p>
        </fieldset>

        {isDelivery && (
          <>
            <Field id="zone" label="Delivery area" error={errors.zone}>
              <select
                id="zone"
                className={inputClass}
                value={form.zone}
                onChange={(e) => onChange('zone', e.target.value)}
                {...errorProps('zone')}
              >
                <option value="">Choose your area…</option>
                {DELIVERY_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.label}: {zone.areas} ({formatRM(zone.fee)})
                  </option>
                ))}
              </select>
            </Field>

            <Field id="address" label="Delivery address" error={errors.address}>
              <textarea
                id="address"
                rows={3}
                maxLength={300}
                autoComplete="street-address"
                className={inputClass}
                placeholder="House no., street, taman"
                value={form.address}
                onChange={(e) => onChange('address', e.target.value)}
                {...errorProps('address')}
              />
            </Field>
          </>
        )}

        <fieldset id="field-day" className="scroll-mt-24">
          <legend className="font-bold text-royal">{isDelivery ? 'Delivery day' : 'Pickup day'}</legend>
          <div className="mt-2 flex gap-3">
            {FULFILMENT_DAYS.map((day) => (
              <label
                key={day}
                className={`flex-1 cursor-pointer rounded-xl border-2 px-4 py-3 text-center font-bold transition ${
                  form.day === day ? 'border-royal bg-royal text-cream' : 'border-royal/20 bg-white text-royal hover:border-royal/50'
                }`}
              >
                <input
                  type="radio"
                  name="day"
                  value={day}
                  checked={form.day === day}
                  onChange={() => onChange('day', day)}
                  className="sr-only"
                />
                {day}
              </label>
            ))}
          </div>
          {errors.day && <p className="mt-1 text-sm font-bold text-phone">{errors.day}</p>}
        </fieldset>

        <Field id="notes" label="Notes (optional)">
          <textarea
            id="notes"
            rows={2}
            maxLength={500}
            className={inputClass}
            placeholder="Birthday message, allergies, preferred time…"
            value={form.notes}
            onChange={(e) => onChange('notes', e.target.value)}
          />
        </Field>
      </div>

      <dl className="mt-8 space-y-1 border-t-2 border-royal pt-4 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{formatRM(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>{isDelivery ? 'Delivery' : 'Self-pickup'}</dt>
          <dd className="tabular-nums">
            {isDelivery && !form.zone ? 'Choose area' : deliveryFee ? formatRM(deliveryFee) : 'Free'}
          </dd>
        </div>
        <div className="flex justify-between pt-1 text-lg font-extrabold text-royal">
          <dt>Estimated total</dt>
          <dd className="tabular-nums">{formatRM(total)}</dd>
        </div>
      </dl>

      {/* Honeypot: invisible to people, so anything typed here marks the order as spam */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => onChange('website', e.target.value)}
        />
      </div>

      {submitError && (
        <p role="alert" className="mt-6 rounded-xl bg-phone/10 px-4 py-3 font-bold text-phone">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full rounded-full bg-royal px-6 py-4 text-base font-extrabold uppercase tracking-[0.15em] text-cream shadow-lg transition hover:-translate-y-0.5 hover:bg-royal-dark disabled:translate-y-0 disabled:opacity-60"
      >
        {submitting ? 'Sending your order…' : `Place preorder · ${formatRM(total)}`}
      </button>
      <p className="mt-3 text-center text-sm text-cocoa/60">No payment now. We’ll arrange payment on WhatsApp.</p>
      <p className="mt-2 text-center text-xs text-cocoa/50">
        We only use your name, number and address to prepare and deliver this order.
      </p>
    </form>
  )
}
