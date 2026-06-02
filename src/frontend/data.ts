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
    subtitle: 'The world\'s finest performance',
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=600',
    type: 'car'
  },
  {
    id: 'c2',
    name: 'REAL ESTATE',
    subtitle: 'Exceptional homes. Iconic locations.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
    type: 'estate'
  },
  {
    id: 'c3',
    name: 'YACHTS',
    subtitle: 'Sail beyond extraordinary',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=600',
    type: 'yacht'
  },
  {
    id: 'c4',
    name: 'PRIVATE JETS',
    subtitle: 'Jet-set with unmatched luxury',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=600',
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
    title: 'Seaview Modern Villa',
    subtitle: 'Marbella, Spain',
    price: 4950000,
    currency: '€',
    location: 'Marbella, Spain',
    images: [
      'https://images.unsplash.com/photo-1613490900233-ea41ddbc05d0?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Beds: '4', Baths: '4.5', Area: '512 m²' },
    isFeatured: true
  },
  {
    id: 'l3',
    type: 'bike',
    title: '2024 Ducati Scrambler',
    price: 13500,
    currency: '€',
    location: 'Milan, Italy',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Year: '2024', Mileage: '6,200 km' }
  },
  {
    id: 'l4',
    type: 'car',
    title: 'Ferrari 296 GTB',
    price: 380000,
    currency: '€',
    location: 'Monaco',
    images: [
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Year: '2023', Mileage: '1,500 km', Type: 'Hybrid' },
    isFeatured: true
  },
  {
    id: 'l5',
    type: 'estate',
    title: 'Cliffside Villa',
    subtitle: 'Amalfi Coast, Italy',
    price: 24500000,
    currency: '€',
    location: 'Amalfi Coast, Italy',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Beds: '6', Baths: '7', Area: '12,540 sqft' }
  }
];

export const messages: Message[] = [
  {
    id: 'm1',
    senderId: 'u2',
    listingId: 'l2',
    snippet: 'Hello, I\'m interested in scheduling a private viewing of this property. Please let me know your availability.',
    timestamp: '10:24 AM',
    unread: true,
    tag: 'Interested Buyer'
  },
  {
    id: 'm2',
    senderId: 'u3',
    listingId: 'l5',
    snippet: 'Hi, could you please share more details about the heating system and yearly running costs?',
    timestamp: 'Yesterday',
    unread: true,
    tag: 'New Lead'
  }
];

export const senders: Record<string, Partial<User>> = {
  'u2': { name: 'James Anderson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=128&h=128' },
  'u3': { name: 'Sophia Martinez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=128&h=128' }
};
