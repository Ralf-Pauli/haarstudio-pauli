<script lang="ts">
    import Tabs from "./Tabs.svelte";
    import type { PageProps } from "./$types";
    import Category from "./Category.svelte";
    import type { Category as CategoryType } from '$lib/utils/types';
    import { categoryLabel } from "$lib/categories";

    let { data }: PageProps = $props();
    let categories = $derived(data.categories);

    let activeCategory = $state(
        data.categories.find((category : CategoryType) => category.name === data.tabsValueParam) ||
            data.categories[0],
    );

    $effect(() => {
        const found = data.categories.find((category : CategoryType) => category.name === data.tabsValueParam);
        if (found && found.name !== activeCategory.name) {
            activeCategory = found;
        }
    });

    let index = $derived(Math.max(0, categories.findIndex((c: CategoryType) => c.id === activeCategory.id)));
    let prev = $derived(categories[(index + categories.length - 1) % categories.length]);
    let next = $derived(categories[(index + 1) % categories.length]);
</script>

<svelte:head>
    <title>Leistungen & Preise – Haarstudio Pauli</title>
</svelte:head>

<div class="container-page pt-6 md:pt-12">
    <div class="flex flex-wrap items-end justify-between gap-4">
        <h1 class="font-display text-[44px] font-bold leading-none tracking-[-0.015em] md:text-[72px]">Leistungen &amp; Preise</h1>
        <p class="text-[15px] text-muted">Preise inkl. MwSt. · Endpreis nach Haarlänge &amp; Aufwand</p>
    </div>

    <Tabs { categories } bind:activeCategory={ activeCategory } />

    {#key activeCategory.id}
        <Category category={ activeCategory } {index} total={categories.length}/>
    {/key}

    <div class="mt-16 flex flex-wrap justify-between gap-4 border-t border-rule pt-6">
        <button type="button" class="min-h-11 cursor-pointer py-3 hover:text-brand" onclick={() => (activeCategory = prev)}>← {categoryLabel(prev)}</button>
        <button type="button" class="min-h-11 cursor-pointer py-3 font-semibold hover:text-brand" onclick={() => (activeCategory = next)}>{categoryLabel(next)} →</button>
    </div>
</div>
