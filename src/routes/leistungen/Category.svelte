<script>
  import Service from "./Service.svelte";

  export let category;
  export let activeServiceId;
  export let toggleService; // Ensure toggleService is declared as a prop
</script>

<div>
  {#each category.services as service}
    <Service {service} {activeServiceId} {toggleService} />
  {/each}
</div>
