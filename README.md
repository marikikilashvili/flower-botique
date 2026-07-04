# 🌸 Bloomery — a flower boutique, built as a React assignment

Bloomery is a responsive, animated flower-shop web app built for a university front-end
assignment. It follows the original "perfume shop" brief but reimagined around real
flower species — including live data and photography pulled from a public botanical API.

**Live features:** browsable catalog, search + sort, quick-view modal, full flower detail
pages, a persistent shopping cart (localStorage), favorites, and a mock checkout flow.

## Tech stack

| Requirement                  | Implementation                                          |
| ----------------------------- | -------------------------------------------------------- |
| React, functional components  | 100% functional components, no class components          |
| React Hooks                   | `useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`, plus custom hooks (`useFlowers`, `useCart`) |
| React Router                  | `react-router-dom` v7 — Home, Shop, Flower Detail, Cart, About, 404 |
| HTTP client                   | Axios, wrapped in `src/api/flowerApi.js`                  |
| Local storage                 | Cart contents & favorites persist across reloads (`src/context/CartContext.jsx`) |
| Responsive design              | Fluid grid layout, mobile nav, breakpoints down to ~360px |
| Animations / modals            | CSS keyframe animations (hero blobs, staggered card entrance, loading spinner), a quick-view modal, and a slide-in cart drawer |
| Loading / error / success states | Every data-fetching view (`Home`, `Shop`, `FlowerDetail`, quick-view modal) has explicit loading, error (with retry) and success UI |

## Flower data source

Bloomery uses the **[Perenual API](https://perenual.com/docs/api)**, a free public
botanical/plant database with species data and photography. It doesn't offer a strict
"flowers only" filter, so `src/api/flowerApi.js` queries a curated list of well-known
flower names (rose, tulip, orchid, peony, lily, sunflower, etc.), merges and
de-duplicates the results into a single catalog, and derives a stable "boutique price"
per species (the API itself has no price data — this is a shop, not a plant database).

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Add your free API key
cp .env.example .env
# then open .env and paste your key:
# VITE_PERENUAL_API_KEY=your_api_key_here

# 3. Run the dev server
npm run dev
```

Get a free API key at **https://perenual.com/subscription-api** (free tier: 100
requests/day, no credit card required). If the key is missing, the app shows a clear
"No API key configured" error state instead of failing silently.

Other scripts:

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build locally
npm run lint       # oxlint
```

## Project structure

```
src/
  api/flowerApi.js         # Axios calls to the Perenual API + data normalization
  context/CartContext.jsx  # Cart + favorites state, synced to localStorage
  hooks/useFlowers.js       # Loading/error/success wrapper around the catalog fetch
  components/               # Navbar, Footer, FlowerCard, FlowerModal, CartDrawer, Loader, ErrorState
  pages/                     # Home, Shop, FlowerDetail, Cart, About, NotFound
  App.jsx                   # Routes + layout
  main.jsx                  # Entry point (BrowserRouter + CartProvider)
  index.css                 # Design system (rose-pink palette, type scale, animations)
```

## Design notes

- **Palette:** rose pink (`--rose-500 #d1638a`) as the primary color, warm cream
  background, deep plum text, a small gold accent for highlights.
- **Type:** Fraunces (display serif) paired with Manrope (body sans) for an editorial,
  boutique feel rather than a generic sans-only look.
- **Signature element:** flower photos sit inside organic, petal-shaped frames
  (asymmetric `border-radius`) instead of plain squares/circles, echoing the product
  itself; the shape softens further on hover.
- **Motion:** staggered card entrance on load, floating gradient "petals" in the hero,
  a spinning-petal loader, and slide/scale transitions for the modal and cart drawer.
  All animation respects `prefers-reduced-motion`.

## Screenshots

_Add screenshots of the Home, Shop, Flower Detail and Cart pages here before
submitting, e.g.:_

```markdown
![Home page](./screenshots/home.png)
![Shop page](./screenshots/shop.png)
![Flower detail](./screenshots/detail.png)
![Cart](./screenshots/cart.png)
```

## Author

Soso Jajanidze — frontend state management & API integration.
