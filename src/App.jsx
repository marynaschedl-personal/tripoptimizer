import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header.jsx';
import SearchForm from './components/SearchForm.jsx';
import HeatMap from './components/HeatMap.jsx';
import DetailModal from './components/DetailModal.jsx';
import TripAssistantDemo from './pages/TripAssistantDemo.jsx';
import { DESTINATION_CITIES, ORIGIN_CITIES } from './data/mockData.js';

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ onSearch, loading, theme, onToggleTheme, onViewTimeline }) {
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

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-white/70 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
          Live mock data — Phase 2 connects real APIs
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-5 max-w-4xl">
          Find Your{' '}
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

        <p className="text-lg sm:text-xl mb-10 max-w-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Compare <strong style={{ color: 'rgba(255,255,255,0.8)' }}>every</strong> flight + hotel combination
          across flexible dates in one visual heat map.
        </p>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {[
            { icon: '🗓️', text: 'Flexible date range' },
            { icon: '✈️', text: '10 airlines' },
            { icon: '🏨', text: '15 hotel options' },
            { icon: '💰', text: 'Best price finder' },
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

        {/* Timeline Feature */}
        <div className="mb-8">
          <button
            onClick={onViewTimeline}
            className="px-6 py-2 rounded-full text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #a5b4fc, #e879f9)', border: 'none' }}
          >
            ⏱️ Try Trip Assistant (Demo)
          </button>
        </div>

        {/* Search card */}
        <div className="w-full max-w-2xl animate-slide-up">
          <SearchForm onSearch={onSearch} loading={loading} />
        </div>
      </div>
    </div>
  );
}

// ─── Results Page ─────────────────────────────────────────────────────────────
function ResultsPage({ searchParams, onNewSearch, onSelectCell, starredCombos, onToggleStar, theme, onToggleTheme }) {
  const destCity   = DESTINATION_CITIES.find(c => c.code === searchParams.destination);
  const originCity = ORIGIN_CITIES.find(c => c.code === searchParams.origin);
  const travelers  = (searchParams.adults || 2) + (searchParams.children || 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        starredCount={starredCombos.length}
        onOpenComparison={() => {}}
        onLogoClick={onNewSearch}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Search summary */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {originCity?.flag} {originCity?.name}
              <span className="text-gray-400 dark:text-gray-500 font-light mx-2">→</span>
              {destCity?.flag} {destCity?.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {searchParams.startDate} – {searchParams.endDate}
              {' · '}
              {travelers} traveller{travelers !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onNewSearch}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            ← Modify Search
          </button>
        </div>

        {/* Heat map card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <HeatMap
            searchParams={searchParams}
            onSelectCell={onSelectCell}
            starredCombos={starredCombos}
            onToggleStar={onToggleStar}
            minHotelStars={3}
            travelers={travelers}
          />
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Prices shown in EUR · Mock data for demo · Phase 2 connects real APIs
        </p>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('to-theme') || 'light'; } catch { return 'light'; }
  });
  const [view, setView] = useState('landing');
  const [searchParams, setSearchParams] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [starredCombos, setStarredCombos] = useState([]);

  // Sync dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('to-theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleSearch = useCallback((params) => {
    setLoading(true);
    setTimeout(() => {
      setSearchParams(params);
      setLoading(false);
      setView('results');
    }, 700);
  }, []);

  const handleViewTimeline = useCallback(() => {
    setView('timeline');
  }, []);

  const handleToggleStar = useCallback(({ departureDate, returnDate, cellData }) => {
    setStarredCombos(prev => {
      const key = `${departureDate}__${returnDate}`;
      const exists = prev.some(s => `${s.departureDate}__${s.returnDate}` === key);
      if (exists) return prev.filter(s => `${s.departureDate}__${s.returnDate}` !== key);
      return [...prev.slice(-4), { departureDate, returnDate, cellData }];
    });
  }, []);

  const isStarred = selectedCell
    ? starredCombos.some(
        s => s.departureDate === selectedCell.departureDate && s.returnDate === selectedCell.returnDate,
      )
    : false;

  return (
    <div className="font-sans">
      {view === 'landing' ? (
        <LandingPage
          onSearch={handleSearch}
          loading={loading}
          theme={theme}
          onToggleTheme={toggleTheme}
          onViewTimeline={handleViewTimeline}
        />
      ) : view === 'timeline' ? (
        <div>
          <Header
            theme={theme}
            onToggleTheme={toggleTheme}
            starredCount={0}
            onOpenComparison={() => {}}
            onLogoClick={() => setView('landing')}
          />
          <TripAssistantDemo />
          <div className="text-center py-4">
            <button
              onClick={() => setView('landing')}
              className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline"
            >
              ← Back to Search
            </button>
          </div>
        </div>
      ) : (
        <ResultsPage
          searchParams={searchParams}
          onNewSearch={() => setView('landing')}
          onSelectCell={setSelectedCell}
          starredCombos={starredCombos}
          onToggleStar={handleToggleStar}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      <DetailModal
        isOpen={!!selectedCell}
        onClose={() => setSelectedCell(null)}
        cellData={selectedCell?.cellData}
        searchParams={searchParams}
        onToggleStar={handleToggleStar}
        isStarred={isStarred}
      />
    </div>
  );
}
