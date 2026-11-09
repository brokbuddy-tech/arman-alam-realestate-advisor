"use client";

import Link from "next/link";

export default function FeedError({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#F6F6F4] px-6 pt-36 text-center text-neutral-900">
      <h1 className="text-2xl font-bold">Listings unavailable</h1>
      <p className="mt-3 text-sm text-neutral-600">We couldn’t load this broker’s public listings. Please try again later.</p>
      <button onClick={reset} className="mt-6 rounded-full bg-[#111812] px-5 py-3 text-sm font-bold text-white">Try again</button>
      <Link href="/listings" className="ml-6 text-sm font-semibold">Browse listings</Link>
    </main>
  );
}
