import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Verifies the Cloudflare Access token on a request and returns the signed-in email.
 *
 * Cloudflare Access protects the admin paths at the edge, but the site is also reachable on its
 * `*.pages.dev` address, so every admin request is verified again here (signature, issuer, audience).
 * Docs: https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/
 */

export type AccessEnv = {
    /** e.g. https://<team-name>.cloudflareaccess.com */
    ACCESS_TEAM_DOMAIN?: string;
    /** Application Audience (AUD) tag of the Access application */
    ACCESS_AUD?: string;
    /** Comma separated allow-list (defense in depth, in addition to the Access policy) */
    ADMIN_EMAILS?: string;
};

export class AccessError extends Error {
    constructor(
        public status: 401 | 403 | 503,
        message: string,
    ) {
        super(message);
    }
}

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getJwks(teamDomain: string) {
    let jwks = jwksCache.get(teamDomain);
    if (!jwks) {
        jwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
        jwksCache.set(teamDomain, jwks);
    }
    return jwks;
}

export async function verifyAccess(request: Request, env: AccessEnv | undefined): Promise<string> {
    const teamDomain = env?.ACCESS_TEAM_DOMAIN?.replace(/\/$/, "");
    const audience = env?.ACCESS_AUD;

    // Fail closed: without configuration nobody gets in.
    if (!teamDomain || !audience) {
        throw new AccessError(503, "Admin-Zugang ist nicht konfiguriert.");
    }

    const token = request.headers.get("cf-access-jwt-assertion");
    if (!token) {
        throw new AccessError(401, "Nicht angemeldet.");
    }

    let email: unknown;
    try {
        const { payload } = await jwtVerify(token, getJwks(teamDomain), {
            issuer: teamDomain,
            audience,
        });
        email = payload.email;
    } catch {
        throw new AccessError(403, "Ungültige Anmeldung.");
    }

    if (typeof email !== "string" || !email) {
        throw new AccessError(403, "Ungültige Anmeldung.");
    }

    const allowed = (env?.ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
    if (allowed.length > 0 && !allowed.includes(email.toLowerCase())) {
        throw new AccessError(403, "Kein Zugriff für diese E-Mail-Adresse.");
    }

    return email.toLowerCase();
}
