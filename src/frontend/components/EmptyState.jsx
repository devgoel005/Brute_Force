import React from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import ExploreOffIcon from '@mui/icons-material/ExploreOff';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function EmptyState({
  category = 'all',
  cityName = 'this location',
  query = '',
  onSelectCategory = () => {},
  onSelectDestination = () => {},
  isDark = false
}) {
  // Related NLP Category Suggestions
  const relatedCategories = [
    { id: 'all', label: 'All Top Sights' },
    { id: 'monuments', label: 'Historic Monuments' },
    { id: 'museums', label: 'Museums & Art' },
    { id: 'parks', label: 'Scenic Parks' },
    { id: 'viewpoints', label: 'Panoramic Viewpoints' },
  ].filter(c => c.id !== category);

  // Popular Alternate Tourist Hubs
  const trendingDestinations = [
    { city: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
    { city: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
    { city: 'New York City', country: 'United States', lat: 40.7128, lon: -74.0060 },
    { city: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964 },
    { city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        textAlign: 'center',
        borderRadius: 3,
        border: '1px dashed',
        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : '#fafafa',
        my: 2,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 1.5,
        }}
      >
        <ExploreOffIcon sx={{ fontSize: 26, color: '#ef4444' }} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', mb: 0.5 }}>
        No attractions found
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: isDark ? '#94a3b8' : '#64748b',
          fontSize: '0.84rem',
          maxWidth: 380,
          mx: 'auto',
          mb: 2.5,
          lineHeight: 1.45,
        }}
      >
        {category !== 'all'
          ? `We couldn't find any "${category}" within immediate radius in ${cityName}. Try exploring other popular categories below.`
          : `No verified tourist landmarks were found directly around ${cityName}. Explore a nearby destination below.`}
      </Typography>

      {/* NLP Related Category Recommendations */}
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
          <AutoAwesomeIcon sx={{ fontSize: 14, color: '#8b5cf6' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#8b5cf6' }}>
            Recommended Categories
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, justifyContent: 'center' }}>
          {relatedCategories.map(cat => (
            <Chip
              key={cat.id}
              label={cat.label}
              size="small"
              onClick={() => onSelectCategory(cat.id)}
              clickable
              sx={{
                fontWeight: 600,
                fontSize: '0.72rem',
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#ffffff',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                '&:hover': {
                  borderColor: '#8b5cf6',
                  backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : '#f5f3ff',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Trending Alternate Destinations */}
      <Box sx={{ pt: 1.5, borderTop: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
          <TravelExploreIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: isDark ? '#94a3b8' : '#64748b' }}>
            Or Explore Famous Hubs
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, justifyContent: 'center' }}>
          {trendingDestinations.map(dest => (
            <Chip
              key={dest.city}
              label={`${dest.city}, ${dest.country}`}
              size="small"
              onClick={() => onSelectDestination(dest)}
              clickable
              sx={{
                fontWeight: 600,
                fontSize: '0.72rem',
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : '#eff6ff',
                color: isDark ? '#93c5fd' : '#1d4ed8',
                border: '1px solid',
                borderColor: 'rgba(59, 130, 246, 0.3)',
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
