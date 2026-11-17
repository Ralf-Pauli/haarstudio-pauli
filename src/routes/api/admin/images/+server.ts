import { json, type RequestHandler } from "@sveltejs/kit";
import { failure, requireAdmin, requireDb } from "$lib/server/api";
import { MAX_UPLOAD_BYTES, storeImage } from "$lib/server/images";

/** Upload one photo (raw JPEG body). The browser shrinks and re-encodes it first, the server re-checks. */
export const POST: RequestHandler = async (event) => {
    const email = requireAdmin(event);
    const db = requireDb(event);
    const bucket = event.platform?.env?.UPLOADS;
    if (!bucket) return failure("Der Foto-Speicher ist nicht verbunden.", 503);

    if (event.request.headers.get("content-type")?.split(";")[0].trim() !== "image/jpeg") {
        return failure("Nur JPEG-Fotos sind erlaubt.", 415);
    }
    const declared = Number(event.request.headers.get("content-length") ?? "0");
    if (declared > MAX_UPLOAD_BYTES) return failure("Das Foto ist zu groß (höchstens 6 MB).", 413);

    const bytes = new Uint8Array(await event.request.arrayBuffer());
    const result = await storeImage(db, bucket, bytes, email);
    if (!result.ok) return failure(result.message, result.status);

    return json({ ok: true, id: result.id, width: result.width, height: result.height });
};
