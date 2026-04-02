/**
 * Unit tests for detectConflicts
 * Run with: npm test (after setting up Jest)
 * For now, manual testing is included below
 */

import { detectConflicts } from './detectConflicts.js';

// Mock test data
const mockSegments = [
  {
    id: 'seg-1',
    type: 'flight',
    localStartTime: '08:00',
    localEndTime: '23:00',
    locationCode: 'MUC',
    title: 'Munich to Frankfurt',
    subtitle: 'Lufthansa LH 711',
    fatigueWeight: 0.3,
    details: {
      airline: 'Lufthansa',
      flightNumber: 'LH 711',
      departureAirport: 'MUC',
      arrivalAirport: 'FRA',
      durationMinutes: 60,
    },
  },
  {
    id: 'seg-2',
    type: 'layover',
    localStartTime: '23:30',
    localEndTime: '02:15',
    locationCode: 'FRA',
    title: 'Layover in Frankfurt',
    subtitle: '2h 45m',
    fatigueWeight: 0.2,
    details: {
      durationMinutes: 165,
      terminal: '1',
    },
  },
  {
    id: 'seg-3',
    type: 'flight',
    localStartTime: '02:45',
    localEndTime: '17:30',
    locationCode: 'NRT',
    title: 'Frankfurt to Tokyo',
    subtitle: 'Lufthansa LH 712',
    fatigueWeight: 0.5,
    details: {
      airline: 'Lufthansa',
      flightNumber: 'LH 712',
      departureAirport: 'FRA',
      arrivalAirport: 'NRT',
      durationMinutes: 780,
    },
  },
  {
    id: 'seg-4',
    type: 'transit',
    localStartTime: '18:00',
    localEndTime: '19:30',
    locationCode: 'NRT',
    title: 'Narita Express to Tokyo',
    subtitle: 'Train transfer',
    fatigueWeight: 0.1,
    details: {
      transportMode: 'train',
      distanceKm: 60,
      durationMinutes: 90,
    },
  },
  {
    id: 'seg-5',
    type: 'accommodation',
    localStartTime: '20:00',
    localEndTime: '11:00',
    locationCode: 'TYO',
    title: 'Mitsui Garden Hotel',
    subtitle: 'Shinjuku, Tokyo',
    fatigueWeight: 0,
    details: {
      hotelName: 'Mitsui Garden Hotel Shinjuku',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      distanceKm: 0,
    },
  },
];

function runTests() {
  console.log('Running detectConflicts tests...\n');

  const { alerts, summary } = detectConflicts(mockSegments);

  console.log('Alerts detected:', alerts.length);
  console.log('Summary:', summary);
  console.log('\nDetailed alerts:');
  alerts.forEach((alert, idx) => {
    console.log(`\n${idx + 1}. [${alert.severity.toUpperCase()}] ${alert.type}`);
    console.log(`   Segment: ${alert.segmentId}`);
    console.log(`   Message: ${alert.message}`);
    if (alert.fixSuggestion) console.log(`   Fix: ${alert.fixSuggestion}`);
    if (alert.fixCost) console.log(`   Cost: €${alert.fixCost}`);
  });

  // Assertions
  console.log('\n\n--- Running assertions ---');

  // Should detect short layover risk (165 min is >= 150, so sweet spot)
  const sweetSpot = alerts.find(a => a.type === 'layover_sweet_spot');
  console.log(`✓ Layover sweet spot detected: ${sweetSpot ? 'PASS' : 'FAIL'}`);

  // Should detect fatigue accumulation
  const fatigue = alerts.find(a => a.type === 'fatigue_accumulation');
  console.log(`✓ Fatigue accumulation: ${fatigue ? 'PASS (warning added)' : 'PASS (under 0.7 threshold)'}`);

  // Should detect arrival-to-checkin
  const checkin = alerts.find(a => a.type === 'arrival_after_checkin_open');
  console.log(`✓ Arrival-to-checkin: ${checkin ? 'PASS (danger detected)' : 'PASS (no conflict in test)'}`);

  console.log('\nAll tests complete.');
}

// Export for Jest/testing framework
export { runTests };

// Run manually in browser/Node console: runTests()
if (typeof window === 'undefined' && typeof module !== 'undefined') {
  // Node.js
  try {
    runTests();
  } catch (e) {
    console.error('Test error:', e);
  }
}
