// Runs before `vite build`: pulls the PUBLISHED admin content from Cloudflare D1 into static/data/*.json
// so the public site is built from it.
//
// Needs these build variables (Cloudflare Pages > Settings > Variables and secrets):
//   CF_ACCOUNT_ID, CF_API_TOKEN (D1 read), D1_DATABASE_ID
// Without them (local builds, forks) this script does nothing and the JSON files in the repo are used.
// If they ARE set and anything goes wrong, the build fails on purpose, so the live site keeps
// its previous content instead of silently publishing stale data.
import { writeFileSync } from "node:fs";

const { CF_ACCOUNT_ID, CF_API_TOKEN, D1_DATABASE_ID } = process.env;

if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !D1_DATABASE_ID) {
    console.log("[fetch-content] not configured, using content from the repository");
    process.exit(0);
}

const OUTPUT = {
    prices: "categories.json",
    texts: "texts.json",
    gallery: "gallery.json",
};

try {
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/query`,
        {
            method: "POST",
            headers: { authorization: `Bearer ${CF_API_TOKEN}`, "content-type": "application/json" },
            body: JSON.stringify({ sql: "SELECT key, published FROM documents WHERE published IS NOT NULL" }),
        },
    );
    const body = await response.json();
    if (!response.ok || !body.success) {
        throw new Error(`D1 query failed: ${JSON.stringify(body.errors ?? response.status)}`);
    }

    const rows = body.result?.[0]?.results ?? [];
    let written = 0;
    for (const row of rows) {
        const file = OUTPUT[row.key];
        if (!file) continue;
        const data = JSON.parse(row.published); // throws on corrupt data
        writeFileSync(new URL(`../static/data/${file}`, import.meta.url), JSON.stringify(data, null, 2) + "\n");
        written++;
        console.log(`[fetch-content] ${row.key} -> static/data/${file}`);
    }
    console.log(`[fetch-content] done (${written} documents)`);
} catch (error) {
    console.error("[fetch-content] failed:", error);
    process.exit(1);
}
