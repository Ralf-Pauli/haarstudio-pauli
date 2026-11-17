# Admin setup (Cloudflare dashboard)

One-time steps. Names in `code` must match what the app expects.

## 1. D1 database

```bash
npx wrangler d1 create haarstudio-admin
npx wrangler d1 migrations apply haarstudio-admin --remote
node scripts/seed-sql.mjs > seed.sql
npx wrangler d1 execute haarstudio-admin --remote --file=seed.sql
```

Note the `database_id` printed by the first command (also needed in step 5).

## 2. R2 bucket

Create a bucket named `haarstudio-uploads` (Dashboard → R2). Keep it **private**.

## 3. Bindings for the Pages project

Pages project → Settings → Bindings:

| Type | Variable name | Value |
|---|---|---|
| D1 database | `DB` | `haarstudio-admin` |
| R2 bucket | `UPLOADS` | `haarstudio-uploads` |

## 4. Cloudflare Access

1. Zero Trust → Access → Applications → Add → **Self-hosted**.
2. Application domain: your domain, paths `/admin*` and `/api/admin*` (add one destination per path).
3. Policy **Allow**, include **Emails** = the owner's address and yours.
4. Identity provider: enable **One-time PIN**.
5. Session duration: e.g. 30 days.
6. Copy the **Application Audience (AUD) tag** and your **team domain** (`https://<team>.cloudflareaccess.com`).
7. Check in the dashboard that the plan is free for your number of users.

Pages project → Settings → Variables and secrets (production):

| Name | Value |
|---|---|
| `ACCESS_TEAM_DOMAIN` | `https://<team>.cloudflareaccess.com` |
| `ACCESS_AUD` | the AUD tag |
| `ADMIN_EMAILS` | `owner@example.com,you@example.com` |

> Without `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` the admin answers 503 on purpose.

## 5. Build variables (publishing)

The build pulls the published content from D1 and the uploaded photos from R2.

1. Create an API token with **D1 read** permission (Account > API tokens).
2. Create an **R2 API token** with **Object Read only** for the bucket `haarstudio-uploads` (R2 > Manage R2 API tokens).
   This gives an access key id and a secret access key.

In the Pages project add (Settings > Variables and secrets, production **and** preview if you use it):

| Name | Value |
|---|---|
| `CF_ACCOUNT_ID` | your account id |
| `CF_API_TOKEN` | the D1 token (secret) |
| `D1_DATABASE_ID` | the id from step 1 |
| `R2_BUCKET_NAME` | `haarstudio-uploads` |
| `R2_ACCESS_KEY_ID` | from the R2 token |
| `R2_SECRET_ACCESS_KEY` | from the R2 token (secret) |

`scripts/fetch-content.mjs` runs before every build. It writes the published prices to `static/data/categories.json`
and the gallery to `static/data/gallery.json`, and downloads the uploaded photos into `src/lib/assets/uploads/`
so `enhanced:img` can optimize them. When the D1 variables are missing it does nothing. When they are set and
anything fails (D1, R2, a missing or broken photo) **the build fails on purpose**, so the live site keeps its old content.

## 6. Deploy hook

Pages project → Settings → Builds → Add deploy hook (branch `main`/production branch). Store its URL as the
secret `DEPLOY_HOOK_URL`. The URL has no authentication, so keep it secret.

## Local development

- `pnpm dev` works without any of this. In dev mode (and only there) the Access check is skipped when
  `ACCESS_AUD` is not set, and the admin shows "Datenbank nicht verbunden".
- To test with bindings, copy `wrangler.example.jsonc` to `wrangler.jsonc` (git-ignored) and fill in the ids.
