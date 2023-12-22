import { strapiFetch } from "$lib/utils/api";

export async function load({ fetch }: {
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  params: any;
}) {
  const categories = await strapiFetch(fetch, "api/categories?populate=*");
  return { categories: categories.data };
}
