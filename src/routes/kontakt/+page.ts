import { strapiFetch } from "$lib/utils/api";

export async function load({
  fetch,
}: {
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  params: any;
}) {
  const contact_page = await strapiFetch(fetch, "api/contact-page?fields[0]&populate[0]=address&populate[1]=details&populate[2]=opening_hours&populate[3]=social_media&populate[4]=social_media.icon");
  return { contact_page: contact_page.data };
}