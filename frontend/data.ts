import { Category, Listing, User, Message } from './types';

export const currentUser: User = {
  id: 'u1',
  name: 'James Anderson',
  email: 'james.anderson@email.com',
  phone: '+34 612 345 678',
  avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
  isVerified: true,
  type: 'buyer'
};

export const categories: Category[] = [
  {
    id: 'c1',
    name: 'SUPERCARS',
    subtitle: 'High-performance masterpieces',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
    type: 'car'
  },
  {
    id: 'c2',
    name: 'REAL ESTATE',
    subtitle: 'Architectural excellence',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
    type: 'estate'
  },
  {
    id: 'c3',
    name: 'YACHTS',
    subtitle: 'Ocean-bound freedom',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200',
    type: 'yacht'
  },
  {
    id: 'c4',
    name: 'PRIVATE JETS',
    subtitle: 'Unmatched global reach',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1200',
    type: 'jet'
  }
];

export const listings: Listing[] = [
  {
    id: 'l1',
    type: 'car',
    title: 'Lamborghini Revuelto',
    price: 530000,
    currency: '€',
    location: 'Munich, Germany',
    images: [
      'https://images.unsplash.com/photo-1663189914408-f9b2d88a2a51?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Year: '2024', Mileage: '2,100 km', Type: 'Hybrid' },
    isFeatured: true
  },
  {
    id: 'l2',
    type: 'estate',
    title: 'Azure Heights Villa',
    subtitle: 'Marbella, Spain',
    price: 4950000,
    currency: '€',
    location: 'Marbella, Spain',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Beds: '6', Baths: '7', Area: '820 m²' },
    isFeatured: true
  },
  {
    id: 'l3',
    type: 'bike',
    title: 'Ducati Superleggera V4',
    price: 95000,
    currency: '€',
    location: 'Milan, Italy',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Year: '2024', Weight: '152 kg', Power: '234 hp' }
  },
  {
    id: 'l4',
    type: 'car',
    title: 'Ferrari Daytona SP3',
    price: 2200000,
    currency: '€',
    location: 'Monaco',
    images: [
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Year: '2023', Mileage: '450 km', Engine: 'V12' },
    isFeatured: true
  },
  {
    id: 'l5',
    type: 'estate',
    title: 'The Obsidian Penthouse',
    subtitle: 'Dubai, UAE',
    price: 18500000,
    currency: '€',
    location: 'Dubai, UAE',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Beds: '4', Baths: '5', View: 'Full Burj Khalifa' }
  },
  {
    id: 'l6',
    type: 'yacht',
    title: 'Feadship Custom 75m',
    price: 125000000,
    currency: '€',
    location: 'Saint-Tropez, France',
    images: [
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Length: '75m', Guests: '12', Built: '2022' },
    isFeatured: true
  },
  {
    id: 'l7',
    type: 'car',
    title: 'Bugatti Chiron Pur Sport',
    price: 3600000,
    currency: '€',
    location: 'Zurich, Switzerland',
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Year: '2022', Mileage: '800 km', Power: '1500 hp' }
  },
  {
    id: 'l8',
    type: 'jet',
    title: 'Gulfstream G650ER',
    price: 65000000,
    currency: '€',
    location: 'London, UK',
    images: [
      'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Range: '7,500 nm', Seats: '16', Built: '2023' }
  }
];

export const messages: Message[] = [
  {
    id: 'm1',
    senderId: 'u2',
    listingId: 'l2',
    snippet: 'Hello, I\'m interested in scheduling a private viewing of Azure Heights. Please let me know your availability next week.',
    timestamp: '10:24 AM',
    unread: true,
    tag: 'Priority'
  },
  {
    id: 'm2',
    senderId: 'u3',
    listingId: 'l6',
    snippet: 'Hi, could you please share more details about the crew quarters and the latest engine service reports?',
    timestamp: 'Yesterday',
    unread: true,
    tag: 'Charter Inquiry'
  }
];

export const senders: Record<string, Partial<User>> = {
  'u2': { name: 'James Anderson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=128&h=128' },
  'u3': { name: 'Sophia Martinez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=128&h=128' }
};
