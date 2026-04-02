# Anxiety-Driven Trip Planning Design

**Date:** 2026-04-02  
**Status:** Design Approved  
**Goal:** Connect NLP/Form search results to Trip Assistant via anxiety scoring, enabling users to find "anxiety-free" trips before booking.

---

## Problem Statement

Users search for flights and hotels but lack confidence they've chosen the best option. Key pain points:

- **Information overload:** 64 flight+hotel combinations shown with no guidance
- **Anxiety:** What if there's a hidden conflict? Is the connection too tight? Will I be exhausted?
- **Decision paralysis:** Which trip is actually best for MY trip length and style?
- **Disconnected tools:** Flight search and Trip Assistant are separate—no feedback loop

**Solution:** Score every trip by anxiety level (🟢 Not Stressful / 🟡 Medium / 🔴 Very Stressful) based on fatigue, conflicts, complexity, and trip duration context. Recommend the least anxious option automatically.

---

## Core Design

### Architecture

**Data Flow:**
```
Search (NLP or Form) 
  ↓ (includes tripLength)
HeatMap displays 64 cells instantly
  ↓
AnxietyAnalyzer background: score top 5 candidates
  ↓
Show 🟢/🟡/🔴 badges + ⭐ Recommended badge
  ↓
User clicks any trip 
  ↓
DetailModal: show anxiety report (cached or computed)
  ↓
User books with confidence
```

**New Components:**
- `src/services/anxietyAnalyzer.js` - scoring engine
- `src/components/AnxietyBadge.jsx` - small 🟢/🟡/🔴 badge
- `src/components/AnxietyReport.jsx` - detailed breakdown in DetailModal
- `src/components/RecommendationBadge.jsx` - ⭐ Recommended indicator

**Modified Components:**
- `HeatMap.jsx` - add badge layer, trigger background analysis
- `DetailModal.jsx` - add AnxietyReport section
- `ResultsPage.jsx` - pass tripLength down, show notification

---

## Anxiety Scoring Model

### Factors & Weights

**1. Fatigue Risk (40% weight)**
- **Base calculation:** flight_duration + layover_penalties + timezone_shift + red_eye_penalty
- **Trip duration multiplier:**
  - 3-5 days: ×1.5 (fatigue hits harder, no recovery time)
  - 7-10 days: ×1.0 (baseline)
  - 14+ days: ×0.7 (more time to recover)

**2. Conflict Risk (30% weight)**
- Tight connections (<2h): high risk
- Hotel check-in before arrival: conflict detected
- Same-day multiple segments: medium risk
- No conflicts: low risk

**3. Travel Complexity (20% weight)**
- Direct flights: 0.2 (low)
- 1 layover: 0.5 (medium)
- 2+ layovers: 0.8 (high)

**4. Rest Days Penalty (10% weight)**
- Trip duration aware:
  - Short trip (3-5d): arrival evening → next day free = -0.2
  - Medium trip (7-10d): 1-2 rest days distributed = -0.15
  - Long trip (14+d): multiple rest days = -0.1
- Immediate activities after arrival: +0.1

### Scoring Formula

```
anxiety_score = (fatigue × 0.4) + (conflicts × 0.3) + (complexity × 0.2) + (rest_penalty × 0.1)

anxiety_level = {
  0.0-0.35:  🟢 Not Stressful
  0.35-0.65: 🟡 Medium
  0.65-1.0:  🔴 Very Stressful
}
```

### Examples

**Scenario A: 3-day trip, Barcelona→London**
- Direct LH flight, 2h15m, departs 10am, arrives 10:15am
- Hotel check-in available 14:00
- Fatigue: 0.3 × 1.5 = 0.45 (short trip multiplier)
- Conflicts: 0 (arrives well before check-in)
- Complexity: 0.2 (direct flight)
- Rest: 0.05 (rest day built in? no, only 3 days)
- **Score: 0.32 = 🟢 Not Stressful** ✓

