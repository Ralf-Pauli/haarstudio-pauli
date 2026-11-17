import { json, type RequestHandler } from "@sveltejs/kit";
import { publish } from "$lib/server/content";
import { triggerDeploy } from "$lib/server/deploy";
import { failure, requireAdmin, requireDb, requireKey } from "$lib/server/api";

/** Makes the draft the published version and starts a new site build. */
export const POST: RequestHandler = async (event) => {
    const email = requireAdmin(event);
    const db = requireDb(event);
    const key = requireKey(event);

    const result = await publish(db, key, email);
    if (!result.ok) return failure(result.message, 422);

    const deploy = await triggerDeploy(event.platform?.env?.DEPLOY_HOOK_URL);
    return json({ ok: true, deploy });
};
