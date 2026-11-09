import assert from "node:assert/strict";
import test from "node:test";
import { formatPrice } from "./currency.ts";

test("formats prices with a stable locale during server and browser rendering", () => {
  assert.equal(formatPrice(4495000, "USD"), "$4,495,000");
  assert.equal(formatPrice(4495000, "AED"), "AED 16,496,650");
  assert.equal(formatPrice(4495000, "EUR"), "€4,135,400");
});

test("formats upstream amounts in their original listing currency", () => {
  assert.equal(formatPrice(1000000, "USD", "AED"), "$272,480");
  assert.equal(formatPrice(1000000, "AED", "AED"), "AED 1,000,000");
  assert.equal(formatPrice(1000000, "EUR", "AED"), "€250,681");
});
