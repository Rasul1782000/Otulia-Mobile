const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const DB_PATH = path.join(__dirname, '..', 'otulia.db');
const OUT_PATH = path.join(__dirname, 'car_listings_page1.json');

const db = new Database(DB_PATH, { readonly: true });

function deriveAlt(publicId, title) {
  if (title) return title;
  const parts = publicId.split('/');
  const name = parts[parts.length - 1] || publicId;
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatListingRow(row) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
  const baseUrl = cloudName ? `https://res.cloudinary.com/${cloudName}/image/upload` : '';
  let images = [];
  try {
    const parsed = JSON.parse(row.images || '[]');
    if (Array.isArray(parsed) && parsed.length > 0) {
      if (typeof parsed[0] === 'string') {
        images = parsed.map(u => {
          const src = typeof u === 'string' ? (u.startsWith('http') ? u : `${baseUrl}/${u}`) : '';
          return {
            src,
            alt: deriveAlt(u, row.title),
            width: 0,
            height: 0,
            format: 'unknown',
            loading: 'auto'
          };
        });
      } else if (typeof parsed[0] === 'object') {
        images = parsed.map(obj => ({
          src: obj.src && obj.src.startsWith('http') ? obj.src : (obj.src ? `${baseUrl}/${obj.src}` : ''),
          alt: obj.alt || deriveAlt(obj.src || '', row.title),
          width: obj.width || 0,
          height: obj.height || 0,
          format: obj.format || 'unknown',
          loading: obj.loading || 'auto'
        }));
      }
    }
  } catch (e) {
    images = [];
  }

  return {
    id: `l${row.id}`,
    type: row.type,
    title: row.title,
    subtitle: row.subtitle || undefined,
    brand: row.title.split(' ')[0] || 'Other',
    price: row.price,
    currency: row.currency,
    location: row.location,
    images,
    specs: JSON.parse(row.specs || '{}'),
    isFeatured: row.is_featured === 1,
    dealerId: row.dealer_id || undefined,
    created_at: row.created_at,
  };
}

try {
  const limit = 5;
  const page = 1;
  const offset = (page - 1) * limit;
  const rows = db.prepare('SELECT * FROM listings WHERE type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?').all('car', limit, offset);
  const listings = rows.map(formatListingRow);
  const out = { success: true, listings };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', OUT_PATH);
} catch (err) {
  console.error('Failed to export car listings:', err && err.message ? err.message : err);
  process.exit(1);
}
