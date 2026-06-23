const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function run() {
  try {
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'MISSING',
      api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'MISSING',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'MISSING',
    });

    const ping = await cloudinary.api.ping();
    console.log('Ping result:', ping);

    const resources = await cloudinary.api.resources({ prefix: 'otulia/', max_results: 5, resource_type: 'image', type: 'upload' });
    console.log('Found resources:', resources.resources ? resources.resources.length : 0);
    if (resources.resources && resources.resources.length > 0) {
      for (const r of resources.resources) {
        console.log('-', r.public_id, r.format, `${r.width}x${r.height}`);
      }
    }
  } catch (err) {
    console.error('Cloudinary check failed:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

run();
