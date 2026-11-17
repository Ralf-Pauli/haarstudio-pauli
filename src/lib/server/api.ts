import { error, json, type RequestEvent } from "@sveltejs/kit";
import type { D1Database } from "@cloudflare/workers-types";
import { isDocumentKey, type DocumentKey } from "$lib/content/schemas";

const MAX_BODY_BYTES = 1_000_000;

/** Admin identity (set and verified in hooks.server.ts) – never trust anything else. */
export function requireAdmin(event: RequestEvent): string {
    const email = event.locals.adminEmail;
    if (!email) error(403, "Kein Zugriff.");
    return email;
}

export function requireDb(event: RequestEvent): D1Database {
    const db = event.platform?.env?.DB;
    if (!db) error(503, "Die Datenbank ist nicht verbunden.");
    return db;
}

export function requireKey(event: RequestEvent): DocumentKey {
    const key = event.params.key ?? "";
    if (!isDocumentKey(key)) error(404, "Unbekannter Inhalt.");
    return key;
}

export async function readJson(request: Request): Promise<unknown> {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) error(413, "Die Anfrage ist zu groß.");
    try {
        return JSON.parse(text);
    } catch {
        error(400, "Ungültige Daten.");
    }
}

export const failure = (message: string, status = 400, issues?: string[]) =>
    json({ ok: false, message, issues }, { status });
