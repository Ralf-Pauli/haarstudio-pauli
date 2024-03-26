<script lang="ts">
  import type { PageData } from "./$types";
  import * as HCard from "$components/ui/hcard";

  export let data: PageData;
  let { categories } = data;
  const categoriesPerRow = 3;
  const rows = Math.ceil(categories.length / categoriesPerRow);

  const splitCategories = Array.from({ length: rows }, (_, i) => categories.slice(i * categoriesPerRow, i * categoriesPerRow + categoriesPerRow));
</script>

<div class="flex flex-col items-stretch justify-center gap-4 max-w-5xl mx-auto font-montserrat">
  <h2 class="font-bold">Unsere Leistungen</h2>
  {#each splitCategories as row}
    <div class="flex justify-center gap-4">
      {#each row as category}
        <HCard.Root img="https://picsum.photos/150" href="/leistungen?tab={category.name}">
          <HCard.Title>{category.name}</HCard.Title>
          <HCard.Description>very important description</HCard.Description>
        </HCard.Root>
      {/each}
    </div>
  {/each}
</div>
