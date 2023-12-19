import type { PageLoad } from "./$types";
import { strapiFetch } from "$lib/utils/api";

export const load: PageLoad = async () => {
  const categories = await strapiFetch("api/categories?populate=*");
  return { categories: categories.data };
};
