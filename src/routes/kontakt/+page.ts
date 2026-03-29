import type { PageLoad } from './$types';
import type {Category, Contact} from '$lib/utils/types';

export const load: PageLoad = async ({ fetch, url }) => {
    const response = await fetch('/data/contact.json');
    const data: Contact = await response.json();

    return {
        contact: data,
    };
};