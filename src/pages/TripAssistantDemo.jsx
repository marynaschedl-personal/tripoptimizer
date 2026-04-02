import React from 'react';
import TripAssistant from '../components/TripAssistant/index.jsx';
import { mockTripMeta, mockSegments, familyAnnotations, layoverOptions } from '../components/TripAssistant/mockTrip.js';

export default function TripAssistantDemo() {
  // Calculate statistics from mock data
  const flights = mockSegments.filter(s => s.type === 'flight');
  const totalFlightTime = flights.reduce((sum, f) => sum + (f.details.durationMinutes || 0), 0);
  const tripDays = 11; // April 10-20 is 11 days
  const totalTravelers = mockTripMeta.travelerCount + mockTripMeta.childCount;
  const avgFatigue = (mockSegments.reduce((sum, s) => sum + s.fatigueWeight, 0) / mockSegments.length * 100).toFixed(0);
  const conflictStatus = 'All Clear';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            ✈️ Trip Assistant Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Munich → Tokyo itinerary with conflict detection and family mode
          </p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {/* Stat 1: Flights */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {flights.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Flights
            </div>
          </div>

          {/* Stat 2: Total Flight Time */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {Math.floor(totalFlightTime / 60)}h
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Flight Time
            </div>
          </div>

          {/* Stat 3: Travelers */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalTravelers}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Travelers
            </div>
          </div>

          {/* Stat 4: Trip Duration */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {tripDays}d
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Duration
            </div>
          </div>

          {/* Stat 5: Conflict Status */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-green-200 dark:border-green-800 p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ✓
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {conflictStatus}
            </div>
          </div>

          {/* Stat 6: Fatigue Risk */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {avgFatigue}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Fatigue Index
            </div>
          </div>
        </div>

        {/* Trip Assistant Component */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <TripAssistant
            segments={mockSegments}
            tripMeta={mockTripMeta}
            familyMode={false}
            familyAnnotations={familyAnnotations}
            layoverOptions={layoverOptions}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>This is a demo component. In production, it would consume real booking data.</p>
        </div>
      </div>
    </div>
  );
}
