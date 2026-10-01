import { MENU, SIZES, cartKey } from '../data/menu.js'
import { DELIVERY_ZONES } from '../data/fulfilment.js'

// Turns the { "brownie:small": 2 } quantity map into line items.
export function buildCartItems(quantities) {
  return MENU.flatMap((product) =>
    SIZES.map((size) => {
      const quantity = quantities[cartKey(product.id, size.id)] || 0
      const unitPrice = product.prices[size.id]
      return {
        key: cartKey(product.id, size.id),
        product: product.name,
        size: `${size.label} (${size.dimensions})`,
        quantity,
        unitPrice,
        lineTotal: quantity * unitPrice,
      }
    }),
  ).filter((item) => item.quantity > 0)
}

export const getDeliveryFee = (form) =>
  form.method === 'delivery'
    ? DELIVERY_ZONES.find((zone) => zone.id === form.zone)?.fee ?? 0
    : 0

// Accepts Malaysian mobile numbers like 012-345 6789, +6012 3456789, 60123456789.
export const normaliseWhatsApp = (value) => value.replace(/[\s-]/g, '')
export const isValidWhatsApp = (value) => /^(\+?60|0)1\d{8,9}$/.test(normaliseWhatsApp(value))

export function validateOrder(form, items) {
  const errors = {}
  if (items.length === 0) errors.cart = 'Add at least one tray to your order.'
  if (!form.name.trim()) errors.name = 'Please tell us your name.'
  if (!isValidWhatsApp(form.whatsapp))
    errors.whatsapp = 'Enter a Malaysian mobile number, e.g. 012-345 6789.'
  if (!form.day) errors.day = 'Pick a day.'
  if (form.method === 'delivery') {
    if (!form.zone) errors.zone = 'Choose your delivery area.'
    if (!form.address.trim()) errors.address = 'We need an address to deliver to.'
  }
  return errors
}

export const makeOrderId = () => {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `KL-${ymd}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}