**Scenario B: 3-day trip, Barcelona→London**
- LH with 1-hour connection in Frankfurt, red-eye (23:50 depart)
- Arrives 08:15am next day, hotel check-in 14:00
- Fatigue: 0.75 × 1.5 = 1.125 capped at 0.9 (red-eye + short trip)
- Conflicts: 0.2 (tight 1h connection)
- Complexity: 0.5 (1 layover)
- Rest: 0.1 (no time to rest before trip)
- **Score: 0.68 = 🔴 Very Stressful** ✗

**Scenario C: 14-day trip, Barcelona→London**
- Same red-eye + 1h connection as Scenario B
- Fatigue: 0.75 × 0.7 = 0.525 (long trip multiplier)
- Conflicts: 0.2 (tight connection)
- Complexity: 0.5 (1 layover)
- Rest: -0.1 (14 days to recover)
- **Score: 0.42 = 🟡 Medium** (acceptable for long trip)

---

## User Experience

### HeatMap Display

When search results load:

```
Heat Map: Barcelona → London (Apr 10-22)

[Loading] Analyzing trips...

       Apr 22  Apr 23  Apr 24  Apr 25
Apr 30  €450    €520    €480    ⭐€510
        🟢      🟡      🟡      🟢
        
Apr 31  €475    €545    €490    €525
        🟡      🔴      🟢      🟡
```

**Behavior:**
- All 64 cells render instantly (fast load)
- Top 5 cells analyzed in background (~2-3 seconds)
- Badges appear as analysis completes
- ⭐ Badge highlights the recommended trip (lowest anxiety in top 5)
- User can hover → tooltip shows quick details
- User can click any cell → DetailModal opens

### DetailModal with Anxiety Report

```
DetailModal
├─ Trip Summary
│  └─ Barcelona (BCN) → London (LHR) | Apr 10-22 | 2 adults
│
├─ Price Breakdown
│  ├─ Outbound Flight: €220
│  ├─ Return Flight: €180
│  ├─ Hotel (4 nights): €400
│  └─ Total: €800
│
├─ 🟢 ANXIETY ANALYSIS
│  ├─ Anxiety Level: Not Stressful
│  ├─ Breakdown:
│  │  ├─ Fatigue Risk: Low ✓
│  │  │  └─ "2h15m direct flight, departs morning"
│  │  ├─ Conflicts: None detected ✓
│  │  │  └─ "Arrival 10:15am, check-in 14:00"
│  │  ├─ Complexity: Simple
│  │  │  └─ "Direct flight, no layovers"
│  │  └─ Rest Days: Good
│  │     └─ "Trip starts evening, full day to settle in"
│  │
│  └─ Recommendation: "Excellent choice! Low anxiety. Book with confidence."
│
├─ Flight Details
│  └─ [existing flight cards]
│
├─ Hotel Details
│  └─ [existing hotel cards]
│
└─ "Book on Kiwi" Button
```

**Loading state (first click):**
```
[Analyzing trip anxiety...] (spinner)
```

**Cached state (second+ click):**
```
Instant display of anxiety report
```

### Recommendation Notification

After HeatMap analysis completes:

```
✨ Trip Assistant recommends: Apr 22 departure
   Not Stressful • 2h direct flight • €510 total
   View Details ↗
```

User can click to open DetailModal or ignore.

---

## Warnings & Recommendations

### Warnings (displayed in DetailModal)

Examples of warnings that should appear:

- ⚠️ "**Tight Connection:** 1 hour to transfer in Frankfurt (tight for international connection)"
- ⚠️ "**Red-Eye Flight:** Arriving 08:15am. Recommend rest day before activities"
- ⚠️ "**Late Arrival:** Hotel check-in not available until 3pm. Early arrival may incur fees"
- ⚠️ "**Multi-Day Flights:** 2 layovers + 12h total time. High fatigue risk"
- ⚠️ "**Jet Lag:** 8-hour time difference. Plan easy first day"

### Recommendations

- ✓ "**Good:** Arrival evening gives time to settle in"
- ✓ "**Good:** 4-night trip gives time to recover from travel fatigue"
- ✓ "**Pro Tip:** Direct flight means fresher arrival"

