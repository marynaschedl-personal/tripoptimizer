/**
 * Mock Munich → Tokyo itinerary for TripAssistant testing
 * Real-world scenario with realistic timings and conflicts
 */

export const mockTripMeta = {
  origin: 'MUC',
  destination: 'NRT',
  startDate: '2026-04-10',
  endDate: '2026-04-20',
  travelerCount: 2,
  childCount: 1,
};

export const mockSegments = [
  // ─── Day 1: Munich to Frankfurt ────────────────────────────────────
  {
    id: 'seg-flight-muc-fra',
    type: 'flight',
    localStartTime: '08:00',
    localEndTime: '09:15',
    locationCode: 'FRA',
    title: 'Munich → Frankfurt',
    subtitle: 'Lufthansa LH 711',
    fatigueWeight: 0.15,
    notes: 'Direct flight, morning departure',
    details: {
      airline: 'Lufthansa',
      flightNumber: 'LH 711',
      departureAirport: 'MUC',
      arrivalAirport: 'FRA',
      terminal: '1',
      durationMinutes: 75,
    },
  },

  // ─── Frankfurt Layover ─────────────────────────────────────────────
  {
    id: 'seg-layover-fra',
    type: 'layover',
    localStartTime: '09:45',
    localEndTime: '13:00',
    locationCode: 'FRA',
    title: 'Layover in Frankfurt',
    subtitle: '3h 15m',
    fatigueWeight: 0.1,
    notes: 'Domestic to international transfer',
    details: {
      airport: 'Frankfurt am Main',
      terminal: '1',
      durationMinutes: 195,
    },
  },

  // ─── Long-haul Flight ──────────────────────────────────────────────
  {
    id: 'seg-flight-fra-nrt',
    type: 'flight',
    localStartTime: '13:30',
    localEndTime: '06:15', // Next day, local Tokyo time
    locationCode: 'NRT',
    title: 'Frankfurt → Tokyo',
    subtitle: 'Lufthansa LH 712',
    fatigueWeight: 0.55,
    notes: 'Red-eye, arrives early morning next day',
    details: {
      airline: 'Lufthansa',
      flightNumber: 'LH 712',
      departureAirport: 'FRA',
      arrivalAirport: 'NRT',
      terminal: '1A',
      durationMinutes: 765, // 12h 45m flight time
    },
  },

  // ─── Transit to Hotel ──────────────────────────────────────────────
  {
    id: 'seg-transit-nrt-shinjuku',
    type: 'transit',
    localStartTime: '07:30',
    localEndTime: '09:15',
    locationCode: 'SHJ',
    title: 'Narita Express to Shinjuku',
    subtitle: 'Train transfer',
    fatigueWeight: 0.1,
    notes: 'Narita Express (N\'EX) to Tokyo',
    details: {
      transportMode: 'train',
      from: 'Narita Airport Terminal 1',
      to: 'Shinjuku Station',
      distanceKm: 60,
      durationMinutes: 105,
    },
  },

  // ─── Hotel Check-in ────────────────────────────────────────────────
  {
    id: 'seg-hotel-shinjuku',
    type: 'accommodation',
    localStartTime: '09:30',
    localEndTime: '11:00',
    locationCode: 'SHJ',
    title: 'Mitsui Garden Hotel Shinjuku',
    subtitle: '4-star, city center',
    fatigueWeight: 0,
    notes: 'Check-in opens 15:00, but early check-in arranged',
    details: {
      hotelName: 'Mitsui Garden Hotel Shinjuku',
      address: 'Shinjuku, Tokyo',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      distanceKm: 0,
    },
  },

  // ─── Jet Lag / Activity ────────────────────────────────────────────
  {
    id: 'seg-rest-day1',
    type: 'activity',
    localStartTime: '10:00',
    localEndTime: '17:00',
    locationCode: 'SHJ',
    title: 'Rest & Acclimatization',
    subtitle: 'Light activities, early sleep',
    fatigueWeight: 0.2,
    notes: 'Jet lag management: nap window 13:00-15:00, early dinner',
    details: {
      activityType: 'rest',
    },
  },
];

export const familyAnnotations = [
  {
    segmentId: 'seg-flight-muc-fra',
    napWindow: '08:00-09:15',
    mealTiming: 'Breakfast before departure',
    notes: '5-year-old: snack on flight',
  },
  {
    segmentId: 'seg-layover-fra',
    napWindow: null,
    mealTiming: 'Lunch 11:30',
    notes: 'Change clothes, kid can run around in terminal',
  },
  {
    segmentId: 'seg-flight-fra-nrt',
    napWindow: '14:00-00:00 (cabin lights out)',
    mealTiming: 'Lunch service 15:00, dinner service 23:00',
    notes: 'Long flight: bring entertainment, pressure socks for kid',
  },
  {
    segmentId: 'seg-transit-nrt-shinjuku',
    napWindow: 'Skip — stay awake to adjust to Tokyo time',
    mealTiming: 'Snack at station cafe',
    notes: 'Kid should stay awake despite fatigue',
  },
  {
    segmentId: 'seg-rest-day1',
    napWindow: '13:00-15:00 (organized nap)',
    mealTiming: 'Light lunch 12:00, early dinner 17:30',
    notes: 'Strict bedtime 21:00 to reset circadian rhythm',
  },
];

export const layoverOptions = [
  { label: 'Lounge Access', type: 'lounge' },
  { label: 'Spa & Shower', type: 'lounge' },
  { label: 'Local Dining', type: 'dining' },
  { label: 'Airport Shop', type: 'activity' },
  { label: 'Walk Around', type: 'activity' },
];
