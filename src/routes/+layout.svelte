<script lang="ts">
    import './layout.css';
    import favicon from '$lib/assets/favicon.ico';
    import {onMount} from "svelte";
    import Navbar from "$components/Navbar.svelte";
    import Footer from "$components/Footer.svelte";
    import ScrollToTop from "$components/ScrollToTop.svelte";

    let {children} = $props();


</script>

<svelte:head>
    <link rel="icon" href={favicon}/>
</svelte:head>

<div class="h-screen sm:px-3">
    <Navbar/>
    <main>
        {@render children()}
    </main>
    <Footer />
    <ScrollToTop />

</div>
