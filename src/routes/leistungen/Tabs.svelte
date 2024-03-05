<script>
  export let categories;
  export let activeCategoryId;
  export let setActiveCategory;
</script>

<div class="flex flex-col items-start">
  {#each categories as category}
    <button
      class:active="{activeCategoryId === category.id}"
      on:click="{() => setActiveCategory(category.id)}"
    >
      {category.name}
    </button>
  {/each}
</div>
