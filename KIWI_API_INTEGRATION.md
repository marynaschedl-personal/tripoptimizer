# Kiwi.com Flight API Integration

## Overview
TripOptimizer now integrates **real flight prices from Kiwi.com** while maintaining the heat map visualization with mock hotel data.

## What Was Built

### 1. **API Integration Module** (`/src/api/kiwiApi.js`)
- **Function**: `fetchFlightPrice()` - Fetches real flight prices from Kiwi API
- **Automatic Caching**: Results cached for 24 hours in localStorage
- **Rate Limiting**: Batches up to 3 concurrent requests with 200ms delays between batches
- **City/Airport Mapping**: Supports both city names and airport codes
  - "Munich" → `City:munich_de`
  - "MUC" → `Airport:MUC`
  - Works with all European and popular Asian destinations

#### Key Functions:
```javascript
mapCityToKiwiFormat(input)        // Convert "Munich" or "MUC" to Kiwi format
fetchFlightPrice(...)             // Single flight price fetch with error handling
getFlightPrice(...)               // Cached flight price fetch
batchFetchFlightPrices(...)       // Batch multiple flights with progress callback
clearFlightCache()                // Clear localStorage cache
getCacheAgeMinutes(timestamp)     // Get cache freshness for display
```

### 2. **Enhanced Heat Map Component** (`/src/components/HeatMap.jsx`)
- **Real-time API Integration**: Automatically fetches Kiwi prices when search completes
- **Progressive Loading**: Shows progress bar "Loading 3/30 combinations..."
- **Live Prices Badge**: Green "LIVE PRICES" indicator when real data is displayed
- **Data Freshness**: Shows "Updated 5m ago" for cached results
- **Error Handling**:
  - Falls back to estimated prices if API fails
  - Shows amber warning badge when using estimated prices
  - Continues operation even if API is unavailable
- **Refresh Button**: Manual refresh button to re-fetch latest prices
- **Graceful Degradation**: Mock data serves as automatic fallback

### 3. **Data Combination**
Real flight prices are combined with:
- Mock hotel prices (hotels remain fake for now)
- Mock hotel details and amenities
- Total trip cost = Real flight price + Mock hotel cost

## How It Works

### User Flow:
1. User selects origin, destination, and dates
2. Clicks "Search Flights + Hotels"
3. Heat map appears with mock prices initially (instant load)
4. API automatically fetches real Kiwi.com prices for each date combination
5. Heat map updates progressively as results arrive
6. Green "LIVE PRICES" badge appears once real data is displayed
7. Results are cached for 24 hours to avoid duplicate API calls

### API Requests:
- **Endpoint**: `https://kiwi-com-cheap-flights.p.rapidapi.com/round-trip`
- **Per Request**: Single outbound date + return date combination
- **Per Search**: Up to 64 API calls (8x8 date grid) batched 3 at a time
- **Response**: Cheapest available flight in ECONOMY cabin

## Features Implemented

✅ Real Kiwi.com flight prices  
✅ Smart caching with 24-hour TTL  
✅ Rate limiting (3 concurrent, 200ms between batches)  
✅ Progress indicator during loading  
✅ "Live Prices" and "Estimated" badges  
✅ Data freshness timestamp  
✅ Automatic fallback to mock data  
✅ Manual refresh button  
✅ Error handling and recovery  
✅ City name + airport code support  
✅ Full session-independent caching  

## Testing

### To Test with Real Data:
1. Open http://localhost:5173
2. Search for "Munich" → "Barcelona" (2026-05-01 to 2026-05-10)
3. Watch the progress bar fill as prices load
4. See "LIVE PRICES" badge appear
5. Click "Refresh" button to update prices
6. Close and reopen - prices load instantly from cache

### To Test Error Handling:
1. Use invalid city (will show warning)
2. Disconnect internet (will use mock data)
3. Try extreme date ranges (handles gracefully)

### To Clear Cache:
1. Open DevTools → Application → LocalStorage
2. Find keys starting with `kiwi_flight_`
3. Delete entries, or use the refresh button in the UI

## Cached Data

Stored in browser's localStorage under keys like:
```
kiwi_flight_FRA_BCN_2026-05-01_2026-05-10
```

Each entry contains:
- Flight price (EUR)
- Outbound/return flight times
- Airlines
- Number of stops
- Timestamp (for freshness calculation)

## Limitations

- **Hotels remain mock data** - Real hotel data can be added in Phase 2
- **EUR currency only** - Can add currency selector later
- **ECONOMY cabin only** - Can add cabin class selector
- **Rate limit**: API key allows ~1000 requests/month

## Next Steps for Enhancement

1. **Add real hotel data** from booking API
2. **Implement cabin class selector** (Economy, Business, First)
3. **Add currency selector** based on user location
4. **Hotel filters** by star rating, amenities
5. **Alternative airlines** view with different stop counts
6. **Price trend chart** showing historical prices
7. **Set price alerts** for specific date combinations

## Troubleshooting

### "Using estimated prices (API unavailable)"
- Check Kiwi API key validity
- Verify internet connection
- Check rate limit status
- Wait 24 hours or clear localStorage cache

### "Loading..." spinner doesn't complete
- May indicate API rate limit exceeded
- Check browser console for specific error
- Fallback to mock data occurs automatically

### Cache not working
- Check browser allows localStorage
- Verify localStorage has space
- Look for keys starting with `kiwi_flight_`

## API Key Security

⚠️ **Note**: API key is currently visible in the code (`src/api/kiwiApi.js`).  
For production, move to environment variables:
```javascript
// Instead of hardcoding:
const KIWI_API_KEY = '36b0787dbbmsh9cafb5d9466a4abp14ff04jsnc96a4591d22f';

// Use environment variable:
const KIWI_API_KEY = import.meta.env.VITE_KIWI_API_KEY;
```

Add to `.env.local`:
```
VITE_KIWI_API_KEY=36b0787dbbmsh9cafb5d9466a4abp14ff04jsnc96a4591d22f
```
