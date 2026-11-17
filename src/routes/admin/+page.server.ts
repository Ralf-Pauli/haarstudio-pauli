import type { PageServerLoad } from "./$types";
import { getDocuments } from "$lib/server/content";
import { DOCUMENT_LABELS } from "$lib/content/schemas";

export const load: PageServerLoad = async ({ platform }) => {
    const db = platform?.env?.DB;
    if (!db) {
        return { dbConnected: false as const, documents: [] };
    }

    try {
        const documents = (await getDocuments(db)).map((d) => ({
            key: d.key,
            label: DOCUMENT_LABELS[d.key],
            exists: d.exists,
            hasUnpublishedChanges: d.hasUnpublishedChanges,
            updatedAt: d.updatedAt,
            updatedBy: d.updatedBy,
            publishedAt: d.publishedAt,
        }));
        return { dbConnected: true as const, documents };
    } catch {
        return { dbConnected: false as const, documents: [] };
    }
};
