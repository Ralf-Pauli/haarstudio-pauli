<script lang="ts">
  import type { PageData } from "./$types";
  import * as Tabs from "$lib/components/ui/tabs";
  import Service from "./Service.svelte";

  export let data: PageData;
  let categories = data?.categories?.data;
</script>

<Tabs.Root value="categories" class="grid place-items-center">
  <Tabs.List>
    {#each categories as category}
      <Tabs.Trigger value={category.name}>{category.name}</Tabs.Trigger>
    {/each}
  </Tabs.List>
  {#each categories as category }
    <Tabs.Content value={category.name}>
      {#each category?.services as service}
        <Service name={service.name} price={service.price} />
      {/each}
    </Tabs.Content>
  {/each}
</Tabs.Root>
