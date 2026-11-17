import { json, type RequestHandler } from "@sveltejs/kit";
import { saveDraft } from "$lib/server/content";
import { failure, readJson, requireAdmin, requireDb, requireKey } from "$lib/server/api";

/** Saves the draft of one content block. Does not change what is published. */
export const PUT: RequestHandler = async (event) => {
    const email = requireAdmin(event);
    const db = requireDb(event);
    const key = requireKey(event);

    const result = await saveDraft(db, key, await readJson(event.request), email);
    if (!result.ok) return failure(result.message, 422, result.issues);
    return json({ ok: true });
};
