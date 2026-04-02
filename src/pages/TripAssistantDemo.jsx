import React from 'react';
import TripAssistant from '../components/TripAssistant/index.jsx';
import { mockTripMeta, mockSegments, familyAnnotations, layoverOptions } from '../components/TripAssistant/mockTrip.js';

export default function TripAssistantDemo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            ✈️ Trip Assistant Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Munich → Tokyo itinerary with conflict detection and family mode
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <TripAssistant
            segments={mockSegments}
            tripMeta={mockTripMeta}
            familyMode={false}
            familyAnnotations={familyAnnotations}
            layoverOptions={layoverOptions}
          />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>This is a demo component. In production, it would consume real booking data.</p>
        </div>
      </div>
    </div>
  );
}
