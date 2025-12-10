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

<div class="w-screen md:max-w-5xl h-[50vh] block mx-auto relative p-3">
  {#if isLoading}
    <div class="w-full h-full inset-0 flex justify-center items-center">
      <div class="m-auto w-8 h-8 border-4 border-dashed rounded-full animate-spin border-t-primary" />
    </div>
  {:else if loadGoogleMap.get() || shouldLoad}
    <iframe
      title="Google Map"
      allowfullscreen
      class="w-full h-full dark:invert-[90%] dark:hue-rotate-180 sm:rounded-xl"
      referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps/embed/v1/place?key={PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:{PUBLIC_PLACE_ID}"
      style="border:0">
    </iframe>
  {:else}
    <div class="w-[100%] h-full object-cover bg-[url('$lib/assets/map-background.svg')] bg-repeat-space opacity-20 dark:opacity-5 bg-center absolute" />

    <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:bg-[#191719] bg-opacity-20 dark:bg-opacity-80 w-full sm:w-2/5 rounded-md">
      <div class="text-center text-black dark:text-white p-4 flex flex-col gap-4">
        <p>
          Mit dem Laden der Karte akzeptieren Sie die Datenschutzerklärung von Google.<br />
          <a
            href="https://policies.google.com/privacy?hl=de"
            class="dark:text-blue-300 dark:hover:text-blue-500 text-blue-500 hover:text-blue-700"
            rel="nofollow noopener noreferrer"
            target="_blank">Mehr erfahren</a>
        </p>
        <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={loadMap}>Karte laden</button>
        <div class="flex justify-center gap-2">
          <Checkbox aria-label="Always load maps" id="always-load-maps" bind:checked />
          <label for="always-load-maps" class="inline-block align-top leading-5 select-none"> Google Maps immer erlauben </label>
        </div>
      </div>
    </div>
  {/if}
</div>
