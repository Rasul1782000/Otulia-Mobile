const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const tests = [
  { name: 'test1_key', key: process.env.CLOUDINARY_API_KEY, secret: process.env.CLOUDINARY_API_SECRET },
  { name: 'test2_key', key: process.env.CLOUDINARY_API_KEY, secret: process.env.CLOUDINARY_API_SECRET },
  { name: 'test3_key', key: process.env.CLOUDINARY_API_KEY_2, secret: process.env.CLOUDINARY_API_SECRET_2 },
  { name: 'test4_key', key: process.env.CLOUDINARY_API_KEY_2, secret: process.env.CLOUDINARY_API_SECRET_2 },
];

async function listFolderImages(cfg, folder, maxResults = 50) {
  try {
    cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: cfg.key, api_secret: cfg.secret, secure: true });
    const pref = folder.endsWith('/') ? folder : `${folder}/`;
    const res = await cloudinary.api.resources({ type: 'upload', prefix: pref, max_results: maxResults, resource_type: 'image' });
    return (res.resources || []).map(r => ({ public_id: r.public_id, secure_url: r.secure_url, width: r.width, height: r.height, format: r.format }));
  } catch (err) {
    return { error: err && err.message ? err.message : String(err) };
  }
}

(async () => {
  for (const t of tests) {
    const result = { test: t.name, key: t.key ? 'present' : 'missing', listings: {} };
    for (let id = 1; id <= 10; id++) {
      const folder = `otulia/listings/l${id}`;
      const images = await listFolderImages(t, folder, 20);
      result.listings[`l${id}`] = images;
    }
    const outPath = path.join(__dirname, `${t.name}.json`);
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
    console.log('Wrote', outPath);
  }
})();
