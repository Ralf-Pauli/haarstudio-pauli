<script lang="ts">
    import type { LayoutProps } from "./$types";

    let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
    <title>Verwaltung – Haarstudio Pauli</title>
    <meta name="robots" content="noindex, nofollow"/>
</svelte:head>

<div class="min-h-screen bg-background text-text">
    <header class="border-b border-rule">
        <div class="container-page flex flex-wrap items-center justify-between gap-4 py-4">
            <a href="/admin" class="font-display text-xl font-bold">Verwaltung · Haarstudio Pauli</a>
            <nav class="flex flex-wrap items-center gap-5 text-[15px]" aria-label="Verwaltung">
                <a href="/" class="hover:text-brand" target="_blank" rel="noopener">Website ansehen ↗</a>
                <span class="text-muted">{data.email}</span>
                <a href="/cdn-cgi/access/logout" class="hover:text-brand">Abmelden</a>
            </nav>
        </div>
    </header>
    <main class="container-page py-10">
        {@render children()}
    </main>
</div>
