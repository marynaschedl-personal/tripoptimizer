/**
 * Anxiety Analyzer Service
 * Scores trips by anxiety level (Not Stressful / Medium / Very Stressful)
 * based on fatigue, conflicts, complexity, and trip duration context
 */

/**
 * Main function: Analyze a trip combination and return anxiety score
 * @param {Object} cellData - flight + hotel combination from HeatMap
 * @param {Object} searchParams - search parameters including tripLength
 * @param {number} tripLength - duration of trip in days (derived from dates or explicitly set)
 * @returns {Object} - anxiety analysis with score, level, factors, warnings, recommendations
 */
export function analyzeTrip(cellData, searchParams, tripLength) {
  if (!cellData || !searchParams) {
    return getDefaultAnalysis();
  }

  const fatigueRisk = calculateFatigue(cellData, tripLength);
  const conflictRisk = calculateConflicts(cellData, searchParams);
  const complexity = calculateComplexity(cellData);
  const restPenalty = calculateRestPenalty(cellData, tripLength);

  // Weighted score calculation
  const score = (fatigueRisk * 0.4) + (conflictRisk * 0.3) + (complexity * 0.2) + (restPenalty * 0.1);

  // Clamp score to 0.0-1.0
  const clampedScore = Math.min(1.0, Math.max(0.0, score));

  const anxietyLevel = getAnxietyLevel(clampedScore);
  const warnings = generateWarnings(cellData, fatigueRisk, conflictRisk, tripLength);
  const recommendations = generateRecommendations(cellData, tripLength);

  return {
    anxietyLevel,
    score: clampedScore,
    factors: {
      fatigueRisk: Math.min(1.0, fatigueRisk),
      conflictRisk: Math.min(1.0, conflictRisk),
      complexity,
      restPenalty,
    },
    warnings,
    recommendations,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Calculate fatigue risk adjusted by trip duration
 * Longer trips can tolerate more fatigue; shorter trips are hit harder
 */
function calculateFatigue(cellData, tripLength) {
  let baseFatigue = 0;

  if (!cellData.outbound || !cellData.inbound) {
    return baseFatigue;
  }

  // Flight duration penalty
  const outboundMinutes = cellData.outbound.durationMinutes || 0;
  const inboundMinutes = cellData.inbound.durationMinutes || 0;
  const totalFlightMinutes = outboundMinutes + inboundMinutes;

  // Long-haul flights (>8 hours) = high fatigue base
  if (totalFlightMinutes > 480) {
    baseFatigue += 0.5; // Major fatigue component
  } else if (totalFlightMinutes > 300) {
    baseFatigue += 0.3;
  } else {
    baseFatigue += 0.15;
  }

  // Layover penalties
  const outboundStops = cellData.outbound.stops || 0;
  const inboundStops = cellData.inbound.stops || 0;
  baseFatigue += (outboundStops + inboundStops) * 0.15;

  // Red-eye penalty (departures between 20:00 and 06:00)
  if (isRedEyeFlight(cellData.outbound.departureTime)) {
    baseFatigue += 0.2;
  }
  if (isRedEyeFlight(cellData.inbound.departureTime)) {
    baseFatigue += 0.2;
  }

  // Jet lag penalty (time zone difference)
  const timezoneShift = calculateTimezoneShift(cellData);
  if (timezoneShift > 6) {
    baseFatigue += 0.15;
  } else if (timezoneShift > 3) {
    baseFatigue += 0.1;
  }

  // Trip duration multiplier
  const durationMultiplier = getTripDurationMultiplier(tripLength);

  return Math.min(1.0, baseFatigue * durationMultiplier);
}

/**
 * Calculate conflict risk (tight connections, check-in timing issues)
 */
function calculateConflicts(cellData, searchParams) {
  let conflictRisk = 0;

  if (!cellData.outbound || !cellData.inbound) {
    return conflictRisk;
  }

  // Check connection time in outbound flight
  if (cellData.outbound.stops && cellData.outbound.stops > 0) {
    // Estimate connection time based on stops
    // Typical layover is 1-3 hours; anything <2 hours is tight
    const estimatedLayover = 2; // hours (conservative estimate from mock data)

    if (estimatedLayover < 2) {
      conflictRisk += 0.3; // Tight connection is risky
    } else if (estimatedLayover < 3) {
      conflictRisk += 0.15;
    }
  }

  // Hotel check-in timing conflict
  if (cellData.hotels && cellData.hotels.length > 0) {
    const hotel = cellData.hotels[0]; // Use first hotel
    const standardCheckIn = 15; // 3 PM standard check-in hour

    // Try to extract arrival time from inbound flight
    const arrivalHour = extractHourFromTime(cellData.inbound.arrivalTime);

    if (arrivalHour && arrivalHour > standardCheckIn) {
      // Late arrival, might miss standard check-in
      conflictRisk += 0.2;
    }
  }

  return Math.min(1.0, conflictRisk);
}

/**
 * Calculate travel complexity (direct vs layovers)
 */
function calculateComplexity(cellData) {
  let complexity = 0;

  if (!cellData.outbound || !cellData.inbound) {
    return complexity;
  }

  // Direct flights are simple (0.2)
  // 1 layover is moderate (0.5)
  // 2+ layovers are complex (0.8)

  const outboundStops = cellData.outbound.stops || 0;
  const inboundStops = cellData.inbound.stops || 0;
  const totalStops = outboundStops + inboundStops;

  if (totalStops === 0) {
    complexity = 0.2;
  } else if (totalStops === 1) {
    complexity = 0.5;
  } else {
    complexity = 0.8;
  }

  return Math.min(1.0, complexity);
}

/**
 * Calculate rest penalty based on trip length and rest days
 * Shorter trips need more rest days; longer trips can spread recovery
 */
function calculateRestPenalty(cellData, tripLength) {
  let restPenalty = 0.1; // Base penalty

  if (!tripLength || tripLength < 1) {
    return 0.5; // Very short trips = high penalty
  }

  // Assess if user has rest day after arrival
  const arrivalHour = extractHourFromTime(cellData.inbound?.arrivalTime);

  // If arriving in evening (after 5 PM), next day is effectively rest
  if (arrivalHour && arrivalHour >= 17) {
    // Evening arrival = better recovery
    if (tripLength <= 5) {
      restPenalty = 0.15; // Still some penalty for short trips
    } else {
      restPenalty = 0.05; // Much better for longer trips
    }
  } else if (arrivalHour && arrivalHour <= 12) {
    // Morning arrival = less rest before activities
    if (tripLength <= 5) {
      restPenalty = 0.25; // More penalty
    } else {
      restPenalty = 0.1;
    }
  }

  return Math.min(1.0, restPenalty);
}

/**
 * Map anxiety score (0.0-1.0) to category
 * 0.0-0.35  = Not Stressful
 * 0.35-0.65 = Medium
 * 0.65-1.0  = Very Stressful
 */
function getAnxietyLevel(score) {
  if (score < 0.35) {
    return 'not_stressful';
  } else if (score < 0.65) {
    return 'medium';
  } else {
    return 'very_stressful';
  }
}

/**
 * Generate warning messages based on trip characteristics
 */
function generateWarnings(cellData, fatigueRisk, conflictRisk, tripLength) {
  const warnings = [];

  if (!cellData) {
    return warnings;
  }

  // Fatigue warnings
  if (fatigueRisk > 0.7) {
    const totalMinutes = (cellData.outbound?.durationMinutes || 0) + (cellData.inbound?.durationMinutes || 0);
    const hours = Math.round(totalMinutes / 60);
    warnings.push(`⚠️ Long flights: ${hours}+ hours total travel time. High fatigue risk.`);
  }

  // Red-eye warnings
  if (cellData.outbound && isRedEyeFlight(cellData.outbound.departureTime)) {
    warnings.push(`⚠️ Red-eye flight: Departs late evening. Plan to rest immediately upon arrival.`);
  }

  // Connection warnings
  if (cellData.outbound?.stops > 0) {
    warnings.push(`⚠️ Tight connection: Watch luggage transfer times closely.`);
  }

  // Jet lag warnings
  const tzShift = calculateTimezoneShift(cellData);
  if (tzShift > 6) {
    warnings.push(`⚠️ Significant jet lag: ${tzShift}+ hour time difference. Budget extra rest.`);
  }

  // Hotel timing warnings
  if (cellData.hotels && cellData.hotels.length > 0) {
    const arrivalHour = extractHourFromTime(cellData.inbound?.arrivalTime);
    if (arrivalHour && arrivalHour > 15) {
      warnings.push(`⚠️ Late arrival: Hotel check-in may not be available. Confirm early check-in with hotel.`);
    }
  }

  // Short trip fatigue warnings
  if (tripLength && tripLength <= 3 && fatigueRisk > 0.4) {
    warnings.push(`⚠️ Short trip + high fatigue: Less recovery time. Keep first day activities light.`);
  }

  return warnings;
}

/**
 * Generate recommendation messages
 */
function generateRecommendations(cellData, tripLength) {
  const recommendations = [];

  if (!cellData) {
    return recommendations;
  }

  // Direct flight recommendations
  if (!cellData.outbound?.stops && !cellData.inbound?.stops) {
    recommendations.push(`✓ Direct flights: No layovers means fresher arrival and less hassle.`);
  }

  // Early arrival recommendations
  const arrivalHour = extractHourFromTime(cellData.inbound?.arrivalTime);
  if (arrivalHour && arrivalHour < 14) {
    recommendations.push(`✓ Early arrival: Full afternoon/evening to settle in and explore.`);
  } else if (arrivalHour && arrivalHour >= 17) {
    recommendations.push(`✓ Evening arrival: Tomorrow is your first full day, good for rest.`);
  }

  // Trip length recommendations
  if (tripLength && tripLength >= 7) {
    recommendations.push(`✓ Good trip length: ${tripLength} days gives plenty of time to recover from travel.`);
  }

  // Hotel quality recommendations
  if (cellData.cheapestHotel) {
    const stars = cellData.cheapestHotel.stars || 0;
    if (stars >= 4) {
      recommendations.push(`✓ Quality accommodation: 4+ star hotel will help you rest well.`);
    }
  }

  // Budget-friendly recommendations
  if (cellData.totalCost < 1000) {
    recommendations.push(`✓ Great value: Excellent price-to-comfort ratio.`);
  }

  return recommendations;
}

/**
 * Helper: Get trip duration multiplier for fatigue calculation
 * Shorter trips can tolerate less fatigue; longer trips can handle more
 */
function getTripDurationMultiplier(tripLength) {
  if (!tripLength) {
    return 1.0;
  }

  if (tripLength <= 5) {
    return 1.5; // Short trips: fatigue hits harder
  } else if (tripLength <= 10) {
    return 1.0; // Medium trips: baseline
  } else {
    return 0.7; // Long trips: more recovery time
  }
}

/**
 * Helper: Check if flight is a red-eye (departs between 8 PM and 6 AM)
 */
function isRedEyeFlight(departureTime) {
  if (!departureTime) return false;

  const hour = extractHourFromTime(departureTime);
  return hour !== null && (hour >= 20 || hour < 6);
}

/**
 * Helper: Extract hour from time string (e.g., "23:30" -> 23)
 */
function extractHourFromTime(timeStr) {
  if (!timeStr) return null;

  const match = timeStr.match(/^(\d{1,2}):/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Helper: Calculate timezone shift between origin and destination
 * Rough estimate based on typical timezone offsets
 */
function calculateTimezoneShift(cellData) {
  // Simplified: Europe to Asia ~7-8h, Europe to Americas ~5-8h, etc.
  // In a real implementation, use proper timezone library

  const originCode = cellData.outbound?.departureAirport;
  const destCode = cellData.outbound?.arrivalAirport;

  // Mock implementation: check if transcontinental
  const europeanCodes = ['LHR', 'CDG', 'FRA', 'MAD', 'FCO', 'AMS', 'VIE'];
  const asiaCodes = ['NRT', 'HND', 'SIN', 'HKG', 'BKK'];
  const americasCodes = ['LAX', 'JFK', 'ORD', 'MIA'];

  const originRegion = getRegion(originCode);
  const destRegion = getRegion(destCode);

  if (originRegion !== destRegion) {
    if (
      (originRegion === 'europe' && destRegion === 'asia') ||
      (originRegion === 'asia' && destRegion === 'europe')
    ) {
      return 8;
    } else if (
      (originRegion === 'europe' && destRegion === 'americas') ||
      (originRegion === 'americas' && destRegion === 'europe')
    ) {
      return 6;
    } else if (
      (originRegion === 'americas' && destRegion === 'asia') ||
      (originRegion === 'asia' && destRegion === 'americas')
    ) {
      return 14;
    }
  }

  return 0;
}

/**
 * Helper: Get region from airport code
 */
function getRegion(code) {
  if (!code) return 'unknown';

  const regions = {
    europe: ['LHR', 'CDG', 'FRA', 'MAD', 'FCO', 'AMS', 'VIE', 'PRG', 'DUB', 'ATH', 'CPH', 'BUD', 'WAW', 'ZRH', 'BRU', 'MXP'],
    asia: ['NRT', 'HND', 'SIN', 'HKG', 'BKK', 'DXB'],
    americas: ['LAX', 'JFK', 'ORD', 'MIA'],
  };

  for (const [region, codes] of Object.entries(regions)) {
    if (codes.includes(code)) {
      return region;
    }
  }

  return 'unknown';
}

/**
 * Default analysis for missing data
 */
function getDefaultAnalysis() {
  return {
    anxietyLevel: 'medium',
    score: 0.5,
    factors: {
      fatigueRisk: 0.5,
      conflictRisk: 0.5,
      complexity: 0.5,
      restPenalty: 0.5,
    },
    warnings: ['Unable to fully analyze trip. Please provide complete flight details.'],
    recommendations: [],
    timestamp: new Date().toISOString(),
  };
}
