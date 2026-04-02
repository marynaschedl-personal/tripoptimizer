# TripOptimizer Current Architecture

## Project Structure
```
src/
├── App.jsx                           # Main app root
├── main.jsx                          # Vite entry point
├── index.css                         # Global styles
├── api/
│   └── kiwiApi.js                    # Kiwi.com flight API integration
├── components/
│   ├── Header.jsx                    # Top navigation bar
│   ├── SearchForm.jsx                # Search input form (traditional)
│   ├── ChatInput.jsx                 # Natural language chat interface (NEW)
│   ├── SearchTree.jsx                # Search history tree sidebar (NEW)
│   ├── HeatMap.jsx                   # Price heat map grid
│   ├── DetailModal.jsx               # Flight/hotel detail modal
│   ├── ComparisonPanel.jsx           # Starred trips comparison
│   ├── EmailCapture.jsx              # Email signup
│   ├── RecentSearches.jsx            # Recent searches list
│   ├── TradeoffVisualizer.jsx        # Price/convenience tradeoff
│   └── TripAssistant/                # Itinerary & conflict detection
│       ├── index.jsx                 # Main component
│       ├── FatigueBar.jsx            # Fatigue progress indicator
│       ├── LayoverOptions.jsx        # Layover activities
│       ├── detectConflicts.js        # Conflict detection logic
│       ├── TripAssistant.types.js    # Type definitions
│       ├── TripAssistant.test.js     # Unit tests
│       └── mockTrip.js               # Test data
├── pages/
│   └── TripAssistantDemo.jsx         # Demo page
├── data/
│   └── mockData.js                   # Mock cities, flights, hotels
├── hooks/
│   ├── useLocalStorage.js            # Local storage hook
│   └── useSearchTree.js              # Search tree state hook (NEW)
└── utils/
    └── nlpParser.js                  # Natural language parsing (NEW)
```

## Component Communication Flow

### App.jsx (Root Component)
**State:**
- `theme` - 'light' | 'dark' (localStorage)
- `view` - 'landing' | 'results' | 'timeline' | string
- `searchParams` - { origin, destination, startDate, endDate, adults, children, budgetMin, budgetMax }
- `loading` - boolean (loading state during search)
- `selectedCell` - { departureDate, returnDate, cellData }
- `starredCombos` - array of { departureDate, returnDate, cellData }
- `tree` - search tree state from useSearchTree hook

**Views:**
1. **Landing** → Dual-input (ChatInput left + SearchForm right) + TripAssistant demo button
2. **Results** → Header + SearchTree sidebar + HeatMap + DetailModal
3. **Timeline** → Header + TripAssistant demo

### LandingPage Component
**Props:**
- `onSearch(params)` - callback triggered by both ChatInput and SearchForm
- `loading` - boolean
- `theme`, `onToggleTheme` - theme state
- `onViewTimeline` - navigate to demo

**Layout:**
- Hero section with title, description, feature chips
- Two-column grid (lg:grid-cols-2):
  - **Left (50%)**: ChatInput component
  - **Right (50%)**: SearchForm component
- Both send parsed/validated params to same `onSearch` handler

### ChatInput.jsx (NEW)
**Props:**
- `onSearchParsed(params)` - callback with validated search params
- `loading` - boolean (disable during search)

**State:**
- `input` - text input value
- `messages` - array of { role, text, timestamp, action?, confidence?, params? }
- `isProcessing` - boolean (parsing in progress)

**Features:**
- Message display: user messages (blue, right-aligned) vs assistant responses (gray, left-aligned)
- Example button chips: quick input templates
- Form submit: parse input through nlpParser
- Confidence-based responses:
  - **High**: "🎯 Perfect! Found: BCN → LHR, Apr 10-22, 2 adults" → triggers onSearchParsed
  - **Medium**: "🤔 Mostly got it, but missing: [fields]" → ask for clarification
  - **Low**: "🤔 Didn't catch that. Please provide: origin, destination, dates"
