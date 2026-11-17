<script lang="ts">
    import type { PageProps } from "./$types";
    import { ArrowLeft, ArrowRight, ImagePlus, Trash2 } from "@lucide/svelte";
    import {
        FILTER_OPTIONS,
        toPhotoDoc,
        validatePhotos,
        type PhotoUi,
        type StoredPhoto,
    } from "$lib/content/gallery-admin";
    import { prepareJpeg } from "$lib/content/image-client";

    let { data }: PageProps = $props();

    // Photos shipped with the site (shown by name) – uploaded photos are served from /api/admin/images/<id>.
    // (small WebP versions: the originals are several thousand pixels wide)
    const shipped = import.meta.glob(["/src/lib/assets/gallery/*.jpg", "/src/lib/assets/hero.jpg"], {
        eager: true,
        query: { w: "640", format: "webp" },
        import: "default",
    }) as Record<string, string>;
    const shippedUrl = (name: string) =>
        Object.entries(shipped).find(([path]) => path.endsWith(`/${name}.jpg`))?.[1] ?? "";
    const thumb = (p: PhotoUi) => (p.imageId ? `/api/admin/images/${p.imageId}` : shippedUrl(p.builtin ?? ""));

    // The editor works on its own copy; later server data only matters after a reload.
    // svelte-ignore state_referenced_locally
    const initial: PhotoUi[] = data.dbConnected ? (data.photos as StoredPhoto[]).map((p) => ({ ...p })) : [];
    let photos = $state<PhotoUi[]>(initial);
    let savedSnapshot = $state(JSON.stringify(initial));
    // svelte-ignore state_referenced_locally
    let serverHasUnpublished = $state(data.dbConnected ? data.hasUnpublishedChanges || data.fromBuiltin : false);

    let busy = $state<"save" | "publish" | "discard" | "preview" | null>(null);
    let message = $state<{ tone: "ok" | "error"; text: string; issues?: string[] } | null>(null);
    let upload = $state<{ current: number; total: number } | null>(null);

    let dirty = $derived(JSON.stringify($state.snapshot(photos)) !== savedSnapshot);
    let canPublish = $derived(dirty || serverHasUnpublished);

    const inputClass =
        "w-full rounded-lg border border-rule bg-background px-3 py-2 text-base text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";
    const iconButton =
        "inline-flex size-11 flex-none items-center justify-center rounded-lg border border-rule text-text hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent";

    function move(index: number, delta: -1 | 1) {
        const target = index + delta;
        if (target < 0 || target >= photos.length) return;
        [photos[index], photos[target]] = [photos[target], photos[index]];
    }

    function remove(index: number) {
        const label = photos[index].title.trim() || "dieses Foto";
        if (confirm(`„${label}“ aus der Galerie entfernen?`)) photos.splice(index, 1);
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

    async function onFilesSelected(event: Event) {
        const input = event.currentTarget as HTMLInputElement;
        const files = Array.from(input.files ?? []);
        input.value = "";
        if (files.length === 0) return;

        message = null;
        const failures: string[] = [];
        for (const [i, file] of files.entries()) {
            upload = { current: i + 1, total: files.length };
            try {
                const jpeg = await prepareJpeg(file);
                const response = await fetch("/api/admin/images", {
                    method: "POST",
                    headers: { "content-type": "image/jpeg", "x-admin-request": "1" },
                    body: jpeg,
                });
                const result = (await response.json().catch(() => null)) as { ok?: boolean; id?: string; message?: string } | null;
                if (!response.ok || !result?.ok || !result.id) {
                    failures.push(`${file.name}: ${result?.message ?? "Hochladen hat nicht geklappt."}`);
                    continue;
                }
                photos.unshift({ id: crypto.randomUUID(), imageId: result.id, title: "", alt: "", filter: "" });
            } catch (e) {
                failures.push(`${file.name}: ${e instanceof Error ? e.message : "Hochladen hat nicht geklappt."}`);
            }
        }
        upload = null;
        if (failures.length > 0) {
            message = { tone: "error", text: "Nicht alle Fotos konnten hochgeladen werden:", issues: failures };
        } else {
            message = { tone: "ok", text: "Fotos hochgeladen. Bitte Titel und Kategorie eintragen und speichern." };
        }
    }

    async function save(): Promise<boolean> {
        const problems = validatePhotos(photos);
        if (problems.length > 0) {
            message = { tone: "error", text: "Bitte zuerst folgende Punkte ergänzen:", issues: problems };
            return false;
        }
        const { ok, result } = await call("PUT", "/api/admin/documents/gallery", toPhotoDoc($state.snapshot(photos)));
        if (!ok) {
            message = {
                tone: "error",
                text: result?.message ?? "Speichern hat nicht geklappt. Bitte erneut versuchen.",
                issues: result?.issues,
            };
            return false;
        }
        savedSnapshot = JSON.stringify($state.snapshot(photos));
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
        if (ready) window.open("/admin/galerie/vorschau", "_blank", "noopener");
    }

    async function onPublish() {
        if (
            !confirm(
                "Galerie jetzt veröffentlichen?\n\nDie Website wird dabei neu aufgebaut. Die Änderungen sind nach etwa 1–2 Minuten sichtbar.",
            )
        )
            return;
        busy = "publish";
        message = null;
        if (dirty && !(await save())) {
            busy = null;
            return;
        }
        const { ok, result } = await call("POST", "/api/admin/documents/gallery/publish");
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
        const { ok, result } = await call("POST", "/api/admin/documents/gallery/discard");
        if (ok) location.reload();
        else {
            message = { tone: "error", text: result?.message ?? "Zurücksetzen hat nicht geklappt." };
            busy = null;
        }
    }

    type Version = { id: number; createdAt: string; createdBy: string | null };
    let versions = $state<Version[] | null>(null);
    const dateFormat = new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" });

    async function loadVersions() {
        if (versions) return;
        const response = await fetch("/api/admin/documents/gallery/versions");
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
        const { ok, result } = await call("POST", "/api/admin/documents/gallery/restore", { versionId: version.id });
        if (ok) location.reload();
        else message = { tone: "error", text: result?.message ?? "Laden hat nicht geklappt." };
    }

    function onBeforeUnload(event: BeforeUnloadEvent) {
        if (dirty || upload) event.preventDefault();
    }
</script>

<svelte:window onbeforeunload={onBeforeUnload}/>

<div class="mb-6"><a href="/admin" class="text-sm text-muted hover:text-brand">← Zur Übersicht</a></div>

{#if !data.dbConnected}
    <h1 class="font-display text-4xl font-bold">Galerie</h1>
    <div class="mt-8 rounded-2xl bg-secondary p-6" role="alert">
        <div class="font-display text-xl font-bold">Datenbank nicht verbunden</div>
        <p class="mt-2 text-soft">Die Galerie kann gerade nicht geladen werden. Bitte den Webmaster informieren.</p>
    </div>
{:else}
    <div class="sticky top-0 z-10 -mx-5 border-b border-rule bg-background/95 px-5 py-4 backdrop-blur md:-mx-10 md:px-10">
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="font-display text-3xl font-bold leading-none md:text-4xl">Galerie bearbeiten</h1>
                <p class="mt-2 text-sm" aria-live="polite">
                    {#if upload}
                        <span class="font-semibold text-brand">Foto {upload.current} von {upload.total} wird hochgeladen …</span>
                    {:else if dirty}
                        <span class="font-semibold text-brand">Ungespeicherte Änderungen</span>
                    {:else if serverHasUnpublished}
                        <span class="font-semibold text-brand">Gespeichert, noch nicht veröffentlicht</span>
                    {:else}
                        <span class="font-semibold text-[#2f8f4e]">Alles veröffentlicht</span>
                    {/if}
                </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
                <button type="button" class="btn-outline" onclick={onPreview} disabled={busy !== null || upload !== null}>
                    {busy === "preview" ? "Öffnet …" : "Vorschau"}
                </button>
                <button type="button" class="btn-outline" onclick={onSave} disabled={busy !== null || upload !== null || !dirty}>
                    {busy === "save" ? "Speichert …" : "Speichern"}
                </button>
                <button type="button" class="btn-pill" onclick={onPublish} disabled={busy !== null || upload !== null || !canPublish}>
                    {busy === "publish" ? "Veröffentlicht …" : "Veröffentlichen"}
                </button>
            </div>
        </div>
    </div>

    {#if data.fromBuiltin}
        <p class="mt-6 rounded-xl bg-secondary p-4 text-sm text-soft">
            Es wurde noch nichts gespeichert. Sie sehen die aktuellen Fotos der Website.
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

    <div class="mt-8">
        {#if data.uploadsConnected}
            <label class="btn-pill cursor-pointer gap-2 {upload ? 'pointer-events-none opacity-50' : ''}">
                <ImagePlus class="size-5"/> Fotos hinzufügen
                <input type="file" accept="image/*" multiple class="sr-only" onchange={onFilesSelected} disabled={upload !== null}/>
            </label>
            <p class="mt-3 text-sm text-muted">
                Es können mehrere Fotos auf einmal gewählt werden, auch direkt vom Handy. Die Fotos werden automatisch verkleinert.
            </p>
        {:else}
            <p class="rounded-xl bg-secondary p-4 text-sm text-soft" role="alert">
                Der Foto-Speicher ist nicht verbunden, neue Fotos können nicht hochgeladen werden. Bitte den Webmaster informieren.
            </p>
        {/if}
    </div>

    {#if photos.length === 0}
        <p class="mt-10 text-soft">Die Galerie ist leer. Fügen Sie oben das erste Foto hinzu.</p>
    {/if}

    <ul class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each photos as photo, i (photo.id)}
            {@const incomplete = !photo.title.trim() || !photo.filter}
            <li class="flex flex-col gap-3 rounded-2xl border p-3 {incomplete ? 'border-primary' : 'border-rule'}">
                <img src={thumb(photo)} alt={photo.alt || photo.title} class="aspect-[4/3] w-full rounded-xl bg-secondary object-cover" loading="lazy"/>
                <label class="block text-sm font-medium">Titel
                    <input class="{inputClass} mt-1" bind:value={photo.title} maxlength="120" placeholder="z. B. Kupferrot, frisch gefärbt"/>
                </label>
                <label class="block text-sm font-medium">Kategorie
                    <select class="{inputClass} mt-1" bind:value={photo.filter}>
                        <option value="" disabled>Bitte wählen …</option>
                        {#each FILTER_OPTIONS as option}<option value={option.id}>{option.label}</option>{/each}
                    </select>
                </label>
                <label class="block text-sm font-medium">Bildbeschreibung <span class="font-normal text-muted">(optional, für Sehbehinderte)</span>
                    <input class="{inputClass} mt-1" bind:value={photo.alt} maxlength="200"/>
                </label>
                <div class="mt-1 flex items-center justify-between gap-2">
                    <div class="flex gap-2">
                        <button type="button" class={iconButton} onclick={() => move(i, -1)} disabled={i === 0} aria-label="Weiter nach vorn"><ArrowLeft class="size-4"/></button>
                        <button type="button" class={iconButton} onclick={() => move(i, 1)} disabled={i === photos.length - 1} aria-label="Weiter nach hinten"><ArrowRight class="size-4"/></button>
                    </div>
                    <button type="button" class={iconButton} onclick={() => remove(i)} aria-label="Foto entfernen"><Trash2 class="size-4"/></button>
                </div>
            </li>
        {/each}
    </ul>

    <div class="mt-14 flex flex-col gap-4 border-t border-rule pt-8">
        {#if serverHasUnpublished && !data.fromBuiltin}
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
