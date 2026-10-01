import { useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import MenuSection from './components/MenuSection.jsx'
import PreorderInfo from './components/PreorderInfo.jsx'
import DeliveryRates from './components/DeliveryRates.jsx'
import Checkout from './components/Checkout.jsx'
import MobileCartBar from './components/MobileCartBar.jsx'
import ThankYou from './components/ThankYou.jsx'
import Footer from './components/Footer.jsx'
import { DELIVERY_ZONES } from './data/fulfilment.js'
import { buildCartItems, getDeliveryFee, makeOrderId, normaliseWhatsApp, validateOrder } from './lib/order.js'
import { submitOrder } from './lib/submitOrder.js'

const EMPTY_FORM = {
  name: '',
  whatsapp: '',
  method: 'pickup', // 'pickup' | 'delivery'
  zone: '',
  address: '',
  day: '',
  notes: '',
  website: '', // honeypot: hidden from people, bots tend to fill it in
}

export default function App() {
  // { "brownie:small": 2, "blondie:big": 1 }
  const [quantities, setQuantities] = useState({})
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // 'idle' | 'submitting' | 'error'
  const [submitError, setSubmitError] = useState('')
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  // Cart totals are derived from state, so they update as quantities change.
  const items = useMemo(() => buildCartItems(quantities), [quantities])
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const deliveryFee = getDeliveryFee(form)
  const total = subtotal + deliveryFee

  const setQuantity = (key, quantity) => {
    setQuantities((prev) => ({ ...prev, [key]: Math.max(0, Math.min(20, quantity)) }))
    if (errors.cart) setErrors(({ cart, ...rest }) => rest)
  }

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(({ [field]: _, ...rest }) => rest)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validation = validateOrder(form, items)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      const first = validation.cart ? 'menu' : `field-${Object.keys(validation)[0]}`
      document.getElementById(first)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    const zone = DELIVERY_ZONES.find((z) => z.id === form.zone)
    const order = {
      orderId: makeOrderId(),
      submittedAt: new Date().toISOString(),
      customer: {
        name: form.name.trim(),
        whatsapp: normaliseWhatsApp(form.whatsapp),
      },
      fulfilment: {
        method: form.method,
        day: form.day,
        zoneId: form.method === 'delivery' ? zone.id : '',
        zone: form.method === 'delivery' ? `${zone.label} (${zone.areas})` : '',
        address: form.method === 'delivery' ? form.address.trim() : '',
      },
      items: items.map(({ key, product, size, quantity, unitPrice, lineTotal }) => ({
        id: key,
        product,
        size,
        quantity,
        unitPrice,
        lineTotal,
      })),
      subtotal,
      deliveryFee,
      total,
      notes: form.notes.trim(),
      website: form.website,
    }

    setStatus('submitting')
    setSubmitError('')
    try {
      await submitOrder(order)
      setConfirmedOrder(order)
      setQuantities({})
      setForm(EMPTY_FORM)
      setStatus('idle')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error(error)
      setSubmitError(
        error.fromServer
          ? error.message
          : 'Sorry, we couldn’t send your order. Please check your connection and try again, or message us on WhatsApp.',
      )
      setStatus('error')
    }
  }

  const startNewOrder = () => {
    setConfirmedOrder(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen overflow-x-clip">
      <Header />
      {confirmedOrder ? (
        <main>
          <ThankYou order={confirmedOrder} onNewOrder={startNewOrder} />
        </main>
      ) : (
        <>
          <main className="pb-24 lg:pb-0">
            <Hero />
            <PreorderInfo />
            <DeliveryRates />
            {/* Menu and checkout sit side by side on desktop so customers never scroll back */}
            <section id="order" className="bg-batik scroll-mt-16 px-4 py-14 sm:py-20">
              <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
                <MenuSection quantities={quantities} onQuantityChange={setQuantity} error={errors.cart} />
                <Checkout
                  items={items}
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  total={total}
                  form={form}
                  errors={errors}
                  onChange={updateForm}
                  onSubmit={handleSubmit}
                  submitting={status === 'submitting'}
                  submitError={submitError}
                />
              </div>
            </section>
          </main>
          <MobileCartBar itemCount={itemCount} total={total} />
        </>
      )}
      <Footer />
    </div>
  )
}
