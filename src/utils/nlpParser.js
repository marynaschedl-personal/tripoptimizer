/**
 * Natural Language Parser for Trip Search
 * Uses regex patterns to extract search parameters
 * Example: "Barcelona to London April 10-22 for 7 nights, 2 adults"
 */

// City mapping from name to code
const CITY_ALIASES = {
  'london': 'LHR', 'barcelona': 'BCN', 'rome': 'FCO', 'amsterdam': 'AMS',
  'madrid': 'MAD', 'lisbon': 'LIS', 'vienna': 'VIE', 'prague': 'PRG',
  'dublin': 'DUB', 'athens': 'ATH', 'copenhagen': 'CPH', 'budapest': 'BUD',
  'warsaw': 'WAW', 'dubai': 'DXB', 'bangkok': 'BKK', 'tokyo': 'NRT',
  'paris': 'CDG', 'frankfurt': 'FRA', 'zurich': 'ZRH', 'brussels': 'BRU',
  'milan': 'MXP', 'haneda': 'HND', 'munich': 'MUC'
};

const MONTH_MAP = {
  'jan': 1, 'january': 1, 'feb': 2, 'february': 2, 'mar': 3, 'march': 3,
  'apr': 4, 'april': 4, 'may': 5, 'jun': 6, 'june': 6, 'jul': 7, 'july': 7,
  'aug': 8, 'august': 8, 'sep': 9, 'sept': 9, 'september': 9, 'oct': 10,
  'october': 10, 'nov': 11, 'november': 11, 'dec': 12, 'december': 12
};

/**
 * Extract city code from natural language
 */
function extractCity(text) {
  const words = text.toLowerCase().split(/[\s,\-→]/);
  for (const word of words) {
    const code = CITY_ALIASES[word.trim()];
    if (code) return code;
    // Check if it's already a 3-letter code
    if (/^[a-z]{3}$/.test(word.trim())) {
      return word.trim().toUpperCase();
    }
  }
  return null;
}

/**
 * Extract date from various formats
 * "April 10", "10 April", "Apr 10", "2026-04-10", "10/04/2026"
 */
