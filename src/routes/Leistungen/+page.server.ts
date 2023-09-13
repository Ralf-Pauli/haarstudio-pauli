import { STRAPI_HOST, API_TOKEN } from "$env/static/private";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${API_TOKEN}`);
    const res = await fetch(`${STRAPI_HOST}/api/categories?populate=*`, {
        method: "GET",
        headers: headers,  }).catch((reason) => console.log(reason));
    if (res instanceof Response) {
        const categories = await res.json();
        return { categories };
    }
};
