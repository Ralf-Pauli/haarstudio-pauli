<script lang="ts">
    import { formatPrice } from "$lib/utils";
    import type { Services } from "$lib/utils/types";

    let { service }: { service: Services } = $props();
</script>

<div class="md:w-1/2 px-6 pb-10">
    {#if service.sub_services && service.sub_services!.length > 0}
        <div class="flex gap-2 items-center">
            <div class="inline font-bold border-b-primary pb-1 mb-2 underline decoration-primary decoration-2 underline-offset-4">{service.name}</div>
        </div>
        <div class="flex flex-col gap-1 ml-6 mt-3">
            {#each service.sub_services as subService, index}
                {#if index % 2 === 1 && index > 0}
                    <div class="flex bg-zinc-800 p-2 rounded-md">
                        <div>{subService.name}</div>
                        <div class="font-bold ml-auto">{formatPrice(subService.price)}</div>
                    </div>
                {:else}
                    <div class="flex p-2">
                        <div>{subService.name}</div>
                        <div class="font-bold ml-auto">{formatPrice(subService.price)}</div>
                    </div>
                {/if}
            {/each}
        </div>
    {:else}
        <div class="flex items-center">
            <div class="inline">{service.name}</div>
            {#if service.price !== null}
                <div class="font-bold ml-auto">{formatPrice(service.price)}</div>
            {/if}
        </div>
    {/if}
</div>
