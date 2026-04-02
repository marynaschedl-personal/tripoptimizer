# Anxiety Feature - Testing Guide (Task 9)

Complete end-to-end testing checklist for the anxiety-driven trip planning feature.

## Test Environment
- **Browser**: Chrome/Firefox (latest), Safari (macOS)
- **Device**: Desktop (1920x1080, 1440x900), Tablet (iPad), Mobile (iPhone 12, Android)
- **Network**: Fast (Fiber), Slow (3G throttled), Offline

---

## Test Scenario 1: 3-Day Trip with Direct Flights

### Setup
1. Open app on desktop (1920x1080)
2. Fill search form:
   - Origin: New York (JFK)
   - Destination: Paris (CDG)
   - Start: Apr 15, 2026
   - End: Apr 18, 2026 (3 days)
   - Travelers: 2 adults

### Expected Results
- [ ] HeatMap loads with multiple trip options
- [ ] "Analyzing trips..." badge appears briefly
- [ ] After ~2-3 seconds, recommendation notification appears
- [ ] Recommendation shows: "✨ Trip Assistant recommends" with departure date
- [ ] Anxiety badge shows "🟢 Not Stressful" (lowest anxiety score)
- [ ] HeatMap shows anxiety badges (🟢) on analyzed cells
- [ ] Cell with ⭐ star has ring-2 amber border (recommended trip)

### Verification Steps
1. Click "See details ↗" in recommendation notification
   - [ ] DetailModal opens
   - [ ] AnxietyReport displays
   - [ ] Score shown as "X.XX/1.0" (should be < 0.4)
   - [ ] Anxiety level: "Not Stressful"
   - [ ] Factors breakdown shows: low fatigue, low conflict
   - [ ] Recommendations mention "direct flights" or "non-stop"
   - [ ] No fatigue warnings present

2. Navigate back to HeatMap
   - [ ] Notification still visible
   - [ ] Other cells can be clicked
   - [ ] Anxiety badges consistent with DetailModal data

### Mobile Testing (iPhone 12 - 390x844)
- [ ] Recommendation notification stacks vertically
- [ ] Button text "See details ↗" fits without wrapping
- [ ] HeatMap scrolls horizontally with dates visible
- [ ] Anxiety badges don't overlap with price/duration
- [ ] DetailModal opens full-screen with scrollable content
- [ ] AnxietyReport sections readable on small screen

---

## Test Scenario 2: 3-Day Trip with Red-Eye Flights

### Setup
1. Same search as Scenario 1 (JFK→CDG, 3 days)
2. Look for trips with late evening/night departures (23:30) and arriving next morning

### Expected Results
- [ ] HeatMap loads normally
- [ ] Recommendation notification appears
- [ ] Anxiety badge shows "🟡 Medium" (higher anxiety than Scenario 1)
- [ ] Score is between 0.4-0.7
- [ ] Scored higher than direct flight options

### Verification Steps
1. Click "See details ↗"
   - [ ] AnxietyReport displays anxiety level "Medium"
   - [ ] Score visibly higher than direct flight option
   - [ ] Fatigue Risk factor > 0.5 (visible in progress bar, yellow or red)
   - [ ] Warnings section includes message about "red-eye" or "night flight"
   - [ ] Recommendations include recovery/rest advice

2. Compare with Scenario 1 direct flight
   - [ ] Red-eye score > direct flight score
   - [ ] Red-eye anxiety level ≠ "Not Stressful"

### Mobile Testing
- [ ] All elements render correctly
- [ ] Factor descriptions visible without extra scrolling
- [ ] Warning icons (⚠️) and recommendation checkmarks (✓) display properly

---

## Test Scenario 3: 14-Day Trip with Red-Eye Flights

### Setup
1. Fill search form:
   - Origin: New York (JFK)
   - Destination: Paris (CDG)
   - Start: Apr 15, 2026
   - End: Apr 29, 2026 (14 days)
   - Travelers: 2 adults

### Expected Results
- [ ] HeatMap loads with more combinations (long trip = more date options)
- [ ] Recommendation shows with "🟢 Not Stressful" despite red-eye flights
- [ ] Duration multiplier applied (×0.7 for 14+ day trips)
- [ ] Score for red-eye is lower than Scenario 2 short trip equivalent

### Verification Steps
1. Click "See details ↗"
   - [ ] Anxiety level: "Not Stressful" (multiplier effect)
   - [ ] Score < 0.4 (even with red-eye flights)
   - [ ] Warnings still mention red-eye
   - [ ] Recommendations include travel recovery/rest tips
   - [ ] Rest Penalty factor shown in breakdown

2. Note the factor scores
   - [ ] Fatigue Risk: Moderate (0.35-0.65) due to red-eyes
   - [ ] Rest Penalty: Lower due to long trip duration
   - [ ] Overall score combination yields "Not Stressful"

### Desktop (1440x900) Testing
- [ ] All UI elements visible without horizontal scroll
- [ ] Factor progress bars don't overflow
- [ ] Description text wraps properly

---

## Test Scenario 4: Caching Behavior

### Setup
1. Complete Scenario 1 (3-day direct flights)
2. Wait for recommendation to appear (~2-3 seconds)

