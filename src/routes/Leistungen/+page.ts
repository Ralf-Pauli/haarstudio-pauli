import type { PageLoad } from "./$types";
import { strapiFetch } from "$lib/utils/api";

export const load: PageLoad = async () => {
  const categories = await strapiFetch("api/categories?populate[services][populate][0]=type&sort[0]=id&sort[1]=id");
  return { categories };
};