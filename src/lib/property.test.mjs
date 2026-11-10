import assert from "node:assert/strict";
import test from "node:test";
import { isRentalProperty } from "./property.ts";

test("recognizes all rental transactions even when the visible category is Commercial or Off-Plan", () => {
  for (const category of ["For Rent", "Commercial", "Off-Plan"]) assert.equal(isRentalProperty({ transactionType: "RENT", category }), true);
});

test("keeps mortgage calculations for sale listings and supports legacy rental categories", () => {
  assert.equal(isRentalProperty({ transactionType: "SALE", category: "Commercial" }), false);
  assert.equal(isRentalProperty({ category: "For Rent" }), true);
  assert.equal(isRentalProperty({ category: "For Buy" }), false);
});
