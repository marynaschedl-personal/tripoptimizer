import React from 'react';
import clsx from 'clsx';

export default function FatigueBar({ cumulativeFatigue }) {
  const percentage = Math.min(100, cumulativeFatigue * 100);
  const isWarning = cumulativeFatigue > 0.5;
  const isDanger = cumulativeFatigue > 0.7;

  let barColor = 'bg-green-500';
  let labelColor = 'text-green-700 dark:text-green-300';

  if (isDanger) {
    barColor = 'bg-red-500';
    labelColor = 'text-red-700 dark:text-red-300';
  } else if (isWarning) {
    barColor = 'bg-amber-500';
    labelColor = 'text-amber-700 dark:text-amber-300';
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Fatigue Level
        </label>
        <span className={clsx('text-sm font-bold', labelColor)}>
          {(percentage).toFixed(0)}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={clsx('h-full transition-all duration-300 rounded-full', barColor)}
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          role="progressbar"
        />
      </div>
      {isDanger && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
          ⚠️ High fatigue — rest needed soon
        </p>
      )}
      {isWarning && !isDanger && (
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
          ⚠️ Moderate fatigue — consider breaks
        </p>
      )}
    </div>
  );
}
