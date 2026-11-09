import { getBrokBuddyListings, type ListingCategory } from "@/lib/brokbuddy/website-data";
import ListingsView from "@/app/listings/listings-view";

export type ListingSearchParams = { page?: string | string[] };

export default async function BrokerListingsPage({ searchParams, category }: {
  searchParams: Promise<ListingSearchParams>;
  category: ListingCategory;
}) {
  const { page: rawPage } = await searchParams;
  const page = rawPage === undefined ? 1 : typeof rawPage === "string" && /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : NaN;
  const data = await getBrokBuddyListings(page, category);
  return <ListingsView data={data} activeCategory={category} />;
}
