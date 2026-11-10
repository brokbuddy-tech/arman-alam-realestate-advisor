import type { Property } from "../data/properties.ts";

export function isRentalProperty(property: Pick<Property, "transactionType" | "category">): boolean {
  if (property.transactionType) return property.transactionType === "RENT";
  return property.category === "For Rent";
}
