# Implementation Plan: Anxiety-Driven Trip Planning

**Date:** 2026-04-02  
**Spec:** `docs/superpowers/specs/2026-04-02-anxiety-driven-trip-planning-design.md`  
**Estimated Duration:** 4-5 hours (7-8 focused tasks)  
**Approach:** Incremental implementation with verification at each step

---

## Task Breakdown

### Phase 1: Core Service (AnxietyAnalyzer)

#### Task 1: Create AnxietyAnalyzer Service
**File:** `src/services/anxietyAnalyzer.js` (NEW)  
**Duration:** 45 minutes  
**Complexity:** Medium

**Requirements:**
- Implement `analyzeTrip(cellData, searchParams, tripLength)` function
- Calculate fatigue risk with trip duration multiplier
- Calculate conflict risk (tight connections, hotel timing)
- Calculate complexity (direct vs layovers)
- Calculate rest penalty
- Return anxiety level (not_stressful, medium, very_stressful) + numeric score
- Generate warnings array
- Generate recommendations array

**Code Structure:**
```javascript
export function analyzeTrip(cellData, searchParams, tripLength) {
  const fatigueRisk = calculateFatigue(cellData, tripLength);
  const conflictRisk = calculateConflicts(cellData, searchParams);
  const complexity = calculateComplexity(cellData);
  const restPenalty = calculateRestPenalty(cellData, tripLength);
  
  const score = (fatigueRisk * 0.4) + (conflictRisk * 0.3) + (complexity * 0.2) + (restPenalty * 0.1);
  const level = getAnxietyLevel(score);
  
  return {
    anxietyLevel: level,
    score,
    factors: { fatigueRisk, conflictRisk, complexity, restPenalty },
    warnings: generateWarnings(cellData, fatigueRisk, conflictRisk),
    recommendations: generateRecommendations(cellData, tripLength)
  };
}
```

**Sub-functions to implement:**
- `calculateFatigue(cellData, tripLength)` - handles duration multipliers
- `calculateConflicts(cellData, searchParams)` - detects tight connections, check-in issues
- `calculateComplexity(cellData)` - counts layovers
- `calculateRestPenalty(cellData, tripLength)` - trip-duration-aware rest analysis
- `getAnxietyLevel(score)` - maps 0.0-1.0 to category
- `generateWarnings()` - returns warning strings
- `generateRecommendations()` - returns recommendation strings

**Test Cases:**
- ✓ 3-day direct flight → 🟢 Not Stressful (score < 0.35)
- ✓ 3-day red-eye + layover → 🔴 Very Stressful (score > 0.65)
- ✓ 14-day red-eye + layover → 🟡 Medium (score 0.35-0.65, multiplier reduces fatigue)
- ✓ Tight connection detected in warnings
- ✓ Hotel check-in conflict detected

**Acceptance:** Service exports single function, all 4 test cases pass

---

#### Task 2: Add Unit Tests for AnxietyAnalyzer
**File:** `src/services/anxietyAnalyzer.test.js` (NEW)  
**Duration:** 30 minutes  
**Complexity:** Low

**Requirements:**
- Test fatigue multipliers: 3-5d (×1.5), 7-10d (×1.0), 14+d (×0.7)
- Test anxiety level boundaries: 0.35, 0.65
- Test warning generation (at least 3 warning types)
- Test recommendation generation
- Test edge cases (all direct flights, all conflicts)

**Acceptance:** All tests pass, coverage >80%

---

### Phase 2: UI Components

#### Task 3: Create AnxietyBadge Component
**File:** `src/components/AnxietyBadge.jsx` (NEW)  
**Duration:** 20 minutes  
**Complexity:** Low

**Requirements:**
- Display small colored badge: 🟢 | 🟡 | 🔴
- Accept `anxietyLevel` prop (not_stressful, medium, very_stressful)
- Inline styling (no full width)
- Dark mode support
- Tailwind CSS

**Usage:**
```javascript
<AnxietyBadge anxietyLevel="not_stressful" />
// Renders: 🟢 (small badge)
```

**Acceptance:** Renders correctly in all three states, dark mode works

---

#### Task 4: Create RecommendationBadge Component
**File:** `src/components/RecommendationBadge.jsx` (NEW)  
**Duration:** 15 minutes  
**Complexity:** Low

**Requirements:**
- Display ⭐ "Recommended" badge
- Overlay on HeatMap cell or notification style
- Props: `isRecommended` (boolean)
- Dark mode support

**Acceptance:** Renders when `isRecommended=true`, hidden when false

---

#### Task 5: Create AnxietyReport Component
**File:** `src/components/AnxietyReport.jsx` (NEW)  
**Duration:** 45 minutes  
**Complexity:** Medium

