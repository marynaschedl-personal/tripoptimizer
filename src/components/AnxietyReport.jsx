import React from 'react';
import clsx from 'clsx';

/**
 * AnxietyReport: Displays detailed anxiety analysis
 * Shows score, factor breakdown, warnings, and recommendations
 * Used in DetailModal to help users understand trip anxiety level
 */
export default function AnxietyReport({ anxietyData, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin">
          <svg
            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing trip anxiety...</span>
      </div>
    );
  }

  if (!anxietyData) {
    return null;
  }

  const { anxietyLevel, score, factors, warnings, recommendations } = anxietyData;

  // Determine badge styling based on anxiety level
  const getBadgeConfig = () => {
    switch (anxietyLevel) {
      case 'not_stressful':
        return {
          emoji: '🟢',
          label: 'Not Stressful',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-700 dark:text-green-300',
          description: 'This trip is well-optimized. Book with confidence!',
        };
      case 'medium':
        return {
          emoji: '🟡',
          label: 'Medium',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-700 dark:text-yellow-300',
          description: 'Some concerns, but manageable with planning.',
        };
      case 'very_stressful':
        return {
          emoji: '🔴',
          label: 'Very Stressful',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-700 dark:text-red-300',
          description: 'High risk. Consider alternative options.',
        };
      default:
        return null;
    }
  };

  const config = getBadgeConfig();

  if (!config) {
    return null;
  }

  return (
    <div className={clsx('rounded-lg border-2 p-6', config.bgColor, config.borderColor)}>
      {/* Anxiety Level Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{config.emoji}</span>
          <div>
            <h3 className={clsx('text-2xl font-bold', config.textColor)}>
              {config.label} Anxiety
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {config.description}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Anxiety Score: <span className="font-semibold">{score.toFixed(2)}/1.0</span>
        </div>
      </div>

      {/* Factors Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
          What Affects This Score?
        </h4>
        <div className="space-y-2">
          <FactorRow
            label="Fatigue Risk"
            value={factors.fatigueRisk}
            description={getFactorDescription('fatigue', factors.fatigueRisk)}
          />
          <FactorRow
            label="Conflicts"
            value={factors.conflictRisk}
            description={getFactorDescription('conflict', factors.conflictRisk)}
          />
          <FactorRow
            label="Complexity"
            value={factors.complexity}
            description={getFactorDescription('complexity', factors.complexity)}
          />
          <FactorRow
            label="Rest Days"
            value={factors.restPenalty}
            description={getFactorDescription('rest', factors.restPenalty)}
          />
        </div>
      </div>

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
            ⚠️ Things to Watch
          </h4>
          <div className="space-y-2">
            {warnings.map((warning, idx) => (
              <div
                key={idx}
                className="flex gap-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <span className="text-lg flex-shrink-0">⚠️</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
            ✓ What's Good About This Trip
          </h4>
          <div className="space-y-2">
            {recommendations.map((recommendation, idx) => (
              <div
                key={idx}
                className="flex gap-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <span className="text-lg flex-shrink-0">✓</span>
                <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * FactorRow: Individual factor with progress bar and description
 */
function FactorRow({ label, value, description }) {
  const percentage = Math.round(value * 100);
  const bgColor = percentage < 35 ? 'bg-green-200' : percentage < 65 ? 'bg-yellow-200' : 'bg-red-200';
  const darkBgColor = percentage < 35 ? 'dark:bg-green-700' : percentage < 65 ? 'dark:bg-yellow-700' : 'dark:bg-red-700';

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
        <span className="text-xs text-gray-600 dark:text-gray-400">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
        <div
          className={clsx('h-full transition-all', bgColor, darkBgColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

/**
 * Get human-readable description for each factor
 */
function getFactorDescription(factor, value) {
  const threshold35 = value < 0.35;
  const threshold65 = value < 0.65;

  switch (factor) {
    case 'fatigue':
      if (threshold35) return 'Low fatigue risk - comfortable flight duration and timing';
      if (threshold65) return 'Moderate fatigue - some long flights or time zone shift';
      return 'High fatigue risk - long flights or red-eyes affect rest';

    case 'conflict':
      if (threshold35) return 'No booking conflicts detected';
      if (threshold65) return 'Minor timing concerns - check connection times';
      return 'Significant conflicts - tight connections or check-in issues';

    case 'complexity':
      if (threshold35) return 'Simple - direct flights, minimal transfers';
      if (threshold65) return 'Moderate - one layover, manageable connections';
      return 'Complex - multiple layovers or transfers';

    case 'rest':
      if (threshold35) return 'Excellent rest opportunity built into schedule';
      if (threshold65) return 'Some rest time available';
      return 'Limited rest time - plan recovery carefully';

    default:
      return '';
  }
}
