import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export default function CityDropdown({ label, value, onChange, cities, placeholder, id }) {
  const [query, setQuery] = useState(value ? (cities.find(c => c.code === value)?.name || '') : '');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!value) setQuery('');
    else {
      const found = cities.find(c => c.code === value);
      if (found) setQuery(found.name);
    }
  }, [value, cities]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = query.trim()
    ? cities.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.code.toLowerCase().includes(query.toLowerCase()) ||
        c.country.toLowerCase().includes(query.toLowerCase())
      )
    : cities;

  function selectCity(city) {
    setQuery(city.name);
    onChange(city.code);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        value={query}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={e => {
          setQuery(e.target.value);
          onChange('');
          setOpen(true);
        }}
        className={clsx(
          'w-full px-4 py-3 rounded-xl border text-sm font-medium',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
          'border-gray-200 dark:border-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'transition-all duration-150',
        )}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl animate-fade-in">
          {filtered.map(city => (
            <li
              key={city.code}
              onClick={() => selectCity(city)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            >
              <span className="text-lg">{city.flag}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{city.name}</p>
                <p className="text-xs text-gray-400">{city.country} · {city.code}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
