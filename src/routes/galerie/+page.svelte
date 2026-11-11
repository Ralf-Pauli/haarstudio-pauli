<script lang="ts">
    import type {PageProps} from './$types';
    import {siteConfig} from "$lib/config";
    import {X, ArrowLeft, ArrowRight} from "@lucide/svelte";

    let {data}: PageProps = $props();
    let images = $derived(data.images);

    const filters = [
        {id: 'alle', no: '', label: 'Alle'},
        {id: 'herren', no: '01', label: 'Herren'},
        {id: 'damen', no: '02', label: 'Damen'},
        {id: 'kinder', no: '03', label: 'Kinder'},
        {id: 'farbe', no: '04', label: 'Farbe'},
        {id: 'styling', no: '05', label: 'Styling'},
        {id: 'pflege', no: '06', label: 'Pflege'},
        {id: 'salon', no: '', label: 'Salon'},
    ];
    const byId = Object.fromEntries(filters.map((f) => [f.id, f]));

    const heights = ['h-[520px]', 'h-[360px]', 'h-[440px]', 'h-[380px]', 'h-[500px]', 'h-[340px]', 'h-[420px]'];

    let active = $state('alle');
    let lightbox = $state(-1);
    let closeButton = $state<HTMLButtonElement | null>(null);
    let opener: HTMLElement | null = null;

    let shown = $derived(images.filter((p) => active === 'alle' || p.filter === active));
    let current = $derived(lightbox >= 0 ? shown[lightbox] : null);

    const count = (id: string) => (id === 'alle' ? images.length : images.filter((p) => p.filter === id).length);
    const tag = (filter: string) => {
        const f = byId[filter];
        return f ? `${f.no ? f.no + ' ' : ''}${f.label}` : '';
    };

    function pick(id: string) {
        active = id;
        lightbox = -1;
    }

    function open(index: number, event: Event) {
        opener = event.currentTarget as HTMLElement;
        lightbox = index;
    }

    function close() {
        lightbox = -1;
        opener?.focus();
    }

    function step(delta: number) {
        lightbox = (lightbox + delta + shown.length) % shown.length;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (lightbox < 0) return;
        if (event.key === 'Escape') close();
        else if (event.key === 'ArrowLeft') step(-1);
        else if (event.key === 'ArrowRight') step(1);
    }

    $effect(() => {
        if (lightbox >= 0) closeButton?.focus();
    });
</script>

<svelte:window onkeydown={handleKeydown}/>

<svelte:head>
    <title>Galerie – Haarstudio Pauli</title>
</svelte:head>

<div class="container-page pt-4 md:pt-8">
    <div class="flex flex-wrap items-end justify-between gap-5">
        <h1 class="font-display text-[44px] font-bold leading-[0.95] tracking-[-0.015em] md:text-[64px]">Galerie</h1>
        <p class="max-w-[420px] text-[17px] leading-[1.6] text-soft">
            Ein Blick auf unsere Arbeiten und in den Salon. Mehr Neues gibt es täglich auf
            <a class="underline hover:text-brand" href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>.
        </p>
    </div>

    <div role="tablist" aria-label="Nach Kategorie filtern"
         class="mt-12 flex gap-x-8 overflow-x-auto overflow-y-hidden border-b border-rule md:flex-wrap md:overflow-visible">
        {#each filters as f (f.id)}
            {@const selected = f.id === active}
            <button type="button" role="tab" aria-selected={selected} onclick={() => pick(f.id)}
                    class="min-h-11 shrink-0 cursor-pointer whitespace-nowrap border-b-[3px] py-3.5 font-display text-xl md:text-[22px] transition-colors {selected ? 'border-primary font-bold text-text' : 'border-transparent font-medium text-muted hover:text-text'}">
                {#if f.no}<span class="mr-2 align-[5px] font-sans text-[13px] font-semibold {selected ? 'text-brand' : 'text-faint'}">{f.no}</span>{/if}{f.label}
                <span class="font-sans text-sm font-medium text-faint">({count(f.id)})</span>
            </button>
        {/each}
    </div>

    <div class="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {#each shown as photo, k (photo.name)}
            <figure class="mb-4 break-inside-avoid">
                <button type="button" onclick={(e) => open(k, e)} aria-label="Bild vergrößern: {photo.title}"
                        class="block w-full cursor-zoom-in p-0">
                    <enhanced:img src={photo.asset} alt={photo.alt}
                                  class="block w-full rounded-xl object-cover md:rounded-none {heights[k % heights.length]}"/>
                </button>
                <figcaption class="flex items-baseline justify-between gap-3 pb-1 pt-3 text-[15px]">
                    <span>{photo.title}</span>
                    <span class="flex-none text-[13px] font-semibold text-brand">{tag(photo.filter)}</span>
                </figcaption>
            </figure>
        {/each}
    </div>

</div>

<!-- Lightbox -->
{#if current}
    <div role="dialog" aria-modal="true" aria-label="Bildansicht"
         class="fixed inset-0 z-50 flex flex-col bg-[rgba(20,19,17,0.95)] px-5 pb-8 pt-6 text-[#f4f2ed] md:px-10">
        <div class="flex items-center justify-between text-[15px]">
            <span>{lightbox + 1} / {shown.length}</span>
            <button type="button" bind:this={closeButton} onclick={close} aria-label="Schließen"
                    class="flex size-12 cursor-pointer items-center justify-center border border-[#5a545a] hover:bg-white/10"><X class="size-5"/></button>
        </div>
        <div class="flex min-h-0 flex-1 items-center justify-center gap-6 py-4">
            <button type="button" onclick={() => step(-1)} aria-label="Vorheriges Bild"
                    class="hidden size-14 flex-none cursor-pointer items-center justify-center border border-[#5a545a] hover:bg-white/10 md:flex"><ArrowLeft class="size-5"/></button>
            <div class="flex h-full min-h-0 min-w-0 flex-1 items-center justify-center">
                <enhanced:img src={current.asset} alt={current.alt} class="block h-auto max-h-[72vh] w-auto max-w-[min(100%,1100px)] object-contain"/>
            </div>
            <button type="button" onclick={() => step(1)} aria-label="Nächstes Bild"
                    class="hidden size-14 flex-none cursor-pointer items-center justify-center border border-[#5a545a] hover:bg-white/10 md:flex"><ArrowRight class="size-5"/></button>
        </div>
        <div class="mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-between gap-4">
            <div>
                <div class="text-[13px] font-semibold text-[#e1a847]">{tag(current.filter)}</div>
                <div class="mt-1 font-display text-[30px] font-bold">{current.title}</div>
            </div>
            <div class="flex flex-wrap items-center gap-5">
                <div class="flex gap-3 md:hidden">
                    <button type="button" onclick={() => step(-1)} aria-label="Vorheriges Bild" class="flex size-12 items-center justify-center border border-[#5a545a]"><ArrowLeft class="size-5"/></button>
                    <button type="button" onclick={() => step(1)} aria-label="Nächstes Bild" class="flex size-12 items-center justify-center border border-[#5a545a]"><ArrowRight class="size-5"/></button>
                </div>
                <a href="/leistungen" class="py-2.5 text-[15px] underline underline-offset-[6px]">Preise ansehen</a>
                <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer"
                   class="rounded-full bg-[#e1a847] px-[22px] py-3.5 text-[15px] font-semibold text-[#151412]">Diesen Look buchen →</a>
            </div>
        </div>
    </div>
{/if}
