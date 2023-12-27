<script lang="ts">
  import type { PageData } from "./$types";
  import * as Tabs from "$components/ui/tabs";
  import { Separator } from "$components/ui/separator";
  import Service from "./Service.svelte";

  export let data: PageData;
  let { categories, tabsValueParam } = data;

  function hasServiceTypeChanged(categoryIndex: number, currentIndex: number) {
    let currentService = categories[categoryIndex]?.services[currentIndex];
    let previousService = categories[categoryIndex]?.services[currentIndex - 1];

    return JSON.stringify(currentService?.type) !== JSON.stringify(previousService?.type);
  }

  $: tabsValue = tabsValueParam || "Bleaching";
</script>

<div class="max-w-5xl mx-auto">
  <Tabs.Root value={tabsValue} class="grid place-items-center">
    <Tabs.List class="w-full">
      {#each categories as category}
        <Tabs.Trigger value={category.name}>{category.name}</Tabs.Trigger>
      {/each}
    </Tabs.List>
    {#each categories as category, categoryIndex}
      <Tabs.Content value={category.name} class="w-full">
        {#each category?.services as service, serviceIndex}
          {#if serviceIndex !== 0 && hasServiceTypeChanged(categoryIndex, serviceIndex)}
            <Separator class="my-2 bg-primary" />
          {/if}
          <Service name={service.name} price={service.price} />
        {/each}
      </Tabs.Content>
    {/each}
  </Tabs.Root>
</div>
