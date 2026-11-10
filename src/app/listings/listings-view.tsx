'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutGrid, List, MapPin, LoaderCircle, SearchX } from 'lucide-react';
import PropertySearch from '@/components/PropertySearch';
import PropertyCard from '@/components/PropertyCard';
import { listingSearchHref, type ListingSort } from '@/lib/property-search';
import type { BrokBuddyListingsPage, ListingCategory } from '@/lib/brokbuddy/website-data';

const categories: ListingCategory[] = ['All', 'For Buy', 'For Rent', 'Off-Plan', 'Commercial'];
const categoryRoutes: Record<ListingCategory, string> = { All: '/listings', 'For Buy': '/sell', 'For Rent': '/rent', 'Off-Plan': '/off-plan', Commercial: '/commercial' };

export default function ListingsView({ data, activeCategory, searchQuery = "", sort = "newest" }: { data: BrokBuddyListingsPage; activeCategory: ListingCategory; searchQuery?: string; sort?: ListingSort }) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pending, startTransition] = useTransition();
  const pageHref = (page: number, nextSort = sort) => listingSearchHref(categoryRoutes[activeCategory], page, searchQuery, nextSort);

  return (
    <main className="site-surface min-h-screen px-4 pb-12 pt-28 text-neutral-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{activeCategory === 'All' ? 'All listings' : activeCategory === 'For Buy' ? 'For sale' : activeCategory === 'For Rent' ? 'For rent' : activeCategory}</h1>
          <Link href="/map" className="glass-control inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium"><MapPin className="h-4 w-4" />Map</Link>
        </div>
        <PropertySearch initialQuery={searchQuery} className="mb-5" />
        <nav aria-label="Filter by category" className="mb-5 flex flex-wrap gap-2">
          {categories.map((category) => <Link key={category} href={listingSearchHref(categoryRoutes[category], 1, searchQuery, sort)} aria-current={activeCategory === category ? 'page' : undefined} className={`inline-flex min-h-10 items-center rounded-xl px-4 text-xs font-semibold transition-colors ${activeCategory === category ? 'glass-action' : 'glass-control'}`}>{category === 'For Buy' ? 'For sale' : category === 'All' ? 'All' : category}</Link>)}
        </nav>
        <section id="property-results" aria-label="Property results" aria-busy={pending} className="scroll-mt-24">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="flex items-center gap-2 text-sm text-neutral-600">{pending && <LoaderCircle className="h-4 w-4 animate-spin" />}<span><strong className="font-semibold text-neutral-900">{data.total}</strong> {data.total === 1 ? 'property' : 'properties'}</span></p>
            <div className="flex max-w-full flex-wrap items-center gap-2">
              <label className="sr-only" htmlFor="listing-sort">Sort properties</label>
              <select id="listing-sort" value={sort} disabled={pending} onChange={(event) => startTransition(() => router.push(pageHref(1, event.target.value as ListingSort), { scroll: false }))} className="glass-control h-11 max-w-full rounded-xl px-3 text-sm">
                {searchQuery && <option value="relevance">Best match</option>}
                <option value="newest">Newest</option><option value="oldest">Oldest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
              </select>
              <div aria-label="Listing view" className="glass-control flex rounded-xl p-1">
                <button type="button" aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')} className={`flex h-9 w-10 items-center justify-center rounded-lg ${viewMode === 'grid' ? 'bg-white/85 text-emerald-950 shadow-sm' : 'text-neutral-500'}`}><LayoutGrid className="h-4 w-4" /></button>
                <button type="button" aria-label="List view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')} className={`flex h-9 w-10 items-center justify-center rounded-lg ${viewMode === 'list' ? 'bg-white/85 text-emerald-950 shadow-sm' : 'text-neutral-500'}`}><List className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
          <div className={`${pending ? 'opacity-60' : ''} ${viewMode === 'grid' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
            {data.properties.map((property) => <PropertyCard key={property.id} property={property} list={viewMode === 'list'} />)}
          </div>
          {data.properties.length === 0 && <div role="status" className="glass-panel flex flex-col items-center px-5 py-12 text-center">
            <SearchX className="mb-4 h-7 w-7 text-emerald-900/50" /><h2 className="text-lg font-semibold">{searchQuery ? 'No matches' : 'No listings available'}</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-600">{searchQuery ? 'Try a higher budget or fewer requirements. Search budgets are in AED.' : 'Check back for new properties.'}</p>
            {searchQuery && <Link href="/listings" className="glass-action mt-5 rounded-xl px-5 py-3 text-sm font-semibold">View all listings</Link>}
          </div>}
          {data.totalPages > 1 && <nav aria-label="Listing pagination" className="mt-6 flex items-center justify-center gap-4 text-sm">
            {data.page > 1 && <Link href={pageHref(data.page - 1)} rel="prev" className="glass-control rounded-xl px-4 py-3">Previous</Link>}
            <span aria-current="page" className="text-neutral-600">{data.page} / {data.totalPages}</span>
            {data.page < data.totalPages && <Link href={pageHref(data.page + 1)} rel="next" className="glass-control rounded-xl px-4 py-3">Next</Link>}
          </nav>}
        </section>
      </div>
    </main>
  );
}
