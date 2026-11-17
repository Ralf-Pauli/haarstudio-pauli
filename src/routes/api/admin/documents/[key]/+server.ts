import { json, type RequestHandler } from "@sveltejs/kit";
import { saveDraft } from "$lib/server/content";
import { failure, readJson, requireAdmin, requireDb, requireKey } from "$lib/server/api";
import { existingImageIds } from "$lib/server/images";

/** Saves the draft of one content block. Does not change what is published. */
export const PUT: RequestHandler = async (event) => {
    const email = requireAdmin(event);
    const db = requireDb(event);
    const key = requireKey(event);

    const body = await readJson(event.request);

    // A gallery may only point at photos that were really uploaded.
    if (key === "gallery" && Array.isArray(body)) {
        const ids = [...new Set(body.map((p: { imageId?: unknown }) => p?.imageId).filter((x): x is string => typeof x === "string"))];
        if (ids.length > 0) {
            const found = await existingImageIds(db, ids);
            if (found.size !== ids.length) return failure("Ein Foto wurde nicht gefunden. Bitte neu hochladen.", 422);
        }
    }

    const result = await saveDraft(db, key, body, email);
    if (!result.ok) return failure(result.message, 422, result.issues);
    return json({ ok: true });
};
