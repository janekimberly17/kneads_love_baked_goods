import { SIZES, cartKey } from '../data/menu.js'
import { formatRM } from '../data/fulfilment.js'
import QuantitySelector from './QuantitySelector.jsx'
import TrayPlaceholder from './TrayPlaceholder.jsx'

export default function ProductCard({ product, tilt, quantities, onQuantityChange }) {
  return (
    <article className="flex flex-col">
      {product.image ? (
        // Cut-out photos sit straight on the paper, like on the menu poster
        <div className="relative aspect-[4/3]">
          <img
            src={`${import.meta.env.BASE_URL}${product.image}`}
            alt={`A tray of ${product.name.toLowerCase()}s on baking paper`}
            className={`${tilt} absolute inset-0 h-full w-full object-contain drop-shadow-[0_12px_14px_rgba(74,50,34,0.3)]`}
            loading="lazy"
          />
        </div>
      ) : (
        <div className={`${tilt} overflow-hidden rounded-lg border-4 border-white bg-white shadow-md`}>
          <TrayPlaceholder colors={product.placeholder} label={product.name} />
        </div>
      )}

      <div className="mt-5">
        <h3>
          <span className={`tape ${product.tagColor} text-lg text-cocoa`}>{product.name}</span>
        </h3>
        <p className="mt-2 font-hand text-lg leading-snug text-cocoa">{product.description}</p>
      </div>

      <ul className="mt-4 space-y-2">
        {SIZES.map((size) => {
          const key = cartKey(product.id, size.id)
          const inCart = (quantities[key] || 0) > 0
          return (
            <li
              key={size.id}
              className={`flex items-center justify-between gap-3 rounded-xl border-2 px-3 py-2 transition ${
                inCart ? 'border-royal bg-sky-light/50' : 'border-dashed border-royal/25 bg-cream'
              }`}
            >
              <div>
                <p className="font-bold text-royal">
                  {size.label} <span className="font-normal text-cocoa/70">{size.dimensions}</span>
                </p>
                <p className="text-sm font-extrabold text-cocoa">{formatRM(product.prices[size.id])}</p>
              </div>
              <QuantitySelector
                value={quantities[key] || 0}
                onChange={(qty) => onQuantityChange(key, qty)}
                label={`${product.name} ${size.label}`}
              />
            </li>
          )
        })}
      </ul>
    </article>
  )
}
