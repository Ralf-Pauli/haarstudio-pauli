import adapter from '@sveltejs/adapter-cloudflare';
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter({
            routes: {
                include: ['/*'],
                exclude: ['<all>']
            }
        }),
        alias: {
            $components: "src/lib/components",
            "$components/*": "src/lib/components/*",
            $lib: "./src/lib",
            "$lib/*": "./src/lib/*",
            $utils: "./src/lib/utils"
        }
    }
};

export default config;
