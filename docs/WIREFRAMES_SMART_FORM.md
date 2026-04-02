# Wireframes: Smart Form (Progressive Disclosure)
**Design Direction**: Multi-step journey optimized for mobile & desktop
**Status**: Ready for development

---

## 📱 Landing Page (Simplified Hero)

### Desktop View
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ✈️ TripOptimizer                                    🌙 Toggle  │
│                                                                 │
│  [Gradient purple/blue background with subtle orbs]            │
│                                                                 │
│                                                                 │
│                    Find Your Least Stressful Trip              │
│                                                                 │
│                   In seconds. Not hours. Not days.             │
│                                                                 │
│                                                                 │
│          ┌──────────────────────────────────────────┐          │
│          │ Where are you going?                     │          │
│          │                                          │          │
│          │ From:  [Search cities...       ▼]       │          │
│          │ To:    [Search cities...       ▼]       │          │
│          │                                          │          │
│          │    [Continue →]                         │          │
│          └──────────────────────────────────────────┘          │
│                                                                 │
│          Powered by real prices · Optimized for your stress    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────────────┐
│ ✈️ TripOptimizer   🌙        │
├──────────────────────────────┤
│ [Purple gradient background] │
│                              │
│   Find Your Least            │
│   Stressful Trip             │
│                              │
│   In seconds. Not hours.     │
│                              │
├──────────────────────────────┤
│                              │
│  From: [Search...        ]   │
│  To:   [Search...        ]   │
│                              │
│  [Continue →]               │
│                              │
├──────────────────────────────┤
│ Real prices · Your stress    │
└──────────────────────────────┘
```

**Key Changes**:
- ❌ Remove "Trip Assistant" hero (confusing)
- ❌ Remove "Natural Language vs Form" toggle
- ✅ Single, clear question: "Where?"
- ✅ Minimal cognitive load
- ✅ Mobile-first sizing

---

## 📝 Step 1: Route Selection

### Desktop View
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ✈️ TripOptimizer                                 Step 1 / 3   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Where & When?                                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  From:                                                  │  │
│  │  [🇬🇧 London, UK                      ✓]              │  │
│  │                                                         │  │
│  │  To:                                                    │  │
│  │  [🇪🇸 Barcelona, Spain                ▼]              │  │
│  │  (or start typing)                                      │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Trip length:  🎯 Quick preset or custom?               │  │
│  │                                                         │  │
│  │  [3 nights] [5 nights] [7 nights] [10 nights]          │  │
│  │  [14 nights]        [Custom dates]                     │  │
│  │                                                         │  │
│  │  Departure:  [May 1 ▼]     Return: [May 8]  (auto)    │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│                  [← Back]                    [Continue →]      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────────────┐
│ ✈️ TripOptimizer    Step 1/3  │
├──────────────────────────────┤
│                              │
│  Where & When?               │
│                              │
│  From:                       │
│  [🇬🇧 London         ▼]       │
│                              │
│  To:                         │
│  [🇪🇸 Barcelona      ▼]       │
│                              │
│  Trip length:                │
│  [3] [5] [7] [10] [14]      │
│  [Custom]                    │
│                              │
│  Departure:                  │
│  [May 1          ▼]         │
│                              │
│  Return (auto):              │
│  [May 8          ▼]         │
│                              │
├──────────────────────────────┤
│ [← Back]     [Continue →]    │
└──────────────────────────────┘
```

**Key Features**:
- ✅ City dropdowns with search
- ✅ Quick trip length presets (visual buttons, not a select)
- ✅ Auto-calculated return date
- ✅ Clear step indicator (1/3)
- ✅ Mobile-friendly: stack vertically, large touch targets

**Interactions**:
- User types city name → filtered dropdown
- User clicks preset (3/5/7 nights) → date auto-calculates
- User can customize dates manually → switches to "custom"
- Continue button only enabled when both cities + dates selected

---

## 👥 Step 2: Travelers & Preferences

