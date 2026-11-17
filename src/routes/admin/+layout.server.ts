import type { LayoutServerLoad } from "./$types";

export const prerender = false;

export const load: LayoutServerLoad = async ({ locals }) => {
    return { email: locals.adminEmail ?? "" };
};
