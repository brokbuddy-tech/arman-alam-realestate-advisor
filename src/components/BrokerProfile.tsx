'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight, Bed, Bath, Square, Star } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { broker as fallbackBroker, getBrokerInitials } from '@/data/broker';
import { useBrokBuddyData } from '@/context/BrokBuddyContext';

export default function BrokerProfile() {
  const { formatPrice } = useCurrency();
  const { broker: scopedBroker, properties, isConfigured } = useBrokBuddyData();
  const broker = scopedBroker ?? fallbackBroker;
  const profileFacts = [
    broker.yearsOfExperience !== null ? { label: 'Years of experience', value: `${broker.yearsOfExperience}+` } : null,
    broker.listingCount !== null ? { label: 'Listings', value: broker.listingCount } : null,
    broker.dealCount !== null ? { label: 'Deals', value: broker.dealCount } : null,
  ].filter((fact) => fact !== null);
  const socialLinks = [
    { label: 'Instagram', href: broker.socialLinks.instagram },
    { label: 'Facebook', href: broker.socialLinks.facebook },
    { label: 'LinkedIn', href: broker.socialLinks.linkedin },
    { label: 'Twitter', href: broker.socialLinks.twitter },
  ].filter((social): social is { label: string; href: string } => Boolean(social.href));

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
      <section id="profile" className="bg-[#111812] text-white pt-32 pb-20 px-6 border-b border-white/10 scroll-mt-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          <motion.div variants={fadeUpItem} className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-br from-[#FFDE02] via-[#d4b800] to-[#746600] p-1 shadow-2xl">
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

          <motion.div variants={fadeUpItem} className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 w-max">
              <span className="w-2 h-2 rounded-full bg-[#FFDE02]" />
              {broker.role}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">{broker.name}</h1>
            {broker.bio && (
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-2xl mb-10">{broker.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Link href="#listings" className="inline-flex items-center gap-2 rounded-full bg-[#FFDE02] px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-yellow-400">
                Browse listings <ArrowUpRight className="h-4 w-4" />
              </Link>
              {broker.listingCount !== null && (
                <span className="text-sm text-neutral-400">{broker.listingCount} listings</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {(broker.specializations.length > 0 || broker.languages.length > 0 || profileFacts.length > 0) && (
        <section aria-label="Broker details" className="bg-[#F6F6F4] px-6 py-10 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {broker.specializations.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">Specializations</h2>
                <ul className="flex flex-wrap gap-2">
                  {broker.specializations.map((specialization) => (
                    <li key={specialization} className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-800">{specialization}</li>
                  ))}
                </ul>
              </div>
            )}
            {broker.languages.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">Languages</h2>
                <ul className="flex flex-wrap gap-2">
                  {broker.languages.map((language) => (
                    <li key={language} className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-800">{language}</li>
                  ))}
                </ul>
              </div>
            )}
            {profileFacts.length > 0 && (
              <dl className="rounded-2xl border border-neutral-200 bg-white p-5 flex flex-wrap items-start gap-x-8 gap-y-4">
                {profileFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs font-bold uppercase tracking-wider text-neutral-500">{fact.label}</dt>
                    <dd className="mt-1 text-xl font-bold text-neutral-900">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}

      <section id="listings" className="bg-[#F6F6F4] text-neutral-900 py-24 px-6 md:px-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">Property listings</h2>
            <p className="text-sm text-neutral-500 mb-12">
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {properties.map((property) => (
                <Link
                  href={`/listings/${property.id}`}
                  key={property.id}
                  className="block h-full"
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

                    <div className="p-6">
                      <div className="text-xl font-black text-[#111812] mb-1">{formatPrice(property.price, property.currency)}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 transition-colors">{property.title}</h3>
                      <p className="text-gray-500 mb-6 text-sm">{property.location}</p>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 text-gray-600 text-sm">
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
        </div>
      </section>

      <footer className="bg-[#111812] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-16">
          <section aria-label="Broker information" className="min-w-0 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <Image
                src="/arman-property-advisor-logo.png"
                alt={`${broker.name} Property Advisor`}
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-full object-cover"
              />
              <div>
                <p className="font-bold">{broker.name}</p>
                <p className="text-sm text-neutral-400 mt-1">{broker.role}</p>
              </div>
            </div>
            {broker.brn && <p className="text-sm text-neutral-400 mt-3">BRN: {broker.brn}</p>}
            <Link href="/listings" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFDE02] px-5 py-3 text-sm font-bold text-neutral-900 hover:bg-yellow-400">
              View all listings <ArrowUpRight className="h-4 w-4" />
            </Link>
          </section>

          {(broker.email || broker.phone || broker.whatsapp || broker.website) && (
            <section aria-label="Broker contact information" className="min-w-0">
              <h2 className="font-semibold text-white">Get in touch</h2>
              <div className="mt-4 flex flex-col items-start gap-3 text-sm text-neutral-400">
                {broker.email && <a href={`mailto:${broker.email}`} className="max-w-full break-words hover:text-white">{broker.email}</a>}
                {broker.phone && <a href={`tel:${broker.phone}`} className="hover:text-white">{broker.phone}</a>}
                {broker.whatsapp && <a href={`https://wa.me/${broker.whatsapp.replace(/\D/g, '')}`} className="hover:text-white">WhatsApp</a>}
                {broker.website && (
                  <a href={broker.website} target="_blank" rel="noreferrer" className="max-w-full break-words hover:text-white">
                    {broker.website}
                  </a>
                )}
              </div>
            </section>
          )}

          <nav aria-label="Listing categories">
            <h2 className="font-semibold text-white">Browse listings</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-neutral-400">
              <li className="col-span-2"><Link href="/listings" className="hover:text-white">All listings</Link></li>
              <li><Link href="/sell" className="hover:text-white">For sale</Link></li>
              <li><Link href="/rent" className="hover:text-white">For rent</Link></li>
              <li><Link href="/off-plan" className="hover:text-white">Off-plan</Link></li>
              <li><Link href="/commercial" className="hover:text-white">Commercial</Link></li>
            </ul>
          </nav>
        </div>
        <div className="max-w-7xl mx-auto mt-10 flex flex-col gap-4 border-t border-white/10 pt-5 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{broker.name} · {broker.role}</p>
          {socialLinks.length > 0 && (
            <ul aria-label="Social links" className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white">{social.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </footer>
    </div>
  );
}
