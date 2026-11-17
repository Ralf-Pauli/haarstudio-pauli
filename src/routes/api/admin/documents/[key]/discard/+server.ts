import { json, type RequestHandler } from "@sveltejs/kit";
import { discardDraft } from "$lib/server/content";
import { failure, requireAdmin, requireDb, requireKey } from "$lib/server/api";

/** Throws away unpublished changes (draft becomes the published version again). */
export const POST: RequestHandler = async (event) => {
    const email = requireAdmin(event);
    const result = await discardDraft(requireDb(event), requireKey(event), email);
    if (!result.ok) return failure(result.message, 422);
    return json({ ok: true });
};
