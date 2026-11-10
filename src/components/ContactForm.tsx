"use client";

import { useId, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

export default function ContactForm({ listingId }: { listingId?: string }) {
  const id = useId();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const submission = useRef<{ body: string; key: string } | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = new FormData(event.currentTarget);
    const body = JSON.stringify({
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
      ...(listingId ? { listingId } : {}),
    });
    if (submission.current?.body !== body) submission.current = { body, key: crypto.randomUUID() };
    setSending(true); setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": submission.current.key },
        body,
        signal: AbortSignal.timeout(25_000),
      });
      const result: unknown = await response.json();
      if (!response.ok || !result || typeof result !== "object" || !("success" in result) || result.success !== true) {
        const message = result && typeof result === "object" && "error" in result && typeof result.error === "string" ? result.error : "We couldn’t send your enquiry. Please try again.";
        setError(message);
        return;
      }
      submission.current = null;
      setSent(true);
    } catch {
      setError("We couldn’t send your enquiry. Check your connection and try again.");
    } finally { setSending(false); }
  }

  if (sent) return (
    <div role="status" className="py-8 text-center">
      <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
      <h3 className="text-xl font-semibold text-[#111812]">Enquiry received</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">Thank you for getting in touch. The broker will use your contact details to respond.</p>
      <button type="button" onClick={() => setSent(false)} className="mt-6 min-h-11 glass-control rounded-xl px-5 text-sm font-semibold">Send another enquiry</button>
    </div>
  );

  const inputClass = "glass-input mt-1.5 min-h-11 w-full min-w-0 rounded-xl px-3.5 py-2.5 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-[#b29b00] focus:outline-none disabled:opacity-60";
  return (
    <form aria-label="Contact the broker" aria-busy={sending} onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor={`${id}-name`} className="text-xs font-semibold text-neutral-700">Full name</label>
        <input id={`${id}-name`} name="name" autoComplete="name" required minLength={2} maxLength={120} disabled={sending} placeholder="Your full name" className={inputClass} />
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="min-w-0"><label htmlFor={`${id}-email`} className="text-xs font-semibold text-neutral-700">Email address</label><input id={`${id}-email`} type="email" name="email" autoComplete="email" required maxLength={254} disabled={sending} placeholder="you@example.com" className={inputClass} /></div>
        <div className="min-w-0"><label htmlFor={`${id}-phone`} className="text-xs font-semibold text-neutral-700">Phone <span className="font-normal text-neutral-400">(optional)</span></label><input id={`${id}-phone`} type="tel" name="phone" autoComplete="tel" maxLength={40} disabled={sending} placeholder="+971 …" className={inputClass} /></div>
      </div>
      <div>
        <label htmlFor={`${id}-message`} className="text-xs font-semibold text-neutral-700">How can I help?</label>
        <textarea id={`${id}-message`} name="message" required minLength={10} maxLength={4000} rows={3} disabled={sending} placeholder={listingId ? "I’d like to know more about this property…" : "Tell me about the property or advice you’re looking for…"} className={`${inputClass} resize-y`} />
      </div>
      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800">{error}</p>}
      <button type="submit" disabled={sending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 glass-action rounded-xl px-5 py-3 text-sm font-semibold disabled:cursor-wait disabled:opacity-70">
        {sending ? <><LoaderCircle className="h-4 w-4 animate-spin" />Sending enquiry…</> : <><Send className="h-4 w-4" />Send enquiry</>}
      </button>
      <p className="text-center text-[11px] leading-relaxed text-neutral-500">Your contact details will be used to respond to this enquiry.</p>
    </form>
  );
}
