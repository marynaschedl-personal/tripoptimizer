import React, { useState } from 'react';
import CounterInput from '../CounterInput.jsx';

export default function Step2Preferences({ step1Data, onBack, onSubmit }) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budgetVsComfort, setBudgetVsComfort] = useState(50);
  const [earlyMorningOk, setEarlyMorningOk] = useState(50);
  const [packedVsRelaxed, setPackedVsRelaxed] = useState(50);

  function handleSubmit() {
    onSubmit({
      ...step1Data,
      adults,
      children,
      budgetVsComfort,
      earlyMorningOk,
      packedVsRelaxed,
    });
  }

  function handleSkip() {
    onSubmit({
      ...step1Data,
      adults,
      children,
      budgetVsComfort: 50,
      earlyMorningOk: 50,
      packedVsRelaxed: 50,
    });
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-full px-4 py-1.5 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8">
        <span className="w-5 h-5 flex items-center justify-center bg-indigo-600 text-white rounded-full text-xs font-bold">2</span>
        Step 2 of 2
      </div>

      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Tell us about your trip</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">These help us find the least stressful options for you</p>

      {/* Travelers */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Who's traveling?</h3>
        <div className="flex items-end gap-6 flex-wrap">
          <CounterInput label="Adults" value={adults} onChange={setAdults} min={1} max={8} />
          <CounterInput label="Children" value={children} onChange={setChildren} min={0} max={6} />
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-8 mb-10">
        {/* Budget vs Comfort */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">Comfort vs. Budget</label>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {budgetVsComfort < 25 ? '💰 Budget' : budgetVsComfort < 50 ? '💰 Mostly budget' : budgetVsComfort < 75 ? '🤝 Balanced' : '✨ Comfort'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={budgetVsComfort}
            onChange={e => setBudgetVsComfort(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>I'll fly cheap if I have to</span>
            <span>Worth paying more</span>
          </div>
        </div>

        {/* Early Morning */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">Flight Timing</label>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {earlyMorningOk < 25 ? '🌙 Need flexibility' : earlyMorningOk < 50 ? '🌙 Prefer flexibility' : earlyMorningOk < 75 ? '⏰ Either way' : '🌅 Love early flights'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={earlyMorningOk}
            onChange={e => setEarlyMorningOk(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Need flexibility with times</span>
            <span>I love early morning flights</span>
          </div>
        </div>

        {/* Paced vs Relaxed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">Trip Pace</label>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              {packedVsRelaxed < 25 ? '🏖️ Very relaxed' : packedVsRelaxed < 50 ? '🏖️ Mostly relaxed' : packedVsRelaxed < 75 ? '⚡ Balanced' : '🏃 Packed schedule'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={packedVsRelaxed}
            onChange={e => setPackedVsRelaxed(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Chill, minimal activity</span>
            <span>Pack the days with activities</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={handleSubmit}
          className="w-full px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
        >
          Search flights &amp; hotels
        </button>
        <button
          onClick={handleSkip}
          className="w-full px-6 py-3 rounded-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          Skip preferences
        </button>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="mt-6 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        ← Back to route
      </button>
    </div>
  );
}
