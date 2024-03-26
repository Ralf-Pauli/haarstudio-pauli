<script lang="ts">
  import type { PageData } from "../../../.svelte-kit/types/src/routes/$types.js";
  import { PUBLIC_GOOGLE_MAPS_API_KEY, PUBLIC_PLACE_ID, PUBLIC_STRAPI_HOST } from "$env/static/public";
  import placeholderImage from "$lib/assets/31.jpg";
  import { createLocalStorage } from "$lib/shared/stores/local-storage";

  export let data: PageData;
  let contactPage = data.contact_page;
  let loadGoogleMap = createLocalStorage<boolean>("load-google-map", false);
  let shouldLoad = false;

  function handleAlwaysLoadChange(event: Event) {
    const target = event.target as HTMLInputElement;
    loadGoogleMap.set(target.checked);
  }
</script>


<!-- Map Section -->
<div class="map-container w-3/5 h-2/5 block relative mx-auto">
  {#if shouldLoad || loadGoogleMap.get()}
    <iframe
      title="Google Map"
      allowfullscreen
      class="w-full h-full"
      referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps/embed/v1/place?key={PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:{PUBLIC_PLACE_ID}"
      style="border:0">
    </iframe>
  {:else}
    <img class="w-full h-full object-cover" src={placeholderImage} alt="Placeholder Map Image">
    <div class="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-50">
      <p class="text-center mb-4">Mit dem Laden der Karte akzeptieren Sie die Datenschutzerklärung von Google.</p>
      <div class="flex flex-col items-center">
        <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
                on:click={() => shouldLoad = true}>Karte laden
        </button>
        <label class="flex items-center text-sm">
          <input type="checkbox" class="mr-2" on:change="{handleAlwaysLoadChange}" checked="{loadGoogleMap.get()}">
          <span>Google Maps immer entsperren</span>
        </label>
      </div>
    </div>
  {/if}
</div>

<!-- Contact Information -->
<div class="contact-info mb-8 text-center">
  <h2 class="text-2xl font-bold mb-4">Kontaktinformationen</h2>
  <!-- Address -->
  <div class="address mb-4">
    <p><strong>Adresse:</strong> {contactPage.address.street} {contactPage.address.house_number}
      , {contactPage.address.zip_code} {contactPage.address.city}</p>
  </div>
  <!-- Phone Number -->
  <div class="phone mb-4">
    <p><strong>Telefon:</strong> <a href="tel:{contactPage.details.phone_number}">{contactPage.details.phone_number}</a>
    </p>
  </div>
  <!-- Opening Hours -->
  <div class="opening-hours">
    <h3 class="text-xl font-semibold mb-2">Öffnungszeiten</h3>
    {#each contactPage.opening_hours as openingHour}
      <p>
        {openingHour.days} : {openingHour.closed ? 'Geschlossen' : `${openingHour.begin.slice(0, 5)} - ${openingHour.end.slice(0, 5)}`}
      </p>
    {/each}
  </div>
</div>

<!-- Social Media Links -->
<div class="social-media flex justify-center gap-4">
  {#each contactPage.social_media as social}
    <a href="{social.url}" title="{social.name}" target="_blank" rel="noopener noreferrer">
      <img src={`${PUBLIC_STRAPI_HOST}${social.icon.formats.thumbnail.url}`} alt="{social.name}" class="h-8">
    </a>
  {/each}
</div>
