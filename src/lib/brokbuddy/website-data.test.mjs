import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { getBrokBuddyWebsiteData, getBrokBuddyListings, getBrokBuddyListing } from "./website-data.ts";

// Synthetic fixtures only. Never read an operator's .env file in tests.
const code = "0123456789abcdef0123456789abcdef";
const slug = "broker-profile-test";
const keys = ["BROKBUDDY_API_BASE_URL", "BROKBUDDY_BROKER_CODE", "BROKBUDDY_BROKER_PROFILE_SLUG"];
const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
const originalFetch = globalThis.fetch;
const asset = "/api/public/agency/test-workspace/images/image-1/view?variant=compressed&v=2";
const avatar = "/api/public/agency/test-workspace/profile-assets/broker-1/avatar/view?variant=medium&v=2";

function setup() {
  process.env.BROKBUDDY_API_BASE_URL = "https://api.brokbuddy.test";
  process.env.BROKBUDDY_BROKER_CODE = code;
  process.env.BROKBUDDY_BROKER_PROFILE_SLUG = slug;
}
function listing(overrides = {}) {
  return {
    id: "listing-1", title: "Example listing", price: 1000000, currency: "AED",
    propertyType: "APARTMENT", category: "Residential", transactionType: "SALE",
    readiness: "READY", status: "ACTIVE", bedrooms: 2, bathrooms: 2,
    builtUpArea: 1200, community: "Dubai Marina", city: "Dubai",
    latitude: 25.08, longitude: 55.14, mapAddress: "Example building",
    description: "Public description", amenities: ["Pool"], trakheesiPermitNumber: "test-permit",
    images: [{ url: asset, gcsPath: "internal-must-not-pass-through" }],
    agent: { slug, name: "Example Broker", title: "Broker", avatar },
    broker: { brokerProfile: { slug } },
    ...overrides,
  };
}
function profile(overrides = {}) {
  return {
    agent: { slug, name: "Example Broker", title: "Broker", bio: "Public bio",
      avatar, email: "broker@example.test", totalListings: 24, totalDeals: 3,
      specializations: ["Residential"], languages: ["English"], ...overrides },
    stats: { activeListings: 1, soldListings: 0, rentedListings: 0 },
    activeListings: [listing()], soldListings: [], rentedListings: [],
  };
}
function respond(payload) { globalThis.fetch = async () => new Response(JSON.stringify(payload)); }

test.beforeEach(setup);
test.afterEach(() => { globalThis.fetch = originalFetch; });
test.after(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});

test("missing configuration makes no request and does not return sample listings", async () => {
  delete process.env.BROKBUDDY_BROKER_PROFILE_SLUG;
  globalThis.fetch = async () => assert.fail("Unexpected request");
  assert.equal(await getBrokBuddyWebsiteData(), null);
  await assert.rejects(getBrokBuddyListings(), /unavailable/);
  await assert.rejects(getBrokBuddyListing("listing-1"), /unavailable/);
});

test("profile, pagination, and direct detail all use the same broker and header without URL credentials", async () => {
  const calls = [];
  globalThis.fetch = async (input, options) => {
    const url = new URL(input);
    calls.push({ url, options });
    const payload = url.pathname.endsWith("/listings/listing-1") ? listing()
      : url.pathname.endsWith("/listings") ? { listings: [listing()], total: 24, page: 2, totalPages: 2 }
      : profile();
    return new Response(JSON.stringify(payload));
  };
  const website = await getBrokBuddyWebsiteData();
  const page = await getBrokBuddyListings(2);
  const detail = await getBrokBuddyListing("listing-1");
  assert.deepEqual(calls.map(({ url }) => url.pathname), [
    `/api/public/broker-template/${slug}`,
    `/api/public/broker-template/${slug}/listings`,
    `/api/public/broker-template/${slug}/listings/listing-1`,
  ]);
  assert.equal(calls[1].url.search, "?page=2&limit=12");
  for (const { url, options } of calls) {
    assert.equal(url.href.includes(code), false);
    assert.equal(url.searchParams.has("hex"), false);
    assert.equal(options.headers["X-BrokBuddy-Broker-Code"] === code, true);
    assert.equal(options.cache, "no-store");
    assert.equal(options.redirect, "error");
    assert.ok(options.signal instanceof AbortSignal);
  }
  assert.equal(website.broker.name, "Example Broker");
  assert.equal(website.broker.photoUrl, `https://api.brokbuddy.test${avatar}`);
  assert.equal(detail.image, `https://api.brokbuddy.test${asset}`);
  assert.equal(detail.agent.image, website.broker.photoUrl);
  assert.deepEqual(detail.amenities, ["Pool"]);
  assert.equal(detail.permitNumber, "test-permit");
  assert.equal(detail.category, "For Buy");
  assert.equal(page.page, 2);
  assert.equal(page.totalPages, 2);
  assert.equal(page.total, 24);
  assert.equal(page.properties[0].id, detail.id);
  const serialized = JSON.stringify({ website, page, detail });
  assert.equal(serialized.includes(code), false);
  assert.doesNotMatch(serialized, /gcsPath|internal-must-not-pass-through|brokerCode/);
});

