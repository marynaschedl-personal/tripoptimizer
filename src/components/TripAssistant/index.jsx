import React, { useState, useMemo } from 'react';
import {
  Plane, Navigation, Hotel, Clock, MapPin, AlertCircle, CheckCircle, Info, AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';
import { detectConflicts, getSeverityColor, getSegmentIcon } from './detectConflicts.js';
import FatigueBar from './FatigueBar.jsx';
import LayoverOptions from './LayoverOptions.jsx';

const iconMap = {
  Plane,
  Navigation,
  Hotel,
  Clock,
  MapPin,
};

const alertIconMap = {
  danger: AlertTriangle,
  warn: AlertTriangle,
  info: Info,
};

function SegmentCard({ segment, alerts, familyAnnotations, familyMode, layoverOptions, allSegments, cumulativeFatigue }) {
  const segmentAlerts = alerts.filter(a => a.segmentId === segment.id);
  const familyNote = familyAnnotations?.find(a => a.segmentId === segment.id);
  const icon = iconMap[getSegmentIcon(segment.type)];
  const Icon = icon || MapPin;
  const maxSeverity = segmentAlerts.length > 0
    ? (segmentAlerts.some(a => a.severity === 'danger') ? 'danger'
      : segmentAlerts.some(a => a.severity === 'warn') ? 'warn'
        : 'info')
    : 'ok';

  const colors = getSeverityColor(maxSeverity);
  const DotIcon = alertIconMap[maxSeverity] || CheckCircle;

  return (
    <div className={clsx(
      'rounded-xl border p-4 transition-all',
      colors.bg, colors.border,
    )}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={clsx('p-2 rounded-lg flex-shrink-0', colors.bg)}>
          <Icon size={20} className={colors.text} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="font-semibold text-gray-900 dark:text-gray-100">{segment.title}</p>
            <span className="text-sm text-gray-500 dark:text-gray-400">{segment.localStartTime} – {segment.localEndTime}</span>
          </div>
          {segment.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{segment.subtitle}</p>
          )}
          {segment.notes && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic">{segment.notes}</p>
          )}
        </div>
      </div>

      {/* Alerts */}
      {segmentAlerts.length > 0 && (
        <div className="space-y-2 mb-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {segmentAlerts.map(alert => (
            <div key={alert.id} className={clsx(
              'text-sm rounded-lg p-2.5',
              alert.severity === 'danger' && 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
              alert.severity === 'warn' && 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
              alert.severity === 'info' && 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            )}>
              <p className="font-medium">{alert.message}</p>
              {alert.fixSuggestion && (
                <div className="mt-2 flex items-start gap-2">
                  <button className={clsx(
                    'text-xs font-semibold px-2.5 py-1 rounded-md transition-colors',
                    alert.severity === 'danger' && 'bg-red-200 dark:bg-red-800 hover:bg-red-300 dark:hover:bg-red-700',
                    alert.severity === 'warn' && 'bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700',
                    alert.severity === 'info' && 'bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700',
                  )}>
                    → {alert.fixSuggestion}
                  </button>
                  {alert.fixCost && <span className="text-xs font-semibold">+€{alert.fixCost}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fatigue bar for non-accommodation segments */}
      {segment.type !== 'accommodation' && segment.fatigueWeight > 0 && (
        <div className="mb-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <FatigueBar cumulativeFatigue={cumulativeFatigue} />
        </div>
      )}

      {/* Layover options */}
      {segment.type === 'layover' && layoverOptions && (
        <LayoverOptions
          options={layoverOptions}
          duration={segment.details?.durationMinutes || 60}
        />
      )}

      {/* Family mode annotations */}
      {familyMode && familyNote && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1.5">
          <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide">👨‍👩‍👧‍👦 Family Notes</p>
          {familyNote.napWindow && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Nap:</span> {familyNote.napWindow}
            </div>
          )}
          {familyNote.mealTiming && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Meals:</span> {familyNote.mealTiming}
            </div>
          )}
          {familyNote.notes && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Notes:</span> {familyNote.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TripAssistant({
  segments = [],
  tripMeta = {},
  familyMode = false,
  familyAnnotations = [],
  layoverOptions = [],
}) {
  const [isFamilyMode, setIsFamilyMode] = useState(familyMode);
  const { alerts, summary } = useMemo(() => detectConflicts(segments), [segments]);

  // Group segments by local calendar day and calculate cumulative fatigue
  const groupedByDay = useMemo(() => {
    const groups = {};
    const cumulativeFatigueMap = {};
    let cumulative = 0;

    segments.forEach(seg => {
      cumulative += seg.fatigueWeight || 0;
      cumulativeFatigueMap[seg.id] = cumulative;

      const date = seg.localStartTime.split('T')[0] || 'unknown';
      if (!groups[date]) groups[date] = [];
      groups[date].push(seg);

      // Reset cumulative fatigue after accommodation
      if (seg.type === 'accommodation') {
        cumulative = 0;
      }
    });

    return { groups, cumulativeFatigueMap };
  }, [segments]);

  if (segments.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto mb-4 text-gray-400" size={32} />
        <p className="text-gray-500 dark:text-gray-400 font-medium">No trip segments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {tripMeta.origin} → {tripMeta.destination}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {tripMeta.startDate} to {tripMeta.endDate} · {tripMeta.travelerCount} traveler{tripMeta.travelerCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setIsFamilyMode(!isFamilyMode)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-colors',
            isFamilyMode
              ? 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
          )}
        >
          👨‍👩‍👧‍👦 Family Mode
        </button>
      </div>

      {/* Alert Summary */}
      {(summary.danger > 0 || summary.warn > 0) && (
        <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 p-4 flex items-start gap-3">
          <AlertTriangle className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-orange-900 dark:text-orange-300">
              {summary.danger} danger{summary.danger !== 1 ? 's' : ''} · {summary.warn} warning{summary.warn !== 1 ? 's' : ''}
            </p>
            <p className="text-sm text-orange-800 dark:text-orange-400 mt-1">
              Review the timeline below to see conflicts and suggested fixes.
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedByDay.groups).map(([date, daySegments], dayIdx) => (
          <div key={date} className="space-y-3">
            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
              Day {dayIdx + 1}
            </h3>
            <div className="space-y-3 relative">
              {/* Vertical connector line (left of timeline) */}
              <div className="absolute left-4 top-10 bottom-0 w-px bg-gradient-to-b from-gray-300 dark:from-gray-600 to-transparent" />

              {daySegments.map((segment, idx) => (
                <div key={segment.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-5 w-9 h-9 flex items-center justify-center">
                    <div className={clsx(
                      'w-5 h-5 rounded-full border-4 border-white dark:border-gray-950',
                      getSeverityColor(
                        alerts.some(a => a.segmentId === segment.id && a.severity === 'danger')
                          ? 'danger'
                          : alerts.some(a => a.segmentId === segment.id && a.severity === 'warn')
                            ? 'warn'
                            : alerts.some(a => a.segmentId === segment.id && a.severity === 'info')
                              ? 'info'
                              : 'ok',
                      ).dot,
                    )} />
                  </div>

                  {/* Card content */}
                  <div className="ml-16">
                    <SegmentCard
                      segment={segment}
                      alerts={alerts}
                      familyAnnotations={familyAnnotations}
                      familyMode={isFamilyMode}
                      layoverOptions={segment.type === 'layover' ? layoverOptions : null}
                      allSegments={segments}
                      cumulativeFatigue={groupedByDay.cumulativeFatigueMap[segment.id] || 0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Panel */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{summary.danger}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Critical Issues</p>
        </div>
        <div className="text-center border-l border-r border-gray-200 dark:border-gray-700">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{summary.warn}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Warnings</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{summary.info}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Info & Tips</p>
        </div>
      </div>
    </div>
  );
}
