import { Router, Request, Response } from 'express';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

interface ListingRow {
  id: number;
  type: string;
  title: string;
  subtitle: string | null;
  price: number;
  currency: string;
  location: string;
  images: string;
  specs: string;
  is_featured: number;
  dealer_id: string | null;
  created_at: string;
}

function deriveAlt(src: string, title?: string): string {
  if (title) return title;
  const parts = src.split('/');
  const name = parts[parts.length - 1] || src;
  return name.replace(/\.[a-z]+$/i, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const BRAND_PATTERNS: Record<string, string[]> = {
  car: [
    'Lamborghini', 'Ferrari', 'Bugatti', 'Porsche', 'McLaren',
    'Aston Martin', 'Bentley', 'Rolls Royce', 'Maserati', 'Pagani',
    'Koenigsegg', 'Hennessey', 'Rimac', 'Cadillac', 'Chevrolet',
    'Ford', 'BMW', 'Mercedes', 'Mercedes-Benz', 'Audi', 'Lexus',
    'Nissan', 'Toyota', 'Honda', 'Hyundai', 'Genesis', 'Lotus',
    'Alfa Romeo', 'Maserati', 'Abarth', 'Cupra', 'Tesla',
  ],
  bike: [
    'Ducati', 'Harley-Davidson', 'BMW', 'KTM', 'Aprilia',
    'Triumph', 'Indian', 'Moto Guzzi', 'Husqvarna', 'MV Agusta',
    'Norton', 'Royal Enfield', 'Yamaha', 'Honda', 'Kawasaki',
    'Suzuki', 'Can-Am', 'Polaris',
  ],
  yacht: [
    'Azimut', 'Sunseeker', 'Ferretti', 'Lagoon', 'Benetti',
    'Princess', 'Fairline', 'Riva', 'Sanlorenzo', 'Extra Yachts',
    'Heesen', 'Feadship', 'Lürssen', 'Oceanco', 'Benetti',
  ],
  jet: [
    'Bombardier', 'Gulfstream', 'Cessna', 'Dassault', 'Embraer',
    'Pilatus', 'Piper', 'Beechcraft', 'Textron', 'Airbus',
    'Boeing', 'HondaJet', 'Nextant',
  ],
  estate: [],
};

function deriveBrand(title: string, type: string): string {
  const patterns = BRAND_PATTERNS[type] || [];
  const lower = title.toLowerCase();
  for (const brand of patterns) {
    if (lower.includes(brand.toLowerCase())) {
      return brand;
    }
  }
  const firstWord = title.split(' ')[0];
  return firstWord || 'Other';
}

interface ListingImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  format: string;
  loading: 'auto' | 'lazy' | 'eager';
}

function formatListing(row: ListingRow) {
  let images: ListingImage[] = [];
  const parsed = JSON.parse(row.images);

  if (Array.isArray(parsed) && parsed.length > 0) {
    if (typeof parsed[0] === 'string') {
      images = parsed.map((url: string) => ({
        src: url,
        alt: deriveAlt(url, row.title),
        width: 0,
        height: 0,
        format: 'unknown',
        loading: 'auto' as const,
      }));
    } else {
      images = parsed;
    }
  }

  return {
    id: `l${row.id}`,
    type: row.type,
    title: row.title,
    subtitle: row.subtitle || undefined,
    brand: deriveBrand(row.title, row.type),
    price: row.price,
    currency: row.currency,
    location: row.location,
    images,
    specs: JSON.parse(row.specs),
    isFeatured: row.is_featured === 1,
    dealerId: row.dealer_id || undefined,
  };
}

// GET /api/listings — all listings (with optional limit)
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 0;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const offset = limit > 0 ? (page - 1) * limit : 0;
    const query = limit > 0
      ? 'SELECT * FROM listings ORDER BY created_at DESC LIMIT ? OFFSET ?'
      : 'SELECT * FROM listings ORDER BY created_at DESC';
    const rows = limit > 0
      ? db.prepare(query).all(limit, offset) as ListingRow[]
      : db.prepare(query).all() as ListingRow[];
    const listings = rows.map(row => formatListing(row));
    res.json({ success: true, listings });
  } catch (err: any) {
    console.error('[GET /api/listings]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch listings.' });
  }
});

