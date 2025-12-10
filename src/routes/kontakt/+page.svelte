<script lang="ts">
    import Map from "$lib/components/Map.svelte";
    import FacebookImage from "$lib/assets/facebook.png";

    const address = {
        street: "Östlicher Stadtgraben",
        house_number: "32",
        zip_code: "94469",
        city: "Deggendorf",
        phoneNumber: "0151 24235034"
    }

    const socialMedia = [{
        name: "Facebook",
        icon: FacebookImage,
        url: "https://www.facebook.com/p/Haarstudio-Pauli-61553966530565/",
    }]

    // TODO Maybe export to file
    const openingHours = [{
        days: "Montag bis Freitag",
        begin: "08:00",
        end: "17:00",
    }, {
        days: "Sonntag",
        begin: null,
        end: null,
    }]
</script>

<Map/>
<div class="contact-info my-10 sm:my-20 max-w-5xl mx-auto gap-10 sm:gap-4 flex flex-col sm:flex-row justify-between text-center">
    <div>
        <h4 class="mb-3 text-xl font-semibold underline decoration-primary decoration-1 underline-offset-3">Kontakt</h4>
        <div>
            <div class="flex flex-col mb-1">
                <p class="dark:text-zinc-400 text-zinc-600">Anschrift:</p>
                <div>
                    <div>
                        {address.street} {address.house_number}
                    </div>
                    <div>
                        {address.zip_code} {address.city}
                    </div>
                </div>
            </div>
            <div class="flex flex-col mb-1">
                <p class="dark:text-zinc-400 text-zinc-600">Telefon:</p>
                <a class="hover:underline hover:decoration-primary"
                   href="tel:{address.phoneNumber}">{address.phoneNumber}</a>
            </div>
        </div>
    </div>

    <div>
        <h4 class="mb-3 text-xl font-semibold underline decoration-primary decoration-1 underline-offset-3">Social
            Media</h4>
        <div class="flex flex-col items-center gap-2">
            {#each socialMedia as media}
                <div>
                    <a href={media.url} target="_blank" class="items-center flex">
                        <img src={media.icon} alt={media.name}
                             class="h-4 inline mr-2"/>
                        <span class="hover:underline hover:decoration-primary"> {media.name}</span>
                    </a>
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h4 class="mb-3 text-xl font-semibold underline decoration-primary decoration-1 underline-offset-3">
            Öffnungszeiten
        </h4>
        <div class="flex flex-col gap-1">
            {#each openingHours as openingHour}
                <div class="">
                    <div class="dark:text-zinc-400 text-zinc-600">{openingHour.days}:</div>
                    <div>{!openingHour.begin && !openingHour.end ? "Geschlossen" : `${openingHour.begin.slice(0, 5)} - ${openingHour.end.slice(0, 5)}`}</div>
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h4 class="mb-3 text-xl font-semibold underline decoration-primary decoration-1 underline-offset-3">
            Rechtliches</h4>
        <div class="flex flex-col gap-1">
            <a href="/impressum" class="hover:underline hover:decoration-primary">Impressum</a>
            <a href="/datenschutz" class="hover:underline hover:decoration-primary">Datenschutz</a>
        </div>
    </div>
</div>
