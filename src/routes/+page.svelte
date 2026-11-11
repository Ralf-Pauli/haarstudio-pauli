<script lang="ts">
    import type {PageProps} from './$types';
    import BookingWidget from "$components/BookingWidget.svelte";
    import OpeningStatus from "$components/OpeningStatus.svelte";
    import {siteConfig} from "$lib/config";
    import {categoryLabel, categoryNumber, getCategoryImage} from "$lib/categories";

    let {data}: PageProps = $props();
    let categories = $derived(data.categories);

    const galleryPreview = [
        {src: "damen.jpg", alt: "Lange blonde Haare mit Volumen"},
        {src: "herren.jpg", alt: "Herrenschnitt mit Kontur"},
        {src: "kinder.jpg", alt: "Kinderfrisur mit Spange"},
        {src: "cosmetic.jpg", alt: "Pflegebehandlung für lange Haare"},
    ];
    const galleryImages = import.meta.glob('$lib/assets/gallery/*.{jpg,png,webp}', {eager: true, query: '?url', import: 'default'}) as Record<string, string>;
    const galleryUrl = (file: string) => Object.entries(galleryImages).find(([k]) => k.endsWith(`/${file}`))?.[1] ?? "";

    const hasAbout = $derived(!!(siteConfig.about.quote || siteConfig.about.text));
</script>

<svelte:head>
    <title>{siteConfig.name} – Ihr Friseur am Stadtgraben in Deggendorf</title>
</svelte:head>

<!-- Hero -->
<section class="container-page flex flex-col gap-8 pt-7 md:flex-row md:items-end md:gap-12 md:pt-10">
    <div class="flex-[1_1_520px] md:pb-6">
        <p class="mb-3.5 text-sm font-medium text-brand md:mb-7 md:font-display md:text-[22px] md:font-normal md:italic">Ihr Friseur am Stadtgraben · Deggendorf</p>
        <h1 class="font-display text-[60px] font-bold leading-[0.95] tracking-[-0.015em] md:text-[128px]">Haarstudio<br>Pauli<span class="text-primary">.</span></h1>
        <p class="mt-5 max-w-[460px] text-base leading-[1.55] text-soft md:mt-9 md:text-lg md:leading-[1.6]">
            Schneiden, färben, hochstecken – für Damen, Herren und Kinder. Ohne Hektik, mit ehrlicher Beratung und Preisen, die vorher feststehen.
        </p>
        <div class="mt-9 hidden flex-wrap items-center gap-7 md:flex">
            <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" class="btn-pill">Termin reservieren →</a>
            <a href="/leistungen" class="py-2.5 underline underline-offset-[6px] hover:text-brand">Alle Preise ansehen</a>
        </div>
    </div>
    <figure class="m-0 flex-[1_1_380px]">
        <enhanced:img src="$lib/assets/hero.jpg" alt="Innenansicht des Haarstudio Pauli mit Bedienplätzen und Produktregal"
                      class="block h-[300px] w-full rounded-[20px] object-cover object-[40%_50%] md:h-[560px] md:rounded-none"/>
        <figcaption class="mt-2.5 hidden text-[13px] text-muted md:block">Der Salon, {siteConfig.address.street}</figcaption>
    </figure>
    <a href="/leistungen" class="-mt-4 w-fit py-2.5 text-[15px] font-medium underline underline-offset-[5px] md:hidden">Alle Preise ansehen →</a>
</section>

