"use client";

import ContactForm from "@/components/ContactForm";
import { useBrokBuddyData } from "@/context/BrokBuddyContext";

export default function ContactPage() {
  const { broker } = useBrokBuddyData();
  if (!broker) return null;
  return (
    <main className="min-h-screen bg-[#F6F6F4] px-4 pt-32 pb-16 text-neutral-900 sm:px-6 sm:pt-40">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <section className="min-w-0">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Get in touch</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Let’s talk property.</h1>
          <p className="mt-5 text-base leading-relaxed text-neutral-600">Share what you’re looking for with {broker.name}, whether you have a property in mind or need some guidance.</p>
          <div className="mt-7 space-y-4 text-sm">
            {broker.brn && <p className="font-semibold">BRN {broker.brn}</p>}
            {broker.phone && <a href={`tel:${broker.phone}`} className="block font-semibold">{broker.phone}</a>}
            {broker.email && <a href={`mailto:${broker.email}`} className="block [overflow-wrap:anywhere]">{broker.email}</a>}
          </div>
        </section>
        <section aria-label="Send a contact enquiry" className="min-w-0 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8"><ContactForm /></section>
      </div>
    </main>
  );
}
