<script lang="ts">
    import { onMount } from 'svelte';

    let data = { title: 'Impressum', content: '' };

    onMount(async () => {
        const res = await fetch('/data/imprint.json');
        if (res.ok) {
            data = await res.json();
        }
    });
</script>

<div class="max-w-3xl mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-6">{data.title}</h1>
    <div class="prose dark:prose-invert max-w-none">
        {@html data.content}
    </div>
</div>
