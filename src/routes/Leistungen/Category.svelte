<script>
    import Service from "./Service.svelte";

    export let category;
    let services = category.attributes.Leistungen.data;
</script>

<div class="mx-auto">
    <h2 class="text-2xl text-center">{category.attributes.Name}</h2>
    <div class="flex flex-col">
        {#each services as service}
            <Service name={service.attributes.Name} price={service.attributes.Preis}/>
        {/each}
    </div>
</div>
