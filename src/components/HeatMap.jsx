import React, { useMemo, useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import { RefreshCw, AlertCircle, Zap } from 'lucide-react';
import {
  getCellData,
  generateDateRange,
  formatDate,
  daysBetween,
  getColorForNormalized,
} from '../data/mockData.js';
import { batchFetchFlightPrices, clearFlightCache, getCacheAgeMinutes } from '../api/kiwiApi.js';
import { analyzeTrip } from '../services/anxietyAnalyzer.js';
import AnxietyBadge from './AnxietyBadge.jsx';
import RecommendationBadge from './RecommendationBadge.jsx';

function SkeletonCell() {
  return (
    <div className="w-[88px] h-[60px] rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
  );
}

export default function HeatMap({
  searchParams,
  onSelectCell,
  starredCombos,
  onToggleStar,
  minHotelStars,
  travelers,
  onRecommendationFound,
  preferenceWeights,
  onDataLoaded,
}) {
  const longPressTimer = useRef(null);
  const [flightData, setFlightData] = useState({});
  const [isLoadingFlights, setIsLoadingFlights] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState({ completed: 0, total: 0 });
  const [error, setError] = useState(null);
  const [useRealPrices, setUseRealPrices] = useState(true);
  const [dataFreshness, setDataFreshness] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Anxiety analysis state
  const [anxietyCache, setAnxietyCache] = useState({});
  const [analyzingTop5, setAnalyzingTop5] = useState(false);
  const [recommendedCell, setRecommendedCell] = useState(null);

  // Generate date combinations and initial grid
  const { departureDates, returnDates, mockGrid, minCost: mockMinCost, maxCost: mockMaxCost, totalCombinations } =
    useMemo(() => {
      if (!searchParams) return { departureDates: [], returnDates: [], mockGrid: {}, minCost: 0, maxCost: 0, totalCombinations: 0 };

      const { startDate, endDate, adults, children } = searchParams;
      console.log('HeatMap: Generating grid with searchParams:', { startDate, endDate, adults, children });
      const totalTravelers = (adults || 2) + (children || 0);
      const totalDays = daysBetween(startDate, endDate);
      console.log('HeatMap: totalDays =', totalDays, 'totalTravelers =', totalTravelers);

      const maxRows = Math.min(8, Math.max(0, totalDays - 1));
      const departures = generateDateRange(startDate, maxRows);
      const returnStart = generateDateRange(startDate, totalDays + 1).slice(2);
      const returns = returnStart.slice(0, 8);

      const grid = {};
      let minC = Infinity;
      let maxC = -Infinity;
      let count = 0;

      for (const dep of departures) {
        for (const ret of returns) {
          const nights = daysBetween(dep, ret);
          if (nights < 2) continue;
          const key = `${dep}__${ret}`;
          const data = getCellData(dep, ret, minHotelStars, totalTravelers);
          if (!data) continue;
          grid[key] = data;
          count++;
          if (data.totalCost < minC) minC = data.totalCost;
          if (data.totalCost > maxC) maxC = data.totalCost;
        }
      }

      return {
        departureDates: departures,
        returnDates: returns,
        mockGrid: grid,
        minCost: minC === Infinity ? 0 : minC,
        maxCost: maxC === -Infinity ? 0 : maxC,
        totalCombinations: count,
      };
    }, [searchParams, minHotelStars, travelers]);

  // Fetch real flight data
  useEffect(() => {
    if (!searchParams || !useRealPrices) return;

    const fetchRealPrices = async () => {
      setIsLoadingFlights(true);
      setError(null);
      setUsingFallback(false);
      const { origin, destination, startDate, endDate, adults, children } = searchParams;
      const totalTravelers = (adults || 2) + (children || 0);

      try {
        // Prepare flight requests
        const flights = [];
        const totalDays = daysBetween(startDate, endDate);
        const maxRows = Math.min(8, Math.max(0, totalDays - 1));
        const departures = generateDateRange(startDate, maxRows);
        const returnStart = generateDateRange(startDate, totalDays + 1).slice(2);
        const returns = returnStart.slice(0, 8);

        for (const dep of departures) {
          for (const ret of returns) {
            const nights = daysBetween(dep, ret);
            if (nights < 2) continue;
            flights.push({
              key: `${dep}__${ret}`,
              origin,
              destination,
              outboundDate: dep,
              returnDate: ret,
              adults: totalTravelers,
            });
          }
        }

        // Batch fetch with progress
        const results = await batchFetchFlightPrices(flights, (progress) => {
          setLoadingProgress(progress);
        });

        // Merge API results with mock hotel data
        const merged = {};
        const freshness = {};

        for (const key in results) {
          const apiResult = results[key];
          const mockData = mockGrid[key];

          if (apiResult.success && mockData) {
            // Combine real flight price with mock hotel
            merged[key] = {
              ...mockData,
              flightPrice: apiResult.price,
              outboundPrice: apiResult.price,
              inboundPrice: 0, // Already included in flightPrice
              outbound: { ...mockData.outbound, price: apiResult.price },
              totalCost: apiResult.price + mockData.cheapestHotelCost,
              airlines: apiResult.airlines,
              stops: apiResult.stops,
              cached: apiResult.cached,
              realFlightData: true,
            };
            if (apiResult.cached) {
              freshness[key] = getCacheAgeMinutes(Date.now() - (apiResult.cacheAge || 0));
            }
          } else if (mockData) {
            // Fall back to mock data
            merged[key] = mockData;
          }
        }

        setFlightData(merged);
        setDataFreshness(freshness);
        if (Object.keys(merged).filter(k => merged[k].realFlightData).length === 0) {
          setUsingFallback(true);
        }
      } catch (err) {
        console.error('Error fetching flight prices:', err);
        setError(err.message);
        setUsingFallback(true);
        setFlightData(mockGrid);
      } finally {
        setIsLoadingFlights(false);
        setLoadingProgress({ completed: 0, total: 0 });
      }
    };

    fetchRealPrices();
  }, [searchParams, useRealPrices, mockGrid]);

  // Determine which data to use
  const cellGrid = useRealPrices && Object.keys(flightData).length > 0 ? flightData : mockGrid;

  // Notify parent when data is loaded
  useEffect(() => {
    if (onDataLoaded && Object.keys(cellGrid).length > 0) {
      onDataLoaded(cellGrid, anxietyCache);
    }
  }, [cellGrid, anxietyCache, onDataLoaded]);

  // Analyze top 5 trips for anxiety score (background, non-blocking)
  useEffect(() => {
    if (!searchParams || !cellGrid || Object.keys(cellGrid).length === 0) {
      return;
    }

    const analyzeTop5Trips = async () => {
      try {
        setAnalyzingTop5(true);

        // Sort cells by cost and get top 5
        const sortedCells = Object.entries(cellGrid)
          .map(([key, data]) => ({ key, data, cost: data?.totalCost || Infinity }))
          .sort((a, b) => a.cost - b.cost)
          .slice(0, 5);

        if (sortedCells.length === 0) {
          setAnalyzingTop5(false);
          return;
        }

        // Analyze each top 5 cell
        const newCache = { ...anxietyCache };
        let bestCell = null;
        let bestScore = Infinity;

        for (const { key, data } of sortedCells) {
          if (!data || newCache[key]) continue; // Skip if already cached

          const tripLength = searchParams.tripLength || daysBetween(searchParams.startDate, searchParams.endDate);
          const analysis = analyzeTrip(data, searchParams, tripLength, preferenceWeights);
          newCache[key] = analysis;

          // Track the best (lowest score) option
          if (analysis.score < bestScore) {
            bestScore = analysis.score;
            bestCell = key;
          }
        }

        setAnxietyCache(newCache);
        setRecommendedCell(bestCell);

        // Notify parent of recommendation
        if (bestCell && onRecommendationFound) {
          const bestData = cellGrid[bestCell];
          const bestAnalysis = newCache[bestCell];
          const [dep, ret] = bestCell.split('__');
          onRecommendationFound({
            departureDate: dep,
            returnDate: ret,
            cellData: bestData,
            anxietyAnalysis: bestAnalysis,
          });
        }
      } catch (err) {
        console.error('Error analyzing trip anxiety:', err);
      } finally {
        setAnalyzingTop5(false);
      }
    };

    analyzeTop5Trips();
  }, [searchParams, cellGrid, onRecommendationFound]);

  // Calculate min/max for color scaling
  const { minCost, maxCost, cheapestKey } = useMemo(() => {
    let minC = Infinity;
    let maxC = -Infinity;
    let cheapKey = null;

    for (const key in cellGrid) {
      const data = cellGrid[key];
      if (data && data.totalCost) {
        if (data.totalCost < minC) { minC = data.totalCost; cheapKey = key; }
        if (data.totalCost > maxC) maxC = data.totalCost;
      }
    }

    return {
      minCost: minC === Infinity ? 0 : minC,
      maxCost: maxC === -Infinity ? 0 : maxC,
      cheapestKey: cheapKey,
    };
  }, [cellGrid]);

  if (!searchParams) {
    return (
      <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
        Run a search to see the price heat map.
      </div>
    );
  }

  // Debug: Log grid status
  if (Object.keys(cellGrid).length === 0) {
    console.warn('HeatMap: cellGrid is empty. SearchParams:', searchParams, 'mockGrid:', mockGrid);
    return (
      <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
        <p>No trip combinations found for these dates.</p>
        <p className="text-xs mt-2">Try adjusting your date range (minimum 2 nights).</p>
      </div>
    );
  }

  const starredSet = new Set((starredCombos || []).map(s => `${s.departureDate}__${s.returnDate}`));

  function handleCellClick(dep, ret, data) {
    if (!data) return;
    onSelectCell({ departureDate: dep, returnDate: ret, cellData: data });
  }

  function handleCellRightClick(e, dep, ret, data) {
    e.preventDefault();
    if (!data) return;
    onToggleStar({ departureDate: dep, returnDate: ret, cellData: data });
  }

  function handleTouchStart(dep, ret, data) {
    longPressTimer.current = setTimeout(() => {
      if (!data) return;
      onToggleStar({ departureDate: dep, returnDate: ret, cellData: data });
    }, 500);
  }

  function handleTouchEnd() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function handleRefreshPrices() {
    clearFlightCache();
    setFlightData({});
    setDataFreshness(null);
    setUseRealPrices(true);
  }

  const costRange = maxCost - minCost || 1;

  return (
    <div className="space-y-4">
      {/* Header with badge and controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{totalCombinations}</span> combinations found
          </p>
          {useRealPrices && !usingFallback && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
              <Zap size={12} />
              LIVE PRICES
            </span>
          )}
          {usingFallback && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              <AlertCircle size={12} />
              Estimated prices
            </span>
          )}
          {analyzingTop5 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 animate-pulse">
              <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Analyzing trips...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {dataFreshness && Object.keys(dataFreshness).length > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Updated {Math.min(...Object.values(dataFreshness))}m ago
            </span>
          )}
          <button
            onClick={handleRefreshPrices}
            disabled={isLoadingFlights}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              isLoadingFlights
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60'
            )}
            aria-label="Refresh prices"
            title="Refresh flight prices"
          >
            <RefreshCw size={16} className={isLoadingFlights ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Loading progress */}
      {isLoadingFlights && (
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-3 flex items-center gap-3">
          <div className="animate-spin">
            <RefreshCw size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Searching real flight prices...
            </p>
            <div className="mt-1 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${loadingProgress.total > 0 ? (loadingProgress.completed / loadingProgress.total) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {loadingProgress.completed} / {loadingProgress.total} combinations
            </p>
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 flex items-start gap-3">
          <AlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              Could not load real prices
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {error}. Using estimated prices instead.
            </p>
          </div>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-400 dark:text-gray-500">
        Click cell to view details · Right-click / long-press to star
      </p>

      {/* Scrollable grid */}
      <div className="overflow-auto rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <table className="border-collapse" style={{ minWidth: 'max-content' }}>
          <thead>
            <tr>
              {/* Corner cell */}
              <th className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-800 p-3 border-b border-r border-gray-100 dark:border-gray-700 min-w-[110px]">
                <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-left">
                  Depart ↓ Return →
                </div>
              </th>
              {returnDates.map(ret => (
                <th
                  key={ret}
                  className="bg-gray-50 dark:bg-gray-800 p-3 border-b border-r border-gray-100 dark:border-gray-700 text-center min-w-[88px]"
                >
                  <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {formatDate(ret, 'weekday')}
                  </div>
                  <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                    {formatDate(ret, 'short')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departureDates.map(dep => (
              <tr key={dep}>
                {/* Row header */}
                <td className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-800 p-3 border-b border-r border-gray-100 dark:border-gray-700">
                  <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {formatDate(dep, 'weekday')}
                  </div>
                  <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                    {formatDate(dep, 'short')}
                  </div>
                </td>
                {returnDates.map(ret => {
                  const nights = daysBetween(dep, ret);
                  const key = `${dep}__${ret}`;
                  const data = cellGrid[key];
                  const isDisabled = nights < 2;
                  const isStarred = starredSet.has(key);
                  const isCheapest = key === cheapestKey;
                  const normalized = data ? (data.totalCost - minCost) / costRange : 0;
                  const bgColor = data ? getColorForNormalized(normalized) : null;

                  if (isDisabled) {
                    return (
                      <td key={ret} className="p-1.5 border-b border-r border-gray-100 dark:border-gray-700">
                        <div className="w-[88px] h-[60px] rounded-lg bg-gray-100 dark:bg-gray-800 opacity-40" />
                      </td>
                    );
                  }

                  if (!data) {
                    return (
                      <td key={ret} className="p-1.5 border-b border-r border-gray-100 dark:border-gray-700">
                        <SkeletonCell />
                      </td>
                    );
                  }

                  const anxietyAnalysis = anxietyCache[key];
                  const isRecommended = recommendedCell === key;

                  return (
                    <td
                      key={ret}
                      className="p-1.5 border-b border-r border-gray-100 dark:border-gray-700"
                    >
                      <div
                        className={clsx(
                          'heatmap-cell w-[88px] h-[60px] rounded-lg flex flex-col items-center justify-center select-none relative',
                          isStarred && 'starred',
                          isRecommended && 'ring-2 ring-amber-400 dark:ring-amber-300',
                        )}
                        style={{ backgroundColor: bgColor }}
                        onClick={() => handleCellClick(dep, ret, data)}
                        onContextMenu={e => handleCellRightClick(e, dep, ret, data)}
                        onTouchStart={() => handleTouchStart(dep, ret, data)}
                        onTouchEnd={handleTouchEnd}
                        title={`${nights} night${nights > 1 ? 's' : ''} — €${data.totalCost.toLocaleString()}${anxietyAnalysis ? ` — ${anxietyAnalysis.anxietyLevel}` : ''}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`${formatDate(dep, 'short')} to ${formatDate(ret, 'short')}, ${nights} nights, €${data.totalCost}${anxietyAnalysis ? ` — ${anxietyAnalysis.anxietyLevel}` : ''}`}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCellClick(dep, ret, data); }}
                      >
                        {/* Recommendation badge (star) */}
                        {isRecommended && <RecommendationBadge isRecommended={true} />}

                        {/* Best price badge */}
                        {isCheapest && !isRecommended && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow uppercase tracking-wide z-10">
                            BEST
                          </span>
                        )}

                        {/* Star indicator (favorited) */}
                        {isStarred && (
                          <span className="absolute -top-2 -left-2 text-amber-400 text-xs z-10 drop-shadow">⭐</span>
                        )}

                        {/* Anxiety badge */}
                        {anxietyAnalysis && (
                          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-20">
                            <AnxietyBadge anxietyLevel={anxietyAnalysis.anxietyLevel} />
                          </div>
                        )}

                        {/* Price and duration */}
                        <span className="text-white font-extrabold text-sm leading-tight drop-shadow">
                          €{data.totalCost.toLocaleString()}
                        </span>
                        <span className="text-white/80 text-[10px] font-medium mt-0.5 drop-shadow">
                          {nights}n
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color legend */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">Cheapest</span>
        <div
          className="flex-1 h-3 rounded-full shadow-inner"
          style={{
            background: 'linear-gradient(to right, hsl(120,75%,45%), hsl(60,75%,50%), hsl(0,75%,50%))',
          }}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">Most expensive</span>
      </div>

      {/* Cost range summary */}
      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>From €{minCost.toLocaleString()}</span>
        <span>Up to €{maxCost.toLocaleString()}</span>
      </div>
    </div>
  );
}
