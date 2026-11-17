import { formatPriceInput, parsePrice } from "./price.ts";

/**
 * Editing model for the price list. The stored shape (static/data/categories.json) mixes single services
 * and services with sub services; the editor shows them as single lines and as groups of lines.
 */

export type RowUi = { id: number; name: string; price: string };
export type EntryUi =
    | { kind: "leaf"; id: number; name: string; price: string }
    | { kind: "group"; id: number; name: string; rows: RowUi[] };
export type CategoryUi = {
    id: number;
    name: string;
    image?: string;
    shortName: string;
    tagline: string;
    from: string;
    entries: EntryUi[];
};

type StoredService = {
    id: number;
    name: string;
    price?: number | string | null;
    sub_services?: { id: number; name: string; price: number | string }[] | null;
};
export type StoredCategory = {
    id: number;
    name: string;
    image?: string;
    shortName?: string;
    tagline?: string;
    from?: string;
    services: StoredService[];
};

export function toUi(categories: StoredCategory[]): CategoryUi[] {
    return categories.map((c) => ({
        id: c.id,
        name: c.name,
        image: c.image,
        shortName: c.shortName ?? c.name,
        tagline: c.tagline ?? "",
        from: c.from ?? "",
        entries: c.services.map((s): EntryUi => {
            if (Array.isArray(s.sub_services) && s.sub_services.length > 0) {
                return {
                    kind: "group",
                    id: s.id,
                    name: s.name,
                    rows: s.sub_services.map((r) => ({ id: r.id, name: r.name, price: formatPriceInput(r.price) })),
                };
            }
            return { kind: "leaf", id: s.id, name: s.name, price: formatPriceInput(s.price) };
        }),
    }));
}

export function toDoc(categories: CategoryUi[]): StoredCategory[] {
    return categories.map((c) => {
        const doc: StoredCategory = {
            id: c.id,
            name: c.name,
            ...(c.image ? { image: c.image } : {}),
            shortName: c.shortName.trim(),
            tagline: c.tagline.trim(),
            from: c.from.trim(),
            services: c.entries.map((e): StoredService => {
                if (e.kind === "group") {
                    return {
                        id: e.id,
                        name: e.name.trim(),
                        sub_services: e.rows.map((r) => ({
                            id: r.id,
                            name: r.name.trim(),
                            price: parsePrice(r.price),
                        })),
                    };
                }
                return { id: e.id, name: e.name.trim(), price: parsePrice(e.price) };
            }),
        };
        return doc;
    });
}

/** Next free id across the whole price list (ids must stay unique). */
export function nextId(categories: CategoryUi[]): number {
    let max = 0;
    for (const c of categories) {
        for (const e of c.entries) {
            max = Math.max(max, e.id);
            if (e.kind === "group") for (const r of e.rows) max = Math.max(max, r.id);
        }
    }
    return max + 1;
}

/** Human readable problems that would prevent saving (empty names, missing prices, empty groups). */
export function validate(categories: CategoryUi[]): string[] {
    const problems: string[] = [];
    for (const c of categories) {
        const where = c.shortName || c.name;
        if (!c.shortName.trim()) problems.push(`${c.name}: Der Name fehlt.`);
        for (const e of c.entries) {
            const label = e.name.trim() || "(ohne Namen)";
            if (!e.name.trim()) problems.push(`${where}: Eine Leistung hat keinen Namen.`);
            if (e.kind === "leaf") {
                if (!e.price.trim()) problems.push(`${where}: „${label}“ hat keinen Preis.`);
            } else {
                if (e.rows.length === 0) problems.push(`${where}: Die Gruppe „${label}“ hat keine Zeilen.`);
                for (const r of e.rows) {
                    if (!r.name.trim()) problems.push(`${where}, ${label}: Eine Zeile hat keinen Namen.`);
                    if (!r.price.trim()) problems.push(`${where}, ${label}: „${r.name.trim() || "(ohne Namen)"}“ hat keinen Preis.`);
                }
            }
        }
    }
    return problems;
}
