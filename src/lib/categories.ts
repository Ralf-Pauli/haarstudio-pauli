import type { Category } from "$lib/utils/types";

// Resolve images at build time as @sveltejs/enhanced-img pictures (use with <enhanced:img src={...}>).
const categoryImages = import.meta.glob("$lib/assets/categories/*.{jpg,png,webp}", {
    eager: true,
    query: { enhanced: true },
    import: "default"
}) as Record<string, string>;

const galleryImages = import.meta.glob("$lib/assets/gallery/*.{jpg,png,webp}", {
    eager: true,
    query: { enhanced: true },
    import: "default"
}) as Record<string, string>;

function find(images: Record<string, string>, filename: string | undefined): string {
    if (!filename) return "";
    const key = Object.keys(images).find((k) => k.endsWith(`/${filename}`));
    return key ? images[key] : "";
}

export const getCategoryImage = (filename: string | undefined) => find(categoryImages, filename);
export const getGalleryImage = (filename: string | undefined) => find(galleryImages, filename);

export function categoryNumber(index: number): string {
    return String(index + 1).padStart(2, "0");
}

export function categoryLabel(category: Category): string {
    return category.shortName ?? category.name;
}
