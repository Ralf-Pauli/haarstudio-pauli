import { API_TOKEN, STRAPI_HOST } from "$env/static/private";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ params }) => {
    const strapiHeaders = new Headers();
    strapiHeaders.append("Authorization", `Bearer ${API_TOKEN}`);
    const strapiFooterResponse = await fetch(
        `${STRAPI_HOST}/api/footer?populate=*`,
        {
            method: "GET",
            headers: strapiHeaders,
        },
    ).catch((error) => console.log(error));
    if (strapiFooterResponse instanceof Response) {
        return { footer: await strapiFooterResponse.json() }
    }
};
