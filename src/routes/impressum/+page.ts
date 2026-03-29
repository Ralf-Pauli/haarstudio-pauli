import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const response = await fetch('/data/imprint.json');
    const data = await response.json();

    return {
        imprint: data
    };
};
