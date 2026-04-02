import React, { useMemo } from 'react';
import { Sliders, TrendingDown, Lightbulb, Trophy } from 'lucide-react';
import clsx from 'clsx';
import { getCellData, generateDateRange, daysBetween, formatDate } from '../data/mockData.js';

const STAR_LABELS = { 3: '3-star', 4: '4-star', 5: '5-star' };
const STAR_AVG_PRICES = { 3: 98, 4: 165, 5: 278 };

function Slider({ label, value, onChange, min, max, step = 1, formatValue }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </label>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full bg-gray-200 dark:bg-gray-700"
        style={{
          background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
        }}
        aria-label={label}
      />
    </div>
  );
}

export default function TradeoffVisualizer({
  onHotelStarsChange,
  onTimeFlexChange,
  minHotelStars,
  timeFlex,
  searchParams,
  allCellData,
}) {
  // Compute average cost per hotel tier
  const avgCostByTier = useMemo(() => {
    if (!allCellData || allCellData.length === 0) return null;
    const totals = { 3: [], 4: [], 5: [] };
    for (let stars = 3; stars <= 5; stars++) {
      for (const cell of allCellData) {
        const hotel = (cell.hotels || []).filter(h => h.stars >= stars).sort((a, b) => a.adjustedPricePerNight - b.adjustedPricePerNight)[0];
        if (hotel) totals[stars].push(hotel.adjustedPricePerNight);
      }
    }
    return {
      3: totals[3].length ? Math.round(totals[3].reduce((s, v) => s + v, 0) / totals[3].length) : STAR_AVG_PRICES[3],
      4: totals[4].length ? Math.round(totals[4].reduce((s, v) => s + v, 0) / totals[4].length) : STAR_AVG_PRICES[4],
      5: totals[5].length ? Math.round(totals[5].reduce((s, v) => s + v, 0) / totals[5].length) : STAR_AVG_PRICES[5],
    };
  }, [allCellData]);

  // Best value cell
  const bestCell = useMemo(() => {
    if (!allCellData || allCellData.length === 0) return null;
    return allCellData.reduce((best, cell) =>
      (!best || cell.totalCost < best.totalCost) ? cell : best, null);
  }, [allCellData]);

  // Scenarios
  const scenarios = useMemo(() => {
    if (!allCellData || allCellData.length === 0 || !searchParams) return [];
    const items = [];

    // Scenario 1: Thu vs Fri departure
    if (searchParams.startDate && searchParams.endDate) {
      const dates = generateDateRange(searchParams.startDate, daysBetween(searchParams.startDate, searchParams.endDate) + 1);
      const thursdayCells = allCellData.filter(c => new Date(c.departureDate + 'T00:00:00').getDay() === 4);
      const fridayCells = allCellData.filter(c => new Date(c.departureDate + 'T00:00:00').getDay() === 5);
      if (thursdayCells.length > 0 && fridayCells.length > 0) {
        const thuAvg = Math.round(thursdayCells.reduce((s, c) => s + c.totalCost, 0) / thursdayCells.length);
        const friAvg = Math.round(fridayCells.reduce((s, c) => s + c.totalCost, 0) / fridayCells.length);
        const diff = friAvg - thuAvg;
        if (Math.abs(diff) > 10) {
          items.push({
            icon: '📅',
            text: diff > 0
              ? `Leave Thursday instead of Friday → save avg €${diff}`
              : `Leave Friday instead of Thursday → save avg €${Math.abs(diff)}`,
            saving: Math.abs(diff),
          });
        }
      }
    }

    // Scenario 2: 3★ vs 4★
    if (avgCostByTier) {
      const diff = avgCostByTier[4] - avgCostByTier[3];
      if (diff > 0) {
        items.push({
          icon: '🏨',
          text: `Choose 3★ hotel instead of 4★ → save avg €${diff}/night`,
          saving: diff,
        });
      }
    }

    // Scenario 3: early morning flight
    const earlyFlightCells = allCellData.filter(c => c.outbound && !c.outbound.convenient);
    const lateFlightCells = allCellData.filter(c => c.outbound && c.outbound.convenient);
    if (earlyFlightCells.length > 0 && lateFlightCells.length > 0) {
      const earlyAvg = Math.round(earlyFlightCells.reduce((s, c) => s + c.outboundPrice, 0) / earlyFlightCells.length);
      const lateAvg = Math.round(lateFlightCells.reduce((s, c) => s + c.outboundPrice, 0) / lateFlightCells.length);
      const diff = lateAvg - earlyAvg;
      if (diff > 0) {
        items.push({
          icon: '🌅',
          text: `Take early morning flight → save avg €${diff} on outbound`,
          saving: diff,
        });
      }
    }

    return items.slice(0, 3);
  }, [allCellData, searchParams, avgCostByTier]);

  const convenienceImpact = useMemo(() => {
    if (!allCellData || allCellData.length === 0) return 0;
    const convenientCells = allCellData.filter(c => c.outbound?.convenient);
    const nonConvenientCells = allCellData.filter(c => c.outbound && !c.outbound.convenient);
    if (!convenientCells.length || !nonConvenientCells.length) return 0;
    const convAvg = Math.round(convenientCells.reduce((s, c) => s + c.outboundPrice, 0) / convenientCells.length);
    const nonConvAvg = Math.round(nonConvenientCells.reduce((s, c) => s + c.outboundPrice, 0) / nonConvenientCells.length);
    return convAvg - nonConvAvg;
  }, [allCellData]);

  const currentAvgPerNight = avgCostByTier ? avgCostByTier[minHotelStars] : STAR_AVG_PRICES[minHotelStars];
  const baseAvgPerNight = avgCostByTier ? avgCostByTier[3] : STAR_AVG_PRICES[3];
  const hotelDiff = currentAvgPerNight - baseAvgPerNight;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
          <Sliders size={16} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="font-bold text-gray-900 dark:text-gray-100">Tradeoff Explorer</h2>
      </div>

      {/* Hotel Quality Slider */}
      <div className="space-y-3">
        <Slider
          label="Hotel Quality"
          value={minHotelStars}
          onChange={onHotelStarsChange}
          min={3}
          max={5}
          step={1}
          formatValue={v => `${'⭐'.repeat(v)} ${STAR_LABELS[v]}`}
        />
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">Avg. per night</span>
            <span className="font-bold text-gray-800 dark:text-gray-200">€{currentAvgPerNight}</span>
          </div>
          {hotelDiff !== 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">vs. 3-star</span>
              <span className={clsx('font-bold', hotelDiff > 0 ? 'text-red-500' : 'text-green-500')}>
                {hotelDiff > 0 ? '+' : ''}€{hotelDiff}/night
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Flight Time Slider */}
      <div className="space-y-3">
        <Slider
          label="Flight Time Preference"
          value={timeFlex}
          onChange={onTimeFlexChange}
          min={0}
          max={100}
          step={50}
          formatValue={v => v === 0 ? 'Any time' : v === 50 ? 'Some flex' : 'Convenient only'}
        />
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-xs text-gray-500 dark:text-gray-400">
          {convenienceImpact > 0 ? (
            <span>Convenient times cost avg. <span className="font-bold text-red-500">€{convenienceImpact} more</span></span>
          ) : (
            <span>Limited data to calculate price impact yet</span>
          )}
        </div>
      </div>

      {/* What-if Scenarios */}
      {scenarios.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb size={14} className="text-amber-500" />
            <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">What-if Scenarios</h3>
          </div>
          <div className="space-y-2">
            {scenarios.map((s, i) => (
              <div key={i} className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-3">
                <span className="text-base">{s.icon}</span>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best value callout */}
      {bestCell && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-green-600 dark:text-green-400" />
            <h3 className="text-xs font-bold text-green-800 dark:text-green-200 uppercase tracking-wide">Best Value</h3>
          </div>
          <p className="text-sm font-bold text-green-900 dark:text-green-100">
            {formatDate(bestCell.departureDate, 'short')} → {formatDate(bestCell.returnDate, 'short')} ({bestCell.nights} nights)
          </p>
          <p className="text-2xl font-extrabold text-green-700 dark:text-green-300">
            €{bestCell.totalCost.toLocaleString()} <span className="text-sm font-medium">total</span>
          </p>
        </div>
      )}
    </div>
  );
}
