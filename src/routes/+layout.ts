import { PUBLIC_API_TOKEN, PUBLIC_STRAPI_HOST } from "$env/static/public";
import navActive from "$lib/shared/stores/navActive";
import type { LayoutLoad } from "./$types";

export const prerender = true;

export const load: LayoutLoad = async ({ params, url }) => {
  console.log(url.pathname);
  if (url.pathname) navActive.set(url.pathname);
  const strapiHeaders = new Headers();
  strapiHeaders.append("Authorization", `Bearer ${PUBLIC_API_TOKEN}`);
  const strapiFooterResponse = await fetch(
    `${PUBLIC_STRAPI_HOST}/api/footer?populate=*`,
    {
      method: "GET",
      headers: strapiHeaders,
    },
  ).catch((error) => console.log(error));
  if (strapiFooterResponse instanceof Response) {
    return { footer: await strapiFooterResponse.json() };
  }
};
