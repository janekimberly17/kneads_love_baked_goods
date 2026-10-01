import { useEffect, useState } from 'react'
import { formatRM } from '../data/fulfilment.js'

// Phone-only bar so the running total stays visible while browsing the menu.
// It hides once the checkout card is on screen, so it never covers the submit button.
export default function MobileCartBar({ itemCount, total }) {
  const [checkoutVisible, setCheckoutVisible] = useState(false)

  useEffect(() => {
    const checkout = document.getElementById('checkout')
    if (!checkout || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setCheckoutVisible(entry.isIntersecting))
    observer.observe(checkout)
    return () => observer.disconnect()
  }, [])

  if (itemCount === 0 || checkoutVisible) return null
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-royal/20 bg-cream/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <p className="leading-tight">
          <span className="block text-xs font-bold uppercase tracking-wider text-cocoa/70">
            {itemCount} {itemCount === 1 ? 'tray' : 'trays'}
          </span>
          <span className="text-xl font-extrabold text-royal tabular-nums">{formatRM(total)}</span>
        </p>
        <a
          href="#checkout"
          className="rounded-full bg-royal px-6 py-3 text-sm font-extrabold uppercase tracking-[0.15em] text-cream shadow"
        >
          View order
        </a>
      </div>
    </div>
  )
}
