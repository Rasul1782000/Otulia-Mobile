const fs = require('fs');

(async () => {
  const fetch = globalThis.fetch;
  const urls = [];

  for (const page of [1, 2]) {
    try {
      const res = await fetch(`http://localhost:3000/api/listings?limit=10&page=${page}`);
      const j = await res.json();
      if (Array.isArray(j.listings)) {
        j.listings.forEach(l => {
          if (Array.isArray(l.images)) {
            l.images.forEach(img => {
              if (typeof img === 'string') urls.push(img);
              else if (img && img.src) urls.push(img.src);
            });
          }
        });
      }
    } catch (e) {
      console.error('Failed to fetch listings page', page, e && e.message ? e.message : e);
    }
  }

  console.log('Found', urls.length, 'image URLs');
  const results = [];
  for (const u of urls) {
    const start = Date.now();
    try {
      const r = await fetch(u);
      const ab = await r.arrayBuffer();
      const ms = Date.now() - start;
      console.log(u, r.status, ab.byteLength, ms + 'ms');
      results.push({ url: u, status: r.status, bytes: ab.byteLength, ms });
    } catch (err) {
      const ms = Date.now() - start;
      console.log(u, 'ERROR', err && err.message ? err.message : err, ms + 'ms');
      results.push({ url: u, status: 'error', error: err && err.message ? err.message : String(err), ms });
    }
  }

  fs.writeFileSync('backend/scripts/image_load_test_results.json', JSON.stringify({ found: urls.length, results }, null, 2));
  console.log('Wrote backend/scripts/image_load_test_results.json');
})();
