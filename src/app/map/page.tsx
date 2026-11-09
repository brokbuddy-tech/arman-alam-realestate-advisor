'use client';

import React, { useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Layers,
  Map as MapIcon,
  List as ListIcon,
  Columns
} from 'lucide-react';
import BlurReveal from '@/components/ui/blur-reveal';
import { useCurrency } from '@/context/CurrencyContext';
import { properties as allProperties, type Property } from '@/data/properties';

// Dynamically import PropertyMap with SSR disabled to avoid leaflet window errors
const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] bg-neutral-100 rounded-3xl flex items-center justify-center animate-pulse border border-neutral-200">
      <div className="flex flex-col items-center gap-3 text-neutral-400">
        <MapPin className="w-8 h-8 animate-bounce text-[#FFDE02]" />
        <span className="text-sm font-semibold text-neutral-600">Loading Dubai Property Map...</span>
      </div>
    </div>
  ),
});

const neighborhoods = [
  { name: 'All UAE', center: null },
  { name: 'Downtown Dubai', center: { lat: 25.1972, lng: 55.2744 } },
  { name: 'Palm Jumeirah', center: { lat: 25.1124, lng: 55.1390 } },
  { name: 'Dubai Marina', center: { lat: 25.0805, lng: 55.1403 } },
  { name: 'Business Bay', center: { lat: 25.1837, lng: 55.2666 } },
  { name: 'Dubai Hills Estate', center: { lat: 25.1112, lng: 55.2471 } },
  { name: 'Dubai Creek Harbour', center: { lat: 25.2014, lng: 55.3512 } },
  { name: 'DIFC', center: { lat: 25.2104, lng: 55.2818 } },
];

const categories = ['All', 'For Buy', 'For Rent', 'Off-Plan', 'Commercial'];
const propertyTypes = ['All', 'Villa', 'Apartment', 'Cottage', 'Office'];

