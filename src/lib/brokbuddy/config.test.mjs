import assert from "node:assert/strict";
import test from "node:test";
import { getBrokBuddyTemplateConfig } from "./config.ts";

const originalEnv = {
  apiBaseUrl: process.env.BROKBUDDY_API_BASE_URL,
  slug: process.env.BROKBUDDY_TEMPLATE_SLUG,
  templateHexCode: process.env.BROKBUDDY_TEMPLATE_HEX_CODE,
};

function setTemplateEnv(values) {
  for (const [key, value] of Object.entries({
    BROKBUDDY_API_BASE_URL: values.apiBaseUrl,
    BROKBUDDY_TEMPLATE_SLUG: values.slug,
    BROKBUDDY_TEMPLATE_HEX_CODE: values.templateHexCode,
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
    BROKBUDDY_TEMPLATE_SLUG: originalEnv.slug,
    BROKBUDDY_TEMPLATE_HEX_CODE: originalEnv.templateHexCode,
  })) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

test("keeps template integration disabled until slug and code are configured", () => {
  setTemplateEnv({ slug: "agent-workspace" });
  assert.equal(getBrokBuddyTemplateConfig(), null);
});

test("accepts agency-template config and strips trailing API URL slashes", () => {
  setTemplateEnv({
    apiBaseUrl: "https://api.brokbuddy.si///",
    slug: "agent-workspace",
    templateHexCode: "0123456789abcdef0123456789abcdef",
  });

  assert.deepEqual(getBrokBuddyTemplateConfig(), {
    apiBaseUrl: "https://api.brokbuddy.si",
    slug: "agent-workspace",
    templateHexCode: "0123456789abcdef0123456789abcdef",
  });
});

test("rejects malformed template codes", () => {
  setTemplateEnv({
    slug: "agent-workspace",
    templateHexCode: "not-a-template-code",
  });
  assert.equal(getBrokBuddyTemplateConfig(), null);
});

test("rejects malformed API URLs", () => {
  setTemplateEnv({
    apiBaseUrl: "not a URL",
    slug: "agent-workspace",
    templateHexCode: "0123456789abcdef0123456789abcdef",
  });
  assert.equal(getBrokBuddyTemplateConfig(), null);
});
