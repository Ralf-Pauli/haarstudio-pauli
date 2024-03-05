<script>
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  export let service;
  export let activeServiceId;
  export let toggleService;
</script>

<div>
  {#if service.sub_services.length > 0}
    <button class="flex items-center cursor-pointer" on:click={() => toggleService(service.id)}>
      <div class="inline">{service.name}</div>
      <div>
        <svg class="inline" data-cy="chevron" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none">
            <path style="stroke:#000" stroke-width="2" d="M5 8l7 7 7-7"></path>
          </g>
        </svg>
      </div>
    </button>
    {#if activeServiceId === service.id}
      <div transition:fly="{{ duration: 300, easing: cubicOut }}">
        {#each service.sub_services as subService}
          <div class="ml-6">{subService.name} - {subService.price}</div>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="flex items-center">
      <div class="inline">{service.name}</div>
      {#if service.price !== null}
        <div class="ml-4">{service.price}</div>
      {/if}
    </div>
  {/if}
</div>
