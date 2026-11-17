// Prints SQL that creates the initial admin content from the files currently in the repo,
// so the admin starts with today's prices. Usage:
//   node scripts/seed-sql.mjs > seed.sql
//   npx wrangler d1 execute haarstudio-admin --remote --file=seed.sql
// Existing rows are left untouched (INSERT OR IGNORE), so running it twice is safe.
import { readFileSync } from "node:fs";

const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;
const now = new Date().toISOString();

const prices = JSON.parse(readFileSync(new URL("../static/data/categories.json", import.meta.url), "utf-8"));
const texts = { quote: "", author: "", text: "", holidayNote: "", directions: [] };
const gallery = [];

const docs = { prices, texts, gallery };

for (const [key, value] of Object.entries(docs)) {
    const json = JSON.stringify(value);
    console.log(
        `INSERT OR IGNORE INTO documents (key, draft, published, updated_at, updated_by, published_at, published_by) ` +
            `VALUES (${quote(key)}, ${quote(json)}, ${quote(json)}, ${quote(now)}, 'seed', ${quote(now)}, 'seed');`,
    );
}
