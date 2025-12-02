<script lang="ts">
    import Tabs from "./Tabs.svelte";
    import type {PageProps} from './$types';
    import {onMount} from "svelte";
    import {browser} from "$app/environment";
    import Category from "./Category.svelte";

    let {data}: PageProps = $props();
    const categories = () => data.categories;

    const tabsValueParam = data.tabsValueParam;
    let activeCategoryId = $state<number | null>(null);

    onMount(() => {
        setActiveCategory(categories()[0].id);

        if (tabsValueParam) {
            const activeCategory = categories().find((category: any) => category.name === tabsValueParam);
            if (activeCategory) {
                setActiveCategory(activeCategory.id);
            }
        }
    });

    $effect(() => {
        if (browser) {
            const tabContainer = document.getElementById("tabcon");

            if (tabContainer) {
                tabContainer.childNodes.forEach((node: any) => {
                    if (node.classList === undefined) return;
                    if (getActiveCategory()?.name === node.textContent.trim()) {
                        node.classList.replace("border-transparent", "border-primary");
                    } else {
                        node.classList.replace("border-primary", "border-transparent");
                    }
                });
            }
        }
    });

    const getActiveCategory = () => categories().find((c: any) => c.id === activeCategoryId) || categories()[0];

    function setActiveCategory(categoryId: number) {
        activeCategoryId = categoryId;
    }
</script>

<div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-5 md:gap-20">
    <Tabs categories={categories()} {setActiveCategory}/>
    <div class="flex gap-3 pt-3 w-full">
        {#key activeCategoryId}
            {#if activeCategoryId === null}
                <div class="m-auto w-8 h-8 border-4 border-dashed rounded-full animate-spin border-t-primary"/>
            {:else}
                <Category category={getActiveCategory()}/>
            {/if}
        {/key}
    </div>
</div>