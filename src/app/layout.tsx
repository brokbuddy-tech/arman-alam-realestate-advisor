import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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

export const metadata: Metadata = {
  title: "Arman Alam | Real Estate Broker",
  description: "Browse Arman Alam's real estate listings for sale, rent, off-plan, and commercial properties.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const brokBuddyData = await getBrokBuddyWebsiteData();

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
          </BrokBuddyProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
