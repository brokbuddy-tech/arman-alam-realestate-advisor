import type { Property } from "../data/properties.ts";
import { convertPrice } from "./currency.ts";

export type ListingSort = "relevance" | "newest" | "oldest" | "price-asc" | "price-desc";
export interface SearchIntent {
  query: string;
  transactionType?: "SALE" | "RENT";
  propertyType?: "RESIDENTIAL" | "COMMERCIAL";
  kind?: string;
  bedrooms?: number;
  minimumBedrooms?: boolean;
  minPrice?: number;
  maxPrice?: number;
  readiness?: "READY" | "OFFPLAN";
  terms: string[];
  labels: string[];
}

const kinds = [
  { name: "Apartment", pattern: /\b(?:apartments?|flats?|apts?)\b/i, scope: "RESIDENTIAL" },
  { name: "Villa", pattern: /\bvillas?\b/i, scope: "RESIDENTIAL" },
  { name: "Townhouse", pattern: /\btown[ -]?houses?\b/i, scope: "RESIDENTIAL" },
  { name: "Penthouse", pattern: /\bpenthouses?\b/i, scope: "RESIDENTIAL" },
  { name: "Office", pattern: /\boffices?\b/i, scope: "COMMERCIAL" },
  { name: "Shop", pattern: /\b(?:shops?|retail)\b/i, scope: "COMMERCIAL" },
  { name: "Warehouse", pattern: /\bwarehouses?\b/i, scope: "COMMERCIAL" },
] as const;
const amountPattern = "(?:aed\\s*)?([0-9]+(?:[,.][0-9]+)*)(?:\\s*(thousand|million|k|m))?(?:\\s*aed)?";
const numberWords: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
const amount = (number: string, suffix?: string) => Number(number.replace(/,/g, "")) * (/^(m|million)$/i.test(suffix ?? "") ? 1_000_000 : /^(k|thousand)$/i.test(suffix ?? "") ? 1_000 : 1);
const tokens = (value: string) => value
  .replace(/([a-z])([A-Z])/g, "$1 $2")
  .replace(/(\p{L})(\p{N})|(\p{N})(\p{L})/gu, "$1$3 $2$4")
  .toLowerCase().normalize("NFKD").replace(/\p{Diacritic}/gu, "")
  .match(/[\p{L}\p{N}]+/gu) ?? [];
const moneyLabel = (value: number) => `AED ${value.toLocaleString("en-US")}`;

