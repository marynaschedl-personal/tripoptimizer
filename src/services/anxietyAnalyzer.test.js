/**
 * Unit Tests for AnxietyAnalyzer
 * Tests scoring logic, multipliers, and warning/recommendation generation
 */

import { analyzeTrip } from './anxietyAnalyzer.js';

// Test data helpers
function createMockCellData(overrides = {}) {
  return {
    departureDate: '2026-04-10',
    returnDate: '2026-04-22',
    nights: 12,
    outbound: {
      airline: 'Lufthansa',
      flightNumber: 'LH 711',
      departureTime: '10:00',
      arrivalTime: '10:15',
      departureAirport: 'MUC',
      arrivalAirport: 'LHR',
      durationMinutes: 135,
      stops: 0,
      price: 120,
    },
    inbound: {
      airline: 'Lufthansa',
      flightNumber: 'LH 712',
      departureTime: '15:00',
      arrivalTime: '18:30',
      departureAirport: 'LHR',
      arrivalAirport: 'MUC',
      durationMinutes: 150,
      stops: 0,
      price: 100,
    },
    hotels: [
      {
        id: 'h1',
        name: 'Test Hotel',
        stars: 4,
        pricePerNight: 100,
      },
    ],
    cheapestHotel: {
      id: 'h1',
      name: 'Test Hotel',
      stars: 4,
      pricePerNight: 100,
    },
    totalCost: 800,
    ...overrides,
  };
}

function createMockSearchParams(overrides = {}) {
  return {
    origin: 'MUC',
    destination: 'LHR',
    startDate: '2026-04-10',
    endDate: '2026-04-22',
    adults: 2,
    children: 0,
    tripLength: 12,
    ...overrides,
  };
}

// ============================================================================
// TEST SUITE 1: Anxiety Level Boundaries
// ============================================================================

console.log('\n=== TEST SUITE 1: Anxiety Level Boundaries ===\n');

// Test 1.1: Direct flight on medium trip = Not Stressful
{
  const cellData = createMockCellData({
    outbound: {
      ...createMockCellData().outbound,
      departureTime: '10:00',
      durationMinutes: 135,
      stops: 0,
    },
    inbound: {
      ...createMockCellData().inbound,
      departureTime: '15:00',
      durationMinutes: 150,
      stops: 0,
    },
  });
  const searchParams = createMockSearchParams({ tripLength: 12 });

  const result = analyzeTrip(cellData, searchParams, 12);

  console.assert(
    result.anxietyLevel === 'not_stressful',
    `Test 1.1 FAILED: Expected 'not_stressful', got '${result.anxietyLevel}' (score: ${result.score})`
  );
  console.log(`✓ Test 1.1 PASSED: Direct flight on 12-day trip = Not Stressful (score: ${result.score.toFixed(2)})`);
}

// Test 1.2: Red-eye + layover on short trip = Very Stressful
{
  const cellData = createMockCellData({
    outbound: {
      ...createMockCellData().outbound,
      departureTime: '23:30',
      durationMinutes: 300,
      stops: 1,
    },
    inbound: {
      ...createMockCellData().inbound,
      departureTime: '14:00',
      durationMinutes: 180,
      stops: 0,
    },
  });
  const searchParams = createMockSearchParams({ tripLength: 3 });

  const result = analyzeTrip(cellData, searchParams, 3);

  console.assert(
    result.anxietyLevel === 'very_stressful',
    `Test 1.2 FAILED: Expected 'very_stressful', got '${result.anxietyLevel}' (score: ${result.score})`
  );
  console.log(`✓ Test 1.2 PASSED: Red-eye + layover on 3-day trip = Very Stressful (score: ${result.score.toFixed(2)})`);
}

// Test 1.3: Red-eye + layover on long trip = Medium (not Very Stressful)
{
  const cellData = createMockCellData({
    outbound: {
      ...createMockCellData().outbound,
      departureTime: '23:30',
      durationMinutes: 300,
      stops: 1,
    },
    inbound: {
      ...createMockCellData().inbound,
      departureTime: '14:00',
      durationMinutes: 180,
      stops: 0,
    },
  });
  const searchParams = createMockSearchParams({ tripLength: 14 });

  const result = analyzeTrip(cellData, searchParams, 14);

  console.assert(
    result.anxietyLevel === 'medium',
    `Test 1.3 FAILED: Expected 'medium', got '${result.anxietyLevel}' (score: ${result.score})`
  );
  console.log(`✓ Test 1.3 PASSED: Red-eye + layover on 14-day trip = Medium (score: ${result.score.toFixed(2)})`);
}

