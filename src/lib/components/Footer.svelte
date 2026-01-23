<script lang="ts">
    import FacebookImage from "$lib/assets/facebook.png";

    // TODO update social media
    const socialMedia = [{
        name: "Facebook",
        url: "https://www.facebook.com/haarstudio.pauli",
        icon: FacebookImage
    }]

</script>

<footer class="w-full pb-3 flex flex-col gap-3 sm:grid grid-cols-1 sm:grid-cols-3 mx-auto pt-4 inset-x-0 h-16 max-w-5xl sticky top-[100vh] text-sm text-center">
    <!--  TODO: use correct name -->
    <p class="flex-shrink-0 md:text-left">&copy; {new Date().getFullYear()} Haarstudio Pauli</p>
    <div class="mx-auto">
        {#each socialMedia as item}
            <a href={item.url} target="_blank" aria-label={item.name}>
                <enhanced:img src={item.icon} alt={item.name} class="inline w-4 h-4 mx-2"/>
            </a>
        {/each}
    </div>
    <div class="md:ml-auto pb-3">
        <a href="/impressum">Impressum</a>
        <span>|</span>
        <a href="/datenschutz">Datenschutz</a>
    </div>
</footer>

<style>
    footer a:hover {
        text-decoration: underline;
    }
</style>
