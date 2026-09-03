import type { PriceType } from '@/types';

export function formatPrice(price: number, type: PriceType): string {
  switch (type) {
    case 'Per Hour':
      return `₹${price}/hour`;
    case 'Starting From':
      return `₹${price}+`;
    case 'Fixed':
      return `₹${price}`;
    default:
      return `₹${price}`;
  }
}

export function formatPriceRange(price: number, type: PriceType): string {
  if (type === 'Starting From') {
    return `₹${price}–₹${price + 200}`;
  }
  return formatPrice(price, type);
}
