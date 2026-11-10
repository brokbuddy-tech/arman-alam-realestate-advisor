import { Search, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <main role="status" aria-live="polite" aria-busy="true" className="min-h-screen bg-[#F6F6F4] px-4 pt-28 pb-12 sm:px-6 sm:pt-36">
      <div className="property-search-pending relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#344235] bg-[#111c14] p-6 text-white shadow-xl sm:p-10">
        <div aria-hidden="true" className="search-glow pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[#FFDE02]/10 blur-3xl" />
        <span className="relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FFDE02]/25 bg-[#FFDE02]/10 text-[#FFDE02]"><Sparkles className="h-6 w-6" /></span>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d7ce91]">Smart property search</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Finding your next place…</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">Matching property, budget and location to public listings.</p>
        <div aria-hidden="true" className="my-7 h-0.5 overflow-hidden rounded-full bg-white/10"><div className="search-scan h-full w-1/3 bg-gradient-to-r from-transparent via-[#FFDE02] to-transparent" /></div>
        <div className="space-y-4 text-xs text-neutral-300">
          {["Property and listing type", "Price and bedrooms", "Location and details"].map((label, index) => <div key={label} className="flex items-center gap-3"><Search className="h-3.5 w-3.5 shrink-0 animate-pulse text-[#FFDE02]" style={{ animationDelay: `${index * 250}ms` }} />{label}</div>)}
        </div>
      </div>
    </main>
  );
}
