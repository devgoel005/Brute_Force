# 🌍 Tourism Explorer — hyperDart Component

> An intelligent, standalone hyperDart component that understands natural-language travel queries (e.g., *"things to do in Paris"*, *"museums in Delhi"*, *"best places to visit in Kurukshetra"*), finds verified sights and landmarks, filters out commercial noise, and helps travelers instantly decide what's worth seeing.

---

## 🌟 1. The Idea & Purpose

When travelers plan a trip or explore a destination, standard search engines often return cluttered articles, ads, and sponsored links to hotels and restaurants. 

**Tourism Explorer** answers travel questions at a glance:
- **Instant Tourist Sights:** Finds authentic points of interest, historic monuments, museums, viewpoints, and parks near any searched city.
- **Natural-Language Intent & Category Resolution:** Automatically extracts and filters for specific categories like *museums*, *temples*, *monuments*, *forts*, *viewpoints*, or *parks*.
- **Smart Day Itinerary:** Optimizes visit order using proximity heuristics, assigning sensible time-of-day slots (Morning, Midday, Afternoon, Golden Hour) with transit distances.
- **Visit-Day Weather & Advice:** Integrates live weather forecasts and provides context-aware sightseeing tips (e.g. recommending indoor museums on rainy days).
- **Responsive Interactive Map:** Displays pin clusters, active selection, and day-route polyline that works seamlessly in both full-width mainline and narrow ~320px sidebar formats.

---

## 🏛️ 2. Architecture & Design Decisions

### 🔒 Backend Security (Cloudflare Workers + Express)
As required by the specification, **the Geoapify API key is strictly maintained on the backend** and never exposed to the frontend bundle.
- **Worker Proxy:** Cloudflare Workers running Express handles `/api/places`, `/api/weather`, and `/api/itinerary`.
- **CORS & Environment:** Configured with `DEV_DOMAIN`, `STAGING_DOMAIN`, and `PROD_DOMAIN` bindings for zero-config deployment.
- **Local Secrets:** Read via `src/backend/.dev.vars` during development.

### 🎨 Sidebar vs. Mainline Responsiveness
The component dynamically detects `props.format` (`"sidebar"` vs `"mainline"`):
- In **Sidebar mode (~320–400px)**: Compact single-column card layout, scrollable category chips, streamlined weather header, and auto-scaled 220px vector map.
- In **Mainline mode (full width)**: Multi-column responsive grid, expanded 3-day weather forecast, and comprehensive itinerary timeline.

### 🌗 Theme Support (Light & Dark)
Integrated with `@mui/material` `ThemeProvider`, respecting platform theme mode while providing an instant toggle between light and dark modes.

### 🛡️ Robustness & Empty States
- When a location or category yields no results, a clear and helpful **Empty State** is rendered with a 1-click button to reset filters or search nearby.
- Graceful offline/mock fallback guarantees the component remains functional even during temporary upstream API downtime.

---

## 📡 3. Data Sources & APIs

| Service | Purpose | Authentication |
|---------|---------|----------------|
| **Geoapify Places API** | Queries tourist attractions, museums, landmarks, and coordinates (`categories=tourism.sights`, 5km radius, max 20 places). | Free API Key (kept securely on Cloudflare Worker backend) |
| **Open-Meteo API** | Real-time weather, temperature, humidity, wind speed, and 3-day forecasts. | Free & open (no key required) |
| **Google Maps Navigation** | Direct external link on each place card for turn-by-turn directions. | Deep links (`/maps/dir/?api=1&...`) |

---

## 🧰 4. Libraries & Tech Stack

- **Frontend:**
  - `React 19` & `Vite 6`
  - `@hyperdart/frontend` (`withHD` Higher Order Component)
  - `@mui/material` & `@mui/icons-material`
  - `Leaflet 1.9` (`leaflet`) for real interactive GPS maps with CartoDB Voyager tiles, pin popups & route polylines
  - Untree.co Tour Travel Agency aesthetic design system (`Source Serif Pro` + `Inter`, navy/coral palette)
  - Viewport-centered slidable photo galleries & modal system
- **Backend:**
  - `Express 5` running on Cloudflare Workers via `cloudflare:node` and `cloudflare:workers`
  - `cors`, `body-parser`, `wrangler 4`

---

## 🤖 5. Development & AI Collaboration

- **Ideation & Architecture:** Guided by the hackathon problem statement to deliver a clean, modular structure.
- **AI Coding Assistant:** Used Google DeepMind Antigravity to scaffold the official `react-vite-express` hyperDart template, configure regex trigger rules with `HD_LOCATION`, integrate backend proxies, and craft the responsive map, modal, and itinerary components.
- **Custom Enhancements:**
  - Developed custom query parsing logic in `src/frontend/utils/queryParser.js` to extract categories (*museums, temples, forts, viewpoints, historic*).
  - Implemented proximity-based traveling salesperson itinerary sequencing for the day planner.
  - Added weather-reactive travel suggestions in `WeatherCard.jsx`.
  - Built real-world Leaflet mapping with automated viewport centering for hyperDart iframes.
  - Designed rich landmark photo collections with hash-based diversification.

---

## 🚀 6. Local Development Setup

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd src/backend
npm install
cd ../..
```

### 2. Configure Geoapify API Key
Create or update `src/backend/.dev.vars` (this file is git-ignored and never committed):
```env
GEOAPIFY_API_KEY=your_geoapify_api_key_here
```

### 3. Start Backend Worker
In a terminal, start the Cloudflare Worker backend (runs on port 3001):
```bash
cd src/backend
npx wrangler dev
```

### 4. Start Frontend Sandbox
In a separate terminal, launch the hyperDart Vite dev sandbox (runs on port 5173):
```bash
npm start
```
Open [http://localhost:5173](http://localhost:5173) in your browser. You can test queries like:
- *"Tourist attractions in NYC"*
- *"Things to do in Paris"*
- *"Landmarks in Rome"*
- *"museums in Delhi"*
- *"best places to visit in Kurukshetra"*
- *"places to see in Dalhousie"*

---

## 📦 7. Build & Validation

```bash
# Build frontend and backend
npm run build
cd src/backend && npm run build && cd ../..

# Pre-publish validation test
node scripts/validate-publish.js
```
Expected output:
```
✔ Pre-publish validation passed.
```

---

## 🚢 8. Publishing to hyperDart Dev Registry

Before publishing, ensure your GitHub repository URL and YouTube demo link are updated in `hyperdart.config.js`:
```js
github: "https://github.com/devgoel005/Brute_Force",
demovideo: "https://youtu.be/4fgjnw9s-XY"
```

Then publish:
```bash
npm publish
```
*(Pre-publish validation runs automatically to verify keywords, regex triggers, and build artifacts).*
