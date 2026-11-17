<script lang="ts">
    import './layout.css';
    import {page} from "$app/state";
    import favicon from '$lib/assets/favicon.ico';
    import Navbar from "$components/Navbar.svelte";
    import Footer from "$components/Footer.svelte";
    import ScrollToTop from "$components/ScrollToTop.svelte";
    import BookingWidget from "$components/BookingWidget.svelte";

    let {children} = $props();

    let isMobileMenuOpen: boolean = $state(false);

</script>

<svelte:head>
    <link rel="icon" href={favicon}/>
</svelte:head>

{#if page.url.pathname === "/admin" || page.url.pathname.startsWith("/admin/")}
    <!-- Admin area has its own layout (see routes/admin/+layout.svelte) -->
    {@render children()}
{:else}
    <div class="min-h-screen">
        <Navbar bind:isMobileMenuOpen />
        <main class:overflow-hidden={isMobileMenuOpen} class:h-screen={isMobileMenuOpen}>
            {@render children()}
        </main>
        <Footer/>
        <ScrollToTop/>
        <BookingWidget/>
    </div>
{/if}
