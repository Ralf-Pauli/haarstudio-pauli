import type { PageServerLoad } from "./$types";
import { getDocument } from "$lib/server/content";
import type { Category } from "$lib/utils/types";

/** Draft of the price list, rendered with the real public components (see +page.svelte). */
export const load: PageServerLoad = async ({ platform, fetch }) => {
    const db = platform?.env?.DB;
    let categories: Category[] | null = null;
    let hasUnpublishedChanges = false;

    if (db) {
        const doc = await getDocument(db, "prices");
        categories = doc.draft as Category[] | null;
        hasUnpublishedChanges = doc.hasUnpublishedChanges;
    }
    if (!categories) {
        categories = (await (await fetch("/data/categories.json")).json()) as Category[];
    }
    return { categories, hasUnpublishedChanges };
};
