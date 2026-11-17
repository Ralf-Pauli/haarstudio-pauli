import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/** Set by hooks.server.ts for /admin and /api/admin once Cloudflare Access is verified */
			adminEmail?: string;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				/** D1 database with the admin content (see migrations/) */
				DB?: D1Database;
				/** R2 bucket with uploaded images */
				UPLOADS?: R2Bucket;
				ACCESS_TEAM_DOMAIN?: string;
				ACCESS_AUD?: string;
				ADMIN_EMAILS?: string;
				/** Cloudflare Pages deploy hook URL, called when content is published */
				DEPLOY_HOOK_URL?: string;
			};
		}
	}
}

export {};