### Desktop View
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ✈️ TripOptimizer                                 Step 2 / 3   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tell us about your trip                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Who's traveling?                                        │  │
│  │                                                         │  │
│  │  👤 You (adult)                                         │  │
│  │  [+ Add traveler]                                       │  │
│  │                                                         │  │
│  │  Suggested:  2 adults, 0 children                       │  │
│  │              [Customize ↗]                             │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  What matters most to you? (Pick your priorities)              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  Comfort vs. Budget                                     │  │
│  │  Budget ←●━━━━━━━━━━━━━━━━━━━━━→ Comfort              │  │
│  │  "I'll fly cheap if I have to"    "Worth paying more"  │  │
│  │                                                         │  │
│  │  Morning vs. Flexibility                                │  │
│  │  Morning ←━━●━━━━━━━━━━━━━━━━━→ Flexibility           │  │
│  │  "I love early flights"      "I prefer flexible times" │  │
│  │                                                         │  │
│  │  Adventure vs. Relaxation                               │  │
│  │  Adventure ←━━━━●━━━━━━━━━━→ Relaxation               │  │
│  │  "Pack the days"          "Chill by the beach"         │  │
│  │                                                         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│                  [← Back]                    [Continue →]      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────────────┐
│ ✈️ TripOptimizer    Step 2/3  │
├──────────────────────────────┤
│                              │
│  Tell us about your trip     │
│                              │
│  Who's traveling?            │
│  👤 You (adult)              │
│  [+ Add traveler]            │
│                              │
│  Comfort vs. Budget          │
│  Budget ←●─────→ Comfort    │
│                              │
│  Morning vs. Flexibility     │
│  Morning ←─●───→ Flexibility│
│                              │
│  Adventure vs. Relaxation    │
│  Adventure ←─●─→ Relaxation │
│                              │
│  ⚙️ Advanced (2 kids, pets, │
│     accessibility needs)     │
│                              │
├──────────────────────────────┤
│ [← Back]     [Continue →]    │
└──────────────────────────────┘
```

**Key Features**:
- ✅ Simple traveler count (default 2 adults, customize if needed)
- ✅ Three preference sliders (not overwhelming)
- ✅ Clear labels on both ends (shows impact)
- ✅ Advanced options hidden (keeps UI clean)
- ✅ Real-time preview of selected preferences

**Advanced Options (Hidden by Default)**:
```
⚙️ Advanced Preferences
  How many children? (ages?)
  Flying with pets?
  Accessibility needs?
  Budget range? (€200-€2000)
  Specific airlines to avoid?
  Hotel star preference? (2-5)
```

**Data Collected** (for anxiety algorithm):
- Travelers: ages, composition
- Budget preference weight
- Morning preference (impacts fatigue scoring)
- Activity preference (impacts complexity scoring)

---

## 🎯 Step 3: Results Page (New Layout)

### Desktop View
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ✈️ TripOptimizer                    London → Barcelona, May   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ [Cheapest] [Best Value] [Least Stressful] ← Tab bar   │  │
│  │ (View pre-sorted by your priorities)                   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  📊 Heatmap View                                               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Departure  │ May 1 │ May 2 │ May 3 │ May 4 │ May 5 │    │ │
│  ├─────────────┼───────┼───────┼───────┼───────┼───────┤    │ │
│  │ May 5 RET   │ €650  │ €640  │ €620  │ €675  │ €700  │    │ │
│  │             │ 🟢    │ 🟢    │ ⭐🟢  │ 🟡    │ 🟡    │    │ │
│  │ May 6 RET   │ €680  │ €670  │ €650  │ €705  │ €730  │    │ │
│  │             │ 🟢    │ 🟢    │ 🟢    │ 🟡    │ 🟡    │    │ │
│  │ May 7 RET   │ €700  │ €690  │ €670  │ €725  │ €750  │    │ │
│  │             │ 🟡    │ 🟡    │ 🟡    │ 🟡    │ 🔴    │    │ │
│  │ May 8 RET   │ €750  │ €740  │ €720  │ €775  │ €800  │    │ │
│  │             │ 🟡    │ 🟡    │ 🟡    │ 🔴    │ 🔴    │    │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Legend:                                                        │
│  🟢 Not Stressful (0-40)  | 🟡 Medium (40-70)  | 🔴 Very (70+) │
│  ⭐ Recommended by Trip Assistant                              │
│                                                                 │
│  [← Modify Search]                    [See Details ↗]         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────────────┐
│ ✈️ TripOptimizer             │
│ London → Barcelona, May 1-8  │
├──────────────────────────────┤
│                              │
│ View by:                     │
│ [Cheapest] [Best] [Stress]  │
│                              │
│ 📊 Heatmap (scrollable)      │
│                              │
│ Dep:       May1 May2 May3   │
│ May5 RET: €650 €640 €620   │
│           🟢   🟢   ⭐🟢    │
│                              │
│ May6 RET: €680 €670 €650   │
│           🟢   🟢   🟢      │
│                              │
│ May7 RET: €700 €690 €670   │
│           🟡   🟡   🟡      │
│                              │
│ [Scroll for more dates...]   │
│                              │
├──────────────────────────────┤
│ [← Modify]  [Details ↗]      │
└──────────────────────────────┘
```