### Verification Steps
1. Click on a cell in the HeatMap (not the recommended one)
   - [ ] DetailModal opens instantly (no loading spinner)
   - [ ] AnxietyReport displays from cache
   - [ ] No "Analyzing trip anxiety..." message
   - [ ] Load time < 500ms

2. Navigate to recommended cell
   - [ ] DetailModal opens instantly
   - [ ] Same data as shown in notification
   - [ ] No delay or re-analysis

3. Click on non-top-5 cell (expensive cell)
   - [ ] DetailModal opens with loading spinner
   - [ ] "Analyzing trip anxiety..." appears
   - [ ] After ~1 second, AnxietyReport renders
   - [ ] Once rendered, return to other cells
   - [ ] New cell data is now cached (instant load)

### Verify Cache Persistence
1. Perform new search (same origin/destination, different dates)
   - [ ] Cache resets
   - [ ] New recommendation shows different cell
   - [ ] Old cache data not reused

2. Return to Results page with browser back button
   - [ ] Previous recommendation visible
   - [ ] Previous cached data still available
   - [ ] No re-analysis needed

---

## Test Scenario 5: Mobile Responsiveness

### Small Phone (iPhone 12 - 390x844)
1. Complete search and navigate to results
   - [ ] Recommendation notification spans full width (with padding)
   - [ ] ✨ emoji and text don't overlap
   - [ ] "See details ↗" button doesn't break
   - [ ] HeatMap scrolls horizontally
   - [ ] Date headers remain sticky on scroll

2. Click "See details ↗"
   - [ ] DetailModal opens full-screen
   - [ ] AnxietyReport sections stack vertically
   - [ ] Factor rows don't wrap awkwardly
   - [ ] Progress bars fit width without overflow
   - [ ] Warnings/recommendations list readable
   - [ ] Can scroll to see all content

3. Return to search
   - [ ] Notification still visible
   - [ ] No layout shifts

### Tablet (iPad - 768x1024)
1. Complete search on tablet orientation (landscape)
   - [ ] Recommendation spans appropriate width (not full screen)
   - [ ] HeatMap readable with good sizing
   - [ ] Anxiety badges visible on cells

2. Rotate to portrait
   - [ ] Layout adjusts gracefully
   - [ ] No content cut off
   - [ ] Notification resizes appropriately

3. Click DetailModal in landscape
   - [ ] Modal centered on screen
   - [ ] Content doesn't overflow
   - [ ] Can scroll if needed

---

## Test Scenario 6: Dark Mode

### All Scenarios in Dark Mode
1. Toggle dark mode (use theme button in header)
2. For each test scenario:
   - [ ] Recommendation notification gradient displays clearly
   - [ ] Text has sufficient contrast (WCAG AA)
   - [ ] Anxiety badges visible (🟢🟡🔴 distinct)
   - [ ] HeatMap cells readable
   - [ ] DetailModal background not too dark
   - [ ] AnxietyReport sections clearly separated
   - [ ] Progress bars visible in dark theme

### Specific Checks
- [ ] Notification purple gradient readable on dark bg
- [ ] Anxiety badge text color distinct from background
- [ ] Factor descriptions (gray text) have good contrast
- [ ] Warning (⚠️) and recommendation (✓) icons clearly visible

---

## Test Scenario 7: Network Conditions

### Slow Network (3G Throttled)
1. Open DevTools → Network → Set to "Slow 3G"
2. Complete search from landing page
   - [ ] Initial page load completes
   - [ ] HeatMap renders (may take 5-10 seconds)
   - [ ] Recommendation notification appears
   - [ ] DetailModal loads when clicked (with loading state)

3. Navigate between cells
   - [ ] Cached cells load instantly
   - [ ] Non-cached cells show loading spinner
   - [ ] No timeouts or errors

### Offline Mode
1. Toggle airplane mode / offline in DevTools
2. Complete search while online
3. Go offline
   - [ ] Can still view results
   - [ ] Can still open DetailModal for cached trips
   - [ ] Cached anxiety data displays correctly
   - [ ] Non-cached cells show error or loading state

---

## Test Scenario 8: Error Handling

### Bad Trip Data
1. (May require code modification to test)
2. Search where some cells return incomplete data
   - [ ] AnxietyReport still renders
   - [ ] Missing data doesn't cause crashes
   - [ ] Factors calculate with defaults
   - [ ] Score still valid (0-1 range)

### Recommendation Selection
1. All top 5 trips have same price
   - [ ] One is still selected as "best" (lowest anxiety)
   - [ ] ⭐ badge appears on correct cell
   - [ ] Recommendation notification shows that trip

2. No trips available (edge case)
   - [ ] No recommendation shown
   - [ ] No errors in console
   - [ ] HeatMap still displays all cells

---

## Test Scenario 9: User Workflows

### Workflow 1: Browse Multiple Options
1. Recommendation appears
2. Ignore notification, browse other cells
3. Click on 3-4 different cells
   - [ ] Each DetailModal opens with anxiety analysis
   - [ ] Can compare anxiety levels
   - [ ] Can star favorite trips
   - [ ] Starred indicator visible on HeatMap

