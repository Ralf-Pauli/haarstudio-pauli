<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    const formatter = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" });
    const format = (iso: string | null) => (iso ? formatter.format(new Date(iso)) : "–");

    function status(doc: (typeof data.documents)[number]) {
        if (!doc.exists) return { text: "Noch nicht eingerichtet", tone: "text-muted" };
        if (doc.hasUnpublishedChanges) return { text: "Änderungen noch nicht veröffentlicht", tone: "text-brand" };
        return { text: "Alles veröffentlicht", tone: "text-[#2f8f4e]" };
    }
</script>

<h1 class="font-display text-4xl font-bold leading-none md:text-5xl">Willkommen</h1>
<p class="mt-4 max-w-xl text-lg text-soft">
    Hier können Sie Preise, Texte und Fotos Ihrer Website ändern. Änderungen erscheinen erst, wenn Sie sie
    veröffentlichen.
</p>

{#if !data.dbConnected}
    <div class="mt-8 rounded-2xl bg-secondary p-6" role="alert">
        <div class="font-display text-xl font-bold">Datenbank nicht verbunden</div>
        <p class="mt-2 text-soft">
            Die Verwaltung kann die Inhalte gerade nicht laden. Bitte den Webmaster informieren.
        </p>
    </div>
{:else}
    <div class="mt-10 grid gap-6 md:grid-cols-3">
        {#each data.documents as doc (doc.key)}
            {@const s = status(doc)}
            <section class="flex flex-col gap-4 rounded-2xl bg-background p-6 shadow-[0_1px_2px_rgba(0,0,0,.06),0_8px_24px_rgba(0,0,0,.08)] dark:shadow-none dark:ring-1 dark:ring-rule">
                <h2 class="font-display text-2xl font-bold">{doc.label}</h2>
                <div class="font-medium {s.tone}">{s.text}</div>
                <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-muted">
                    <dt>Zuletzt geändert</dt>
                    <dd>{format(doc.updatedAt)}{#if doc.updatedBy} · {doc.updatedBy}{/if}</dd>
                    <dt>Veröffentlicht</dt>
                    <dd>{format(doc.publishedAt)}</dd>
                </dl>
                {#if doc.key === "prices"}
                    <a href="/admin/preise" class="btn-pill mt-auto self-start">Bearbeiten</a>
                {:else if doc.key === "gallery"}
                    <a href="/admin/galerie" class="btn-pill mt-auto self-start">Bearbeiten</a>
                {:else}
                    <span class="mt-auto text-sm text-faint">Bearbeiten folgt in einem nächsten Schritt</span>
                {/if}
            </section>
        {/each}
    </div>
{/if}
