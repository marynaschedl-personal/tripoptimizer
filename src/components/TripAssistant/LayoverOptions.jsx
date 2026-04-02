import React, { useState } from 'react';
import { Armchair, Coffee, MapPin } from 'lucide-react';
import clsx from 'clsx';

function getOptionIcon(type) {
  const icons = {
    lounge: Armchair,
    dining: Coffee,
    activity: MapPin,
  };
  return icons[type] || MapPin;
}

export default function LayoverOptions({ options = [], duration }) {
  const [selected, setSelected] = useState(null);

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        Layover Ideas ({duration}min)
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option, idx) => {
          const Icon = getOptionIcon(option.type);
          const isSelected = selected === idx;

          return (
            <button
              key={idx}
              onClick={() => setSelected(isSelected ? null : idx)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                isSelected
                  ? 'bg-teal-500 text-white dark:bg-teal-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              )}
            >
              <Icon size={14} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
