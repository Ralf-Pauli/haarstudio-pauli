<script lang="ts">
    import type { PageProps } from "./$types";
    import { FILTER_OPTIONS } from "$lib/content/gallery-admin";

    let { data }: PageProps = $props();

    const shipped = import.meta.glob(["/src/lib/assets/gallery/*.jpg", "/src/lib/assets/hero.jpg"], {
        eager: true,
        query: { w: "1000", format: "webp" },
        import: "default",
    }) as Record<string, string>;
    const src = (p: { imageId?: string; builtin?: string }) =>
        p.imageId
            ? `/api/admin/images/${p.imageId}`
            : (Object.entries(shipped).find(([path]) => path.endsWith(`/${p.builtin}.jpg`))?.[1] ?? "");

    const filters = [{ id: "alle", label: "Alle" }, ...FILTER_OPTIONS];
    const heights = ["h-[520px]", "h-[360px]", "h-[440px]", "h-[380px]", "h-[500px]", "h-[340px]", "h-[420px]"];

    let active = $state("alle");
    let shown = $derived(data.photos.filter((p) => active === "alle" || p.filter === active));
    const count = (id: string) => (id === "alle" ? data.photos.length : data.photos.filter((p) => p.filter === id).length);
    const label = (id: string) => FILTER_OPTIONS.find((f) => f.id === id)?.label ?? "";
</script>

<div class="-mx-5 mb-8 bg-primary/15 px-5 py-3 text-sm md:-mx-10 md:px-10">
    <strong>Vorschau</strong>: So sieht die Galerie mit Ihrem gespeicherten Entwurf ungefähr aus. Auf der Website werden die Fotos zusätzlich optimiert.
    {#if data.hasUnpublishedChanges}Das ist dort noch <strong>nicht</strong> sichtbar.{/if}
    <a href="/admin/galerie" class="ml-2 underline">Zurück zum Bearbeiten</a>
</div>

<h1 class="font-display text-[44px] font-bold leading-[0.95] tracking-[-0.015em] md:text-[64px]">Galerie</h1>

<div role="tablist" aria-label="Nach Kategorie filtern" class="mt-10 flex gap-x-8 overflow-x-auto overflow-y-hidden border-b border-rule md:flex-wrap md:overflow-visible">
    {#each filters as f (f.id)}
        {@const selected = f.id === active}
        <button type="button" role="tab" aria-selected={selected} onclick={() => (active = f.id)}
                class="min-h-11 shrink-0 cursor-pointer whitespace-nowrap border-b-[3px] py-3.5 font-display text-xl transition-colors {selected ? 'border-primary font-bold' : 'border-transparent font-medium text-muted hover:text-text'}">
            {f.label} <span class="font-sans text-sm font-medium text-faint">({count(f.id)})</span>
        </button>
    {/each}
</div>

<div class="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
    {#each shown as photo, k (photo.id)}
        <figure class="mb-4 break-inside-avoid">
            <img src={src(photo)} alt={photo.alt || photo.title} class="block w-full object-cover {heights[k % heights.length]}" loading="lazy"/>
            <figcaption class="flex items-baseline justify-between gap-3 pb-1 pt-3 text-[15px]">
                <span>{photo.title}</span>
                <span class="flex-none text-[13px] font-semibold text-brand">{label(photo.filter)}</span>
            </figcaption>
        </figure>
    {/each}
</div>
