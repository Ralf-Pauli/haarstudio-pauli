import type {PageLoad} from './$types';
import builtinPhotos from '$lib/content/gallery-builtin.json';

export type GalleryFilter = 'herren' | 'damen' | 'kinder' | 'farbe' | 'styling' | 'pflege' | 'salon';

type PublishedPhoto = {
    id: string;
    imageId?: string;
    builtin?: string;
    title: string;
    alt: string;
    filter: GalleryFilter;
};

/**
 * The gallery comes from /data/gallery.json, which the build writes from the published admin content
 * (together with the uploaded photos in src/lib/assets/uploads). Until something has been published
 * the photos shipped with the site are shown.
 */
export const load: PageLoad = async ({fetch}) => {
    const modules = import.meta.glob(
        ['/src/lib/assets/gallery/*.{png,jpg,jpeg,webp}', '/src/lib/assets/hero.jpg', '/src/lib/assets/uploads/*.jpg'],
        {eager: true, query: {enhanced: true}, import: 'default'}
    );
    const assets = new Map<string, unknown>(
        Object.entries(modules).map(([path, asset]) => [path.split('/').pop()?.split('.').shift() ?? '', asset])
    );

    let photos: PublishedPhoto[] = builtinPhotos.map((p) => ({
        id: `builtin-${p.builtin}`,
        builtin: p.builtin,
        title: p.title,
        alt: p.alt,
        filter: p.filter as GalleryFilter
    }));

    try {
        const response = await fetch('/data/gallery.json');
        // Parse defensively instead of trusting headers: a missing file answers with an HTML 404 page.
        const published = response.ok ? JSON.parse(await response.text()) : null;
        if (Array.isArray(published)) photos = published as PublishedPhoto[];
    } catch {
        // keep the photos shipped with the site
    }

    const images = photos.flatMap((photo) => {
        const asset = assets.get(photo.imageId ?? photo.builtin ?? '');
        if (!asset) return []; // photo is listed but its file is not part of this build
        return [{
            name: photo.id,
            asset: asset as string,
            filter: photo.filter,
            title: photo.title,
            alt: photo.alt || photo.title
        }];
    });

    return {images};
};
