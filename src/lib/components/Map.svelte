<script lang="ts">
  import { PUBLIC_GOOGLE_MAPS_API_KEY, PUBLIC_PLACE_ID } from "$env/static/public";

  import { onMount } from "svelte";
  import { createLocalStorage } from "$lib/shared/stores/local-storage";
  import { Checkbox } from "$lib/components/ui/checkbox";

  const loadGoogleMap = createLocalStorage<boolean>("load-google-map", false);
  let isLoading = true;
  let shouldLoad: boolean | null = false;
  let checked = false;

  onMount(() => {
    shouldLoad = loadGoogleMap.get() || false;
    isLoading = false;
  });
  function loadMap() {
    shouldLoad = true;
    loadGoogleMap.set(checked);
  }
</script>

<div class="map-grid relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[20px] bg-secondary p-4 md:min-h-[480px] md:p-8">
  {#if isLoading}
    <div class="m-auto h-8 w-8 animate-spin rounded-full border-4 border-dashed border-t-primary"></div>
  {:else if loadGoogleMap.get() || shouldLoad}
    <iframe
      title="Google Map"
      allowfullscreen
      class="absolute inset-0 h-full w-full dark:invert-[90%] dark:hue-rotate-180"
      referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps/embed/v1/place?key={PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:{PUBLIC_PLACE_ID}"
      style="border:0">
    </iframe>
  {:else}
    <div class="max-w-[380px] rounded-2xl bg-background p-6 text-center md:p-8">
      <div class="font-display text-[26px] font-bold">Karte anzeigen</div>
      <p class="mb-5 mt-2.5 text-[15px] leading-[1.6] text-soft">
        Beim Laden der Karte werden Daten an Google übertragen. Details in der
        <a href="/datenschutz" class="underline hover:text-brand">Datenschutzerklärung</a>.
      </p>
      <button
        type="button"
        class="btn-pill cursor-pointer text-[15px]"
        onclick={loadMap}>Google Maps laden</button>
      <div class="mt-4 flex justify-center gap-2 text-sm">
        <Checkbox aria-label="Karte immer laden" id="always-load-maps" bind:checked />
        <label for="always-load-maps" class="inline-block select-none align-top leading-5"> Google Maps immer erlauben </label>
      </div>
    </div>
  {/if}
</div>

<style>
  .map-grid {
    background-image:
      linear-gradient(var(--rule) 1px, transparent 1px),
      linear-gradient(90deg, var(--rule) 1px, transparent 1px);
    background-size: 56px 56px;
  }
</style>
