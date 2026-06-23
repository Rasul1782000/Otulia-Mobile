const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Resolve DB inside the backend folder where the app stores `otulia.db`
const DB_PATH = path.join(__dirname, '..', 'otulia.db');
const outPath = path.join(__dirname, 'listing_image_report.json');

const db = new Database(DB_PATH, { readonly: true });
const rows = db.prepare('SELECT id, title, images FROM listings ORDER BY id ASC').all();

function classifyImageItem(item) {
  if (!item) return 'unknown';
  if (typeof item === 'string') {
    const s = item.trim();
    if (s.startsWith('http://') || s.startsWith('https://')) {
      try {
        const url = new URL(s);
        if (url.hostname.includes('cloudinary.com')) return 'cloudinary_url';
        return 'external_url';
      } catch (e) {
        return 'external_url';
      }
    }
    return 'cloudinary_public_id';
  }
  if (typeof item === 'object') {
    const src = item.src || item.url || '';
    if (!src) return 'object_no_src';
    if (typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'))) {
      try {
        const url = new URL(src);
        if (url.hostname.includes('cloudinary.com')) return 'cloudinary_url';
        return 'external_url';
      } catch (e) {
        return 'external_url';
      }
    }
    return 'object_non_http_src';
  }
  return 'unknown';
}

const report = {
  totalListings: rows.length,
  listings: []
};

for (const r of rows) {
  let parsed = [];
  try {
    parsed = JSON.parse(r.images || '[]');
  } catch (e) {
    parsed = [];
  }
  const counts = {
    cloudinary_url: 0,
    cloudinary_public_id: 0,
    external_url: 0,
    object_no_src: 0,
    object_non_http_src: 0,
    unknown: 0,
  };
  const details = [];
  for (const item of parsed) {
    const cls = classifyImageItem(item);
    counts[cls] = (counts[cls] || 0) + 1;
    details.push({ raw: item, class: cls });
  }
  report.listings.push({ id: r.id, title: r.title, counts, total: parsed.length, details });
}

fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
console.log('Scan complete. Report written to', outPath);
process.exit(0);
