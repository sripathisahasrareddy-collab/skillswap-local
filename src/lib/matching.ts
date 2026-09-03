import type { Service, MatchBreakdown } from '@/types';

/**
 * Smart matching algorithm.
 * Score = 40% distance + 30% rating + 20% price + 10% availability.
 * Each component normalized to 0–100.
 */
export function calculateMatch(service: Service, searchRadius: number): MatchBreakdown {
  // Distance score: closer = higher. Linear scale relative to search radius.
  const distanceScore = Math.max(0, Math.round(100 * (1 - service.distance / searchRadius)));

  // Rating score: 5.0 = 100, mapped linearly from 3.0–5.0
  const ratingScore = Math.round(((service.rating - 3) / 2) * 100);

  // Price score: cheaper = higher. Normalize against a cap of 2000.
  const priceScore = Math.round(Math.max(0, 100 - (service.price / 2000) * 100));

  // Availability score: "Available Today" = 100, "Weekdays"/"Evenings" = 75, "Weekends" = 60
  const availMap: Record<string, number> = {
    'Available Today': 100,
    Weekdays: 80,
    Evenings: 75,
    Weekends: 60,
  };
  const availabilityScore = availMap[service.availability] ?? 70;

  const total = Math.round(
    distanceScore * 0.4 + ratingScore * 0.3 + priceScore * 0.2 + availabilityScore * 0.1,
  );

  return {
    distance: distanceScore,
    rating: ratingScore,
    price: priceScore,
    availability: availabilityScore,
    total,
  };
}

export function matchReasons(breakdown: MatchBreakdown): string[] {
  const reasons: string[] = [];
  if (breakdown.distance >= 70) reasons.push('Close to you');
  if (breakdown.rating >= 85) reasons.push('Highly rated');
  if (breakdown.price >= 70) reasons.push('Affordable');
  if (breakdown.availability >= 90) reasons.push('Available soon');
  if (reasons.length === 0) reasons.push('Good option');
  return reasons.slice(0, 3);
}
