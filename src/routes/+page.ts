import type { PageLoad } from './$types';
import type { Category } from '$lib/utils/types';

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch('/data/services.json');
    const data: {data: Category[]} = await response.json();
    return {
        categories: data.data
    };
};