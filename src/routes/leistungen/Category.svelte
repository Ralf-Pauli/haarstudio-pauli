<script lang="ts">
    import Service from "./Service.svelte";
    import type { Category as CategoryType, Services } from "$utils/types";
    import { categoryLabel, categoryNumber, getCategoryImage } from "$lib/categories";
    import { siteConfig } from "$lib/config";

    let { category, index, total }: { category: CategoryType; index: number; total: number } = $props();

    // Services with sub services become their own price group; everything else is collected
    // in one trailing group ("Weitere Leistungen"), or titled after the category if it is the only one.
    let groups = $derived.by(() => {
        const grouped = category.services.filter((s: Services) => s.sub_services && s.sub_services.length > 0);
        const others = category.services.filter((s: Services) => !s.sub_services || s.sub_services.length === 0);
        const result: { title: string; items: Services[] }[] = grouped.map((s: Services) => ({
            title: s.name,
            items: s.sub_services ?? [],
        }));
        if (others.length > 0) {
            result.push({ title: grouped.length > 0 ? "Weitere Leistungen" : category.name, items: others });
        }
        return result;
    });
</script>

<!-- Bildband der gewählten Kategorie -->
<section class="mt-10 flex flex-col gap-6 md:flex-row md:items-stretch md:gap-10">
    <img src={getCategoryImage(category.image)} alt=""
         class="h-60 w-full min-w-0 object-cover md:h-[380px] md:flex-[1_1_520px]"/>
    <div class="flex flex-col justify-between gap-6 py-2 md:flex-[1_1_380px]">
        <div>
            <div class="text-[15px] font-semibold text-brand">{categoryNumber(index)} / {String(total).padStart(2, "0")}</div>
            <h2 class="mt-2.5 font-display text-[44px] font-bold leading-[0.95] tracking-[-0.01em] md:text-[88px]">{categoryLabel(category)}</h2>
            <p class="mt-4 text-lg text-soft">{category.tagline}</p>
        </div>
        <div class="flex flex-wrap items-end justify-between gap-5">
            <div>
                <div class="text-sm text-muted">Preise ab</div>
                <div class="font-display text-[56px] font-bold leading-none">{category.from}</div>
            </div>
            <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" class="btn-pill">Termin reservieren →</a>
        </div>
    </div>
</section>

<!-- Preisgruppen -->
<div class="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-12">
    {#each groups as group (group.title)}
        <Service title={group.title} items={group.items}/>
    {/each}
</div>
