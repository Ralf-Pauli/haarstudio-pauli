import { json, type RequestHandler } from "@sveltejs/kit";
import { listVersions } from "$lib/server/content";
import { requireAdmin, requireDb, requireKey } from "$lib/server/api";

export const GET: RequestHandler = async (event) => {
    requireAdmin(event);
    const versions = await listVersions(requireDb(event), requireKey(event));
    return json({ ok: true, versions });
};
