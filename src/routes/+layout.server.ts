import type {LayoutServerLoad} from './$types';

export const load = (async ({fetch, params}) => {
    const res = await fetch('http://127.0.0.1:1338/api/footer?populate=*').catch(reason => console.log(reason));
    if (res instanceof Response) {
        const footer = await res.json();
        return {footer}
    }
}) satisfies LayoutServerLoad;