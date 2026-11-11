<script lang="ts">
    import {siteConfig} from "$lib/config";

    const links = [
        {name: "Leistungen & Preise", url: "/leistungen"},
        {name: "Galerie", url: "/galerie"},
        {name: "Kontakt", url: "/kontakt"},
    ];

    const hoursSummary = ["Di – Fr 9 – 18 Uhr", "Sa 8 – 13 Uhr", "So & Mo geschlossen"];
</script>

<footer class="mt-24 border-t border-text md:mt-36">
    <div class="container-page grid gap-x-16 gap-y-10 pb-6 pt-12 text-[15px] leading-[1.7] sm:grid-cols-2 lg:grid-cols-4">
        <div>
            <div class="mb-4 flex items-center gap-2.5">
                <enhanced:img class="block h-9 w-auto" src="$lib/assets/logo.png" alt=""/>
                <enhanced:img class="block h-6 w-auto" src="$lib/assets/logoName.png" alt={siteConfig.name}/>
            </div>
            <address class="not-italic text-soft">
                {siteConfig.address.street}<br>
                {siteConfig.address.zipcode} {siteConfig.address.city}<br>
                <a class="hover:text-brand" href="tel:{siteConfig.contact.phone.replaceAll(' ', '')}">{siteConfig.contact.phone}</a>
            </address>
        </div>
        <div>
            <div class="font-display mb-2.5 text-xl">Öffnungszeiten</div>
            <div class="text-soft">
                {#each hoursSummary as line}
                    <div>{line}</div>
                {/each}
            </div>
        </div>
        <nav aria-label="Fußzeile" class="flex flex-col">
            <div class="font-display mb-2.5 text-xl">Seiten</div>
            {#each links as link}
                <a class="w-fit hover:text-brand" href={link.url}>{link.name}</a>
            {/each}
            <a class="w-fit hover:text-brand" href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">Termin reservieren</a>
        </nav>
        <div class="flex flex-col">
            <div class="font-display mb-2.5 text-xl">Folgen</div>
            <a class="w-fit hover:text-brand" href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a class="w-fit hover:text-brand" href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
        </div>
    </div>
    <div class="container-page flex flex-wrap justify-between gap-3 border-t border-rule pb-8 pt-5 text-[13px] text-muted">
        <span>&copy; {new Date().getFullYear()} {siteConfig.name}</span>
        <div class="flex gap-6">
            <a class="hover:text-brand" href="/impressum">Impressum</a>
            <a class="hover:text-brand" href="/datenschutz">Datenschutz</a>
        </div>
    </div>
</footer>