**Requirements:**
- Display anxiety score with large colored icon (🟢/🟡/🔴)
- Show anxiety level text ("Not Stressful", "Medium", "Very Stressful")
- Display factors breakdown (Fatigue, Conflicts, Complexity, Rest)
- List warnings with ⚠️ icons
- List recommendations with ✓ icons
- Show "Analyzing..." loading state
- Dark mode support
- Responsive layout (mobile-friendly)

**Props:**
```javascript
{
  anxietyData: {
    anxietyLevel: string,
    score: number,
    factors: {fatigueRisk, conflictRisk, complexity, restPenalty},
    warnings: string[],
    recommendations: string[]
  },
  isLoading: boolean
}
```

**Example Output:**
```
🟢 Not Stressful
Score: 0.32/1.0

Factors:
• Fatigue Risk: Low
• Conflicts: None
• Complexity: Simple
• Rest Days: Good

Warnings:
(none)

Recommendations:
✓ Good: Arrival evening gives time to settle
✓ Direct flight means fresher arrival
```

**Acceptance:** All fields render correctly, loading state works, mobile responsive

---

### Phase 3: Integration

#### Task 6: Modify HeatMap Component
**File:** `src/components/HeatMap.jsx` (MODIFY)  
**Duration:** 60 minutes  
**Complexity:** High

**Changes:**
1. Add state for anxiety analyses:
   ```javascript
   const [anxietyCache, setAnxietyCache] = useState({});
   const [analyzingTop5, setAnalyzingTop5] = useState(true);
   const [recommendedCell, setRecommendedCell] = useState(null);
   ```

2. After flights load, extract top 5 cheapest and analyze:
   ```javascript
   useEffect(() => {
     if (flightData && Object.keys(flightData).length > 0) {
       const sortedCells = getSortedCells(flightData); // cheapest first
       const top5 = sortedCells.slice(0, 5);
       
       analyzeTop5(top5).then(results => {
         setAnxietyCache(prev => ({...prev, ...results}));
         
         // Find best (lowest score) among top 5
         const best = top5.reduce((best, cell) => {
           const cellKey = `${cell.departureDate}__${cell.returnDate}`;
           const bestKey = `${best.departureDate}__${best.returnDate}`;
           return (results[cellKey]?.score || 1.0) < (results[bestKey]?.score || 1.0) ? cell : best;
         });
         
         setRecommendedCell(`${best.departureDate}__${best.returnDate}`);
         setAnalyzingTop5(false);
       });
     }
   }, [flightData, searchParams]);
   ```

3. Modify cell rendering to include badges:
   ```javascript
   // In cell render:
   {anxietyCache[cellKey] && (
     <AnxietyBadge anxietyLevel={anxietyCache[cellKey].anxietyLevel} />
   )}
   {recommendedCell === cellKey && (
     <RecommendationBadge isRecommended={true} />
   )}
   ```

4. Add "Analyzing..." indicator while top 5 is being processed
5. Pass `searchParams.tripLength` to anxiety analyzer

**Test Cases:**
- ✓ Top 5 cells show anxiety badges after analysis
- ✓ Recommended cell highlighted with ⭐
- ✓ Clicking any cell still opens DetailModal
- ✓ Loading indicator appears during analysis

**Acceptance:** Badges appear on HeatMap within 3 seconds, recommended cell highlighted

---

#### Task 7: Modify DetailModal Component
**File:** `src/components/DetailModal.jsx` (MODIFY)  
**Duration:** 45 minutes  
**Complexity:** Medium

**Changes:**
1. Add state for anxiety analysis:
   ```javascript
   const [anxietyReport, setAnxietyReport] = useState(null);
   const [loadingAnxiety, setLoadingAnxiety] = useState(false);
   ```

2. When DetailModal opens, check if anxiety already cached:
   ```javascript
   useEffect(() => {
     if (isOpen && cellData) {
       const cellKey = `${cellData.departureDate}__${cellData.returnDate}`;
       
       // Check if already in HeatMap cache (prop passed down)
       if (anxietyCache?.[cellKey]) {
         setAnxietyReport(anxietyCache[cellKey]);
       } else {
         // Analyze on demand
         setLoadingAnxiety(true);
         analyzeTrip(cellData, searchParams, searchParams.tripLength)
           .then(result => {
             setAnxietyReport(result);
             setLoadingAnxiety(false);
           });
       }
     }
   }, [isOpen, cellData]);
   ```

3. Add AnxietyReport section in render:
   ```javascript
   {/* After Price Breakdown, before Flight Details */}
   {anxietyReport && (
     <div className="border-t border-gray-200 dark:border-gray-800 py-6">
       <AnxietyReport anxietyData={anxietyReport} isLoading={loadingAnxiety} />
     </div>
   )}
   ```

4. Props: Accept `anxietyCache` and `tripLength` from parent
5. Show loading spinner while analyzing

