import { strapiFetch } from "$lib/utils/api";
import type { PageLoad } from "../$types";

export const load: PageLoad = async () => {
  const gallery = await strapiFetch(fetch, "api/gallery?populate=*");
  console.log(gallery.data);
  return { images: gallery.data.images };
};
