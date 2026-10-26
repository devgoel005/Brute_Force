import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MapIcon from '@mui/icons-material/Map';
import PlaceIcon from '@mui/icons-material/Place';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import RouteIcon from '@mui/icons-material/Route';

export default function DayPlanView({
  itinerary = [],
  cityName = 'City',
  totalDistanceKm = 0,
  onRemoveStop = () => {},
  onViewRouteOnMap = () => {},
  isSidebar = false,
  isDark = false
}) {
  if (!itinerary || itinerary.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          textAlign: 'center',
          borderRadius: 2,
          border: '1px dashed',
          borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.4)' : '#fafafa',
        }}
      >
        <RouteIcon sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Your Day Plan is Empty
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem' }}>
          Click "Add to Day Plan" on any attraction cards to craft your personalized sightseeing itinerary.
        </Typography>
      </Paper>
    );
  }

  const slotColors = {
    Morning: { bg: '#fef3c7', text: '#92400e', darkBg: 'rgba(245, 158, 11, 0.15)', darkText: '#fcd34d' },
    Midday: { bg: '#e0f2fe', text: '#0369a1', darkBg: 'rgba(56, 189, 248, 0.15)', darkText: '#7dd3fc' },
    Afternoon: { bg: '#ffedd5', text: '#9a3412', darkBg: 'rgba(249, 115, 22, 0.15)', darkText: '#fdba74' },
    Evening: { bg: '#f3e8ff', text: '#6b21a8', darkBg: 'rgba(168, 85, 247, 0.15)', darkText: '#d8b4fe' },
  };

  return (
    <Box>
      {/* Summary Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.2,
          mb: 2,
          p: 1.8,
          borderRadius: '20px',
          backgroundColor: isDark ? 'rgba(17, 43, 60, 0.7)' : '#ffffff',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26, 55, 77, 0.1)',
          boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(26, 55, 77, 0.04)',
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: '"Source Serif Pro", Georgia, serif',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: isDark ? '#ffffff' : '#1A374D',
            }}
          >
            Day Itinerary • {cityName}
          </Typography>
          <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#556575', fontWeight: 500 }}>
            {itinerary.length} curated stops • ~{totalDistanceKm} km total sequence
          </Typography>
        </Box>

        <Button
          size="small"
          variant="contained"
          startIcon={<MapIcon sx={{ fontSize: 15 }} />}
          onClick={onViewRouteOnMap}
          sx={{
            fontSize: '0.76rem',
            textTransform: 'none',
            borderRadius: '30px',
            fontWeight: 700,
            py: 0.6,
            px: 2,
            backgroundColor: '#1A374D',
            color: '#ffffff',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#244e6d' },
          }}
        >
          View Route on Map
        </Button>
      </Box>

      {/* Itinerary Timeline */}
      <Box sx={{ position: 'relative', pl: 1 }}>
        {itinerary.map((stop, idx) => {
          const isLast = idx === itinerary.length - 1;
          const slotMeta = slotColors[stop.slotName] || slotColors.Morning;

          return (
            <Box key={stop.placeId || idx} sx={{ position: 'relative', mb: 2 }}>
              {/* Vertical connector line */}
              {!isLast && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 28,
                    left: 12,
                    bottom: -20,
                    width: 2,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                    zIndex: 0,
                  }}
                />
              )}

              {/* Stop Card */}
              <Box sx={{ display: 'flex', gap: 1.5, zIndex: 1, position: 'relative' }}>
                {/* Number Badge */}
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: '#1A374D',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(26, 55, 77, 0.35)',
                  }}
                >
                  {idx + 1}
                </Box>

                {/* Stop Content */}
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 1.6,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26, 55, 77, 0.08)',
                    backgroundColor: isDark ? '#112B3C' : '#ffffff',
                    boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 8px rgba(26, 55, 77, 0.04)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Chip
                      label={stop.slotName || 'Stop'}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        borderRadius: '30px',
                        backgroundColor: isDark ? slotMeta.darkBg : slotMeta.bg,
                        color: isDark ? slotMeta.darkText : slotMeta.text,
                      }}
                    />
                    <Tooltip title="Remove stop">
                      <IconButton size="small" onClick={() => onRemoveStop(stop)} sx={{ p: 0.3, color: '#94a3b8' }}>
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontFamily: '"Source Serif Pro", Georgia, serif',
                      fontWeight: 700,
                      fontSize: '0.98rem',
                      mb: 0.2,
                      color: isDark ? '#ffffff' : '#1A374D',
                    }}
                  >
                    {stop.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: isDark ? '#94a3b8' : '#64748b', mb: 0.8 }}>
                    <AccessTimeIcon sx={{ fontSize: 13 }} />
                    <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
                      {stop.suggestedTime}
                    </Typography>
                  </Box>

                  {stop.tip && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 0.5,
                        backgroundColor: isDark ? 'rgba(51, 65, 85, 0.4)' : '#f8fafc',
                        p: 0.8,
                        borderRadius: 1,
                      }}
                    >
                      <LightbulbOutlinedIcon sx={{ fontSize: 14, color: '#f59e0b', mt: 0.2, flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ fontSize: '0.72rem', color: isDark ? '#cbd5e1' : '#475569' }}>
                        {stop.tip}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>

              {/* Transit indicator between stops */}
              {!isLast && stop.legDistanceKm !== undefined && (
                <Box
                  sx={{
                    ml: 4.5,
                    my: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: '0.7rem',
                    color: isDark ? '#94a3b8' : '#64748b',
                  }}
                >
                  <DirectionsWalkIcon sx={{ fontSize: 13, color: '#8b5cf6' }} />
                  <span>~{stop.estTransitMinutes || 12} min transit ({stop.legDistanceKm} km) to next sight</span>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
