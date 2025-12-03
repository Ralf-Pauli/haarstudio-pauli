<script lang="ts">
    import {Button} from "$lib/components/ui/button";
    import {ChevronLeft, ChevronRight} from "lucide-svelte";
    import Tab from "./Tab.svelte";
    import type {Category} from "$utils/types";

    let {
        categories,
        setActiveCategory,
    }: { categories: Category[]; setActiveCategory: Function } = $props();

    let buttonRow: any;

    const scrollLeft = () => {
        buttonRow.scrollBy({left: -100, behavior: "smooth"});
    };

    const scrollRight = () => {
        buttonRow.scrollBy({left: 100, behavior: "smooth"});
    };
</script>

<div class="overflow-hidden md:overflow-visible flex items-center md:items-start">
    <Button class="md:hidden p-2 hover:bg-transparent" size="icon" variant="ghost" onclick={scrollLeft}>
        <ChevronLeft/>
    </Button>
    <div bind:this={buttonRow} id="tabcon"
         class="flex md:flex-col items-start overflow-x-auto md:overflow-x-visible scroll-smooth">
        {#each categories as category}
            <Tab {category} {setActiveCategory}/>
        {/each}
    </div>
    <Button class="md:hidden p-2 hover:bg-transparent" size="icon" variant="ghost" onclick={scrollRight}>
        <ChevronRight/>
    </Button>
</div>
