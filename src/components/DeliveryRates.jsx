import { DELIVERY_ZONES, PICKUP_AREA, formatRM } from '../data/fulfilment.js'

export default function DeliveryRates() {
  return (
    <section id="delivery" className="scroll-mt-16 bg-sky-light px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-xl">
        <h2 className="text-center font-display text-4xl text-royal sm:text-5xl">Delivery Rates</h2>
        <p className="mt-2 text-center font-hand text-xl text-cocoa">Around Kuching, every Saturday &amp; Sunday</p>

        <div className="mt-8 overflow-hidden rounded-3xl border-4 border-royal bg-paper">
          <table className="w-full text-left">
            <tbody className="divide-y-2 divide-royal/20">
              <tr>
                <th scope="row" className="px-5 py-4 font-bold text-royal">
                  Pickup <span className="block text-sm font-normal text-cocoa/70">{PICKUP_AREA}</span>
                </th>
                <td className="px-5 py-4 text-right font-extrabold text-royal">Free</td>
              </tr>
              {DELIVERY_ZONES.map((zone) => (
                <tr key={zone.id}>
                  <th scope="row" className="px-5 py-4 font-bold text-royal">
                    {zone.label} <span className="block text-sm font-normal text-cocoa/70">{zone.areas}</span>
                  </th>
                  <td className="px-5 py-4 text-right font-extrabold text-royal">{formatRM(zone.fee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
