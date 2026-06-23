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

function insertListing(type, title, price = 1, location = 'Unknown') {
  const stmt = db.prepare('INSERT INTO listings (type, title, subtitle, price, currency, location, images, specs, is_featured, dealer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const info = stmt.run(type, title, null, price, '€', location, JSON.stringify([]), JSON.stringify({}), 0, null);
  return info.lastInsertRowid;
}

async function fetchAndCache(folder, id) {
  try {
    const prefix = folder.endsWith('/') ? folder : `${folder}/`;
    const res = await cloudinary.api.resources({ type: 'upload', prefix, resource_type: 'image', max_results: 100 });
    const resources = (res.resources || []).map(r => ({
      src: r.secure_url || (`https://res.cloudinary.com/${r.cloud_name}/image/upload/${r.public_id}`),
      alt: r.public_id.split('/').pop().replace(/[-_]/g, ' '),
      width: r.width || 0,
      height: r.height || 0,
      format: r.format || 'jpg',
      loading: 'auto',
    }));
    if (resources.length > 0) {
      db.prepare('UPDATE listings SET images = ? WHERE id = ?').run(JSON.stringify(resources), id);
      return resources.length;
    }
    return 0;
  } catch (e) {
    console.error('Cloudinary fetch failed for', folder, e && e.message ? e.message : e);
    return 0;
  }
}

(async () => {
  try {
    const toCreate = 5;
    const created = [];
    for (let i = 0; i < toCreate; i++) {
      const title = `Seed Car ${Date.now()}-${i}`;
      const id = insertListing('car', title, 100000 + i, 'Seed Location');
      created.push(id);
      console.log('Inserted listing id', id);
    }

    let totalCached = 0;
    for (const id of created) {
      const folder = `otulia/listings/l${id}`;
      const count = await fetchAndCache(folder, id);
      console.log(`Synced ${count} images for listing ${id} (folder ${folder})`);
      totalCached += count;
    }

    console.log(`Done. Inserted ${created.length} listings. Cached images for ${totalCached} images.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
