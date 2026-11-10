import { getBrokBuddyListings, searchBrokBuddyListings, type ListingCategory } from "@/lib/brokbuddy/website-data";
import type { ListingSort } from "@/lib/property-search";
import ListingsView from "@/app/listings/listings-view";

export type ListingSearchParams = { page?: string | string[]; search?: string | string[]; sort?: string | string[] };
const sorts: ListingSort[] = ["relevance", "newest", "oldest", "price-asc", "price-desc"];

export default async function BrokerListingsPage({ searchParams, category }: {
  searchParams: Promise<ListingSearchParams>;
  category: ListingCategory;
}) {
  const params = await searchParams;
  const rawPage = params.page;
  const page = rawPage === undefined ? 1 : typeof rawPage === "string" && /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : NaN;
  const query = typeof params.search === "string" ? params.search.trim() : "";
  const sort = typeof params.sort === "string" && sorts.includes(params.sort as ListingSort) && (params.sort !== "relevance" || Boolean(query)) ? params.sort as ListingSort : query ? "relevance" : "newest";
  const data = query ? await searchBrokBuddyListings(query, page, category, sort) : await getBrokBuddyListings(page, category, sort);
  return <ListingsView data={data} activeCategory={category} searchQuery={query} sort={sort} />;
}
