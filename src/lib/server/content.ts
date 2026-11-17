import * as v from "valibot";
import type { D1Database } from "@cloudflare/workers-types";
import { DOCUMENT_KEYS, schemas, type DocumentKey } from "$lib/content/schemas";

/**
 * Data layer for the admin: each content block has a draft (edited + previewed) and a
 * published copy (used by the next site build). Publishing keeps the previous version
 * so it can be restored.
 */

const MAX_VERSIONS_PER_DOCUMENT = 30;

type Row = {
    key: string;
    draft: string;
    published: string | null;
    updated_at: string;
    updated_by: string | null;
    published_at: string | null;
    published_by: string | null;
};

export type DocumentInfo = {
    key: DocumentKey;
    exists: boolean;
    draft: unknown;
    published: unknown;
    hasUnpublishedChanges: boolean;
    updatedAt: string | null;
    updatedBy: string | null;
    publishedAt: string | null;
};

export type ContentError = { ok: false; message: string; issues?: string[] };
type Ok<T = object> = { ok: true } & T;

const now = () => new Date().toISOString();

function toInfo(key: DocumentKey, row: Row | undefined | null): DocumentInfo {
    if (!row) {
        return {
            key,
            exists: false,
            draft: null,
            published: null,
            hasUnpublishedChanges: false,
            updatedAt: null,
            updatedBy: null,
            publishedAt: null,
        };
    }
    return {
        key,
        exists: true,
        draft: JSON.parse(row.draft),
        published: row.published ? JSON.parse(row.published) : null,
        hasUnpublishedChanges: row.draft !== row.published,
        updatedAt: row.updated_at,
        updatedBy: row.updated_by,
        publishedAt: row.published_at,
    };
}

export async function getDocuments(db: D1Database): Promise<DocumentInfo[]> {
    const { results } = await db.prepare("SELECT * FROM documents").all<Row>();
    return DOCUMENT_KEYS.map((key) => toInfo(key, results.find((r) => r.key === key)));
}

export async function getDocument(db: D1Database, key: DocumentKey): Promise<DocumentInfo> {
    const row = await db.prepare("SELECT * FROM documents WHERE key = ?1").bind(key).first<Row>();
    return toInfo(key, row);
}

export async function logAudit(db: D1Database, email: string, action: string, detail?: string) {
    await db
        .prepare("INSERT INTO audit_log (at, email, action, detail) VALUES (?1, ?2, ?3, ?4)")
        .bind(now(), email, action, detail ?? null)
        .run();
}

/** Validates and stores the draft. Does not change what is published. */
export async function saveDraft(
    db: D1Database,
    key: DocumentKey,
    input: unknown,
    email: string,
): Promise<Ok | ContentError> {
    const parsed = v.safeParse(schemas[key], input);
    if (!parsed.success) {
        return {
            ok: false,
            message: "Die Eingaben sind nicht gültig.",
            issues: parsed.issues.slice(0, 10).map((i) => i.message),
        };
    }

    const json = JSON.stringify(parsed.output);
    const ts = now();
    await db.batch([
        db
            .prepare(
                `INSERT INTO documents (key, draft, updated_at, updated_by) VALUES (?1, ?2, ?3, ?4)
                 ON CONFLICT(key) DO UPDATE SET draft = ?2, updated_at = ?3, updated_by = ?4`,
            )
            .bind(key, json, ts, email),
        db
            .prepare("INSERT INTO audit_log (at, email, action, detail) VALUES (?1, ?2, 'save_draft', ?3)")
            .bind(ts, email, key),
    ]);
    return { ok: true };
}

/** Makes the draft the published version and keeps the previous published state as a version. */
export async function publish(db: D1Database, key: DocumentKey, email: string): Promise<Ok | ContentError> {
    const row = await db.prepare("SELECT * FROM documents WHERE key = ?1").bind(key).first<Row>();
    if (!row) return { ok: false, message: "Es gibt noch keinen Entwurf zum Veröffentlichen." };

    const ts = now();
    const statements = [];
    if (row.published) {
        statements.push(
            db
                .prepare(
                    "INSERT INTO document_versions (key, data, created_at, created_by, note) VALUES (?1, ?2, ?3, ?4, 'vor Veröffentlichung')",
                )
                .bind(key, row.published, ts, email),
            db
                .prepare(
                    `DELETE FROM document_versions WHERE key = ?1 AND id NOT IN
                     (SELECT id FROM document_versions WHERE key = ?1 ORDER BY id DESC LIMIT ?2)`,
                )
                .bind(key, MAX_VERSIONS_PER_DOCUMENT),
        );
    }
    statements.push(
        db
            .prepare("UPDATE documents SET published = draft, published_at = ?2, published_by = ?3 WHERE key = ?1")
            .bind(key, ts, email),
        db
            .prepare("INSERT INTO audit_log (at, email, action, detail) VALUES (?1, ?2, 'publish', ?3)")
            .bind(ts, email, key),
    );
    await db.batch(statements);
    return { ok: true };
}

export type VersionInfo = { id: number; createdAt: string; createdBy: string | null; note: string | null };

export async function listVersions(db: D1Database, key: DocumentKey): Promise<VersionInfo[]> {
    const { results } = await db
        .prepare(
            "SELECT id, created_at, created_by, note FROM document_versions WHERE key = ?1 ORDER BY id DESC LIMIT ?2",
        )
        .bind(key, MAX_VERSIONS_PER_DOCUMENT)
        .all<{ id: number; created_at: string; created_by: string | null; note: string | null }>();
    return results.map((r) => ({ id: r.id, createdAt: r.created_at, createdBy: r.created_by, note: r.note }));
}

/** Copies an older version into the draft (it still has to be published afterwards). */
export async function restoreVersionToDraft(
    db: D1Database,
    key: DocumentKey,
    versionId: number,
    email: string,
): Promise<Ok | ContentError> {
    const version = await db
        .prepare("SELECT data FROM document_versions WHERE id = ?1 AND key = ?2")
        .bind(versionId, key)
        .first<{ data: string }>();
    if (!version) return { ok: false, message: "Diese Version wurde nicht gefunden." };

    return saveDraft(db, key, JSON.parse(version.data), email);
}

/** Throws away unpublished changes: the draft becomes the published version again. */
export async function discardDraft(db: D1Database, key: DocumentKey, email: string): Promise<Ok | ContentError> {
    const row = await db.prepare("SELECT published FROM documents WHERE key = ?1").bind(key).first<{ published: string | null }>();
    if (!row?.published) return { ok: false, message: "Es gibt keinen veröffentlichten Stand, auf den zurückgesetzt werden kann." };

    const ts = now();
    await db.batch([
        db.prepare("UPDATE documents SET draft = published, updated_at = ?2, updated_by = ?3 WHERE key = ?1").bind(key, ts, email),
        db.prepare("INSERT INTO audit_log (at, email, action, detail) VALUES (?1, ?2, 'discard_draft', ?3)").bind(ts, email, key),
    ]);
    return { ok: true };
}
