import { strapiFetch } from "$lib/utils/api";

export async function load({ fetch, url }) {
  const categories = await strapiFetch(
    fetch,
    "api/categories?populate[services][populate][0]=type&sort[0]=id&sort[1]=id",
  );

  const tabsValueParam = url.searchParams.get("tab");
  return { categories: categories?.data, tabsValueParam };
}
