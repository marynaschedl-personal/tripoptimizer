import React, { useState } from 'react';
import { Search, Loader2, SlidersHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { DESTINATION_CITIES, ORIGIN_CITIES } from '../data/mockData.js';
import CityDropdown from './CityDropdown.jsx';
import CounterInput from './CounterInput.jsx';

export default function SearchForm({ onSearch, initialValues, loading }) {
  const today = new Date().toISOString().slice(0, 10);

  const [origin, setOrigin] = useState(initialValues?.origin || '');
  const [destination, setDestination] = useState(initialValues?.destination || '');
  const [tripLength, setTripLength] = useState('7'); // Default to 7 nights
  const [startDate, setStartDate] = useState(initialValues?.startDate || '');
  const [endDate, setEndDate] = useState(initialValues?.endDate || '');
  const [adults, setAdults] = useState(initialValues?.adults || 2);
  const [children, setChildren] = useState(initialValues?.children || 0);
  const [budgetMin, setBudgetMin] = useState(initialValues?.budgetMin || '');
  const [budgetMax, setBudgetMax] = useState(initialValues?.budgetMax || '');
  const [showBudget, setShowBudget] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate end date when trip length changes
  function calculateEndDate(start, nights) {
    if (!start || !nights) return '';
    const date = new Date(start + 'T00:00:00');
    date.setDate(date.getDate() + parseInt(nights));
    return date.toISOString().slice(0, 10);
  }

  // Handle trip length change
  function handleTripLengthChange(e) {
    const nights = e.target.value;
    setTripLength(nights);
    if (nights !== 'custom' && startDate) {
      const calculated = calculateEndDate(startDate, nights);
      setEndDate(calculated);
    }
  }

  // Handle start date change
  function handleStartDateChange(e) {
    const newDate = e.target.value;
    setStartDate(newDate);
    if (tripLength !== 'custom' && newDate) {
      const calculated = calculateEndDate(newDate, tripLength);
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

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSearch({ origin, destination, startDate, endDate, adults, children, budgetMin, budgetMax });
  }

  const originCity = ORIGIN_CITIES.find(c => c.code === origin);
  const destCity = DESTINATION_CITIES.find(c => c.code === destination);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/50 bg-white dark:bg-gray-900 overflow-visible">
        <div className="p-6 space-y-5">
          {/* Route row */}
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

          {/* Trip length row */}
          <div>
            <label htmlFor="tripLength" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
              Trip length
            </label>
            <select
              id="tripLength"
              value={tripLength}
              onChange={handleTripLengthChange}
              className={clsx(
                'w-full px-4 py-3 rounded-xl border text-sm font-medium',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                'border-gray-200 dark:border-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                'transition-all duration-150',
                'cursor-pointer',
              )}
            >
              <option value="3">Weekend (3 nights)</option>
              <option value="5">Short trip (5 nights)</option>
              <option value="7">One week (7 nights)</option>
              <option value="10">10 nights</option>
              <option value="14">Two weeks (14 nights)</option>
              <option value="custom">Custom dates</option>
            </select>
          </div>

          {/* Date row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  'transition-all duration-150',
                )}
              />
              {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
            </div>
            <div>
              <label htmlFor="endDate" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                Return date {tripLength !== 'custom' && startDate && `(auto)`}
              </label>
              <input
                id="endDate"
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={e => {
                  setEndDate(e.target.value);
                  setTripLength('custom'); // Switch to custom when manually edited
                }}
                className={clsx(
                  'w-full px-4 py-3 rounded-xl border text-sm font-medium',
                  'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                  'border-gray-200 dark:border-gray-700',
                  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                  'transition-all duration-150',
                )}
              />
              {errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          {/* Travelers row */}
          <div className="flex items-end gap-6 flex-wrap">
            <CounterInput label="Adults" value={adults} onChange={setAdults} min={1} max={8} />
            <CounterInput label="Children" value={children} onChange={setChildren} min={0} max={6} />
            <div className="ml-auto">
              <button
                type="button"
                onClick={() => setShowBudget(v => !v)}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
              >
                <SlidersHorizontal size={14} />
                {showBudget ? 'Hide budget filter' : 'Add budget filter'}
              </button>
            </div>
          </div>

          {/* Budget filter */}
          {showBudget && (
            <div className="grid grid-cols-2 gap-4 pt-2 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  Min budget (€)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 300"
                  value={budgetMin}
                  onChange={e => setBudgetMin(e.target.value)}
                  className={clsx(
                    'w-full px-4 py-3 rounded-xl border text-sm font-medium',
                    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                    'border-gray-200 dark:border-gray-700',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                    'placeholder:text-gray-400',
                  )}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
                  Max budget (€)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 1200"
                  value={budgetMax}
                  onChange={e => setBudgetMax(e.target.value)}
                  className={clsx(
                    'w-full px-4 py-3 rounded-xl border text-sm font-medium',
                    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                    'border-gray-200 dark:border-gray-700',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                    'placeholder:text-gray-400',
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="px-6 pb-6">
          <button
            type="submit"
            disabled={loading}
            className={clsx(
              'w-full flex items-center justify-center gap-2',
              'px-6 py-4 rounded-xl font-bold text-base text-white',
              'bg-gradient-to-r from-indigo-500 to-purple-600',
              'hover:from-indigo-600 hover:to-purple-700',
              'focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              'shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30',
              'transition-all duration-200',
            )}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Searching all combinations…
              </>
            ) : (
              <>
                <Search size={18} />
                Search Flights + Hotels
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
