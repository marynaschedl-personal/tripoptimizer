import React, { useState } from 'react';
import ChatInput from './ChatInput.jsx';
import SearchForm from './SearchForm.jsx';

export default function LandingPage({ onSearch, loading, theme, onToggleTheme, onViewTimeline }) {
  const [showQuickSearch, setShowQuickSearch] = useState(false);

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

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PRIMARY FEATURE: TRIP ASSISTANT */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="w-full max-w-4xl mb-20">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/70 text-sm font-medium mb-8 mx-auto">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
            AI-Powered Trip Planning
          </div>

          {/* Main Hero Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6 text-center">
            Meet{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #a5b4fc, #e879f9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Trip Assistant
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl mb-12 max-w-2xl leading-relaxed text-center mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Your personal AI travel consultant. Plan perfect itineraries, detect conflicts, optimize for fatigue, and handle family dynamics—all before you book.
          </p>

          {/* Trip Assistant CTA Button */}
          <div className="flex justify-center mb-12">
            <button
              onClick={onViewTimeline}
              className="px-8 py-4 rounded-xl text-lg font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #a5b4fc, #e879f9)' }}
            >
              🎬 Watch Trip Assistant in Action
            </button>
          </div>

          {/* Trip Assistant Feature Bubbles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {/* Bubble 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors text-center">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="text-sm font-bold text-white">Smart Itineraries</h3>
            </div>

            {/* Bubble 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <h3 className="text-sm font-bold text-white">Conflict Detection</h3>
            </div>

            {/* Bubble 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors text-center">
              <div className="text-3xl mb-2">😴</div>
              <h3 className="text-sm font-bold text-white">Fatigue Analysis</h3>
            </div>

            {/* Bubble 4 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors text-center">
              <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
              <h3 className="text-sm font-bold text-white">Family Mode</h3>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECONDARY FEATURE: QUICK FLIGHT/HOTEL SEARCH */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="w-full border-t border-white/20 pt-16 mb-16">
          <div className="max-w-4xl mx-auto">
            {/* Section Title */}
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
                Quick Search: Find Flights & Hotels
              </h2>
              <p className="text-center text-white/60 mb-8">
                Just want to search? Use natural language or traditional form. (Trip Assistant brings everything together later.)
              </p>

              {/* Search Mode Toggle */}
              <div className="flex justify-center mb-8">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowQuickSearch(false)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      !showQuickSearch
                        ? 'bg-white text-indigo-600'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    💬 Natural Language
                  </button>
                  <button
                    onClick={() => setShowQuickSearch(true)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      showQuickSearch
                        ? 'bg-white text-indigo-600'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    📋 Traditional Form
                  </button>
                </div>
              </div>

              {/* Search Input */}
              <div className="w-full max-w-2xl mx-auto">
                {!showQuickSearch ? (
                  <ChatInput onSearchParsed={onSearch} loading={loading} />
                ) : (
                  <SearchForm onSearch={onSearch} loading={loading} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HOW TRIP OPTIMIZER WORKS */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="w-full max-w-5xl mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How Trip Optimizer Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4 font-bold text-indigo-400">1️⃣</div>
              <h3 className="text-xl font-bold text-white mb-3">Search & Explore</h3>
              <p className="text-white/60 text-sm">
                Search flights & hotels with natural language or traditional form. See every price combination in our visual heat map.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4 font-bold text-indigo-400">2️⃣</div>
              <h3 className="text-xl font-bold text-white mb-3">Get Trip Plan</h3>
              <p className="text-white/60 text-sm">
                Trip Assistant takes your search results and creates a complete itinerary. Every detail coordinated, every risk identified.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4 font-bold text-indigo-400">3️⃣</div>
              <h3 className="text-xl font-bold text-white mb-3">Review & Book</h3>
              <p className="text-white/60 text-sm">
                Review Trip Assistant's analysis, fix any issues it flags, then book everything in one click with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WHY TRIP ASSISTANT SECTION */}
        {/* ═══════════════════════════════════════════════════════════════ */}

        <div className="w-full max-w-5xl mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Trip Assistant?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Benefit 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4">😌</div>
              <h3 className="text-lg font-bold text-white mb-2">Less Planning Stress</h3>
              <p className="text-white/60 text-sm">
                Stop manually coordinating flights, hotels, and activities. Let AI handle the complexity.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Catch Problems Early</h3>
              <p className="text-white/60 text-sm">
                Discover booking conflicts, logistical issues, and timing problems before you're committed.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Prices</h3>
              <p className="text-white/60 text-sm">
                Every search powered by live Kiwi.com prices. No guessing, no outdated data.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-lg font-bold text-white mb-2">Perfect Every Time</h3>
              <p className="text-white/60 text-sm">
                From solo adventures to family trips, Trip Assistant adapts to your needs.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {[
            { icon: '🤖', text: 'AI Planning' },
            { icon: '✈️', text: 'Real Prices' },
            { icon: '🏨', text: 'Hotel Matching' },
            { icon: '⚠️', text: 'Conflict Detection' },
          ].map(({ icon, text }) => (
            <span
              key={text}
              className="px-4 py-2 rounded-full text-sm font-medium"
              style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)' }}
            >
              {icon} {text}
            </span>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mb-8">
          <button
            onClick={onViewTimeline}
            className="px-8 py-4 rounded-xl text-lg font-semibold text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
          >
            ✨ See Trip Assistant Demo
          </button>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/40">
          Trip Assistant + Real-time Search = Perfect Trips · Free to use · No account required
        </p>
      </div>
    </div>
  );
}
