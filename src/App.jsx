import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import clsx from 'clsx';
import Header from './components/Header.jsx';
import SearchForm from './components/SearchForm.jsx';
import LandingPage from './components/LandingPage.jsx';
import HeatMap from './components/HeatMap.jsx';
import DetailModal from './components/DetailModal.jsx';
import TripAssistantDemo from './pages/TripAssistantDemo.jsx';
import SearchTree from './components/SearchTree.jsx';
import StepForm from './components/SmartForm/StepForm.jsx';
import { useSearchTree } from './hooks/useSearchTree.js';
import { DESTINATION_CITIES, ORIGIN_CITIES, daysBetween } from './data/mockData.js';

// ─── Search Route (Multi-step form) ────────────────────────────────────────────
function SearchRoute({ theme, onToggleTheme, onSearch }) {
  return (
    <StepForm
      onSearch={onSearch}
      theme={theme}
      onToggleTheme={onToggleTheme}
    />
  );
}

// ─── Landing Page Route ────────────────────────────────────────────────────────
function LandingPageRoute({ theme, onToggleTheme, onSearch, onViewTimeline }) {
  return (
    <LandingPage
      onSearch={onSearch}
      theme={theme}
      onToggleTheme={onToggleTheme}
      onViewTimeline={onViewTimeline}
    />
  );
}

// ─── Timeline Route ────────────────────────────────────────────────────────────
function TimelineRoute({ theme, onToggleTheme }) {
  const navigate = useNavigate();

  return (
    <div>
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        starredCount={0}
        onOpenComparison={() => {}}
        onLogoClick={() => navigate('/')}
      />
      <TripAssistantDemo />
      <div className="text-center py-4">
        <button
          onClick={() => navigate('/')}
          className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline"
        >
          ← Back to Search
        </button>
      </div>
    </div>
  );
}

