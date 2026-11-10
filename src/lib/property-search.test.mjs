import assert from "node:assert/strict";
import test from "node:test";
import { parsePropertySearch, matchesPropertySearch, listingSearchHref } from "./property-search.ts";

const property = (overrides = {}) => ({
 id: "fixture", title: "Family villa in Ajman", type: "RESIDENTIAL", category: "For Rent", transactionType: "RENT", price: 19000, currency: "AED", beds: 3, address: "Al Rashidiya, Ajman", location: "Ajman", description: ["A family home with parking."], amenities: ["Pool"], status: "ACTIVE", ...overrides,
});

test("understands rental villas under 20k without treating the sentence as an exact keyword", () => {
 const intent = parsePropertySearch("rental villas under 20k");
 assert.equal(intent.transactionType, "RENT");assert.equal(intent.kind, "Villa");assert.equal(intent.propertyType, "RESIDENTIAL");assert.equal(intent.maxPrice, 20000);assert.deepEqual(intent.terms, []);
 assert.equal(matchesPropertySearch(property(), intent), true);
 assert.equal(matchesPropertySearch(property({price:21000}), intent), false);
 assert.equal(matchesPropertySearch(property({transactionType:"SALE"}), intent), false);
 assert.equal(matchesPropertySearch(property({title:"Family apartment in Ajman"}), intent), false);
});

test("understands bedrooms, property synonyms and location keywords across fields", () => {
 const intent = parsePropertySearch("Find me a two bedroom flat in Ajman");
 assert.equal(intent.bedrooms, 2);assert.equal(intent.kind, "Apartment");assert.deepEqual(intent.terms,["ajman"]);
 assert.equal(matchesPropertySearch(property({title:"Spacious 2BHK apartment",beds:2}),intent),true);
 assert.equal(matchesPropertySearch(property({title:"Spacious 2BHK apartment",beds:1}),intent),false);
 assert.equal(matchesPropertySearch(property({title:"Spacious apartment",beds:2,address:"Dubai",location:"Dubai"}),intent),false);
});

test("parses decimal and shared-unit budget ranges", () => {
 for(const [query,min,max] of [["villas between 20 and 40k",20000,40000],["homes from AED 20,000 to AED 40,000",20000,40000],["villas between 1.2m and 1.5m",1200000,1500000]]){
  const intent=parsePropertySearch(query);assert.equal(intent.minPrice,min);assert.equal(intent.maxPrice,max);
 }
 assert.equal(parsePropertySearch("apartments under AED 35,000").maxPrice,35000);
});

test("does not confuse minimum bedroom counts with minimum prices", () => {
 const intent=parsePropertySearch("at least 3 bedrooms under 50k");
 assert.equal(intent.bedrooms,3);assert.equal(intent.minimumBedrooms,true);assert.equal(intent.minPrice,undefined);assert.equal(intent.maxPrice,50000);
 assert.equal(matchesPropertySearch(property({beds:4}),intent),true);
 assert.equal(matchesPropertySearch(property({beds:2}),intent),false);
});

test("compares budgets in AED for listings priced in other supported currencies", () => {
 const intent=parsePropertySearch("villas below 20k");
 assert.equal(matchesPropertySearch(property({price:5000,currency:"USD"}),intent),true);
 assert.equal(matchesPropertySearch(property({price:6000,currency:"USD"}),intent),false);
 assert.equal(matchesPropertySearch(property({price:5000,currency:"EUR"}),intent),true);
});

test("recognizes studios, commercial rentals, readiness, and meaningful unknown keywords", () => {
 const studio=parsePropertySearch("studio for rent in Al Khor");assert.equal(studio.bedrooms,0);assert.equal(studio.kind,"Apartment");assert.deepEqual(studio.terms,["al","khor"]);
 const commercial=parsePropertySearch("commercial spaces for rent");assert.equal(commercial.propertyType,"COMMERCIAL");assert.equal(commercial.transactionType,"RENT");assert.deepEqual(commercial.terms,[]);
 assert.equal(parsePropertySearch("off-plan apartments for sale").readiness,"OFFPLAN");
 assert.equal(matchesPropertySearch(property(),parsePropertySearch("unicorn")),false);
});

test("search URLs preserve the sentence, pagination and sorting without accepting a redirect target", () => {
 const href=listingSearchHref("/listings",2,"rental villas under 20k","price-asc");const url=new URL(href,"https://example.test");
 assert.equal(url.pathname,"/listings");assert.equal(url.searchParams.get("search"),"rental villas under 20k");assert.equal(url.searchParams.get("page"),"2");assert.equal(url.searchParams.get("sort"),"price-asc");
 assert.equal(parsePropertySearch("x".repeat(400)).query.length,240);
 assert.deepEqual(parsePropertySearch("  ").terms,[]);
});

test("2BHK UNDER 25K enforces both bedrooms and an AED budget, including an honest zero-match result", () => {
 const intent = parsePropertySearch("2BHK UNDER 25K");
 assert.equal(intent.bedrooms, 2); assert.equal(intent.maxPrice, 25000); assert.deepEqual(intent.terms, []);
 const inventory = [property({beds:2, price:26000}), property({beds:1, price:24000})];
 assert.deepEqual(inventory.filter(item => matchesPropertySearch(item, intent)), []);
 assert.equal(matchesPropertySearch(property({beds:2, price:25000}), intent), true);
 assert.equal(matchesPropertySearch(property({beds:2, price:24000}), intent), true);
 assert.equal(matchesPropertySearch(property({beds:2, price:25001}), intent), false);
 assert.equal(matchesPropertySearch(property({beds:null, price:24000}), intent), false);
});

test("bare rent, BR abbreviations, and joined location numbers remain searchable", () => {
 const intent = parsePropertySearch("rent 2BR under AED 40,000 per year in Al Jurf 3");
 assert.equal(intent.transactionType, "RENT"); assert.equal(intent.bedrooms, 2); assert.equal(intent.maxPrice, 40000);
 assert.equal(matchesPropertySearch(property({title:"Spacious2BR flat in AlJurf3",beds:2,price:33000}), intent), true);
 assert.equal(matchesPropertySearch(property({title:"Spacious2BR flat in AlJurf3",beds:2,price:33000,transactionType:"SALE"}), intent), false);
 assert.equal(matchesPropertySearch(property({title:"Spacious2BR flat in AlJurf2",beds:2,price:33000}), intent), false);
});
