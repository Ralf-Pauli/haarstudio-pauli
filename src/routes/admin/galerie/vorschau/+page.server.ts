import type { PageServerLoad } from "./$types";
import { getDocument } from "$lib/server/content";
import { BUILTIN_GALLERY, type StoredPhoto } from "$lib/content/gallery-admin";

export const load: PageServerLoad = async ({ platform }) => {
    const db = platform?.env?.DB;
    let photos: StoredPhoto[] = BUILTIN_GALLERY;
    let hasUnpublishedChanges = false;

    if (db) {
        const doc = await getDocument(db, "gallery");
        if (doc.draft) photos = doc.draft as StoredPhoto[];
        hasUnpublishedChanges = doc.hasUnpublishedChanges;
    }
    return { photos, hasUnpublishedChanges };
};
