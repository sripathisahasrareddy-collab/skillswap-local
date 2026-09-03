export type PriceType = 'Fixed' | 'Per Hour' | 'Starting From';
export type Availability = 'Available Today' | 'Weekdays' | 'Weekends' | 'Evenings';
export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  location: string;
  bio?: string;
  avatarColor?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  skill: string;
  category: string;
  title: string;
  description: string;
  price: number;
  priceType: PriceType;
  serviceRadius: number;
  availability: Availability;
  experience: string;
  distance: number;
  rating: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  serviceTitle: string;
  serviceSkill: string;
  price: number;
  priceType: PriceType;
  date: string;
  message: string;
  status: BookingStatus;
  hasReview: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  serviceId: string;
  providerId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface MatchBreakdown {
  distance: number;
  rating: number;
  price: number;
  availability: number;
  total: number;
}
