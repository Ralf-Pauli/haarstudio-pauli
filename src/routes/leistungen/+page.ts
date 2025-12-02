import type { PageLoad } from './$types';
import type { Category } from '$lib/utils/types';

export const load: PageLoad = async ({ fetch, url }) => {
    const response = await fetch('/data/services.json');
    const data: {data: Category[]} = await response.json();
    console.log(url.searchParams)

    return {
        categories: data.data,
        tabsValueParam: url.searchParams.get("tab")
    };
};