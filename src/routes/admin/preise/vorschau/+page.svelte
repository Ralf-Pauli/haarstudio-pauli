<script lang="ts">
    import type { PageProps } from "./$types";
    import Tabs from "../../../leistungen/Tabs.svelte";
    import Category from "../../../leistungen/Category.svelte";
    import type { Category as CategoryType } from "$lib/utils/types";

    let { data }: PageProps = $props();
    let categories = $derived(data.categories);

    let activeId = $state<number | null>(null);
    let activeCategory = $derived(
        categories.find((c: CategoryType) => c.id === activeId) ?? categories[0],
    );
    let index = $derived(Math.max(0, categories.findIndex((c: CategoryType) => c.id === activeCategory.id)));
</script>

<div class="-mx-5 mb-8 bg-primary/15 px-5 py-3 text-sm md:-mx-10 md:px-10">
    <strong>Vorschau</strong>: So sieht die Seite „Leistungen &amp; Preise“ mit Ihrem gespeicherten Entwurf aus.
    {#if data.hasUnpublishedChanges}Auf der Website ist das noch <strong>nicht</strong> sichtbar.{/if}
    <a href="/admin/preise" class="ml-2 underline">Zurück zum Bearbeiten</a>
</div>

<h1 class="font-display text-4xl font-bold leading-none tracking-[-0.015em] md:text-5xl">Leistungen &amp; Preise</h1>
<p class="mt-4 text-[15px] text-muted">Preise inkl. MwSt. · Endpreis nach Haarlänge &amp; Aufwand</p>

<Tabs {categories} bind:activeCategory={() => activeCategory, (c) => (activeId = c.id)} />

{#key activeCategory.id}
    <Category category={activeCategory} {index} total={categories.length}/>
{/key}
