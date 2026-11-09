export interface BrokBuddyTemplateConfig {
  apiBaseUrl: string;
  slug: string;
  templateHexCode: string;
}

export function getBrokBuddyTemplateConfig(): BrokBuddyTemplateConfig | null {
  const slug = process.env.BROKBUDDY_TEMPLATE_SLUG?.trim();
  const templateHexCode = process.env.BROKBUDDY_TEMPLATE_HEX_CODE?.trim();
  const apiBaseUrl = process.env.BROKBUDDY_API_BASE_URL?.trim() || "https://api.brokbuddy.si";

  if (!slug || !templateHexCode || !/^[a-f0-9]{32}$/.test(templateHexCode)) {
    return null;
  }

  let parsedApiBaseUrl: URL;
  try {
    parsedApiBaseUrl = new URL(apiBaseUrl);
  } catch {
    return null;
  }

  if (parsedApiBaseUrl.protocol !== "https:" && parsedApiBaseUrl.protocol !== "http:") {
    return null;
  }

  return {
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ""),
    slug,
    templateHexCode,
  };
}
