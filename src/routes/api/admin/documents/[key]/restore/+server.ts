import { json, type RequestHandler } from "@sveltejs/kit";
import * as v from "valibot";
import { restoreVersionToDraft } from "$lib/server/content";
import { failure, readJson, requireAdmin, requireDb, requireKey } from "$lib/server/api";

const bodySchema = v.object({ versionId: v.pipe(v.number(), v.integer(), v.minValue(1)) });

/** Copies an older version into the draft. It still has to be published afterwards. */
export const POST: RequestHandler = async (event) => {
    const email = requireAdmin(event);
    const db = requireDb(event);
    const key = requireKey(event);

    const body = v.safeParse(bodySchema, await readJson(event.request));
    if (!body.success) return failure("Ungültige Anfrage.");

    const result = await restoreVersionToDraft(db, key, body.output.versionId, email);
    if (!result.ok) return failure(result.message, 404);
    return json({ ok: true });
};
