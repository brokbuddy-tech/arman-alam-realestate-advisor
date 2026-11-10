"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, Bed, Images, MapPin, Square } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import type { Property } from "@/data/properties";

export default function PropertyCard({ property, list = false }: { property: Property; list?: boolean }) {
  const { formatPrice } = useCurrency();
  const count = new Set(property.gallery).size;
  return (
    <Link href={`/listings/${property.id}`} aria-label={`View listing: ${property.title}`} className={`property-card glass-panel group flex min-w-0 overflow-hidden transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-lg ${list ? "flex-col sm:flex-row" : "h-full flex-col"}`}>
      <div className={`relative h-48 shrink-0 overflow-hidden bg-emerald-950/10 ${list ? "sm:h-auto sm:min-h-48 sm:w-64" : "w-full"}`}>
        <Image src={property.image} alt={property.title} fill unoptimized sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <span className="glass-badge absolute left-3 top-3 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold">{property.transactionType === "RENT" ? "For rent" : property.category === "For Buy" ? "For sale" : property.category}</span>
        {count > 0 && <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg border border-white/25 bg-black/45 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-md"><Images className="h-3 w-3" />{count}</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2"><p className="text-xl font-semibold tracking-tight text-[#163a2c]">{formatPrice(property.price, property.currency)}</p><ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-neutral-500" /></div>
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-900">{property.title}</h3>
        <p className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-neutral-600"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{property.address || property.location}</span></p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-emerald-950/10 pt-3 text-xs text-neutral-600">
          {property.beds !== null && <span className="inline-flex items-center gap-1.5"><Bed className="h-3.5 w-3.5" />{property.beds === 0 ? "Studio" : `${property.beds} bed`}</span>}
          {property.baths !== null && <span className="inline-flex items-center gap-1.5"><Bath className="h-3.5 w-3.5" />{property.baths} bath</span>}
          {property.sqft !== "—" && <span className="inline-flex items-center gap-1.5"><Square className="h-3.5 w-3.5" />{property.sqft}</span>}
        </div>
      </div>
    </Link>
  );
}
