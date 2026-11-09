'use client';

import React, { useEffect, useRef } from 'react';
import type { Property } from '@/data/properties';
import { useCurrency } from '@/context/CurrencyContext';

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId: number | null;
  hoveredPropertyId: number | null;
  onSelectProperty: (property: Property) => void;
  centerLocation?: { lat: number; lng: number } | null;
}

export default function PropertyMap({
  properties,
  selectedPropertyId,
  hoveredPropertyId,
  onSelectProperty,
  centerLocation,
}: PropertyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: number]: any }>({});
  const { formatPrice } = useCurrency();

  // Helper to format short price badge (e.g., $4.5M, $1.9k)
  const formatShortPrice = (price: number) => {
    return formatPrice(price);
  };

  useEffect(() => {
    let isMounted = true;

    // Dynamically load leaflet only on client
    const initMap = async () => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Default center: Dubai (Downtown / Palm corridor)
      const defaultCenter: [number, number] = [25.1350, 55.2200];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      // Add high-resolution crisp modern Voyager tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      updateMarkers(L);
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers whenever properties, selectedPropertyId, or currency changes
  const updateMarkers = async (LeafletModule?: any) => {
    if (!mapInstanceRef.current) return;
    const L = LeafletModule || (await import('leaflet')).default;
    const map = mapInstanceRef.current;

    // Clear previous markers
    Object.values(markersRef.current).forEach((marker: any) => marker.remove());
    markersRef.current = {};

    if (properties.length === 0) return;

    const bounds: [number, number][] = [];

    properties.forEach((prop) => {
      if (!prop.coordinates) return;

      const isSelected = selectedPropertyId === prop.id;
      const isHovered = hoveredPropertyId === prop.id;
      const priceStr = formatShortPrice(prop.price);

      // Create custom HTML DivIcon
      const markerHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${
          isSelected || isHovered ? 'scale-110 z-50' : 'hover:scale-105 z-10'
        }">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs shadow-lg border transition-all ${
            isSelected || isHovered
              ? 'bg-[#111812] text-[#FFDE02] border-[#FFDE02] shadow-xl ring-4 ring-black/20'
              : 'bg-white text-neutral-900 border-neutral-300 hover:border-black hover:bg-neutral-50'
          }">
            <span class="w-2 h-2 rounded-full ${isSelected || isHovered ? 'bg-[#FFDE02] animate-ping' : 'bg-[#FFDE02]'}"></span>
            <span class="whitespace-nowrap font-black tracking-tight">${priceStr}</span>
          </div>
          <div class="w-2 h-2 bg-black mx-auto rotate-45 -mt-1 ${isSelected || isHovered ? 'bg-[#111812]' : 'bg-white'} border-r border-b ${
            isSelected || isHovered ? 'border-[#FFDE02]' : 'border-neutral-300'
          }"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-property-pin',
        html: markerHtml,
        iconSize: [80, 36],
        iconAnchor: [40, 36],
        popupAnchor: [0, -40],
      });

      const marker = L.marker([prop.coordinates.lat, prop.coordinates.lng], {
        icon: customIcon,
        zIndexOffset: isSelected || isHovered ? 1000 : 0,
      }).addTo(map);

      // Popup content with rich property preview
      const popupHtml = `
        <div class="w-64 bg-white rounded-2xl overflow-hidden font-sans">
          <div class="relative h-32 w-full bg-neutral-100">
            <img src="${prop.image}" alt="${prop.title}" class="w-full h-full object-cover" />
            <div class="absolute top-2 left-2 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              ${prop.status}
            </div>
            <div class="absolute top-2 right-2 bg-[#FFDE02] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
              ${prop.type}
            </div>
          </div>
          <div class="p-3">
            <div class="text-base font-black text-neutral-900 mb-0.5">${priceStr}</div>
            <div class="text-xs font-bold text-neutral-800 line-clamp-1 mb-1">${prop.title}</div>
            <div class="text-[11px] text-neutral-500 line-clamp-1 mb-2">📍 ${prop.location || prop.address}</div>
            <div class="flex items-center justify-between text-[11px] font-medium text-neutral-600 border-t border-neutral-100 pt-2 mb-3">
              <span>🛏️ ${prop.beds} Beds</span>
              <span>🛁 ${prop.baths} Baths</span>
              <span>📐 ${prop.sqft}</span>
            </div>
            <a href="/listings/${prop.id}" class="block text-center w-full bg-[#111812] text-white py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors">
              View Property Details
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        className: 'modern-property-popup',
      });

      marker.on('click', () => {
        onSelectProperty(prop);
      });

      markersRef.current[prop.id] = marker;
      bounds.push([prop.coordinates.lat, prop.coordinates.lng]);
    });

    // Auto fit bounds if properties exist and no custom center
    if (!centerLocation && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  };

  // Re-run marker update when dependencies change
  useEffect(() => {
    updateMarkers();
  }, [properties, selectedPropertyId, hoveredPropertyId, formatPrice]);

  // Center on designated location when changed
  useEffect(() => {
    if (mapInstanceRef.current && centerLocation) {
      mapInstanceRef.current.flyTo([centerLocation.lat, centerLocation.lng], 13.5, {
        duration: 1.2,
      });
    }
  }, [centerLocation]);

  // Open popup when selectedPropertyId changes
  useEffect(() => {
    if (selectedPropertyId && markersRef.current[selectedPropertyId] && mapInstanceRef.current) {
      const marker = markersRef.current[selectedPropertyId];
      marker.openPopup();
      const pos = marker.getLatLng();
      mapInstanceRef.current.flyTo(pos, 14, { duration: 1 });
    }
  }, [selectedPropertyId]);

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-3xl overflow-hidden shadow-inner border border-neutral-200/80">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Map Floating Badge */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-neutral-200/60 flex items-center gap-2 pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs font-bold text-neutral-800">
          Interactive UAE Real Estate Map
        </span>
      </div>

      {/* Recenter Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current && properties.length > 0) {
            const validCoords = properties
              .filter((p) => p.coordinates)
              .map((p) => [p.coordinates.lat, p.coordinates.lng] as [number, number]);
            if (validCoords.length > 0) {
              mapInstanceRef.current.fitBounds(validCoords, { padding: [50, 50], maxZoom: 13 });
            }
          }
        }}
        className="absolute bottom-4 left-4 z-10 bg-[#111812] text-white hover:bg-neutral-800 px-4 py-2 rounded-2xl text-xs font-bold shadow-lg border border-white/10 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
      >
        <span>🎯 Reset View</span>
      </button>
    </div>
  );
}

