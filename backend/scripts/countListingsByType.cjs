const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'otulia.db'), { readonly: true });
const rows = db.prepare("SELECT type, COUNT(*) as count FROM listings GROUP BY type ORDER BY type").all();
console.log('Counts by type:');
for (const r of rows) console.log(r.type, r.count);
const total = db.prepare('SELECT COUNT(*) as count FROM listings').get();
console.log('Total listings:', total.count);
