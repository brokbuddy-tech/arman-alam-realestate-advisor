'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { broker as fallbackBroker, getBrokerInitials } from '@/data/broker';
import RichText from '@/components/RichText';
import PropertySearch from '@/components/PropertySearch';
import PropertyCard from '@/components/PropertyCard';
import { useBrokBuddyData } from '@/context/BrokBuddyContext';

export default function BrokerProfile() {
  const { broker: scopedBroker, properties } = useBrokBuddyData();
  const broker = scopedBroker ?? fallbackBroker;
  const listingCount = broker.listingCount !== null && broker.listingCount >= properties.length ? broker.listingCount : null;
  const profileFacts = [
    broker.yearsOfExperience !== null ? { label: 'Experience', value: `${broker.yearsOfExperience}+` } : null,
    listingCount !== null ? { label: 'Listings', value: listingCount } : null,
    broker.dealCount !== null ? { label: 'Deals', value: broker.dealCount } : null,
  ].filter((fact) => fact !== null);

  return (
    <main className="site-surface min-h-screen px-4 pb-10 pt-28 text-neutral-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section id="profile" className="glass-dark profile-hero grid min-w-0 grid-cols-1 items-center gap-6 overflow-hidden rounded-3xl p-5 text-white sm:p-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] lg:gap-10">
          <div className="mx-auto w-full max-w-64 sm:max-w-72 lg:max-w-none">
            <div className="relative aspect-[4/4.3] overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-lg">
              {broker.photoUrl ? <Image src={broker.photoUrl} alt={`${broker.name} profile`} fill sizes="(max-width: 1023px) 288px, 360px" unoptimized className="object-cover" priority /> : <span className="absolute inset-0 flex items-center justify-center text-7xl font-semibold">{getBrokerInitials(broker.name)}</span>}
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="mb-4 text-3xl font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-4xl">{broker.name}</h1>
            {broker.bio && <RichText content={broker.bio} className="profile-bio rich-text-dark mb-5" />}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-200">
              {broker.brn && <span className="font-semibold text-[#FFDE02]">BRN {broker.brn}</span>}
              {broker.phone && <a className="inline-flex min-h-10 items-center gap-2 hover:text-[#FFDE02]" href={`tel:${broker.phone}`}><Phone className="h-3.5 w-3.5" />{broker.phone}</a>}
              {broker.email && <a className="inline-flex min-h-10 max-w-full items-center gap-2 [overflow-wrap:anywhere] hover:text-[#FFDE02]" href={`mailto:${broker.email}`}><Mail className="h-3.5 w-3.5 shrink-0" />{broker.email}</a>}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href="#listings" className="glass-action inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold">Browse listings <ArrowUpRight className="h-4 w-4" /></Link>
              {broker.whatsapp && <a className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-sm font-medium backdrop-blur-md hover:bg-white/20" href={`https://wa.me/${broker.whatsapp.replace(/\D/g, '')}`}>WhatsApp <ArrowUpRight className="h-4 w-4" /></a>}
            </div>
          </div>
        </section>

        {(broker.specializations.length > 0 || broker.languages.length > 0 || profileFacts.length > 0) && <section aria-label="Broker details" className="mt-4 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr]">
          {broker.specializations.length > 0 && <div className="glass-panel min-w-0 p-4 sm:p-5"><h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Specializations</h2><ul className="space-y-2">{broker.specializations.map((specialization) => <li key={specialization} className="text-sm leading-relaxed text-neutral-700 [overflow-wrap:anywhere]">{specialization}</li>)}</ul></div>}
          {broker.languages.length > 0 && <div className="glass-panel min-w-0 p-4 sm:p-5"><h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Languages</h2><ul className="flex flex-wrap gap-x-4 gap-y-2">{broker.languages.map((language) => <li key={language} className="text-sm text-neutral-700">{language}</li>)}</ul></div>}
          {profileFacts.length > 0 && <dl className="glass-panel grid min-w-0 grid-cols-3 gap-3 p-4 sm:p-5 md:col-span-2 xl:col-span-1">{profileFacts.map((fact) => <div key={fact.label} className="min-w-0"><dt className="text-[11px] font-medium text-neutral-500">{fact.label}</dt><dd className="mt-3 text-2xl font-semibold leading-none tracking-tight text-[#163a2c] tabular-nums">{fact.value}</dd></div>)}</dl>}
        </section>}

        <section id="listings" className="mt-8 scroll-mt-24 sm:mt-10">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold tracking-tight">Property listings</h2><Link href="/listings" className="inline-flex min-h-10 items-center gap-1 text-sm font-medium text-emerald-950">View all <ArrowUpRight className="h-4 w-4" /></Link></div>
          <PropertySearch className="mb-5" />
          {properties.length === 0 ? <p className="glass-panel p-8 text-center text-sm text-neutral-600">No listings available right now.</p> : <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{properties.slice(0, 6).map((property) => <PropertyCard key={property.id} property={property} />)}</div>}
          {properties.length > 0 && <div className="mt-6 text-center"><Link href="/listings" className="glass-control inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold">View all listings <ArrowUpRight className="h-4 w-4" /></Link></div>}
        </section>
      </div>
    </main>
  );
}
