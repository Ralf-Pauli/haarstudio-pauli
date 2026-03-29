import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch('/data/privacy.json');
    const data = await response.json();

    return {
        privacy: data
    };
};
