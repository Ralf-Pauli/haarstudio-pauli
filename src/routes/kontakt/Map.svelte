<script>
  import { onMount } from "svelte";
  import { Loader } from "@googlemaps/js-api-loader";
  import { PUBLIC_GOOGLE_MAPS_API_KEY, PUBLIC_PLACE_ID } from "$env/static/public";

  let map;

  onMount(() => {
    const loader = new Loader({
      apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    const mapOptions = {
      zoom: 15,
    };

    var request = {
      placeId: PUBLIC_PLACE_ID,
      fields: ["name", "rating", "formatted_phone_number", "geometry"],
    };


    loader
      .importLibrary("maps")
      .then(({ Map }) => {
        map = new Map(document.getElementById("map"), mapOptions);

        let service = new google.maps.places.PlacesService(map);
        service.getDetails(request, callback);

        function callback(place, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            map.setCenter(place.geometry.location);

          }
        }

      })
      .catch((e) => {
        console.error("Error loading Google Maps API:", e);
      });

  });
</script>

<div id="map" class="w-full h-full">

</div>
