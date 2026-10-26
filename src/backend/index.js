import express from 'express';
import cors from 'cors';
import { httpServerHandler } from 'cloudflare:node';
import { env } from 'cloudflare:workers';

// Create Express app
const app = express();

// Middleware: JSON body parsing
app.use(express.json());

const devDomain = env.DEV_DOMAIN;
const stagingDomain = env.STAGING_DOMAIN;
const prodDomain = env.PROD_DOMAIN;

// Middleware: CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  devDomain,
  stagingDomain,
  prodDomain
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Placeholder for DB access
const getDB = () => env.DB;

// Helper: Haversine distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

// Category mapper for Geoapify Places API
function mapCategoryToGeoapify(rawCategory) {
  const cat = (rawCategory || '').toLowerCase().trim();
  if (cat.includes('museum')) {
    return 'entertainment.museum';
  }
  if (cat.includes('monument')) {
    return 'heritage.monument,heritage';
  }
  if (cat.includes('temple') || cat.includes('worship') || cat.includes('church') || cat.includes('mosque')) {
    return 'building.place_of_worship';
  }
  if (cat.includes('fort') || cat.includes('castle')) {
    return 'heritage.castle,heritage';
  }
  if (cat.includes('park') || cat.includes('garden')) {
    return 'leisure.park,national_park';
  }
  if (cat.includes('viewpoint') || cat.includes('scenic')) {
    return 'entertainment.culture,tourism.attraction';
  }
  if (cat.includes('historic') || cat.includes('heritage')) {
    return 'heritage,historic';
  }
  // Default tourist sights and landmarks
  return 'tourism.sights,tourism.attraction';
}

