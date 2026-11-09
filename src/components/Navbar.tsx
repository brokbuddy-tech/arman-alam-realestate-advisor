"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useCurrency, type Currency } from "@/context/CurrencyContext";
import { broker } from "@/data/broker";
import { useBrokBuddyData } from "@/context/BrokBuddyContext";

const navigation = [
  { label: "Profile", href: "/" },
  { label: "Listings", href: "/listings" },
  { label: "For Sale", href: "/sell" },
  { label: "For Rent", href: "/rent" },
  { label: "Off-Plan", href: "/off-plan" },
  { label: "Commercial", href: "/commercial" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { broker: scopedBroker } = useBrokBuddyData();
  const displayedBroker = scopedBroker ?? broker;
  const useSolidNavbar = isScrolled || pathname.startsWith("/listings");

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 ${useSolidNavbar ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-black/5" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-black ring-1 ring-[#FFDE02]/40">
            <Image
              src="/arman-property-advisor-logo.png"
              alt={`${displayedBroker.name} Property Advisor`}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <span className={`text-lg sm:text-2xl font-bold tracking-tight transition-colors ${useSolidNavbar ? 'text-black' : 'text-white'
            }`}>
            {displayedBroker.name}
          </span>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm font-semibold transition-colors flex items-center gap-1 ${useSolidNavbar ? "text-neutral-600 hover:text-black" : "text-white/80 hover:text-[#FFDE02]"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA & Currency */}
        <div className="flex items-center gap-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className={`bg-transparent outline-none text-sm font-bold cursor-pointer transition-colors ${
              useSolidNavbar ? "text-neutral-800 hover:text-black" : "text-white/90 hover:text-white"
            }`}
          >
            <option value="USD" className="text-black">USD</option>
            <option value="AED" className="text-black">AED</option>
            <option value="EUR" className="text-black">EUR</option>
          </select>
        </div>
      </div>
    </header>
  );
}
