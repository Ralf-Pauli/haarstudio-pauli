<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.ico';
    import Navbar from "$components/Navbar.svelte";
    import Footer from "$components/Footer.svelte";
    import ScrollToTop from "$components/ScrollToTop.svelte";
    import MobileCtaBar from "$components/MobileCtaBar.svelte";

    let {children} = $props();

    let isMobileMenuOpen: boolean = $state(false);

</script>

<svelte:head>
    <link rel="icon" href={favicon}/>
</svelte:head>

<div class="min-h-screen pb-20 md:pb-0">
    <Navbar bind:isMobileMenuOpen />
    <main class:overflow-hidden={isMobileMenuOpen} class:h-screen={isMobileMenuOpen}>
        {@render children()}
    </main>
    <Footer/>
    <ScrollToTop/>
    <MobileCtaBar/>
</div>
