import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function InteractiveMap({
  places = [],
  centerLat = 28.6139,
  centerLon = 77.2090,
  cityName = 'Destination',
  selectedPlace = null,
  onSelectPlace = () => {},
  showRoute = false,
  isSidebar = false,
  isDark = false
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Safely cleanup previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialCenter = [
      !isNaN(centerLat) && centerLat !== 0 ? centerLat : 28.6139,
      !isNaN(centerLon) && centerLon !== 0 ? centerLon : 77.2090,
    ];

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    // Real Geographic Map Tiles: CartoDB Voyager (Light) or Dark Matter (Dark)
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Add Zoom Control on Top-Right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersList = [];

    // 1. City / Search Location Center Pulsing Marker
    const centerDivIcon = L.divIcon({
      className: 'untree-center-pin',
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 26px; height: 26px; border-radius: 50%; background: #0284c7; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 11px; height: 11px; border-radius: 50%; background: #0284c7; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker(initialCenter, { icon: centerDivIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; color: #1A374D;">📍 ${cityName} Search Center</div>`
      );

    // 2. Add Attraction Markers
    places.forEach((place, idx) => {
      const pLat = parseFloat(place.lat);
      const pLon = parseFloat(place.lon);
      if (isNaN(pLat) || isNaN(pLon)) return;

      const isSelected = selectedPlace && (selectedPlace.placeId === place.placeId || selectedPlace.name === place.name);

      const markerHtml = `
        <div style="
          background: ${isSelected ? '#F66B0E' : '#1A374D'};
          color: #ffffff;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          border: 2.5px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          cursor: pointer;
          transition: transform 0.2s ease;
          ${isSelected ? 'transform: scale(1.22); box-shadow: 0 6px 14px rgba(246, 107, 14, 0.5);' : ''}
        ">
          ${idx + 1}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'untree-place-marker',
        html: markerHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([pLat, pLon], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectPlace(place);
      });

      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; min-width: 150px; max-width: 220px; padding: 2px;">
          <div style="font-weight: 800; font-family: 'Source Serif Pro', Georgia, serif; font-size: 13.5px; color: #1A374D; line-height: 1.25;">
            ${place.name}
          </div>
          <div style="font-size: 10.5px; color: #F66B0E; font-weight: 700; margin-top: 3px; text-transform: uppercase;">
            ${place.category || 'Sight'} ${place.distanceKm !== undefined ? '• ' + place.distanceKm + ' km' : ''}
          </div>
          ${
            place.address
              ? `<div style="font-size: 10.5px; color: #556575; margin-top: 3px; line-height: 1.3;">${place.address}</div>`
              : ''
          }
        </div>
      `);

      markersList.push(marker);

      if (isSelected) {
        marker.openPopup();
      }
    });

    // 3. Connect Optimized Day Route with polyline if enabled
    if (showRoute && places.length > 1) {
      const validPoints = places
        .filter((p) => !isNaN(parseFloat(p.lat)) && !isNaN(parseFloat(p.lon)))
        .map((p) => [parseFloat(p.lat), parseFloat(p.lon)]);

      if (validPoints.length > 1) {
        L.polyline(validPoints, {
          color: '#F66B0E',
          weight: 4,
          opacity: 0.88,
          dashArray: '8, 8',
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
      }
    }

    // 4. Fit map bounds to view all attraction pins comfortably
    if (markersList.length > 0) {
      const group = L.featureGroup(markersList);
      map.fitBounds(group.getBounds().pad(0.18));
    }

    mapInstanceRef.current = map;

    // Trigger Leaflet resize calculation after DOM paint
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(resizeTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [places, centerLat, centerLon, showRoute, selectedPlace?.placeId, selectedPlace?.name, isDark, cityName]);

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26, 55, 77, 0.1)',
        backgroundColor: isDark ? '#0D1B2A' : '#ffffff',
        boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.3)' : '0 6px 20px rgba(26, 55, 77, 0.06)',
      }}
    >
      {/* Map Legend / Route Badge */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 1000,
          backgroundColor: isDark ? 'rgba(17, 43, 60, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '30px',
          px: 1.5,
          py: 0.6,
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          border: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(26, 55, 77, 0.12)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <DirectionsWalkIcon sx={{ fontSize: 16, color: '#F66B0E' }} />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: '0.74rem',
            color: isDark ? '#ffffff' : '#1A374D',
          }}
        >
          {showRoute ? 'Optimized Day Tour Route' : `${places.length} Sights Mapped in ${cityName}`}
        </Typography>
      </Box>

      {/* Leaflet Real Geographic Map Viewport */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: isSidebar ? '260px' : '380px',
          zIndex: 1,
        }}
      />
    </Box>
  );
}
