# Kneads Love Baked Goods

Single-page preorder site for Kneads Love, a home-based brownie bakery in Kuching, Sarawak.
Built with React (Vite) and Tailwind CSS. Orders are sent to a Google Sheet through a Google Apps Script Web App.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173/kneads_love_baked_goods/
```

## Project structure

```
src/
  App.jsx                 # cart + form state, totals, submit handler, thank-you switch
  data/menu.js            # products, sizes, prices
  data/fulfilment.js      # pickup area, cutoff, delivery zones and fees
  lib/order.js            # cart line items, validation, order id
  lib/submitOrder.js      # fetch() POST to the Apps Script Web App
  components/
    Header, Hero, MenuSection, ProductCard, QuantitySelector,
    TrayPlaceholder, Checkout, MobileCartBar, PreorderInfo, DeliveryRates,
    ThankYou, Footer, Sparkle
google-apps-script/Code.gs  # paste into Apps Script to receive orders
```

## Things to fill in

- **Prices**: `src/data/menu.js` (RM30 small / RM56 big).
- **Photos**: `public/images/brownie.webp` and `blondie.webp` (set per product in `menu.js`).
- **Logo**: replace the "KL" circle in `src/components/Header.jsx`.
- **Instagram link / WhatsApp number**: `src/components/Footer.jsx`.

## Connect Google Sheets

1. Follow the steps at the top of `google-apps-script/Code.gs` to deploy the Web App.
2. The live script URL is in `.env.production`, which `npm run build` / `npm run deploy` use. It is public by design (it ends up in the site's code either way). To test locally against a different script, put `VITE_GOOGLE_SCRIPT_URL` in `.env.local`.

Without that URL the site runs in demo mode: the thank-you screen still shows, but the order is only logged to the browser console.

## Deploy to GitHub Pages

The site publishes itself: `.github/workflows/deploy.yml` builds it and deploys it to GitHub Pages every time `main` changes.
One-time setup in GitHub: Settings → Pages → Source: **GitHub Actions**.

`vite.config.js` sets `base: '/kneads_love_baked_goods/'`, so the repo must keep that name (or update `base` to match).
You can also publish manually from your computer with `npm run deploy`, which pushes `dist/` to a `gh-pages` branch.
