import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Divider,
  Rating
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsIcon from '@mui/icons-material/Directions';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MapIcon from '@mui/icons-material/Map';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

import { getPlacePhotos } from '../utils/placeImages';

export default function PlaceDetailModal({
  place,
  open,
  onClose,
  isInDayPlan,
  onToggleDayPlan,
  onLocateMap,
  isDark = false
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [modalCenterY, setModalCenterY] = useState(null);
  const modalCardRef = useRef(null);

  // Fetch or resolve images for this place
  const photos = getPlacePhotos(place);

  // Reset image index when place changes
  useEffect(() => {
    setActiveImgIndex(0);
  }, [place?.name]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Dynamically calculate the center of the user's visible viewport
  // Works inside iframes by tracking the parent window's scroll and viewport offset
  const calculateCenter = useCallback(() => {
    let parentHeight = window.innerHeight;

    try {
      if (window.parent && window.parent !== window) {
        parentHeight = window.parent.innerHeight || 800;
        if (window.frameElement) {
          const rect = window.frameElement.getBoundingClientRect();
          // rect.top is the top of the iframe relative to the parent viewport.
          // (parentHeight / 2) - rect.top is the exact middle of the user's screen in iframe coordinates!
          const targetY = (parentHeight / 2) - rect.top;
          setModalCenterY(Math.max(260, targetY));
          return;
        }
      }
    } catch (err) {
      // Cross-origin fallback
    }

    const fallbackY = (window.scrollY || window.pageYOffset || 0) + (window.innerHeight / 2);
    setModalCenterY(Math.max(260, fallbackY));
  }, []);

  // Listen to scroll & resize events on both window and parent window
  useEffect(() => {
    if (!open) return;

    calculateCenter();

    const handleScrollOrResize = () => {
      requestAnimationFrame(calculateCenter);
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    let parentRef = null;
    try {
      if (window.parent && window.parent !== window) {
        parentRef = window.parent;
        parentRef.addEventListener('scroll', handleScrollOrResize, { passive: true });
        parentRef.addEventListener('resize', handleScrollOrResize, { passive: true });
      }
    } catch (e) {}

    const timer = setTimeout(() => {
      calculateCenter();
    }, 60);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (parentRef) {
        try {
          parentRef.removeEventListener('scroll', handleScrollOrResize);
          parentRef.removeEventListener('resize', handleScrollOrResize);
        } catch (e) {}
      }
    };
  }, [open, calculateCenter]);

  if (!open || !place) return null;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    place.lat + ',' + place.lon
  )}&destination_place_id=${encodeURIComponent(place.name)}`;

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        minHeight: '100%',
        width: '100%',
        zIndex: 9999999,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(6px)',
        animation: 'untreeFadeIn 0.22s ease-out',
        '@keyframes untreeFadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
      onClick={onClose}
    >
      {/* Scroll-Synced Viewport-Centered Modal Card */}
      <Box
        ref={modalCardRef}
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: 'absolute',
          left: '50%',
          top: modalCenterY !== null ? `${modalCenterY}px` : '360px',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '520px',
          maxHeight: 'min(82vh, 600px)',
          backgroundColor: isDark ? '#112B3C' : '#ffffff',
          color: isDark ? '#f8fafc' : '#1A374D',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(26, 55, 77, 0.12)',
          transition: 'top 0.12s ease-out',
          animation: 'untreePop 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          '@keyframes untreePop': {
            from: { opacity: 0, transform: 'translate(-50%, -46%) scale(0.95)' },
            to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
          },
        }}
      >
        {/* Slidable Photo Carousel Header Banner */}
        <Box
          sx={{
            height: { xs: 160, sm: 190 },
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#0f172a',
          }}
        >
          {/* Carousel Image */}
          <Box
            component="img"
            src={photos[activeImgIndex]}
            alt={`${place.name} - Photo ${activeImgIndex + 1}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'all 0.4s ease-in-out',
              filter: 'brightness(0.92)',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Gradient Scrim */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(26, 55, 77, 0.6) 0%, rgba(0,0,0,0) 40%, rgba(26, 55, 77, 0.8) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Top Floating Bar: Category Pill & Close Button */}
          <Box
            sx={{
              position: 'absolute',
              top: 14,
              left: 14,
              right: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
            }}
          >
            <Chip
              label={place.category || 'Attraction'}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#1A374D',
                fontWeight: 800,
                fontSize: '0.72rem',
                borderRadius: '30px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            />

            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                backgroundColor: 'rgba(26, 55, 77, 0.75)',
                color: '#ffffff',
                backdropFilter: 'blur(8px)',
                width: 32,
                height: 32,
                '&:hover': { backgroundColor: '#F66B0E', transform: 'rotate(90deg)' },
                transition: 'all 0.25s ease',
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Slider Navigation Arrows (only if multiple photos) */}
          {photos.length > 1 && (
            <>
              <IconButton
                onClick={handlePrev}
                size="small"
                sx={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(26, 55, 77, 0.65)',
                  color: '#ffffff',
                  backdropFilter: 'blur(6px)',
                  p: 0.8,
                  '&:hover': { backgroundColor: '#F66B0E' },
                  zIndex: 10,
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
              </IconButton>

              <IconButton
                onClick={handleNext}
                size="small"
                sx={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(26, 55, 77, 0.65)',
                  color: '#ffffff',
                  backdropFilter: 'blur(6px)',
                  p: 0.8,
                  '&:hover': { backgroundColor: '#F66B0E' },
                  zIndex: 10,
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </>
          )}

          {/* Bottom Banner Row: Counter & Navigation Dots */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 14,
              right: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
            }}
          >
            <Chip
              icon={<PhotoCameraIcon sx={{ fontSize: 13, color: '#fff !important' }} />}
              label={`${activeImgIndex + 1} / ${photos.length}`}
              size="small"
              sx={{
                height: 22,
                backgroundColor: 'rgba(26, 55, 77, 0.75)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.68rem',
                borderRadius: '30px',
                backdropFilter: 'blur(6px)',
              }}
            />

            {photos.length > 1 && (
              <Box sx={{ display: 'flex', gap: 0.6 }}>
                {photos.map((_, idx) => (
                  <Box
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIndex(idx);
                    }}
                    sx={{
                      width: idx === activeImgIndex ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: idx === activeImgIndex ? '#F66B0E' : 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Modal Scrollable Body Content */}
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            overflowY: 'auto',
            flex: '1 1 auto',
            '&::-webkit-scrollbar': { width: 5 },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(26, 55, 77, 0.2)',
              borderRadius: 3,
            },
          }}
        >
          {/* Title in Untree Serif typography */}
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Source Serif Pro", Georgia, serif',
              fontWeight: 700,
              lineHeight: 1.25,
              mb: 1,
              fontSize: { xs: '1.2rem', sm: '1.4rem' },
              color: isDark ? '#ffffff' : '#1A374D',
            }}
          >
            {place.name}
          </Typography>

          {/* Proximity & Rating Row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.8, flexWrap: 'wrap' }}>
            {place.distanceKm !== undefined && (
              <Chip
                icon={<PlaceIcon sx={{ fontSize: 14, color: '#F66B0E !important' }} />}
                label={`${place.distanceKm} km from query center`}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  borderRadius: '30px',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(26, 55, 77, 0.06)',
                  color: isDark ? '#cbd5e1' : '#1A374D',
                }}
              />
            )}

            {place.rating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Rating value={place.rating} precision={0.1} size="small" readOnly sx={{ color: '#F66B0E' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#F66B0E' }}>
                  {place.rating}
                </Typography>
              </Box>
            )}

            {place.recommendedDuration && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.4,
                  color: isDark ? '#94a3b8' : '#64748b',
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Suggested: {place.recommendedDuration}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26, 55, 77, 0.08)' }} />

          {/* Address with Google Maps Link */}
          {place.address && (
            <Box sx={{ mb: 1.8 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: isDark ? '#94a3b8' : '#64748b',
                  letterSpacing: 0.6,
                  fontSize: '0.7rem',
                }}
              >
                Location & Coordinates
              </Typography>
              <Box
                component="a"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mt: 0.6,
                  p: 1.2,
                  borderRadius: '16px',
                  backgroundColor: isDark ? 'rgba(17, 43, 60, 0.8)' : '#f8fafc',
                  textDecoration: 'none',
                  color: isDark ? '#e2e8f0' : '#1A374D',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26, 55, 77, 0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#F66B0E',
                    color: '#F66B0E',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <PlaceIcon sx={{ fontSize: 18, color: '#F66B0E', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 500, flex: 1, fontSize: '0.82rem' }}>
                  {place.address}
                </Typography>
                <OpenInNewIcon sx={{ fontSize: 14, opacity: 0.7, flexShrink: 0 }} />
              </Box>
            </Box>
          )}

          {/* Detailed Description */}
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                textTransform: 'uppercase',
                color: isDark ? '#94a3b8' : '#64748b',
                letterSpacing: 0.6,
                fontSize: '0.7rem',
              }}
            >
              About This Destination
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 0.6,
                lineHeight: 1.6,
                color: isDark ? '#cbd5e1' : '#475569',
                fontSize: '0.86rem',
              }}
            >
              {place.description ||
                'A signature cultural landmark and attraction discovered in this region, recommended for tourists and exploratory travelers.'}
            </Typography>
          </Box>

          {/* Coordinates Details */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 0.9,
              borderRadius: '12px',
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f1f5f9',
            }}
          >
            <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.7rem' }}>
              GPS: {place.lat?.toFixed(5)}, {place.lon?.toFixed(5)}
            </Typography>
          </Box>
        </Box>

        {/* Sticky Action Footer with Untree Pill Buttons */}
        <Box
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderTop: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26, 55, 77, 0.08)',
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : '#fafafa',
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<MapIcon />}
            onClick={() => {
              onLocateMap(place);
              onClose();
            }}
            sx={{
              textTransform: 'none',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.78rem',
              py: 0.7,
              px: 2,
              borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#1A374D',
              color: isDark ? '#ffffff' : '#1A374D',
              '&:hover': {
                borderColor: '#1A374D',
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(26, 55, 77, 0.06)',
              },
            }}
          >
            Locate Map
          </Button>

          <Button
            variant="contained"
            component="a"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<DirectionsIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.78rem',
              py: 0.7,
              px: 2,
              backgroundColor: '#1A374D',
              color: '#ffffff',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#244e6d',
              },
            }}
          >
            Directions
          </Button>

          <Button
            variant={isInDayPlan ? 'contained' : 'outlined'}
            startIcon={isInDayPlan ? <CheckCircleIcon /> : <AddCircleOutlineIcon />}
            onClick={() => onToggleDayPlan(place)}
            sx={{
              textTransform: 'none',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '0.78rem',
              ml: 'auto',
              py: 0.7,
              px: 2.2,
              backgroundColor: isInDayPlan ? '#F66B0E' : 'transparent',
              borderColor: isInDayPlan ? '#F66B0E' : '#F66B0E',
              color: isInDayPlan ? '#ffffff' : '#F66B0E',
              boxShadow: isInDayPlan ? '0 4px 12px rgba(246, 107, 14, 0.3)' : 'none',
              '&:hover': {
                backgroundColor: isInDayPlan ? '#de5c07' : 'rgba(246, 107, 14, 0.08)',
                borderColor: '#F66B0E',
              },
            }}
          >
            {isInDayPlan ? 'In Day Plan' : 'Add to Day Plan'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
