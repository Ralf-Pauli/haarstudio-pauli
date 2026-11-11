import type { Category } from "$lib/utils/types";

// Resolve category images at build time.
const categoryImages = import.meta.glob("$lib/assets/categories/*.{jpg,png,webp}", {
    eager: true,
    query: "?url",
    import: "default"
}) as Record<string, string>;

export function getCategoryImage(filename: string | undefined): string {
    if (!filename) return "";
    const key = Object.keys(categoryImages).find((k) => k.endsWith(`/${filename}`));
    return key ? categoryImages[key] : "";
}

export function categoryNumber(index: number): string {
    return String(index + 1).padStart(2, "0");
}

export function categoryLabel(category: Category): string {
    return category.shortName ?? category.name;
}
