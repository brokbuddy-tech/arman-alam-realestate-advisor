import "server-only";
import { ContactError, parseContactInput } from "./contact.ts";
import { submitBrokerContact } from "./brokbuddy/contact.ts";

const json = (body: object, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function handleContactRequest(request: Request): Promise<Response> {
  // Next can construct an internal localhost URL behind a reverse proxy. The
  // incoming Host and forwarded protocol represent the visitor-facing origin.
  const requestUrl = new URL(request.url);
  const host = request.headers.get("host") ?? requestUrl.host;
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  const protocol = forwardedProtocol === "https" || forwardedProtocol === "http" ? `${forwardedProtocol}:` : requestUrl.protocol;
  let origin: string;
  try { origin = new URL(`${protocol}//${host}`).origin; } catch { return json({ error: "Please submit this form from the website." }, 403); }
  if (request.headers.get("origin") !== origin) return json({ error: "Please submit this form from the website." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Please complete the contact form." }, 415);
  const key = request.headers.get("idempotency-key") ?? "";
  if (!/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(key)) return json({ error: "Please refresh the form and try again." }, 400);
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new ContactError("Please complete the contact form.", 400);
    const chunks: Uint8Array[] = []; let bytes = 0;
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      bytes += result.value.byteLength;
      if (bytes > 20_000) { await reader.cancel(); throw new ContactError("Your message is too long.", 413); }
      chunks.push(result.value);
    }
    const body = new Uint8Array(bytes); let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    let value: unknown;
    try { value = JSON.parse(new TextDecoder().decode(body)); } catch { throw new ContactError("Please complete the contact form.", 400); }
    const input = parseContactInput(value);
    let referer: string | undefined;
    try { const url = new URL(request.headers.get("referer") ?? ""); if (url.origin === origin) referer = url.href; } catch { /* Referer is optional. */ }
    await submitBrokerContact(input, key, referer);
    return json({ success: true }, 201);
  } catch (error) {
    if (error instanceof ContactError) return json({ error: error.message }, error.status);
    return json({ error: "We couldn’t send your enquiry. Please try again later." }, 502);
  }
}
