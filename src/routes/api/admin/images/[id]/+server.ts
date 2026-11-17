import { error, type RequestHandler } from "@sveltejs/kit";
import { requireAdmin, requireDb } from "$lib/server/api";
import { getImageObject } from "$lib/server/images";

/** Serves an uploaded photo to the admin (thumbnails and preview). Public visitors get them from the built site. */
export const GET: RequestHandler = async (event) => {
    requireAdmin(event);
    const db = requireDb(event);
    const bucket = event.platform?.env?.UPLOADS;
    if (!bucket) error(503, "Der Foto-Speicher ist nicht verbunden.");

    const object = await getImageObject(db, bucket, event.params.id ?? "");
    if (!object) error(404, "Foto nicht gefunden.");

    return new Response(object.body as unknown as BodyInit, {
        headers: {
            "content-type": "image/jpeg",
            "cache-control": "private, max-age=86400",
            "content-disposition": "inline",
        },
    });
};
