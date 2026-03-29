<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    let imprint = $derived(data.imprint);
</script>

<div class="max-w-3xl mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-6">{imprint.title}</h1>
    <div class="prose dark:prose-invert max-w-none">
        {@html imprint.content}
    </div>
</div>