- Send button (disabled when input empty or processing)
- Auto-clears input after submission

### SearchTree.jsx (NEW)
**Props:**
- `onSelectSearch(params)` - callback when user clicks a search node
- `isOpen` - boolean (show/hide)

**State:**
- Uses `useSearchTree` hook internally

**Features:**
- Sidebar (w-64, hidden on mobile, visible on lg+)
- Header: "Search History" title + trash icon (clear all)
- Tree structure: recursive TreeNode components
- Each node shows:
  - Label: "BCN → LHR (Apr 10)" (formatted from search params)
  - Timestamp: "now", "2m", "1h", "1d", "Jan 15"
  - Chevron icon: > (collapsed) / ▼ (expanded)
  - Current node highlighted (indigo background)
- Click node: calls onSelectSearch(params)
- Clear button: wipes all history
- Empty state: "No searches yet"

### SearchForm.jsx (Traditional Input)
**Props:**
- `onSearch(params)` - callback with search params
- `initialValues` - { origin, destination, startDate, endDate, adults, children }
- `loading` - boolean

**State:**
- origin, destination, startDate, endDate, tripLength, adults, children, budgetMin, budgetMax
- showBudget, errors

**Key Features:**
- CityDropdown for origin/destination (supports city name + airport code)
- Trip length quick selector (3/5/7/10/14 nights or custom)
- Auto-calculates return date based on trip length
- Validates dates and required fields

### HeatMap.jsx
**Props:**
- `searchParams` - search parameters
- `onSelectCell(data)` - click handler
- `starredCombos` - marked trips
- `onToggleStar(data)` - star handler
- `minHotelStars` - filter value
- `travelers` - total count

**State:**
- `flightData` - real Kiwi prices (maps to mockGrid)
- `isLoadingFlights` - API loading state
- `loadingProgress` - { completed, total }
- `error` - API error message
- `useRealPrices` - toggle real vs mock prices
- `dataFreshness` - cache age tracking
- `usingFallback` - fallback to mock data flag

**Features:**
- 8x8 date grid (rows=departures, cols=returns)
- Fetches real Kiwi.com prices (batched requests)
- Falls back to mock data on API error
- Shows "LIVE PRICES" badge when real data
- Refresh button to clear cache
- Color-coded cells (green=cheap, red=expensive)
- Click cell → opens DetailModal
- Right-click/long-press → star/unstar trip

### DetailModal.jsx
**Props:**
- `isOpen` - boolean
- `onClose()` - callback
- `cellData` - { departureDate, returnDate, nights, outbound, inbound, hotels, cheapestHotel, prices, travelers }
- `searchParams` - { origin, destination, adults, children }
- `onToggleStar(data)` - star callback
- `isStarred` - boolean

**State:**
- None (fully controlled by parent)

**Features:**
- Header with trip summary + star/close buttons
- Cost breakdown (outbound flight + return flight + hotel)
- Outbound & return flight cards
- Hotel options list (top 5 by price)
- "Book on Kiwi" button (deep link with correct dates)
- Share button (copies URL with params)
- Tradeoff hint (if cheaper flight exists)
- **NO hotel filters yet** (all 5 hotels shown)

### Header.jsx
**Props:**
- `theme` - 'light' | 'dark'
- `onToggleTheme()` - callback
- `starredCount` - number
- `onOpenComparison()` - callback
- `onLogoClick()` - back to home

**Features:**
- Logo + title (clickable → home)
- Theme toggle button
- Comparison badge with count
- Dark mode support

## Data Models

### SearchParams
```javascript
{
  origin: string,           // Airport code: 'LHR', 'MUC', etc.
  destination: string,      // Airport code: 'BCN', 'FCO', etc.
  startDate: string,        // YYYY-MM-DD format
  endDate: string,          // YYYY-MM-DD format
  adults: number,           // 1-8
  children: number,         // 0-6
  budgetMin?: string,       // Optional budget filter
  budgetMax?: string        // Optional budget filter
}
```