**Test Cases:**
- ✓ Anxiety report shows immediately if cached
- ✓ Anxiety report appears after ~2s if not cached
- ✓ All warnings and recommendations display
- ✓ Loading state is visible

**Acceptance:** Anxiety report displays in DetailModal, cached lookups are instant

---

#### Task 8: Modify ResultsPage Component
**File:** `src/components/ResultsPage.jsx` (MODIFY)  
**Duration:** 30 minutes  
**Complexity:** Low

**Changes:**
1. Pass `anxietyCache` from HeatMap to DetailModal as prop
2. Show recommendation notification when HeatMap analysis completes
   ```javascript
   // After HeatMap loads and top 5 analyzed:
   {recommendedCell && !analyzingTop5 && (
     <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
       <p className="text-sm text-blue-900 dark:text-blue-100">
         ✨ Trip Assistant recommends: {formatDate(recommendedCell.date)} 
         • {recommendedCell.anxietyLevel} • {recommendedCell.price}
         <button onClick={() => openDetailModal(recommendedCell)}>
           View Details →
         </button>
       </p>
     </div>
   )}
   ```

**Test Cases:**
- ✓ Notification appears after analysis
- ✓ Clicking "View Details" opens DetailModal
- ✓ Notification disappears on new search

**Acceptance:** Recommendation notification appears and works

---

### Phase 4: Verification

#### Task 9: End-to-End Testing
**Duration:** 30 minutes  
**Complexity:** Medium

**Test Scenarios:**
1. **Search (3-day trip, cheap direct flight)**
   - ✓ HeatMap loads instantly
   - ✓ Badges appear within 3 seconds
   - ✓ Direct flight marked 🟢
   - ✓ Notification shows recommendation

2. **Search (3-day trip, red-eye + layover)**
   - ✓ Red-eye option marked 🔴
   - ✓ Recommendation is the direct/less anxious option
   - ✓ DetailModal shows "Very Stressful" with fatigue warnings

3. **Search (14-day trip, same red-eye + layover)**
   - ✓ Same flight marked 🟡 (not 🔴)
   - ✓ Score differs due to trip duration multiplier
   - ✓ Warnings still show but recommendations soften

4. **DetailModal Caching**
   - ✓ First click on cell: shows "Analyzing..." then report
   - ✓ Second click on same cell: instant report display
   - ✓ Different cell: shows "Analyzing..." again

5. **Mobile Responsive**
   - ✓ Badges visible on small screens
   - ✓ AnxietyReport readable on mobile
   - ✓ No layout breaks

**Acceptance:** All 5 scenarios pass

---

## Dependencies & Order

**Critical Path:**
1. Task 1 (AnxietyAnalyzer) - **BLOCKER**
2. Task 2 (Unit tests) - validates Task 1
3. Task 3, 4, 5 (UI components) - can run parallel
4. Task 6 (HeatMap integration) - requires Task 1 + Task 3, 4, 5
5. Task 7 (DetailModal integration) - requires Task 1 + Task 5
6. Task 8 (ResultsPage integration) - requires Task 6, 7
7. Task 9 (E2E testing) - final validation

**Suggested Execution:**
- Day 1: Tasks 1-2 (service + tests) = 1.25h
- Day 1: Tasks 3-5 (UI components) in parallel = 1.25h
- Day 1: Task 6 (HeatMap) = 1h
- Day 2: Task 7 (DetailModal) = 45 min
- Day 2: Task 8 (ResultsPage) = 30 min
- Day 2: Task 9 (Testing) = 30 min

**Total: ~5 hours**

---

## Success Criteria

- ✅ All 9 tasks completed and tested
- ✅ No regressions in existing features (HeatMap, DetailModal still work)
- ✅ Anxiety badges appear on HeatMap within 3 seconds
- ✅ Recommended trip highlighted with ⭐
- ✅ DetailModal shows anxiety report with all factors
- ✅ Trip duration correctly affects anxiety scores
- ✅ Warnings and recommendations accurate
- ✅ Dark mode works throughout
- ✅ Mobile responsive
- ✅ All unit tests pass
- ✅ E2E testing scenarios pass

---

## Rollback Plan

If any task fails:
1. Revert last commit
2. Fix issue in new branch
3. Re-run tests
4. Re-merge

Since we're adding new files (not modifying core logic), rollback is low-risk.

---

## Notes

- **Performance:** Analyze top 5 cells in background (non-blocking)
- **Caching:** Keep anxiety results in component state (clears on new search)
- **UX:** Show loading state while analyzing (build confidence)
- **Testing:** TDD where possible (tests for service, then components)
- **Git:** Commit after each 2-task group (milestones)

---

## Ready to Execute?

All tasks are specified with exact file paths, code structure, and acceptance criteria. Each task is 2-5 minutes of focused work. Ready to start? 🚀
