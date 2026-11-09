export type Currency = 'USD' | 'AED' | 'EUR';

const rates: Record<Currency, number> = {
  USD: 1,
  AED: 3.67,
  EUR: 0.92,
};

const symbols: Record<Currency, string> = {
  USD: '$',
  AED: 'AED ',
  EUR: '€',
};

export function formatPrice(
  price: number,
  currency: Currency,
  sourceCurrency: Currency = 'USD',
): string {
  const converted = (price / rates[sourceCurrency]) * rates[currency];
  return `${symbols[currency]}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
