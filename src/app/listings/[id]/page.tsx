'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Square, Star, MapPin, CheckCircle2, ChevronDown, Phone, Mail, Send, Calendar, ShieldCheck, QrCode } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { properties } from '@/data/properties';
import { broker } from '@/data/broker';
import { BrochureButton } from '@/components/BrochureButton';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { formatPrice } = useCurrency();
  const unwrappedParams = React.use(params);
  
  // Find property or default to the first one if not found
  const propertyId = parseInt(unwrappedParams.id);
  const property = properties.find(p => p.id === propertyId) || properties[0];

  // Interactive Mortgage Calculator State
  const [propertyPrice, setPropertyPrice] = useState(property.price);
  const [downPayment, setDownPayment] = useState(20);
  const [loanTerm, setLoanTerm] = useState(25);
  const [interestRate, setInterestRate] = useState(4.5);

  // Accordion FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Calculated Mortgage
  const loanAmount = propertyPrice * (1 - downPayment / 100);
  const monthlyInterest = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = Math.round(
    (loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)) /
    (Math.pow(1 + monthlyInterest, numberOfPayments) - 1)
  );

  const similarProperties = properties.filter(p => p.id !== property.id).slice(0, 2);

  return (
    <div className="w-full bg-[#F6F6F4] min-h-screen font-sans text-neutral-900 pt-28">
      
      {/* 1. PHOTO GALLERY HEADER */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[480px]">
          {/* Main Large Image */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-sm bg-neutral-200 h-[300px] sm:h-[400px] lg:h-full">
            <Image alt={property.title} className="object-cover" fill src={property.image}/>
          </div>
          {/* Thumbnail Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden shadow-sm bg-neutral-200 h-[140px] sm:h-[200px] lg:h-[230px]">
              <Image alt="Gallery 1" className="object-cover" fill src={property.gallery[0]}/>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-sm bg-neutral-200 h-[140px] sm:h-[200px] lg:h-[230px]">
              <Image alt="Gallery 2" className="object-cover" fill src={property.gallery[1]}/>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-sm bg-neutral-200 h-[140px] sm:h-[200px] lg:h-[230px] col-span-2">
              <Image alt="Gallery 3" className="object-cover" fill src={property.gallery[2]}/>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-black/50 transition-colors">
                +12 Photos Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT & SIDEBAR */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Property Info */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Title & Price Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200/60">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="inline-flex items-center gap-2 bg-[#111812] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#FFDE02]" />
                  {property.address}
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{property.status}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
                {property.title}
              </h1>
              <div className="inline-block bg-[#111812] text-[#FFDE02] text-2xl font-black px-6 py-3 rounded-2xl shadow-md">
                {formatPrice(property.price)}
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-neutral-100 text-xs font-medium text-neutral-600">
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <span className="text-neutral-400 block mb-1">Property Type</span>
                  <strong className="text-neutral-900 text-sm">{property.type}</strong>
                </div>
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <span className="text-neutral-400 block mb-1">Bedrooms</span>
                  <strong className="text-neutral-900 text-sm">{property.beds} Beds</strong>
                </div>
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <span className="text-neutral-400 block mb-1">Bathrooms</span>
                  <strong className="text-neutral-900 text-sm">{property.baths} Baths</strong>
                </div>
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <span className="text-neutral-400 block mb-1">Area Size</span>
                  <strong className="text-neutral-900 text-sm">{property.sqft}</strong>
                </div>
              </div>
            </div>

            {/* About Property */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200/60 space-y-4">
              <h3 className="text-xl font-bold text-neutral-900">About Property</h3>
              {property.description.map((para, i) => (
                <p key={i} className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* Key Features & Amenities */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200/60 space-y-6">
              <h3 className="text-xl font-bold text-neutral-900">Key Features & Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <CheckCircle2 className="w-4 h-4 text-[#111812] shrink-0"/> {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive FAQ Accordion */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200/60 space-y-4">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">Frequently Asked Questions</h3>
              {property.faqs.map((faq, idx) => (
                <div key={idx} className="border border-neutral-200/60 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm bg-neutral-50 hover:bg-neutral-100 transition-colors"
                  >
                    {faq.q}
                    <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 text-xs text-neutral-600 bg-white border-t border-neutral-100 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Similar Properties Section */}
            <div className="pt-8 space-y-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Similar Properties</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {similarProperties.map((simProp) => (
                  <Link href={`/listings/${simProp.id}`} key={simProp.id} className="block">
                    <motion.div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-200/60 group flex flex-col h-full">
                      <div className="relative h-48 w-full overflow-hidden bg-neutral-100 shrink-0">
                        <Image alt={simProp.title} className="object-cover group-hover:scale-105 transition-transform duration-500" fill src={simProp.image}/>
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-neutral-800 shadow-sm">
                          {simProp.type}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col justify-between flex-1">
                        <div>
                          <div className="text-lg font-black text-[#111812] mb-1">{formatPrice(simProp.price)}</div>
                          <h4 className="font-bold text-sm text-neutral-900 transition-colors">{simProp.title}</h4>
                          <p className="text-[11px] text-neutral-500 mt-1">{simProp.address}</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 pt-3 mt-3 border-t border-neutral-100 text-[10px] font-medium text-neutral-600">
                          <div className="flex items-center gap-1"><Bed className="w-3 h-3 text-neutral-400"/> {simProp.beds}</div>
                          <div className="flex items-center gap-1"><Square className="w-3 h-3 text-neutral-400"/> {simProp.sqft.split(' ')[0]}</div>
                          <div className="flex items-center gap-1"><Bath className="w-3 h-3 text-neutral-400"/> {simProp.baths}</div>
                          <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-amber-500"/> {simProp.rating}</div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Sidebar (Agent Contact + Mortgage Calculator) */}
          <div className="lg:col-span-4 space-y-8 sticky top-28">
            
            {/* Trakheesi Permit Badge */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                  <ShieldCheck className="w-4 h-4"/>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Verified Listing</span>
                </div>
                <h4 className="font-bold text-sm text-neutral-900">Trakheesi Permit</h4>
                <p className="text-xs text-neutral-500 font-medium font-mono mt-1">7112345678</p>
              </div>
              <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                <QrCode className="w-10 h-10 text-neutral-800"/>
              </div>
            </div>

            {/* Download Brochure Button */}
            <BrochureButton property={property} />

            {/* Agent Contact Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-neutral-100">
                <div className="w-14 h-14 rounded-full shrink-0 bg-[#111812] text-[#FFDE02] flex items-center justify-center font-bold">
                  AA
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{broker.name}</h4>
                  <p className="text-xs text-neutral-500 font-medium">{broker.role}</p>
                </div>
              </div>

              {/* Inquiry Form */}
              <form onSubmit={(e) => { e.preventDefault(); alert('Inquiry sent successfully!'); }} className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Full Name</label>
                  <input type="text" placeholder="John Doe" required className="w-full bg-neutral-50 border border-neutral-200/60 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none"/>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Email Address</label>
                  <input type="email" placeholder="john@example.com" required className="w-full bg-neutral-50 border border-neutral-200/60 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none"/>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Phone Number</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" required className="w-full bg-neutral-50 border border-neutral-200/60 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none"/>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">Message</label>
                  <textarea rows={3} placeholder="I am interested in this property..." className="w-full bg-neutral-50 border border-neutral-200/60 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#111812] text-white py-3 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Send className="w-3.5 h-3.5"/> Send Inquiry
                </button>
              </form>
            </div>

            {/* Mortgage Calculator Widget */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-6">
              <h4 className="font-bold text-sm text-neutral-900">Mortgage Calculator</h4>
              
              <div className="space-y-4 text-xs font-medium text-neutral-600">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Property Price</span>
                    <strong className="text-neutral-900">{formatPrice(propertyPrice)}</strong>
                  </div>
                  <input type="range" min="100000" max="10000000" step="50000" value={propertyPrice} onChange={(e) => setPropertyPrice(Number(e.target.value))} className="w-full accent-[#111812]"/>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Down Payment</span>
                    <strong className="text-neutral-900">{downPayment}% ({formatPrice(propertyPrice * downPayment / 100)})</strong>
                  </div>
                  <input type="range" min="10" max="50" step="5" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full accent-[#111812]"/>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Loan Term</span>
                    <strong className="text-neutral-900">{loanTerm} Years</strong>
                  </div>
                  <input type="range" min="5" max="30" step="1" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="w-full accent-[#111812]"/>
                </div>
              </div>

              {/* Calculated Output */}
              <div className="bg-[#111812] text-white p-4 rounded-2xl text-center space-y-1">
                <span className="text-[11px] text-neutral-400 block uppercase tracking-wider">Estimated Monthly Payment</span>
                <div className="text-2xl font-black text-[#FFDE02]">{formatPrice(monthlyPayment)} / Mo</div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
