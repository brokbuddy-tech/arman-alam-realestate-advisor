import assert from "node:assert/strict";
import test from "node:test";
import { getBrokBuddyTemplateConfig } from "./config.ts";

const originalEnv = {
  apiBaseUrl: process.env.BROKBUDDY_API_BASE_URL,
  brokerCode: process.env.BROKBUDDY_BROKER_CODE,
  brokerProfileSlug: process.env.BROKBUDDY_BROKER_PROFILE_SLUG,
};

function setTemplateEnv(values) {
  for (const [key, value] of Object.entries({
    BROKBUDDY_API_BASE_URL: values.apiBaseUrl ?? "https://api.brokbuddy.test",
    BROKBUDDY_BROKER_CODE: values.brokerCode,
    BROKBUDDY_BROKER_PROFILE_SLUG: values.brokerProfileSlug,
  })) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

test.after(() => {
  for (const [key, value] of Object.entries({
    BROKBUDDY_API_BASE_URL: originalEnv.apiBaseUrl,
    BROKBUDDY_BROKER_CODE: originalEnv.brokerCode,
    BROKBUDDY_BROKER_PROFILE_SLUG: originalEnv.brokerProfileSlug,
  })) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

test("keeps the integration disabled until broker code and broker profile scope are configured", () => {
  setTemplateEnv({
    brokerCode: "0123456789abcdef0123456789abcdef",
    brokerProfileSlug: "broker-profile-test",
  });
  assert.ok(getBrokBuddyTemplateConfig());

  setTemplateEnv({ brokerCode: "0123456789abcdef0123456789abcdef" });
  assert.equal(getBrokBuddyTemplateConfig(), null);
});

test("accepts broker-scoped config and strips trailing API URL slashes", () => {
  setTemplateEnv({
    apiBaseUrl: "https://api.brokbuddy.si///",
    brokerCode: "0123456789abcdef0123456789abcdef",
    brokerProfileSlug: "broker-profile-test",
  });

  assert.deepEqual(getBrokBuddyTemplateConfig(), {
    apiBaseUrl: "https://api.brokbuddy.si",
    brokerCode: "0123456789abcdef0123456789abcdef",
    brokerProfileSlug: "broker-profile-test",
  });
});

test("rejects malformed broker codes", () => {
  for (const brokerCode of [undefined, "not-a-code", "01234567", "a".repeat(31), "a".repeat(33), "A".repeat(32)]) {
    setTemplateEnv({ brokerCode, brokerProfileSlug: "broker-profile-test" });
    assert.equal(getBrokBuddyTemplateConfig(), null);
  }
});

test("requires an explicit API base URL and never substitutes a legacy organization code", () => {
  setTemplateEnv({ brokerCode: "a".repeat(32), brokerProfileSlug: "broker-profile-test" });
  delete process.env.BROKBUDDY_API_BASE_URL;
  assert.equal(getBrokBuddyTemplateConfig(), null);
});

test("rejects malformed API URLs", () => {
  setTemplateEnv({
    apiBaseUrl: "not a URL",
    brokerCode: "0123456789abcdef0123456789abcdef",
    brokerProfileSlug: "broker-profile-test",
  });
  assert.equal(getBrokBuddyTemplateConfig(), null);

  setTemplateEnv({
    apiBaseUrl: "http://api.brokbuddy.si",
    brokerCode: "0123456789abcdef0123456789abcdef",
    brokerProfileSlug: "broker-profile-test",
  });
  assert.equal(getBrokBuddyTemplateConfig(), null);

  setTemplateEnv({
    apiBaseUrl: "https://user:pass@api.brokbuddy.si?token=secret",
    brokerCode: "0123456789abcdef0123456789abcdef",
    brokerProfileSlug: "broker-profile-test",
  });
  assert.equal(getBrokBuddyTemplateConfig(), null);
});

test("rejects malformed or missing broker profile slugs", () => {
  setTemplateEnv({
    brokerCode: "0123456789abcdef0123456789abcdef",
    brokerProfileSlug: "Arman Alam",
  });
  assert.equal(getBrokBuddyTemplateConfig(), null);

  setTemplateEnv({
    brokerCode: "0123456789abcdef0123456789abcdef",
  });
  assert.equal(getBrokBuddyTemplateConfig(), null);
});