export default function MapPage() {
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All UAE');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);
  const [centerLocation, setCenterLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [listColumns, setListColumns] = useState<1 | 2>(2);

  const cardListRef = useRef<HTMLDivElement>(null);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      // Neighborhood filter
      if (selectedNeighborhood !== 'All UAE' && property.location !== selectedNeighborhood) {
        return false;
      }
      // Category filter
      if (activeCategory !== 'All' && property.category !== activeCategory) {
        return false;
      }
      // Type filter
      if (activeType !== 'All' && property.type.toLowerCase() !== activeType.toLowerCase()) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesAddress = property.address.toLowerCase().includes(query);
        const matchesLocation = property.location?.toLowerCase().includes(query);
        const matchesType = property.type.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAddress && !matchesLocation && !matchesType) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedNeighborhood, activeCategory, activeType]);

  const handleSelectPropertyFromMap = (property: Property) => {
    setSelectedPropertyId(property.id);
    // Auto scroll left card list into view
    const cardEl = document.getElementById(`property-card-${property.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleLocateProperty = (property: Property) => {
    setSelectedPropertyId(property.id);
    if (property.coordinates) {
      setCenterLocation(property.coordinates);
    }
  };

  const handleNeighborhoodClick = (item: (typeof neighborhoods)[0]) => {
    setSelectedNeighborhood(item.name);
    setCenterLocation(item.center);
    setSelectedPropertyId(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedNeighborhood('All UAE');
    setActiveCategory('All');
    setActiveType('All');
    setSelectedPropertyId(null);
    setCenterLocation(null);
  };

  return (
    <div className="w-full bg-[#F6F6F4] min-h-screen font-sans text-neutral-900 pt-24 pb-12 flex flex-col">
      {/* 1. TOP HEADER & SEARCH BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full mb-6">
        {/* Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FFDE02]"></span>
              Interactive Property Finder
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111812] tracking-tight">
              Explore UAE on Map
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Find villas, penthouses, and luxury apartments located across Dubai’s most prestigious communities.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-sm border border-neutral-200/80 self-start md:self-auto">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'split' ? 'bg-[#111812] text-white shadow' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'map' ? 'bg-[#111812] text-white shadow' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map Only</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-[#111812] text-white shadow' : 'text-neutral-600 hover:text-black'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>List Only</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-200/80 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by community, tower, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-100 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 border border-neutral-200/60 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-black"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Selector */}
            <div className="md:col-span-4 flex items-center bg-neutral-100 p-1 rounded-2xl border border-neutral-200/60 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                    activeCategory === cat ? 'bg-[#111812] text-white shadow-sm' : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Type Selector Dropdown */}
            <div className="md:col-span-2">
              <select
                value={activeType}
                onChange={(e) => setActiveType(e.target.value)}
                className="w-full bg-neutral-100 border border-neutral-200/60 rounded-2xl px-3.5 py-3 text-xs sm:text-sm font-semibold text-neutral-800 focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Cottage">Cottage</option>
                <option value="Office">Commercial Office</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="md:col-span-1 flex justify-end">
              <button
                onClick={handleResetFilters}
                title="Reset all filters"
                className="w-full md:w-auto p-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors flex items-center justify-center border border-neutral-200/60"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Neighborhood Quick Filter Chips */}
          <div className="pt-2 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-neutral-500 whitespace-nowrap flex items-center gap-1 shrink-0 mr-1">
              <MapPin className="w-3.5 h-3.5 text-[#111812]" /> Communities:
            </span>
            {neighborhoods.map((n) => (
              <button
                key={n.name}
                onClick={() => handleNeighborhoodClick(n)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedNeighborhood === n.name
                    ? 'bg-[#FFDE02] text-black border-yellow-400 shadow-sm scale-105'
                    : 'bg-white text-neutral-600 border-neutral-200/80 hover:border-black hover:text-black'
                }`}
              >
                {n.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN MAP & LIST DISPLAY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-280px)] min-h-[600px]">
          {/* LEFT LIST PANEL */}
          {(viewMode === 'split' || viewMode === 'list') && (
            <div
              ref={cardListRef}
              className={`h-full overflow-y-auto pr-1 space-y-4 ${
                viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'
              }`}
            >
              {/* Results status header */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-neutral-500">
                  Showing <strong className="text-neutral-900">{filteredProperties.length}</strong> {filteredProperties.length === 1 ? 'property' : 'properties'}
                  {selectedNeighborhood !== 'All UAE' && ` in ${selectedNeighborhood}`}
                </span>
                
                <div className="flex items-center gap-2">
                  {viewMode === 'split' && (
                    <div className="flex items-center bg-white rounded-xl p-0.5 border border-neutral-200/80 shadow-xs text-xs font-bold">
                      <button
                        onClick={() => setListColumns(1)}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          listColumns === 1
                            ? 'bg-[#111812] text-white shadow-xs'
                            : 'text-neutral-500 hover:text-black'
                        }`}
                        title="Show 1 property per row"
                      >
                        1 Col
                      </button>
                      <button
                        onClick={() => setListColumns(2)}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          listColumns === 2
                            ? 'bg-[#111812] text-white shadow-xs'
                            : 'text-neutral-500 hover:text-black'
                        }`}
                        title="Show 2 properties per row"
                      >
                        2 Col
                      </button>
                    </div>
                  )}
                  {filteredProperties.length > 0 && (
                    <span className="text-[11px] font-medium text-neutral-400 hidden xl:inline">
                      Click pin or card to locate
                    </span>
                  )}
                </div>
              </div>

              {/* Empty state */}
              {filteredProperties.length === 0 && (
                <div className="bg-white rounded-3xl p-8 text-center border border-neutral-200/80 my-8">
                  <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <h3 className="font-extrabold text-base text-neutral-800">No properties found</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                    Try adjusting your search criteria or switch to &quot;All UAE&quot; communities.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-4 px-5 py-2 rounded-2xl bg-[#111812] text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Property Cards */}
              <div
                className={`grid gap-4 ${
                  viewMode === 'list'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : listColumns === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1'
                }`}
              >
                {filteredProperties.map((property) => {
                  const isSelected = selectedPropertyId === property.id;
                  const isHovered = hoveredPropertyId === property.id;

                  return (
                    <div
                      key={property.id}
                      id={`property-card-${property.id}`}
                      onMouseEnter={() => setHoveredPropertyId(property.id)}
                      onMouseLeave={() => setHoveredPropertyId(null)}
                      className={`bg-white rounded-3xl overflow-hidden border transition-all duration-200 ${
                        isSelected
                          ? 'border-black ring-2 ring-black/10 shadow-lg scale-[1.01]'
                          : isHovered
                          ? 'border-neutral-400 shadow-md'
                          : 'border-neutral-200/80 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="relative h-44 w-full overflow-hidden bg-neutral-200">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="bg-black/75 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                            {property.status}
                          </span>
                          <span className="bg-white/90 backdrop-blur-md text-neutral-900 px-2 py-0.5 rounded-full text-[11px] font-bold">
                            {property.type}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-[#FFDE02] text-black px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-sm">
                          {property.category}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-baseline justify-between mb-1">
                          <div className="text-lg font-black text-[#111812]">
                            {formatPrice(property.price)}
                            {property.category === 'For Rent' && (
                              <span className="text-[11px] font-medium text-neutral-500"> / mo</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{property.rating}</span>
                          </div>
                        </div>

                        <h3 className="font-extrabold text-sm text-neutral-900 line-clamp-1 mb-0.5">
                          {property.title}
                        </h3>

                        <div className="flex items-center gap-1 text-[11px] text-neutral-500 mb-2.5">
                          <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="line-clamp-1">{property.address}</span>
                        </div>

                        {/* Specs */}
                        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-600 py-2.5 border-y border-neutral-100 mb-3">
                          <div className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{property.beds} Beds</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{property.baths} Baths</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Square className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{property.sqft.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLocateProperty(property)}
                            className={`flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all ${
                              isSelected
                                ? 'bg-[#FFDE02] text-black shadow-sm'
                                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                            }`}
                          >
                            <MapPin className="w-3 h-3" />
                            <span>{isSelected ? 'Focused' : 'Locate'}</span>
                          </button>

                          <Link
                            href={`/listings/${property.id}`}
                            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-[11px] font-bold bg-[#111812] text-white hover:bg-neutral-800 transition-colors"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RIGHT MAP PANEL */}
          {(viewMode === 'split' || viewMode === 'map') && (
            <div
              className={`h-full sticky top-24 ${
                viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'
              }`}
            >
              <PropertyMap
                properties={filteredProperties}
                selectedPropertyId={selectedPropertyId}
                hoveredPropertyId={hoveredPropertyId}
                onSelectProperty={handleSelectPropertyFromMap}
                centerLocation={centerLocation}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

