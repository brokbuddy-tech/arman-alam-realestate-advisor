import assert from "node:assert/strict";
import test from "node:test";
import { broker, getBrokerInitials } from "./broker.ts";

test("uses a concise initials fallback for profile photos", () => {
  assert.equal(getBrokerInitials("Arman Alam"), "AA");
  assert.equal(getBrokerInitials("  Arman   Alam Khan "), "AA");
  assert.equal(getBrokerInitials("Arman"), "A");
  assert.equal(getBrokerInitials("   "), "");
});

test("leaves unconfigured public profile fields empty rather than fabricating values", () => {
  assert.equal(broker.photoUrl, null);
  assert.equal(broker.yearsOfExperience, null);
  assert.equal(broker.listingCount, null);
  assert.equal(broker.dealCount, null);
  assert.equal(broker.brn, null);
  assert.equal(broker.email, null);
  assert.equal(broker.phone, null);
});