### SearchTreeNode (from useSearchTree)
```javascript
{
  id: string,               // Timestamp-based unique ID
  parentId: string | null,  // Parent node ID (null for root nodes)
  children: string[],       // Array of child node IDs
  params: SearchParams,     // Search parameters
  timestamp: string,        // ISO string
  label: string            // Formatted: "BCN → LHR (Apr 10)"
}
```

### SearchTree Structure
```javascript
{
  nodes: {
    [nodeId]: SearchTreeNode,
    // ... more nodes
  },
  rootIds: string[],        // Top-level search nodes (max 20)
  currentNodeId: string     // Currently selected node
}
```

### ParsedNLP (from parseNaturalLanguage)
```javascript
{
  success: boolean,
  confidence: 'high' | 'medium' | 'low',
  origin: string | null,
  destination: string | null,
  startDate: string | null,
  endDate: string | null,
  adults: number,           // Default: 1
  children: number,         // Default: 0
  tripLength: number | null,
  missingFields: string[],  // ['origin', 'destination', 'dates']
  message: string,          // Human-readable feedback
  rawInput: string          // Original user input
}
```

### CellData (from HeatMap)
```javascript
{
  departureDate: string,
  returnDate: string,
  nights: number,
  outbound: {
    airline: string,
    flightNumber: string,
    departureTime: string,
    arrivalTime: string,
    duration: string,
    stops: number,
    price: number,
    ...
  },
  inbound: { /* same structure */ },
  hotels: [
    {
      id: string,
      name: string,
      stars: 1-5,
      rating: number (0-10),
      reviews: number,
      location: string,
      pricePerNight: number,
      adjustedPricePerNight: number,
      totalHotelCost: number,
      amenities: string[],
      description: string,
      sponsored: boolean
    },
    // ... more hotels
  ],
  cheapestHotel: hotel object,
  cheapestHotelCost: number,
  outboundPrice: number,
  inboundPrice: number,
  totalCost: number,
  travelers: number,
  // NEW if real Kiwi data:
  realFlightData?: true,
  flightPrice?: number,
  airlines?: string,
  stops?: number,
  cached?: boolean
}
```

### Hotel Object (from mockData.HOTELS)
```javascript
{
  id: string,
  name: string,
  stars: 1-5,
  rating: number,
  reviews: number,
  location: string,
  pricePerNight: number,
  amenities: string[],        // ['Pool', 'Spa', 'Restaurant', 'Bar', ...]
  description: string,
  sponsored: boolean
}
```

### Cities
```javascript
// DESTINATION_CITIES & ORIGIN_CITIES
{
  code: string,              // 'LHR', 'MUC', etc.
  name: string,              // 'London', 'Munich'
  country: string,
  flag: string,              // emoji
  gradient?: string          // Tailwind gradient (dest only)
}
```

## API Integration

### Kiwi.com API (`src/api/kiwiApi.js`)
**Functions:**
- `mapCityToKiwiFormat(input)` → 'City:london_gb' or 'Airport:LHR'
- `fetchFlightPrice(origin, dest, outDate, retDate, adults, currency)` → { success, price, airlines, stops, ... }
- `getFlightPrice(...)` → cached version with localStorage
- `batchFetchFlightPrices(flights, onProgress)` → { [key]: result }
- `clearFlightCache()` → removes all kiwi_flight_* keys
- `getCacheAgeMinutes(timestamp)` → age in minutes

**Cache Key Format:**
```
kiwi_flight_{origin}_{destination}_{outDate}_{retDate}
```

**Batching:**
- Max 3 concurrent requests
- 200ms delay between batches
- Progress callback: `{ completed, total, currentBatch }`

## NLP Parser (`src/utils/nlpParser.js`)

### Main Function: `parseNaturalLanguage(input, context?)`
Extracts trip search parameters from natural language using regex patterns.

