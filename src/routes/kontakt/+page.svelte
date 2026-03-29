<script lang="ts">
    import Map from "$lib/components/Map.svelte";
    import FacebookImage from "$lib/assets/facebook.png";
    import type {PageProps} from "./$types";

    let {data}: PageProps = $props();
    const contact = data.contact;
</script>

<Map/>
<div class="contact-info my-10 sm:my-20 max-w-5xl mx-auto gap-10 sm:gap-4 flex flex-col sm:flex-row justify-between text-center">
    <div>
        <h4 class="mb-3 text-xl font-semibold underline decoration-primary decoration-1 underline-offset-3">Kontakt</h4>
        <div>
            <div class="flex flex-col mb-1">
                <p class="dark:text-zinc-400 text-zinc-600">Anschrift:</p>
                <div>
                    <div>
                        {contact.address.street}
                    </div>
                    <div>
                        {contact.address.zipcode} {contact.address.city}
                    </div>
                </div>
            </div>
            <div class="flex flex-col mb-1">
                <p class="dark:text-zinc-400 text-zinc-600">Telefon:</p>
                <a class="hover:underline hover:decoration-primary"
                   href="tel:{contact.contact.phone}">{contact.contact.phone}</a>
            </div>
        </div>
    </div>

    <div>
        <h4 class="mb-3 text-xl font-semibold underline decoration-primary decoration-1 underline-offset-3">Social
            Media</h4>
        <div class="flex flex-col items-center gap-2">
            {#each contact.socialMedia as media}
                <div>
                    <a href={media.url} target="_blank" class="items-center flex">
                        {#if media.name === 'Facebook'}
                            <img src={FacebookImage} alt="{media.name}" class="h-4 inline mr-2"/>
                        {/if}
                        <span class="hover:underline hover:decoration-primary"> {media.name}</span>
                    </a>
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h4 class="mb-3 text-xl font-semibold underline decoration-primary decoration-1 underline-offset-3">
            Öffnungszeiten
        </h4>
        <div class="flex flex-col gap-1">
            {#each contact.openingHours as openingHour}
                <div class="">
                    <div class="dark:text-zinc-400 text-zinc-600">{openingHour.days}:</div>
                    {#if openingHour.closed}
                        <div>{openingHour.hours}</div>
                    {:else}
                        <div>Geschlossen</div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h4 class="mb-3 text-xl font-semibold underline decoration-primary decoration-1 underline-offset-3">
            Rechtliches</h4>
        <div class="flex flex-col gap-1">
            <a href="/impressum" class="hover:underline hover:decoration-primary">Impressum</a>
            <a href="/datenschutz" class="hover:underline hover:decoration-primary">Datenschutz</a>
        </div>
    </div>
</div>
