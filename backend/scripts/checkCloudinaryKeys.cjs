const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const { v2: cloudinary } = require('cloudinary');

async function testKey(key, secret, label) {
  try {
    cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: key, api_secret: secret, secure: true });
    const ping = await cloudinary.api.ping();
    return { label, ok: true, ping };
  } catch (err) {
    return { label, ok: false, message: err && err.message ? err.message : String(err) };
  }
}

(async () => {
  const results = [];
  const key1 = process.env.CLOUDINARY_API_KEY;
  const secret1 = process.env.CLOUDINARY_API_SECRET;
  const key2 = process.env.CLOUDINARY_API_KEY_2;
  const secret2 = process.env.CLOUDINARY_API_SECRET_2;

  if (key1 && secret1) {
    results.push(await testKey(key1, secret1, 'key1'));
  } else {
    results.push({ label: 'key1', ok: false, message: 'missing in .env' });
  }

  if (key2 && secret2) {
    results.push(await testKey(key2, secret2, 'key2'));
  } else {
    results.push({ label: 'key2', ok: false, message: 'missing in .env' });
  }

  const outPath = path.join(__dirname, 'cloudinary_keys_check.json');
  fs.writeFileSync(outPath, JSON.stringify({ timestamp: new Date().toISOString(), results }, null, 2), 'utf8');
  console.log('Wrote', outPath);
})();
