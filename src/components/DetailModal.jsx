import React, { useEffect, useState, useCallback } from 'react';
import {
  X, Star, StarOff, Clock, Plane, Hotel, Share2, ExternalLink,
  TrendingDown, ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import { formatDate, OUTBOUND_FLIGHTS, daysBetween } from '../data/mockData.js';
import { analyzeTrip } from '../services/anxietyAnalyzer.js';
import AnxietyReport from './AnxietyReport.jsx';

/**
 * Format date from YYYY-MM-DD to DD-MM-YYYY for Kiwi.com
 */
function formatDateForKiwi(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
}

function StarsRow({ count }) {
  return (
    <span className="text-amber-400">
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

function FlightCard({ flight, label, origin, destination }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
            <Plane size={14} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{flight.airline}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100">€{flight.price}</p>
          <p className="text-xs text-gray-400">{flight.flightNumber}</p>
        </div>
      </div>

      {/* Route + time */}
      <div className="flex items-center gap-3">
        <div className="text-center">
          <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{flight.departureTime}</p>
          <p className="text-xs text-gray-400 font-medium">{origin || 'DEP'}</p>
        </div>
        <div className="flex-1 relative">
          <div className="h-px bg-gray-300 dark:bg-gray-600 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-gray-50 dark:bg-gray-800 px-2 text-[10px] text-gray-400 font-medium">
                {flight.duration}
              </span>
            </div>
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500" />
        </div>
        <div className="text-center">
          <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{flight.arrivalTime}</p>
          <p className="text-xs text-gray-400 font-medium">{destination || 'ARR'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {flight.stops === 0 ? (
            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-semibold px-2 py-0.5 rounded-full">
              Direct
            </span>
          ) : (
            <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 text-xs font-semibold px-2 py-0.5 rounded-full">
              1 stop · {flight.stopCity}
            </span>
          )}
          {flight.convenient ? (
            <span className="text-xs text-gray-400">Convenient time</span>
          ) : (
            <span className="text-xs text-gray-400">Budget time</span>
          )}
        </div>
      </div>
    </div>
  );
}

function HotelCard({ hotel, nights, destination, departureDate, returnDate }) {
  const bookingUrl = `https://www.booking.com/search.html?ss=${encodeURIComponent(destination || 'Barcelona')}&checkin=${departureDate || ''}&checkout=${returnDate || ''}`;

  function handleBookNow() {
    console.log('Book Now clicked:', {
      hotel: hotel.name,
      destination,
      checkIn: departureDate,
      checkOut: returnDate,
      nights,
      totalCost: hotel.totalHotelCost,
    });
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className={clsx(
      'rounded-xl border p-4 space-y-3 transition-all duration-150',
      hotel.sponsored
        ? 'border-amber-200 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10'
        : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60',
      'hover:shadow-md',
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {hotel.sponsored && (
            <span className="inline-block bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 uppercase tracking-wide">
              Sponsored
            </span>
          )}
          <p className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{hotel.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <StarsRow count={hotel.stars} />
            <span className="text-xs text-gray-400">{hotel.location}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 justify-end">
            <span className="bg-indigo-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-lg">
              {hotel.rating}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {hotel.rating >= 9 ? 'Exceptional' : hotel.rating >= 8.5 ? 'Excellent' : hotel.rating >= 8 ? 'Very Good' : 'Good'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{hotel.reviews.toLocaleString()} reviews</p>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{hotel.description}</p>

      {/* Amenities */}
      <div className="flex flex-wrap gap-1.5">
        {hotel.amenities.slice(0, 5).map(a => (
          <span key={a} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-full">
            {a}
          </span>
        ))}
        {hotel.amenities.length > 5 && (
          <span className="text-[10px] text-gray-400 dark:text-gray-500 px-1 py-0.5">+{hotel.amenities.length - 5} more</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100">€{hotel.totalHotelCost.toLocaleString()}</p>
          <p className="text-xs text-gray-400">€{hotel.adjustedPricePerNight}/night · {nights} nights</p>
        </div>
        <button
          onClick={handleBookNow}
          className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow transition-all duration-150 hover:shadow-lg"
        >
          Book Now <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
}

export default function DetailModal({ isOpen, onClose, cellData, searchParams, onToggleStar, isStarred, anxietyCache }) {
  const [anxietyReport, setAnxietyReport] = useState(null);
  const [loadingAnxiety, setLoadingAnxiety] = useState(false);

  const handleEsc = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEsc]);

  // Analyze anxiety when modal opens or cellData changes
  useEffect(() => {
    if (!isOpen || !cellData || !searchParams) {
      setAnxietyReport(null);
      return;
    }

    const analyzeAnxiety = async () => {
      const { departureDate, returnDate } = cellData;
      const cellKey = `${departureDate}__${returnDate}`;

      // Check if already cached (from HeatMap analysis)
      if (anxietyCache && anxietyCache[cellKey]) {
        setAnxietyReport(anxietyCache[cellKey]);
        return;
      }

      // Analyze on demand if not cached
      try {
        setLoadingAnxiety(true);
        const tripLength = searchParams.tripLength || daysBetween(searchParams.startDate, searchParams.endDate);
        const analysis = analyzeTrip(cellData, searchParams, tripLength);
        setAnxietyReport(analysis);
      } catch (err) {
        console.error('Error analyzing trip anxiety:', err);
        setAnxietyReport(null);
      } finally {
        setLoadingAnxiety(false);
      }
    };

    analyzeAnxiety();
  }, [isOpen, cellData, searchParams, anxietyCache]);

  if (!isOpen || !cellData) return null;

  const { departureDate, returnDate, nights, outbound, inbound, hotels, cheapestHotel, outboundPrice, inboundPrice, cheapestHotelCost, totalCost } = cellData;
  const { origin, destination } = searchParams || {};

  const destCity = destination || 'Destination';
  const originCode = origin || 'LHR';

  const topHotels = (hotels || []).slice(0, 5);

  // Tradeoff hint: find cheaper outbound
  const cheaperFlight = outbound && outbound.basePrice > 100
    ? OUTBOUND_FLIGHTS.find(f => f.basePrice < outbound.basePrice && !f.convenient)
    : null;
  const savings = cheaperFlight
    ? Math.round((outbound.basePrice - cheaperFlight.basePrice) * (searchParams?.adults || 2))
    : 0;

  function handleShare() {
    const url = new URL(window.location.href);
    if (searchParams) {
      Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    url.searchParams.set('dep', departureDate);
    url.searchParams.set('ret', returnDate);
    navigator.clipboard.writeText(url.toString()).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      console.log('Share URL:', url.toString());
    });
  }

  function handleToggleStar() {
    onToggleStar({ departureDate, returnDate, cellData });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Trip details"
    >
      <div className={clsx(
        'relative w-full max-w-2xl max-h-[90vh] overflow-y-auto',
        'bg-white dark:bg-gray-900 rounded-2xl shadow-2xl',
        'animate-scale-in',
      )}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
              {destCity} &bull; {formatDate(departureDate, 'short')}–{formatDate(returnDate, 'short')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {nights} nights · {(searchParams?.adults || 2) + (searchParams?.children || 0)} travellers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStar}
              aria-label={isStarred ? 'Remove from comparison' : 'Add to comparison'}
              className={clsx(
                'star-btn p-2 rounded-xl border transition-colors',
                isStarred
                  ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/30 text-amber-500'
                  : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-amber-500 hover:border-amber-300',
              )}
            >
              {isStarred ? <Star size={18} fill="currentColor" /> : <Star size={18} />}
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Cost summary bar */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white">
            <p className="text-sm font-medium opacity-80 mb-3">Total trip cost</p>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-extrabold">€{totalCost.toLocaleString()}</span>
              <span className="text-sm opacity-70 mb-1">for all travellers</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/10 rounded-xl p-2">
                <p className="text-xs opacity-70">Outbound</p>
                <p className="font-bold text-lg">€{outboundPrice}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <p className="text-xs opacity-70">Return</p>
                <p className="font-bold text-lg">€{inboundPrice}</p>
              </div>
              <div className="bg-white/10 rounded-xl p-2">
                <p className="text-xs opacity-70">Hotel ({nights}n)</p>
                <p className="font-bold text-lg">€{cheapestHotelCost}</p>
              </div>
            </div>
          </div>

          {/* Anxiety Analysis Report */}
          {anxietyReport && (
            <AnxietyReport anxietyData={anxietyReport} isLoading={loadingAnxiety} />
          )}

          {/* Outbound flight */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Outbound Flight</h3>
            <FlightCard
              flight={outbound}
              label="Outbound"
              origin={originCode}
              destination={destCity}
            />
          </div>

          {/* Return flight */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Return Flight</h3>
            <FlightCard
              flight={inbound}
              label="Return"
              origin={destCity}
              destination={originCode}
            />
          </div>

          {/* Hotels */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Hotel Options</h3>
            <div className="space-y-3">
              {topHotels.map(hotel => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  nights={nights}
                  destination={destCity}
                  departureDate={departureDate}
                  returnDate={returnDate}
                />
              ))}
            </div>
          </div>

          {/* Tradeoff hint */}
          {cheaperFlight && savings > 0 && (
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
              <TrendingDown size={18} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                  💡 Save €{savings} by flying at {cheaperFlight.departureTime} instead
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                  {cheaperFlight.airline} {cheaperFlight.flightNumber} departs at {cheaperFlight.departureTime} for €{cheaperFlight.basePrice}pp
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-3">
          <a
            href={`https://www.kiwi.com/deep?from=${originCode}&to=${destination}&departure=${formatDateForKiwi(departureDate)}&return=${formatDateForKiwi(returnDate)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm transition-all shadow hover:shadow-lg"
          >
            ✈️ Book on Kiwi
            <ExternalLink size={14} />
          </a>
          <button
            onClick={handleToggleStar}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all',
              isStarred
                ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 text-amber-600 dark:text-amber-400'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-300 hover:text-amber-500',
            )}
          >
            <Star size={15} fill={isStarred ? 'currentColor' : 'none'} />
            {isStarred ? 'Remove from comparison' : 'Add to comparison'}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm transition-all ml-auto"
          >
            <Share2 size={15} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
