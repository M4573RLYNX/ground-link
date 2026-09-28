import type { Property } from '@/lib/api';

export function formatPrice(price: number): string {
  return `SBD ${price.toLocaleString()}`;
}

/** Short form for tight spaces: SBD 1.2M, SBD 850K */
export function formatPriceCompact(price: number): string {
  if (price >= 1_000_000) return `SBD ${+(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `SBD ${Math.round(price / 1_000)}K`;
  return `SBD ${price}`;
}

export function formatStatus(status: Property['status']): string {
  return status.replace('-', ' ');
}

export type StatusTone = 'default' | 'ink' | 'warning' | 'muted';

export function statusTone(status: Property['status']): StatusTone {
  switch (status) {
    case 'for-sale':
      return 'default';
    case 'for-rent':
      return 'ink';
    case 'under-offer':
      return 'warning';
    default:
      return 'muted';
  }
}

export const PROPERTY_TYPES = ['House', 'Land', 'Apartment', 'Commercial'] as const;

/* ---------- Rent vs buy ---------- */

export type Deal = 'rent' | 'buy';

export const isRental = (status: Property['status']) => status === 'for-rent' || status === 'rented';

/** Listings a renter or buyer can still act on */
export function matchesDeal(p: Property, deal: Deal): boolean {
  return deal === 'rent' ? p.status === 'for-rent' : p.status === 'for-sale' || p.status === 'under-offer';
}

/** "SBD 9,500 /mo" for rentals, plain price otherwise */
export function formatListingPrice(p: Pick<Property, 'price' | 'status'>): string {
  return isRental(p.status) ? `${formatPrice(p.price)} /mo` : formatPrice(p.price);
}

type Budget = { label: string; min?: number; max?: number };

export const BUDGETS: Record<Deal, Budget[]> = {
  rent: [
    { label: 'Under 5k /mo', max: 5_000 },
    { label: '5k – 10k /mo', min: 5_000, max: 10_000 },
    { label: '10k – 20k /mo', min: 10_000, max: 20_000 },
    { label: 'Over 20k /mo', min: 20_000 },
  ],
  buy: [
    { label: 'Under 500k', max: 500_000 },
    { label: '500k – 1M', min: 500_000, max: 1_000_000 },
    { label: '1M – 3M', min: 1_000_000, max: 3_000_000 },
    { label: 'Over 3M', min: 3_000_000 },
  ],
};

export function matchesBudget(price: number, deal: Deal, label?: string): boolean {
  const b = BUDGETS[deal].find((x) => x.label === label);
  if (!b) return true;
  return (b.min === undefined || price >= b.min) && (b.max === undefined || price <= b.max);
}

/** Property types worth offering per deal: nobody rents a bare land lot here */
export const DEAL_TYPES: Record<Deal, string[]> = {
  rent: ['House', 'Apartment', 'Condo', 'Commercial'],
  buy: ['House', 'Land', 'Apartment', 'Villa', 'Beachfront', 'Commercial'],
};
