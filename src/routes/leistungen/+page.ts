import type { PageLoad } from './$types';
import type { Category } from '$lib/utils/types';

export const load: PageLoad = async ({ fetch, url }) => {
    const response = await fetch('/data/categories.json');
    const data: {data: Category[]} = await response.json();

    return {
        categories: data,
        tabsValueParam: url.searchParams.get("tab")
    };
};