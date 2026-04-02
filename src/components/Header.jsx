import React from 'react';
import { Sun, Moon, Star, BarChart2 } from 'lucide-react';
import clsx from 'clsx';

export default function Header({ theme, onToggleTheme, starredCount, onOpenComparison, onLogoClick }) {
  return (
    <header className={clsx(
      'glass sticky top-0 z-50 border-b',
      'border-white/20 dark:border-gray-700/40',
      'shadow-sm',
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Back to home"
          >
            <span className="text-2xl select-none" role="img" aria-label="airplane">✈️</span>
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
              TripOptimizer
            </span>
          </button>

          {/* Center tagline — hidden on mobile */}
          <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400 font-medium">
            Find your perfect trip
          </p>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Comparison badge */}
            {starredCount > 0 && (
              <button
                onClick={onOpenComparison}
                aria-label={`Open comparison panel — ${starredCount} trip${starredCount > 1 ? 's' : ''} starred`}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm font-semibold hover:bg-amber-200 dark:hover:bg-amber-800/60 transition-colors"
              >
                <BarChart2 size={14} />
                <span>Compare</span>
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {starredCount}
                </span>
              </button>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className={clsx(
                'p-2 rounded-xl transition-all duration-200',
                'text-gray-500 dark:text-gray-400',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'hover:text-gray-800 dark:hover:text-gray-200',
              )}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