export function parsePropertySearch(query: string): SearchIntent {
  const intent: SearchIntent = { query: query.trim().replace(/\s+/g, " ").slice(0, 240), terms: [], labels: [] };
  let remaining = intent.query.toLowerCase();
  const remove = (pattern: RegExp, consume: (...args: string[]) => void) => {
    remaining = remaining.replace(pattern, (...args) => { consume(...args); return " "; });
  };
  remove(/\b(at least\s+)?(\d+|one|two|three|four|five|six)\s*(\+)?[ -]?(?:bedrooms?|beds?|bhk|br)\b/i, (_full, minimum, value, plus) => {
    intent.bedrooms = numberWords[value] ?? Number(value); intent.minimumBedrooms = Boolean(minimum || plus);
  });
  remove(new RegExp(`\\b(?:between|from)\\s+${amountPattern}\\s*(?:and|to|-)\\s*${amountPattern}`, "i"), (_full, first, firstUnit, second, secondUnit) => {
    const a = amount(first, firstUnit || secondUnit); const b = amount(second, secondUnit || firstUnit);
    intent.minPrice = Math.min(a, b); intent.maxPrice = Math.max(a, b);
  });
  remove(new RegExp(`(?:\\b(?:under|below|less than|up to|upto|max(?:imum)?(?: budget)?|budget(?: of)?)\\s*[:=]?\\s*|<=?\\s*)${amountPattern}`, "i"), (_full, value, unit) => { intent.maxPrice = amount(value, unit); });
  remove(new RegExp(`(?:\\b(?:over|above|more than|at least|min(?:imum)?)\\s*[:=]?\\s*|>=?\\s*)${amountPattern}`, "i"), (_full, value, unit) => { intent.minPrice = amount(value, unit); });

  remove(/\bstudios?\b/i, () => { intent.bedrooms = 0; intent.kind = "Apartment"; intent.propertyType = "RESIDENTIAL"; });
  remove(/\b(?:for[ -]+rent|to rent|rent|rentals?|renting|lease|leasing)\b/i, () => { intent.transactionType = "RENT"; });
  remove(/\b(?:for[ -]+sale|sales?|buy|buying|purchase)\b/i, () => { intent.transactionType = "SALE"; });
  remove(/\boff[ -]?plan\b/i, () => { intent.readiness = "OFFPLAN"; });
  remove(/\b(?:ready(?: to move)?|move[ -]in ready)\b/i, () => { intent.readiness = "READY"; });
  for (const kind of kinds) {
    if (!intent.kind && kind.pattern.test(remaining)) {
      remove(kind.pattern, () => { intent.kind = kind.name; intent.propertyType = kind.scope; });
    }
  }
  remove(/\bcommercial(?: spaces?)?\b/i, () => { intent.propertyType = "COMMERCIAL"; });
  remove(/\bresidential\b/i, () => { intent.propertyType = "RESIDENTIAL"; });
  remaining = remaining.replace(/\b(?:show|me|find|looking|for|a|an|the|i|want|need|please|properties|property|homes?|houses?|something|with|and|in|around|near|at|of|to|my|some|aed|per|year|yearly|annual|annually)\b/g, " ");
  intent.terms = [...new Set(tokens(remaining))];
  if (intent.transactionType) intent.labels.push(intent.transactionType === "RENT" ? "For rent" : "For sale");
  if (intent.kind) intent.labels.push(intent.kind);
  else if (intent.propertyType) intent.labels.push(intent.propertyType === "COMMERCIAL" ? "Commercial" : "Residential");
  if (intent.bedrooms !== undefined) intent.labels.push(intent.bedrooms === 0 ? "Studio" : `${intent.bedrooms}${intent.minimumBedrooms ? "+" : ""} bedrooms`);
  if (intent.minPrice !== undefined) intent.labels.push(`From ${moneyLabel(intent.minPrice)}`);
  if (intent.maxPrice !== undefined) intent.labels.push(`Up to ${moneyLabel(intent.maxPrice)}`);
  if (intent.readiness) intent.labels.push(intent.readiness === "OFFPLAN" ? "Off-plan" : "Ready to move");
  if (intent.terms.length) intent.labels.push(intent.terms.join(" "));
  return intent;
}

export function matchesPropertySearch(property: Property, intent: SearchIntent): boolean {
  if (intent.transactionType && property.transactionType !== intent.transactionType) return false;
  const isCommercial = /commercial/i.test(`${property.type} ${property.category}`);
  if (intent.propertyType === "COMMERCIAL" && !isCommercial) return false;
  if (intent.propertyType === "RESIDENTIAL" && isCommercial) return false;
  if (intent.bedrooms !== undefined && (property.beds === null || (intent.minimumBedrooms ? property.beds < intent.bedrooms : property.beds !== intent.bedrooms))) return false;
  const price = convertPrice(property.price, property.currency ?? "AED", "AED");
  if (intent.minPrice !== undefined && price < intent.minPrice) return false;
  if (intent.maxPrice !== undefined && price > intent.maxPrice) return false;
  const offPlan = property.status === "Off-Plan" || property.category === "Off-Plan";
  if (intent.readiness && (intent.readiness === "OFFPLAN") !== offPlan) return false;
  const primary = `${property.type} ${property.title}`;
  const text = `${primary} ${property.address} ${property.location} ${property.description.join(" ")} ${property.amenities.join(" ")}`;
  if (intent.kind) {
    const kind = kinds.find((item) => item.name === intent.kind);
    if (kind && !kind.pattern.test(primary)) {
      if (kinds.some((other) => other.pattern.test(primary)) || !kind.pattern.test(text)) return false;
    }
  }
  const words = new Set(tokens(text));
  return intent.terms.every((term) => words.has(term));
}

export function searchRelevance(property: Property, intent: SearchIntent): number {
  const title = new Set(tokens(property.title));
  const address = new Set(tokens(`${property.location} ${property.address}`));
  return intent.terms.reduce((score, term) => score + (title.has(term) ? 3 : address.has(term) ? 2 : 1), 0);
}

export function listingSearchHref(path: string, page: number, query = "", sort: ListingSort = "newest"): string {
  const params = new URLSearchParams();
  if (query.trim()) params.set("search", query.trim().slice(0, 240));
  if (sort !== (query.trim() ? "relevance" : "newest")) params.set("sort", sort);
  params.set("page", String(page));
  return `${path}?${params.toString()}`;
}
