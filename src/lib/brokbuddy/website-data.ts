import "server-only";
import { normalizeRichText, normalizePlainText } from "../rich-text.ts";
import { parsePropertySearch, matchesPropertySearch, searchRelevance, type ListingSort } from "../property-search.ts";
import { convertPrice } from "../currency.ts";

import type { BrokerProfile } from "@/data/broker";
import type { Property } from "@/data/properties";
import type { Currency } from "@/lib/currency";
import { getBrokBuddyTemplateConfig, type BrokBuddyTemplateConfig } from "./config.ts";

export interface BrokBuddyWebsiteData {
  broker: BrokerProfile;
  properties: Property[];
}

export interface BrokBuddyListingsPage {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
}

export type ListingCategory = "All" | "For Buy" | "For Rent" | "Off-Plan" | "Commercial";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function numberValue(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map(normalizePlainText).filter(Boolean)
    : [];
}

function currencyValue(value: unknown): Currency {
  const currency = stringValue(value)?.toUpperCase();
  if (currency === "USD" || currency === "AED" || currency === "EUR") {
    return currency;
  }

  throw new Error("BrokBuddy returned a listing with an unsupported currency.");
}

function publicAssetUrl(value: unknown, apiBaseUrl: string): string | null {
  const assetPath = stringValue(value);
  if (!assetPath) {
    return null;
  }

  try {
    const apiOrigin = new URL(apiBaseUrl).origin;
    const assetUrl = new URL(assetPath, apiBaseUrl);
    if (
      assetUrl.origin !== apiOrigin ||
      assetUrl.username ||
      assetUrl.password ||
      !assetUrl.pathname.startsWith("/api/public/agency/")
    ) {
      return null;
    }

    return assetUrl.toString();
  } catch {
    return null;
  }
}

function mapProperty(value: unknown, brokerProfileSlug: string, apiBaseUrl: string): Property {
  if (!isRecord(value)) {
    throw new Error("BrokBuddy returned an invalid listing.");
  }

  const agent = isRecord(value.agent) ? value.agent : null;
  const broker = isRecord(value.broker) ? value.broker : null;
  const brokerProfile = broker && isRecord(broker.brokerProfile) ? broker.brokerProfile : null;
  if (agent?.slug !== brokerProfileSlug || brokerProfile?.slug !== brokerProfileSlug) {
    throw new Error("BrokBuddy returned a listing outside the configured broker scope.");
  }

  const id = stringValue(value.id);
  const title = stringValue(value.title) ? normalizePlainText(value.title as string) : null;
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id) || !title) {
    throw new Error("BrokBuddy returned an invalid listing.");
  }

  const images = Array.isArray(value.images) ? value.images : [];
  const gallery = [...new Set(images
    .map((image) => (isRecord(image) ? publicAssetUrl(image.url, apiBaseUrl) : null))
    .filter((image): image is string => image !== null))];
  const coordinates = isRecord(value.coordinates) ? value.coordinates : {};
  const latitude = numberValue(value.latitude ?? coordinates.lat ?? coordinates.latitude);
  const longitude = numberValue(value.longitude ?? coordinates.lng ?? coordinates.longitude);
  const propertyType = stringValue(value.propertyType) ?? stringValue(value.type) ?? "Property";
  const listingCategory = stringValue(value.category);
  const transactionType = stringValue(value.transactionType)?.toUpperCase();
  const readiness = stringValue(value.readiness)?.toUpperCase();
  const category = `${propertyType} ${listingCategory ?? ""}`.toLowerCase().includes("commercial")
    ? "Commercial"
    : readiness === "OFFPLAN"
      ? "Off-Plan"
      : transactionType === "RENT"
        ? "For Rent"
        : transactionType === "SALE"
          ? "For Buy"
          : "Other";
  const area = stringValue(value.community) ?? stringValue(value.area);
  const city = stringValue(value.city) ?? stringValue(value.emirate);
  const price = numberValue(value.price);
  const currency = currencyValue(value.currency);
  if (price === null) {
    throw new Error("BrokBuddy returned an invalid listing.");
  }

  const size = numberValue(value.builtUpArea);
  const description = normalizeRichText(stringValue(value.description));
  const amenities = stringArray(value.amenities);

  return {
    id,
    title,
    type: normalizePlainText(propertyType),
    price,
    address: normalizePlainText(stringValue(value.mapAddress) ?? stringValue(value.address) ?? [area, city].filter(Boolean).join(", ")),
    location: normalizePlainText([area, city].filter(Boolean).join(", ")),
    coordinates: { lat: latitude, lng: longitude },
    beds: numberValue(value.bedrooms),
    baths: numberValue(value.bathrooms),
    sqft: size === null ? "—" : size.toLocaleString("en-US"),
    rating: null,
    status: readiness === "OFFPLAN" ? "Off-Plan" : stringValue(value.status) ?? "Available",
    permitNumber: stringValue(value.trakheesiPermitNumber),
    category,
    transactionType: transactionType === "RENT" || transactionType === "SALE" ? transactionType : undefined,
    image: gallery[0] ?? "/arman-property-advisor-logo.png",
    gallery,
    description: description ? [description] : [],
    amenities,
    faqs: [],
    agent: {
      name: normalizePlainText(stringValue(agent.name) ?? "Real Estate Broker"),
      role: normalizePlainText(stringValue(agent.title) ?? "Real Estate Broker"),
      rating: null,
      reviews: null,
      image: publicAssetUrl(agent.avatar, apiBaseUrl) ?? "/arman-property-advisor-logo.png",
    },
    currency,
  };
}

