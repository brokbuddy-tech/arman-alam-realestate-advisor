import "server-only";
import { getBrokBuddyTemplateConfig } from "./config.ts";
import { getBrokBuddyWebsiteData } from "./website-data.ts";
import { ContactError, type ContactInput } from "../contact.ts";

export async function submitBrokerContact(input: ContactInput, idempotencyKey: string, referer?: string): Promise<void> {
  const config = getBrokBuddyTemplateConfig();
  if (!config) throw new ContactError("The contact form is currently unavailable. Please try again later.", 503);
  try {
    // The read-only template code must still be valid before accepting an enquiry.
    const profile = await getBrokBuddyWebsiteData();
    if (!profile) throw new Error("Profile unavailable");
  } catch {
    throw new ContactError("This broker’s contact form is currently unavailable.", 503);
  }
  let response: Response;
  try {
    response = await fetch(new URL(`/api/public/broker/${encodeURIComponent(config.brokerProfileSlug)}/inquiry`, config.apiBaseUrl), {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "idempotency-key": idempotencyKey,
        ...(referer ? { referer } : {}),
      },
      body: JSON.stringify(input),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new ContactError("We couldn’t send your enquiry. Please retry, or contact the broker directly.", 502);
  }
  if (response.status === 429) throw new ContactError("Too many messages. Please wait a moment before trying again.", 429);
  if (response.status === 404 || response.status === 403) throw new ContactError("This broker’s contact form is currently unavailable.", 503);
  if (!response.ok) throw new ContactError("We couldn’t send your enquiry. Please retry, or contact the broker directly.", 502);
  try {
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("inquiry" in result) || !result.inquiry || typeof result.inquiry !== "object" || !("id" in result.inquiry) || typeof result.inquiry.id !== "string") throw new Error("Invalid confirmation");
  } catch {
    throw new ContactError("We couldn’t confirm delivery. Please retry your enquiry.", 502);
  }
}
