import BrokerListingsPage, { type ListingSearchParams } from "@/components/BrokerListingsPage";

export default function Page({ searchParams }: { searchParams: Promise<ListingSearchParams> }) {
  return <BrokerListingsPage searchParams={searchParams} category="For Rent" />;
}
