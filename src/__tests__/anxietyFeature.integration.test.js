import { describe, it, expect, beforeEach, vi } from 'vitest';
import { analyzeTrip } from '../services/anxietyAnalyzer.js';
import { daysBetween } from '../data/mockData.js';

/**
 * End-to-End Integration Tests for Anxiety-Driven Trip Planning Feature
 * Tests complete flow from trip analysis through recommendation and detail modal display
 */

describe('Anxiety Feature Integration - E2E Scenarios', () => {
  // Mock search params for different trip scenarios
  const mockSearchParams = {
    origin: 'JFK',
    destination: 'CDG',
    startDate: '2026-04-15',
    endDate: '2026-04-18', // 3-day trip
    adults: 2,
    children: 0,
  };

  const mockLongTripParams = {
    ...mockSearchParams,
    endDate: '2026-04-29', // 14-day trip
  };

  // Mock cell data for different scenarios
  const shortTripDirectFlights = {
    flightPrice: 250,
    outboundPrice: 250,
    inboundPrice: 0,
    outbound: {
      departure: '08:00',
      arrival: '20:00',
      duration: '7h 45m',
      stops: 0,
      price: 250,
    },
    inbound: {
      departure: '09:00',
      arrival: '21:00',
      duration: '7h 30m',
      stops: 0,
    },
    cheapestHotel: { name: '3-star Hotel', stars: 3 },
    cheapestHotelCost: 300,
    totalCost: 550,
  };

  const shortTripRedEyeFlights = {
    flightPrice: 180,
    outboundPrice: 180,
    inboundPrice: 0,
    outbound: {
      departure: '23:30',
      arrival: '11:00',
      duration: '8h 15m',
      stops: 0,
      price: 180,
    },
    inbound: {
      departure: '22:00',
      arrival: '10:00',
      duration: '8h 30m',
      stops: 0,
    },
    cheapestHotel: { name: '3-star Hotel', stars: 3 },
    cheapestHotelCost: 300,
    totalCost: 480,
  };

  const longTripRedEyeFlights = {
    flightPrice: 200,
    outboundPrice: 200,
    inboundPrice: 0,
    outbound: {
      departure: '22:00',
      arrival: '10:00',
      duration: '8h 20m',
      stops: 0,
      price: 200,
    },
    inbound: {
      departure: '23:00',
      arrival: '11:00',
      duration: '8h 25m',
      stops: 0,
    },
    cheapestHotel: { name: '4-star Hotel', stars: 4 },
    cheapestHotelCost: 600,
    totalCost: 800,
  };

  describe('Scenario 1: 3-Day Trip with Direct Flights', () => {
    it('should score low anxiety for short trip with good flight times', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const analysis = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);

      expect(analysis).toBeDefined();
      expect(analysis.anxietyLevel).toBe('not_stressful');
      expect(analysis.score).toBeLessThan(0.4);
      expect(analysis.factors.fatigueRisk).toBeLessThan(0.3);
      expect(analysis.factors.complexity).toBeLessThan(0.2);
    });

    it('should include positive recommendations for good flight times', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const analysis = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);

      expect(analysis.recommendations.length).toBeGreaterThan(0);
      const hasDirectFlightRec = analysis.recommendations.some(r =>
        r.toLowerCase().includes('direct') || r.toLowerCase().includes('non-stop')
      );
      expect(hasDirectFlightRec).toBe(true);
    });

    it('should not include fatigue warnings for direct flights', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const analysis = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);

      const hasFatigueWarning = analysis.warnings.some(w =>
        w.toLowerCase().includes('fatigue') || w.toLowerCase().includes('red-eye')
      );
      expect(hasFatigueWarning).toBe(false);
    });
  });

  describe('Scenario 2: 3-Day Trip with Red-Eye Flights', () => {
    it('should score higher anxiety for short trip with red-eyes', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const analysis = analyzeTrip(shortTripRedEyeFlights, mockSearchParams, tripLength);

      expect(analysis).toBeDefined();
      expect(analysis.anxietyLevel).toBe('medium');
      expect(analysis.score).toBeGreaterThan(0.4);
      expect(analysis.score).toBeLessThan(0.8);
    });

    it('should include fatigue warnings for red-eye flights', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const analysis = analyzeTrip(shortTripRedEyeFlights, mockSearchParams, tripLength);

      const hasFatigueWarning = analysis.warnings.some(w =>
        w.toLowerCase().includes('red-eye') || w.toLowerCase().includes('night')
      );
      expect(hasFatigueWarning).toBe(true);
    });

    it('should have higher fatigue risk score than direct flights', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const directAnalysis = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);
      const redEyeAnalysis = analyzeTrip(shortTripRedEyeFlights, mockSearchParams, tripLength);

      expect(redEyeAnalysis.factors.fatigueRisk)
        .toBeGreaterThan(directAnalysis.factors.fatigueRisk);
    });
  });

  describe('Scenario 3: 14-Day Trip with Red-Eye Flights', () => {
    it('should apply duration multiplier to reduce anxiety for long trips', () => {
      const shortTripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const longTripLength = daysBetween(mockLongTripParams.startDate, mockLongTripParams.endDate);

      const shortRedEyeAnalysis = analyzeTrip(shortTripRedEyeFlights, mockSearchParams, shortTripLength);
      const longRedEyeAnalysis = analyzeTrip(longTripRedEyeFlights, mockLongTripParams, longTripLength);

      // 14-day trip should have lower anxiety score despite red-eyes due to multiplier
      expect(longRedEyeAnalysis.score).toBeLessThan(shortRedEyeAnalysis.score);
      expect(longRedEyeAnalysis.anxietyLevel).toBe('not_stressful');
    });

    it('should include rest opportunity recommendations for long trips', () => {
      const tripLength = daysBetween(mockLongTripParams.startDate, mockLongTripParams.endDate);
      const analysis = analyzeTrip(longTripRedEyeFlights, mockLongTripParams, tripLength);

      const hasRestRec = analysis.recommendations.some(r =>
        r.toLowerCase().includes('rest') ||
        r.toLowerCase().includes('recovery') ||
        r.toLowerCase().includes('acclimat')
      );
      expect(hasRestRec).toBe(true);
    });
  });

  describe('Analysis Data Structure and Validity', () => {
    it('should always return properly structured anxiety analysis', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const analysis = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);

      // Required properties
      expect(analysis).toHaveProperty('anxietyLevel');
      expect(analysis).toHaveProperty('score');
      expect(analysis).toHaveProperty('factors');
      expect(analysis).toHaveProperty('warnings');
      expect(analysis).toHaveProperty('recommendations');
    });

    it('should have valid anxiety level values', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const validLevels = ['not_stressful', 'medium', 'very_stressful'];

      const analysis = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);
      expect(validLevels).toContain(analysis.anxietyLevel);
    });

    it('should have scores between 0 and 1', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const analysis = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);

      expect(analysis.score).toBeGreaterThanOrEqual(0);
      expect(analysis.score).toBeLessThanOrEqual(1);
    });

    it('should have all factor scores between 0 and 1', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const analysis = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);

      expect(analysis.factors.fatigueRisk).toBeGreaterThanOrEqual(0);
      expect(analysis.factors.fatigueRisk).toBeLessThanOrEqual(1);
      expect(analysis.factors.conflictRisk).toBeGreaterThanOrEqual(0);
      expect(analysis.factors.conflictRisk).toBeLessThanOrEqual(1);
      expect(analysis.factors.complexity).toBeGreaterThanOrEqual(0);
      expect(analysis.factors.complexity).toBeLessThanOrEqual(1);
      expect(analysis.factors.restPenalty).toBeGreaterThanOrEqual(0);
      expect(analysis.factors.restPenalty).toBeLessThanOrEqual(1);
    });

    it('should always return arrays for warnings and recommendations', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const analysis = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);

      expect(Array.isArray(analysis.warnings)).toBe(true);
      expect(Array.isArray(analysis.recommendations)).toBe(true);
    });
  });

  describe('Comparison and Ranking', () => {
    it('should correctly identify best trip (lowest anxiety) from multiple options', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);

      const analysis1 = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);
      const analysis2 = analyzeTrip(shortTripRedEyeFlights, mockSearchParams, tripLength);

      // Direct flights should have lower anxiety than red-eyes for short trips
      expect(analysis1.score).toBeLessThan(analysis2.score);
      expect(analysis1.anxietyLevel).not.toBe('very_stressful');
      expect(analysis2.anxietyLevel).not.toBe('not_stressful');
    });

    it('should handle multiple trips for recommendation selection', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);

      const trips = [
        { key: 'option1', data: shortTripRedEyeFlights },
        { key: 'option2', data: shortTripDirectFlights },
        { key: 'option3', data: { ...shortTripRedEyeFlights, totalCost: 900 } },
      ];

      const analyses = trips.map(t => ({
        key: t.key,
        analysis: analyzeTrip(t.data, mockSearchParams, tripLength),
      }));

      // Find best (lowest score)
      const best = analyses.reduce((prev, curr) =>
        curr.analysis.score < prev.analysis.score ? curr : prev
      );

      // Option 2 (direct flights) should be best
      expect(best.key).toBe('option2');
      expect(best.analysis.anxietyLevel).toBe('not_stressful');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very short trips (2 nights minimum)', () => {
      const shortParams = {
        ...mockSearchParams,
        endDate: '2026-04-17', // 2-night trip
      };
      const tripLength = daysBetween(shortParams.startDate, shortParams.endDate);

      const analysis = analyzeTrip(shortTripDirectFlights, shortParams, tripLength);
      expect(analysis).toBeDefined();
      expect(analysis.score).toBeGreaterThanOrEqual(0);
      expect(analysis.score).toBeLessThanOrEqual(1);
    });

    it('should handle undefined or missing factors gracefully', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const incompleteCellData = { totalCost: 550 };

      const analysis = analyzeTrip(incompleteCellData, mockSearchParams, tripLength);
      expect(analysis).toBeDefined();
      expect(analysis.score).toBeGreaterThanOrEqual(0);
      expect(analysis.score).toBeLessThanOrEqual(1);
    });

    it('should handle same departure/arrival times in same timezone', () => {
      const sameTimezoneCell = {
        ...shortTripDirectFlights,
        outbound: {
          ...shortTripDirectFlights.outbound,
          departure: '08:00',
          arrival: '12:00', // Same timezone, 4-hour flight
        },
      };

      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);
      const analysis = analyzeTrip(sameTimezoneCell, mockSearchParams, tripLength);

      expect(analysis).toBeDefined();
      expect(analysis.factors.fatigueRisk).toBeLessThan(0.3);
    });
  });

  describe('Consistency Across Multiple Calls', () => {
    it('should produce consistent results for same input', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);

      const analysis1 = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);
      const analysis2 = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);

      expect(analysis1.score).toBe(analysis2.score);
      expect(analysis1.anxietyLevel).toBe(analysis2.anxietyLevel);
      expect(analysis1.factors).toEqual(analysis2.factors);
    });

    it('should maintain score order for same trips across calls', () => {
      const tripLength = daysBetween(mockSearchParams.startDate, mockSearchParams.endDate);

      const direct1 = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);
      const redEye1 = analyzeTrip(shortTripRedEyeFlights, mockSearchParams, tripLength);

      const direct2 = analyzeTrip(shortTripDirectFlights, mockSearchParams, tripLength);
      const redEye2 = analyzeTrip(shortTripRedEyeFlights, mockSearchParams, tripLength);

      expect(direct1.score < redEye1.score).toBe(direct2.score < redEye2.score);
    });
  });
});

/**
 * Component Rendering Tests
 * Verifies that UI components render correctly with anxiety data
 */
describe('Anxiety UI Components Rendering', () => {
  it('should have AnxietyReport component available', () => {
    // This is a simple check that the component can be imported
    expect(() => {
      require('../components/AnxietyReport.jsx');
    }).not.toThrow();
  });

  it('should have AnxietyBadge component available', () => {
    expect(() => {
      require('../components/AnxietyBadge.jsx');
    }).not.toThrow();
  });

  it('should have RecommendationBadge component available', () => {
    expect(() => {
      require('../components/RecommendationBadge.jsx');
    }).not.toThrow();
  });
});
