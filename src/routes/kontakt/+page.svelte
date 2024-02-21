<script lang="ts">
  import type { PageData } from "../../../.svelte-kit/types/src/routes/$types.js";
  import { PUBLIC_GOOGLE_MAPS_API_KEY, PUBLIC_PLACE_ID, PUBLIC_STRAPI_HOST } from "$env/static/public";
  import Map from "./Map.svelte";
  import { onMount } from "svelte";

  // onMount(() => {
  //   const script = document.createElement('script');
  //   script.src = `https://maps.googleapis.com/maps/api/js?key=${PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
  //   script.defer = true;
  //   script.async = true;
  //
  //   window.initMap = () => {
  //     var map = new google.maps.Map(document.getElementById('map'), {
  //       zoom: 8,
  //       center: {lat: -34.397, lng: 150.644},
  //     });
  //   };
  //
  //   document.head.appendChild(script);
  // });

  export let data: PageData;
  let contactPage = data.contact_page;
</script>



<div class="map-container w-3/5 h-2/5 block m-auto">
<!--  <Map class="h-full w-full mb-5"></Map>-->
<!--  <div id="map" class="w-full h-full"></div>-->
  <iframe
    class="w-full h-full"
    frameborder="0" style="border:0"
    referrerpolicy="no-referrer-when-downgrade"
    src="https://www.google.com/maps/embed/v1/place?key={PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:{PUBLIC_PLACE_ID}"
    allowfullscreen>
  </iframe>

</div>

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
