"use client";

import { createContext, useContext } from "react";
import type { BrokerProfile } from "@/data/broker";
import type { Property } from "@/data/properties";
import type { BrokBuddyWebsiteData } from "@/lib/brokbuddy/website-data";

interface BrokBuddyContextValue {
  broker: BrokerProfile | null;
  properties: Property[];
  isConfigured: boolean;
}

const BrokBuddyContext = createContext<BrokBuddyContextValue>({
  broker: null,
  properties: [],
  isConfigured: false,
});

export function BrokBuddyProvider({
  data,
  children,
}: {
  data: BrokBuddyWebsiteData | null;
  children: React.ReactNode;
}) {
  return (
    <BrokBuddyContext.Provider
      value={{
        broker: data?.broker ?? null,
        properties: data?.properties ?? [],
        isConfigured: data !== null,
      }}
    >
      {children}
    </BrokBuddyContext.Provider>
  );
}

export function useBrokBuddyData() {
  return useContext(BrokBuddyContext);
}
