import type { User, Service, Booking, Review } from '@/types';

const KEYS = {
  users: 'ss_users',
  services: 'ss_services',
  bookings: 'ss_bookings',
  reviews: 'ss_reviews',
  currentUser: 'ss_currentUser',
  seeded: 'ss_seeded',
} as const;

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getData<T>(key: keyof typeof KEYS): T[] {
  return read<T>(KEYS[key]);
}

export function setData<T>(key: keyof typeof KEYS, data: T[]): void {
  write(KEYS[key], data);
}

export function addData<T extends { id: string }>(key: keyof typeof KEYS, item: T): T[] {
  const data = read<T>(KEYS[key]);
  data.push(item);
  write(KEYS[key], data);
  return data;
}

export function updateData<T extends { id: string }>(
  key: keyof typeof KEYS,
  id: string,
  updates: Partial<T>,
): T[] {
  const data = read<T>(KEYS[key]);
  const idx = data.findIndex((d) => d.id === id);
  if (idx >= 0) {
    data[idx] = { ...data[idx], ...updates };
    write(KEYS[key], data);
  }
  return data;
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(KEYS.currentUser);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.currentUser);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const SKILL_CATEGORIES: Record<string, string> = {
  'Laptop Repair': 'Repair',
  'Mobile Repair': 'Repair',
  'Plumbing': 'Home Services',
  'Electrical Work': 'Home Services',
  'Python Tutoring': 'Education',
  'Graphic Design': 'Design',
  'Photography': 'Creative Services',
  'Video Editing': 'Creative Services',
  'Web Development': 'Technology',
  'Home Appliance Repair': 'Home Services',
};

export function categoryForSkill(skill: string): string {
  return SKILL_CATEGORIES[skill] ?? 'Other';
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-rose-500', 'bg-violet-500', 'bg-cyan-500',
  'bg-orange-500', 'bg-teal-500',
];