// Fallback curated tourist places for instant demo / offline / invalid API key
const CURATED_CITIES = {
  nyc: [
    {
      name: "Statue of Liberty & Ellis Island",
      category: "monuments",
      address: "Liberty Island, New York, NY 10004",
      lat: 40.6892,
      lon: -74.0445,
      description: "Iconic copper statue gifted by France, standing in New York Harbor as a universal symbol of freedom.",
      rating: 4.8,
      recommendedDuration: "2-3 hours",
      timeOfDay: "morning"
    },
    {
      name: "Central Park",
      category: "parks",
      address: "59th to 110th St, New York, NY",
      lat: 40.7851,
      lon: -73.9683,
      description: "Expansive 843-acre urban park featuring walking trails, boating lakes, ice-skating rinks, and tranquil gardens.",
      rating: 4.9,
      recommendedDuration: "2-4 hours",
      timeOfDay: "morning"
    },
    {
      name: "Metropolitan Museum of Art (The Met)",
      category: "museums",
      address: "1000 5th Ave, New York, NY 10028",
      lat: 40.7794,
      lon: -73.9632,
      description: "One of the world's largest art museums, featuring over 2 million works spanning 5,000 years of global culture.",
      rating: 4.9,
      recommendedDuration: "3-4 hours",
      timeOfDay: "afternoon"
    },
    {
      name: "Empire State Building & Observation Deck",
      category: "viewpoints",
      address: "20 W 34th St, New York, NY 10001",
      lat: 40.7484,
      lon: -73.9857,
      description: "Famed 102-story Art Deco skyscraper providing panoramic 360-degree vistas across NYC and beyond.",
      rating: 4.7,
      recommendedDuration: "1-2 hours",
      timeOfDay: "evening"
    },
    {
      name: "The High Line",
      category: "parks",
      address: "Gansevoort St to 34th St, New York, NY",
      lat: 40.7480,
      lon: -74.0048,
      description: "Elevated public park created on a historic freight rail line above Manhattan's West Side.",
      rating: 4.7,
      recommendedDuration: "1-2 hours",
      timeOfDay: "afternoon"
    },
    {
      name: "Brooklyn Bridge",
      category: "historic",
      address: "Brooklyn Bridge, New York, NY",
      lat: 40.7061,
      lon: -73.9969,
      description: "Historic 1883 suspension bridge connecting Manhattan and Brooklyn with scenic pedestrian walkways.",
      rating: 4.8,
      recommendedDuration: "1 hour",
      timeOfDay: "evening"
    }
  ],
  paris: [
    {
      name: "Eiffel Tower",
      category: "monuments",
      address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris",
      lat: 48.8584,
      lon: 2.2945,
      description: "World-renowned wrought-iron lattice tower on the Champ de Mars, designed by Gustave Eiffel.",
      rating: 4.8,
      recommendedDuration: "2 hours",
      timeOfDay: "evening"
    },
    {
      name: "Musée du Louvre",
      category: "museums",
      address: "Rue de Rivoli, 75001 Paris",
      lat: 48.8606,
      lon: 2.3376,
      description: "World's most visited museum, home to the Mona Lisa, Venus de Milo, and priceless antiquities.",
      rating: 4.9,
      recommendedDuration: "3-4 hours",
      timeOfDay: "morning"
    },
    {
      name: "Cathédrale Notre-Dame de Paris",
      category: "historic",
      address: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris",
      lat: 48.8530,
      lon: 2.3499,
      description: "Masterpiece of French Gothic architecture located on the Île de la Cité on the Seine River.",
      rating: 4.7,
      recommendedDuration: "1-2 hours",
      timeOfDay: "morning"
    },
    {
      name: "Arc de Triomphe",
      category: "monuments",
      address: "Pl. Charles de Gaulle, 75008 Paris",
      lat: 48.8738,
      lon: 2.2950,
      description: "Monumental triumphal arch honoring those who fought for France, capping the Champs-Élysées.",
      rating: 4.7,
      recommendedDuration: "1 hour",
      timeOfDay: "afternoon"
    },
    {
      name: "Sacré-Cœur Basilica & Montmartre",
      category: "viewpoints",
      address: "35 Rue du Chevalier de la Barre, 75018 Paris",
      lat: 48.8867,
      lon: 2.3431,
      description: "White-domed basilica perched atop the Montmartre butte offering spectacular Parisian panoramas.",
      rating: 4.8,
      recommendedDuration: "2 hours",
      timeOfDay: "evening"
    }
  ],
  delhi: [
    {
      name: "National Museum, New Delhi",
      category: "museums",
      address: "Janpath, Connaught Place, New Delhi 110011",
      lat: 28.6118,
      lon: 77.2193,
      description: "Premier cultural institution housing over 200,000 works of art spanning prehistoric to modern Indian eras.",
      rating: 4.6,
      recommendedDuration: "2-3 hours",
      timeOfDay: "morning"
    },
    {
      name: "National Gallery of Modern Art (NGMA)",
      category: "museums",
      address: "Jaipur House, Shershah Rd, India Gate, New Delhi 110003",
      lat: 28.6097,
      lon: 77.2346,
      description: "Leading museum of contemporary Indian art exhibiting masterworks by Raja Ravi Varma and Amrita Sher-Gil.",
      rating: 4.7,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    },
    {
      name: "India Gate & Kartavya Path",
      category: "monuments",
      address: "Rajpath, India Gate, New Delhi 110001",
      lat: 28.6129,
      lon: 77.2295,
      description: "Majestic war memorial arch honoring soldiers, surrounded by lush lawns and fountains.",
      rating: 4.7,
      recommendedDuration: "1-2 hours",
      timeOfDay: "evening"
    },
    {
      name: "Humayun's Tomb",
      category: "historic",
      address: "Mathura Road, Nizamuddin East, New Delhi 110013",
      lat: 28.5933,
      lon: 77.2507,
      description: "UNESCO World Heritage site and splendid Persian-influenced Mughal garden tomb that inspired the Taj Mahal.",
      rating: 4.8,
      recommendedDuration: "2 hours",
      timeOfDay: "morning"
    },
    {
      name: "Qutub Minar",
      category: "monuments",
      address: "Seth Sarai, Mehrauli, New Delhi 110030",
      lat: 28.5245,
      lon: 77.1855,
      description: "73-meter-high fluted red sandstone minaret dating back to 1192 with intricate Arabic inscriptions.",
      rating: 4.7,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    }
  ],
  kurukshetra: [
    {
      name: "Brahma Sarovar",
      category: "historic",
      address: "Thanesar, Kurukshetra, Haryana 136118",
      lat: 29.9624,
      lon: 76.8344,
      description: "Ancient sacred water body mentioned in the Mahabharata, stretching 1,800 feet long with grand ghats.",
      rating: 4.8,
      recommendedDuration: "2 hours",
      timeOfDay: "morning"
    },
    {
      name: "Jyotisar Birthplace of Bhagavad Gita",
      category: "historic",
      address: "Jyotisar, Kurukshetra, Haryana 136118",
      lat: 29.9577,
      lon: 76.7725,
      description: "Revered historical site where Lord Krishna delivered the Bhagavad Gita to Arjuna beneath a sacred banyan tree.",
      rating: 4.7,
      recommendedDuration: "2 hours",
      timeOfDay: "morning"
    },
    {
      name: "Kurukshetra Panorama and Science Centre",
      category: "museums",
      address: "Near Brahma Sarovar, Kurukshetra 136118",
      lat: 29.9678,
      lon: 76.8402,
      description: "Interactive museum displaying a lifelike 360-degree cylindrical panorama of the 18-day battle of Mahabharata.",
      rating: 4.6,
      recommendedDuration: "2 hours",
      timeOfDay: "afternoon"
    },
    {
      name: "Sheikh Chilli's Tomb",
      category: "monuments",
      address: "Thanesar, Kurukshetra 136118",
      lat: 29.9824,
      lon: 76.8228,
      description: "Mughal architectural jewel featuring a marble dome surrounded by landscaped Mughal gardens and museum.",
      rating: 4.5,
      recommendedDuration: "1.5 hours",
      timeOfDay: "afternoon"
    },
    {
      name: "Sannihit Sarovar",
      category: "temples",
      address: "Pehowa Road, Kurukshetra 136118",
      lat: 29.9715,
      lon: 76.8335,
      description: "Sacred reservoir believed to be the confluence of seven sacred Saraswati rivers, hosting Dhruv Narayan shrines.",
      rating: 4.6,
      recommendedDuration: "1 hour",
      timeOfDay: "evening"
    }
  ],
  rome: [
    {
      name: "Colosseum (Flavian Amphitheatre)",
      category: "monuments",
      address: "Piazza del Colosseo, 1, 00184 Roma RM",
      lat: 41.8902,
      lon: 12.4922,
      description: "The largest ancient amphitheatre ever built, hosting gladiatorial spectacles and imperial gatherings.",
      rating: 4.9,
      recommendedDuration: "2-3 hours",
      timeOfDay: "morning"
    },
    {
      name: "Pantheon",
      category: "historic",
      address: "Piazza della Rotonda, 00186 Roma RM",
      lat: 41.8986,
      lon: 12.4769,
      description: "Immaculately preserved Roman temple renowned for its unreinforced concrete dome and magnificent central oculus.",
      rating: 4.8,
      recommendedDuration: "1 hour",
      timeOfDay: "afternoon"
    },
    {
      name: "Trevi Fountain",
      category: "monuments",
      address: "Piazza di Trevi, 00187 Roma RM",
      lat: 41.9009,
      lon: 12.4833,
      description: "Baroque fountain marvel depicting Neptune taming the waters; toss a coin to ensure your return to Rome.",
      rating: 4.8,
      recommendedDuration: "45 minutes",
      timeOfDay: "evening"
    },
    {
      name: "Roman Forum & Palatine Hill",
      category: "historic",
      address: "Via della Salara Vecchia, 5/6, 00186 Roma RM",
      lat: 41.8925,
      lon: 12.4853,
      description: "The beating civic and religious heart of ancient Rome, filled with temples, basilicas, and triumphal arches.",
      rating: 4.8,
      recommendedDuration: "2-3 hours",
      timeOfDay: "morning"
    }
  ]
};

