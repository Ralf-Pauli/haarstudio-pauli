<script lang="ts">
    import { untrack } from "svelte";
    import Tabs from "./Tabs.svelte";
    import type { PageProps } from "./$types";
    import Category from "./Category.svelte";
    import type { Category as CategoryType } from '$lib/utils/types';

    let { data }: PageProps = $props();
    let categories = $derived(data.categories);

    let activeCategory = $state(
        data.categories.find((category : CategoryType) => category.name === data.tabsValueParam) ||
            data.categories[0],
    );

    $effect(() => {
        const found = data.categories.find((category : CategoryType) => category.name === data.tabsValueParam);
        // Only react to the ?tab= param; untrack so manual tab changes are not overwritten.
        if (found) untrack(() => (activeCategory = found));
    });

    let index = $derived(Math.max(0, categories.findIndex((c: CategoryType) => c.id === activeCategory.id)));
</script>

<svelte:head>
    <title>Leistungen & Preise – Haarstudio Pauli</title>
</svelte:head>

<div class="container-page pt-4 md:pt-8">
    <div class="flex flex-wrap items-end justify-between gap-4">
        <h1 class="font-display text-4xl font-bold leading-none tracking-[-0.015em] md:text-5xl">Leistungen &amp; Preise</h1>
        <p class="text-[15px] text-muted">Preise inkl. MwSt. · Endpreis nach Haarlänge &amp; Aufwand</p>
    </div>

    <Tabs { categories } bind:activeCategory={ activeCategory } />

    {#key activeCategory.id}
        <Category category={ activeCategory } {index} total={categories.length}/>
    {/key}

</div>
