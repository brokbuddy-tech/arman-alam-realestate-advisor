import { getBrokBuddyListing } from "@/lib/brokbuddy/website-data";
import PropertyDetail from "./property-detail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getBrokBuddyListing(id);
  return <PropertyDetail property={property} />;
}