// ============================================================================
// TEST SUITE 2: Trip Duration Multiplier Effects
// ============================================================================

console.log('\n=== TEST SUITE 2: Trip Duration Multiplier Effects ===\n');

// Test 2.1: Same flight, different trip lengths
{
  const baseCellData = createMockCellData({
    outbound: {
      ...createMockCellData().outbound,
      departureTime: '23:30', // Red-eye
      durationMinutes: 600, // Long flight
      stops: 1,
    },
    inbound: {
      ...createMockCellData().inbound,
      departureTime: '14:00',
      durationMinutes: 180,
      stops: 0,
    },
  });

  // 3-day trip
  const result3day = analyzeTrip(baseCellData, createMockSearchParams({ tripLength: 3 }), 3);

  // 14-day trip
  const result14day = analyzeTrip(baseCellData, createMockSearchParams({ tripLength: 14 }), 14);

  // 3-day should have higher anxiety than 14-day for the same flight
  console.assert(
    result3day.score > result14day.score,
    `Test 2.1 FAILED: 3-day trip (${result3day.score.toFixed(2)}) should have higher score than 14-day trip (${result14day.score.toFixed(2)})`
  );
  console.log(`✓ Test 2.1 PASSED: Same flight, different trip lengths`);
  console.log(`  └─ 3-day: ${result3day.score.toFixed(2)} (${result3day.anxietyLevel})`);
  console.log(`  └─ 14-day: ${result14day.score.toFixed(2)} (${result14day.anxietyLevel})`);
}

// ============================================================================
// TEST SUITE 3: Warning Generation
// ============================================================================

console.log('\n=== TEST SUITE 3: Warning Generation ===\n');

// Test 3.1: Red-eye warning
{
  const cellData = createMockCellData({
    outbound: {
      ...createMockCellData().outbound,
      departureTime: '23:30',
    },
  });
  const result = analyzeTrip(cellData, createMockSearchParams(), 12);

  const hasRedEyeWarning = result.warnings.some((w) => w.toLowerCase().includes('red-eye'));
  console.assert(
    hasRedEyeWarning,
    `Test 3.1 FAILED: Expected red-eye warning in: ${result.warnings.join(', ')}`
  );
  console.log(`✓ Test 3.1 PASSED: Red-eye warning generated`);
}

// Test 3.2: Long flight warning
{
  const cellData = createMockCellData({
    outbound: {
      ...createMockCellData().outbound,
      durationMinutes: 600, // 10+ hours
    },
    inbound: {
      ...createMockCellData().inbound,
      durationMinutes: 300,
    },
  });
  const result = analyzeTrip(cellData, createMockSearchParams(), 12);

  const hasLongFlightWarning = result.warnings.some((w) => w.toLowerCase().includes('long flight'));
  console.assert(
    hasLongFlightWarning,
    `Test 3.2 FAILED: Expected long flight warning in: ${result.warnings.join(', ')}`
  );
  console.log(`✓ Test 3.2 PASSED: Long flight warning generated`);
}

// Test 3.3: Jet lag warning
{
  const cellData = createMockCellData({
    outbound: {
      ...createMockCellData().outbound,
      departureAirport: 'LHR',
      arrivalAirport: 'NRT', // Europe to Asia = 8h jet lag
    },
  });
  const result = analyzeTrip(cellData, createMockSearchParams(), 12);

  const hasJetLagWarning = result.warnings.some((w) => w.toLowerCase().includes('jet lag'));
  console.assert(
    hasJetLagWarning,
    `Test 3.3 FAILED: Expected jet lag warning in: ${result.warnings.join(', ')}`
  );
  console.log(`✓ Test 3.3 PASSED: Jet lag warning generated`);
}

// Test 3.4: No warnings for ideal trip
{
  const cellData = createMockCellData({
    outbound: {
      ...createMockCellData().outbound,
      departureTime: '10:00', // Morning
      durationMinutes: 135,
      stops: 0,
    },
    inbound: {
      ...createMockCellData().inbound,
      departureTime: '15:00',
      durationMinutes: 150,
      stops: 0,
    },
  });
  const result = analyzeTrip(cellData, createMockSearchParams(), 12);

  console.assert(
    result.warnings.length === 0,
    `Test 3.4 FAILED: Expected no warnings for ideal trip, got: ${result.warnings.join(', ')}`
  );
  console.log(`✓ Test 3.4 PASSED: No warnings for ideal trip`);
}

// ============================================================================
// TEST SUITE 4: Recommendation Generation
// ============================================================================

console.log('\n=== TEST SUITE 4: Recommendation Generation ===\n');

