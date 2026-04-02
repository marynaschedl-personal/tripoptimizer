import React, { useState } from 'react';
import { Bell, Loader2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 900));

    console.log('Price drop alert subscription:', {
      email,
      timestamp: new Date().toISOString(),
      source: 'TripOptimizer EmailCapture',
    });

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm">
      {/* Gradient border wrapper */}
      <div className="p-px bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl">
        <div className="bg-white dark:bg-gray-900 rounded-[15px] p-6">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-4 space-y-3 animate-fade-in">
              <CheckCircle2 size={40} className="text-green-500" />
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                ✅ You're on the list!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We'll email you at <span className="font-semibold text-indigo-600 dark:text-indigo-400">{email}</span> when prices drop.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2.5 rounded-xl shrink-0">
                  <Bell size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">🔔 Price Drop Alerts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Get notified when this trip gets cheaper
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="your@email.com"
                    aria-label="Email address for price drop alerts"
                    className={clsx(
                      'w-full px-4 py-3 rounded-xl border text-sm font-medium',
                      'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                      'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                      error
                        ? 'border-red-400 dark:border-red-500'
                        : 'border-gray-200 dark:border-gray-700',
                      'transition-all duration-150',
                    )}
                  />
                  {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={clsx(
                    'flex items-center justify-center gap-2 px-6 py-3 rounded-xl',
                    'bg-gradient-to-r from-indigo-500 to-purple-600',
                    'hover:from-indigo-600 hover:to-purple-700',
                    'text-white font-bold text-sm',
                    'disabled:opacity-60 disabled:cursor-not-allowed',
                    'shadow-md shadow-indigo-200 dark:shadow-indigo-900/30',
                    'transition-all duration-200 whitespace-nowrap',
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Subscribing…
                    </>
                  ) : (
                    <>
                      <Bell size={15} />
                      Subscribe
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                No spam, unsubscribe anytime. We check prices every 6 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
