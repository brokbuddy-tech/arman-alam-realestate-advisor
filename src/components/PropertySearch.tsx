"use client";

import { useEffect, useId, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, LoaderCircle, Search, Sparkles } from "lucide-react";
import { listingSearchHref, parsePropertySearch } from "@/lib/property-search";

const suggestions = ["Rental villas under 20k", "2-bed apartments in Ajman", "Commercial spaces for rent"];
const steps = ["Understanding your requirements", "Matching the public inventory", "Comparing price, property and location"];

export default function PropertySearch({ initialQuery = "", className = "" }: { initialQuery?: string; className?: string }) {
  const router = useRouter();
  const fieldId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const intent = useMemo(() => parsePropertySearch(query), [query]);

  useEffect(() => {
    if (!pending) return;
    const timer = window.setInterval(() => setStep((value) => Math.min(value + 1, steps.length - 1)), 800);
    return () => window.clearInterval(timer);
  }, [pending]);

  function search(value: string) {
    const text = value.trim().slice(0, 240);
    setQuery(text);
    setStep(0);
    startTransition(() => router.push(listingSearchHref("/listings", 1, text, text ? "relevance" : "newest"), { scroll: false }));
  }

  return (
    <section aria-label="Smart property search" className={`property-search relative isolate min-w-0 overflow-hidden rounded-[1.75rem] border border-[#344235] bg-[#111c14] p-5 text-white shadow-[0_18px_60px_-32px_rgba(17,24,18,0.5)] sm:p-8 ${pending ? "property-search-pending" : ""} ${className}`}>
      <div aria-hidden="true" className="search-glow pointer-events-none absolute -top-24 -right-16 -z-10 h-64 w-64 rounded-full bg-[#FFDE02]/10 blur-3xl" />
      <div className="mb-5 flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#FFDE02]/25 bg-[#FFDE02]/10 text-[#FFDE02]"><Sparkles className="h-5 w-5" /></span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d7ce91] sm:text-xs">Smart property search</p>
          <h2 className="mt-1 text-xl font-semibold leading-snug tracking-tight sm:text-3xl">Your next place, in your own words.</h2>
        </div>
      </div>
      <form role="search" aria-label="Search public properties" aria-busy={pending} onSubmit={(event) => { event.preventDefault(); search(query); }} className="relative flex min-w-0 flex-col gap-2 rounded-2xl border border-white/15 bg-white p-2 sm:flex-row">
        <label className="sr-only" htmlFor={fieldId}>Describe your ideal property</label>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          <input id={fieldId} type="search" name="search" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={240} disabled={pending} placeholder="Try “rental villas under 20k”" autoComplete="off" className="h-12 w-full min-w-0 rounded-xl bg-white pr-3 pl-11 text-base text-neutral-900 placeholder:text-sm placeholder:text-neutral-500 focus:outline-none disabled:opacity-70 sm:h-14" />
        </div>
        <button type="submit" disabled={pending} className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFDE02] px-5 py-3 text-sm font-bold text-[#111812] transition-colors hover:bg-[#f2d300] disabled:cursor-wait sm:min-h-14">
          {pending ? <><LoaderCircle className="h-4 w-4 animate-spin" />Finding matches</> : <>Find my place <ArrowUpRight className="h-4 w-4" /></>}
        </button>
      </form>
      <div className="mt-4 min-w-0">
        {pending ? (
          <div role="status" aria-live="polite" className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[#e5dfb4]"><span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#FFDE02]" />{steps[step]}</div>
            <div aria-hidden="true" className="h-0.5 overflow-hidden rounded-full bg-white/10"><div className="search-scan h-full w-1/3 bg-gradient-to-r from-transparent via-[#FFDE02] to-transparent" /></div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] text-neutral-400">Try asking</span>
            {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => search(suggestion)} className="min-h-9 max-w-full rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left text-[11px] leading-snug text-neutral-300 transition-colors hover:border-[#FFDE02]/40 hover:text-white">{suggestion} <span aria-hidden="true">↗</span></button>)}
          </div>
        )}
      </div>
      {intent.labels.length > 0 && (
        <ul aria-label="Understood search filters" className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          {intent.labels.map((label) => <li key={label} className="inline-flex max-w-full items-start gap-1.5 rounded-lg bg-[#FFDE02]/10 px-2.5 py-1.5 text-[11px] text-[#eae4b8]"><Check className="mt-0.5 h-3 w-3 shrink-0 text-[#FFDE02]" /><span className="min-w-0 [overflow-wrap:anywhere]">{label}</span></li>)}
        </ul>
      )}
      <p className="mt-4 text-[11px] leading-relaxed text-neutral-400">Search by location, property, bedrooms or budget. Budgets are compared in AED.</p>
    </section>
  );
}
