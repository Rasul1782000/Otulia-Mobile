const dotenv = require('dotenv');
const path = require('path');
const Database = require('better-sqlite3');
const cloudinary = require('cloudinary').v2;

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const DB_PATH = path.join(__dirname, '..', 'otulia.db');
const db = new Database(DB_PATH);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function fetchResources(folder) {
  try {
    const prefix = folder.endsWith('/') ? folder : `${folder}/`;
    const res = await cloudinary.api.resources({ type: 'upload', prefix, resource_type: 'image', max_results: 100 });
    return res.resources || [];
  } catch (e) {
    console.error('Cloudinary fetch failed for', folder, e && e.message ? e.message : e);
    return [];
  }
}

function upsertListingWithId(id, title, type = 'car') {
  const exists = db.prepare('SELECT id FROM listings WHERE id = ?').get(id);
  if (exists) return false;
  db.prepare('INSERT INTO listings (id, type, title, subtitle, price, currency, location, images, specs, is_featured, dealer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, type, title, null, 100000, '€', 'Synced', JSON.stringify([]), JSON.stringify({}), 0, null);
  return true;
}

(async () => {
  let created = 0;
  let imagesCached = 0;
  for (let i = 1; i <= 10; i++) {
    const folder = `otulia/listings/l${i}`;
    const title = `Auto synched listing l${i}`;
    const wasCreated = upsertListingWithId(i, title, 'car');
    if (wasCreated) created++;
    const resources = await fetchResources(folder);
    if (resources.length > 0) {
      const mapped = resources.map(r => ({
        src: r.secure_url || `https://res.cloudinary.com/${r.cloud_name}/image/upload/${r.public_id}`,
        alt: (r.public_id || '').split('/').pop().replace(/[-_]/g, ' '),
        width: r.width || 0,
        height: r.height || 0,
        format: r.format || 'jpg',
        loading: 'auto',
      }));
      db.prepare('UPDATE listings SET images = ? WHERE id = ?').run(JSON.stringify(mapped), i);
      imagesCached += mapped.length;
      console.log(`Cached ${mapped.length} images for listing ${i}`);
    } else {
      console.log(`No images for listing ${i}`);
    }
  }

  console.log(`Done. Created ${created} rows. Cached total ${imagesCached} images.`);
  process.exit(0);
})();
