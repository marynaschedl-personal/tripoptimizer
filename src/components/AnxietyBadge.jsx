import React from 'react';

/**
 * AnxietyBadge: Displays anxiety level as colored emoji badge
 * 🟢 Not Stressful
 * 🟡 Medium
 * 🔴 Very Stressful
 */
export default function AnxietyBadge({ anxietyLevel }) {
  if (!anxietyLevel) {
    return null;
  }

  const badgeConfig = {
    not_stressful: {
      emoji: '🟢',
      label: 'Not Stressful',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    medium: {
      emoji: '🟡',
      label: 'Medium',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    very_stressful: {
      emoji: '🔴',
      label: 'Very Stressful',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800',
    },
  };

  const config = badgeConfig[anxietyLevel];

  if (!config) {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      <span className="text-sm">{config.emoji}</span>
      <span className="hidden sm:inline">{config.label}</span>
    </div>
  );
}