<!-- Leistungen -->
<section id="karte" class="container-page pt-12 md:pt-32">
    <div class="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-text pb-2.5 md:border-b md:pb-5">
        <h2 class="section-heading">Leistungen</h2>
        <a href="/leistungen" class="py-2 text-sm font-medium hover:text-brand md:py-2.5 md:text-[17px]">
            <span class="md:hidden">Preisliste →</span><span class="hidden md:inline">Vollständige Preisliste →</span>
        </a>
    </div>

    <div class="grid gap-x-[72px] md:grid-cols-2">
        {#each categories as category, i (category.id)}
            <a href="/leistungen?tab={encodeURIComponent(category.name)}"
               class="group flex items-center gap-3.5 border-b border-rule py-3.5 no-underline md:gap-6 md:py-6">
                <span class="w-[22px] flex-none text-xs font-semibold text-brand md:w-10 md:font-display md:text-lg md:font-normal">{categoryNumber(i)}</span>
                <img src={getCategoryImage(category.image)} alt="" loading="lazy"
                     class="h-16 w-[52px] flex-none rounded-[10px] object-cover md:h-[88px] md:w-[72px] md:rounded-none"/>
                <span class="min-w-0 flex-1">
                    <span class="block font-display text-[22px] font-bold leading-[1.05] md:text-4xl md:font-normal md:leading-none group-hover:text-brand">{categoryLabel(category)}</span>
                    <span class="mt-[3px] block text-[13px] text-muted md:mt-1.5 md:font-display md:text-[17px] md:italic">{category.tagline}</span>
                </span>
                <span class="flex-none text-right">
                    <span class="block text-[11px] text-muted md:text-[13px]">ab</span>
                    <span class="block font-display text-lg font-medium tabular-nums md:text-3xl md:font-normal">{category.from}</span>
                </span>
                <span aria-hidden="true" class="hidden flex-none text-[22px] text-brand md:block">→</span>
            </a>
        {/each}
    </div>
</section>

<!-- Der Salon -->
{#if hasAbout}
    <section id="salon" class="container-page flex flex-wrap items-center gap-8 pt-12 md:gap-14 md:pt-32">
        <div class="hidden flex-[1_1_360px] grid-cols-2 gap-3 md:grid">
            <enhanced:img src="$lib/assets/gallery/styling.jpg" alt="Hochsteckfrisur mit Haarnadeln" class="h-[340px] w-full object-cover"/>
            <enhanced:img src="$lib/assets/gallery/coloration.jpg" alt="Kupferrotes Haar wird gekämmt" class="mt-16 h-[340px] w-full object-cover"/>
        </div>
        <div class="flex-[1_1_440px] rounded-[20px] bg-secondary p-6 md:rounded-none md:bg-transparent md:p-0">
            {#if siteConfig.about.quote}
                <p class="font-display text-2xl font-medium leading-tight md:text-[44px] md:font-light md:leading-[1.2] md:tracking-[-0.01em]">„{siteConfig.about.quote}“</p>
                {#if siteConfig.about.author}
                    <p class="mt-3.5 text-sm text-muted md:mt-6 md:text-[15px]">— {siteConfig.about.author}</p>
                {/if}
            {/if}
            {#if siteConfig.about.text}
                <p class="mt-6 max-w-[480px] text-[17px] leading-[1.7] text-soft md:mt-10">{siteConfig.about.text}</p>
            {/if}
        </div>
    </section>
{/if}

<!-- Galerie-Vorschau -->
<section id="galerie" class="container-page pt-12 md:pt-32">
    <div class="mb-3.5 flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-text pb-2.5 md:mb-6 md:border-b md:pb-5">
        <h2 class="section-heading">Galerie</h2>
        <a href="/galerie" class="py-2 text-sm font-medium hover:text-brand md:py-2.5 md:text-[17px]">
            <span class="md:hidden">Alle ansehen →</span><span class="hidden md:inline">Alle Arbeiten ansehen →</span>
        </a>
    </div>
    <div class="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {#each galleryPreview as photo}
            <img src={galleryUrl(photo.src)} alt={photo.alt} loading="lazy"
                 class="h-[150px] w-full rounded-xl object-cover md:h-[360px] md:rounded-none"/>
        {/each}
    </div>
</section>

<!-- Öffnungszeiten -->
<section id="zeiten" class="container-page pt-12 md:pt-28">
    <h2 class="section-heading mb-4 md:mb-8">Öffnungszeiten</h2>
    <OpeningStatus/>
</section>

<BookingWidget/>
