'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { formatPrice, type Currency } from '@/lib/currency';

export type { Currency } from '@/lib/currency';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number, sourceCurrency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('AED');

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice: (price, sourceCurrency) => formatPrice(price, currency, sourceCurrency) }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
