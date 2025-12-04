<script lang="ts">
    import type { Category } from "$utils/types";

    let {
        category,
        activeCategory = $bindable(),
        isActive = false,
    }: {
        category: Category;
        activeCategory: Category;
        isActive?: boolean;
    } = $props();
</script>

<button class="m-2 p-1 pl-2 w-full text-left border-solid border-b-2 md:border-b-0 md:border-l-2 whitespace-nowrap cursor-pointer"
        class:border-primary={isActive}
        class:border-transparent={!isActive}
        onclick={() =>
        activeCategory = category}
>
    {category.name}
</button>
