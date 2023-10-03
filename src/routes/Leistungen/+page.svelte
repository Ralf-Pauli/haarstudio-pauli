<script lang="ts">
  import type { PageData } from "./$types";
  import Category from "./Category.svelte";

  export let data: PageData;
  let categories = data?.categories?.data;
</script>

<div class="flex flex-col items-center justify-center mt-5 gap-5">
  {#each categories as category}
    <Category {category} />
  {/each}
</div>
