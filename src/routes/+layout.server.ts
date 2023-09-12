import type { LayoutServerLoad } from "./$types";
import { STRAPI_HOST, API_TOKEN } from "$env/static/private";

export const load = (async ({ fetch, params }) => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${API_TOKEN}`);
  const res = await fetch(`${STRAPI_HOST}/api/services?populate=*`, {
    method: "GET",
    headers: headers,
  }).catch((reason) => console.log(reason));
  if (res instanceof Response) {
    const footer = await res.json();
    return { footer };
  }
}) satisfies LayoutServerLoad;