function parseDate(dateStr, currentYear = new Date().getFullYear()) {
  if (!dateStr) return null;

  // Format: "YYYY-MM-DD"
  const isoMatch = dateStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`;
  }

  // Format: "10/04/2026" or "10-04-2026"
  const slashMatch = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (slashMatch) {
    return `${slashMatch[3]}-${slashMatch[2].padStart(2, '0')}-${slashMatch[1].padStart(2, '0')}`;
  }

  // Format: "April 10" or "10 April" or "Apr 10"
  const monthMatch = dateStr.match(/(\d{1,2})\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)/i);
  if (monthMatch) {
    const day = monthMatch[1].padStart(2, '0');
    const month = MONTH_MAP[monthMatch[2].toLowerCase()].toString().padStart(2, '0');
    return `${currentYear}-${month}-${day}`;
  }

  const monthDayMatch = dateStr.match(/(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\s+(\d{1,2})/i);
  if (monthDayMatch) {
    const month = MONTH_MAP[monthDayMatch[1].toLowerCase()].toString().padStart(2, '0');
    const day = monthDayMatch[2].padStart(2, '0');
    return `${currentYear}-${month}-${day}`;
  }

  return null;
}

/**
 * Extract date range (start-end)
 */
function extractDateRange(text) {
  // Format: "April 10-22", "Apr 10-22", "10-22 April"
  const rangeMatch = text.match(/(\d{1,2})\s*\-\s*(\d{1,2})\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)/i);
  if (rangeMatch) {
    const startDay = rangeMatch[1].padStart(2, '0');
    const endDay = rangeMatch[2].padStart(2, '0');
    const month = MONTH_MAP[rangeMatch[3].toLowerCase()].toString().padStart(2, '0');
    const year = new Date().getFullYear();
    return {
      startDate: `${year}-${month}-${startDay}`,
      endDate: `${year}-${month}-${endDay}`
    };
  }

  // Format with year: "April 10-22, 2026"
  const rangeWithYearMatch = text.match(/(\d{1,2})\s*\-\s*(\d{1,2})\s+(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)[,\s]+(\d{4})/i);
  if (rangeWithYearMatch) {
    const startDay = rangeWithYearMatch[1].padStart(2, '0');
    const endDay = rangeWithYearMatch[2].padStart(2, '0');
    const month = MONTH_MAP[rangeWithYearMatch[3].toLowerCase()].toString().padStart(2, '0');
    const year = rangeWithYearMatch[4];
    return {
      startDate: `${year}-${month}-${startDay}`,
      endDate: `${year}-${month}-${endDay}`
    };
  }

  return null;
}

/**
 * Extract trip length in nights
 */
function extractTripLength(text) {
  // "7 nights", "7-night", "week" (7), "weekend" (3), "10 days" (10)
  const nightsMatch = text.match(/(\d+)\s*(?:nights?|days?|nites?)/i);
  if (nightsMatch) return parseInt(nightsMatch[1]);

  if (/week/i.test(text)) return 7;
  if (/weekend/i.test(text)) return 3;

  return null;
}

/**
 * Extract number of travelers
 */
function extractTravelers(text) {
  let adults = 1;
  let children = 0;

  const adultsMatch = text.match(/(\d+)\s*adults?/i);
  if (adultsMatch) adults = parseInt(adultsMatch[1]);

  const childrenMatch = text.match(/(\d+)\s*children?|(\d+)\s*kids?/i);
  if (childrenMatch) children = parseInt(childrenMatch[1] || childrenMatch[2]);

  return { adults, children };
}

/**
 * Main parser function
 * Returns parsed search params with confidence score
 */
export function parseNaturalLanguage(input, context = {}) {
  if (!input || input.trim().length === 0) {
    return {
      success: false,
      confidence: 'low',
      message: 'Empty input',
      missingFields: ['origin', 'destination', 'dates']
    };
  }

  const text = input.toLowerCase();
  const result = {
    success: false,
    confidence: 'low',
    origin: null,
    destination: null,
    startDate: null,
    endDate: null,
    adults: 1,
    children: 0,
    tripLength: null,
    missingFields: [],
    message: '',
    rawInput: input
  };

  // Extract cities
  const parts = text.split(/(?:to|from|→|-&gt;|and)/);
  if (parts.length >= 2) {
    result.origin = extractCity(parts[0]);
    result.destination = extractCity(parts[1]);
  }

  // Extract date range
  const dateRange = extractDateRange(text);
  if (dateRange) {
    result.startDate = dateRange.startDate;
    result.endDate = dateRange.endDate;
  }

  // Extract trip length if no date range
  if (!result.startDate && !result.endDate) {
    result.tripLength = extractTripLength(text);
  }

  // Extract travelers
  const travelers = extractTravelers(text);
  result.adults = travelers.adults;
  result.children = travelers.children;

  // Calculate confidence score
  const hasOrigin = !!result.origin;
  const hasDestination = !!result.destination;
  const hasDates = !!(result.startDate && result.endDate) || result.tripLength;

  if (hasOrigin && hasDestination && hasDates) {
    result.confidence = 'high';
    result.success = true;
  } else if ((hasOrigin || hasDestination) && hasDates) {
    result.confidence = 'medium';
    result.success = false;
  } else if (hasOrigin || hasDestination) {
    result.confidence = 'low';
    result.success = false;
  }

  // Identify missing fields
  if (!hasOrigin) result.missingFields.push('origin');
  if (!hasDestination) result.missingFields.push('destination');
  if (!hasDates) result.missingFields.push('dates');

  // Set message
  if (result.success) {
    result.message = `Found: ${result.origin} → ${result.destination}`;
  } else if (result.confidence === 'medium') {
    result.message = `Partially understood. Missing: ${result.missingFields.join(', ')}`;
  } else {
    result.message = `Could not parse. Need: origin, destination, and dates`;
  }

  return result;
}

/**
 * Format parsed result to SearchParams
 */
export function parsedToSearchParams(parsed) {
  if (!parsed.success || parsed.confidence !== 'high') {
    return null;
  }

  // If we have trip length but no dates, calculate dates from today
  let startDate = parsed.startDate;
  let endDate = parsed.endDate;

  if (!startDate && parsed.tripLength) {
    const today = new Date();
    startDate = today.toISOString().slice(0, 10);
    const returnDate = new Date(today);
    returnDate.setDate(returnDate.getDate() + parsed.tripLength);
    endDate = returnDate.toISOString().slice(0, 10);
  }

  return {
    origin: parsed.origin,
    destination: parsed.destination,
    startDate,
    endDate,
    adults: parsed.adults,
    children: parsed.children,
    budgetMin: '',
    budgetMax: ''
  };
}
