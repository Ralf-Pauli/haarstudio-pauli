// Runs before `vite build`: pulls the PUBLISHED admin content into the project so the public site is built from it.
//   - published documents from Cloudflare D1  -> static/data/*.json
//   - uploaded gallery photos from Cloudflare R2 -> src/lib/assets/uploads/<id>.jpg
//
// Build variables (Cloudflare Pages > Settings > Variables and secrets):
//   CF_ACCOUNT_ID, CF_API_TOKEN (D1 read), D1_DATABASE_ID                      -> documents
//   R2_BUCKET_NAME, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY (read-only R2 token) -> uploaded photos
// Without the D1 variables (local builds, forks) this script does nothing and the files in the repository are used.
// If they ARE set and anything goes wrong, the build fails on purpose, so the live site keeps its previous
// content instead of silently publishing stale or incomplete data.
//
// Test-only overrides: CF_API_BASE, R2_ENDPOINT, OUTPUT_ROOT.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { AwsClient } from "aws4fetch";

const env = process.env;
const { CF_ACCOUNT_ID, CF_API_TOKEN, D1_DATABASE_ID } = env;

if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !D1_DATABASE_ID) {
    console.log("[fetch-content] not configured, using content from the repository");
    process.exit(0);
}

const root = env.OUTPUT_ROOT ? new URL(`file:///${env.OUTPUT_ROOT.replaceAll("\\", "/")}/`) : new URL("../", import.meta.url);
const path = (p) => fileURLToPath(new URL(p, root));
const API_BASE = env.CF_API_BASE ?? "https://api.cloudflare.com/client/v4";
const IMAGE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const OUTPUT = {
    prices: "categories.json",
    texts: "texts.json",
    gallery: "gallery.json",
};

async function queryDocuments() {
    const response = await fetch(`${API_BASE}/accounts/${CF_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/query`, {
        method: "POST",
        headers: { authorization: `Bearer ${CF_API_TOKEN}`, "content-type": "application/json" },
        body: JSON.stringify({ sql: "SELECT key, published FROM documents WHERE published IS NOT NULL" }),
    });
    const body = await response.json();
    if (!response.ok || !body.success) {
        throw new Error(`D1 query failed: ${JSON.stringify(body.errors ?? response.status)}`);
    }
    return body.result?.[0]?.results ?? [];
}

async function downloadImages(ids) {
    const { R2_BUCKET_NAME, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = env;
    if (!R2_BUCKET_NAME || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
        throw new Error("The gallery contains uploaded photos but R2_BUCKET_NAME / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY are not set");
    }
    const endpoint = env.R2_ENDPOINT ?? `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const r2 = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" });

    const dir = path("src/lib/assets/uploads/");
    rmSync(dir, { recursive: true, force: true }); // drop photos that are no longer published
    mkdirSync(dir, { recursive: true });

    for (const id of ids) {
        const response = await r2.fetch(`${endpoint}/${R2_BUCKET_NAME}/gallery/${id}.jpg`);
        if (!response.ok) throw new Error(`Photo ${id} could not be downloaded (${response.status})`);
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.length < 100 || bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error(`Photo ${id} is not a valid JPEG`);
        writeFileSync(path(`src/lib/assets/uploads/${id}.jpg`), bytes);
    }
    console.log(`[fetch-content] ${ids.length} photos -> src/lib/assets/uploads`);
}

try {
    const rows = await queryDocuments();
    mkdirSync(path("static/data/"), { recursive: true });

    let written = 0;
    for (const row of rows) {
        const file = OUTPUT[row.key];
        if (!file) continue;
        const data = JSON.parse(row.published); // throws on corrupt data

        if (row.key === "gallery") {
            const ids = [...new Set(data.map((p) => p.imageId).filter(Boolean))];
            if (ids.some((id) => !IMAGE_ID.test(id))) throw new Error("The gallery contains an invalid photo id");
            await downloadImages(ids);
        }

        writeFileSync(path(`static/data/${file}`), JSON.stringify(data, null, 2) + "\n");
        written++;
        console.log(`[fetch-content] ${row.key} -> static/data/${file}`);
    }
    console.log(`[fetch-content] done (${written} documents)`);
} catch (error) {
    console.error("[fetch-content] failed:", error);
    process.exit(1);
}