// Route: Get Tourist Places strictly via Geoapify API
app.get('/api/places', async (req, res) => {
  try {
    let lat = parseFloat(req.query.lat);
    let lon = parseFloat(req.query.lon);
    const city = req.query.city || req.query.query || '';
    const category = req.query.category || '';
    const radius = parseInt(req.query.radius) || 15000;
    const limit = Math.min(parseInt(req.query.limit) || 20, 20); // Geoapify max 20 per call as specified

    const apiKey = env.GEOAPIFY_API_KEY || (typeof process !== 'undefined' ? process.env?.GEOAPIFY_API_KEY : '');
    const geoapifyCategory = mapCategoryToGeoapify(category);

    let places = [];
    let isLiveApi = false;
    let resolvedLocation = null;

    if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_API_KEY') {
      try {
        const cleanKey = apiKey.trim();

        // 1. Dynamic Geocoding via Geoapify if city name is provided
        if (city && city.trim() !== '' && city.toLowerCase() !== 'explore destination' && city.toLowerCase() !== 'nearby') {
          try {
            const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city.trim())}&apiKey=${cleanKey}`;
            const geocodeRes = await fetch(geocodeUrl);
            if (geocodeRes.ok) {
              const gData = await geocodeRes.json();
              if (gData && gData.features && gData.features.length > 0) {
                const feat = gData.features[0];
                const [gLon, gLat] = feat.geometry.coordinates;
                lon = gLon;
                lat = gLat;
                resolvedLocation = {
                  city: feat.properties.city || feat.properties.name || city,
                  state: feat.properties.state || '',
                  country: feat.properties.country || '',
                  lat: gLat,
                  lon: gLon
                };
              }
            }
          } catch (geoErr) {
            console.warn('Geocoding error:', geoErr.message);
          }
        }

        if (isNaN(lat) || isNaN(lon)) {
          return res.status(400).json({ error: 'Valid latitude (lat) and longitude (lon) or city name are required' });
        }

        // 2. Fetch Places strictly from Geoapify API with proximity bias
        let geoUrl = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(geoapifyCategory)}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=${limit}&apiKey=${cleanKey}`;
        let response = await fetch(geoUrl);
        let data = response.ok ? await response.json() : null;

        // Auto-expand radius or categories if few places found
        if ((!data || !data.features || data.features.length < 3) && radius < 40000) {
          const fallbackCat = 'tourism,heritage,leisure.park,entertainment.culture,building.place_of_worship';
          const wideUrl = `https://api.geoapify.com/v2/places?categories=${encodeURIComponent(fallbackCat)}&filter=circle:${lon},${lat},35000&bias=proximity:${lon},${lat}&limit=${limit}&apiKey=${cleanKey}`;
          const wideRes = await fetch(wideUrl);
          if (wideRes.ok) {
            data = await wideRes.json();
          }
        }

        if (data && data.features && data.features.length > 0) {
          places = data.features
            .filter(f => f.properties && f.properties.name && f.properties.name.trim() !== '') // Filter unnamed places
            .filter(f => {
              // Strict tourist attraction filter: filter out restaurants, hotels, commercial stores, grocery markets
              const cats = f.properties.categories || [];
              const nameLower = (f.properties.name || '').toLowerCase();
              const isCommercialOrFood = cats.some(c =>
                c.startsWith('catering') ||
                c.startsWith('accommodation') ||
                c.startsWith('commercial') ||
                c.startsWith('amenity.marketplace') ||
                c.startsWith('service')
              );
              const isMarket = !cats.some(c => c.startsWith('heritage')) && (
                nameLower.includes('market') ||
                nameLower.includes('bazaar') ||
                nameLower.includes('mall') ||
                nameLower.includes('store') ||
                nameLower.includes('shop')
              );
              // Obscure plaques / single continent names filter
              const obscureNames = ['europe', 'asia', 'africa', 'america', 'life underground', "343 the city's bravest", 'jose protacio rizal', 'welcome to secaucus'];
              if (obscureNames.includes(nameLower) || nameLower.startsWith('welcome to')) {
                return false;
              }

              return !isCommercialOrFood && !isMarket;
            })
            .map(f => {
              const props = f.properties;
              const coords = f.geometry?.coordinates || [lon, lat];
              const pLon = coords[0];
              const pLat = coords[1];
              const distKm = props.distance ? Math.round(props.distance / 100) / 10 : calculateDistance(lat, lon, pLat, pLon);

              return {
                placeId: props.place_id || `${pLat}-${pLon}`,
                name: props.name,
                category: props.categories?.[0] || 'tourism.sights',
                address: props.formatted || props.address_line2 || props.street || '',
                city: props.city || '',
                country: props.country || '',
                lat: pLat,
                lon: pLon,
                distanceKm: distKm,
                description: props.description || (props.wiki_and_media?.wikipedia_extracts) || '',
                website: props.website || props.contact?.website || null,
                openingHours: props.opening_hours || null
              };
            });

          isLiveApi = true;
        }
      } catch (apiErr) {
        console.warn('Error fetching from Geoapify API:', apiErr.message);
      }
    }

    // Safety fallback ONLY if live API key is missing or entirely unavailable
    if (places.length === 0 && !isLiveApi) {
      let matchedCityKey = null;
      let minCityDist = Infinity;
      for (const [key, cityList] of Object.entries(CURATED_CITIES)) {
        if (cityList.length > 0) {
          const d = calculateDistance(lat, lon, cityList[0].lat, cityList[0].lon);
          if (d < minCityDist) {
            minCityDist = d;
            matchedCityKey = key;
          }
        }
      }

      if (matchedCityKey && minCityDist < 100) {
        places = CURATED_CITIES[matchedCityKey].map((p, idx) => ({
          placeId: `curated-${matchedCityKey}-${idx}`,
          name: p.name,
          category: p.category,
          address: p.address,
          lat: p.lat,
          lon: p.lon,
          distanceKm: calculateDistance(lat, lon, p.lat, p.lon),
          description: p.description,
          rating: p.rating,
          recommendedDuration: p.recommendedDuration,
          timeOfDay: p.timeOfDay
        }));

        if (category && category.trim()) {
          const catFilter = category.toLowerCase().trim();
          const filtered = places.filter(p => {
            const pCat = (p.category || '').toLowerCase();
            const pName = (p.name || '').toLowerCase();
            return pCat.includes(catFilter) || pName.includes(catFilter);
          });
          if (filtered.length > 0) {
            places = filtered;
          }
        }
      }
    }

    // Sort strictly by proximity to queried location
    places.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    res.json({
      success: true,
      count: places.length,
      isLiveApi,
      resolvedLocation,
      places: places.slice(0, limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching places', details: err.message });
  }
});

// Route: Get Weather Forecast via Open-Meteo (free, zero API key required)
app.get('/api/weather', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'Valid latitude and longitude required' });
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch weather from Open-Meteo' });
    }

    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};

    // Interpret WMO weather codes
    const interpretWeather = (code) => {
      if (code === 0) return { label: 'Clear Sky', icon: '☀️' };
      if (code === 1 || code === 2) return { label: 'Partly Cloudy', icon: '🌤️' };
      if (code === 3) return { label: 'Overcast', icon: '☁️' };
      if (code >= 45 && code <= 48) return { label: 'Foggy', icon: '🌫️' };
      if (code >= 51 && code <= 67) return { label: 'Rain Showers', icon: '🌧️' };
      if (code >= 71 && code <= 77) return { label: 'Snowy', icon: '❄️' };
      if (code >= 80 && code <= 82) return { label: 'Heavy Rain', icon: '⛈️' };
      if (code >= 95) return { label: 'Thunderstorm', icon: '⚡' };
      return { label: 'Fair', icon: '🌤️' };
    };

    const condition = interpretWeather(current.weather_code);

    res.json({
      success: true,
      current: {
        temperature: Math.round(current.temperature_2m ?? 22),
        feelsLike: Math.round(current.apparent_temperature ?? 22),
        humidity: current.relative_humidity_2m ?? 50,
        windSpeed: current.wind_speed_10m ?? 8,
        condition: condition.label,
        icon: condition.icon,
        isDay: current.is_day === 1
      },
      forecast: (daily.time || []).slice(0, 3).map((date, idx) => ({
        date,
        maxTemp: Math.round(daily.temperature_2m_max?.[idx] ?? 25),
        minTemp: Math.round(daily.temperature_2m_min?.[idx] ?? 16),
        condition: interpretWeather(daily.weather_code?.[idx]).label,
        icon: interpretWeather(daily.weather_code?.[idx]).icon
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching weather data', details: err.message });
  }
});

// Route: Generate Smart Day Plan (Itinerary)
app.post('/api/itinerary', (req, res) => {
  try {
    const { places, startLat, startLon } = req.body;
    if (!places || !Array.isArray(places) || places.length === 0) {
      return res.status(400).json({ error: 'Places array is required' });
    }

    // Nearest Neighbor Ordering heuristic to minimize travel distance
    let unvisited = [...places];
    let currentPoint = {
      lat: startLat || places[0].lat,
      lon: startLon || places[0].lon
    };

    const ordered = [];
    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const d = calculateDistance(currentPoint.lat, currentPoint.lon, unvisited[i].lat, unvisited[i].lon);
        if (d < minDistance) {
          minDistance = d;
          nearestIdx = i;
        }
      }

      const nextPlace = unvisited.splice(nearestIdx, 1)[0];
      const legDist = calculateDistance(currentPoint.lat, currentPoint.lon, nextPlace.lat, nextPlace.lon);
      ordered.push({
        ...nextPlace,
        legDistanceKm: legDist,
        estTransitMinutes: Math.max(10, Math.round(legDist * 12)) // ~5 km/h walking or city transit
      });
      currentPoint = { lat: nextPlace.lat, lon: nextPlace.lon };
    }

    // Assign sensible time-of-day slots
    const timeSlots = [
      { slot: 'Morning', time: '09:30 AM - 12:30 PM', tip: 'Start early to beat the crowds' },
      { slot: 'Midday', time: '12:30 PM - 02:00 PM', tip: 'Great spot for lunch and a restful stroll nearby' },
      { slot: 'Afternoon', time: '02:00 PM - 05:00 PM', tip: 'Prime hours for exploration' },
      { slot: 'Evening', time: '05:30 PM - 07:30 PM', tip: 'Golden hour views & illuminated landmarks' }
    ];

    const itinerary = ordered.map((item, idx) => {
      const slotInfo = timeSlots[Math.min(idx, timeSlots.length - 1)];
      return {
        step: idx + 1,
        ...item,
        slotName: slotInfo.slot,
        suggestedTime: slotInfo.time,
        tip: slotInfo.tip
      };
    });

    const totalDistance = ordered.reduce((sum, item) => sum + (item.legDistanceKm || 0), 0);

    res.json({
      success: true,
      itinerary,
      totalStops: itinerary.length,
      totalDistanceKm: Math.round(totalDistance * 10) / 10
    });
  } catch (err) {
    res.status(500).json({ error: 'Error generating itinerary', details: err.message });
  }
});

// Basic Health Check & Info
app.get('/api/message', (req, res) => {
  const hasKey = Boolean(env.GEOAPIFY_API_KEY || (typeof process !== 'undefined' && process.env?.GEOAPIFY_API_KEY));
  res.json({
    message: 'Tourism Explorer backend is active',
    geoapifyConfigured: hasKey
  });
});

app.listen(3000);
export default httpServerHandler({ port: 3000 });
