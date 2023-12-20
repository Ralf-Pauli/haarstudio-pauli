import type { PageLoad } from "./$types";
import { strapiFetch } from "$lib/utils/api";

export const load: PageLoad = async ({ url }) => {
  const categories = await strapiFetch(
    "api/categories?populate[services][populate][0]=type&sort[0]=id&sort[1]=id",
  );
  const tabsValueParam = url.searchParams.get("tab");
  return { categories: categories?.data, tabsValueParam };
};
