import { strapiFetch } from "$lib/utils/api";

export async function load({ fetch, params }) {
  const footer = await strapiFetch(fetch, "api/footer?populate=*");
  return { footer: footer?.data };
}
