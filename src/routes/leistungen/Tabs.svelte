<script lang="ts">
    import Tab from "./Tab.svelte";
    import type { Category } from "$utils/types";

    let {
        categories,
        activeCategory = $bindable(),
    }: { categories: Category[]; activeCategory: Category } = $props();
</script>

<div role="tablist" aria-label="Kategorien"
     class="mt-10 flex gap-x-10 overflow-x-auto overflow-y-hidden border-b border-rule md:flex-wrap md:overflow-visible">
    {#each categories as category, index (category.id)}
        <Tab {category} {index}
             isActive={activeCategory.id === category.id}
             onselect={() => (activeCategory = category)}/>
    {/each}
</div>
