<script lang="ts">
    import Service from "./Service.svelte";
    import type {Category} from "$utils/types";

    let { category }: { category: Category } = $props();

    let serviceWithSubServices = $derived(
        category.services.filter((service: any) => service.sub_services.length > 0)
    );
    let otherServices = $derived(
        category.services.filter((service: any) => service.sub_services.length === 0)
    );

    let formatPrice = (price: any) => {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };
</script>

<div class="flex flex-col md:flex-row w-full flex-wrap">
    {#if category.services.length === 0}
        <div class="pl-6 text-center">No services available</div>
    {:else if serviceWithSubServices.length > 0}
        {#each serviceWithSubServices as service}
            <Service {service}/>
        {/each}
        {#if otherServices.length > 0}
            <div class="md:w-1/2 px-6 pb-10">
                <div class="flex gap-2 items-center">
                    <div class="inline font-bold border-b-primary pb-1 mb-2 underline decoration-primary decoration-2 underline-offset-4">
                        Sonstige Leistungen
                    </div>
                </div>
                <div class="flex flex-col gap-1 ml-6 mt-3">
                    {#each otherServices as service, index}
                        {#if index % 2 === 1 && index > 0}
                            <div class="flex bg-zinc-800 p-2 rounded-md">
                                <div>{service.name}</div>
                                <div class="font-bold ml-auto">{formatPrice(service.price)}</div>
                            </div>
                        {:else}
                            <div class="flex p-2">
                                <div>{service.name}</div>
                                <div class="font-bold ml-auto">{formatPrice(service.price)}</div>
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        {/if}
    {:else}
        <div class="md:w-1/2 px-6 pb-10">
            <div class="flex gap-2 items-center">
                <div class="inline font-bold border-b-primary pb-1 mb-2 underline decoration-primary decoration-2 underline-offset-4">{category.name}</div>
            </div>
            <div class="flex flex-col gap-1 ml-6 mt-3">
                {#each category.services as service, index}
                    {#if index % 2 === 1 && index > 0}
                        <div class="flex bg-zinc-800 p-2 rounded-md">
                            <div>{service.name}</div>
                            <div class="font-bold ml-auto">{formatPrice(service.price)}</div>
                        </div>
                    {:else}
                        <div class="flex p-2">
                            <div>{service.name}</div>
                            <div class="font-bold ml-auto">{formatPrice(service.price)}</div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}
</div>
