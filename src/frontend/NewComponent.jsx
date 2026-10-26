import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
  Button,
  Grid,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import RouteIcon from '@mui/icons-material/Route';
import MapIcon from '@mui/icons-material/Map';
import MuseumIcon from '@mui/icons-material/Museum';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CastleIcon from '@mui/icons-material/Castle';
import ParkIcon from '@mui/icons-material/Park';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LocationCityIcon from '@mui/icons-material/LocationCity';

import { parseSearchPayload } from './utils/queryParser';
import { getDestinationHeroImage } from './utils/placeImages';
import WeatherCard from './components/WeatherCard';
import AttractionCard from './components/AttractionCard';
import DayPlanView from './components/DayPlanView';
import InteractiveMap from './components/InteractiveMap';
import EmptyState from './components/EmptyState';
import PlaceDetailModal from './components/PlaceDetailModal';

// Fallback curated places for zero-config offline demonstration
const LOCAL_FALLBACKS = {
  delhi: [
    {
      placeId: 'fb-delhi-1',
      name: 'India Gate & Kartavya Path',
      category: 'monuments',
      address: 'Rajpath, India Gate, New Delhi 110001',
      lat: 28.6129,
      lon: 77.2295,
      distanceKm: 1.5,
      description: 'Iconic war memorial arch honoring soldiers, surrounded by lush manicured lawns and fountains.',
      rating: 4.8,
      recommendedDuration: '1-2 hours',
      timeOfDay: 'evening'
    },
    {
      placeId: 'fb-delhi-2',
      name: 'Red Fort (Lal Qila)',
      category: 'historic',
      address: 'Netaji Subhash Marg, Lal Qila, Chandni Chowk, Delhi 110006',
      lat: 28.6562,
      lon: 77.2410,
      distanceKm: 4.8,
      description: 'Historic Mughal fortress made of massive red sandstone walls, housing palaces and museum exhibits.',
      rating: 4.7,
      recommendedDuration: '2-3 hours',
      timeOfDay: 'morning'
    },
    {
      placeId: 'fb-delhi-3',
      name: 'National Museum, New Delhi',
      category: 'museums',
      address: 'Janpath, Connaught Place, New Delhi 110011',
      lat: 28.6118,
      lon: 77.2193,
      distanceKm: 1.8,
      description: 'Premier cultural institution housing over 200,000 works of art spanning prehistoric to modern Indian eras.',
      rating: 4.6,
      recommendedDuration: '2-3 hours',
      timeOfDay: 'afternoon'
    },
    {
      placeId: 'fb-delhi-4',
      name: 'Qutub Minar',
      category: 'monuments',
      address: 'Seth Sarai, Mehrauli, New Delhi 110030',
      lat: 28.5245,
      lon: 77.1855,
      distanceKm: 11.2,
      description: '73-meter-high fluted red sandstone minaret dating back to 1192 with intricate Arabic inscriptions.',
      rating: 4.8,
      recommendedDuration: '2 hours',
      timeOfDay: 'afternoon'
    },
    {
      placeId: 'fb-delhi-5',
      name: "Humayun's Tomb",
      category: 'historic',
      address: 'Mathura Road, Nizamuddin East, New Delhi 110013',
      lat: 28.5933,
      lon: 77.2507,
      distanceKm: 5.1,
      description: 'UNESCO World Heritage site and splendid Persian-influenced Mughal garden tomb that inspired the Taj Mahal.',
      rating: 4.8,
      recommendedDuration: '2 hours',
      timeOfDay: 'morning'
    }
  ],
  kurukshetra: [
    {
      placeId: 'fb-kkr-1',
      name: 'Brahma Sarovar',
      category: 'historic',
      address: 'Thanesar, Kurukshetra, Haryana 136118',
      lat: 29.9624,
      lon: 76.8344,
      distanceKm: 1.2,
      description: 'Ancient sacred water body mentioned in the Mahabharata, stretching 1,800 feet long with grand ghats.',
      rating: 4.8,
      recommendedDuration: '2 hours',
      timeOfDay: 'morning'
    },
    {
      placeId: 'fb-kkr-2',
      name: 'Jyotisar Birthplace of Bhagavad Gita',
      category: 'historic',
      address: 'Jyotisar, Kurukshetra, Haryana 136118',
      lat: 29.9577,
      lon: 76.7725,
      distanceKm: 5.4,
      description: 'Revered historical site where Lord Krishna delivered the Bhagavad Gita to Arjuna beneath a sacred banyan tree.',
      rating: 4.7,
      recommendedDuration: '2 hours',
      timeOfDay: 'morning'
    },
    {
      placeId: 'fb-kkr-3',
      name: 'Kurukshetra Panorama and Science Centre',
      category: 'museums',
      address: 'Near Brahma Sarovar, Kurukshetra 136118',
      lat: 29.9678,
      lon: 76.8402,
      distanceKm: 1.5,
      description: 'Interactive museum displaying a lifelike 360-degree cylindrical panorama of the 18-day battle of Mahabharata.',
      rating: 4.6,
      recommendedDuration: '2 hours',
      timeOfDay: 'afternoon'
    },
    {
      placeId: 'fb-kkr-4',
      name: "Sheikh Chilli's Tomb",
      category: 'monuments',
      address: 'Thanesar, Kurukshetra 136118',
      lat: 29.9824,
      lon: 76.8228,
      distanceKm: 2.1,
      description: 'Mughal architectural jewel featuring a marble dome surrounded by landscaped Mughal gardens and museum.',
      rating: 4.5,
      recommendedDuration: '1.5 hours',
      timeOfDay: 'afternoon'
    }
  ],
  paris: [
    {
      placeId: 'fb-paris-1',
      name: 'Eiffel Tower',
      category: 'monuments',
      address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris',
      lat: 48.8584,
      lon: 2.2945,
      distanceKm: 2.1,
      description: 'World-renowned wrought-iron lattice tower on the Champ de Mars, designed by Gustave Eiffel.',
      rating: 4.8,
      recommendedDuration: '2 hours',
      timeOfDay: 'evening'
    },
    {
      placeId: 'fb-paris-2',
      name: 'Musée du Louvre',
      category: 'museums',
      address: 'Rue de Rivoli, 75001 Paris',
      lat: 48.8606,
      lon: 2.3376,
      distanceKm: 1.2,
      description: "World's most visited museum, home to the Mona Lisa, Venus de Milo, and priceless antiquities.",
      rating: 4.9,
      recommendedDuration: '3-4 hours',
      timeOfDay: 'morning'
    },
    {
      placeId: 'fb-paris-3',
      name: 'Cathédrale Notre-Dame de Paris',
      category: 'historic',
      address: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris',
      lat: 48.8530,
      lon: 2.3499,
      distanceKm: 0.8,
      description: 'Masterpiece of French Gothic architecture located on the Île de la Cité on the Seine River.',
      rating: 4.7,
      recommendedDuration: '1-2 hours',
      timeOfDay: 'morning'
    }
  ],
  nyc: [
    {
      placeId: 'fb-nyc-1',
      name: 'Statue of Liberty & Ellis Island',
      category: 'monuments',
      address: 'Liberty Island, New York, NY 10004',
      lat: 40.6892,
      lon: -74.0445,
      distanceKm: 2.4,
      description: 'Iconic copper statue gifted by France, standing in New York Harbor as a universal symbol of freedom.',
      rating: 4.8,
      recommendedDuration: '2-3 hours',
      timeOfDay: 'morning'
    },
    {
      placeId: 'fb-nyc-2',
      name: 'Central Park',
      category: 'parks',
      address: '59th to 110th St, New York, NY',
      lat: 40.7851,
      lon: -73.9683,
      distanceKm: 3.1,
      description: 'Expansive 843-acre urban park featuring walking trails, boating lakes, ice-skating rinks, and tranquil gardens.',
      rating: 4.9,
      recommendedDuration: '2-4 hours',
      timeOfDay: 'morning'
    },
    {
      placeId: 'fb-nyc-3',
      name: 'Metropolitan Museum of Art (The Met)',
      category: 'museums',
      address: '1000 5th Ave, New York, NY 10028',
      lat: 40.7794,
      lon: -73.9632,
      distanceKm: 4.0,
      description: "One of the world's largest art museums, featuring over 2 million works spanning 5,000 years of global culture.",
      rating: 4.9,
      recommendedDuration: '3-4 hours',
      timeOfDay: 'afternoon'
    },
    {
      placeId: 'fb-nyc-4',
      name: 'Empire State Building',
      category: 'viewpoints',
      address: '20 W 34th St, New York, NY 10001',
      lat: 40.7484,
      lon: -73.9857,
      distanceKm: 1.8,
      description: 'Famed 102-story Art Deco skyscraper providing panoramic 360-degree vistas across NYC and beyond.',
      rating: 4.7,
      recommendedDuration: '1-2 hours',
      timeOfDay: 'evening'
    },
    {
      placeId: 'fb-nyc-5',
      name: 'Brooklyn Bridge',
      category: 'historic',
      address: 'Brooklyn Bridge, New York, NY',
      lat: 40.7061,
      lon: -73.9969,
      distanceKm: 1.2,
      description: 'Historic 1883 suspension bridge connecting Manhattan and Brooklyn with scenic pedestrian walkways.',
      rating: 4.8,
      recommendedDuration: '1 hour',
      timeOfDay: 'evening'
    }
  ]
};

