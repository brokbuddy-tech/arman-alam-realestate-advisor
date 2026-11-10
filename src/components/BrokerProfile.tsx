'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight, Bed, Bath, Square, Star } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { broker as fallbackBroker, getBrokerInitials } from '@/data/broker';
import RichText from '@/components/RichText';
import PropertySearch from '@/components/PropertySearch';
import { useBrokBuddyData } from '@/context/BrokBuddyContext';

export default function BrokerProfile() {
  const { formatPrice } = useCurrency();
  const { broker: scopedBroker, properties, isConfigured } = useBrokBuddyData();
  const broker = scopedBroker ?? fallbackBroker;
  const listingCount = broker.listingCount !== null && broker.listingCount >= properties.length ? broker.listingCount : null;
  const profileFacts = [
    broker.yearsOfExperience !== null ? { label: 'Years of experience', value: `${broker.yearsOfExperience}+` } : null,
    listingCount !== null ? { label: 'Listings', value: listingCount } : null,
    broker.dealCount !== null ? { label: 'Deals', value: broker.dealCount } : null,
  ].filter((fact) => fact !== null);


  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const fadeUpItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="w-full bg-[#111812] min-h-screen font-sans">
      <section id="profile" className="bg-[#111812] text-white pt-28 pb-12 px-4 sm:pt-36 sm:pb-20 sm:px-6 border-b border-white/10 scroll-mt-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-7xl mx-auto grid min-w-0 grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          <motion.div variants={fadeUpItem} className="lg:col-span-5 min-w-0 flex justify-center">
            <div className="w-full max-w-[17rem] sm:max-w-sm aspect-square rounded-3xl bg-gradient-to-br from-[#FFDE02] via-[#d4b800] to-[#746600] p-1 shadow-2xl">
              <div className="relative w-full h-full rounded-[1.35rem] bg-[#18221a] overflow-hidden flex flex-col items-center justify-center">
                {broker.photoUrl ? (
                  <Image
                    src={broker.photoUrl}
                    alt={`${broker.name} profile`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    unoptimized
                    className="object-cover"
                    priority
                  />
                ) : (
                  <>
                    <span className="text-8xl sm:text-9xl font-black tracking-tighter text-white" aria-label={`${broker.name} initials`}>
                      {getBrokerInitials(broker.name)}
                    </span>
                    <span className="mt-4 text-xs uppercase tracking-[0.3em] text-neutral-400">{broker.role}</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUpItem} className="lg:col-span-7 min-w-0 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex max-w-full items-start gap-2 self-center lg:self-start bg-white/5 border border-white/10 text-neutral-300 text-xs sm:text-sm leading-relaxed font-medium px-4 py-2 rounded-2xl mb-5">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#FFDE02]" />
              <span className="min-w-0 [overflow-wrap:anywhere]">{broker.role}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-white mb-5 [overflow-wrap:anywhere]">{broker.name}</h1>
            {broker.bio && (
              <RichText content={broker.bio} className="profile-bio rich-text-dark w-full max-w-2xl mb-6 text-sm sm:text-base" />
            )}

            <div className="mb-6 flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-3 text-sm text-neutral-300">
              {broker.brn && <span className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-[#FFDE02]">BRN {broker.brn}</span>}
              {broker.phone && <a className="inline-flex min-h-10 items-center hover:text-[#FFDE02]" href={`tel:${broker.phone}`}>{broker.phone}</a>}
              {broker.email && <a className="inline-flex min-h-10 max-w-full items-center [overflow-wrap:anywhere] hover:text-[#FFDE02]" href={`mailto:${broker.email}`}>{broker.email}</a>}
              {broker.whatsapp && <a className="inline-flex min-h-10 items-center hover:text-[#FFDE02]" href={`https://wa.me/${broker.whatsapp.replace(/\D/g, '')}`}>WhatsApp ↗</a>}
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
              <Link href="#listings" className="inline-flex items-center gap-2 rounded-full bg-[#FFDE02] px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-yellow-400">
                Browse listings <ArrowUpRight className="h-4 w-4" />
              </Link>
              {listingCount !== null && (
                <span className="text-sm text-neutral-400">{listingCount} {listingCount === 1 ? 'listing' : 'listings'}</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {(broker.specializations.length > 0 || broker.languages.length > 0 || profileFacts.length > 0) && (
        <section aria-label="Broker details" className="bg-[#F6F6F4] px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid min-w-0 grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr] gap-4">
            {broker.specializations.length > 0 && (
              <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">Specializations</h2>
                <ul className="space-y-2">
                  {broker.specializations.map((specialization) => (
                    <li key={specialization} className="text-sm leading-relaxed text-neutral-700 [overflow-wrap:anywhere]">{specialization}</li>
                  ))}
                </ul>
              </div>
            )}
            {broker.languages.length > 0 && (
              <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">Languages</h2>
                <ul className="flex flex-wrap gap-2">
                  {broker.languages.map((language) => (
                    <li key={language} className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-800">{language}</li>
                  ))}
                </ul>
              </div>
            )}
            {profileFacts.length > 0 && (
              <dl className="grid min-w-0 grid-cols-2 gap-x-5 gap-y-6 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 md:col-span-2 xl:col-span-1">
                {profileFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="min-h-9 max-w-32 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.08em] text-neutral-500">{fact.label}</dt>
                    <dd className="mt-2 text-3xl font-semibold leading-none tracking-tight text-neutral-900 tabular-nums">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}

      <section id="listings" className="bg-[#F6F6F4] text-neutral-900 py-12 sm:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <PropertySearch className="mb-10 sm:mb-12" />
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">Property listings</h2>
            <p className="text-sm text-neutral-500 mb-8">
              {isConfigured
                ? `Showing ${broker.name}’s public listings.`
                : 'Public listings are currently unavailable. Please check back later.'}
            </p>
          </motion.div>

          {properties.length === 0 ? (
            <p className="rounded-3xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
              There are no listings available right now. Please check back soon.
            </p>
          ) : (
            <motion.div
              initial={false}
              animate="visible"
              variants={staggerContainer}
              className="grid min-w-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {properties.slice(0, 6).map((property) => (
                <Link
                  href={`/listings/${property.id}`}
                  key={property.id}
                  className="block min-w-0 h-full"
                  aria-label={`View listing: ${property.title}`}
                >
                  <motion.div variants={fadeUpItem} className="bg-white rounded-[2rem] h-full overflow-hidden shadow-sm border border-neutral-200 group hover:shadow-md transition-shadow">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-neutral-800 shadow-sm">
                        {property.type}
                      </div>
                      <div className="absolute top-4 right-4 bg-[#FFDE02] px-3 py-1 rounded-full text-xs font-bold text-neutral-900 shadow-sm">
                        {property.category === 'For Buy' ? 'For Sale' : property.category}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="text-xl font-black text-[#111812] mb-1">{formatPrice(property.price, property.currency)}</div>
                      <h3 className="text-lg sm:text-xl font-bold leading-snug text-gray-900 mb-2 transition-colors">{property.title}</h3>
                      <p className="text-gray-500 mb-6 text-sm">{property.location}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-5 border-t border-gray-100 text-gray-600 text-xs">
                        <div className="flex items-center gap-2"><Bed size={16} /><span>{property.beds ?? '—'}</span></div>
                        <div className="flex items-center gap-2"><Bath size={16} /><span>{property.baths ?? '—'}</span></div>
                        <div className="flex items-center gap-2"><Square size={16} /><span>{property.sqft}</span></div>
                        <div className="flex items-center gap-1 text-yellow-500 font-medium">
                          {property.rating !== null && (
                            <><Star size={16} fill="currentColor" /><span>{property.rating}</span></>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
          {properties.length > 0 && (
            <div className="mt-10 text-center">
              <Link href="/listings" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#111812] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#29372a]">
                View all listings <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>


    </div>
  );
}
