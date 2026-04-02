/**
 * @typedef {Object} TripSegment
 * @property {string} id - Unique segment identifier
 * @property {'flight'|'transit'|'accommodation'|'layover'|'activity'} type
 * @property {string} localStartTime - ISO string or HH:mm format
 * @property {string} localEndTime - ISO string or HH:mm format
 * @property {string} locationCode - IATA code or location identifier
 * @property {string} [title] - Display title (e.g., "Munich to Tokyo")
 * @property {string} [subtitle] - Additional detail (e.g., "Lufthansa LH 711")
 * @property {number} fatigueWeight - 0–1 float (0=rest, 1=exhausting)
 * @property {string} [notes] - Additional info
 * @property {Object} [details] - Type-specific details
 * @property {string} [details.airline] - For flights
 * @property {string} [details.flightNumber] - For flights
 * @property {string} [details.departureAirport] - For flights
 * @property {string} [details.arrivalAirport] - For flights
 * @property {string} [details.terminal] - For flights/layovers
 * @property {number} [details.durationMinutes] - Duration in minutes
 * @property {string} [details.hotelName] - For accommodation
 * @property {string} [details.checkInTime] - For accommodation
 * @property {string} [details.checkOutTime] - For accommodation
 * @property {number} [details.distanceKm] - For transit
 * @property {string} [details.transportMode] - For transit (taxi, train, etc)
 */

/**
 * @typedef {Object} ConflictAlert
 * @property {string} id - Unique alert identifier
 * @property {string} segmentId - Reference to TripSegment.id
 * @property {'info'|'warn'|'danger'} severity
 * @property {string} type - Alert category (e.g., 'arrival_to_checkin', 'fatigue', 'layover_short')
 * @property {string} message - Human-readable message
 * @property {string} [fixSuggestion] - Suggested action or change
 * @property {number} [fixCost] - Cost of the fix (e.g., +€150 for hotel change)
 */

/**
 * @typedef {Object} FamilyAnnotation
 * @property {string} segmentId - Reference to TripSegment.id
 * @property {string} [napWindow] - e.g., "14:00-16:00"
 * @property {string} [mealTiming] - e.g., "Breakfast 08:00, Lunch 12:30"
 * @property {string} [notes] - Kid-specific notes
 */

/**
 * @typedef {Object} TripMeta
 * @property {string} origin - Origin IATA code
 * @property {string} destination - Destination IATA code
 * @property {string} startDate - YYYY-MM-DD
 * @property {string} endDate - YYYY-MM-DD
 * @property {number} travelerCount - Total travelers
 * @property {number} [childCount] - Number of children (for family mode)
 */

export {};
