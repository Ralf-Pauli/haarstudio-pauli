<script lang="ts">
    import type { Category } from "$utils/types";
    import { categoryLabel, categoryNumber } from "$lib/categories";

    let {
        category,
        index,
        isActive = false,
        onselect,
    }: {
        category: Category;
        index: number;
        isActive?: boolean;
        onselect: () => void;
    } = $props();
</script>

<button
        type="button"
        role="tab"
        aria-selected={isActive}
        class="min-h-11 shrink-0 cursor-pointer whitespace-nowrap border-b-[3px] py-3.5 font-display text-xl md:text-2xl transition-colors {isActive ? 'border-primary font-bold text-text' : 'border-transparent font-medium text-muted hover:text-text'}"
        onclick={onselect}
>
    <span class="mr-2.5 align-[6px] font-sans text-sm font-semibold {isActive ? 'text-brand' : 'text-faint'}">{categoryNumber(index)}</span>{categoryLabel(category)}
</button>
