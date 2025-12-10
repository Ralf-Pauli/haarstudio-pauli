import type {PageLoad} from './$types';
import type {Category} from '$lib/utils/types';

export const load: PageLoad = async ({fetch}) => {
    const modules = import.meta.glob('/src/lib/assets/gallery/*.{png,jpg,jpeg,webp}', {eager: true, as: 'url'});

    const images = Object.entries(modules).map(([path, url]) => ({
        name: path.split('/').pop(),
        url
    }));

    return {
        images
    };

};