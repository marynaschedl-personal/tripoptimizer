# TripOptimizer MVP

A travel optimization web app that visualizes flight + hotel cost tradeoffs across flexible dates using an interactive heat map.

## Setup

```bash
cd tripoptimizer
npm install
npm run dev
```

Then open http://localhost:5173

---

## How it works

1. **Landing page** — enter origin, destination, date range, and traveller count
2. **Heat map** — every departure/return date combination is shown as a color-coded cell (green = cheapest, red = most expensive)
3. **Detail modal** — click any cell to see the full trip breakdown: outbound flight, return flight, and 5 hotel options with Book Now links

---

## Mock data structure

All data lives in `src/data/mockData.js`. The key shapes are:

```js
// Flight (applies to both OUTBOUND_FLIGHTS and RETURN_FLIGHTS)
{
  id: 'OUT1',
  airline: 'Ryanair',
  flightNumber: 'FR 1042',
  departureTime: '05:30',
  arrivalTime: '08:15',
  duration: '2h 45m',
  stops: 0,            // 0 = direct, 1 = one stop
  stopCity: 'Munich',  // only present when stops > 0
  basePrice: 89,       // per person, in EUR
  convenient: false,   // true = civilised hours
}

// Hotel
{
  id: 'H1',
  name: 'Grand Palace Luxury Hotel',
  stars: 5,            // 3 | 4 | 5
  rating: 9.4,
  reviews: 3218,
  location: 'City Centre',
  pricePerNight: 285,  // in EUR
  amenities: ['Pool', 'Spa', 'Restaurant'],
  description: '...',
  sponsored: true,     // sponsored hotels appear first + have a badge
}
```

The `getCellData(departureDate, returnDate, minHotelStars, travelers)` function combines these into a single trip object used by the heat map and modal.

---

## Phase 2 — Real API integrations

| API | Purpose | Docs |
|-----|---------|------|
| **Skyscanner Flights API** | Live flight search across all airlines | skyscanner.net/business/partners |
| **Amadeus Hotel Search API** | Hotel availability and rates | developers.amadeus.com |
| **Booking.com Affiliate API** | Hotel booking with commission | join.booking.com |
| **Google Places API** | City name autocomplete with geocoding | developers.google.com/maps/documentation/places |

Replace the `getCellData` function with async API calls and cache results in sessionStorage to avoid redundant fetches.

---

## Monetization

**Hotel "Book Now" buttons** in `DetailModal.jsx` (`HotelCard` component) open Booking.com search URLs. Replace the placeholder URL with your affiliate tracking link:

```js
// Current placeholder (DetailModal.jsx ~line 90)
const bookingUrl = `https://www.booking.com/search.html?ss=${encodeURIComponent(destination)}&checkin=${departureDate}&checkout=${returnDate}`;

// With affiliate ID
const bookingUrl = `https://www.booking.com/search.html?aid=YOUR_AID&ss=...`;
```

**Conversion tracking** — each click already calls `console.log(...)`. Replace with GA4:

```js
// Replace console.log in HotelCard.handleBookNow with:
window.gtag('event', 'book_now_click', {
  hotel_name: hotel.name,
  destination,
  check_in: departureDate,
  check_out: returnDate,
  total_cost: hotel.totalHotelCost,
});
```

**Sponsored placements** — hotels with `sponsored: true` in `mockData.js` get a badge and appear first. Charge hotels a fixed CPM or CPA fee for this slot.
