import type { PageServerLoad } from "./$types";
import { getDocument } from "$lib/server/content";
import { BUILTIN_GALLERY, type StoredPhoto } from "$lib/content/gallery-admin";

export const load: PageServerLoad = async ({ platform }) => {
    const db = platform?.env?.DB;
    if (!db) return { dbConnected: false as const };

    try {
        const doc = await getDocument(db, "gallery");
        const photos = (doc.draft as StoredPhoto[] | null) ?? BUILTIN_GALLERY;
        return {
            dbConnected: true as const,
            uploadsConnected: !!platform?.env?.UPLOADS,
            photos,
            // Nothing saved yet: the photos shipped with the site are shown until the first save.
            fromBuiltin: !doc.exists,
            hasUnpublishedChanges: doc.hasUnpublishedChanges,
        };
    } catch {
        return { dbConnected: false as const };
    }
};