class BrokerRequestError extends Error {
  status: number;

  constructor(status: number) {
    super(`BrokBuddy broker request failed (${status}).`);
    this.status = status;
  }
}

async function requestBrokerData(config: BrokBuddyTemplateConfig, path = "", query?: URLSearchParams): Promise<unknown> {
  const endpoint = new URL(
    `/api/public/broker-template/${encodeURIComponent(config.brokerProfileSlug)}${path}`,
    config.apiBaseUrl,
  );
  if (query) endpoint.search = query.toString();

  let response: Response;
  try {
    response = await fetch(endpoint, {
      headers: {
        accept: "application/json",
        "X-BrokBuddy-Broker-Code": config.brokerCode,
      },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Error("Unable to reach the BrokBuddy broker data endpoint.");
  }
  if (!response.ok) {
    throw new BrokerRequestError(response.status);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("BrokBuddy returned an invalid broker response.");
  }
}

function requireConfig(): BrokBuddyTemplateConfig {
  const config = getBrokBuddyTemplateConfig();
  if (!config) throw new Error("BrokBuddy broker feed is unavailable.");
  return config;
}

export async function getBrokBuddyWebsiteData(): Promise<BrokBuddyWebsiteData | null> {
  const config = getBrokBuddyTemplateConfig();
  if (!config) return null;
  let payload: unknown;
  try {
    payload = await requestBrokerData(config);
  } catch (error) {
    // Unpublished or revoked profiles render the neutral unavailable surface.
    // Do not display local fallback branding or retry a broader public feed.
    if (error instanceof BrokerRequestError && error.status === 404) return null;
    throw error;
  }
  if (!isRecord(payload) || !isRecord(payload.agent) || !Array.isArray(payload.activeListings)) {
    throw new Error("BrokBuddy returned an invalid broker response.");
  }

  const upstreamAgent = payload.agent;
  if (upstreamAgent.slug !== config.brokerProfileSlug) {
    throw new Error("BrokBuddy returned a profile outside the configured broker scope.");
  }

  const socialLinks = {
    instagram: stringValue(upstreamAgent.instagram),
    facebook: stringValue(upstreamAgent.facebook),
    linkedin: stringValue(upstreamAgent.linkedin),
    twitter: stringValue(upstreamAgent.twitter),
  };
  const brokerName = stringValue(upstreamAgent.name);
  if (!brokerName) {
    throw new Error("BrokBuddy returned an invalid broker profile.");
  }

  const listingCount = numberValue(upstreamAgent.totalListings);
  const profile: BrokerProfile = {
    name: normalizePlainText(brokerName),
    role: normalizePlainText(stringValue(upstreamAgent.title) ?? "Real Estate Broker"),
    bio: normalizeRichText(stringValue(upstreamAgent.bio)) || null,
    photoUrl: publicAssetUrl(upstreamAgent.avatar, config.apiBaseUrl),
    specializations: stringArray(upstreamAgent.specializations),
    languages: stringArray(upstreamAgent.languages),
    yearsOfExperience: numberValue(upstreamAgent.yearsExperience),
    listingCount,
    dealCount: numberValue(upstreamAgent.totalDeals),
    brn: stringValue(upstreamAgent.brn),
    website: stringValue(upstreamAgent.website),
    email: stringValue(upstreamAgent.email),
    phone: stringValue(upstreamAgent.phone),
    whatsapp: stringValue(upstreamAgent.whatsapp),
    socialLinks,
  };

  return {
    broker: profile,
    properties: payload.activeListings.map((listing) =>
      mapProperty(listing, config.brokerProfileSlug, config.apiBaseUrl),
    ),
  };
}


export async function getBrokBuddyListings(
  page = 1,
  category: ListingCategory = "All",
  sort: ListingSort = "newest",
): Promise<BrokBuddyListingsPage> {
  const config = requireConfig();
  if (!Number.isSafeInteger(page) || page < 1) throw new Error("Invalid listing page.");
  const query = new URLSearchParams({ page: String(page), limit: "12" });
  if (category === "For Buy") query.set("transactionType", "SALE");
  if (category === "For Rent") query.set("transactionType", "RENT");
  if (category === "Off-Plan") query.set("readiness", "OFFPLAN");
  if (category === "Commercial") query.set("propertyType", "COMMERCIAL");
  if (sort !== "newest" && sort !== "relevance") query.set("sort", sort);
  const payload = await requestBrokerData(config, "/listings", query);
  if (
    !isRecord(payload) || !Array.isArray(payload.listings) ||
    !Number.isSafeInteger(payload.total) || (payload.total as number) < 0 ||
    payload.page !== page || !Number.isSafeInteger(payload.totalPages) ||
    (payload.totalPages as number) < 1 || payload.listings.length > 12
  ) throw new Error("BrokBuddy returned an invalid listing page.");
  return {
    properties: payload.listings.map((listing) => mapProperty(listing, config.brokerProfileSlug, config.apiBaseUrl)),
    total: payload.total as number,
    page,
    totalPages: payload.totalPages as number,
  };
}

export async function searchBrokBuddyListings(
  text: string,
  page = 1,
  category: ListingCategory = "All",
  sort: ListingSort = "relevance",
): Promise<BrokBuddyListingsPage> {
  const config = requireConfig();
  if (!Number.isSafeInteger(page) || page < 1 || text.length > 240) throw new Error("Invalid property search.");
  const intent = parsePropertySearch(text);
  const query = new URLSearchParams({ limit: "100" });
  if (intent.transactionType) query.set("transactionType", intent.transactionType);
  if (intent.propertyType) query.set("propertyType", intent.propertyType);
  if (intent.bedrooms !== undefined && !intent.minimumBedrooms) query.set("bedrooms", String(intent.bedrooms));
  if (intent.readiness) query.set("readiness", intent.readiness);
  if (category === "For Buy") query.set("transactionType", "SALE");
  if (category === "For Rent") query.set("transactionType", "RENT");
  if (category === "Commercial") query.set("propertyType", "COMMERCIAL");
  if (category === "Off-Plan") query.set("readiness", "OFFPLAN");
  if (sort !== "relevance") query.set("sort", sort);

  async function readPage(number: number) {
    const params = new URLSearchParams(query);
    params.set("page", String(number));
    const payload = await requestBrokerData(config, "/listings", params);
    if (!isRecord(payload) || !Array.isArray(payload.listings) || payload.listings.length > 100 ||
      payload.page !== number || !Number.isSafeInteger(payload.total) || (payload.total as number) < 0 ||
      !Number.isSafeInteger(payload.totalPages) || (payload.totalPages as number) < 1 || (payload.totalPages as number) > 50
    ) throw new Error("BrokBuddy returned an invalid search response.");
    return {
      properties: payload.listings.map((listing) => mapProperty(listing, config.brokerProfileSlug, config.apiBaseUrl)),
      totalPages: payload.totalPages as number,
    };
  }

  // Match the complete public inventory, including listings beyond profile previews.
  // Price comparisons happen in AED so USD/EUR listing amounts remain comparable.
  const first = await readPage(1);
  const inventory = [...first.properties];
  for (let start = 2; start <= first.totalPages; start += 4) {
    const pages = await Promise.all(Array.from({ length: Math.min(4, first.totalPages - start + 1) }, (_, index) => readPage(start + index)));
    for (const result of pages) inventory.push(...result.properties);
  }
  const unique = [...new Map(inventory.map((property) => [property.id, property])).values()];
  const matches = unique.filter((property) => {
    if (category === "For Buy" && property.transactionType !== "SALE") return false;
    if (category === "For Rent" && property.transactionType !== "RENT") return false;
    if (category === "Commercial" && property.category !== "Commercial") return false;
    if (category === "Off-Plan" && property.status !== "Off-Plan") return false;
    return matchesPropertySearch(property, intent);
  });
  const price = (property: Property) => convertPrice(property.price, property.currency ?? "AED", "AED");
  if (sort === "price-asc") matches.sort((a, b) => price(a) - price(b));
  if (sort === "price-desc") matches.sort((a, b) => price(b) - price(a));
  if (sort === "relevance") matches.sort((a, b) => searchRelevance(b, intent) - searchRelevance(a, intent));
  return { properties: matches.slice((page - 1) * 12, page * 12), total: matches.length, page, totalPages: Math.max(1, Math.ceil(matches.length / 12)) };
}

export async function getBrokBuddyListing(id: string): Promise<Property> {
  const config = requireConfig();
  if (!/^[a-zA-Z0-9_-]{1,120}$/.test(id)) throw new Error("Listing unavailable.");
  const payload = await requestBrokerData(config, `/listings/${encodeURIComponent(id)}`);
  const property = mapProperty(payload, config.brokerProfileSlug, config.apiBaseUrl);
  if (property.id !== id) throw new Error("BrokBuddy returned an invalid listing.");
  return property;
}
