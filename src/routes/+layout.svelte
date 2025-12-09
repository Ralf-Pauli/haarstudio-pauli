<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.ico';
    import {onMount} from "svelte";
    import Navbar from "$components/Navbar.svelte";
    import Footer from "$components/Footer.svelte";
    import ScrollToTop from "$components/ScrollToTop.svelte";

    let {children} = $props();

    let isMobileMenuOpen: boolean = $state(false);

</script>

<svelte:head>
    <link rel="icon" href={favicon}/>
</svelte:head>

<div class="h-screen sm:px-3">
    <Navbar {isMobileMenuOpen} />
    <main class:overflow-hidden={isMobileMenuOpen} class:h-screen={isMobileMenuOpen} class="pt-5 sm:pt-10">
        {@render children()}
    </main>
    <Footer/>
    <ScrollToTop/>

</div>
