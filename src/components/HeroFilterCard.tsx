'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Sparkles } from 'lucide-react';

export function HeroFilterCard() {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');
  const [isAiSearch, setIsAiSearch] = useState(false);
  const [buySubFilter, setBuySubFilter] = useState<'All' | 'Ready' | 'Off-Plan'>('All');
  
  const [isBedsOpen, setIsBedsOpen] = useState(false);
  const [selectedBeds, setSelectedBeds] = useState<string | null>(null);
  const [selectedBaths, setSelectedBaths] = useState<string | null>(null);
  const bedsRef = useRef<HTMLDivElement>(null);
  
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [propertyType, setPropertyType] = useState('');
  const propertyTypeRef = useRef<HTMLDivElement>(null);
  
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [currency, setCurrency] = useState('AED');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const priceRef = useRef<HTMLDivElement>(null);
  
  const [isRentalPeriodOpen, setIsRentalPeriodOpen] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState('');
  const rentalPeriodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bedsRef.current && !bedsRef.current.contains(event.target as Node)) setIsBedsOpen(false);
      if (propertyTypeRef.current && !propertyTypeRef.current.contains(event.target as Node)) setIsPropertyTypeOpen(false);
      if (priceRef.current && !priceRef.current.contains(event.target as Node)) setIsPriceOpen(false);
      if (rentalPeriodRef.current && !rentalPeriodRef.current.contains(event.target as Node)) setIsRentalPeriodOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      className="w-full max-w-sm bg-white/20 dark:bg-neutral-900/20 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-3xl p-6 shadow-2xl text-neutral-900 dark:text-white font-sans ml-auto">
      
      {/* ROW 1: Tab switcher, Location Input, Search Button */}
      <div className="flex flex-col items-stretch gap-3 mb-4">
        
        <div className="flex justify-between items-center gap-2">
          {/* Buy / Rent Switcher */}
          <div className="flex bg-white/50 dark:bg-neutral-800/50 p-1 rounded-2xl w-full md:w-auto shrink-0 border border-white/60 dark:border-neutral-700">
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'buy'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-800 dark:text-neutral-200 hover:bg-white/40 hover:text-black'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'rent'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-800 dark:text-neutral-200 hover:bg-white/40 hover:text-black'
              }`}
            >
              Rent
            </button>
          </div>

          {/* AI Search Toggle */}
          <button
            onClick={() => setIsAiSearch(!isAiSearch)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border shrink-0 ${
              isAiSearch 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-md' 
                : 'bg-white/50 dark:bg-neutral-800/50 text-neutral-800 dark:text-neutral-200 border-white/60 dark:border-neutral-700 hover:bg-white/80 dark:hover:bg-neutral-700/80'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Search
          </button>
        </div>

        {/* Search Input */}
        {isAiSearch ? (
          <div className="relative w-full bg-white dark:bg-neutral-800 rounded-2xl px-4 py-3 border border-purple-300 dark:border-purple-500/50 flex items-start gap-3 shadow-sm ring-2 ring-purple-500/20">
            <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5"/>
            <textarea
              placeholder="Describe your ideal property... (e.g., A 3-bedroom villa in Dubai Marina with a sea view under 5M AED)"
              className="w-full bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none resize-none h-16"
            />
          </div>
        ) : (
          <div className="relative w-full bg-white dark:bg-neutral-800 rounded-2xl px-4 py-3 border border-white/60 dark:border-neutral-700 flex items-center gap-3 shadow-sm">
            <Search className="w-4 h-4 text-neutral-400 shrink-0"/>
            <input
              type="text"
              placeholder="Enter location or community"
              className="w-full bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        )}

        {/* Search Button */}
        <button className="w-full bg-white hover:bg-neutral-50 text-black px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-sm shrink-0 border border-white/60">
          {isAiSearch ? 'Search with AI' : 'Search'}
        </button>
      </div>

      {/* ROW 2: Dynamic Filters based on Buy or Rent */}
      {!isAiSearch && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 pt-2"
          >
          {activeTab === 'buy' ? (
            /* Buy Sub-filters */
            <div className="bg-white/50 dark:bg-neutral-800/50 rounded-2xl p-1 flex items-center justify-between border border-white/60 dark:border-neutral-700">
              {(['All', 'Ready', 'Off-Plan'] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setBuySubFilter(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    buySubFilter === item
                      ? 'bg-white text-black shadow-sm'
                      : 'text-neutral-800 dark:text-neutral-200 hover:bg-white/40 hover:text-black'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : (
            /* Rent Sub-filter (Rental Period) */
            <div className="relative" ref={rentalPeriodRef}>
              <input 
                value={rentalPeriod}
                onChange={(e) => setRentalPeriod(e.target.value)}
                onFocus={() => setIsRentalPeriodOpen(true)}
                placeholder="Rental Period"
                className="w-full bg-white dark:bg-neutral-800 rounded-2xl pl-4 pr-10 py-2.5 text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-500 shadow-sm border border-white/60 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors outline-none"
              />
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"/>
              <AnimatePresence>
                {isRentalPeriodOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-neutral-200/60 py-2 z-[100] max-h-48 overflow-y-auto"
                  >
                    {['Yearly', 'Monthly', 'Weekly', 'Daily'].map(opt => (
                      <div 
                        key={opt}
                        onClick={() => { setRentalPeriod(opt); setIsRentalPeriodOpen(false); }}
                        className="px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                      >
                        {opt}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Common Dropdowns */}
          <div className="relative" ref={propertyTypeRef}>
            <input 
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              onFocus={() => setIsPropertyTypeOpen(true)}
              placeholder="Property Type"
              className="w-full bg-white dark:bg-neutral-800 rounded-2xl pl-4 pr-10 py-2.5 text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-500 shadow-sm border border-white/60 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors outline-none"
            />
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"/>
            <AnimatePresence>
              {isPropertyTypeOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-neutral-200/60 py-2 z-[100] max-h-48 overflow-y-auto"
                >
                  {['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Duplex', 'Plot', 'Commercial', 'Office', 'Hotel Apartment', 'Whole Building'].map(opt => (
                    <div 
                      key={opt}
                      onClick={() => { setPropertyType(opt); setIsPropertyTypeOpen(false); }}
                      className="px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                    >
                      {opt}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={bedsRef}>
            <button 
              onClick={() => setIsBedsOpen(!isBedsOpen)}
              className="w-full bg-white dark:bg-neutral-800 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs font-medium shadow-sm border border-white/60 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <span className={selectedBeds || selectedBaths ? "text-neutral-900 dark:text-white" : "text-neutral-500"}>
                {selectedBeds || selectedBaths 
                  ? `${selectedBeds ? selectedBeds + ' Beds' : ''}${selectedBeds && selectedBaths ? ', ' : ''}${selectedBaths ? selectedBaths + ' Baths' : ''}`
                  : "Beds & Baths"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 shrink-0 mr-1"/>
            </button>

            <AnimatePresence>
              {isBedsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 bottom-full mb-4 w-[calc(100vw-2rem)] max-w-[360px] sm:w-[360px] bg-white rounded-3xl shadow-2xl border border-neutral-200/60 p-6 z-[100]"
                >
                  {/* Pointer arrow pointing down */}
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-neutral-200/60 rotate-45" />
                  
                  {/* Bedrooms */}
                  <div className="relative z-10">
                    <h4 className="text-[11px] font-bold text-neutral-500 tracking-wider mb-3">BEDROOMS</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Studio', '1', '2', '3', '4', '5', '6', '7+'].map(bed => (
                        <button 
                          key={bed}
                          onClick={() => setSelectedBeds(selectedBeds === bed ? null : bed)}
                          className={`px-4 py-2 rounded-full text-xs transition-colors border ${
                            selectedBeds === bed 
                              ? 'border-neutral-900 bg-neutral-900 text-white' 
                              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                          }`}
                        >
                          {bed}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div className="relative z-10 mt-6">
                    <h4 className="text-[11px] font-bold text-neutral-500 tracking-wider mb-3">BATHROOMS</h4>
                    <div className="flex flex-wrap gap-2">
                      {['1', '2', '3', '4', '5', '6+'].map(bath => (
                        <button 
                          key={bath}
                          onClick={() => setSelectedBaths(selectedBaths === bath ? null : bath)}
                          className={`px-4 py-2 rounded-full text-xs transition-colors border ${
                            selectedBaths === bath 
                              ? 'border-neutral-900 bg-neutral-900 text-white' 
                              : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
                          }`}
                        >
                          {bath}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 flex items-center gap-3 mt-6 pt-4 border-t border-neutral-100">
                    <button 
                      onClick={() => { setSelectedBeds(null); setSelectedBaths(null); }}
                      className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => setIsBedsOpen(false)}
                      className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-sm font-bold text-white transition-colors shadow-md shadow-neutral-900/20"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={priceRef}>
            <button 
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="w-full bg-white dark:bg-neutral-800 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs font-medium shadow-sm border border-white/60 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <span className={minPrice || maxPrice ? "text-neutral-900 dark:text-white" : "text-neutral-500"}>
                {minPrice || maxPrice 
                  ? `${minPrice ? currency + ' ' + minPrice : '0'} - ${maxPrice ? currency + ' ' + maxPrice : 'Any'}`
                  : "Price"}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 shrink-0 mr-1"/>
            </button>

            <AnimatePresence>
              {isPriceOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 bottom-full mb-4 w-[calc(100vw-2rem)] max-w-[360px] sm:w-[360px] bg-white rounded-3xl shadow-2xl border border-neutral-200/60 p-6 z-[100]"
                >
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-neutral-200/60 rotate-45" />
                  
                  {/* Currency */}
                  <div className="relative z-10 mb-4">
                    <label className="text-[12px] font-medium text-neutral-600 mb-2 block">Currency</label>
                    <div className="relative">
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full appearance-none bg-neutral-100 rounded-xl pl-4 pr-10 py-3 text-xs font-medium text-neutral-800 outline-none focus:ring-2 focus:ring-neutral-200 cursor-pointer"
                      >
                        <option value="AED">AED (UAE Dirham)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                        <option value="GBP">GBP (British Pound)</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-800 pointer-events-none" />
                    </div>
                  </div>

                  {/* Min / Max Price */}
                  <div className="relative z-10 flex gap-4 mb-6">
                    <div className="flex-1">
                      <label className="text-[12px] font-medium text-neutral-600 mb-2 block">Minimum</label>
                      <div className="relative">
                        <input 
                          type="number"
                          placeholder="0"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full bg-neutral-100 rounded-xl pl-4 pr-12 py-3 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-200"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-medium text-neutral-500 pointer-events-none">{currency}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-[12px] font-medium text-neutral-600 mb-2 block">Maximum</label>
                      <div className="relative">
                        <input 
                          type="number"
                          placeholder="Any"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full bg-neutral-100 rounded-xl pl-4 pr-12 py-3 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-200"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-medium text-neutral-500 pointer-events-none">{currency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
                    <button 
                      onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                      className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => setIsPriceOpen(false)}
                      className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-sm font-bold text-white transition-colors shadow-md shadow-neutral-900/20"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        </AnimatePresence>
      )}

    </motion.div>
  );
}
