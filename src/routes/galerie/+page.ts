import type {PageLoad} from './$types';
import type {Category} from '$lib/utils/types';

export const load: PageLoad = async () => {
    const modules = import.meta.glob('/src/lib/assets/gallery/*.{png,jpg,jpeg,webp}', {
        eager: true,
        query: { enhanced: true },
        import: 'default'
    });

    const images = Object.entries(modules).map(([path, asset]) => ({
        name: path.split('/').pop()?.split('.').shift() || "Haarstudio Pauli Galerie",
        asset
    }));

    return {
        images
    };
};