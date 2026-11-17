<script lang="ts">
    import type { PageProps } from "./$types";
    import { ArrowDown, ArrowUp, Plus, Trash2 } from "@lucide/svelte";
    import {
        nextId,
        toDoc,
        toUi,
        validate,
        type CategoryUi,
        type EntryUi,
        type StoredCategory,
    } from "$lib/content/price-editor";
    import { formatPriceInput, parsePrice } from "$lib/content/price";

    let { data }: PageProps = $props();

    // The editor works on its own copy; later server data only matters after a reload.
    // svelte-ignore state_referenced_locally
    const initial = data.dbConnected ? toUi(data.categories as StoredCategory[]) : [];
    let categories = $state<CategoryUi[]>(initial);
    let selectedId = $state(initial[0]?.id ?? 0);
    let savedSnapshot = $state(JSON.stringify(initial));

    // svelte-ignore state_referenced_locally
    let serverHasUnpublished = $state(data.dbConnected ? data.hasUnpublishedChanges || data.fromRepository : false);
    let busy = $state<"save" | "publish" | "discard" | "preview" | null>(null);
    let message = $state<{ tone: "ok" | "error"; text: string; issues?: string[] } | null>(null);

    let dirty = $derived(JSON.stringify($state.snapshot(categories)) !== savedSnapshot);
    let selected = $derived(categories.find((c) => c.id === selectedId) ?? categories[0]);
    let canPublish = $derived(dirty || serverHasUnpublished);

    const inputClass =
        "rounded-lg border border-rule bg-background px-3 py-2 text-base text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";
    const iconButton =
        "inline-flex size-9 flex-none items-center justify-center rounded-lg border border-rule text-text hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent";

    function move<T>(list: T[], index: number, delta: -1 | 1) {
        const target = index + delta;
        if (target < 0 || target >= list.length) return;
        [list[index], list[target]] = [list[target], list[index]];
    }

    function addLeaf() {
        selected.entries.push({ kind: "leaf", id: nextId(categories), name: "", price: "" });
    }

    function addGroup() {
        const id = nextId(categories);
        selected.entries.push({ kind: "group", id, name: "", rows: [{ id: id + 1, name: "", price: "" }] });
    }

    function addRow(group: Extract<EntryUi, { kind: "group" }>) {
        group.rows.push({ id: nextId(categories), name: "", price: "" });
    }

    function removeEntry(index: number) {
        const entry = selected.entries[index];
        const label = entry.name.trim() || "diesen Eintrag";
        const extra = entry.kind === "group" ? " samt allen Zeilen" : "";
        if (confirm(`„${label}“${extra} wirklich löschen?`)) selected.entries.splice(index, 1);
    }

    function removeRow(group: Extract<EntryUi, { kind: "group" }>, index: number) {
        const label = group.rows[index].name.trim() || "diese Zeile";
        if (confirm(`„${label}“ wirklich löschen?`)) group.rows.splice(index, 1);
    }

    /** "20" -> "20,00"; free text like "ab 55" stays as typed. */
    function normalizePrice(row: { price: string }) {
        row.price = formatPriceInput(parsePrice(row.price));
    }

    async function call(method: string, url: string, body?: unknown) {
        const response = await fetch(url, {
            method,
            headers: { "content-type": "application/json", "x-admin-request": "1" },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
        const result = (await response.json().catch(() => null)) as {
            ok?: boolean;
            message?: string;
            issues?: string[];
            deploy?: string;
        } | null;
        return { ok: response.ok && result?.ok === true, result };
    }

    async function save(): Promise<boolean> {
        const problems = validate(categories);
        if (problems.length > 0) {
            message = { tone: "error", text: "Bitte zuerst folgende Punkte ergänzen:", issues: problems };
            return false;
        }
        const { ok, result } = await call("PUT", "/api/admin/documents/prices", toDoc($state.snapshot(categories)));
        if (!ok) {
            message = {
                tone: "error",
                text: result?.message ?? "Speichern hat nicht geklappt. Bitte erneut versuchen.",
                issues: result?.issues,
            };
            return false;
        }
        savedSnapshot = JSON.stringify($state.snapshot(categories));
        serverHasUnpublished = true;
        return true;
    }

    async function onSave() {
        busy = "save";
        message = null;
        if (await save()) message = { tone: "ok", text: "Gespeichert. Noch nicht auf der Website sichtbar." };
        busy = null;
    }

    async function onPreview() {
        busy = "preview";
        message = null;
        const ready = !dirty || (await save());
        busy = null;
        if (ready) window.open("/admin/preise/vorschau", "_blank", "noopener");
    }

    async function onPublish() {
        if (
            !confirm(
                "Änderungen jetzt veröffentlichen?\n\nDie Website wird dabei neu aufgebaut. Die neuen Preise sind nach etwa 1–2 Minuten sichtbar.",
            )
        )
            return;
        busy = "publish";
        message = null;
        if (dirty && !(await save())) {
            busy = null;
            return;
        }
        const { ok, result } = await call("POST", "/api/admin/documents/prices/publish");
        if (!ok) {
            message = { tone: "error", text: result?.message ?? "Veröffentlichen hat nicht geklappt." };
        } else {
            serverHasUnpublished = false;
            message =
                result?.deploy === "started"
                    ? { tone: "ok", text: "Veröffentlicht. Die Website wird gerade aktualisiert, das dauert etwa 1–2 Minuten." }
                    : {
                          tone: "error",
                          text: "Gespeichert und veröffentlicht, aber das automatische Aktualisieren der Website konnte nicht gestartet werden. Bitte den Webmaster informieren.",
                      };
        }
        busy = null;
    }

    async function onDiscard() {
        if (!confirm("Alle nicht veröffentlichten Änderungen verwerfen? Das kann nicht rückgängig gemacht werden.")) return;
        busy = "discard";
        const { ok, result } = await call("POST", "/api/admin/documents/prices/discard");
        if (ok) location.reload();
        else {
            message = { tone: "error", text: result?.message ?? "Zurücksetzen hat nicht geklappt." };
            busy = null;
        }
    }

    // Versions (loaded when the section is opened)
    type Version = { id: number; createdAt: string; createdBy: string | null };
    let versions = $state<Version[] | null>(null);
    const dateFormat = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" });

    async function loadVersions() {
        if (versions) return;
        const response = await fetch("/api/admin/documents/prices/versions");
        const body = (await response.json().catch(() => null)) as { versions?: Version[] } | null;
        versions = body?.versions ?? [];
    }

    async function restore(version: Version) {
        if (
            !confirm(
                `Den Stand vom ${dateFormat.format(new Date(version.createdAt))} als Entwurf laden? Ihr aktueller Entwurf wird dadurch ersetzt. Veröffentlicht wird erst, wenn Sie es bestätigen.`,
            )
        )
            return;
        const { ok, result } = await call("POST", "/api/admin/documents/prices/restore", { versionId: version.id });
        if (ok) location.reload();
        else message = { tone: "error", text: result?.message ?? "Laden hat nicht geklappt." };
    }

    function onBeforeUnload(event: BeforeUnloadEvent) {
        if (dirty) event.preventDefault();
    }
</script>

<svelte:window onbeforeunload={onBeforeUnload}/>

<div class="mb-6"><a href="/admin" class="text-sm text-muted hover:text-brand">← Zur Übersicht</a></div>

{#if !data.dbConnected}
    <h1 class="font-display text-4xl font-bold">Preise</h1>
    <div class="mt-8 rounded-2xl bg-secondary p-6" role="alert">
        <div class="font-display text-xl font-bold">Datenbank nicht verbunden</div>
        <p class="mt-2 text-soft">Die Preise können gerade nicht geladen werden. Bitte den Webmaster informieren.</p>
    </div>
{:else}
    <div class="sticky top-0 z-10 -mx-5 border-b border-rule bg-background/95 px-5 py-4 backdrop-blur md:-mx-10 md:px-10">
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="font-display text-3xl font-bold leading-none md:text-4xl">Preise bearbeiten</h1>
                <p class="mt-2 text-sm" aria-live="polite">
                    {#if dirty}
                        <span class="font-semibold text-brand">Ungespeicherte Änderungen</span>
                    {:else if serverHasUnpublished}
                        <span class="font-semibold text-brand">Gespeichert, noch nicht veröffentlicht</span>
                    {:else}
                        <span class="font-semibold text-[#2f8f4e]">Alles veröffentlicht</span>
                    {/if}
                </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                <button type="button" class="btn-outline" onclick={onPreview} disabled={busy !== null}>
                    {busy === "preview" ? "Öffnet …" : "Vorschau"}
                </button>
                <button type="button" class="btn-outline" onclick={onSave} disabled={busy !== null || !dirty}>
                    {busy === "save" ? "Speichert …" : "Speichern"}
                </button>
                <button type="button" class="btn-pill" onclick={onPublish} disabled={busy !== null || !canPublish}>
                    {busy === "publish" ? "Veröffentlicht …" : "Veröffentlichen"}
                </button>
            </div>
        </div>
    </div>

    {#if data.fromRepository}
        <p class="mt-6 rounded-xl bg-secondary p-4 text-sm text-soft">
            Es wurde noch nichts gespeichert. Sie sehen die aktuelle Preisliste der Website.
        </p>
    {/if}

    {#if message}
        <div class="mt-6 rounded-xl p-4 {message.tone === 'ok' ? 'bg-[#2f8f4e]/15' : 'bg-red-500/10'}" role="alert">
            <div class="font-semibold">{message.text}</div>
            {#if message.issues}
                <ul class="mt-2 list-disc pl-5 text-sm">
                    {#each message.issues as issue}<li>{issue}</li>{/each}
                </ul>
            {/if}
        </div>
    {/if}

    <div role="tablist" aria-label="Kategorien" class="mt-8 flex flex-wrap gap-x-8 border-b border-rule">
        {#each categories as category (category.id)}
            {@const active = category.id === selected.id}
            <button type="button" role="tab" aria-selected={active} onclick={() => (selectedId = category.id)}
                    class="min-h-11 cursor-pointer border-b-[3px] py-3 font-display text-xl transition-colors {active ? 'border-primary font-bold' : 'border-transparent font-medium text-muted hover:text-text'}">
                {category.shortName || category.name}
            </button>
        {/each}
    </div>

    {#key selected.id}
        <section class="mt-8" aria-label={selected.shortName}>
            <div class="grid gap-4 md:grid-cols-[1fr_2fr_10rem]">
                <label class="block text-sm font-medium">Name auf der Website
                    <input class="{inputClass} mt-1 w-full" bind:value={selected.shortName} maxlength="40"/>
                </label>
                <label class="block text-sm font-medium">Kurzbeschreibung
                    <input class="{inputClass} mt-1 w-full" bind:value={selected.tagline} maxlength="160"/>
                </label>
                <label class="block text-sm font-medium">„Preise ab“
                    <input class="{inputClass} mt-1 w-full" bind:value={selected.from} maxlength="20" placeholder="z. B. 20 €"/>
                </label>
            </div>

            <div class="mt-10 flex flex-col gap-6">
                {#each selected.entries as entry, i (entry.id)}
                    {#if entry.kind === "leaf"}
                        <div class="flex flex-wrap items-center gap-2">
                            <input class="{inputClass} min-w-[12rem] flex-1" bind:value={entry.name} maxlength="120" placeholder="Leistung" aria-label="Name der Leistung"/>
                            <input class="{inputClass} w-36 text-right tabular-nums" bind:value={entry.price} onblur={() => normalizePrice(entry)} maxlength="40" placeholder="Preis" aria-label="Preis"/>
                            <button type="button" class={iconButton} onclick={() => move(selected.entries, i, -1)} disabled={i === 0} aria-label="Nach oben"><ArrowUp class="size-4"/></button>
                            <button type="button" class={iconButton} onclick={() => move(selected.entries, i, 1)} disabled={i === selected.entries.length - 1} aria-label="Nach unten"><ArrowDown class="size-4"/></button>
                            <button type="button" class={iconButton} onclick={() => removeEntry(i)} aria-label="Löschen"><Trash2 class="size-4"/></button>
                        </div>
                    {:else}
                        <div class="rounded-2xl border border-rule p-4 md:p-5">
                            <div class="flex flex-wrap items-center gap-2">
                                <input class="{inputClass} min-w-[12rem] flex-1 font-display text-lg font-bold text-brand" bind:value={entry.name} maxlength="120" placeholder="Name der Gruppe" aria-label="Name der Gruppe"/>
                                <button type="button" class={iconButton} onclick={() => move(selected.entries, i, -1)} disabled={i === 0} aria-label="Gruppe nach oben"><ArrowUp class="size-4"/></button>
                                <button type="button" class={iconButton} onclick={() => move(selected.entries, i, 1)} disabled={i === selected.entries.length - 1} aria-label="Gruppe nach unten"><ArrowDown class="size-4"/></button>
                                <button type="button" class={iconButton} onclick={() => removeEntry(i)} aria-label="Gruppe löschen"><Trash2 class="size-4"/></button>
                            </div>
                            <div class="mt-4 flex flex-col gap-2">
                                {#each entry.rows as row, r (row.id)}
                                    <div class="flex flex-wrap items-center gap-2">
                                        <input class="{inputClass} min-w-[12rem] flex-1" bind:value={row.name} maxlength="120" placeholder="Leistung" aria-label="Name der Leistung"/>
                                        <input class="{inputClass} w-36 text-right tabular-nums" bind:value={row.price} onblur={() => normalizePrice(row)} maxlength="40" placeholder="Preis" aria-label="Preis"/>
                                        <button type="button" class={iconButton} onclick={() => move(entry.rows, r, -1)} disabled={r === 0} aria-label="Zeile nach oben"><ArrowUp class="size-4"/></button>
                                        <button type="button" class={iconButton} onclick={() => move(entry.rows, r, 1)} disabled={r === entry.rows.length - 1} aria-label="Zeile nach unten"><ArrowDown class="size-4"/></button>
                                        <button type="button" class={iconButton} onclick={() => removeRow(entry, r)} aria-label="Zeile löschen"><Trash2 class="size-4"/></button>
                                    </div>
                                {/each}
                            </div>
                            <button type="button" class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline" onclick={() => addRow(entry)}>
                                <Plus class="size-4"/> Zeile hinzufügen
                            </button>
                        </div>
                    {/if}
                {/each}
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
                <button type="button" class="btn-outline" onclick={addLeaf}><Plus class="mr-2 size-4"/> Leistung hinzufügen</button>
                <button type="button" class="btn-outline" onclick={addGroup}><Plus class="mr-2 size-4"/> Gruppe hinzufügen</button>
            </div>
            <p class="mt-4 text-sm text-muted">
                Preise bitte als Zahl eingeben (z. B. 20 oder 20,50). Texte wie „ab 55“ oder „15 % Rabatt“ sind auch möglich.
            </p>
        </section>
    {/key}

    <div class="mt-14 flex flex-col gap-4 border-t border-rule pt-8">
        {#if serverHasUnpublished && !data.fromRepository}
            <div>
                <button type="button" class="text-sm text-muted underline hover:text-brand" onclick={onDiscard} disabled={busy !== null}>
                    Nicht veröffentlichte Änderungen verwerfen
                </button>
            </div>
        {/if}
        <details ontoggle={(e) => (e.currentTarget as HTMLDetailsElement).open && loadVersions()}>
            <summary class="cursor-pointer text-sm font-medium">Frühere Versionen</summary>
            <div class="mt-3 text-sm">
                {#if versions === null}
                    Lädt …
                {:else if versions.length === 0}
                    <span class="text-muted">Noch keine früheren Versionen. Sie entstehen beim Veröffentlichen.</span>
                {:else}
                    <ul class="flex flex-col gap-2">
                        {#each versions as version (version.id)}
                            <li class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rule px-3 py-2">
                                <span>{dateFormat.format(new Date(version.createdAt))}{#if version.createdBy} · {version.createdBy}{/if}</span>
                                <button type="button" class="font-medium text-brand hover:underline" onclick={() => restore(version)}>Als Entwurf laden</button>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
        </details>
    </div>
{/if}