export function avatarColorFor(name: string): string {
  const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export function initialsFor(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function seedData(): void {
  if (localStorage.getItem(KEYS.seeded)) return;

  const users: User[] = [
    {
      id: 'u_provider_1',
      fullName: 'Rahul Kumar',
      email: 'provider@skillswap.com',
      phone: '9876543210',
      password: 'password123',
      location: 'Koramangala, Bangalore',
      bio: 'Certified laptop repair technician with 5+ years of experience fixing all major brands. Quick diagnostics, fair pricing, and same-day service for most issues.',
      avatarColor: avatarColorFor('Rahul Kumar'),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u_provider_2',
      fullName: 'Priya Sharma',
      email: 'priya@skillswap.com',
      phone: '9876501234',
      password: 'password123',
      location: 'Indiranagar, Bangalore',
      bio: 'Software engineer and Python tutor. I make coding approachable for beginners and advanced learners alike.',
      avatarColor: avatarColorFor('Priya Sharma'),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u_provider_3',
      fullName: 'Arjun Reddy',
      email: 'arjun@skillswap.com',
      phone: '9876512345',
      password: 'password123',
      location: 'HSR Layout, Bangalore',
      bio: 'Graphic designer specializing in brand identity, social media creatives, and marketing collateral.',
      avatarColor: avatarColorFor('Arjun Reddy'),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u_provider_4',
      fullName: 'Sneha Patel',
      email: 'sneha@skillswap.com',
      phone: '9876523456',
      password: 'password123',
      location: 'Whitefield, Bangalore',
      bio: 'Professional photographer covering events, portraits, and product shoots.',
      avatarColor: avatarColorFor('Sneha Patel'),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u_provider_5',
      fullName: 'Vikram Singh',
      email: 'vikram@skillswap.com',
      phone: '9876534567',
      password: 'password123',
      location: 'Jayanagar, Bangalore',
      bio: 'Licensed plumber with 8 years of experience in residential and commercial plumbing.',
      avatarColor: avatarColorFor('Vikram Singh'),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u_provider_6',
      fullName: 'Anita Desai',
      email: 'anita@skillswap.com',
      phone: '9876545678',
      password: 'password123',
      location: 'BTM Layout, Bangalore',
      bio: 'Web developer building fast, modern websites and web apps using React and Node.js.',
      avatarColor: avatarColorFor('Anita Desai'),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'u_customer_1',
      fullName: 'Demo Customer',
      email: 'customer@skillswap.com',
      phone: '9988776655',
      password: 'password123',
      location: 'Koramangala, Bangalore',
      bio: 'Looking for reliable local service providers.',
      avatarColor: avatarColorFor('Demo Customer'),
      createdAt: new Date().toISOString(),
    },
  ];

  const services: Service[] = [
    {
      id: 's_1',
      providerId: 'u_provider_1',
      providerName: 'Rahul Kumar',
      skill: 'Laptop Repair',
      category: 'Repair',
      title: 'Laptop Repair & Diagnostics',
      description: 'Professional laptop repair for all brands including Dell, HP, Lenovo, MacBook. Hardware issues, screen replacement, keyboard fix, battery replacement, and performance optimization.',
      price: 500,
      priceType: 'Starting From',
      serviceRadius: 5,
      availability: 'Weekends',
      experience: '5 years',
      distance: 2.3,
      rating: 4.8,
      createdAt: new Date().toISOString(),
    },
    {
      id: 's_2',
      providerId: 'u_provider_2',
      providerName: 'Priya Sharma',
      skill: 'Python Tutoring',
      category: 'Education',
      title: 'Python Programming Tutoring',
      description: 'Learn Python from basics to advanced. Data structures, web scraping, automation, and intro to data science. Personalized curriculum for school students and working professionals.',
      price: 400,
      priceType: 'Per Hour',
      serviceRadius: 10,
      availability: 'Evenings',
      experience: '4 years',
      distance: 3.1,
      rating: 4.9,
      createdAt: new Date().toISOString(),
    },
    {
      id: 's_3',
      providerId: 'u_provider_3',
      providerName: 'Arjun Reddy',
      skill: 'Graphic Design',
      category: 'Design',
      title: 'Graphic Design & Branding',
      description: 'Logo design, brand identity kits, social media creatives, flyers, and marketing materials. Modern designs that make your business stand out.',
      price: 500,
      priceType: 'Starting From',
      serviceRadius: 10,
      availability: 'Available Today',
      experience: '3 years',
      distance: 1.8,
      rating: 4.7,
      createdAt: new Date().toISOString(),
    },
    {
      id: 's_4',
      providerId: 'u_provider_4',
      providerName: 'Sneha Patel',
      skill: 'Photography',
      category: 'Creative Services',
      title: 'Event & Portrait Photography',
      description: 'Professional photography for weddings, birthdays, corporate events, and portrait sessions. Includes edited high-resolution photos delivered within 3 days.',
      price: 1500,
      priceType: 'Starting From',
      serviceRadius: 10,
      availability: 'Weekends',
      experience: '6 years',
      distance: 4.2,
      rating: 4.6,
      createdAt: new Date().toISOString(),
    },
    {
      id: 's_5',
      providerId: 'u_provider_5',
      providerName: 'Vikram Singh',
      skill: 'Plumbing',
      category: 'Home Services',
      title: 'Plumbing Repair & Installation',
      description: 'Leakage repair, tap fitting, bathroom plumbing, pipe installation, and drain cleaning. Available for emergency calls within the service area.',
      price: 250,
      priceType: 'Starting From',
      serviceRadius: 5,
      availability: 'Available Today',
      experience: '8 years',
      distance: 3.5,
      rating: 4.5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 's_6',
      providerId: 'u_provider_6',
      providerName: 'Anita Desai',
      skill: 'Web Development',
      category: 'Technology',
      title: 'Website Development',
      description: 'Custom websites and web applications built with React, Next.js, and Node.js. Responsive design, SEO optimization, and deployment included.',
      price: 2000,
      priceType: 'Starting From',
      serviceRadius: 10,
      availability: 'Weekdays',
      experience: '4 years',
      distance: 5.4,
      rating: 4.8,
      createdAt: new Date().toISOString(),
    },
    {
      id: 's_7',
      providerId: 'u_provider_1',
      providerName: 'Rahul Kumar',
      skill: 'Mobile Repair',
      category: 'Repair',
      title: 'Mobile Phone Repair',
      description: 'Screen replacement, battery replacement, water damage repair, and software issues for all phone brands including iPhone, Samsung, OnePlus.',
      price: 200,
      priceType: 'Starting From',
      serviceRadius: 5,
      availability: 'Weekends',
      experience: '5 years',
      distance: 2.3,
      rating: 4.8,
      createdAt: new Date().toISOString(),
    },
    {
      id: 's_8',
      providerId: 'u_provider_3',
      providerName: 'Arjun Reddy',
      skill: 'Video Editing',
      category: 'Creative Services',
      title: 'Video Editing & Motion Graphics',
      description: 'Professional video editing for YouTube, Instagram reels, corporate videos, and ads. Color grading, motion graphics, and sound design included.',
      price: 800,
      priceType: 'Starting From',
      serviceRadius: 10,
      availability: 'Weekdays',
      experience: '3 years',
      distance: 1.8,
      rating: 4.7,
      createdAt: new Date().toISOString(),
    },
  ];

  const bookings: Booking[] = [];
  const reviews: Review[] = [];

  write(KEYS.users, users);
  write(KEYS.services, services);
  write(KEYS.bookings, bookings);
  write(KEYS.reviews, reviews);
  localStorage.setItem(KEYS.seeded, 'true');
}
