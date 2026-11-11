<script lang="ts">
    import {onMount} from "svelte";
    import {getOpeningStatus} from "$lib/opening-hours";
    import {siteConfig} from "$lib/config";

    let now = $state<Date | null>(null);

    onMount(() => {
        now = new Date();
        const timer = setInterval(() => (now = new Date()), 30_000);
        return () => clearInterval(timer);
    });

    let status = $derived(now ? getOpeningStatus(now) : null);
</script>

<div class="grid gap-x-16 gap-y-8 md:grid-cols-2">
    <!-- Status: editorial, rule-based instead of a filled card -->
    <div class="flex flex-col justify-between gap-8 rounded-2xl bg-background shadow-[0_1px_2px_rgba(0,0,0,.06),0_8px_24px_rgba(0,0,0,.08)] dark:shadow-none dark:ring-1 dark:ring-rule p-6 md:p-8">
        <div class="text-sm font-semibold uppercase tracking-[0.08em] text-brand">{status?.todayName ?? "Heute"}</div>
        <div aria-live="polite">
            <div class="flex items-center gap-3.5">
                <span aria-hidden="true"
                      class="size-3 flex-none rounded-full {status?.isOpen ? 'bg-[#2f8f4e] shadow-[0_0_0_4px_rgba(47,143,78,.2)]' : 'bg-faint shadow-[0_0_0_4px_rgba(140,132,118,.2)]'}"></span>
                <span class="font-display text-4xl font-bold leading-none md:text-5xl">{status?.title ?? "Öffnungszeiten"}</span>
            </div>
            {#if status}
                <div class="mt-3 text-lg text-soft">
                    {status.line}{#if status.isOpen} · <span class="font-semibold text-brand">{status.remaining}</span>{/if}
                </div>
            {/if}
        </div>
    </div>

    <div>
        {#each status?.week ?? [] as day (day.index)}
            <div class="flex items-center justify-between border-b border-rule py-3 text-base md:text-[17px] {day.today ? 'font-semibold text-brand' : ''} {day.closed && !day.today ? 'text-faint' : ''}">
                <span class="flex items-center gap-2.5">
                    {#if day.today}<span aria-hidden="true" class="size-1.5 rounded-full bg-primary"></span>{/if}{day.name}
                </span>
                <span class="tabular-nums">{day.hours}</span>
            </div>
        {/each}
        {#if !status}
            {#each ["Di – Fr 9 – 18 Uhr", "Sa 8 – 13 Uhr", "So & Mo geschlossen"] as line}
                <div class="border-b border-rule py-3 text-[17px]">{line}</div>
            {/each}
        {/if}
        {#if siteConfig.holidayNote}
            <p class="mt-4 text-sm text-muted">{siteConfig.holidayNote}</p>
        {/if}
    </div>
</div>