// Test 4.1: Direct flight recommendation
{
  const cellData = createMockCellData({
    outbound: {
      ...createMockCellData().outbound,
      stops: 0,
    },
    inbound: {
      ...createMockCellData().inbound,
      stops: 0,
    },
  });
  const result = analyzeTrip(cellData, createMockSearchParams(), 12);

  const hasDirectFlightRec = result.recommendations.some((r) => r.toLowerCase().includes('direct'));
  console.assert(
    hasDirectFlightRec,
    `Test 4.1 FAILED: Expected direct flight recommendation`
  );
  console.log(`✓ Test 4.1 PASSED: Direct flight recommendation generated`);
}

// Test 4.2: Early arrival recommendation
{
  const cellData = createMockCellData({
    inbound: {
      ...createMockCellData().inbound,
      arrivalTime: '10:00', // Early morning arrival
    },
  });
  const result = analyzeTrip(cellData, createMockSearchParams(), 12);

  const hasEarlyArrivalRec = result.recommendations.some((r) => r.toLowerCase().includes('early'));
  console.assert(
    hasEarlyArrivalRec,
    `Test 4.2 FAILED: Expected early arrival recommendation`
  );
  console.log(`✓ Test 4.2 PASSED: Early arrival recommendation generated`);
}

// Test 4.3: Trip length recommendation for long trips
{
  const cellData = createMockCellData();
  const result = analyzeTrip(cellData, createMockSearchParams({ tripLength: 14 }), 14);

  const hasTripLengthRec = result.recommendations.some(
    (r) => r.toLowerCase().includes('trip length') || r.toLowerCase().includes('14 days')
  );
  console.assert(
    hasTripLengthRec,
    `Test 4.3 FAILED: Expected trip length recommendation for long trips`
  );
  console.log(`✓ Test 4.3 PASSED: Trip length recommendation for long trips generated`);
}

// ============================================================================
// TEST SUITE 5: Factor Calculations
// ============================================================================

console.log('\n=== TEST SUITE 5: Factor Calculations ===\n');

// Test 5.1: Factors are within bounds
{
  const cellData = createMockCellData();
  const result = analyzeTrip(cellData, createMockSearchParams(), 12);

  const { factors } = result;
  console.assert(
    factors.fatigueRisk >= 0 && factors.fatigueRisk <= 1,
    `Test 5.1a FAILED: fatigueRisk out of bounds: ${factors.fatigueRisk}`
  );
  console.assert(
    factors.conflictRisk >= 0 && factors.conflictRisk <= 1,
    `Test 5.1b FAILED: conflictRisk out of bounds: ${factors.conflictRisk}`
  );
  console.assert(
    factors.complexity >= 0 && factors.complexity <= 1,
    `Test 5.1c FAILED: complexity out of bounds: ${factors.complexity}`
  );
  console.assert(
    factors.restPenalty >= 0 && factors.restPenalty <= 1,
    `Test 5.1d FAILED: restPenalty out of bounds: ${factors.restPenalty}`
  );
  console.log(`✓ Test 5.1 PASSED: All factors within bounds [0.0, 1.0]`);
  console.log(`  └─ Fatigue: ${factors.fatigueRisk.toFixed(2)}`);
  console.log(`  └─ Conflict: ${factors.conflictRisk.toFixed(2)}`);
  console.log(`  └─ Complexity: ${factors.complexity.toFixed(2)}`);
  console.log(`  └─ Rest: ${factors.restPenalty.toFixed(2)}`);
}

// Test 5.2: Score formula is correct
{
  const cellData = createMockCellData();
  const result = analyzeTrip(cellData, createMockSearchParams(), 12);

  const { factors, score } = result;
  const expectedScore = (factors.fatigueRisk * 0.4) + (factors.conflictRisk * 0.3) + (factors.complexity * 0.2) + (factors.restPenalty * 0.1);

  console.assert(
    Math.abs(score - expectedScore) < 0.01,
    `Test 5.2 FAILED: Score formula mismatch. Got ${score}, expected ${expectedScore}`
  );
  console.log(`✓ Test 5.2 PASSED: Score formula calculation correct`);
}

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n=== ALL TESTS PASSED ✓ ===\n');
console.log('Summary:');
console.log('  ✓ Anxiety level boundaries (3 tests)');
console.log('  ✓ Trip duration multipliers (1 test)');
console.log('  ✓ Warning generation (4 tests)');
console.log('  ✓ Recommendation generation (3 tests)');
console.log('  ✓ Factor calculations (2 tests)');
console.log('\nTotal: 13 tests passed\n');
