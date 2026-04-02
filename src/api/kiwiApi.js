/**
 * Kiwi.com Flight API Integration
 * Handles fetching real flight prices and caching results
 */

const KIWI_API_HOST = 'kiwi-com-cheap-flights.p.rapidapi.com';
const KIWI_API_KEY = '36b0787dbbmsh9cafb5d9466a4abp14ff04jsnc96a4591d22f';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const CONCURRENT_REQUESTS_MAX = 3;
const BATCH_DELAY_MS = 200;

// City to Kiwi format mapping
const CITY_MAPPING = {
  'london': 'City:london_gb',
  'lhr': 'Airport:LHR',
  'frankfurt': 'City:frankfurt_de',
  'fra': 'Airport:FRA',
  'amsterdam': 'City:amsterdam_nl',
  'ams': 'Airport:AMS',
  'paris': 'City:paris_fr',
  'cdg': 'Airport:CDG',
  'milan': 'City:milan_it',
  'mxp': 'Airport:MXP',
  'madrid': 'City:madrid_es',
  'mad': 'Airport:MAD',
  'zurich': 'City:zurich_ch',
  'zrh': 'Airport:ZRH',
  'brussels': 'City:brussels_be',
  'bru': 'Airport:BRU',
  'vienna': 'City:vienna_at',
  'vie': 'Airport:VIE',
  'copenhagen': 'City:copenhagen_dk',
  'cph': 'Airport:CPH',
  'munich': 'City:munich_de',
  'muc': 'Airport:MUC',
  'barcelona': 'City:barcelona_es',
  'bcn': 'Airport:BCN',
  'rome': 'City:rome_it',
  'fco': 'Airport:FCO',
  'lisbon': 'City:lisbon_pt',
  'lis': 'Airport:LIS',
  'prague': 'City:prague_cz',
  'prg': 'Airport:PRG',
  'dublin': 'City:dublin_ie',
  'dub': 'Airport:DUB',
  'athens': 'City:athens_gr',
  'ath': 'Airport:ATH',
  'dubai': 'City:dubai_ae',
  'dxb': 'Airport:DXB',
  'bangkok': 'City:bangkok_th',
  'bkk': 'Airport:BKK',
  'tokyo': 'City:tokyo_jp',
  'nrt': 'Airport:NRT',
  'haneda': 'City:haneda_jp',
  'hnd': 'Airport:HND',
};

/**
 * Convert city name or airport code to Kiwi format
 */
export function mapCityToKiwiFormat(input) {
  if (!input) return null;
  const normalized = input.toLowerCase().trim();
  return CITY_MAPPING[normalized] || `City:${normalized}`;
}

/**
 * Fetch flights from Kiwi API
 * Returns { success, price, outboundTime, returnTime, airlines, stops, fullData }
 */
export async function fetchFlightPrice(origin, destination, outboundDate, returnDate, adults = 1, currency = 'EUR') {
  try {
    const kiwiOrigin = mapCityToKiwiFormat(origin);
    const kiwiDest = mapCityToKiwiFormat(destination);

    if (!kiwiOrigin || !kiwiDest) {
      return { success: false, error: 'Invalid city/airport code' };
    }

    const url = 'https://kiwi-com-cheap-flights.p.rapidapi.com/round-trip';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': KIWI_API_HOST,
        'x-rapidapi-key': KIWI_API_KEY,
      },
      body: JSON.stringify({
        from: kiwiOrigin,
        to: kiwiDest,
        outbound_date: outboundDate,
        return_date: returnDate,
        adults,
        currency,
        locale: 'en',
        cabin_class: 'ECONOMY',
        sort_by: 'QUALITY',
        limit: 5,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Kiwi API error:', response.status, error);
      return { success: false, error: `API Error: ${response.status}` };
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      return { success: false, error: 'No flights found' };
    }

    const cheapest = data.data[0];
    const price = Math.round(cheapest.price || 0);

    // Extract flight info
    const outboundRoutes = cheapest.routes?.[0] || {};
    const returnRoutes = cheapest.routes?.[cheapest.routes.length - 1] || {};

    return {
      success: true,
      price,
      outboundTime: outboundRoutes.local_departure || 'N/A',
      returnTime: returnRoutes.local_departure || 'N/A',
      airlines: cheapest.airlines?.join(', ') || 'Mixed',
      stops: cheapest.stops || 0,
      fullData: cheapest,
    };
  } catch (error) {
    console.error('Kiwi API fetch error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get cache key for a flight search
 */
function getCacheKey(origin, destination, date) {
  return `kiwi_flight_${origin}_${destination}_${date}`;
}

/**
 * Check if cached data is still valid
 */
function isCacheValid(cacheEntry) {
  if (!cacheEntry) return false;
  const age = Date.now() - cacheEntry.timestamp;
  return age < CACHE_DURATION_MS;
}

/**
 * Get flight price from cache or API
 * Includes automatic caching
 */
export async function getFlightPrice(origin, destination, outboundDate, returnDate, adults = 1) {
  // Check cache first
  const cacheKey = getCacheKey(origin, destination, `${outboundDate}_${returnDate}`);
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const entry = JSON.parse(cached);
    if (isCacheValid(entry)) {
      return { ...entry.data, cached: true, cacheAge: Date.now() - entry.timestamp };
    }
  }

  // Fetch from API
  const result = await fetchFlightPrice(origin, destination, outboundDate, returnDate, adults);

  if (result.success) {
    // Cache the successful result
    const cacheEntry = {
      timestamp: Date.now(),
      data: result,
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
  }

  return { ...result, cached: false };
}

/**
 * Batch fetch multiple flight prices with rate limiting
 * Yields progress updates via callback
 */
export async function batchFetchFlightPrices(flights, onProgress) {
  const results = {};
  const total = flights.length;
  let completed = 0;

  // Process in batches to avoid overwhelming the API
  for (let i = 0; i < flights.length; i += CONCURRENT_REQUESTS_MAX) {
    const batch = flights.slice(i, i + CONCURRENT_REQUESTS_MAX);
    const promises = batch.map(async (flight) => {
      const result = await getFlightPrice(
        flight.origin,
        flight.destination,
        flight.outboundDate,
        flight.returnDate,
        flight.adults
      );
      results[flight.key] = result;
      completed++;
      if (onProgress) {
        onProgress({ completed, total, currentBatch: batch.length });
      }
    });

    await Promise.all(promises);

    // Delay before next batch (except last)
    if (i + CONCURRENT_REQUESTS_MAX < flights.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }

  return results;
}

/**
 * Clear flight cache (for refresh/reset)
 */
export function clearFlightCache() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('kiwi_flight_')) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Get cache age in minutes (for display)
 */
export function getCacheAgeMinutes(timestamp) {
  const ageMs = Date.now() - timestamp;
  return Math.floor(ageMs / (60 * 1000));
}
