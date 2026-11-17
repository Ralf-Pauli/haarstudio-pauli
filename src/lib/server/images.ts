import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import { parseJpegSize } from "$lib/server/jpeg";

/**
 * Uploaded photos. The browser already shrinks and re-encodes every photo to JPEG (this also strips
 * location data), the server accepts nothing else and re-checks everything.
 */

export const MAX_UPLOAD_BYTES = 6_000_000;
export const MAX_SIDE = 4000;
export const MIN_SIDE = 200;
export const MAX_PIXELS = 16_000_000;
export const MAX_IMAGES = 300;

export const IMAGE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

type Failure = { ok: false; status: number; message: string };
type Stored = { ok: true; id: string; width: number; height: number };

export async function storeImage(
    db: D1Database,
    bucket: R2Bucket,
    bytes: Uint8Array,
    email: string,
): Promise<Stored | Failure> {
    if (bytes.byteLength === 0) return { ok: false, status: 400, message: "Die Datei ist leer." };
    if (bytes.byteLength > MAX_UPLOAD_BYTES) {
        return { ok: false, status: 413, message: "Das Foto ist zu groß (höchstens 6 MB)." };
    }

    const size = parseJpegSize(bytes);
    if (!size) return { ok: false, status: 415, message: "Das ist kein gültiges Foto (nur JPEG)." };
    if (size.width < MIN_SIDE || size.height < MIN_SIDE) {
        return { ok: false, status: 422, message: "Das Foto ist zu klein." };
    }
    if (size.width > MAX_SIDE || size.height > MAX_SIDE || size.width * size.height > MAX_PIXELS) {
        return { ok: false, status: 422, message: "Das Foto hat zu viele Pixel." };
    }

    const count = await db.prepare("SELECT COUNT(*) AS n FROM images").first<{ n: number }>();
    if ((count?.n ?? 0) >= MAX_IMAGES) {
        return { ok: false, status: 409, message: "Es sind schon sehr viele Fotos gespeichert. Bitte den Webmaster fragen." };
    }

    const id = crypto.randomUUID();
    const key = `gallery/${id}.jpg`;
    await bucket.put(key, bytes, { httpMetadata: { contentType: "image/jpeg" } });

    try {
        await db.batch([
            db
                .prepare(
                    "INSERT INTO images (id, r2_key, mime, bytes, width, height, created_at, created_by) VALUES (?1, ?2, 'image/jpeg', ?3, ?4, ?5, ?6, ?7)",
                )
                .bind(id, key, bytes.byteLength, size.width, size.height, new Date().toISOString(), email),
            db
                .prepare("INSERT INTO audit_log (at, email, action, detail) VALUES (?1, ?2, 'upload_image', ?3)")
                .bind(new Date().toISOString(), email, id),
        ]);
    } catch {
        await bucket.delete(key);
        return { ok: false, status: 500, message: "Das Foto konnte nicht gespeichert werden." };
    }

    return { ok: true, id, width: size.width, height: size.height };
}

export async function getImageObject(db: D1Database, bucket: R2Bucket, id: string) {
    if (!IMAGE_ID.test(id)) return null;
    const row = await db.prepare("SELECT r2_key FROM images WHERE id = ?1").bind(id).first<{ r2_key: string }>();
    if (!row) return null;
    return bucket.get(row.r2_key);
}

/** Returns the ids from `ids` that exist in the images table (D1 allows at most 100 bound values per query). */
export async function existingImageIds(db: D1Database, ids: string[]): Promise<Set<string>> {
    const found = new Set<string>();
    const CHUNK = 80;
    for (let i = 0; i < ids.length; i += CHUNK) {
        const chunk = ids.slice(i, i + CHUNK);
        const placeholders = chunk.map((_, n) => `?${n + 1}`).join(",");
        const { results } = await db
            .prepare(`SELECT id FROM images WHERE id IN (${placeholders})`)
            .bind(...chunk)
            .all<{ id: string }>();
        for (const row of results) found.add(row.id);
    }
    return found;
}
