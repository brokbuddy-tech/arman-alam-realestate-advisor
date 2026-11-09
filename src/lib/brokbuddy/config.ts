import "server-only";

export interface BrokBuddyTemplateConfig {
  apiBaseUrl: string;
  brokerCode: string;
  brokerProfileSlug: string;
}

export function getBrokBuddyTemplateConfig(): BrokBuddyTemplateConfig | null {
  const brokerCode = process.env.BROKBUDDY_BROKER_CODE?.trim();
  const brokerProfileSlug = process.env.BROKBUDDY_BROKER_PROFILE_SLUG?.trim();
  const apiBaseUrl = process.env.BROKBUDDY_API_BASE_URL?.trim();

  if (
    !apiBaseUrl ||
    !brokerCode ||
    !/^[a-f0-9]{32}$/.test(brokerCode) ||
    !brokerProfileSlug ||
    brokerProfileSlug.length < 3 ||
    brokerProfileSlug.length > 120 ||
    !/^[a-z0-9-]+$/.test(brokerProfileSlug)
  ) {
    return null;
  }

  let parsedApiBaseUrl: URL;
  try {
    parsedApiBaseUrl = new URL(apiBaseUrl);
  } catch {
    return null;
  }

  if (
    parsedApiBaseUrl.protocol !== "https:" ||
    parsedApiBaseUrl.username ||
    parsedApiBaseUrl.password ||
    parsedApiBaseUrl.search ||
    parsedApiBaseUrl.hash
  ) {
    return null;
  }

  return {
    apiBaseUrl: apiBaseUrl.replace(/\/+$/, ""),
    brokerCode,
    brokerProfileSlug,
  };
}
