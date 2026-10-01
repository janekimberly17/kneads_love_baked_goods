export const PICKUP_AREA = 'Stutong'
export const ORDER_CUTOFF = 'Thursday, 6pm'
export const FULFILMENT_DAYS = ['Saturday', 'Sunday']

// Delivery rates around Kuching (from the Delivery Rate poster).
export const DELIVERY_ZONES = [
  { id: 'nearby', label: 'Nearby', areas: 'Tabuan, BDC, Padungan, City Centre', fee: 3 },
  { id: 'mid', label: 'Mid-range', areas: 'Satok, Petra Jaya, Semariang', fee: 5 },
  { id: 'far', label: 'Further out', areas: 'Batu Kawa, Matang, Samarahan', fee: 7 },
]

export const formatRM = (amount) =>
  `RM${Number(amount).toFixed(Number.isInteger(amount) ? 0 : 2)}`