**Key Changes**:
- ✅ Tab bar shows different sort options (what matters to user)
- ✅ Anxiety badges PROMINENT (🟢🟡🔴 next to price)
- ✅ Recommended trip marked with ⭐
- ✅ Instant visual scanning (grid format)
- ✅ Mobile: horizontal scroll for dates, always visible price + stress
- ✅ Clearer connection to user's preferences

**Tab Bar Logic**:
- **[Cheapest]** → Sort by price (lowest first)
- **[Best Value]** → Anxiety score relative to price (best ratio)
- **[Least Stressful]** → Sort by anxiety score (green first)

---

## 🎨 Step 3b: Detail Modal (Updated)

### Desktop Detail Modal
```
┌──────────────────────────────────────────────────────────────────┐
│ London → Barcelona, May 3-8 (5 nights)           [×]            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  €620 total                                    ⭐ Recommended    │
│                                                                  │
│  Stress Level: 🟢 Not Stressful (Score: 0.28)                   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Why This Trip Works Well For You                           │ │
│  │                                                            │ │
│  │ ✓ You prefer flexibility → Afternoon flight (good!)       │ │
│  │ ✓ You value budget → €620 is 15% below average            │ │
│  │ ✓ You like relaxation → Plenty of time between flights    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Outbound Flight                                            │ │
│  │ May 3 · London (LHR) → Barcelona (BCN)                     │ │
│  │                                                            │ │
│  │ 14:00 ─────────────→ 17:45  (3h 45m, direct)              │ │
│  │ BA283 · Boeing 737                                         │ │
│  │ £250 (Economy)                                             │ │
│  │                                                            │ │
│  │ Fatigue Score: Low (afternoon, direct)                     │ │
│  │ No jetlag concerns (same timezone)                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Return Flight                                              │ │
│  │ May 8 · Barcelona (BCN) → London (LHR)                     │ │
│  │                                                            │ │
│  │ 11:00 ─────────────→ 12:45  (3h 45m, direct)              │ │
│  │ BA290 · Boeing 737                                         │ │
│  │ £370 (Economy)                                             │ │
│  │                                                            │ │
│  │ Fatigue Score: Medium (early morning, but home benefit)    │ │
│  │ Perfect timing: enjoy last evening, morning flight home    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Hotels (3-star recommended)                                │ │
│  │                                                            │ │
│  │ Hotel Barcelona Marina          €90/night × 5 nights       │ │
│  │ ⭐⭐⭐ (3 stars)  · Central, great reviews                   │ │
│  │ [View on Booking ↗]                                        │ │
│  │                                                            │ │
│  │ Total hotel cost: €450                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  💰 Breakdown                                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Outbound flight:  £250                                     │ │
│  │ Return flight:    £370                                     │ │
│  │ Hotels (3-star):  €450                                     │ │
│  │ ─────────────────────                                      │ │
│  │ Total:            €620                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ✅ Anxiety Report                                          │ │
│  │                                                            │ │
│  │ Fatigue Risk (40%):      0.15/1.0   ✓ Low               │ │
│  │ Conflicts (30%):         0.00/1.0   ✓ None              │ │
│  │ Complexity (20%):        0.05/1.0   ✓ Simple            │ │
│  │ Rest & Buffer (10%):     0.13/1.0   ✓ Good              │ │
│  │                                                            │ │
│  │ Duration Multiplier (5-day trip): ×1.5                   │ │
│  │ Final Score: 0.28 (multiplier applied)                   │ │
│  │                                                            │ │
│  │ 🟢 This trip has low stress for its duration              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [★ Save to list]        [💬 Modify search]  [Book ↗]         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile Detail Modal
```
┌──────────────────────────────┐
│ May 3-8 Barcelona    ⭐      [×]
├──────────────────────────────┤
│ €620 total                   │
│ 🟢 Not Stressful (0.28)      │
│                              │
│ Why this works for you:      │
│ ✓ Flexible time               │
│ ✓ 15% below budget             │
│ ✓ Relaxed itinerary            │
│                              │
│ Outbound Flight              │
│ May 3, 14:00 → 17:45         │
│ LHR → BCN, direct            │
│ BA283 · £250                 │
│                              │
│ Return Flight                │
│ May 8, 11:00 → 12:45         │
│ BCN → LHR, direct            │
│ BA290 · £370                 │
│                              │
│ Hotels: €90/night × 5        │
│ Barcelona Marina (3-star)    │
│ [View on Booking ↗]          │
│                              │
│ Cost Breakdown:              │
│ Flights: £620                │
│ Hotels: €450                 │
│ Total: €620                  │
│                              │
│ Anxiety Breakdown:           │
│ Fatigue: 0.15 ✓             │
│ Conflicts: 0.00 ✓           │
│ Complexity: 0.05 ✓          │
│ Rest: 0.13 ✓                │
│                              │
├──────────────────────────────┤
│ [★ Save]  [Book ↗]           │
└──────────────────────────────┘
```

**Key Features**:
- ✅ Personalized explanation ("Why this works for YOU")
- ✅ Prominent stress level with explanation
- ✅ Clear flight + hotel breakdown
- ✅ Detailed anxiety report (transparent algorithm)
- ✅ Comparison to user preferences (closes the loop)
- ✅ Easy booking/save actions

---

## 🔄 Component Breakdown & Reusability

### New Components to Create

```
src/components/
├── SmartForm/
│   ├── StepForm.jsx              (container, manages 3 steps)
│   ├── Step1RouteSelection.jsx    (cities + dates)
│   ├── Step2Preferences.jsx       (travelers + sliders)
│   ├── SliderPref.jsx             (reusable slider component)
│   └── CitySelectDropdown.jsx     (from existing SearchForm)
│
├── ResultsPage/
│   ├── ResultsHeatMap.jsx         (improved, tab bar)
│   ├── ResultsTabBar.jsx          (Cheapest/Best/Stress)
│   └── AnxietyLegend.jsx          (color + emoji guide)
│
├── DetailModal/
│   ├── DetailModal.jsx            (updated layout)
│   ├── FlightSection.jsx          (outbound/return)
│   ├── HotelSection.jsx
│   ├── AnxietyReportDetailed.jsx  (breakdown table)
│   └── PersonalizedInsights.jsx   (why this trip works)
│
└── Shared/
    ├── TravelerSelector.jsx       (avatar-based)
    └── ProgressBar.jsx            (step indicator)