**Input Examples:**
```
"Barcelona to London April 10-22"
"Munich to Rome, 5 days, 2 adults"
"Paris for a weekend"
"LHR to FCO next week"
```

**Extraction Strategies:**
1. **Cities**: Match city names from CITY_ALIASES (20+ cities + 3-letter airport codes)
2. **Dates**:
   - Absolute: "April 10", "Apr 10-22", "2026-04-10", "10/04/2026"
   - Relative: "next week", "weekend" (3 days), "week" (7 days)
3. **Duration**: "5 days", "10 nights", "weekend", "week"
4. **Travelers**: "2 adults", "1 child", "4 people"

**Returns:**
```javascript
{
  success: boolean,
  confidence: 'high' | 'medium' | 'low',
  origin: string,
  destination: string,
  startDate: string,
  endDate: string,
  adults: number,
  children: number,
  tripLength: number,
  missingFields: string[],
  message: string
}
```

**Confidence Scoring:**
- **High**: origin + destination + (dates OR tripLength)
- **Medium**: (origin OR destination) + (dates OR tripLength)
- **Low**: insufficient fields

### Converter: `parsedToSearchParams(parsed)`
Converts ParsedNLP result to SearchParams, calculating dates from tripLength if needed.

## Search Tree Hook (`src/hooks/useSearchTree.js`)

### State Management
Manages search history as tree structure persisted to localStorage under key `'tripoptimizer_searchTree'`.

### Key Functions:
- `addSearch(params, parentNodeId?)` - Add search node (root if no parent)
- `getNode(nodeId)` - Retrieve single node
- `getRootNodes()` - Get all root searches (max 20)
- `getChildren(nodeId)` - Get child searches
- `getCurrentNode()` - Get selected node
- `setCurrentNode(nodeId)` - Set selected node
- `clearHistory()` - Wipe all search history

### Returns:
```javascript
{
  tree,                    // Full tree structure
  loading,                 // Initial load state
  addSearch,               // Function
  getNode,                 // Function
  getRootNodes,            // Function
  getChildren,             // Function
  getCurrentNode,          // Function
  setCurrentNode,          // Function
  clearHistory,            // Function
  currentNodeId            // Current selection ID
}
```

## Storage

### localStorage Keys
- `to-theme` - 'light' | 'dark'
- `tripoptimizer_searchTree` - Search history tree (auto-save)
- `kiwi_flight_*` - cached Kiwi prices (auto-expire 24h)

### useLocalStorage Hook
```javascript
const [value, setValue] = useLocalStorage(key, initialValue);
// setValue can be value or setter function
```

## UI Component Libraries
- **React 18.3.1**
- **Tailwind CSS 3.4.17** - all styling
- **lucide-react 0.469** - icons
- **clsx 2.1.1** - conditional classnames
- **Vite 6** - build tool
- **PostCSS + autoprefixer** - CSS processing

## Current Features (Week 1 MVP Completed)
✅ Dual-input landing page (ChatInput left + SearchForm right)
✅ Natural language parser (regex-based NLP)
✅ Search history tree (parent/child node structure)
✅ Search tree sidebar (expandable, timestamps)
✅ Heat map with Kiwi.com real prices
✅ Trip length quick selector
✅ Clickable logo navigation
✅ Hotel options in detail modal (no filters)
✅ Flight booking links to Kiwi.com
✅ Mock hotel data
✅ Dark mode
✅ API caching
✅ Rate limiting (3 concurrent, 200ms between batches)
✅ Trip Assistant (conflict detection, family mode)
✅ localStorage persistence (search tree, theme)

## Future Enhancements (Phase 3+)
❌ Hotel filters (star rating, price range, amenities)
❌ Hotel filter state persistence
❌ Favorited hotels per trip
❌ Advanced filters UI in DetailModal
❌ Train and car options
❌ Multi-city search
❌ Price alerts