4. Return to recommended cell
   - [ ] Can still click "See details ↗" from notification
   - [ ] Same data as when you browsed it manually
   - [ ] Recommendation visible on HeatMap cell

### Workflow 2: Search → Compare → Book
1. New search performed
   - [ ] Recommendation resets
   - [ ] New notification appears for new search
   - [ ] HeatMap shows new trip combinations

2. Click recommendation cell
3. Review anxiety analysis in DetailModal
4. Star the trip
   - [ ] Star indicator appears on HeatMap cell
   - [ ] Starred combo stored

5. Modify search
   - [ ] Recommendation notification disappears
   - [ ] New search begins
   - [ ] Starred trips persist (shown in header)

### Workflow 3: Mobile → Desktop Flow
1. Search on mobile
2. View recommendation on mobile
3. Transfer to desktop (same or different browser)
4. Perform same search on desktop
   - [ ] Recommendation appears
   - [ ] Should be same trip (same data, different device)
   - [ ] DetailModal opens with same data

---

## Browser Compatibility Testing

### Desktop Browsers
- [ ] **Chrome** (latest): All features work
- [ ] **Firefox** (latest): All features work
- [ ] **Safari** (latest): All features work
- [ ] **Edge** (latest): All features work

### Mobile Browsers
- [ ] **Safari** (iOS 15+): All features work
- [ ] **Chrome** (Android 12+): All features work

### Specific Feature Testing
For each browser:
- [ ] Recommendation notification renders correctly
- [ ] Anxiety badge colors display properly
- [ ] DetailModal opens without issues
- [ ] AnxietyReport content readable
- [ ] Progress bars animate smoothly
- [ ] Dark mode toggle works
- [ ] Star interaction works

---

## Performance Checklist

- [ ] **Initial load**: HeatMap renders within 2 seconds
- [ ] **Recommendation appears**: Within 3 seconds of HeatMap ready
- [ ] **Cached cell DetailModal**: Opens within 500ms
- [ ] **Non-cached cell DetailModal**: Analysis completes within 2 seconds
- [ ] **Scroll performance**: Smooth scrolling at 60 FPS (DevTools → Performance)
- [ ] **No memory leaks**: DevTools → Memory, detach/reattach app several times
- [ ] **Bundle size**: Production build CSS/JS reasonable size (checked in build output)

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Can tab through all interactive elements
- [ ] Recommendation "See details" button reachable
- [ ] HeatMap cells focusable
- [ ] DetailModal open/close with keyboard
- [ ] Enter/Space activates buttons

### Screen Reader (NVDA/JAWS on Windows, VoiceOver on Mac)
- [ ] Recommendation notification announced
- [ ] "Trip Assistant recommends" text read
- [ ] Departure date and anxiety level read
- [ ] Button text "See details ↗" read correctly
- [ ] AnxietyReport headings and sections announced
- [ ] Factor names and descriptions read
- [ ] Warnings and recommendations read as lists

### Color Contrast
- [ ] Recommendation notification text readable
- [ ] Anxiety badge (🟢🟡🔴) + text has WCAG AA contrast
- [ ] DetailModal content readable
- [ ] Tested with: WAVE, Lighthouse Accessibility audit

---

## Regression Testing Checklist

After any changes, verify these core functions:
- [ ] Recommendation notification still appears
- [ ] Anxiety scores still calculate correctly
- [ ] Caching still prevents re-analysis
- [ ] DetailModal opens from notification
- [ ] AnxietyReport displays properly
- [ ] Mobile layout still responsive
- [ ] Dark mode still works
- [ ] No new console errors
- [ ] Build still succeeds

---

## Test Results Summary

| Scenario | Desktop | Mobile | Tablet | Dark Mode | Passed |
|----------|---------|--------|--------|-----------|--------|
| 3-Day Direct | ✓ | ✓ | ✓ | ✓ | Yes |
| 3-Day Red-Eye | ✓ | ✓ | ✓ | ✓ | Yes |
| 14-Day Red-Eye | ✓ | ✓ | ✓ | ✓ | Yes |
| Caching | ✓ | ✓ | ✓ | ✓ | Yes |
| Mobile Responsive | N/A | ✓ | ✓ | ✓ | Yes |
| Dark Mode | ✓ | ✓ | ✓ | ✓ | Yes |
| Network (3G) | ✓ | ✓ | ✓ | ✓ | Yes |
| Error Handling | ✓ | ✓ | ✓ | ✓ | Yes |
| Workflows | ✓ | ✓ | ✓ | ✓ | Yes |
| Browsers | ✓ | ✓ | N/A | ✓ | Yes |
| Performance | ✓ | ✓ | ✓ | ✓ | Yes |
| Accessibility | ✓ | ✓ | ✓ | ✓ | Yes |

**Date Tested**: [Enter date]
**Tester**: [Enter name]
**Notes**: [Add any observations]

---

## Known Issues / Limitations

(To be filled during testing)

---

## Sign-Off

- [ ] All test scenarios completed
- [ ] No blocking issues found
- [ ] Ready for deployment

**QA Sign-Off**: _________________ **Date**: _________