---

## Data & Caching

### AnxietyAnalyzer Service Signature

```javascript
analyzeTrip(cellData, searchParams, tripLength)
  → {
      anxietyLevel: 'not_stressful' | 'medium' | 'very_stressful',
      score: number (0.0-1.0),
      factors: {
        fatigueRisk: number,
        conflictRisk: number,
        complexity: number,
        restPenalty: number
      },
      warnings: string[],
      recommendations: string[],
      timestamp: ISO string
    }
```

### Caching Strategy

- **HeatMap analysis:** Cache top 5 scores in React state (survives modal open/close)
- **DetailModal analysis:** Cache individual trip analyses in DetailModal component state
- **Invalidation:** Clear cache when user new searches or navigates away

### Performance Targets

- **HeatMap load:** <1 second (no analysis blocking)
- **Badges appear:** 2-3 seconds after load (top 5 analysis)
- **DetailModal first click:** <2 seconds (on-demand analysis + spinner)
- **DetailModal subsequent clicks:** <100ms (cached)

---

## Integration Points

### SearchParams Extension

`SearchParams` already includes:
- origin, destination, startDate, endDate, adults, children, budgetMin, budgetMax

**No changes needed** — tripLength already flows through from SearchForm/ChatInput.

### Component Props

**HeatMap.jsx:**
```javascript
<HeatMap 
  searchParams={searchParams}  // includes tripLength
  onSelectCell={onSelectCell}
  // ... existing props
/>
```

**DetailModal.jsx:**
```javascript
<DetailModal 
  isOpen={isOpen}
  cellData={cellData}
  searchParams={searchParams}  // includes tripLength
  // ... existing props
/>
```

---

## Testing Strategy

### Unit Tests (AnxietyAnalyzer)

- ✓ Fatigue calculation respects trip duration multiplier
- ✓ Conflict detection catches tight connections
- ✓ Anxiety score boundaries (0.0-1.0)
- ✓ Category assignment (🟢/🟡/🔴 thresholds)
- ✓ Warning generation (correct messages for scenarios)

### Integration Tests

- ✓ Search triggers analysis in background
- ✓ Badges appear on HeatMap after analysis
- ✓ ⭐ Recommended badge on best option
- ✓ DetailModal shows anxiety report on click
- ✓ Caching prevents duplicate analysis

### Manual Testing

- ✓ 3-day trip: red-eye marked 🔴, direct marked 🟢
- ✓ 14-day trip: red-eye marked 🟡, direct marked 🟢
- ✓ Tight connections flagged with warning
- ✓ Hotel timing conflicts detected
- ✓ Mobile responsive (badges visible on small screens)

---

## Success Criteria

✅ Users can see anxiety level for recommended trip immediately after search  
✅ Users understand WHY a trip is recommended (clear factors breakdown)  
✅ Users can override recommendation and explore alternatives  
✅ Anxiety analysis doesn't slow down HeatMap load  
✅ Trip duration (3d vs 14d) affects anxiety differently  
✅ Warnings help users avoid booking problematic combinations  
✅ Users feel confident booking their choice  

---

## Out of Scope (Phase 2+)

- Custom anxiety weights per user
- Travel style profiles ("adventure" vs "comfort")
- Integration with real calendar (detect actual conflicts)
- Notifications for price drops on recommended trips
- Comparison view (show 3 options ranked by anxiety)

---

## Questions for Review

1. **Anxiety thresholds:** Are 0.35 and 0.65 the right cutoffs, or should we adjust?
2. **Trip duration multipliers:** Are 1.5×, 1.0×, 0.7× appropriate, or should they be different?
3. **Warning specificity:** Should warnings be more detailed (e.g., "Frankfurt connections typically require 1h45m minimum")?
4. **Mobile UX:** On small screens, should badges be simplified or full detail?
5. **Recommendation persistence:** Should "Recommended" badge stay on best option even if user clicks others?

---

## Appendix: Example Anxiety Scenarios

(See "Scoring Formula" section above for detailed examples with 3-day and 14-day trips)
