"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { broker as fallbackBroker } from "@/data/broker";
import { useBrokBuddyData } from "@/context/BrokBuddyContext";

export default function SiteFooter() {
  const { broker: scopedBroker } = useBrokBuddyData();
  const broker = scopedBroker ?? fallbackBroker;
  const socialLinks = Object.entries(broker.socialLinks)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([label, href]) => ({ label: label[0].toUpperCase() + label.slice(1), href }));
  return (
      <footer className="glass-dark rounded-t-3xl text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-10">
          <section aria-label="Broker information" className="min-w-0 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <Image
                src="/arman-property-advisor-logo.png"
                alt={`${broker.name} Property Advisor`}
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="font-bold [overflow-wrap:anywhere]">{broker.name}</p>
                <p className="text-sm text-neutral-400 mt-1">Real Estate Advisor</p>
              </div>
            </div>
            {broker.brn && <p className="text-sm text-neutral-400 mt-3">BRN: {broker.brn}</p>}
            <Link href="/listings" className="glass-action mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
              View all listings <ArrowUpRight className="h-4 w-4" />
            </Link>
          </section>

          {(broker.email || broker.phone || broker.whatsapp || broker.website) && (
            <section aria-label="Broker contact information" className="min-w-0">
              <h2 className="font-semibold text-white">Get in touch</h2>
              <div className="mt-3 flex flex-col items-start gap-3 text-sm text-neutral-400">
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
            <ul className="mt-3 grid grid-cols-2 gap-3 text-sm text-neutral-400">
              <li className="col-span-2"><Link href="/listings" className="hover:text-white">All listings</Link></li>
              <li><Link href="/sell" className="hover:text-white">For sale</Link></li>
              <li><Link href="/rent" className="hover:text-white">For rent</Link></li>
              <li><Link href="/off-plan" className="hover:text-white">Off-plan</Link></li>
              <li><Link href="/commercial" className="hover:text-white">Commercial</Link></li>
              <li className="col-span-2"><Link href="/contact" className="hover:text-white">Contact us</Link></li>
            </ul>
          </nav>
        </div>
        <div className="max-w-7xl mx-auto mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{broker.name} · Real Estate Advisor</p>
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
  );
}
