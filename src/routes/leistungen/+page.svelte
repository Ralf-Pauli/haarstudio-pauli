<script lang="ts">
    import Tabs from "./Tabs.svelte";
    import type { PageProps } from "./$types";
    import type { Category as CategoryType } from "$lib/utils/types";
    import Category from "./Category.svelte";

    let { data }: PageProps = $props();
    const categories = data.categories;

    const getCategoryFromQueryParam = () => {
        if (!data.tabsValueParam) return false;
        return (
            categories.find(
                (category) => category.name === data.tabsValueParam,
            ) ?? false
        );
    };

    let activeCategory = $state(getCategoryFromQueryParam() || categories[0]);

    const setActiveCategory = (category: CategoryType) => {
        activeCategory = category;
    };
</script>

<div class="max-w-5xl mx-auto flex flex-col md:flex-row gap-5 md:gap-20">
    <Tabs { categories } { setActiveCategory } />
    <div class="flex gap-3 pt-3 w-full">
        {#key activeCategory}
            {#if activeCategory === null}
                <div class="m-auto w-8 h-8 border-4 border-dashed rounded-full animate-spin border-t-primary"></div>
            {:else}
                <Category category={ activeCategory }/>
            {/if}
        {/key}
    </div>
</div>

