import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header.jsx';
import SearchForm from './components/SearchForm.jsx';
import LandingPage from './components/LandingPage.jsx';
import HeatMap from './components/HeatMap.jsx';
import DetailModal from './components/DetailModal.jsx';
import TripAssistantDemo from './pages/TripAssistantDemo.jsx';
import SearchTree from './components/SearchTree.jsx';
import { useSearchTree } from './hooks/useSearchTree.js';
import { DESTINATION_CITIES, ORIGIN_CITIES } from './data/mockData.js';

// ─── Results Page ─────────────────────────────────────────────────────────────
function ResultsPage({ searchParams, onNewSearch, onSelectCell, starredCombos, onToggleStar, theme, onToggleTheme, onSelectSearch }) {
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

      <div className="flex">
        {/* Search Tree Sidebar */}
        <SearchTree onSelectSearch={onSelectSearch} isOpen={true} />

        {/* Main Content */}
        <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8">
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
  const { addSearch } = useSearchTree();

  // Sync dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('to-theme', theme); } catch {}
  }, [theme]);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleSearch = useCallback((params) => {
    setLoading(true);
    addSearch(params);
    setTimeout(() => {
      setSearchParams(params);
      setLoading(false);
      setView('results');
    }, 700);
  }, [addSearch]);

  const handleSelectSearch = useCallback((params) => {
    handleSearch(params);
  }, [handleSearch]);

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
          onSelectSearch={handleSelectSearch}
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
