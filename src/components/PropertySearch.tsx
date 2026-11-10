"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, LoaderCircle, Search, X } from "lucide-react";
import { listingSearchHref } from "@/lib/property-search";

export default function PropertySearch({ initialQuery = "", className = "" }: { initialQuery?: string; className?: string }) {
  const router = useRouter();
  const fieldId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [pending, startTransition] = useTransition();
  useEffect(() => setQuery(initialQuery), [initialQuery]);

  function search() {
    const text = query.trim().slice(0, 240);
    const href = listingSearchHref("/listings", 1, text, text ? "relevance" : "newest");
    startTransition(() => {
      if (window.location.pathname + window.location.search === href) router.refresh();
      else router.push(href);
    });
  }

  return (
    <section aria-label="Property search" className={`property-search glass-panel p-2 ${className}`}>
      <form role="search" aria-label="Search public properties" aria-busy={pending} onSubmit={(event) => { event.preventDefault(); search(); }} className="flex min-w-0 items-center gap-1 sm:gap-2">
        <label className="sr-only" htmlFor={fieldId}>Search by property, bedrooms, location or budget in AED</label>
        <Search aria-hidden="true" className="ml-2 h-5 w-5 shrink-0 text-emerald-900/60 sm:ml-3" />
        <input id={fieldId} type="search" name="search" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={240} placeholder="2BHK under 25k in Ajman" autoComplete="off" className="h-12 w-full min-w-0 bg-transparent px-2 text-base text-neutral-900 placeholder:text-sm placeholder:text-neutral-500 focus:outline-none sm:h-14 [&::-webkit-search-cancel-button]:hidden" />
        {query && <button type="button" aria-label="Clear search text" onClick={() => { setQuery(""); document.getElementById(fieldId)?.focus(); }} className="flex h-11 w-9 shrink-0 items-center justify-center rounded-xl text-neutral-500 hover:bg-white/60"><X className="h-4 w-4" /></button>}
        <button type="submit" disabled={pending} aria-label={pending ? "Searching properties" : "Search properties"} className="glass-action flex h-12 w-12 shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-semibold disabled:cursor-wait disabled:opacity-70 sm:h-14 sm:w-auto sm:px-5">
          {pending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ArrowUpRight className="h-5 w-5" />}<span className="hidden sm:inline">{pending ? "Searching" : "Search"}</span>
        </button>
        <span role="status" aria-live="polite" className="sr-only">{pending ? "Searching public listings…" : ""}</span>
      </form>
    </section>
  );
}
