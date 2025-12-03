<script lang="ts">
    import type { Category } from "$utils/types";

    let {
        category,
        setActiveCategory,
    }: { category: Category; setActiveCategory: Function } = $props();
</script>

<button class="m-2 p-1 pl-2 w-full text-left border-solid border-b-2 md:border-b-0 md:border-l-2 border-transparent whitespace-nowrap"
        onclick={()=>setActiveCategory(category)}>
    {category.name}
</button>
