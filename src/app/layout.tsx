import type { Metadata } from "next";
import { cache } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

import { CurrencyProvider } from "@/context/CurrencyContext";
import { BrokBuddyProvider } from "@/context/BrokBuddyContext";
import { getBrokBuddyWebsiteData } from "@/lib/brokbuddy/website-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

const readWebsiteData = cache(getBrokBuddyWebsiteData);

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await readWebsiteData();
    if (data) {
      return {
        title: `${data.broker.name} | Real Estate Broker`,
        description: `Browse ${data.broker.name}'s real estate listings for sale, rent, off-plan, and commercial properties.`,
      };
    }
  } catch {
    // Unavailable upstream data must not leave identifying fallback metadata.
  }
  return {
    title: "Website unavailable",
    description: "This public website is currently unavailable.",
    robots: { index: false, follow: false },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const brokBuddyData = await readWebsiteData();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden w-full">
        <CurrencyProvider>
          <BrokBuddyProvider data={brokBuddyData}>
            {brokBuddyData !== null && <Navbar />}
            {brokBuddyData === null && (
              <p role="status" className="min-h-screen bg-[#F6F6F4] px-6 pt-36 text-center text-neutral-600">
                This broker’s public profile and listings are currently unavailable. Please check back later.
              </p>
            )}
            {brokBuddyData !== null && children}
            {brokBuddyData !== null && <SiteFooter />}
          </BrokBuddyProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
