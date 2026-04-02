import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DESTINATION_CITIES, ORIGIN_CITIES } from '../data/mockData.js';
import CityDropdown from './CityDropdown.jsx';

export default function LandingPage({ onSearch, loading, theme, onToggleTheme, onViewTimeline }) {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  function handleContinue() {
    if (!origin || !destination) {
      return;
    }
    navigate(`/search?origin=${origin}&destination=${destination}`);
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 45%, #24243e 100%)' }}
    >
      {/* Ambient orbs */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)', filter: 'blur(60px)', top: '-80px', left: '-80px' }}
      />
      <div
        className="absolute rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)', filter: 'blur(80px)', width: '600px', height: '600px', bottom: '-100px', right: '-100px' }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="airplane">✈️</span>
          <span className="text-xl font-extrabold text-white tracking-tight">TripOptimizer</span>
        </div>
        <button
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white text-center mb-3 leading-tight">
            Find Your Least Stressful Trip
          </h1>
          <p className="text-center text-white/60 mb-12 text-lg">In seconds. Not hours. Not days.</p>

          {/* Search card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CityDropdown
                  id="origin"
                  label="Flying from"
                  value={origin}
                  onChange={setOrigin}
                  cities={ORIGIN_CITIES}
                  placeholder="London, Frankfurt…"
                />
                <CityDropdown
                  id="destination"
                  label="Flying to"
                  value={destination}
                  onChange={setDestination}
                  cities={DESTINATION_CITIES}
                  placeholder="Barcelona, Paris…"
                />
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={!origin || !destination}
              className="w-full mt-6 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
            >
              Plan my trip →
            </button>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-white/50 text-sm mb-4">
              Powered by real prices · Your stress levels matter
            </p>
            <button
              onClick={onViewTimeline}
              className="text-white/60 hover:text-white/80 text-sm font-semibold transition-colors"
            >
              ✨ See Trip Assistant demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
