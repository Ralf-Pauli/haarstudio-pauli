import { strapiFetch } from "$lib/utils/api";
import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ params }) => {
  const gallery = await strapiFetch(fetch, "api/gallery?populate=*");
  console.log(gallery.data);
  return { images: gallery.data.images };
};

// export const load: PageLoad = async ({
//   fetch,
// }: {
//   fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
//   params: any;
// }) => {
//   const gallery = await strapiFetch(fetch, "api/gallery?populate=*");
//   console.log(gallery.data);
//   return { gallery: gallery.data };
// };
