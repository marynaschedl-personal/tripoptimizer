import React, { useState } from 'react';
import ChatInput from './ChatInput.jsx';
import SearchForm from './SearchForm.jsx';
import clsx from 'clsx';

export default function LandingPage({ onSearch, loading, theme, onToggleTheme, onViewTimeline }) {
  const [showTraditionalForm, setShowTraditionalForm] = useState(false);

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
        {/* Hero Section with Trip Assistant */}
        <div className="w-full max-w-3xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/70 text-sm font-medium mb-8 mx-auto">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
            Powered by AI — Real-time flight & hotel prices
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-4 text-center">
            Describe Your{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #a5b4fc, #e879f9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Perfect Trip
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl mb-12 max-w-2xl leading-relaxed text-center mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Just tell Trip Assistant what you want in natural language. We'll find the best flight & hotel combinations across flexible dates in real-time.
          </p>

          {/* Trip Assistant Hero */}
          <div className="w-full mb-8">
            {!showTraditionalForm ? (
              <ChatInput onSearchParsed={onSearch} loading={loading} />
            ) : (
              <SearchForm onSearch={onSearch} loading={loading} />
            )}
          </div>

          {/* Toggle Button */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowTraditionalForm(!showTraditionalForm)}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              {showTraditionalForm ? '✓ Using Traditional Form' : 'Prefer Traditional Form?'}
            </button>
          </div>
        </div>

        {/* Secondary Features Section */}
        <div className="w-full border-t border-white/10 mt-12 pt-12">
          <h2 className="text-center text-white/50 text-sm font-semibold uppercase tracking-wider mb-8">Secondary Features</h2>

          {/* Trip Assistant Demo Button */}
          <div className="flex justify-center mb-16">
            <button
              onClick={onViewTimeline}
              className="px-8 py-3 rounded-full text-sm font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all"
            >
              ⏱️ See Trip Assistant in Action
            </button>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="w-full max-w-5xl mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-white mb-3">Describe</h3>
              <p className="text-white/60 text-sm">
                Tell Trip Assistant exactly what you want: destination, dates, budget, travelers. Natural language, no forms to fill.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-3">Explore</h3>
              <p className="text-white/60 text-sm">
                Explore every flight + hotel combination across flexible dates in our visual heat map. See prices update in real-time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">Book</h3>
              <p className="text-white/60 text-sm">
                Find your perfect trip. One-click booking to Kiwi.com with your exact dates, flights, and hotel selected.
              </p>
            </div>
          </div>
        </div>

        {/* Why Use Trip Assistant Section */}
        <div className="w-full max-w-5xl mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Use Trip Assistant?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">Natural Language</h3>
              <p className="text-white/60 text-sm">
                No need to navigate dropdowns. Just describe your trip like you'd tell a friend.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-lg font-bold text-white mb-2">Explore Branches</h3>
              <p className="text-white/60 text-sm">
                Modify previous searches and track variations. Build up a tree of trip ideas.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Prices</h3>
              <p className="text-white/60 text-sm">
                Live prices from Kiwi.com across all date combinations. No outdated data.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Planning</h3>
              <p className="text-white/60 text-sm">
                Get trip assistant help with itineraries, fatigue analysis, and conflict detection.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {[
            { icon: '🗓️', text: 'Flexible dates' },
            { icon: '✈️', text: 'Real prices' },
            { icon: '🏨', text: 'Hotel options' },
            { icon: '💬', text: 'Natural input' },
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

        {/* Footer note */}
        <p className="text-center text-xs text-white/40">
          Free to use · No account required · Works on desktop and mobile
        </p>
      </div>
    </div>
  );
}