// ─── Results Page Route ────────────────────────────────────────────────────────
function ResultsPageRoute({
  starredCombos,
  onToggleStar,
  theme,
  onToggleTheme,
  onSelectSearch,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCell, setSelectedCell] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [sortMode, setSortMode] = useState('cheapest');

  // Parse URL parameters
  const searchParamsObj = {
    origin: searchParams.get('origin'),
    destination: searchParams.get('destination'),
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    adults: parseInt(searchParams.get('adults')) || 2,
    children: parseInt(searchParams.get('children')) || 0,
  };

  // Parse preference weights from URL
  const preferenceWeights = {};
  const budgetVsComfort = searchParams.get('budgetVsComfort');
  const earlyMorningOk = searchParams.get('earlyMorningOk');
  const packedVsRelaxed = searchParams.get('packedVsRelaxed');
  if (budgetVsComfort !== null) preferenceWeights.budgetVsComfort = parseInt(budgetVsComfort);
  if (earlyMorningOk !== null) preferenceWeights.earlyMorningOk = parseInt(earlyMorningOk);
  if (packedVsRelaxed !== null) preferenceWeights.packedVsRelaxed = parseInt(packedVsRelaxed);

  // Parse trip length preset and derive search nights
  const tripLengthPreset = searchParams.get('tripLengthPreset');
  const searchNights = tripLengthPreset && tripLengthPreset !== 'custom'
    ? parseInt(tripLengthPreset)
    : daysBetween(searchParamsObj.startDate, searchParamsObj.endDate);

  if (!searchParamsObj.origin || !searchParamsObj.destination || !searchParamsObj.startDate || !searchParamsObj.endDate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Invalid search parameters</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            ← Back to Search
          </button>
        </div>
      </div>
    );
  }

  const destCity = DESTINATION_CITIES.find(c => c.code === searchParamsObj.destination);
  const originCity = ORIGIN_CITIES.find(c => c.code === searchParamsObj.origin);
  const travelers = (searchParamsObj.adults || 2) + (searchParamsObj.children || 0);

  const isStarred = selectedCell
    ? starredCombos.some(
      s => s.departureDate === selectedCell.departureDate && s.returnDate === selectedCell.returnDate,
    )
    : false;

  const handleRecommendationFound = useCallback((rec) => {
    setRecommendation(rec);
  }, []);

  const handleOpenRecommendedModal = useCallback(() => {
    if (recommendation) {
      setSelectedCell({
        departureDate: recommendation.departureDate,
        returnDate: recommendation.returnDate,
        cellData: recommendation.cellData,
      });
    }
  }, [recommendation]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        starredCount={starredCombos.length}
        onOpenComparison={() => {}}
        onLogoClick={() => navigate('/')}
      />

      <div className="flex">
        {/* Search Tree Sidebar */}
        <SearchTree onSelectSearch={onSelectSearch} isOpen={true} />

        {/* Main Content */}
        <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Recommendation Notification */}
          {recommendation && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Trip Assistant recommends
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {recommendation.departureDate} departure — {recommendation.anxietyAnalysis?.anxietyLevel === 'not_stressful' ? '🟢 Not Stressful' : recommendation.anxietyAnalysis?.anxietyLevel === 'medium' ? '🟡 Medium' : '🔴 Very Stressful'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleOpenRecommendedModal}
                className="flex-shrink-0 px-4 py-2 bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-indigo-200 dark:border-indigo-700"
              >
                See details ↗
              </button>
            </div>
          )}

          {/* Search summary */}
          <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                {originCity?.flag} {originCity?.name}
                <span className="text-gray-400 dark:text-gray-500 font-light mx-2">→</span>
                {destCity?.flag} {destCity?.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {searchParamsObj.startDate} – {searchParamsObj.endDate}
                {' · '}
                {travelers} traveller{travelers !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            >
              ← Modify Search
            </button>
          </div>

          {/* Sort tab bar */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {[
              { key: 'cheapest', label: '💰 Cheapest' },
              { key: 'bestValue', label: '⭐ Best Value' },
              { key: 'leastStressful', label: '🟢 Least Stressful' },
              // { key: 'exactDuration', label: `📅 ${searchNights} Nights` },  // TODO: Debug filtering
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSortMode(tab.key)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                  sortMode === tab.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Heat map card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <HeatMap
              searchParams={searchParamsObj}
              onSelectCell={setSelectedCell}
              starredCombos={starredCombos}
              onToggleStar={onToggleStar}
              minHotelStars={3}
              travelers={travelers}
              onRecommendationFound={handleRecommendationFound}
              preferenceWeights={Object.keys(preferenceWeights).length > 0 ? preferenceWeights : undefined}
              sortMode={sortMode}
              searchNights={searchNights}
            />
          </div>

          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
            Prices shown in EUR · Mock data for demo · Phase 2 connects real APIs
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={!!selectedCell}
        onClose={() => setSelectedCell(null)}
        cellData={selectedCell?.cellData}
        searchParams={searchParamsObj}
        onToggleStar={onToggleStar}
        isStarred={isStarred}
      />
    </div>
  );
}

// ─── Main App Component ────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('to-theme') || 'light'; } catch { return 'light'; }
  });
  const [starredCombos, setStarredCombos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addSearch } = useSearchTree();

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
    addSearch(params);
    setTimeout(() => {
      // Navigate to results with URL parameters
      const queryParams = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        startDate: params.startDate,
        endDate: params.endDate,
        adults: params.adults || 2,
        children: params.children || 0,
        ...(params.tripLengthPreset !== undefined && { tripLengthPreset: params.tripLengthPreset }),
        ...(params.budgetVsComfort !== undefined && { budgetVsComfort: params.budgetVsComfort }),
        ...(params.earlyMorningOk !== undefined && { earlyMorningOk: params.earlyMorningOk }),
        ...(params.packedVsRelaxed !== undefined && { packedVsRelaxed: params.packedVsRelaxed }),
      }).toString();
      window.location.href = `/results?${queryParams}`;
      setLoading(false);
    }, 700);
  }, [addSearch]);

  const handleSelectSearch = useCallback((params) => {
    handleSearch(params);
  }, [handleSearch]);

  const handleViewTimeline = useCallback(() => {
    window.location.href = '/assistant';
  }, []);

  const handleToggleStar = useCallback(({ departureDate, returnDate, cellData }) => {
    setStarredCombos(prev => {
      const key = `${departureDate}__${returnDate}`;
      const exists = prev.some(s => `${s.departureDate}__${s.returnDate}` === key);
      if (exists) return prev.filter(s => `${s.departureDate}__${s.returnDate}` !== key);
      return [...prev.slice(-4), { departureDate, returnDate, cellData }];
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="font-sans">
        <Routes>
          <Route
            path="/"
            element={
              <LandingPageRoute
                theme={theme}
                onToggleTheme={toggleTheme}
                onSearch={handleSearch}
                onViewTimeline={handleViewTimeline}
              />
            }
          />
          <Route
            path="/search"
            element={
              <SearchRoute
                theme={theme}
                onToggleTheme={toggleTheme}
                onSearch={handleSearch}
              />
            }
          />
          <Route
            path="/results"
            element={
              <ResultsPageRoute
                starredCombos={starredCombos}
                onToggleStar={handleToggleStar}
                theme={theme}
                onToggleTheme={toggleTheme}
                onSelectSearch={handleSelectSearch}
              />
            }
          />
          <Route
            path="/assistant"
            element={
              <TimelineRoute
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            }
          />
        </Routes>
      </div>
      <Analytics />
    </BrowserRouter>
  );
}
