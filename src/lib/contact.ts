export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  message: string;
  listingId?: string;
}

export class ContactError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function parseContactInput(value: unknown): ContactInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ContactError("Please complete the contact form.", 400);
  const input = value as Record<string, unknown>;
  const text = (key: string) => typeof input[key] === "string" ? (input[key] as string).trim() : "";
  const name = text("name"); const email = text("email"); const phone = text("phone"); const message = text("message"); const listingId = text("listingId");
  if (name.length < 2 || name.length > 120) throw new ContactError("Enter your full name (2–120 characters).", 400);
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ContactError("Enter a valid email address.", 400);
  if (phone.length > 40 || (phone && !/^[+\d\s().-]{5,40}$/.test(phone))) throw new ContactError("Enter a valid phone number, or leave it blank.", 400);
  if (message.length < 10 || message.length > 4000) throw new ContactError("Enter a message between 10 and 4,000 characters.", 400);
  if (listingId && !/^[a-zA-Z0-9_-]{1,120}$/.test(listingId)) throw new ContactError("This listing is unavailable. Please contact the broker directly.", 400);
  return { name, email, phone, message, ...(listingId ? { listingId } : {}) };
}
