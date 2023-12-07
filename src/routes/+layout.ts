import { strapiFetch } from "$lib/utils/api";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
    const footer = await strapiFetch("api/footer?populate=*");
    return {footer};
};
