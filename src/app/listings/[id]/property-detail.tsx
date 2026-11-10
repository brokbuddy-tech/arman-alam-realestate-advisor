'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Square, Star, CheckCircle2, ChevronDown } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import type { Property } from '@/data/properties';
import { getBrokerInitials } from '@/data/broker';
import { useBrokBuddyData } from '@/context/BrokBuddyContext';
import { BrochureButton } from '@/components/BrochureButton';
import RichText from '@/components/RichText';
import PropertyGallery from '@/components/PropertyGallery';
import { isRentalProperty } from '@/lib/property';

export default function PropertyDetail({ property }: { property: Property }) {
  const { formatPrice } = useCurrency();
  const { broker: scopedBroker, properties } = useBrokBuddyData();
  const broker = scopedBroker!;
  const isRental = isRentalProperty(property);

  // Interactive Mortgage Calculator State
  const [priceOverride, setPriceOverride] = useState<{
    listingId: string | number;
    price: number;
  } | null>(null);
  const propertyPrice =
    priceOverride && priceOverride.listingId === property?.id
      ? priceOverride.price
      : property?.price ?? 0;
  const setPropertyPrice = (price: number) => {
    if (property) {
      setPriceOverride({ listingId: property.id, price });
    }
  };
  const [downPayment, setDownPayment] = useState(20);
  const [loanTerm, setLoanTerm] = useState(25);
  const interestRate = 4.5;

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

  const similarProperties = properties.filter((item) => item.id !== property.id).slice(0, 2);

  return (
    <div className="w-full bg-[#F6F6F4] min-h-screen font-sans text-neutral-900 pt-28">
      
      {/* 1. PHOTO GALLERY HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10">
        <PropertyGallery key={property.id} title={property.title} images={property.gallery} fallback={property.image} />
      </div>

      {/* 2. MAIN CONTENT & SIDEBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Property Info */}
          <div className="lg:col-span-8 min-w-0 space-y-6">
            
            {/* Title & Price Header */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-neutral-200/60">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="inline-flex max-w-full items-start gap-2 bg-[#111812] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FFDE02]" />
                  {property.address}
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{property.status}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold [overflow-wrap:anywhere] tracking-tight text-neutral-900 mb-4">
                {property.title}
              </h1>
              <div className="inline-block bg-[#111812] text-[#FFDE02] max-w-full text-xl sm:text-2xl font-black px-4 sm:px-6 py-3 [overflow-wrap:anywhere] rounded-2xl shadow-md">
                {formatPrice(property.price, property.currency)}
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-neutral-100 text-xs font-medium text-neutral-600">
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <span className="text-neutral-400 block mb-1">Property Type</span>
                  <strong className="text-neutral-900 text-sm">{property.type}</strong>
                </div>
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <span className="text-neutral-400 block mb-1">Bedrooms</span>
                  <strong className="text-neutral-900 text-sm">{property.beds ?? '—'} Beds</strong>
                </div>
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <span className="text-neutral-400 block mb-1">Bathrooms</span>
                  <strong className="text-neutral-900 text-sm">{property.baths ?? '—'} Baths</strong>
                </div>
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <span className="text-neutral-400 block mb-1">Area Size</span>
                  <strong className="text-neutral-900 text-sm">{property.sqft}</strong>
                </div>
              </div>
            </div>

            {/* About Property */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-neutral-200/60 space-y-4">
              <h3 className="text-xl font-bold text-neutral-900">About Property</h3>
              <RichText content={property.description.join('\n\n')} />
            </div>

            {/* Key Features & Amenities */}
            {property.amenities.length > 0 && <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-neutral-200/60 space-y-6">
              <h3 className="text-xl font-bold text-neutral-900">Key Features & Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                    <CheckCircle2 className="w-4 h-4 text-[#111812] shrink-0"/> {amenity}
                  </div>
                ))}
              </div>
            </div>}

            {/* Interactive FAQ Accordion */}
            {property.faqs.length > 0 && <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-neutral-200/60 space-y-4">
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
            </div>}

            {/* Similar Properties Section */}
            <div className="pt-8 space-y-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Similar Properties</h3>
              <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 gap-6">
                {similarProperties.map((simProp) => (
                  <Link href={`/listings/${simProp.id}`} key={simProp.id} className="block">
                    <motion.div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-200/60 group flex flex-col h-full">
                      <div className="relative h-48 w-full overflow-hidden bg-neutral-100 shrink-0">
                        <Image alt={simProp.title} className="object-cover group-hover:scale-105 transition-transform duration-500" fill src={simProp.image} unoptimized />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-neutral-800 shadow-sm">
                          {simProp.type}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col justify-between flex-1">
                        <div>
                          <div className="text-lg font-black text-[#111812] mb-1">{formatPrice(simProp.price, simProp.currency)}</div>
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
          <div className="lg:col-span-4 min-w-0 space-y-6 lg:sticky lg:top-28">
            
            {/* Trakheesi Permit Badge */}
            {property.permitNumber && <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-neutral-900">Trakheesi Permit</h4>
                <p className="text-xs text-neutral-500 font-medium font-mono mt-1">{property.permitNumber}</p>
              </div>
            </div>}

            {/* Download Brochure Button */}
            <BrochureButton property={property} />

            {/* Agent Contact Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-6">
              <div className="flex min-w-0 items-start gap-4 pb-6 border-b border-neutral-100">
                <div className="w-14 h-14 rounded-full shrink-0 bg-[#111812] text-[#FFDE02] flex items-center justify-center font-bold">
                  {getBrokerInitials(broker.name)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{broker.name}</h4>
                  <p className="text-xs text-neutral-500 font-medium">{broker.role}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                {broker.brn && <p className="text-xs font-semibold text-neutral-500">BRN {broker.brn}</p>}
                {broker.phone && <a href={`tel:${broker.phone}`} className="font-semibold hover:underline">{broker.phone}</a>}
                {broker.email && <a href={`mailto:${broker.email}`} className="[overflow-wrap:anywhere] hover:underline">{broker.email}</a>}
                {broker.whatsapp && <a href={`https://wa.me/${broker.whatsapp.replace(/\D/g, '')}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#FFDE02] px-4 py-3 text-sm font-bold">Enquire on WhatsApp ↗</a>}
              </div>
            </div>

            {/* Mortgage Calculator Widget */}
            {!isRental && <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-200/60 space-y-6">
              <h4 className="font-bold text-sm text-neutral-900">Mortgage Calculator</h4>
              
              <div className="space-y-4 text-xs font-medium text-neutral-600">
                <div>
                  <div className="flex flex-wrap justify-between gap-2 mb-1">
                    <span>Property Price</span>
                    <strong className="text-neutral-900">{formatPrice(propertyPrice, property.currency)}</strong>
                  </div>
                  <input type="range" min="100000" max="10000000" step="50000" value={propertyPrice} onChange={(e) => setPropertyPrice(Number(e.target.value))} className="w-full accent-[#111812]"/>
                </div>

                <div>
                  <div className="flex flex-wrap justify-between gap-2 mb-1">
                    <span>Down Payment</span>
                    <strong className="text-neutral-900">{downPayment}% ({formatPrice(propertyPrice * downPayment / 100, property.currency)})</strong>
                  </div>
                  <input type="range" min="10" max="50" step="5" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full accent-[#111812]"/>
                </div>

                <div>
                  <div className="flex flex-wrap justify-between gap-2 mb-1">
                    <span>Loan Term</span>
                    <strong className="text-neutral-900">{loanTerm} Years</strong>
                  </div>
                  <input type="range" min="5" max="30" step="1" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} className="w-full accent-[#111812]"/>
                </div>
              </div>

              {/* Calculated Output */}
              <div className="bg-[#111812] text-white p-4 rounded-2xl text-center space-y-1">
                <span className="text-[11px] text-neutral-400 block uppercase tracking-wider">Estimated Monthly Payment</span>
                <div className="text-2xl font-black text-[#FFDE02]">{formatPrice(monthlyPayment, property.currency)} / Mo</div>
              </div>
            </div>}

          </div>

        </div>
      </div>

    </div>
  );
}
