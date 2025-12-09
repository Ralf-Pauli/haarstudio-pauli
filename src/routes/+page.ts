import type { PageLoad } from './$types';
import type { Category } from '$lib/utils/types';

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch('/data/categories.json');
    const data: Category[] = await response.json();
    return {
        categories: data
    }
};