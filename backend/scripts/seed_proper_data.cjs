const dotenv = require('dotenv');
const path = require('path');
const Database = require('better-sqlite3');
const { v2: cloudinary } = require('cloudinary');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const DB_PATH = path.join(__dirname, '..', 'otulia.db');
const db = new Database(DB_PATH);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const LISTINGS_DATA = [
  { id: 1, type: 'car',   title: 'Lamborghini Revuelto',     subtitle: 'Hybrid V12 Hypercar',       price: 530000,  currency: '€', location: 'Munich, Germany',         is_featured: 1, specs: { year: '2024', mileage: '500 km', fuel: 'Hybrid', engine: '6.5L V12 + 3 e-motors', transmission: '8-speed DCT', color: 'Verde Gea' } },
  { id: 2, type: 'estate', title: 'Azure Heights Estate',     subtitle: 'Modern Cliffside Villa',    price: 8500000, currency: '€', location: 'Santorini, Greece',       is_featured: 0, specs: { type: 'Villa', bedrooms: '6', bathrooms: '5', area: '650 m²', pool: 'Infinity', year: '2023' } },
  { id: 4, type: 'car',   title: 'Ferrari Daytona SP3',       subtitle: 'Limited Edition Icon',      price: 2200000, currency: '€', location: 'Maranello, Italy',        is_featured: 1, specs: { year: '2024', mileage: '200 km', fuel: 'Petrol', engine: '6.5L V12', transmission: '7-speed DCT', color: 'Rosso Corsa' } },
  { id: 5, type: 'estate', title: 'Obsidian Penthouse',       subtitle: 'Sky-High Luxury Suite',     price: 12000000, currency: '€', location: 'Dubai Marina, UAE',        is_featured: 1, specs: { type: 'Penthouse', bedrooms: '4', bathrooms: '4', area: '850 m²', pool: 'Private', year: '2022' } },
  { id: 7, type: 'car',   title: 'Bugatti Chiron Pur Sport',  subtitle: '8.0L W16 Quad-Turbo',       price: 3600000, currency: '€', location: 'Monte Carlo, Monaco',      is_featured: 1, specs: { year: '2023', mileage: '800 km', fuel: 'Petrol', engine: '8.0L W16', transmission: '7-speed DCT', color: 'Nocturne Black' } },
  { id: 9, type: 'car',   title: 'Porsche 911 Turbo S',       subtitle: 'Everyday Supercar',         price: 210000,  currency: '€', location: 'Stuttgart, Germany',       is_featured: 0, specs: { year: '2024', mileage: '0 km', fuel: 'Petrol', engine: '3.8L Twin-Turbo H6', transmission: '8-speed DCT', color: 'GT Silver' } },
  { id: 10, type: 'car',  title: 'McLaren Artura',            subtitle: 'Hybrid V6 Supercar',        price: 285000,  currency: '€', location: 'Surrey, United Kingdom',   is_featured: 0, specs: { year: '2024', mileage: '600 km', fuel: 'Hybrid', engine: '3.0L V6 Twin-Turbo', transmission: '8-speed DCT', color: 'Aurora Blue' } },
  { id: 11, type: 'estate', title: 'Hillside Retreat',        subtitle: 'Secluded Mountain Estate',  price: 4500000, currency: '€', location: 'Aspen, Colorado, USA',      is_featured: 0, specs: { type: 'Mountain Estate', bedrooms: '5', bathrooms: '4', area: '720 m²', pool: 'Heated', year: '2021' } },
  { id: 12, type: 'estate', title: 'Royal Palm Residence',    subtitle: 'Waterfront Mediterranean',  price: 6800000, currency: '€', location: 'Porto Cervo, Sardinia',    is_featured: 1, specs: { type: 'Coastal Villa', bedrooms: '7', bathrooms: '6', area: '1100 m²', pool: 'Olympic', year: '2023' } },
];

async function fetchCloudinaryImages(listingId) {
  const folder = `otulia/listings/l${listingId}`;
  try {
    const prefix = folder.endsWith('/') ? folder : `${folder}/`;
    const res = await cloudinary.api.resources({ type: 'upload', prefix, resource_type: 'image', max_results: 30 });
    return (res.resources || []).map(r => ({
      src: `${r.secure_url}`,
      alt: r.public_id.split('/').pop().replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      width: r.width || 0,
      height: r.height || 0,
      format: r.format || 'jpg',
      loading: 'auto',
    }));
  } catch (e) {
    console.error(`  Cloudinary fetch failed for ${folder}:`, e.message);
    return [];
  }
}

(async () => {
  console.log('Clearing existing listings...');
  db.exec('DELETE FROM listings');
  db.exec("DELETE FROM sqlite_sequence WHERE name='listings'");

  let totalSynced = 0;

  for (const data of LISTINGS_DATA) {
    const imagesJson = JSON.stringify([]);
    const specsJson = JSON.stringify(data.specs);
    db.prepare(
      `INSERT INTO listings (id, type, title, subtitle, price, currency, location, images, specs, is_featured, dealer_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(data.id, data.type, data.title, data.subtitle, data.price, data.currency, data.location, imagesJson, specsJson, data.is_featured, null);

    const images = await fetchCloudinaryImages(data.id);
    if (images.length > 0) {
      db.prepare('UPDATE listings SET images = ? WHERE id = ?').run(JSON.stringify(images), data.id);
      totalSynced += images.length;
      console.log(`  l${data.id}: ${data.title} — synced ${images.length} images`);
    } else {
      console.log(`  l${data.id}: ${data.title} — NO images found in Cloudinary`);
    }
  }

  console.log(`\nDone. Seeded ${LISTINGS_DATA.length} listings. Total images synced: ${totalSynced}`);
  process.exit(0);
})();
