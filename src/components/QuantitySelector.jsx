export default function QuantitySelector({ value, onChange, label, max = 20 }) {
  const button =
    'grid h-10 w-10 place-items-center rounded-full text-xl font-black transition disabled:cursor-not-allowed disabled:opacity-30'
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        className={`${button} bg-white text-royal ring-2 ring-royal/20 hover:bg-sky-light`}
        onClick={() => onChange(value - 1)}
        disabled={value === 0}
        aria-label={`Remove one ${label}`}
      >
        −
      </button>
      <span className="w-8 text-center text-lg font-extrabold tabular-nums text-cocoa" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${button} bg-royal text-cream hover:bg-royal-dark`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Add one ${label}`}
      >
        +
      </button>
    </div>
  )
}