```

### Files to Modify

```
src/
├── App.jsx                    (route: /form, /results)
├── components/
│   └── LandingPage.jsx        (simplify to single CTA)
└── data/
    └── mockData.js            (add preference weights)
```

---

## 📐 User Flows

### Success Path (Happy Path)
```
Landing
  ↓ (User enters cities)
Step 1: Routes
  ↓ (User picks dates)
Step 2: Preferences
  ↓ (User sets sliders)
Results Page
  ↓ (User clicks cell)
Detail Modal
  ↓ (User books)
Success
```

### Alternative Paths

**Path A: User skips preferences**
```
Step 2: Preferences → [Skip] → Results (default sorting)
```

**Path B: User wants to modify**
```
Results Page → [Modify Search] → Back to Step 1
```

**Path C: User wants advanced options**
```
Step 2: Preferences → [⚙️ Advanced] → Expanded form
```

---

## 🎨 Visual Style Guide

### Colors
```
Background:     Purple/Blue gradient (#0f0c29 → #302b63)
Accent:         Indigo (#4f46e5)
Success:        Green (#10b981) - 🟢 Not Stressful
Warning:        Amber (#f59e0b) - 🟡 Medium
Danger:         Red (#ef4444) - 🔴 Very Stressful
Recommended:    Gold star (⭐)
```

### Typography
```
Hero Title:     Size 56px, Weight 800, Color: White
Section Title:  Size 24px, Weight 700
Body:           Size 16px, Weight 400
Label:          Size 12px, Weight 600, Uppercase
```

### Spacing
```
Container padding:    24px (desktop), 16px (mobile)
Vertical gaps:        16px (default), 24px (sections)
Horizontal gaps:      12px (fields), 8px (inline)
Border radius:        12px (standard), 8px (compact)
```

### Interactive Elements
```
Button height:        44px (mobile), 48px (desktop)
Input height:         44px
Slider width:         100%
Hover effect:         Slight bg color change + shadow
Focus effect:         Ring (4px indigo)
```

---

## 📊 Expected Improvements

### Metrics Before → After

| Metric | Before | After | Goal |
|--------|--------|-------|------|
| **Conversion: Landing → Search** | 20% | 60%+ | ✅ 3x improvement |
| **Form completion time** | 2-3 min | 45 sec | ✅ 3x faster |
| **Mobile abandonment** | 50% | <20% | ✅ 60% reduction |
| **Anxiety badge comprehension** | 30% | 80%+ | ✅ Understanding |
| **Recommendation click rate** | 15% | 40%+ | ✅ Engagement |
| **Detail modal views** | 30% of searches | 70%+ | ✅ Engagement |

---

## 🚀 Implementation Roadmap

### Week 1: Core Form Components
- [ ] Build `StepForm` container
- [ ] Build `Step1RouteSelection` (reuse city dropdown)
- [ ] Build `Step2Preferences` (sliders, travelers)
- [ ] Integrate with existing `HeatMap`
- [ ] Simplify landing page

### Week 2: Results Page Redesign
- [ ] Add tab bar (`ResultsTabBar`)
- [ ] Update `HeatMap` component (prominence for anxiety)
- [ ] Update `DetailModal` (new layout)
- [ ] Add personalized insights (`PersonalizedInsights`)

### Week 3: Polish & Testing
- [ ] Mobile responsive testing
- [ ] Dark mode verification
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] A/B test (old form vs. new form)

---

## 🎯 Success Criteria

Before launching, verify:

- [ ] Desktop landing → results: <3 steps, <1 minute
- [ ] Mobile landing → results: <3 steps, <1.5 minutes
- [ ] All anxiety badges visible in heatmap
- [ ] Tab bar correctly sorts results
- [ ] Detail modal shows personalized insights
- [ ] Dark mode works flawlessly
- [ ] Mobile heatmap is horizontally scrollable + readable
- [ ] User preferences are actually affecting sorting
- [ ] All tests pass

---

**Next Step**: Start building Step 1 (Route Selection) component
