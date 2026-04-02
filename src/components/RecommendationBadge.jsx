import React from 'react';

/**
 * RecommendationBadge: Displays ⭐ "Recommended" badge
 * Used to highlight the best trip option (lowest anxiety) in HeatMap
 */
export default function RecommendationBadge({ isRecommended }) {
  if (!isRecommended) {
    return null;
  }

  return (
    <div className="absolute top-1 right-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full p-1 shadow-lg">
      <span className="text-lg">⭐</span>
    </div>
  );
}