export default function NewComponent(props) {
  // Determine format: mainline (full width) or sidebar (~320-400px)
  const isSidebar = props.format === 'sidebar';

  // Platform API URL resolution as strictly instructed in AGENTS.md
  const API_URL =
    process.env.NODE_ENV === 'production'
      ? props.deployedBackendURL ?? ''
      : import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001';

  // Theme mode (respect platform theme or default to light with toggle)
  const [darkMode, setDarkMode] = useState(
    props.theme?.palette?.mode === 'dark' || false
  );

  // Inject Untree Google Fonts (Source Serif Pro + Inter)
  useEffect(() => {
    const linkId = 'untree-tour-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const activeTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: { main: '#1A374D' }, // Untree signature deep ocean navy
        secondary: { main: '#F66B0E' }, // Untree sunset coral
        background: {
          default: darkMode ? '#0D1B2A' : '#F8FAFC',
          paper: darkMode ? '#112B3C' : '#ffffff',
        },
      },
      typography: {
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        h1: { fontFamily: '"Source Serif Pro", Georgia, serif' },
        h2: { fontFamily: '"Source Serif Pro", Georgia, serif' },
        h3: { fontFamily: '"Source Serif Pro", Georgia, serif' },
        h4: { fontFamily: '"Source Serif Pro", Georgia, serif' },
        h5: { fontFamily: '"Source Serif Pro", Georgia, serif' },
        h6: { fontFamily: '"Source Serif Pro", Georgia, serif' },
      },
    });
  }, [darkMode]);

  // Parse location and category from searchData or search query
  const parsedSearch = useMemo(() => {
    return parseSearchPayload(props.searchData, props.searchQuery);
  }, [props.searchData, props.searchQuery]);

  const { location, category: initialCategory } = parsedSearch;

  // Component state
  const [activeTab, setActiveTab] = useState(0); // 0: Explore, 1: Day Plan, 2: Map
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [places, setPlaces] = useState([]);
  const [dayPlan, setDayPlan] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMapPlace, setSelectedMapPlace] = useState(null);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [detailPlace, setDetailPlace] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [overrideLocation, setOverrideLocation] = useState(null);

  const activeLocation = overrideLocation || location;

  // Sync initial category when parsed query changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Fetch Tourist Attractions from Backend API
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    async function loadPlaces() {
      try {
        const catQuery = selectedCategory !== 'all' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
        const cityParam = activeLocation.city ? `&city=${encodeURIComponent(activeLocation.city)}` : '';
        const url = `${API_URL}/api/places?lat=${activeLocation.lat}&lon=${activeLocation.lon}&radius=15000&limit=20${cityParam}${catQuery}`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            const list = data.places || [];
            setPlaces(list);
            if (dayPlan.length === 0 && list.length > 0) {
              setDayPlan(list.slice(0, 4));
            }
            if (data.resolvedLocation && (!activeLocation.exactResolved || Math.abs(activeLocation.lat - data.resolvedLocation.lat) > 0.05)) {
              setOverrideLocation({
                city: data.resolvedLocation.city || activeLocation.city,
                state: data.resolvedLocation.state || activeLocation.state,
                country: data.resolvedLocation.country || activeLocation.country,
                lat: data.resolvedLocation.lat,
                lon: data.resolvedLocation.lon,
                hasLocation: true,
                exactResolved: true
              });
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to local dataset:', err);
      }

      // Fallback only if backend request failed (e.g. backend server not started)
      if (!isCancelled) {
        const locName = `${activeLocation.city} ${activeLocation.country}`.toLowerCase();
        let fallbackList = LOCAL_FALLBACKS.nyc;
        if (locName.includes('delhi') || locName.includes('india')) {
          fallbackList = LOCAL_FALLBACKS.delhi;
        } else if (locName.includes('kurukshetra')) {
          fallbackList = LOCAL_FALLBACKS.kurukshetra;
        } else if (locName.includes('paris') || locName.includes('france')) {
          fallbackList = LOCAL_FALLBACKS.paris;
        }

        const filtered =
          selectedCategory === 'all'
            ? fallbackList
            : fallbackList.filter(
                (p) =>
                  p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                  p.name.toLowerCase().includes(selectedCategory.toLowerCase())
              );
        setPlaces(filtered);
        if (dayPlan.length === 0 && filtered.length > 0) {
          setDayPlan(filtered.slice(0, 4));
        }
      }
    }

    async function loadWeather() {
      try {
        const res = await fetch(`${API_URL}/api/weather?lat=${activeLocation.lat}&lon=${activeLocation.lon}`);
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.current) {
            setWeather(data);
          }
        }
      } catch (e) {
        // Fallback default weather
        if (!isCancelled) {
          setWeather({
            current: { temperature: 21, condition: 'Partly Cloudy', icon: '🌤️', humidity: 55, windSpeed: 10 },
            forecast: []
          });
        }
      }
    }

    Promise.all([loadPlaces(), loadWeather()]).finally(() => {
      if (!isCancelled) {
        setLoading(false);
        // Call componentLoaded once data has rendered as required by AGENTS.md §6.1
        if (!loadedOnce) {
          props?.messageHandlers?.componentLoaded?.();
          setLoadedOnce(true);
        }
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [activeLocation.lat, activeLocation.lon, selectedCategory, API_URL]);

  // Generate Itinerary Route when dayPlan places change
  const [itineraryResult, setItineraryResult] = useState({ itinerary: [], totalDistanceKm: 0 });

  useEffect(() => {
    if (dayPlan.length === 0) {
      setItineraryResult({ itinerary: [], totalDistanceKm: 0 });
      return;
    }

    let isMounted = true;
    async function calculateItinerary() {
      try {
        const res = await fetch(`${API_URL}/api/itinerary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            places: dayPlan,
            startLat: activeLocation.lat,
            startLon: activeLocation.lon,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.itinerary) {
            setItineraryResult({
              itinerary: data.itinerary,
              totalDistanceKm: data.totalDistanceKm || 0,
            });
            return;
          }
        }
      } catch (err) {
        // Fallback simple ordering
      }

      if (isMounted) {
        const slots = ['Morning', 'Midday', 'Afternoon', 'Evening'];
        const times = ['09:30 AM - 12:30 PM', '12:30 PM - 02:00 PM', '02:00 PM - 05:00 PM', '05:30 PM - 07:30 PM'];
        setItineraryResult({
          itinerary: dayPlan.map((p, idx) => ({
            ...p,
            step: idx + 1,
            slotName: slots[Math.min(idx, 3)],
            suggestedTime: times[Math.min(idx, 3)],
            legDistanceKm: 1.2,
            estTransitMinutes: 15,
            tip: 'Ideal sightseeing order based on proximity',
          })),
          totalDistanceKm: Math.round(dayPlan.length * 1.4 * 10) / 10,
        });
      }
    }

    calculateItinerary();
    return () => {
      isMounted = false;
    };
  }, [dayPlan, location.lat, location.lon, API_URL]);

  // Toggle place into Day Plan
  const handleToggleDayPlan = (place) => {
    setDayPlan((prev) => {
      const exists = prev.some((p) => (p.placeId || p.name) === (place.placeId || place.name));
      if (exists) {
        return prev.filter((p) => (p.placeId || p.name) !== (place.placeId || place.name));
      } else {
        return [...prev, place];
      }
    });
  };

  // Locate place on map and switch to map tab
  const handleSelectMapPlace = (place) => {
    setSelectedMapPlace(place);
    setActiveTab(2); // Jump to map view
  };

  const categoriesList = [
    { id: 'all', label: 'All Sights', icon: <ExploreIcon sx={{ fontSize: 15 }} /> },
    { id: 'museums', label: 'Museums', icon: <MuseumIcon sx={{ fontSize: 15 }} /> },
    { id: 'monuments', label: 'Monuments', icon: <AccountBalanceIcon sx={{ fontSize: 15 }} /> },
    { id: 'historic', label: 'Historic', icon: <AccountBalanceIcon sx={{ fontSize: 15 }} /> },
    { id: 'temples', label: 'Temples', icon: <TempleHinduIcon sx={{ fontSize: 15 }} /> },
    { id: 'forts', label: 'Forts', icon: <CastleIcon sx={{ fontSize: 15 }} /> },
    { id: 'parks', label: 'Parks', icon: <ParkIcon sx={{ fontSize: 15 }} /> },
    { id: 'viewpoints', label: 'Viewpoints', icon: <VisibilityIcon sx={{ fontSize: 15 }} /> },
  ];

  const heroImage = useMemo(() => getDestinationHeroImage(activeLocation.city), [activeLocation.city]);

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          maxWidth: isSidebar ? '420px' : '960px',
          mx: 'auto',
          p: isSidebar ? 1.5 : 2.5,
          color: darkMode ? '#f8fafc' : '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {/* Untree Tour Style Brand Navbar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1A374D 0%, #406882 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(26, 55, 77, 0.25)',
              }}
            >
              <ExploreIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Source Serif Pro", Georgia, serif',
                  fontWeight: 900,
                  fontSize: isSidebar ? '1.2rem' : '1.45rem',
                  lineHeight: 1.1,
                  color: darkMode ? '#ffffff' : '#1A374D',
                }}
              >
                Tour<Box component="span" sx={{ color: '#F66B0E' }}>.</Box>
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: darkMode ? '#94a3b8' : '#556575',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.4,
                  fontWeight: 600,
                  fontSize: '0.72rem',
                }}
              >
                <LocationCityIcon sx={{ fontSize: 13, color: '#F66B0E' }} />
                {activeLocation.city || 'Destinations'} {activeLocation.country ? `• ${activeLocation.country}` : ''}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {weather?.current && (
              <Chip
                label={`${weather.current.icon} ${weather.current.temperature}°C`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  borderRadius: '30px',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(26, 55, 77, 0.08)',
                  color: darkMode ? '#f8fafc' : '#1A374D',
                }}
              />
            )}
            <IconButton
              size="small"
              onClick={() => setDarkMode(!darkMode)}
              sx={{
                p: 0.6,
                borderRadius: '50%',
                border: '1px solid',
                borderColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(26, 55, 77, 0.15)',
              }}
            >
              {darkMode ? <Brightness7Icon fontSize="small" sx={{ color: '#F66B0E' }} /> : <Brightness4Icon fontSize="small" sx={{ color: '#1A374D' }} />}
            </IconButton>
          </Box>
        </Box>

        {/* Untree Tour Editorial Hero Header with Scenic Landscape Background */}
        <Box
          sx={{
            mb: 2,
            p: isSidebar ? 2 : 3,
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: `linear-gradient(180deg, rgba(17, 43, 60, 0.72) 0%, rgba(13, 27, 42, 0.88) 100%), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#ffffff',
            boxShadow: '0 12px 28px rgba(26, 55, 77, 0.32)',
            border: '1px solid',
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.22)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Source Serif Pro", Georgia, serif',
              fontWeight: 700,
              fontSize: isSidebar ? '1.3rem' : '1.85rem',
              lineHeight: 1.22,
              mb: 0.8,
            }}
          >
            Let's Explore Your Trip In{' '}
            <Box
              component="span"
              sx={{
                color: '#F66B0E',
                position: 'relative',
                display: 'inline-block',
                borderBottom: '2.5px solid #F66B0E',
              }}
            >
              {activeLocation.city}
            </Box>
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.82)',
              fontSize: isSidebar ? '0.78rem' : '0.88rem',
              mb: 1.5,
              fontWeight: 400,
            }}
          >
            Curated attractions, live atmospheric forecast & optimized day itineraries.
          </Typography>

          {/* Untree Stats Ribbon */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1,
              pt: 1.2,
              borderTop: '1px solid rgba(255, 255, 255, 0.14)',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: isSidebar ? '0.85rem' : '1.15rem', color: '#F66B0E' }}>
                {places.length}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                Attractions
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: isSidebar ? '0.85rem' : '1.15rem', color: '#ffffff' }}>
                {weather?.current ? `${weather.current.temperature}°C` : 'Live'}
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                Weather
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: isSidebar ? '0.85rem' : '1.15rem', color: '#ffffff' }}>
                {dayPlan.length} Stops
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                Itinerary
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: isSidebar ? '0.85rem' : '1.15rem', color: '#ffffff' }}>
                GPS Map
              </Typography>
              <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                Explore
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Weather Forecast Banner */}
        <WeatherCard
          weather={weather}
          cityName={activeLocation.city}
          isSidebar={isSidebar}
          isDark={darkMode}
        />

        {/* Untree Category Filter Pills (Scrollable horizontally) */}
        <Box
          sx={{
            display: 'flex',
            gap: 0.8,
            overflowX: 'auto',
            pb: 1,
            mb: 1.5,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Chip
                key={cat.id}
                icon={cat.icon}
                label={cat.label}
                onClick={() => setSelectedCategory(cat.id)}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.74rem',
                  height: 30,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: isSelected
                    ? '#F66B0E'
                    : darkMode
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(26, 55, 77, 0.15)',
                  backgroundColor: isSelected
                    ? '#F66B0E'
                    : darkMode
                    ? 'rgba(17, 43, 60, 0.6)'
                    : '#ffffff',
                  color: isSelected
                    ? '#ffffff'
                    : darkMode
                    ? '#f8fafc'
                    : '#1A374D',
                  boxShadow: isSelected ? '0 3px 10px rgba(246, 107, 14, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                  '& .MuiChip-icon': {
                    color: isSelected ? '#ffffff' : darkMode ? '#cbd5e1' : '#1A374D',
                  },
                  '&:hover': {
                    borderColor: '#F66B0E',
                    transform: 'translateY(-1px)',
                  },
                }}
              />
            );
          })}
        </Box>

        {/* Navigation Tabs: Sights vs Day Plan vs Map */}
        <Box sx={{ borderBottom: 1, borderColor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(26, 55, 77, 0.1)', mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newVal) => setActiveTab(newVal)}
            variant={isSidebar ? 'fullWidth' : 'standard'}
            sx={{
              minHeight: 38,
              '& .MuiTab-root': {
                minHeight: 38,
                py: 0.5,
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'none',
                color: darkMode ? '#94a3b8' : '#556575',
                borderRadius: '12px 12px 0 0',
                '&.Mui-selected': {
                  color: darkMode ? '#ffffff' : '#1A374D',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#F66B0E',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab icon={<ExploreIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Sights (${places.length})`} />
            <Tab icon={<RouteIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={`Day Plan (${dayPlan.length})`} />
            <Tab icon={<MapIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Interactive Map" />
          </Tabs>
        </Box>

        {/* Content Body */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 1.5 }}>
            <CircularProgress size={32} />
            <Typography variant="caption" sx={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              Discovering top places in {activeLocation.city}...
            </Typography>
          </Box>
        ) : (
          <>
            {/* TAB 0: Explore Sights */}
            {activeTab === 0 && (
              <Box>
                {places.length === 0 ? (
                  <EmptyState
                    category={selectedCategory}
                    cityName={activeLocation.city}
                    query={parsedSearch.query}
                    onSelectCategory={(cat) => setSelectedCategory(cat)}
                    onSelectDestination={(dest) => {
                      setOverrideLocation(dest);
                      setSelectedCategory('all');
                    }}
                    isDark={darkMode}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: isSidebar ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: 1.5,
                    }}
                  >
                    {places.map((place, idx) => (
                      <AttractionCard
                        key={place.placeId || idx}
                        place={place}
                        index={idx}
                        isSelected={selectedMapPlace?.placeId === place.placeId}
                        isInDayPlan={dayPlan.some((p) => (p.placeId || p.name) === (place.placeId || place.name))}
                        onToggleDayPlan={handleToggleDayPlan}
                        onSelectMap={handleSelectMapPlace}
                        onOpenDetails={(p) => {
                          setDetailPlace(p);
                          setIsDetailOpen(true);
                        }}
                        isSidebar={isSidebar}
                        isDark={darkMode}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* TAB 1: Day Plan / Itinerary */}
            {activeTab === 1 && (
              <DayPlanView
                itinerary={itineraryResult.itinerary}
                cityName={activeLocation.city}
                totalDistanceKm={itineraryResult.totalDistanceKm}
                onRemoveStop={handleToggleDayPlan}
                onViewRouteOnMap={() => setActiveTab(2)}
                isSidebar={isSidebar}
                isDark={darkMode}
              />
            )}

            {/* TAB 2: Interactive Map */}
            {activeTab === 2 && (
              <Box>
                <InteractiveMap
                  places={dayPlan.length > 0 ? dayPlan : places}
                  centerLat={activeLocation.lat}
                  centerLon={activeLocation.lon}
                  cityName={activeLocation.city}
                  selectedPlace={selectedMapPlace}
                  onSelectPlace={(p) => setSelectedMapPlace(p)}
                  showRoute={dayPlan.length > 1}
                  isSidebar={isSidebar}
                  isDark={darkMode}
                />

                {/* Selected place mini-preview under the map */}
                {selectedMapPlace && (
                  <Box sx={{ mt: 1.5 }}>
                    <AttractionCard
                      place={selectedMapPlace}
                      index={places.findIndex((p) => p.name === selectedMapPlace.name) >= 0 ? places.findIndex((p) => p.name === selectedMapPlace.name) : 0}
                      isSelected={true}
                      isInDayPlan={dayPlan.some((p) => (p.placeId || p.name) === (selectedMapPlace.placeId || selectedMapPlace.name))}
                      onToggleDayPlan={handleToggleDayPlan}
                      onSelectMap={handleSelectMapPlace}
                      onOpenDetails={(p) => {
                        setDetailPlace(p);
                        setIsDetailOpen(true);
                      }}
                      isSidebar={isSidebar}
                      isDark={darkMode}
                    />
                  </Box>
                )}
              </Box>
            )}
          </>
        )}

        {/* Place Detail Drill-Down Modal */}
        <PlaceDetailModal
          place={detailPlace}
          open={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          isInDayPlan={dayPlan.some((p) => (p.placeId || p.name) === (detailPlace?.placeId || detailPlace?.name))}
          onToggleDayPlan={handleToggleDayPlan}
          onLocateMap={handleSelectMapPlace}
          isDark={darkMode}
        />
      </Box>
    </ThemeProvider>
  );
}