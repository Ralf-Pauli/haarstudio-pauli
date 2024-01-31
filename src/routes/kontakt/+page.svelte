<script lang="ts">
  import type { PageData } from "../../../.svelte-kit/types/src/routes/$types.js";
  import { PUBLIC_STRAPI_HOST } from "$env/static/public";

  export let data: PageData;
  let contactPage = data.contact_page;
</script>


<!-- Embed Google Maps for the location -->

<div class="map-container">
  <iframe class="w-full h-1/2"
          referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed/v1/place?key={PUBLIC_GOOGLE_MAPS_API_KEY}&q=Haarstudio-Pauli"
          title="Google Maps"></iframe>
<div>

<!-- Contact Information Section -->
<div class="contact-section text-center">

  <!-- Address Section -->
  <div class="address-info">
    <h3 class="font-bold">Adresse</h3>
    <div>
      <p>{contactPage.address.zip_code} {contactPage.address.city}</p>
      <p>{contactPage.address.street} {contactPage.address.house_number}</p>
    </div>
  </div>

  <!-- Contact Details Section -->
  <div class="contact-info">
    <h3 class="font-bold">Kontakt</h3>
    <div>
      <div>Tel: <a href="tel:{contactPage.details.phone_number}">{contactPage.details.phone_number}</a></div>
    </div>
  </div>

  <!-- Opening Hours Section -->
  <div class="opening-hours">
    <h3 class="font-bold">Öffnungszeiten</h3>
    <div>
      {#each contactPage.opening_hours as openingHour}
        {#if openingHour.closed}
          <div>{openingHour.day}: Geschlossen</div>
        {:else}
          <div>{openingHour.day}: {openingHour.begin.slice(0, 5)} - {openingHour.end.slice(0, 5)}</div>
        {/if}
      {/each}
    </div>
  </div>
</div>

<div>
  {#each contactPage.social_media as social_media}
    <a href="{social_media.url}">
      <img src="{PUBLIC_STRAPI_HOST}{social_media.icon.formats.thumbnail.url}" class="object-contain h-[30px]"
           alt="{social_media.name}"></a>
  {/each}
</div>