// GET /api/listings/featured — featured listings only (with optional limit)
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 0;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const offset = limit > 0 ? (page - 1) * limit : 0;
    const query = limit > 0
      ? 'SELECT * FROM listings WHERE is_featured = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?'
      : 'SELECT * FROM listings WHERE is_featured = 1 ORDER BY created_at DESC';
    const rows = limit > 0
      ? db.prepare(query).all(limit, offset) as ListingRow[]
      : db.prepare(query).all() as ListingRow[];
    const listings = rows.map(row => formatListing(row));
    res.json({ success: true, listings });
  } catch (err: any) {
    console.error('[GET /api/listings/featured]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch featured listings.' });
  }
});

// GET /api/listings/type/:type — listings filtered by type (with optional limit)
router.get('/type/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const validTypes = ['car', 'estate', 'bike', 'yacht', 'jet'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ success: false, message: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
      return;
    }
    const limit = parseInt(req.query.limit as string) || 0;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const offset = limit > 0 ? (page - 1) * limit : 0;
    const query = limit > 0
      ? 'SELECT * FROM listings WHERE type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
      : 'SELECT * FROM listings WHERE type = ? ORDER BY created_at DESC';
    const rows = limit > 0
      ? db.prepare(query).all(type, limit, offset) as ListingRow[]
      : db.prepare(query).all(type) as ListingRow[];
    const listings = rows.map(row => formatListing(row));
    res.json({ success: true, listings });
  } catch (err: any) {
    console.error('[GET /api/listings/type/:type]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch listings.' });
  }
});

// GET /api/listings/brands/:type — unique brands for a given type
router.get('/brands/:type', (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const validTypes = ['car', 'estate', 'bike', 'yacht', 'jet'];
    if (!validTypes.includes(type)) {
      res.status(400).json({ success: false, message: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
      return;
    }
    const rows = db.prepare('SELECT title FROM listings WHERE type = ?').all(type) as { title: string }[];
    const brands = [...new Set(rows.map(r => deriveBrand(r.title, type)))].sort();
    res.json({ success: true, brands });
  } catch (err: any) {
    console.error('[GET /api/listings/brands/:type]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch brands.' });
  }
});

// GET /api/listings/:id — single listing by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id.replace(/^l/, ''), 10);
    if (isNaN(numericId)) {
      res.status(404).json({ success: false, message: 'Listing not found.' });
      return;
    }
    const row = db.prepare('SELECT * FROM listings WHERE id = ?').get(numericId) as ListingRow | undefined;
    if (!row) {
      res.status(404).json({ success: false, message: 'Listing not found.' });
      return;
    }
    const listing = formatListing(row);
    res.json({ success: true, listing });
  } catch (err: any) {
    console.error('[GET /api/listings/:id]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch listing.' });
  }
});

// POST /api/listings — create a new listing
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { type, title, subtitle, price, currency, location, images, specs, isFeatured, dealerId } = req.body;

    if (!type || !title || !price || !location || !specs) {
      res.status(400).json({ success: false, message: 'Missing required fields: type, title, price, location, specs.' });
      return;
    }

    const result = db.prepare(
      'INSERT INTO listings (type, title, subtitle, price, currency, location, images, specs, is_featured, dealer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(type, title, subtitle || null, price, currency || '€', location, JSON.stringify(images || []), JSON.stringify(specs), isFeatured ? 1 : 0, dealerId || null);

    const newId = result.lastInsertRowid as number;
    const newListing = db.prepare('SELECT * FROM listings WHERE id = ?').get(newId) as ListingRow;
    const formatted = formatListing(newListing);

    res.status(201).json({ success: true, listing: formatted });
  } catch (err: any) {
    console.error('[POST /api/listings]', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to create listing.' });
  }
});

export default router;
