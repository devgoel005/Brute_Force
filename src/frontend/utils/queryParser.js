/**
 * queryParser.js
 * Extracts location, category, and intent from searchData and raw query string.
 */

// Popular geographical centers for direct matching and query resolution
const FAMOUS_DESTINATIONS = {
  gurgaon: { city: 'Gurgaon', state: 'Haryana', country: 'India', lat: 28.4595, lon: 77.0266 },
  gurugram: { city: 'Gurugram', state: 'Haryana', country: 'India', lat: 28.4595, lon: 77.0266 },
  kurukshetra: { city: 'Kurukshetra', state: 'Haryana', country: 'India', lat: 29.9695, lon: 76.8783 },
  'new york': { city: 'New York City', state: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  newyork: { city: 'New York City', state: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  nyc: { city: 'New York City', state: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  delhi: { city: 'New Delhi', state: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
  'new delhi': { city: 'New Delhi', state: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
  india: { city: 'New Delhi', state: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
  paris: { city: 'Paris', state: 'Île-de-France', country: 'France', lat: 48.8566, lon: 2.3522 },
  rome: { city: 'Rome', state: 'Lazio', country: 'Italy', lat: 41.9028, lon: 12.4964 },
  tokyo: { city: 'Tokyo', state: 'Kanto', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  london: { city: 'London', state: 'England', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 }
};

export function parseSearchPayload(searchData, rawQuery = '') {
  // Support searchData as array or single object as noted in problem statement
  const data = Array.isArray(searchData) ? searchData[0] : searchData;
  // Always prioritize rawQuery (the actual user input typed in the search bar)
  const queryStr = (rawQuery || data?.query || '').trim();
  const lowerQuery = queryStr.toLowerCase();

  // 1. Resolve Location Entity
  let location = {
    city: 'Explore Destination',
    state: '',
    country: '',
    lat: 40.7128,
    lon: -74.0060,
    hasLocation: false
  };

  // Check if raw query directly specifies a known destination first
  let directMatched = null;
  for (const [key, dest] of Object.entries(FAMOUS_DESTINATIONS)) {
    // Word boundary check or substring match
    if (lowerQuery.includes(key)) {
      directMatched = dest;
      break;
    }
  }

  if (directMatched) {
    location = { ...directMatched, hasLocation: true };
  } else {
    // Attempt to extract city name from NLP query (e.g., "things to do in Jaipur", "places to visit in Goa")
    const inMatch = lowerQuery.match(/(?:in|near|around|visit|to)\s+([a-zA-Z\s]+)/i);
    let extractedCity = inMatch ? inMatch[1].trim() : null;
    if (extractedCity) {
      extractedCity = extractedCity
        .replace(/\b(museums?|monuments?|historic|attractions?|places?|parks?|temples?|sights?|best|top)\b/gi, '')
        .trim();
    }

    if (extractedCity && extractedCity.length >= 3 && !['all', 'the', 'india'].includes(extractedCity)) {
      const capCity = extractedCity.charAt(0).toUpperCase() + extractedCity.slice(1);
      location = {
        city: capCity,
        state: '',
        country: '',
        lat: 28.6139, // placeholder, will be geocoded by backend API
        lon: 77.2090,
        hasLocation: true,
        needsGeocoding: true
      };
    } else {
    // Fallback to entities provided in searchData
    const entities = data?.entities || [];
    const locationEntity = entities.find(
      e => e.collectionType === 'HD_LOCATION' || e.entityType === 'LOCATION' || e.collectionName === 'CITIES' || e.collectionName === 'COUNTRIES'
    ) || entities[0];

    if (locationEntity?.entityInfo?.geo) {
      const geo = locationEntity.entityInfo.geo;
      const isCountry = locationEntity.collectionName === 'COUNTRIES' || !geo.city || geo.city.toLowerCase() === 'india';

      // If query is for a whole country like "India", center on capital
      if (isCountry && geo.countryCode === 'IN') {
        location = {
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          lat: 28.6139,
          lon: 77.2090,
          hasLocation: true
        };
      } else {
        location = {
          city: geo.city || locationEntity.word || geo.country || 'Destination',
          state: geo.state || '',
          country: geo.country || '',
          lat: parseFloat(geo.lat),
          lon: parseFloat(geo.long),
          hasLocation: true
        };
      }
    } else if (data?.userLocation?.position?.coords) {
      const coords = data.userLocation.position.coords;
      location = {
        city: data.userLocation.position.city || 'Nearby',
        state: '',
        country: data.userLocation.position.countryCode || '',
        lat: parseFloat(coords.latitude),
        lon: parseFloat(coords.longitude),
        hasLocation: true
      };
    }
  }
}

  // 2. Parse Category Intent from Query String
  let category = 'all';
  let categoryLabel = 'Top Attractions';

  if (/\b(museums?|galleries|gallery|exhibition)\b/.test(lowerQuery)) {
    category = 'museums';
    categoryLabel = 'Museums & Galleries';
  } else if (/\b(temples?|shrines?|churches?|mosques?|cathedrals?|basilicas?)\b/.test(lowerQuery)) {
    category = 'temples';
    categoryLabel = 'Temples & Sacred Sites';
  } else if (/\b(monuments?|memorials?|statues?)\b/.test(lowerQuery)) {
    category = 'monuments';
    categoryLabel = 'Monuments & Memorials';
  } else if (/\b(forts?|castles?|palaces?)\b/.test(lowerQuery)) {
    category = 'forts';
    categoryLabel = 'Forts & Palaces';
  } else if (/\b(parks?|gardens?|botanical|nature)\b/.test(lowerQuery)) {
    category = 'parks';
    categoryLabel = 'Parks & Nature';
  } else if (/\b(viewpoints?|scenic|skyline|observator(y|ies)|lookout)\b/.test(lowerQuery)) {
    category = 'viewpoints';
    categoryLabel = 'Scenic Viewpoints';
  } else if (/\b(historic(al)?(\s+sites?)?|heritage|ancient|ruins?)\b/.test(lowerQuery)) {
    category = 'historic';
    categoryLabel = 'Historic & Heritage Sites';
  } else if (/\b(landmarks?)\b/.test(lowerQuery)) {
    category = 'monuments';
    categoryLabel = 'Iconic Landmarks';
  }

  return {
    query: queryStr,
    location,
    category,
    categoryLabel,
    suggestedPlace: data?.suggestedPlace || 'mainline'
  };
}
