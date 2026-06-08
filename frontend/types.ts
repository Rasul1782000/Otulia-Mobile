export type ViewState = 'auth' | 'home' | 'explore' | 'detail' | 'inbox' | 'profile' | 'add-listing' | 'settings';

export interface Category {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  type?: Listing['type'];
}

export interface Listing {
  id: string;
  type: 'car' | 'estate' | 'bike' | 'yacht' | 'jet';
  title: string;
  subtitle?: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  specs: Record<string, string>;
  isFeatured?: boolean;
  dealerId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isVerified: boolean;
  type: 'buyer' | 'agency';
}

export interface Message {
  id: string;
  senderId: string;
  listingId?: string;
  snippet: string;
  timestamp: string;
  unread: boolean;
  tag?: string;
}
