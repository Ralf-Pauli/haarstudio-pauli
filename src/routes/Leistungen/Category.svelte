<script lang="ts">
  import Service from "./Service.svelte";

  export let category: any;
  let services = category?.services;
</script>

<div class="mx-auto">
  <div class="flex flex-col">
    {#each services as service}
      <Service name={service.name} price={service.price} />
    {/each}
  </div>
</div>
