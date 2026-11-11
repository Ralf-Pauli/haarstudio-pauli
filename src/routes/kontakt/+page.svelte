<script lang="ts">
    import Map from "$lib/components/Map.svelte";
    import OpeningStatus from "$components/OpeningStatus.svelte";
    import {Phone} from "@lucide/svelte";
    import {siteConfig} from "$lib/config";
    import type {PageProps} from "./$types";

    let {data}: PageProps = $props();
    let contact = $derived(data.contact);

    let routeUrl = $derived(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            `${siteConfig.name} ${contact.address.city}`,
        )}`,
    );
</script>

<svelte:head>
    <title>Kontakt – Haarstudio Pauli</title>
</svelte:head>

<div class="container-page pt-6 md:pt-12">
    <h1 class="font-display text-[56px] font-bold leading-[0.95] tracking-[-0.015em] md:text-[104px]">Kontakt<span class="text-primary">.</span></h1>
    <p class="mt-6 max-w-[520px] text-lg leading-[1.6] text-soft">Öffnungszeiten, Adresse und alle Wege zu uns – auf einen Blick.</p>
</div>

<!-- Öffnungszeiten -->
<section id="zeiten" class="container-page pt-14 md:pt-28">
    <h2 class="section-heading mb-4 md:mb-8">Öffnungszeiten</h2>
    <OpeningStatus/>
</section>

<!-- Adresse & Karte -->
<section class="container-page pt-14 md:pt-32">
    <div class="flex flex-wrap items-stretch gap-x-20 gap-y-12">
        <div class="flex flex-[1_1_340px] flex-col gap-7">
            <h2 class="section-heading">Adresse &amp; Kontakt</h2>
            <div>
                <div class="font-display text-[32px] font-bold leading-[1.1] md:text-[44px]">
                    {contact.address.street}<br>{contact.address.zipcode} {contact.address.city}
                </div>
                <a href={routeUrl} target="_blank" rel="noopener noreferrer" class="btn-outline mt-5 text-[15px]">Route planen ↗</a>
            </div>

            <div class="flex flex-col gap-3.5 border-t border-text pt-6">
                <a href="tel:{contact.contact.phone.replaceAll(' ', '')}" class="flex items-center gap-3.5 no-underline">
                    <span class="flex size-12 flex-none items-center justify-center rounded-full border border-text"><Phone class="size-5"/></span>
                    <span>
                        <span class="block text-[13px] text-muted">Telefon</span>
                        <span class="block font-display text-[28px] font-bold leading-[1.1]">{contact.contact.phone}</span>
                    </span>
                </a>
                <div class="mt-1 flex flex-wrap gap-2.5">
                    {#each contact.socialMedia as media}
                        <a href={media.url} target="_blank" rel="noopener noreferrer"
                           class="rounded-full border border-rule px-[18px] py-[11px] text-[15px] no-underline transition-colors hover:bg-secondary">{media.name} ↗</a>
                    {/each}
                </div>
            </div>

            {#if siteConfig.directions.length > 0}
                <div class="border-t border-text">
                    {#each siteConfig.directions as direction}
                        <div class="border-b border-rule py-[18px]">
                            <div class="mb-1.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">{direction.label}</div>
                            <div class="text-[17px] leading-[1.6]">{direction.text}</div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <div class="flex-[2_1_560px]">
            <Map/>
        </div>
    </div>
</section>
