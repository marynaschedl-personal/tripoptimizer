import React from 'react';
import { Plus, Minus } from 'lucide-react';

export default function CounterInput({ label, value, onChange, min, max }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-gray-100">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