test("category filters and page number remain on the broker-scoped endpoint", async () => {
  const filters = { "For Buy": ["transactionType", "SALE"], "For Rent": ["transactionType", "RENT"], "Off-Plan": ["readiness", "OFFPLAN"], Commercial: ["category", "Commercial"] };
  for (const [category, [key, value]] of Object.entries(filters)) {
    globalThis.fetch = async (input) => {
      const url = new URL(input);
      assert.equal(url.pathname, `/api/public/broker-template/${slug}/listings`);
      assert.equal(url.searchParams.get(key), value);
      assert.equal(url.searchParams.get("page"), "3");
      assert.equal(url.searchParams.get("limit"), "12");
      return new Response(JSON.stringify({ listings: [], total: 25, page: 3, totalPages: 3 }));
    };
    await getBrokBuddyListings(3, category);
  }
});

test("a valid empty page is distinct from a failed request", async () => {
  respond({ listings: [], total: 0, page: 1, totalPages: 1 });
  assert.deepEqual(await getBrokBuddyListings(), { properties: [], total: 0, page: 1, totalPages: 1 });
});

test("invalid, revoked, rate-limited, and failed responses fail closed on every route", async () => {
  for (const status of [401, 403, 404, 429, 500]) {
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return new Response("untrusted body must not be shown", { status });
    };
    for (const load of [getBrokBuddyWebsiteData, getBrokBuddyListings, () => getBrokBuddyListing("listing-1")]) {
      await assert.rejects(load(), (error) => {
        assert.equal(error.message, `BrokBuddy broker request failed (${status}).`);
        return true;
      });
    }
    assert.equal(calls, 3); // No fallback endpoint or retry with wider scope.
  }
});

test("network and JSON errors never echo upstream messages or credentials", async () => {
  for (const failure of ["network", "json"]) {
    globalThis.fetch = async () => {
      if (failure === "network") throw new Error(`upstream headers: ${code}`);
      return { ok: true, json: async () => { throw new Error(`bad payload: ${code}`); } };
    };
    for (const load of [getBrokBuddyWebsiteData, getBrokBuddyListings, () => getBrokBuddyListing("listing-1")]) {
      await assert.rejects(load(), (error) => {
        assert.equal(error.message.includes(code), false);
        assert.doesNotMatch(error.message, /headers|bad payload/);
        return true;
      });
    }
  }
});

test("rejects mismatched profiles and listings including direct detail", async () => {
  respond(profile({ slug: "other-broker" }));
  await assert.rejects(getBrokBuddyWebsiteData(), /outside the configured broker scope/);
  for (const bad of [listing({ agent: { slug: "other-broker" } }), listing({ broker: { brokerProfile: { slug: "other-broker" } } })]) {
    respond({ ...profile(), activeListings: [bad] });
    await assert.rejects(getBrokBuddyWebsiteData(), /outside the configured broker scope/);
    respond({ listings: [bad], total: 1, page: 1, totalPages: 1 });
    await assert.rejects(getBrokBuddyListings(), /outside the configured broker scope/);
    respond(bad);
    await assert.rejects(getBrokBuddyListing("listing-1"), /outside the configured broker scope/);
  }
  respond(listing({ id: "different-id" }));
  await assert.rejects(getBrokBuddyListing("listing-1"), /invalid listing/);
});

test("rejects malformed successful payloads instead of showing an empty feed", async () => {
  for (const payload of [{}, { error: "unavailable" }, { agent: {}, activeListings: [] }]) {
    respond(payload);
    await assert.rejects(getBrokBuddyWebsiteData());
  }
  for (const payload of [{}, { listings: [], total: "0", page: 1, totalPages: 1 }, { listings: [], total: 0, page: 2, totalPages: 1 }]) {
    respond(payload);
    await assert.rejects(getBrokBuddyListings(), /invalid listing page/);
  }
});

test("rejects invalid page and detail identifiers before requesting", async () => {
  globalThis.fetch = async () => assert.fail("Unexpected request");
  for (const page of [0, -1, NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1]) await assert.rejects(getBrokBuddyListings(page));
  for (const id of ["../listings", "id?hex=secret", "", "id/another"]) await assert.rejects(getBrokBuddyListing(id));
});

test("only returned public asset URLs enter the supported image flow", async () => {
  for (const url of ["gs://private/image", "https://storage.googleapis.com/private/image", "https://attacker.test/image", "/api/private/image", "javascript:alert(1)"]) {
    respond({ ...profile({ avatar: url }), activeListings: [listing({ images: [{ url }], agent: { slug, avatar: url } })] });
    const result = await getBrokBuddyWebsiteData();
    assert.equal(result.broker.photoUrl, null);
    assert.equal(result.properties[0].image, "/arman-property-advisor-logo.png");
    assert.deepEqual(result.properties[0].gallery, []);
  }
});

test("server modules are guarded and route entry points keep feed calls on the server", () => {
  const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
  for (const path of ["./config.ts", "./website-data.ts"]) assert.match(read(path), /^import "server-only";/);
  const detailRoute = read("../../app/listings/[id]/page.tsx");
  assert.doesNotMatch(detailRoute, /use client/);
  assert.match(detailRoute, /getBrokBuddyListing\(id\)/);
  const view = read("../../app/listings/listings-view.tsx");
  assert.match(view, /href=\{`\/listings\/\$\{property.id\}`\}/);
  assert.match(view, /pageHref\(data.page \+ 1\)/);
  assert.match(view, /categoryRoutes\[activeCategory\]/);
  for (const route of ["listings", "sell", "rent", "off-plan", "commercial"]) {
    const source = read(`../../app/${route}/page.tsx`);
    assert.doesNotMatch(source, /use client/);
    assert.match(source, /BrokerListingsPage searchParams=\{searchParams\}/);
  }
});
