"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Phone, Mail, ArrowUpRight } from "lucide-react";
import { useCurrency, type Currency } from "@/context/CurrencyContext";
import { broker as fallbackBroker } from "@/data/broker";
import ContactForm from "@/components/ContactForm";
import { useBrokBuddyData } from "@/context/BrokBuddyContext";

const navigation = [
  { label: "All Listings", href: "/listings" },
  { label: "For Sale", href: "/sell" },
  { label: "For Rent", href: "/rent" },
  { label: "Off-Plan", href: "/off-plan" },
  { label: "Commercial", href: "/commercial" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const { broker: scopedBroker } = useBrokBuddyData();
  const broker = scopedBroker ?? fallbackBroker;
  const dialog = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const contactDialog = useRef<HTMLDialogElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const modalOpen = isOpen || contactOpen;
  const listingId = pathname.match(/^\/listings\/([a-zA-Z0-9_-]+)$/)?.[1];
  const closeMenu = () => dialog.current?.close();
  const openContact = () => { closeMenu(); contactDialog.current?.showModal(); setContactOpen(true); };

  useEffect(() => {
    if (!modalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [modalOpen]);

  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-[100] text-white">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={`${broker.name} home`}>
          <Image src="/arman-property-advisor-logo.png" alt="" width={44} height={44} priority className="h-11 w-11 shrink-0 rounded-full ring-1 ring-[#FFDE02]/40" />
          <div className="min-w-0">
            <span className="block truncate text-base font-bold tracking-tight sm:text-xl">{broker.name}</span>
            <span className="mt-0.5 block truncate text-[11px] text-neutral-400">{broker.brn ? `BRN ${broker.brn}` : "Real Estate Advisor"}</span>
          </div>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-4 xl:flex">
          {navigation.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={`py-3 text-xs font-medium transition-colors hover:text-[#FFDE02] ${pathname === item.href ? "text-[#FFDE02]" : "text-neutral-300"}`}>{item.label}</Link>)}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          {(broker.phone || broker.email) && (
            <div className="hidden max-w-48 flex-col gap-1 text-right text-xs text-neutral-300 md:flex">
              {broker.phone && <a href={`tel:${broker.phone}`} className="hover:text-[#FFDE02]">{broker.phone}</a>}
              {broker.email && <a href={`mailto:${broker.email}`} className="truncate hover:text-[#FFDE02]">{broker.email}</a>}
            </div>
          )}
          <button type="button" onClick={openContact} aria-haspopup="dialog" aria-controls="contact-dialog" className="hidden min-h-11 items-center justify-center glass-action rounded-xl px-4 text-sm font-semibold sm:inline-flex">Contact us</button>
          <button type="button" onClick={() => { dialog.current?.showModal(); setIsOpen(true); }} aria-label="Open menu" aria-haspopup="dialog" aria-controls="site-menu" aria-expanded={isOpen} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/5 transition-colors hover:border-[#FFDE02]/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#FFDE02]">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      <dialog ref={dialog} id="site-menu" aria-labelledby="menu-title" onClose={() => setIsOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) closeMenu(); }} className="fixed top-[5rem] right-4 bottom-auto left-auto m-0 max-h-[calc(100dvh-6rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto glass-dialog rounded-2xl p-0 text-neutral-900 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm">
        <div className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="menu-title" className="text-lg font-bold">Explore</h2>
            <button type="button" onClick={closeMenu} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center glass-control rounded-xl"><X className="h-5 w-5" /></button>
          </div>
          <nav aria-label="Menu navigation" className="space-y-1">
            {navigation.map((item) => <Link key={item.href} href={item.href} onClick={closeMenu} aria-current={pathname === item.href ? "page" : undefined} className={`flex min-h-12 items-center justify-between rounded-2xl px-4 py-3 font-semibold transition-colors ${pathname === item.href ? "bg-[#111812] text-[#FFDE02]" : "hover:bg-white"}`}>{item.label}<ArrowUpRight className="h-4 w-4" /></Link>)}
            <button type="button" onClick={openContact} aria-haspopup="dialog" aria-controls="contact-dialog" className="mt-2 flex min-h-12 w-full items-center justify-between rounded-2xl bg-[#FFDE02] px-4 py-3 font-semibold text-[#111812]">Contact us <ArrowUpRight className="h-4 w-4" /></button>
          </nav>
          <fieldset className="mt-6 border-t border-neutral-200 pt-5">
            <legend className="float-left mb-3 w-full text-xs font-bold uppercase tracking-wider text-neutral-500">Display currency</legend>
            <div className="clear-both grid grid-cols-3 gap-2">
              {(["AED", "USD", "EUR"] as Currency[]).map((value) => <label key={value} className="cursor-pointer"><input className="peer sr-only" type="radio" name="site-currency" value={value} checked={currency === value} onChange={() => setCurrency(value)} /><span className="flex min-h-11 items-center justify-center rounded-xl glass-control text-sm font-bold peer-checked:border-[#111812] peer-checked:bg-[#111812] peer-checked:text-[#FFDE02] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#111812]">{value}</span></label>)}
            </div>
          </fieldset>
          <section aria-label="Broker contact" className="mt-6 space-y-3 border-t border-neutral-200 pt-5 text-sm">
            <p className="font-bold">{broker.name}</p>
            {broker.brn && <p className="text-xs text-neutral-500">Broker registration · BRN {broker.brn}</p>}
            {broker.phone && <a className="flex min-h-10 items-center gap-3" href={`tel:${broker.phone}`}><Phone className="h-4 w-4 shrink-0" /><span className="min-w-0 break-words">{broker.phone}</span></a>}
            {broker.email && <a className="flex min-h-10 items-center gap-3" href={`mailto:${broker.email}`}><Mail className="h-4 w-4 shrink-0" /><span className="min-w-0 [overflow-wrap:anywhere]">{broker.email}</span></a>}
            {broker.whatsapp && <a className="inline-flex min-h-11 items-center rounded-xl bg-[#FFDE02] px-4 font-bold" href={`https://wa.me/${broker.whatsapp.replace(/\D/g, "")}`}>Message on WhatsApp <ArrowUpRight className="ml-2 h-4 w-4" /></a>}
          </section>
        </div>
      </dialog>
      <dialog ref={contactDialog} id="contact-dialog" aria-labelledby="contact-title" onClose={() => setContactOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) contactDialog.current?.close(); }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto glass-dialog rounded-2xl p-0 text-neutral-900 shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-sm">
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0"><h2 id="contact-title" className="text-2xl font-semibold tracking-tight">Contact us</h2></div>
            <button type="button" onClick={() => contactDialog.current?.close()} aria-label="Close contact form" className="flex h-11 w-11 shrink-0 items-center justify-center glass-control rounded-xl"><X className="h-5 w-5" /></button>
          </div>
          <ContactForm key={pathname} listingId={listingId} />
        </div>
      </dialog>
    </header>
  );
}
