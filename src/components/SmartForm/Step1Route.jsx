import React, { useState } from 'react';
import clsx from 'clsx';
import { DESTINATION_CITIES, ORIGIN_CITIES } from '../../data/mockData.js';
import CityDropdown from '../CityDropdown.jsx';

function calculateEndDate(start, nights) {
  if (!start || !nights) return '';
  const date = new Date(start + 'T00:00:00');
  date.setDate(date.getDate() + parseInt(nights));
  return date.toISOString().slice(0, 10);
}

export default function Step1Route({ initialValues, onNext }) {
  const today = new Date().toISOString().slice(0, 10);

  const [origin, setOrigin] = useState(initialValues?.origin || '');
  const [destination, setDestination] = useState(initialValues?.destination || '');
  const [tripLengthPreset, setTripLengthPreset] = useState(initialValues?.tripLengthPreset || 7);
  const [startDate, setStartDate] = useState(initialValues?.startDate || '');
  const [endDate, setEndDate] = useState(initialValues?.endDate || '');
  const [errors, setErrors] = useState({});

  function handleTripLengthChange(preset) {
    setTripLengthPreset(preset);
    if (preset !== 'custom' && startDate) {
      const calculated = calculateEndDate(startDate, preset);
      setEndDate(calculated);
    }
  }

  function handleStartDateChange(e) {
    const newDate = e.target.value;
    setStartDate(newDate);
    if (tripLengthPreset !== 'custom' && newDate) {
      const calculated = calculateEndDate(newDate, tripLengthPreset);
      setEndDate(calculated);
    }
  }

  function validate() {
    const newErrors = {};
    if (!origin) newErrors.origin = 'Please select a departure city';
    if (!destination) newErrors.destination = 'Please select a destination';
    if (!startDate) newErrors.startDate = 'Select a departure date';
    if (!endDate) newErrors.endDate = 'Select a return date';
    if (startDate && endDate && endDate <= startDate) {
      newErrors.endDate = 'Return date must be after departure date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onNext({
      origin,
      destination,
      startDate,
      endDate,
      tripLengthPreset,
    });
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-full px-4 py-1.5 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8">
        <span className="w-5 h-5 flex items-center justify-center bg-indigo-600 text-white rounded-full text-xs font-bold">1</span>
        Step 1 of 2
      </div>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Where &amp; When?</h2>

      {/* Route */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <CityDropdown
              id="origin"
              label="Flying from"
              value={origin}
              onChange={setOrigin}
              cities={ORIGIN_CITIES}
              placeholder="London, Frankfurt…"
            />
            {errors.origin && <p className="mt-1 text-xs text-red-500">{errors.origin}</p>}
          </div>
          <div>
            <CityDropdown
              id="destination"
              label="Flying to"
              value={destination}
              onChange={setDestination}
              cities={DESTINATION_CITIES}
              placeholder="Barcelona, Paris…"
            />
            {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination}</p>}
          </div>
        </div>
      </div>

      {/* Trip length presets */}
      <div className="mb-8">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
          Trip length
        </label>
        <div className="flex flex-wrap gap-2">
          {[3, 5, 7, 10, 14].map(nights => (
            <button
              key={nights}
              onClick={() => handleTripLengthChange(nights)}
              className={clsx(
                'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                tripLengthPreset === nights
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {nights} nights
            </button>
          ))}
          <button
            onClick={() => handleTripLengthChange('custom')}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
              tripLengthPreset === 'custom'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div>
          <label htmlFor="startDate" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Departure date
          </label>
          <input
            id="startDate"
            type="date"
            min={today}
            value={startDate}
            onChange={handleStartDateChange}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border text-sm font-medium',
              'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
              'border-gray-200 dark:border-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              'transition-all duration-150'
            )}
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Return date {tripLengthPreset !== 'custom' && startDate && '(auto)'}
          </label>
          <input
            id="endDate"
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={e => {
              setEndDate(e.target.value);
              setTripLengthPreset('custom');
            }}
            disabled={tripLengthPreset !== 'custom' && !startDate}
            className={clsx(
              'w-full px-4 py-3 rounded-xl border text-sm font-medium',
              'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
              'border-gray-200 dark:border-gray-700',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              'transition-all duration-150',
              tripLengthPreset !== 'custom' && !startDate && 'opacity-50 cursor-not-allowed'
            )}
          />
          {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
      >
        Continue →
      </button>
    </div>
  );
}
