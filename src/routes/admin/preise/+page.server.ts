import type { PageServerLoad } from "./$types";
import { getDocument } from "$lib/server/content";
import type { StoredCategory } from "$lib/content/price-editor";

export const load: PageServerLoad = async ({ platform, fetch }) => {
    const db = platform?.env?.DB;
    if (!db) return { dbConnected: false as const };

    try {
        const doc = await getDocument(db, "prices");
        let categories = doc.draft as StoredCategory[] | null;
        // Not seeded yet: start from the price list that is currently in the repository.
        const fromRepository = !doc.exists;
        if (!categories) {
            categories = (await (await fetch("/data/categories.json")).json()) as StoredCategory[];
        }
        return {
            dbConnected: true as const,
            categories,
            fromRepository,
            hasUnpublishedChanges: doc.hasUnpublishedChanges,
            updatedAt: doc.updatedAt,
            publishedAt: doc.publishedAt,
        };
    } catch {
        return { dbConnected: false as const };
    }
};
