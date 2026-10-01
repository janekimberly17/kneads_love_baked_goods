// Prices in RM.
export const SIZES = [
  { id: 'small', label: 'Small', dimensions: '6 × 6"' },
  { id: 'big', label: 'Big', dimensions: '9 × 9"' },
]

export const MENU = [
  {
    id: 'brownie',
    name: 'Brownie',
    tagColor: 'bg-coral',
    description:
      'Our signature brownie, baked slow and loaded with chocolate, because good things come to those who knead.',
    // Photos live in /public/images
    image: 'images/brownie.webp',
    placeholder: { top: '#3b2418', body: '#5a3a28', crumb: '#2a170e' },
    prices: { small: 30, big: 56 },
  },
  {
    id: 'blondie',
    name: 'Blondie',
    tagColor: 'bg-blondie',
    description:
      'A soft, sweet and golden white chocolate blondie. This one’s a real catch, no dough about it.',
    image: 'images/blondie.webp',
    placeholder: { top: '#c88a45', body: '#e3b071', crumb: '#a8692e' },
    prices: { small: 30, big: 56 },
  },
]

// Builds the key used for each product + size in the cart.
export const cartKey = (productId, sizeId) => `${productId}:${sizeId}`
