import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

export default function WeatherCard({ weather, cityName, isSidebar = false, isDark = false }) {
  if (!weather || !weather.current) return null;

  const { current, forecast = [] } = weather;

  // Generate actionable tourism recommendation based on conditions
  const getTourismAdvice = () => {
    const cond = (current.condition || '').toLowerCase();
    const temp = current.temperature;

    if (cond.includes('rain') || cond.includes('storm')) {
      return '🌧️ Rain expected today: Perfect day to prioritize indoor museums, historic libraries & palaces!';
    }
    if (temp >= 32) {
      return '☀️ Warm day ahead: Best to visit outdoor monuments in early morning and air-conditioned museums during the afternoon.';
    }
    if (temp <= 5) {
      return '❄️ Crisp winter chill: Bundle up warmly for scenic lookouts or enjoy heated heritage sights.';
    }
    return '✨ Prime sightseeing weather: Comfortable conditions for walking tours, parks & outdoor heritage!';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: isSidebar ? 1.5 : 2,
        borderRadius: '20px',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26, 55, 77, 0.1)',
        background: isDark
          ? 'linear-gradient(135deg, rgba(17, 43, 60, 0.9) 0%, rgba(13, 27, 42, 0.95) 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f0f7fb 100%)',
        boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 16px rgba(26, 55, 77, 0.05)',
        mb: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Typography variant="h5" component="span" sx={{ fontSize: isSidebar ? '1.5rem' : '1.8rem' }}>
            {current.icon || '🌤️'}
          </Typography>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Source Serif Pro", Georgia, serif',
                fontWeight: 700,
                lineHeight: 1.1,
                fontSize: isSidebar ? '1.05rem' : '1.25rem',
                color: isDark ? '#ffffff' : '#1A374D',
              }}
            >
              {current.temperature}°C • {current.condition}
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#556575' }}>
              Real-time atmospheric forecast in {cityName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#556575' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <WaterDropIcon sx={{ fontSize: 13, color: '#0284c7' }} />
            <span>{current.humidity}%</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <AirIcon sx={{ fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }} />
            <span>{current.windSpeed} km/h</span>
          </Box>
        </Box>
      </Box>

      {/* Tourism Advice Banner */}
      <Box
        sx={{
          backgroundColor: isDark ? 'rgba(26, 55, 77, 0.5)' : '#ffffff',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(26, 55, 77, 0.08)',
          borderRadius: '14px',
          p: 1.1,
          mb: forecast.length > 0 && !isSidebar ? 1.2 : 0,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.78rem',
            fontWeight: 500,
            color: isDark ? '#e2e8f0' : '#1A374D',
            lineHeight: 1.45,
          }}
        >
          {getTourismAdvice()}
        </Typography>
      </Box>

      {/* Micro 3-day forecast on mainline */}
      {!isSidebar && forecast.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mt: 1,
            pt: 1,
            borderTop: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(26, 55, 77, 0.06)',
          }}
        >
          {forecast.map((f, i) => (
            <Box
              key={f.date || i}
              sx={{
                flex: 1,
                textAlign: 'center',
                py: 0.6,
                px: 0.8,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(26, 55, 77, 0.05)',
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.4)' : '#ffffff',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  color: isDark ? '#cbd5e1' : '#1A374D',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {i === 0 ? 'Today' : new Date(f.date).toLocaleDateString(undefined, { weekday: 'short' })}
              </Typography>
              <Typography variant="body2" component="span" sx={{ fontSize: '0.95rem', my: 0.2, display: 'inline-block' }}>
                {f.icon}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', fontSize: '0.72rem', fontWeight: 600 }}>
                {f.maxTemp}° / {f.minTemp}°
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
