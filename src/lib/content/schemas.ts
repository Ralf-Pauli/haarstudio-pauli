import * as v from "valibot";

/** Validation for everything that can be saved from the admin. Shapes match static/data/*.json. */

const text = (max: number) => v.pipe(v.string(), v.trim(), v.maxLength(max));
const requiredText = (max: number) => v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(max));

const price = v.union([
    v.pipe(v.number(), v.minValue(0), v.maxValue(100_000)),
    v.pipe(v.string(), v.trim(), v.maxLength(40)),
]);

const leafService = v.object({
    id: v.number(),
    name: requiredText(120),
    price,
});

const service = v.object({
    id: v.number(),
    name: requiredText(120),
    price: v.optional(price),
    sub_services: v.optional(v.nullable(v.pipe(v.array(leafService), v.maxLength(100)))),
});

const category = v.object({
    id: v.number(),
    name: requiredText(80),
    image: v.optional(text(120)),
    shortName: v.optional(text(40)),
    tagline: v.optional(text(160)),
    from: v.optional(text(20)),
    services: v.pipe(v.array(service), v.maxLength(200)),
});

export const pricesSchema = v.pipe(v.array(category), v.maxLength(20));

export const textsSchema = v.object({
    quote: text(400),
    author: text(120),
    text: text(1200),
    holidayNote: text(300),
    directions: v.pipe(
        v.array(v.object({ label: requiredText(40), text: requiredText(300) })),
        v.maxLength(10),
    ),
});

export const galleryFilters = ["herren", "damen", "kinder", "farbe", "styling", "pflege", "salon"] as const;

export const gallerySchema = v.pipe(
    v.array(
        v.object({
            id: requiredText(64),
            imageId: requiredText(64),
            title: requiredText(120),
            alt: text(200),
            filter: v.picklist(galleryFilters),
        }),
    ),
    v.maxLength(500),
);

export const DOCUMENT_KEYS = ["prices", "texts", "gallery"] as const;
export type DocumentKey = (typeof DOCUMENT_KEYS)[number];

export const schemas = {
    prices: pricesSchema,
    texts: textsSchema,
    gallery: gallerySchema,
} as const;

export const DOCUMENT_LABELS: Record<DocumentKey, string> = {
    prices: "Preise",
    texts: "Texte",
    gallery: "Galerie",
};

export function isDocumentKey(key: string): key is DocumentKey {
    return (DOCUMENT_KEYS as readonly string[]).includes(key);
}
