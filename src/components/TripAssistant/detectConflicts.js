/**
 * Parse time string (HH:mm or ISO) to minutes since midnight
 */
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  if (timeStr.includes('T')) {
    const parts = timeStr.split('T')[1].split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  const parts = timeStr.split(':');
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

/**
 * Get duration in minutes between start and end times
 */
function getDurationMinutes(startStr, endStr) {
  const start = timeToMinutes(startStr);
  const end = timeToMinutes(endStr);
  if (end < start) {
    // Next day
    return (24 * 60 - start) + end;
  }
  return end - start;
}

/**
 * Detect all conflicts in a trip
 * @param {Array} segments - TripSegment[]
 * @returns {Object} { alerts: ConflictAlert[], summary: { danger, warn, info } }
 */
export function detectConflicts(segments) {
  const alerts = [];
  let alertId = 0;

  // Sort segments by start time for validation
  const sorted = [...segments].sort((a, b) => {
    const aTime = timeToMinutes(a.localStartTime);
    const bTime = timeToMinutes(b.localStartTime);
    return aTime - bTime;
  });

  // 1. Arrival-to-checkin gap
  for (let i = 0; i < sorted.length; i++) {
    const segment = sorted[i];
    if (segment.type === 'flight') {
      const arrivalTime = timeToMinutes(segment.localEndTime);
      // Find next accommodation
      const nextAccom = sorted.slice(i + 1).find(s => s.type === 'accommodation');
      if (nextAccom) {
        const checkinTime = timeToMinutes(nextAccom.details?.checkInTime || '15:00');
        const gapMinutes = checkinTime - arrivalTime;
        if (gapMinutes < 0) {
          // Same-day arrival after check-in opens
          alerts.push({
            id: `alert-${alertId++}`,
            segmentId: segment.id,
            severity: 'danger',
            type: 'arrival_after_checkin_open',
            message: `You arrive at ${segment.localEndTime} but check-in opens at ${nextAccom.details?.checkInTime || '15:00'}`,
            fixSuggestion: `Request early check-in or find luggage storage`,
            fixCost: 0,
          });
        } else if (gapMinutes > 4 * 60) {
          // More than 4h gap
          alerts.push({
            id: `alert-${alertId++}`,
            segmentId: segment.id,
            severity: 'info',
            type: 'long_arrival_gap',
            message: `You arrive ${Math.floor(gapMinutes / 60)}h before check-in opens`,
            fixSuggestion: `Consider a city tour or rest at airport lounge`,
          });
        }
      }
    }
  }

  // 2. Check-in cutoff risk
  for (const segment of sorted) {
    if (segment.type === 'accommodation') {
      const checkoutTime = timeToMinutes(segment.details?.checkOutTime || '11:00');
      // Find previous flight/transit arrival
      const prevFlight = sorted.reverse().find(s => s.localStartTime < segment.localStartTime && (s.type === 'flight' || s.type === 'transit'));
      if (prevFlight) {
        const estimatedArrival = timeToMinutes(prevFlight.localEndTime);
        if (prevFlight.details?.durationMinutes) {
          // Could be a complex arrival scenario
        }
        const timeBeforeCheckout = checkoutTime - estimatedArrival;
        if (timeBeforeCheckout >= 0 && timeBeforeCheckout < 90) {
          alerts.push({
            id: `alert-${alertId++}`,
            segmentId: segment.id,
            severity: 'warn',
            type: 'checkin_cutoff_risk',
            message: `Only ${timeBeforeCheckout}min between arrival and check-in cutoff (${segment.details?.checkOutTime || '11:00'})`,
            fixSuggestion: `Arrange early check-in with the hotel`,
          });
        }
      }
    }
  }

  // 3. Fatigue accumulation
  let cumulativeFatigue = 0;
  for (let i = 0; i < sorted.length; i++) {
    const segment = sorted[i];
    cumulativeFatigue += segment.fatigueWeight || 0;

    if (cumulativeFatigue > 0.7 && segment.type !== 'accommodation') {
      alerts.push({
        id: `alert-${alertId++}`,
        segmentId: segment.id,
        severity: 'warn',
        type: 'fatigue_accumulation',
        message: `Cumulative fatigue at ${(cumulativeFatigue * 100).toFixed(0)}% — you need rest soon`,
        fixSuggestion: `Schedule a longer rest or add a leisure day`,
      });
      cumulativeFatigue = 0; // Reset after accommodation
    }

    if (segment.type === 'accommodation') {
      cumulativeFatigue = 0;
    }
  }

  // 4. Layover validation
  for (const segment of sorted) {
    if (segment.type === 'layover') {
      const durationMin = segment.details?.durationMinutes || getDurationMinutes(segment.localStartTime, segment.localEndTime);
      const isInternational = segment.details?.terminal ? true : false;
      const minLayover = isInternational ? 75 : 45;

      if (durationMin < minLayover) {
        alerts.push({
          id: `alert-${alertId++}`,
          segmentId: segment.id,
          severity: 'danger',
          type: 'layover_too_short',
          message: `${durationMin}min layover is risky for ${isInternational ? 'international' : 'domestic'} transfer (${minLayover}min recommended)`,
          fixSuggestion: `Book a connecting flight with longer layover`,
          fixCost: 50,
        });
      } else if (durationMin >= 150 && durationMin <= 240) {
        alerts.push({
          id: `alert-${alertId++}`,
          segmentId: segment.id,
          severity: 'info',
          type: 'layover_sweet_spot',
          message: `Perfect ${durationMin}min layover — enough time to grab food or relax in the lounge`,
        });
      }
    }
  }

  const summary = {
    danger: alerts.filter(a => a.severity === 'danger').length,
    warn: alerts.filter(a => a.severity === 'warn').length,
    info: alerts.filter(a => a.severity === 'info').length,
  };

  return { alerts, summary };
}

/**
 * Get severity color classes for Tailwind
 */
export function getSeverityColor(severity) {
  const colors = {
    danger: { bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
    warn: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
    info: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
    ok: { bg: 'bg-teal-50 dark:bg-teal-950/30', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-700 dark:text-teal-300', dot: 'bg-teal-500' },
  };
  return colors[severity] || colors.ok;
}

/**
 * Get icon name for segment type
 */
export function getSegmentIcon(type) {
  const icons = {
    flight: 'Plane',
    transit: 'Navigation',
    accommodation: 'Hotel',
    layover: 'Clock',
    activity: 'MapPin',
  };
  return icons[type] || 'MapPin';
}
