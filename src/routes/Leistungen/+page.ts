import { PUBLIC_STRAPI_HOST, PUBLIC_API_TOKEN } from "$env/static/public";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${PUBLIC_API_TOKEN}`);
  const res = await fetch(`${PUBLIC_STRAPI_HOST}/api/categories?populate[services][populate][0]=type&sort[0]=id&sort[1]=id`, {
    method: "GET",
    headers: headers,
  }).catch((reason) => console.log(reason));
  if (res instanceof Response) {
    const categories = await res.json();
    return { categories };
  }
};
