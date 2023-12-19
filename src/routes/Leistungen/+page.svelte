<script lang="ts">
  import type { PageData } from "./$types";
  import * as Tabs from "$lib/components/ui/tabs";
  import Service from "./Service.svelte";
  import { Separator } from "$components/ui/separator";
  export let data: PageData;
  let categories = data?.categories?.data;

  function hasServiceTypeChanged(categoryIndex: number,currentIndex: number) {
    let currentService = categories[categoryIndex]?.services[currentIndex];
    let previousService = categories[categoryIndex]?.services[currentIndex -1];

    return JSON.stringify(currentService?.type) !== JSON.stringify(previousService?.type);
  }

</script>

<Tabs.Root value="categories" class="grid place-items-center">
  <Tabs.List>
    {#each categories as category}
      <Tabs.Trigger value={category.name}>{category.name}</Tabs.Trigger>
    {/each}
  </Tabs.List>
  {#each categories as category, categoryIndex }
    <Tabs.Content value={category.name}>
      {#each category?.services as service, serviceIndex}
        {#if serviceIndex !== 0 && hasServiceTypeChanged(categoryIndex, serviceIndex)}
          <Separator class="my-2 bg-primary"/>
        {/if}
        <Service name={service.name} price={service.price} />
      {/each}
    </Tabs.Content>
  {/each}
</Tabs.Root>
