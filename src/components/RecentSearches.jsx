import React from 'react';
import { Clock, X } from 'lucide-react';
import clsx from 'clsx';
import { ORIGIN_CITIES, DESTINATION_CITIES, formatDate } from '../data/mockData.js';

function formatSearch(search) {
  const origin = ORIGIN_CITIES.find(c => c.code === search.origin);
  const dest = DESTINATION_CITIES.find(c => c.code === search.destination);
  const originLabel = origin ? `${origin.flag} ${origin.code}` : search.origin;
  const destLabel = dest ? `${dest.flag} ${dest.name}` : search.destination;
  const dateRange = search.startDate && search.endDate
    ? `${formatDate(search.startDate, 'short')}–${formatDate(search.endDate, 'short')}`
    : '';
  const travelers = ((search.adults || 2) + (search.children || 0));
  const travelersLabel = travelers === 1 ? '1 adult' : `${travelers} travellers`;
  return `${originLabel} → ${destLabel}${dateRange ? ' · ' + dateRange : ''} · ${travelersLabel}`;
}

export default function RecentSearches({ searches, onSelect, onClear }) {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
        Recent searches
      </p>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {searches.map((search, i) => (
          <button
            key={i}
            onClick={() => onSelect(search)}
            className={clsx(
              'flex items-center gap-1.5 shrink-0',
              'px-3 py-1.5 rounded-full',
              'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
              'text-xs font-medium text-gray-700 dark:text-gray-300',
              'hover:border-indigo-300 dark:hover:border-indigo-600',
              'hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
              'hover:text-indigo-700 dark:hover:text-indigo-300',
              'transition-all duration-150 shadow-sm',
            )}
          >
            <Clock size={11} className="text-gray-400 shrink-0" />
            <span className="truncate max-w-[220px]">{formatSearch(search)}</span>
          </button>
        ))}
        <button
          onClick={onClear}
          aria-label="Clear recent searches"
          className={clsx(
            'flex items-center gap-1 shrink-0',
            'px-3 py-1.5 rounded-full',
            'bg-transparent border border-dashed border-gray-200 dark:border-gray-700',
            'text-xs font-medium text-gray-400 dark:text-gray-500',
            'hover:border-red-300 dark:hover:border-red-700',
            'hover:text-red-500 dark:hover:text-red-400',
            'transition-all duration-150',
          )}
        >
          <X size={11} />
          Clear
        </button>
      </div>
    </div>
  );
}
