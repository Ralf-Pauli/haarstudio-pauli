import { dev } from "$app/environment";
import type { Handle } from "@sveltejs/kit";
import { AccessError, verifyAccess } from "$lib/server/access";

const isAdminPath = (pathname: string) =>
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/admin" ||
    pathname.startsWith("/api/admin/");

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function deny(status: number, message: string) {
    return new Response(message, {
        status,
        headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
}

export const handle: Handle = async ({ event, resolve }) => {
    const { pathname } = event.url;
    const admin = isAdminPath(pathname);

    if (admin) {
        const env = event.platform?.env;
        try {
            // Local development only: skip Access when no Access configuration is present.
            if (dev && !env?.ACCESS_AUD) {
                event.locals.adminEmail = "dev@localhost";
            } else {
                event.locals.adminEmail = await verifyAccess(event.request, env);
            }
        } catch (e) {
            if (e instanceof AccessError) return deny(e.status, e.message);
            return deny(403, "Kein Zugriff.");
        }

        // CSRF: state-changing admin requests must come from this site and carry a custom header
        // that a cross-site form post cannot set.
        if (!SAFE_METHODS.has(event.request.method)) {
            const origin = event.request.headers.get("origin");
            if (origin !== event.url.origin) return deny(403, "Ungültige Herkunft.");
            if (event.request.headers.get("x-admin-request") !== "1") return deny(403, "Ungültige Anfrage.");
        }
    }

    const response = await resolve(event);

    response.headers.set("x-content-type-options", "nosniff");
    response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
    response.headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
    response.headers.set("x-frame-options", "SAMEORIGIN");

    if (admin) {
        if (!response.headers.has("cache-control")) response.headers.set("cache-control", "no-store");
        response.headers.set("x-robots-tag", "noindex, nofollow");
        response.headers.set("x-frame-options", "DENY");
    }

    return response;
};
