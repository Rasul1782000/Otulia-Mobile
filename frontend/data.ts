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
      'https://images.unsplash.com/photo-1663189914408-f9b2d88a2a51?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1619767886558-efdc7b9af943?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1603584173870-7f23fd4a2b5f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200'
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
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607688961-a73ac3b89e33?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566753086-00f18f2a7c3a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600595958092-37231d6ef470?auto=format&fit=crop&q=80&w=1200'
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
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&q=80&w=1200'
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
      'https://images.unsplash.com/photo-1592198084033-aade902d3a1a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200'
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
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585152233-f182e8a6504d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600595958092-37231d6ef470?auto=format&fit=crop&q=80&w=1200'
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
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1571107040551-1a0085cba212?auto=format&fit=crop&q=80&w=1200'
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
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1619767886558-efdc7b9af943?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1200'
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
      'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1607098652344-62d12f357397?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1556388158-158f5e73e9ec?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605436247078-f0ef43ee8d5c?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Range: '7,500 nm', Seats: '16', Built: '2023' }
  },
  {
    id: 'l9',
    type: 'car',
    title: 'Porsche 911 Turbo S',
    price: 210000,
    currency: '€',
    location: 'Stuttgart, Germany',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1619767886558-efdc7b9af943?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Year: '2024', Mileage: '800 km', Power: '640 hp' },
    isFeatured: true
  },
  {
    id: 'l10',
    type: 'car',
    title: 'McLaren Artura',
    price: 285000,
    currency: '€',
    location: 'Woking, UK',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1603584173870-7f23fd4a2b5f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Year: '2024', Mileage: '300 km', Power: '671 hp' }
  },
  {
    id: 'l11',
    type: 'estate',
    title: 'Modernist Hillside Retreat',
    subtitle: 'Los Angeles, USA',
    price: 12500000,
    currency: '$',
    location: 'Los Angeles, USA',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Beds: '5', Baths: '6', Area: '650 m²' },
    isFeatured: true
  },
  {
    id: 'l12',
    type: 'estate',
    title: 'Royal Palm Estate',
    subtitle: 'Palm Jumeirah, Dubai',
    price: 32000000,
    currency: '€',
    location: 'Dubai, UAE',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607688961-a73ac3b89e33?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566753086-00f18f2a7c3a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600595958092-37231d6ef470?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Beds: '7', Baths: '9', Area: '1,200 m²' }
  },
  {
    id: 'l13',
    type: 'bike',
    title: 'BMW M 1000 RR',
    price: 38000,
    currency: '€',
    location: 'Berlin, Germany',
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Year: '2024', Weight: '170 kg', Power: '212 hp' }
  },
  {
    id: 'l14',
    type: 'bike',
    title: 'MV Agusta Brutale 1000',
    price: 45000,
    currency: '€',
    location: 'Varese, Italy',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1558980664-10a60e8a5ba7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1581078426770-6d336e5de7bf?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Year: '2024', Weight: '186 kg', Power: '208 hp' }
  },
  {
    id: 'l15',
    type: 'yacht',
    title: 'Benetti 50m',
    price: 18000000,
    currency: '€',
    location: 'Portofino, Italy',
    images: [
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1571107040551-1a0085cba212?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Length: '50m', Guests: '10', Built: '2023' },
    isFeatured: true
  },
  {
    id: 'l16',
    type: 'yacht',
    title: 'Sunseeker 40m',
    price: 9500000,
    currency: '€',
    location: 'Monaco',
    images: [
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Length: '40m', Guests: '8', Built: '2024' }
  },
  {
    id: 'l17',
    type: 'jet',
    title: 'Bombardier Global 7500',
    price: 78000000,
    currency: '$',
    location: 'New York, USA',
    images: [
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1607098652344-62d12f357397?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1556388158-158f5e73e9ec?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605436247078-f0ef43ee8d5c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Range: '7,700 nm', Seats: '19', Built: '2023' },
    isFeatured: true
  },
  {
    id: 'l18',
    type: 'jet',
    title: 'Cessna Citation Longitude',
    price: 27000000,
    currency: '$',
    location: 'Wichita, USA',
    images: [
      'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1607098652344-62d12f357397?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1556388158-158f5e73e9ec?auto=format&fit=crop&q=80&w=1200'
    ],
    specs: { Range: '3,500 nm', Seats: '12', Built: '2024' }
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
