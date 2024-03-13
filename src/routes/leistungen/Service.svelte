<script lang="ts">
  import { Separator } from "$components/ui/separator";
  import * as Collapsible from "$lib/components/ui/collapsible";
  import { ChevronUp, ChevronDown } from "lucide-svelte";

  export let service: any, activeServiceId: any, toggleService: any;

  let collapsibleOpen = false;

  let formatPrice = (price: any) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };
</script>

<div>
  {#if service.sub_services.length > 0}
    <Collapsible.Root bind:open={collapsibleOpen}>
      <Collapsible.Trigger class="flex flex-row gap-2 items-center w-80">
        <div class="inline font-bold">{service.name}</div>
        {#if collapsibleOpen}
          <ChevronUp class="h-5 w-5 align-middle ml-auto" />
        {:else}
          <ChevronDown class="h-5 w-5 ml-auto" />
        {/if}
      </Collapsible.Trigger>
      <Collapsible.Content class="flex flex-col gap-1 ml-6 mt-3">
        {#each service.sub_services as subService, index}
          <div class="flex flex-row gap-8">
            <div>{subService.name}</div>
            <div class="font-bold ml-auto">{formatPrice(subService.price)}</div>
          </div>
          {#if index !== service.sub_services.length - 1}
            <Separator class="bg-gray-700" />
          {/if}
        {/each}
      </Collapsible.Content>
    </Collapsible.Root>
  {:else}
    <div class="flex items-center">
      <div class="inline">{service.name}</div>
      {#if service.price !== null}
        <div class="ml-4">{formatPrice(service.price)}</div>
      {/if}
    </div>
  {/if}
</div>
