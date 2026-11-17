import builtinPhotos from "./gallery-builtin.json";

export type GalleryFilterId = "herren" | "damen" | "kinder" | "farbe" | "styling" | "pflege" | "salon";

export const FILTER_OPTIONS: { id: GalleryFilterId; label: string }[] = [
    { id: "herren", label: "Herren" },
    { id: "damen", label: "Damen" },
    { id: "kinder", label: "Kinder" },
    { id: "farbe", label: "Farbe" },
    { id: "styling", label: "Styling" },
    { id: "pflege", label: "Pflege" },
    { id: "salon", label: "Salon" },
];

export type StoredPhoto = {
    id: string;
    imageId?: string;
    builtin?: string;
    title: string;
    alt: string;
    filter: GalleryFilterId;
};

/** Editing model: like the stored photo, but the category may still be unset for a freshly uploaded photo. */
export type PhotoUi = Omit<StoredPhoto, "filter"> & { filter: GalleryFilterId | "" };

/** The photos shipped with the site, used until a gallery has been saved. */
export const BUILTIN_GALLERY: StoredPhoto[] = builtinPhotos.map((p) => ({
    id: `builtin-${p.builtin}`,
    builtin: p.builtin,
    title: p.title,
    alt: p.alt,
    filter: p.filter as GalleryFilterId,
}));

export function toPhotoDoc(photos: PhotoUi[]): StoredPhoto[] {
    return photos.map((p) => ({
        id: p.id,
        ...(p.imageId ? { imageId: p.imageId } : {}),
        ...(p.builtin ? { builtin: p.builtin } : {}),
        title: p.title.trim(),
        alt: p.alt.trim(),
        filter: p.filter as GalleryFilterId,
    }));
}

/** Human readable problems that would prevent saving. */
export function validatePhotos(photos: PhotoUi[]): string[] {
    const problems: string[] = [];
    photos.forEach((p, i) => {
        const label = p.title.trim() ? `„${p.title.trim()}“` : `Foto ${i + 1}`;
        if (!p.title.trim()) problems.push(`${label}: Bitte einen Titel eingeben.`);
        if (!p.filter) problems.push(`${label}: Bitte eine Kategorie wählen.`);
    });
    return problems;
}
