<script lang="ts">
    import type {PageProps} from './$types';

    let {data}: PageProps = $props();
    let images = $derived(data.images);
</script>

<div class="max-w-5xl mx-auto flex gap-20">
    {#if images}
        <div class="columns-1 md:columns-3 gap-6">
            {#each images as image}
                <div class="p-3 md:p-0">
                    <enhanced:img class="md:mb-6 rounded-xl w-full h-auto object-cover" src={image.asset} alt={image.name}/>
                </div>
            {/each}
        </div>
    {/if}
</div>

