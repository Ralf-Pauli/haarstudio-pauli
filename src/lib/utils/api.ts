import { PUBLIC_STRAPI_HOST, PUBLIC_API_TOKEN } from "$env/static/public";

export const strapiFetch = async (url: string): Promise<any> => {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${PUBLIC_API_TOKEN}`);
    const response = await fetch(`${PUBLIC_STRAPI_HOST}/${url}`, {
        method: "GET",
        headers: headers,
    }).catch((reason) => console.log(reason));
    if (response instanceof Response) {
        return await response.json();
    }
};