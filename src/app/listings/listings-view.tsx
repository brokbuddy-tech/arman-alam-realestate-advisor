'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertySearch from '@/components/PropertySearch';
import { listingSearchHref, type ListingSort } from '@/lib/property-search';
import { Search, SlidersHorizontal, LayoutGrid, List, ChevronDown, Bed, Bath, Square, Star, MapPin } from 'lucide-react';
import BlurReveal from '@/components/ui/blur-reveal';
import { useCurrency } from '@/context/CurrencyContext';
import type { BrokBuddyListingsPage, ListingCategory } from '@/lib/brokbuddy/website-data';

const categories = ['All', 'For Buy', 'For Rent', 'Off-Plan', 'Commercial'];



export default function ListingsView({ data, activeCategory, searchQuery = "", sort = "newest" }: { data: BrokBuddyListingsPage; activeCategory: ListingCategory; searchQuery?: string; sort?: ListingSort }) {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const initialProperties = data.properties;
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const visibleProperties = initialProperties;
  const categoryRoutes: Record<string, string> = { All: '/listings', 'For Buy': '/sell', 'For Rent': '/rent', 'Off-Plan': '/off-plan', Commercial: '/commercial' };
  const pageHref = (page: number, nextSort = sort) => listingSearchHref(categoryRoutes[activeCategory], page, searchQuery, nextSort);

  return (
    <div className="w-full bg-[#111812] min-h-screen font-sans text-neutral-900">

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-14 sm:pt-40 sm:pb-20 text-center px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black/40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-[#111812]/80 to-[#111812]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <BlurReveal as="h1" className="text-4xl sm:text-6xl font-bold text-white tracking-tight">
            {activeCategory === 'All' ? 'All listings' : activeCategory === 'For Buy' ? 'Properties for sale' : activeCategory === 'For Rent' ? 'Properties for rent' : activeCategory + ' properties'}
          </BlurReveal>
          <p className="text-neutral-400 text-sm sm:text-base mt-3 max-w-lg mx-auto">
            Browse real homes, weigh your options, and make your next move with confidence.
          </p>
        </motion.div>
      </section>

      {/* 2. MAIN CONTENT CONTAINER */}
      <section className="bg-[#F6F6F4] py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <PropertySearch key={searchQuery} initialQuery={searchQuery} className="mb-8" />

          {/* Category Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={categoryRoutes[cat]}
                className={`px-4 sm:px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm ${activeCategory === cat
                  ? 'bg-[#111812] text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200/60'
                  }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <button type="button" className="flex min-h-12 items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-semibold lg:hidden" aria-expanded={showFilters} aria-controls="listing-filters" onClick={() => setShowFilters(!showFilters)}>
              Filter listings <SlidersHorizontal className="h-4 w-4" />
            </button>
            {/* LEFT SIDEBAR FILTER */}
            <div id="listing-filters" className={`${showFilters ? "block" : "hidden"} lg:block lg:col-span-4 min-w-0 bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 lg:sticky lg:top-24 space-y-6`}>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Filter Listings
                </h3>
                <button className="text-xs font-semibold text-neutral-500 hover:text-black">Reset all</button>
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600">Location</label>
                <div className="relative bg-neutral-100 rounded-2xl px-4 py-3 flex items-center gap-3 border border-neutral-200/60">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input type="text" placeholder="Search community or city" className="w-full bg-transparent text-xs text-neutral-900 focus:outline-none" />
                </div>
              </div>

              {/* Status Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600">Status</label>
                <div className="grid grid-cols-3 gap-1 bg-neutral-100 p-1 rounded-2xl border border-neutral-200/60">
                  {['All', 'Ready', 'Off-Plan'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all ${statusFilter === st ? 'bg-[#111812] text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Handover Date for Off-Plan */}
              <AnimatePresence>
                {statusFilter === 'Off-Plan' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-xs font-semibold text-neutral-600">Handover Date / Year</label>
                    <select className="w-full bg-neutral-100 rounded-2xl px-4 py-3 text-xs text-neutral-700 border border-neutral-200/60 focus:outline-none">
                      <option>Q3 2024</option>
                      <option>Q4 2024</option>
                      <option>Q1 2025</option>
                      <option>Q2 2025</option>
                      <option>Q3 2025</option>
                      <option>Q4 2025</option>
                      <option>Q1 2026</option>
                      <option>Q2 2026</option>
                      <option>Q3 2026</option>
                      <option>Q4 2026</option>
                      <option>2027</option>
                      <option>2028 & Beyond</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-600">Bedrooms</label>
                  <select className="w-full bg-neutral-100 rounded-2xl px-3 py-3 text-xs text-neutral-700 border border-neutral-200/60 focus:outline-none">
                    <option>Any</option>
                    <option>Studio</option>
                    <option>1 Bed</option>
                    <option>2 Beds</option>
                    <option>3 Beds</option>
                    <option>4 Beds</option>
                    <option>5 Beds</option>
                    <option>6+ Beds</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-600">Bathrooms</label>
                  <select className="w-full bg-neutral-100 rounded-2xl px-3 py-3 text-xs text-neutral-700 border border-neutral-200/60 focus:outline-none">
                    <option>Any</option>
                    <option>1 Bath</option>
                    <option>2 Baths</option>
                    <option>3 Baths</option>
                    <option>4 Baths</option>
                    <option>5+ Baths</option>
                  </select>
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600">Property Type</label>
                <select className="w-full bg-neutral-100 rounded-2xl px-4 py-3 text-xs text-neutral-700 border border-neutral-200/60 focus:outline-none">
                  <option>All Types</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Townhouse</option>
                  <option>Penthouse</option>
                  <option>Duplex</option>
                  <option>Loft</option>
                  <option>Cottage</option>
                  <option>Commercial Space</option>
                  <option>Plot / Land</option>
                </select>
              </div>

              <button className="w-full bg-[#111812] text-white py-3.5 rounded-2xl text-xs font-semibold shadow-sm hover:bg-neutral-800 transition-colors">
                Apply Filters
              </button>
            </div>

            {/* RIGHT CONTENT AREA */}
            <div id="property-results" role="region" aria-label="Property results" className="lg:col-span-8 min-w-0 space-y-6">

              {/* Top Bar (Count, Sort, Grid/List Toggles) */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200/60 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                <p className="text-xs font-medium text-neutral-500">
                  Showing <span className="font-bold text-neutral-900">{visibleProperties.length}</span> properties on this page ({data.total} total)
                </p>

                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between">
                  {/* Sorting Dropdown */}
                  <select
                    value={sort}
                    onChange={(event) => router.push(pageHref(1, event.target.value as ListingSort), { scroll: false })}
                    className="bg-neutral-100 text-xs font-medium text-neutral-700 px-3 py-2 rounded-xl border border-neutral-200/60 focus:outline-none"
                  >
                    {searchQuery && <option value="relevance">Sort by: Best match</option>}
                    <option value="newest">Sort by: Newest</option>
                    <option value="oldest">Sort by: Oldest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>

                  {/* Grid / List / Map View Toggle */}
                  <div className="flex items-center gap-2">
                    <Link
                      href="/map"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FFDE02] text-black hover:bg-yellow-400 transition-all shadow-sm"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Map View</span>
                    </Link>

                    <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200/60">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-neutral-400'}`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-neutral-400'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Cards Grid/List */}
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                {visibleProperties.map((property) => (
                  <Link href={`/listings/${property.id}`} key={property.id} className="block min-w-0">
                    <motion.div
                      layout
                      className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-200/60 group flex ${viewMode === 'list' ? 'flex-col md:flex-row' : 'flex-col'}`}
                    >
                      {/* Image Wrapper */}
                      <div className={`relative ${viewMode === 'list' ? 'md:w-56 h-56 md:h-auto' : 'h-64 w-full'} overflow-hidden bg-neutral-100 shrink-0`}>
                        <Image alt={property.title} className="object-cover group-hover:scale-105 transition-transform duration-500" fill src={property.image} unoptimized />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-neutral-800 shadow-sm">
                          {property.type}
                        </div>

                      </div>

                      {/* Details */}
                      <div className="p-5 min-w-0 flex flex-col justify-between flex-1">
                        <div>
                          <div className="text-2xl font-black text-[#111812] mb-1">{formatPrice(property.price, property.currency)}</div>
                          <h4 className="font-bold text-lg text-neutral-900 transition-colors">{property.title}</h4>
                          <p className="text-xs text-neutral-500 mt-1">{property.address}</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-neutral-100 text-[11px] font-medium text-neutral-600">
                          <div className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-neutral-400" /> {property.beds}</div>
                          <div className="flex items-center gap-1"><Square className="w-3.5 h-3.5 text-neutral-400" /> {property.sqft}</div>
                          <div className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-neutral-400" /> {property.baths}</div>
                          {property.rating !== null && <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {property.rating}</div>}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
              {visibleProperties.length === 0 && (
                <p role="status" className="rounded-3xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
                  {searchQuery ? 'No properties match this request. Try a wider budget, a different location, or fewer requirements.' : 'There are no listings on this page. Please check back soon.'}
                  {searchQuery && <Link href="/listings" className="mt-4 block font-semibold text-neutral-900 underline underline-offset-4">Clear search and view all listings</Link>}
                </p>
              )}
              <nav aria-label="Listing pagination" className="flex items-center justify-center gap-6 text-sm font-semibold">
                {data.page > 1 && <Link href={pageHref(data.page - 1)} rel="prev">Previous</Link>}
                <span aria-current="page">Page {data.page} of {data.totalPages}</span>
                {data.page < data.totalPages && <Link href={pageHref(data.page + 1)} rel="next">Next</Link>}
              </nav>

            </div>

          </div>
        </div>
      </section>


    </div>
  );
}
