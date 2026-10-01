import { MENU } from '../data/menu.js'
import ProductCard from './ProductCard.jsx'
import Sparkle from './Sparkle.jsx'

export default function MenuSection({ quantities, onQuantityChange, error, className = '' }) {
  return (
    <div id="menu" className={`paper relative scroll-mt-24 rounded-2xl px-4 py-10 sm:px-8 ${className}`}>
        <Sparkle className="absolute right-6 top-6 h-8 w-8 text-coral" />
        <Sparkle className="absolute left-4 top-24 h-8 w-8 text-leaf" variant="flower" />

        <div className="text-center">
          <p className="font-hand text-2xl text-sky">Step 1</p>
          <h2 className="font-display text-5xl text-cocoa sm:text-6xl">Menu</h2>
          <p className="mx-auto mt-3 max-w-md font-hand text-lg text-cocoa/80">
            Pick your treats and tray size. Your order updates as you go.
          </p>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {MENU.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              tilt={index % 2 === 0 ? '-rotate-1' : 'rotate-1'}
              quantities={quantities}
              onQuantityChange={onQuantityChange}
            />
          ))}
        </div>

        {error && (
          <p role="alert" className="mt-6 text-center font-bold text-phone">
            {error}
          </p>
        )}
    </div>
  )
}
