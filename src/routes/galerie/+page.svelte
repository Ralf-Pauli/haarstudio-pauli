<script lang="ts">
    import type {PageProps} from './$types';

    let {data}: PageProps = $props();


</script>

<div class="max-w-5xl mx-auto flex gap-20">
    {#if data}
        <div class="columns-1 md:columns-3 gap-6">
            {#each data.images as image}
                <div class="p-3 md:p-0">
                    <img class="md:mb-6 rounded-xl" src={image.url} alt={image.name}/>
                </div>
            {/each}
        </div>
    {/if}
</div>

