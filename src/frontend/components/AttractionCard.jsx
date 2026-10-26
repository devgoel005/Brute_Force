import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Tooltip,
  Rating
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import MuseumIcon from '@mui/icons-material/Museum';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CastleIcon from '@mui/icons-material/Castle';
import ParkIcon from '@mui/icons-material/Park';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsIcon from '@mui/icons-material/Directions';
import MapIcon from '@mui/icons-material/Map';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { getPlacePhotos } from '../utils/placeImages';

export default function AttractionCard({
  place,
  index,
  isSelected = false,
  isInDayPlan = false,
  onToggleDayPlan = () => {},
  onSelectMap = () => {},
  onOpenDetails = () => {},
  isSidebar = false,
  isDark = false
}) {
  const photos = getPlacePhotos(place);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Untree Tour category color mapping
  const getCategoryMeta = (catStr) => {
    const c = (catStr || '').toLowerCase();
    if (c.includes('museum')) {
      return { label: 'Museum', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.15)' };
    }
    if (c.includes('temple') || c.includes('worship')) {
      return { label: 'Sacred Site', color: '#d97706', bg: 'rgba(217, 119, 6, 0.15)' };
    }
    if (c.includes('fort') || c.includes('castle')) {
      return { label: 'Heritage Fort', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.15)' };
    }
    if (c.includes('park') || c.includes('garden')) {
      return { label: 'Park & Nature', color: '#059669', bg: 'rgba(5, 150, 105, 0.15)' };
    }
    if (c.includes('viewpoint') || c.includes('scenic')) {
      return { label: 'Scenic View', color: '#ea580c', bg: 'rgba(234, 88, 12, 0.15)' };
    }
    if (c.includes('historic')) {
      return { label: 'Historic Site', color: '#b45309', bg: 'rgba(180, 83, 9, 0.15)' };
    }
    return { label: 'Attraction', color: '#1A374D', bg: 'rgba(26, 55, 77, 0.12)' };
  };

  const catMeta = getCategoryMeta(place.category);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    place.lat + ',' + place.lon
  )}&destination_place_id=${encodeURIComponent(place.name)}`;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '20px',
        border: '1px solid',
        borderColor: isSelected
          ? '#F66B0E'
          : isDark
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(26, 55, 77, 0.1)',
        backgroundColor: isDark ? '#112B3C' : '#ffffff',
        boxShadow: isSelected
          ? '0 12px 28px rgba(246, 107, 14, 0.22)'
          : isDark
          ? '0 6px 18px rgba(0,0,0,0.25)'
          : '0 4px 16px rgba(26, 55, 77, 0.06)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: '#1A374D',
          boxShadow: isDark
            ? '0 16px 32px rgba(0,0,0,0.45)'
            : '0 16px 32px rgba(26, 55, 77, 0.14)',
          '& .card-img': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Untree Tour Style Scenic Photo Header */}
      <Box
        sx={{
          height: isSidebar ? 140 : 160,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          cursor: 'pointer',
        }}
        onClick={() => onOpenDetails(place)}
      >
        <Box
          component="img"
          className="card-img"
          src={photos[photoIndex]}
          alt={place.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.45s ease',
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
              'linear-gradient(180deg, rgba(26, 55, 77, 0.5) 0%, rgba(0,0,0,0) 40%, rgba(26, 55, 77, 0.75) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Badges Row */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            right: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 2,
          }}
        >
          {/* Category Chip */}
          <Chip
            label={catMeta.label}
            size="small"
            sx={{
              height: 22,
              fontSize: '0.66rem',
              fontWeight: 800,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#1A374D',
              borderRadius: '30px',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              backdropFilter: 'blur(6px)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          />

          {/* Distance Badge */}
          {place.distanceKm !== undefined && (
            <Chip
              icon={<PlaceIcon sx={{ fontSize: 12, color: '#fff !important' }} />}
              label={`${place.distanceKm} km`}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.66rem',
                fontWeight: 700,
                backgroundColor: 'rgba(26, 55, 77, 0.85)',
                color: '#ffffff',
                borderRadius: '30px',
                backdropFilter: 'blur(6px)',
              }}
            />
          )}
        </Box>

        {/* Slidable Carousel Navigation on Card (when photos > 1) */}
        {photos.length > 1 && (
          <>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
              }}
              sx={{
                position: 'absolute',
                left: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(26, 55, 77, 0.65)',
                color: '#ffffff',
                backdropFilter: 'blur(4px)',
                p: 0.4,
                zIndex: 3,
                opacity: 0.85,
                '&:hover': { backgroundColor: '#F66B0E', opacity: 1 },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
              }}
              sx={{
                position: 'absolute',
                right: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(26, 55, 77, 0.65)',
                color: '#ffffff',
                backdropFilter: 'blur(4px)',
                p: 0.4,
                zIndex: 3,
                opacity: 0.85,
                '&:hover': { backgroundColor: '#F66B0E', opacity: 1 },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </>
        )}

        {/* Bottom Photo Dots & Counter */}
        {photos.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 10,
              right: 10,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Dots */}
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              {photos.slice(0, 5).map((_, idx) => (
                <Box
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex(idx);
                  }}
                  sx={{
                    width: idx === photoIndex ? 14 : 5,
                    height: 5,
                    borderRadius: '4px',
                    backgroundColor: idx === photoIndex ? '#F66B0E' : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </Box>

            {/* Photo Counter Pill */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.4,
                backgroundColor: 'rgba(26, 55, 77, 0.75)',
                px: 0.8,
                py: 0.2,
                borderRadius: '30px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 11, color: '#ffffff' }} />
              <Typography variant="caption" sx={{ color: '#ffffff', fontSize: '0.65rem', fontWeight: 700 }}>
                {photoIndex + 1}/{photos.length}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Untree Card Content */}
      <CardContent
        sx={{
          p: isSidebar ? 1.5 : 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: isSidebar ? 1.5 : 2 },
        }}
      >
        {/* Title in Untree Serif typography */}
        <Typography
          variant="subtitle1"
          onClick={() => onOpenDetails(place)}
          sx={{
            fontFamily: '"Source Serif Pro", Georgia, serif',
            fontWeight: 700,
            fontSize: isSidebar ? '1.02rem' : '1.14rem',
            lineHeight: 1.3,
            mb: 0.6,
            color: isDark ? '#ffffff' : '#1A374D',
            cursor: 'pointer',
            transition: 'color 0.2s ease',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            '&:hover': {
              color: '#F66B0E',
            },
          }}
        >
          {place.name}
        </Typography>

        {/* Address Link */}
        {place.address && (
          <Box
            component="a"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.4,
              mb: 1,
              textDecoration: 'none',
              color: isDark ? '#94a3b8' : '#64748b',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: '#F66B0E',
              },
            }}
          >
            <PlaceIcon sx={{ fontSize: 13, color: '#F66B0E', flexShrink: 0 }} />
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.74rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 500,
              }}
            >
              {place.address}
            </Typography>
            <OpenInNewIcon sx={{ fontSize: 10, opacity: 0.6, flexShrink: 0 }} />
          </Box>
        )}

        {/* Rating and Suggested Time */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.2 }}>
          {place.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <Rating value={place.rating} precision={0.1} size="small" readOnly sx={{ fontSize: 14, color: '#F66B0E' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.72rem', color: '#F66B0E' }}>
                {place.rating}
              </Typography>
            </Box>
          )}

          {place.recommendedDuration && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: isDark ? '#94a3b8' : '#64748b' }}>
              <AccessTimeIcon sx={{ fontSize: 12 }} />
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                {place.recommendedDuration}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Description Snippet */}
        {place.description && (
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.8rem',
              color: isDark ? '#cbd5e1' : '#556575',
              lineHeight: 1.45,
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: isSidebar ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {place.description}
          </Typography>
        )}

        {/* Untree Pill Buttons Action Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 1.2,
            borderTop: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(26, 55, 77, 0.08)',
            mt: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            {/* Details Button */}
            <Button
              size="small"
              onClick={() => onOpenDetails(place)}
              startIcon={<InfoOutlinedIcon sx={{ fontSize: 13 }} />}
              sx={{
                textTransform: 'none',
                fontSize: '0.74rem',
                fontWeight: 700,
                borderRadius: '30px',
                px: 1.2,
                py: 0.3,
                color: isDark ? '#ffffff' : '#1A374D',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(26, 55, 77, 0.18)',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26, 55, 77, 0.05)',
                  borderColor: '#1A374D',
                },
              }}
            >
              Details
            </Button>

            {/* Directions Link */}
            <Tooltip title="Google Maps Directions">
              <IconButton
                size="small"
                component="a"
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#10b981',
                  p: 0.5,
                  borderRadius: '50%',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' },
                }}
              >
                <DirectionsIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>

            {/* Locate on Map */}
            <Tooltip title="View on Interactive Map">
              <IconButton
                size="small"
                onClick={() => onSelectMap(place)}
                sx={{
                  color: '#1A374D',
                  p: 0.5,
                  borderRadius: '50%',
                  border: '1px solid rgba(26, 55, 77, 0.2)',
                  '&:hover': { backgroundColor: 'rgba(26, 55, 77, 0.08)' },
                }}
              >
                <MapIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Add to Day Plan (Untree Pill) */}
          <Button
            size="small"
            variant={isInDayPlan ? 'contained' : 'outlined'}
            onClick={() => onToggleDayPlan(place)}
            startIcon={
              isInDayPlan ? (
                <CheckCircleIcon sx={{ fontSize: 13 }} />
              ) : (
                <AddCircleOutlineIcon sx={{ fontSize: 13 }} />
              )
            }
            sx={{
              fontSize: '0.72rem',
              textTransform: 'none',
              py: 0.4,
              px: 1.4,
              borderRadius: '30px',
              fontWeight: 700,
              backgroundColor: isInDayPlan ? '#F66B0E' : 'transparent',
              borderColor: isInDayPlan ? '#F66B0E' : isDark ? '#406882' : '#1A374D',
              color: isInDayPlan ? '#ffffff' : isDark ? '#ffffff' : '#1A374D',
              boxShadow: isInDayPlan ? '0 2px 8px rgba(246, 107, 14, 0.3)' : 'none',
              '&:hover': {
                backgroundColor: isInDayPlan ? '#de5c07' : 'rgba(26, 55, 77, 0.06)',
                borderColor: isInDayPlan ? '#de5c07' : '#1A374D',
              },
            }}
          >
            {isInDayPlan ? 'In Plan' : 'Add'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
