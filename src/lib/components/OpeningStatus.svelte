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

<div class="flex flex-wrap items-stretch gap-6 md:gap-10">
    <div class="box-border flex min-h-[200px] flex-[1_1_320px] flex-col justify-between gap-7 rounded-[20px] bg-secondary p-7 md:min-h-[300px] md:flex-[1_1_480px] md:gap-10 md:rounded-3xl md:p-10">
        <div class="text-sm uppercase tracking-[0.08em] text-muted">{status?.todayName ?? "Heute"}</div>
        <div aria-live="polite">
            <div class="flex items-center gap-4">
                <span aria-hidden="true"
                      class="size-3.5 flex-none rounded-full {status?.isOpen ? 'bg-[#2f8f4e] shadow-[0_0_0_5px_rgba(47,143,78,.16)]' : 'bg-[#8c8476] shadow-[0_0_0_5px_rgba(140,132,118,.16)]'}"></span>
                <span class="font-display text-[40px] font-bold leading-none md:text-6xl">{status?.title ?? "Öffnungszeiten"}</span>
            </div>
            {#if status}
                <div class="mt-3.5 text-[17px] text-soft md:text-xl">
                    {status.line}{#if status.isOpen} · <span class="text-brand">{status.remaining}</span>{/if}
                </div>
            {/if}
        </div>
    </div>

    <div class="flex flex-[1_1_320px] flex-col justify-center md:flex-[1_1_420px]">
        {#each status?.week ?? [] as day (day.index)}
            <div class="flex items-center justify-between rounded-xl px-3 py-[11px] text-[15px] md:px-4 md:py-[13px] md:text-[17px] {day.today ? 'bg-secondary font-semibold' : ''} {day.closed ? 'text-faint' : ''}">
                <span>{day.name}</span>
                <span class="tabular-nums">{day.hours}</span>
            </div>
        {/each}
        {#if !status}
            <!-- Static fallback before hydration -->
            {#each ["Di – Fr 9 – 18 Uhr", "Sa 8 – 13 Uhr", "So & Mo geschlossen"] as line}
                <div class="px-4 py-[13px] text-[17px]">{line}</div>
            {/each}
        {/if}
        {#if siteConfig.holidayNote}
            <p class="mx-4 mt-4 text-sm text-muted">{siteConfig.holidayNote}</p>
        {/if}
    </div>
</div>
