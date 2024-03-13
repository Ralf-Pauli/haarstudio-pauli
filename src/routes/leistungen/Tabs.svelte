<script lang="ts">
  export let categories: any;
  export let activeCategoryId: any;
  export let setActiveCategory: any;
</script>

<div class="flex flex-col items-start">
  {#each categories as category}
    <button
      class="p-3 w-full text-left"
      on:click={(value) => {
        setActiveCategory(category.id);
        value.originalTarget.parentElement.childNodes.forEach((node) => {
          node.classList.remove("bg-gray-800");
        });
        value.originalTarget.classList.add("bg-gray-800");
      }}>
      {category.name}
    </button>
  {/each}
</div>
