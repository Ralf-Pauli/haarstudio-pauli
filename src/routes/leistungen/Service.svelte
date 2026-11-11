<script lang="ts">
    import { formatPrice } from "$lib/utils";
    import type { Services } from "$lib/utils/types";

    let { title, items }: { title: string; items: Services[] } = $props();
</script>

<div class="border-t-2 border-primary pt-[18px]">
    <h3 class="mb-2 font-display text-[22px] font-bold text-brand">{title}</h3>
    {#each items as item (item.id)}
        <div class="flex items-baseline justify-between gap-5 border-b border-rule py-3 text-base">
            <span>{item.name}</span>
            <span class="flex-none font-semibold tabular-nums text-brand">{formatPrice(item.price)}</span>
        </div>
    {/each}
</div>
