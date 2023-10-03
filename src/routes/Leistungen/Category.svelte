<script lang="ts">
  import Service from "./Service.svelte";

  export let category: any;
  let services = category?.services.data;
</script>

<div class="mx-auto">
  <h2 class="text-2xl text-center">{category.name}</h2>
  <div class="flex flex-col">
    {#each services as service}
      <Service name={service.name} price={service.price} />
    {/each}
  </div>
</div>
