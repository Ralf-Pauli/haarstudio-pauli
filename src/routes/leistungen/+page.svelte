<script lang="ts">
    import Tabs from "./Tabs.svelte";
    import type {PageProps} from './$types';
    import {onMount} from "svelte";
    import {browser} from "$app/environment";
    import Category from "./Category.svelte";

    let {data}: PageProps = $props();
    console.log(data.categories)
    const categories = $derived(data.categories);
    const tabsValueParam = $derived(data.tabsValueParam);

    let activeCategory = $derived(categories[0]);

    onMount(() => {
        if (tabsValueParam) {
            const newCategory = categories.find((category: any) => category.name === tabsValueParam);
            if (newCategory) {
                activeCategory = newCategory;
            }
        }
    });

    $effect(() => {
        if (browser) {
            const tabContainer = document.getElementById("tabcon");

            if (tabContainer) {
                tabContainer.childNodes.forEach((node: any) => {
                    if (node.classList === undefined) return;
                    if (activeCategory?.name === node.textContent.trim()) {
                        node.classList.replace("border-transparent", "border-primary");
                    } else {
                        node.classList.replace("border-primary", "border-transparent");
                    }
                });
            }
        }
    });
</script>

<div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-5 md:gap-20">
    <Tabs categories={categories} bind:activeCategory />
    <div class="flex gap-3 pt-3 w-full">
        {#key activeCategory}
            {#if activeCategory === null}
                <div class="m-auto w-8 h-8 border-4 border-dashed rounded-full animate-spin border-t-primary">
                    Keine Leistungen vorhanden
                </div>
            {:else}
                <Category category={activeCategory} />
            {/if}
        {/key}
    </div>
</div>