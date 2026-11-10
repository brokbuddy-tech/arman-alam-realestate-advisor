"use client";

import ContactForm from "@/components/ContactForm";
import { useBrokBuddyData } from "@/context/BrokBuddyContext";

export default function ContactPage() {
  const { broker } = useBrokBuddyData();
  if (!broker) return null;
  return (
    <main className="site-surface min-h-screen px-4 pt-28 pb-12 text-neutral-900 sm:px-6 sm:pt-28">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8">
        <section className="min-w-0">

          <h1 className="text-3xl font-semibold leading-tight tracking-tight">Contact us</h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">Share what you’re looking for with {broker.name}, whether you have a property in mind or need some guidance.</p>
          <div className="mt-7 space-y-4 text-sm">
            {broker.brn && <p className="font-semibold">BRN {broker.brn}</p>}
            {broker.phone && <a href={`tel:${broker.phone}`} className="block font-semibold">{broker.phone}</a>}
            {broker.email && <a href={`mailto:${broker.email}`} className="block [overflow-wrap:anywhere]">{broker.email}</a>}
          </div>
        </section>
        <section aria-label="Send a contact enquiry" className="glass-panel min-w-0 p-5 sm:p-6"><ContactForm /></section>
      </div>
    </main>
  );
}
