import React from 'react';
import { X, Star, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { formatDate } from '../data/mockData.js';

function ComboCard({ combo, isLowest, diff, onRemove, searchParams }) {
  const { departureDate, returnDate, cellData } = combo;
  const nights = cellData?.nights || 0;
  const cheapestHotel = cellData?.cheapestHotel;
  const destination = searchParams?.destination || 'Destination';

  const bookingUrl = `https://www.booking.com/search.html?ss=${encodeURIComponent(destination)}&checkin=${departureDate}&checkout=${returnDate}`;

  return (
    <div className={clsx(
      'min-w-[200px] flex-1 rounded-2xl border p-4 space-y-3 transition-all duration-150 flex flex-col',
      isLowest
        ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 shadow-green-100 dark:shadow-green-900/20 shadow-md'
        : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800',
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          {isLowest && (
            <span className="inline-block bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 uppercase tracking-wide">
              Cheapest
            </span>
          )}
          <p className="text-xs font-bold text-gray-800 dark:text-gray-100">
            {formatDate(departureDate, 'short')} → {formatDate(returnDate, 'short')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{nights} nights</p>
        </div>
        <button
          onClick={() => onRemove(combo)}
          aria-label="Remove from comparison"
          className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      {/* Total cost */}
      <div>
        <p className={clsx(
          'text-2xl font-extrabold',
          isLowest ? 'text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-100',
        )}>
          €{cellData?.totalCost?.toLocaleString() || '—'}
        </p>
        {diff !== null && diff > 0 && (
          <p className="text-xs font-bold text-red-500 mt-0.5">+€{diff} more</p>
        )}
      </div>

      {/* Outbound flight */}
      {cellData?.outbound && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 space-y-0.5">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Outbound</p>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{cellData.outbound.airline}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{cellData.outbound.departureTime} → {cellData.outbound.arrivalTime}</p>
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">€{cellData.outboundPrice}</p>
        </div>
      )}

      {/* Return flight */}
      {cellData?.inbound && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 space-y-0.5">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Return</p>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{cellData.inbound.airline}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{cellData.inbound.departureTime} → {cellData.inbound.arrivalTime}</p>
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">€{cellData.inboundPrice}</p>
        </div>
      )}

      {/* Best hotel */}
      {cheapestHotel && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 space-y-0.5">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Best Hotel</p>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{cheapestHotel.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{'★'.repeat(cheapestHotel.stars)} · €{cheapestHotel.adjustedPricePerNight}/night</p>
        </div>
      )}

      {/* Book all */}
      <div className="mt-auto pt-2">
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            'flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl text-xs font-bold transition-all',
            isLowest
              ? 'bg-green-600 hover:bg-green-700 text-white shadow'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow',
          )}
          onClick={() => console.log('Book All clicked:', { departureDate, returnDate, total: cellData?.totalCost })}
        >
          Book All <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}

export default function ComparisonPanel({ isOpen, onClose, starredCombos, onRemove, searchParams }) {
  if (!isOpen) return null;

  const lowestCost = starredCombos.length > 0
    ? Math.min(...starredCombos.map(c => c.cellData?.totalCost || Infinity))
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={clsx(
          'fixed right-0 top-0 bottom-0 z-50 w-full sm:w-auto',
          'bg-white dark:bg-gray-900 shadow-2xl',
          'flex flex-col',
          'animate-slide-in-right',
        )}
        role="complementary"
        aria-label="Comparison panel"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-amber-500" fill="currentColor" />
            <h2 className="font-bold text-gray-900 dark:text-gray-100">Compare Trips</h2>
            {starredCombos.length > 0 && (
              <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full">
                {starredCombos.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close comparison panel"
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-auto p-4">
          {starredCombos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12 space-y-4">
              <span className="text-5xl">⭐</span>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                Star combinations in the heat map to compare them here ⭐
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Right-click (or long-press) any cell in the heat map to add it to your comparison
              </p>
            </div>
          ) : (
            <div className="flex gap-3 min-w-max sm:min-w-0 flex-wrap sm:flex-nowrap">
              {starredCombos.slice(0, 5).map((combo, i) => {
                const isLowest = combo.cellData?.totalCost === lowestCost;
                const diff = combo.cellData?.totalCost != null && lowestCost != null
                  ? combo.cellData.totalCost - lowestCost
                  : null;
                return (
                  <ComboCard
                    key={`${combo.departureDate}__${combo.returnDate}`}
                    combo={combo}
                    isLowest={isLowest}
                    diff={diff}
                    onRemove={onRemove}
                    searchParams={searchParams}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Footer note */}
        {starredCombos.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500 text-center shrink-0">
            Showing {Math.min(starredCombos.length, 5)} of {starredCombos.length} starred trips
          </div>
        )}
      </div>
    </>
  );
}
