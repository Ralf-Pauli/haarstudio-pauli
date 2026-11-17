# Admin area – plan

Goal: the salon owner (non-technical) can change **prices, texts and gallery photos** herself, without
logging into a separate service. Everything lives in this repository and on Cloudflare.

## Architecture

| Piece | Choice |
|---|---|
| Admin UI | SvelteKit routes under `/admin` (German UI, own layout, no public navbar) |
| Content | Cloudflare **D1** (`documents`: prices, texts, gallery; each with a draft and a published copy) |
| Images | Cloudflare **R2** (originals, size-capped in the browser before upload) |
| Login | Cloudflare **Access** (email one-time code, no password) **plus** token verification in the app |
| Publishing | "Veröffentlichen" → Pages **deploy hook** → build downloads the published content/images → static site |
| Public site | Static files built by SvelteKit (`enhanced:img` keeps working for all images) |

### Why rebuild on publish (instead of reading D1 on every page view)
- `enhanced:img` resizes at build time, so uploaded images must exist when the build runs.
- Static assets are free and unlimited; Workers free plan has 100,000 requests/day.
- The public site does not depend on D1/R2 being up. A failed build leaves the old site live.

## Login

1. `/admin` is protected by a Cloudflare Access application (self-hosted, path `/admin/*` and `/api/admin/*`).
2. She enters her email, receives a 6 digit code (valid 10 minutes, single use) and signs in.
3. Access sets a session cookie; every request carries a signed token (`Cf-Access-Jwt-Assertion`).
4. `src/hooks.server.ts` verifies that token (signature via Access JWKS, issuer, audience) on **every** admin
   request and optionally checks an `ADMIN_EMAILS` allow-list. Without configuration the admin **fails closed** (503).

The in-app check is required because the site is also reachable on its `*.pages.dev` address.

## Security measures

- Access + in-app token verification (see above); admin responses are `no-store`, `noindex`, `X-Frame-Options: DENY`.
- CSRF: writes must send `Origin` equal to the site origin and the header `x-admin-request: 1`.
- All input is validated with valibot schemas (`src/lib/content/schemas.ts`) before saving; length limits everywhere.
- SQL only through prepared statements. Admin text is never rendered as HTML.
- Draft/published model with versions (last 30 per document) so mistakes can be undone; audit log of changes.
- Uploads (next step): JPEG/PNG/WebP only (no SVG), real file signature check, size and pixel limits, random keys.
- Standard security headers on all pages. A Content-Security-Policy is a follow-up (the booking widget and
  Google Maps need to be allow-listed and tested first).

## Known risks

| Risk | Mitigation |
|---|---|
| Her mailbox is compromised | 2-step verification on her email, reasonable session length, audit log |
| Access bypass via `pages.dev` | In-app token check |
| Stored XSS | Text-only rendering, validation |
| Malicious/huge upload | Type + signature check, size/pixel limits |
| Wrong edit | Draft + preview + restore |
| Leaked deploy hook URL | Treat as secret (it has no authentication); rotate by recreating the hook |
| Dependency vulnerabilities | Dependabot / `pnpm audit` |

## Preview

Edits go to the **draft**. A preview route (admin only) renders the real public pages from the draft data.
"Veröffentlichen" promotes the draft and triggers the build (about 1–2 minutes).

## Costs

Everything fits the free tiers at this volume (Access: free for fewer than 50 users, Pages: 500 builds/month,
R2: 10 GB, D1: 5 GB). A Workers paid plan or R2 beyond 10 GB would be the first things to cost money.

## Roadmap

1. **Foundations (this PR):** schema, Access verification, security headers, data layer, admin shell, build-time
   content fetch, setup guide.
2. Price editor (draft → preview → publish → deploy hook).
3. Texts editor and public pages reading `texts.json`.
4. Gallery: upload (also from phone), reorder, delete; image download into the build.
5. Preview mode for the public pages, restore UI.
6. Hardening: CSP, tests for token verification and validation, scheduled D1 backup.
