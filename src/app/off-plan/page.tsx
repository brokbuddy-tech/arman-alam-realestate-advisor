'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Search, SlidersHorizontal, LayoutGrid, List, ChevronDown, Bed, Bath, Square, Star, MapPin } from 'lucide-react';
import BlurReveal from '@/components/ui/blur-reveal';
import { useCurrency } from '@/context/CurrencyContext';
import { properties as initialProperties } from '@/data/properties';

const categories = ['For Buy', 'For Rent', 'Off-Plan', 'Commercial'];



export default function ListingsPage() {
  const { formatPrice } = useCurrency();
  const [activeCategory, setActiveCategory] = useState('Off-Plan');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const visibleProperties = initialProperties.filter((property) => property.category === activeCategory);

  return (
    <div className="w-full bg-[#111812] min-h-screen font-sans text-neutral-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-28 text-center px-6 overflow-hidden">
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
            Home listings
          </BlurReveal>
          <p className="text-neutral-400 text-sm sm:text-base mt-3 max-w-lg mx-auto">
            Browse real homes, weigh your options, and make your next move with confidence.
          </p>
        </motion.div>
      </section>

      {/* 2. MAIN CONTENT CONTAINER */}
      <section className="bg-[#F6F6F4] py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Category Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm ${
                  activeCategory === cat
                    ? 'bg-[#111812] text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDEBAR FILTER */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 sticky top-24 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4"/> Filter Listings
                </h3>
                <button className="text-xs font-semibold text-neutral-500 hover:text-black">Reset all</button>
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600">Location</label>
                <div className="relative bg-neutral-100 rounded-2xl px-4 py-3 flex items-center gap-3 border border-neutral-200/60">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0"/>
                  <input type="text" placeholder="Search community or city" className="w-full bg-transparent text-xs text-neutral-900 focus:outline-none"/>
                </div>
              </div>

              {/* Status Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600">Status</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 bg-neutral-100 p-1 rounded-2xl border border-neutral-200/60">
                  {['All', 'Ready', 'Off-Plan'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all ${
                        statusFilter === st ? 'bg-[#111812] text-white shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
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
            <div className="lg:col-span-8 space-y-6">
              
              {/* Top Bar (Count, Sort, Grid/List Toggles) */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-medium text-neutral-500">
                  Showing <span className="font-bold text-neutral-900">{visibleProperties.length}</span> properties found
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Sorting Dropdown */}
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-neutral-100 text-xs font-medium text-neutral-700 px-3 py-2 rounded-xl border border-neutral-200/60 focus:outline-none"
                  >
                    <option value="newest">Sort by: Newest</option>
                    <option value="oldest">Sort by: Oldest</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                    <option value="a-z">Name: A to Z</option>
                    <option value="z-a">Name: Z to A</option>
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
                        <LayoutGrid className="w-4 h-4"/>
                      </button>
                      <button 
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-neutral-400'}`}
                      >
                        <List className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Cards Grid/List */}
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
                {visibleProperties.map((property) => (
                  <Link href={`/listings/${property.id}`} key={property.id} className="block">
                  <motion.div
                    layout
                    className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-200/60 group flex ${viewMode === 'list' ? 'flex-col sm:flex-row' : 'flex-col'}`}
                  >
                    {/* Image Wrapper */}
                    <div className={`relative ${viewMode === 'list' ? 'sm:w-72 h-64 sm:h-auto' : 'h-64 w-full'} overflow-hidden bg-neutral-100 shrink-0`}>
                      <Image alt={property.title} className="object-cover group-hover:scale-105 transition-transform duration-500" fill src={property.image}/>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-neutral-800 shadow-sm">
                        {property.type}
                      </div>
                      
                    </div>

                    {/* Details */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="text-2xl font-black text-[#111812] mb-1">{formatPrice(property.price)}</div>
                        <h4 className="font-bold text-lg text-neutral-900 transition-colors">{property.title}</h4>
                        <p className="text-xs text-neutral-500 mt-1">{property.address}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-neutral-100 text-[11px] font-medium text-neutral-600">
                        <div className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-neutral-400"/> {property.beds}</div>
                        <div className="flex items-center gap-1"><Square className="w-3.5 h-3.5 text-neutral-400"/> {property.sqft}</div>
                        <div className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-neutral-400"/> {property.baths}</div>
                        <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500"/> {property.rating}</div>
                      </div>
                    </div>
                  </motion.div>
                  </Link>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. FOOTER */}
      <footer className="relative bg-[#111812] text-white pt-24 pb-0 overflow-hidden">
        <div className="w-full overflow-hidden leading-none select-none text-center pointer-events-none mt-12">
          <span 
            className="text-[18vw] font-black tracking-tighter text-transparent block -mb-8"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
          >
            Arman Alam
          </span>
        </div>
      </footer>
    </div>
  );
}
