// ─── Destination Cities ───────────────────────────────────────────────────────
export const DESTINATION_CITIES = [
  { code: 'BCN', name: 'Barcelona', country: 'Spain', flag: '🇪🇸', gradient: 'from-orange-400 to-red-500' },
  { code: 'CDG', name: 'Paris', country: 'France', flag: '🇫🇷', gradient: 'from-blue-400 to-indigo-500' },
  { code: 'FCO', name: 'Rome', country: 'Italy', flag: '🇮🇹', gradient: 'from-green-400 to-teal-500' },
  { code: 'AMS', name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', gradient: 'from-orange-300 to-orange-500' },
  { code: 'MAD', name: 'Madrid', country: 'Spain', flag: '🇪🇸', gradient: 'from-yellow-400 to-orange-500' },
  { code: 'LIS', name: 'Lisbon', country: 'Portugal', flag: '🇵🇹', gradient: 'from-teal-400 to-cyan-500' },
  { code: 'VIE', name: 'Vienna', country: 'Austria', flag: '🇦🇹', gradient: 'from-red-400 to-rose-500' },
  { code: 'PRG', name: 'Prague', country: 'Czech Republic', flag: '🇨🇿', gradient: 'from-blue-300 to-blue-600' },
  { code: 'DUB', name: 'Dublin', country: 'Ireland', flag: '🇮🇪', gradient: 'from-green-500 to-emerald-600' },
  { code: 'ATH', name: 'Athens', country: 'Greece', flag: '🇬🇷', gradient: 'from-sky-400 to-blue-500' },
  { code: 'CPH', name: 'Copenhagen', country: 'Denmark', flag: '🇩🇰', gradient: 'from-red-300 to-rose-400' },
  { code: 'BUD', name: 'Budapest', country: 'Hungary', flag: '🇭🇺', gradient: 'from-purple-400 to-violet-500' },
  { code: 'WAW', name: 'Warsaw', country: 'Poland', flag: '🇵🇱', gradient: 'from-red-500 to-red-700' },
  { code: 'DXB', name: 'Dubai', country: 'UAE', flag: '🇦🇪', gradient: 'from-amber-400 to-yellow-500' },
  { code: 'BKK', name: 'Bangkok', country: 'Thailand', flag: '🇹🇭', gradient: 'from-pink-400 to-fuchsia-500' },
];

// ─── Origin Cities ────────────────────────────────────────────────────────────
export const ORIGIN_CITIES = [
  { code: 'LHR', name: 'London', country: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FRA', name: 'Frankfurt', country: 'Germany', flag: '🇩🇪' },
  { code: 'AMS', name: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱' },
  { code: 'CDG', name: 'Paris', country: 'France', flag: '🇫🇷' },
  { code: 'MXP', name: 'Milan', country: 'Italy', flag: '🇮🇹' },
  { code: 'MAD', name: 'Madrid', country: 'Spain', flag: '🇪🇸' },
  { code: 'ZRH', name: 'Zurich', country: 'Switzerland', flag: '🇨🇭' },
  { code: 'BRU', name: 'Brussels', country: 'Belgium', flag: '🇧🇪' },
  { code: 'VIE', name: 'Vienna', country: 'Austria', flag: '🇦🇹' },
  { code: 'CPH', name: 'Copenhagen', country: 'Denmark', flag: '🇩🇰' },
];

// ─── Outbound Flights ─────────────────────────────────────────────────────────
export const OUTBOUND_FLIGHTS = [
  {
    id: 'OUT1',
    airline: 'Ryanair',
    flightNumber: 'FR 1042',
    departureTime: '05:30',
    arrivalTime: '08:15',
    duration: '2h 45m',
    stops: 0,
    basePrice: 89,
    convenient: false,
  },
  {
    id: 'OUT2',
    airline: 'easyJet',
    flightNumber: 'U2 8821',
    departureTime: '06:15',
    arrivalTime: '09:00',
    duration: '2h 45m',
    stops: 0,
    basePrice: 105,
    convenient: false,
  },
  {
    id: 'OUT3',
    airline: 'Vueling',
    flightNumber: 'VY 6200',
    departureTime: '07:45',
    arrivalTime: '10:30',
    duration: '2h 45m',
    stops: 0,
    basePrice: 129,
    convenient: true,
  },
  {
    id: 'OUT4',
    airline: 'British Airways',
    flightNumber: 'BA 0462',
    departureTime: '08:30',
    arrivalTime: '11:15',
    duration: '2h 45m',
    stops: 0,
    basePrice: 189,
    convenient: true,
  },
  {
    id: 'OUT5',
    airline: 'Iberia',
    flightNumber: 'IB 3164',
    departureTime: '10:20',
    arrivalTime: '13:05',
    duration: '2h 45m',
    stops: 0,
    basePrice: 155,
    convenient: true,
  },
  {
    id: 'OUT6',
    airline: 'Lufthansa',
    flightNumber: 'LH 1801',
    departureTime: '11:50',
    arrivalTime: '15:30',
    duration: '3h 40m',
    stops: 1,
    basePrice: 145,
    convenient: true,
    stopCity: 'Munich',
  },
  {
    id: 'OUT7',
    airline: 'KLM',
    flightNumber: 'KL 1672',
    departureTime: '13:30',
    arrivalTime: '16:15',
    duration: '2h 45m',
    stops: 0,
    basePrice: 175,
    convenient: true,
  },
  {
    id: 'OUT8',
    airline: 'Air France',
    flightNumber: 'AF 1340',
    departureTime: '15:45',
    arrivalTime: '18:30',
    duration: '2h 45m',
    stops: 0,
    basePrice: 162,
    convenient: true,
  },
  {
    id: 'OUT9',
    airline: 'easyJet',
    flightNumber: 'U2 8835',
    departureTime: '18:20',
    arrivalTime: '21:05',
    duration: '2h 45m',
    stops: 0,
    basePrice: 118,
    convenient: false,
  },
  {
    id: 'OUT10',
    airline: 'Ryanair',
    flightNumber: 'FR 1086',
    departureTime: '20:50',
    arrivalTime: '23:35',
    duration: '2h 45m',
    stops: 0,
    basePrice: 94,
    convenient: false,
  },
];

// ─── Return Flights ───────────────────────────────────────────────────────────
export const RETURN_FLIGHTS = [
  {
    id: 'RET1',
    airline: 'Ryanair',
    flightNumber: 'FR 1043',
    departureTime: '06:00',
    arrivalTime: '08:45',
    duration: '2h 45m',
    stops: 0,
    basePrice: 92,
    convenient: false,
  },
  {
    id: 'RET2',
    airline: 'easyJet',
    flightNumber: 'U2 8822',
    departureTime: '06:45',
    arrivalTime: '09:30',
    duration: '2h 45m',
    stops: 0,
    basePrice: 108,
    convenient: false,
  },
  {
    id: 'RET3',
    airline: 'Vueling',
    flightNumber: 'VY 6201',
    departureTime: '08:15',
    arrivalTime: '11:00',
    duration: '2h 45m',
    stops: 0,
    basePrice: 134,
    convenient: true,
  },
  {
    id: 'RET4',
    airline: 'British Airways',
    flightNumber: 'BA 0463',
    departureTime: '09:00',
    arrivalTime: '11:45',
    duration: '2h 45m',
    stops: 0,
    basePrice: 195,
    convenient: true,
  },
  {
    id: 'RET5',
    airline: 'Iberia',
    flightNumber: 'IB 3165',
    departureTime: '11:30',
    arrivalTime: '14:15',
    duration: '2h 45m',
    stops: 0,
    basePrice: 148,
    convenient: true,
  },
  {
    id: 'RET6',
    airline: 'Lufthansa',
    flightNumber: 'LH 1802',
    departureTime: '12:45',
    arrivalTime: '16:25',
    duration: '3h 40m',
    stops: 1,
    basePrice: 152,
    convenient: true,
    stopCity: 'Frankfurt',
  },
  {
    id: 'RET7',
    airline: 'KLM',
    flightNumber: 'KL 1673',
    departureTime: '14:20',
    arrivalTime: '17:05',
    duration: '2h 45m',
    stops: 0,
    basePrice: 178,
    convenient: true,
  },
  {
    id: 'RET8',
    airline: 'Air France',
    flightNumber: 'AF 1341',
    departureTime: '16:55',
    arrivalTime: '19:40',
    duration: '2h 45m',
    stops: 0,
    basePrice: 167,
    convenient: true,
  },
  {
    id: 'RET9',
    airline: 'easyJet',
    flightNumber: 'U2 8836',
    departureTime: '19:10',
    arrivalTime: '21:55',
    duration: '2h 45m',
    stops: 0,
    basePrice: 122,
    convenient: false,
  },
  {
    id: 'RET10',
    airline: 'Ryanair',
    flightNumber: 'FR 1087',
    departureTime: '21:30',
    arrivalTime: '00:15+1',
    duration: '2h 45m',
    stops: 0,
    basePrice: 97,
    convenient: false,
  },
];

// ─── Hotels ───────────────────────────────────────────────────────────────────
export const HOTELS = [
  {
    id: 'H1',
    name: 'Grand Palace Luxury Hotel',
    stars: 5,
    rating: 9.4,
    reviews: 3218,
    location: 'City Centre',
    pricePerNight: 285,
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Concierge'],
    description: 'Iconic five-star landmark in the heart of the city with breathtaking views and world-class service.',
    sponsored: true,
  },
  {
    id: 'H2',
    name: 'The Ritz Collection',
    stars: 5,
    rating: 9.6,
    reviews: 1842,
    location: 'Old Town',
    pricePerNight: 320,
    amenities: ['Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Butler Service', 'Valet'],
    description: 'Unmatched elegance and sophistication in the historic old town, steps from iconic landmarks.',
    sponsored: true,
  },
  {
    id: 'H3',
    name: 'Boutique Arts Hotel',
    stars: 5,
    rating: 9.1,
    reviews: 924,
    location: 'Arts District',
    pricePerNight: 248,
    amenities: ['Restaurant', 'Bar', 'Gym', 'Terrace', 'Art Gallery'],
    description: 'A curated art experience with designer rooms, each individually decorated by local artists.',
    sponsored: false,
  },
  {
    id: 'H4',
    name: 'Skyline Premium Hotel',
    stars: 4,
    rating: 8.8,
    reviews: 5610,
    location: 'Business District',
    pricePerNight: 195,
    amenities: ['Restaurant', 'Bar', 'Gym', 'Business Centre', 'Pool'],
    description: 'Contemporary four-star hotel with panoramic rooftop terrace and stylish modern interiors.',
    sponsored: false,
  },
  {
    id: 'H5',
    name: 'Hotel Mediterráneo',
    stars: 4,
    rating: 8.5,
    reviews: 4230,
    location: 'Beachfront',
    pricePerNight: 178,
    amenities: ['Pool', 'Restaurant', 'Bar', 'Beach Access', 'Spa'],
    description: 'Sun-soaked beachfront retreat with direct beach access and stunning sea views from every room.',
    sponsored: false,
  },
  {
    id: 'H6',
    name: 'Central Park Suites',
    stars: 4,
    rating: 8.7,
    reviews: 3891,
    location: 'City Park',
    pricePerNight: 162,
    amenities: ['Restaurant', 'Bar', 'Gym', 'Terrace', 'Bike Rental'],
    description: 'Spacious suites overlooking the central park, perfect for families and extended stays.',
    sponsored: false,
  },
  {
    id: 'H7',
    name: 'Urban Loft Collective',
    stars: 4,
    rating: 8.4,
    reviews: 2103,
    location: 'Hip Quarter',
    pricePerNight: 145,
    amenities: ['Bar', 'Gym', 'Co-working Space', 'Rooftop'],
    description: 'Industrial-chic design hotel in the trendiest neighbourhood with curated local experiences.',
    sponsored: false,
  },
  {
    id: 'H8',
    name: 'Heritage Classic Hotel',
    stars: 4,
    rating: 8.3,
    reviews: 6740,
    location: 'Historic Centre',
    pricePerNight: 138,
    amenities: ['Restaurant', 'Bar', 'Concierge', 'Terrace'],
    description: 'Beautifully restored 19th-century building blending historic charm with modern comfort.',
    sponsored: false,
  },
  {
    id: 'H9',
    name: 'Smart Stay Express',
    stars: 3,
    rating: 8.1,
    reviews: 9240,
    location: 'Transport Hub',
    pricePerNight: 118,
    amenities: ['Restaurant', 'Gym', 'Free WiFi'],
    description: 'Well-located, clean and efficient — ideal for the smart traveller who values convenience.',
    sponsored: false,
  },
  {
    id: 'H10',
    name: 'The Garden Guesthouse',
    stars: 3,
    rating: 8.4,
    reviews: 1876,
    location: 'Residential Area',
    pricePerNight: 98,
    amenities: ['Garden', 'Free Breakfast', 'Free WiFi', 'Terrace'],
    description: 'Charming guesthouse with a lush private garden and home-cooked breakfasts every morning.',
    sponsored: false,
  },
  {
    id: 'H11',
    name: 'Comfort Inn Central',
    stars: 3,
    rating: 7.9,
    reviews: 12450,
    location: 'City Centre',
    pricePerNight: 105,
    amenities: ['Restaurant', 'Free WiFi', 'Parking'],
    description: 'Reliable and comfortable three-star option with a central location at a great price.',
    sponsored: false,
  },
  {
    id: 'H12',
    name: 'Hostal Las Ramblas',
    stars: 3,
    rating: 8.2,
    reviews: 3344,
    location: 'Las Ramblas',
    pricePerNight: 92,
    amenities: ['Bar', 'Terrace', 'Free WiFi'],
    description: 'Lively hostal right on the famous boulevard — superb location and vibrant atmosphere.',
    sponsored: false,
  },
  {
    id: 'H13',
    name: 'Budget Traveller Lodge',
    stars: 3,
    rating: 7.7,
    reviews: 7890,
    location: 'Suburbs',
    pricePerNight: 78,
    amenities: ['Free WiFi', 'Shared Kitchen', 'Locker Storage'],
    description: 'Clean, safe and affordable — perfect for budget travellers exploring on a shoestring.',
    sponsored: false,
  },
  {
    id: 'H14',
    name: 'Panorama View Hotel',
    stars: 4,
    rating: 8.6,
    reviews: 2987,
    location: 'Hilltop',
    pricePerNight: 172,
    amenities: ['Restaurant', 'Bar', 'Pool', 'Spa', 'Panoramic Terrace'],
    description: 'Perched on the hilltop with 360-degree city views, a rooftop pool and gourmet dining.',
    sponsored: false,
  },
  {
    id: 'H15',
    name: 'Green Eco Retreat',
    stars: 3,
    rating: 8.5,
    reviews: 1234,
    location: 'City Outskirts',
    pricePerNight: 88,
    amenities: ['Garden', 'Organic Restaurant', 'Yoga Studio', 'Free WiFi'],
    description: 'Award-winning sustainable hotel committed to eco-friendly travel without compromising comfort.',
    sponsored: false,
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Returns a stable integer hash from a date string (YYYY-MM-DD).
 * Used to pick deterministic flights/hotels per date.
 */
export function dateHash(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Picks an outbound flight deterministically from the departure date.
 */
export function getOutboundFlight(departureDate) {
  const idx = dateHash(departureDate) % OUTBOUND_FLIGHTS.length;
  return OUTBOUND_FLIGHTS[idx];
}

/**
 * Picks a return flight deterministically from the return date.
 */
export function getReturnFlight(returnDate) {
  const idx = (dateHash(returnDate) + 3) % RETURN_FLIGHTS.length;
  return RETURN_FLIGHTS[idx];
}

/**
 * Returns all computed data for a specific departure + return date pair.
 * @param {string} departureDate - YYYY-MM-DD
 * @param {string} returnDate    - YYYY-MM-DD
 * @param {number} minHotelStars - 3 | 4 | 5
 * @param {number} travelers     - total number of travelers
 */
export function getCellData(departureDate, returnDate, minHotelStars = 3, travelers = 2) {
  const nights = daysBetween(departureDate, returnDate);
  if (nights <= 0) return null;

  const outbound = getOutboundFlight(departureDate);
  const inbound = getReturnFlight(returnDate);

  // Add small date-based price variation (+/- 15%)
  const dHash = dateHash(departureDate + returnDate);
  const variation = 0.85 + (dHash % 30) / 100; // 0.85 – 1.15

  const outboundPrice = Math.round(outbound.basePrice * variation * travelers);
  const inboundPrice = Math.round(inbound.basePrice * variation * travelers);

  // Filter hotels by minimum stars and sort by price
  const eligibleHotels = HOTELS
    .filter(h => h.stars >= minHotelStars)
    .map(h => {
      const hotelVariation = 0.9 + (dateHash(departureDate + h.id) % 20) / 100;
      return {
        ...h,
        adjustedPricePerNight: Math.round(h.pricePerNight * hotelVariation),
        totalHotelCost: Math.round(h.pricePerNight * hotelVariation * nights),
      };
    })
    .sort((a, b) => {
      // Sponsored hotels first, then by price
      if (a.sponsored && !b.sponsored) return -1;
      if (!a.sponsored && b.sponsored) return 1;
      return a.adjustedPricePerNight - b.adjustedPricePerNight;
    });

  const cheapestHotel = eligibleHotels.find(h => !h.sponsored) || eligibleHotels[0];
  const cheapestHotelCost = cheapestHotel ? cheapestHotel.totalHotelCost : 0;

  const totalCost = outboundPrice + inboundPrice + cheapestHotelCost;
  const cheapestTotal = totalCost;

  return {
    departureDate,
    returnDate,
    nights,
    outbound: { ...outbound, price: outboundPrice },
    inbound: { ...inbound, price: inboundPrice },
    hotels: eligibleHotels,
    cheapestHotel,
    cheapestHotelCost,
    outboundPrice,
    inboundPrice,
    totalCost,
    cheapestTotal,
    travelers,
  };
}

/**
 * Generates an array of date strings starting from startDate for `days` days.
 * @param {string} startDate - YYYY-MM-DD
 * @param {number} days
 * @returns {string[]}
 */
export function generateDateRange(startDate, days) {
  const dates = [];
  const base = new Date(startDate + 'T00:00:00');
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

/**
 * Formats a YYYY-MM-DD date string.
 * @param {string} dateStr
 * @param {'short'|'weekday'|'full'|'month-day'} format
 */
export function formatDate(dateStr, format = 'short') {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = DAYS[d.getDay()];
  const monthName = MONTHS[d.getMonth()];
  const dayNum = d.getDate();

  if (format === 'short') return `${monthName} ${dayNum}`;
  if (format === 'weekday') return dayName;
  if (format === 'full') return `${dayName}, ${monthName} ${dayNum}`;
  if (format === 'month-day') return `${monthName} ${dayNum}`;
  return `${monthName} ${dayNum}`;
}

/**
 * Returns the number of whole days between two YYYY-MM-DD strings.
 */
export function daysBetween(date1, date2) {
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

/**
 * Maps a normalised value (0–1) to an HSL colour string.
 * 0 = green (120°), 0.5 = yellow (60°), 1 = red (0°).
 */
export function getColorForNormalized(normalized) {
  const clamped = Math.max(0, Math.min(1, normalized));
  const hue = Math.round((1 - clamped) * 120); // 120° green → 0° red
  const saturation = 75;
  const lightness = 45 + Math.round(clamped * 10); // slightly brighter for expensive
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
