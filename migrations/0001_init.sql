-- Haarstudio Pauli admin: initial schema (Cloudflare D1)
-- Apply with: npx wrangler d1 migrations apply haarstudio-admin --remote

-- One row per editable content block ("prices", "texts", "gallery").
-- `draft` is what the admin edits and previews; `published` is what the next build uses.
CREATE TABLE IF NOT EXISTS documents (
    key          TEXT PRIMARY KEY,
    draft        TEXT NOT NULL,
    published    TEXT,
    updated_at   TEXT NOT NULL,
    updated_by   TEXT,
    published_at TEXT,
    published_by TEXT
);

-- Every publish stores the previous published state so it can be restored.
CREATE TABLE IF NOT EXISTS document_versions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    key        TEXT NOT NULL,
    data       TEXT NOT NULL,
    created_at TEXT NOT NULL,
    created_by TEXT,
    note       TEXT
);
CREATE INDEX IF NOT EXISTS idx_versions_key ON document_versions (key, id DESC);

-- Uploaded images (the files themselves live in R2 under `r2_key`).
CREATE TABLE IF NOT EXISTS images (
    id         TEXT PRIMARY KEY,
    r2_key     TEXT NOT NULL UNIQUE,
    mime       TEXT NOT NULL,
    bytes      INTEGER NOT NULL,
    width      INTEGER NOT NULL,
    height     INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    created_by TEXT
);

-- Who changed what.
CREATE TABLE IF NOT EXISTS audit_log (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    at     TEXT NOT NULL,
    email  TEXT NOT NULL,
    action TEXT NOT NULL,
    detail TEXT
);
