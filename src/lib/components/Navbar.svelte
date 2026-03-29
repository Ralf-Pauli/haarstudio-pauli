<script lang="ts">
    import {afterNavigate} from "$app/navigation";
    import {page} from "$app/state";
    import {fly, fade} from "svelte/transition";
    import {cubicOut} from "svelte/easing";
    import ThemeToggle from "$components/ThemeToggle.svelte";

    let {isMobileMenuOpen = $bindable(false)} = $props();

    let pathName = $state(page.url.pathname);

    const menuItems = [
        {name: "Hauptseite", url: "/"},
        {name: "Leistungen", url: "/leistungen"},
        {name: "Galerie", url: "/galerie"},
        {name: "Kontakt", url: "/kontakt"},
    ];

    const mobileMenuItems = [
        ...menuItems,
        {name: "Impressum", url: "/impressum"},
        {name: "Datenschutz", url: "/datenschutz"}
    ];

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }

    function closeMobileMenu() {
        isMobileMenuOpen = false;
    }

    function isActive(url: string): boolean {
        if (url === "/") {
            return pathName === "/";
        }
        return pathName.startsWith(url);
    }

    // Update pathName and close mobile menu on navigation
    afterNavigate(() => {
        pathName = page.url.pathname;
        closeMobileMenu();
    });

    // Close mobile menu on escape key
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape" && isMobileMenuOpen) {
            closeMobileMenu();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown}/>

<nav class="mb-2">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
            <!-- Mobile menu button -->
            <div class="flex items-center sm:hidden">
                <button
                        onclick={toggleMobileMenu}
                        class="inline-flex items-center justify-center rounded-md p-2 text-text hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors"
                        aria-controls="mobile-menu"
                        aria-expanded={isMobileMenuOpen}
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    <span class="sr-only">{isMobileMenuOpen ? "Close" : "Open"} main menu</span>
                    {#if isMobileMenuOpen}
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    {:else}
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                        </svg>
                    {/if}
                </button>
            </div>

            <!-- Logo -->
            <div class="flex flex-1 items-center justify-center sm:justify-start">
                <a href="/" class="flex flex-shrink-0 items-center gap-2 focus:outline-none">
                    <enhanced:img class="block h-9 w-auto" src="$lib/assets/logo.png" alt="Logo"/>
                    <enhanced:img class="block h-9 w-auto" src="$lib/assets/logoName.png" alt="Logo Name"/>
                </a>

                <!-- Desktop menu -->
                <div class="hidden sm:ml-auto sm:flex sm:items-center sm:space-x-1">
                    {#each menuItems as item}
                        <a
                                href={item.url}
                                class="nav-item px-2 pt-2 pb-1 mb-1 text-sm mx-2"
                                class:navActive={isActive(item.url)}
                                aria-current={isActive(item.url) ? "page" : undefined}
                        >
                            {item.name}
                        </a>
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile Menu -->
    {#if isMobileMenuOpen}
        <!-- Backdrop -->
        <div
                class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                transition:fade={{ duration: 250 }}
                onclick={closeMobileMenu}
                role="presentation"
        ></div>

        <!-- Menu Panel -->
        <div
                class="fixed inset-y-0 right-0 w-full max-w-xs bg-background shadow-2xl z-50"
                transition:fly={{ x: 300, duration: 350, easing: cubicOut }}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
        >
            <div class="h-full flex flex-col">
                <!-- Header -->
                <div class="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 class="text-lg font-bold text-primary">Menu</h2>
                    <button
                            onclick={closeMobileMenu}
                            class="p-2 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
                            aria-label="Close menu"
                    >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <!-- Navigation Links -->
                <nav class="flex-1 overflow-y-auto p-4">
                    <ul class="space-y-1">
                        {#each mobileMenuItems as item, i}
                            <li style="animation-delay: {i * 40}ms" class="menu-item-animate">
                                <a
                                        href={item.url}
                                        class="mobile-nav-link block px-4 py-3 rounded-lg transition-all duration-200"
                                        class:mobile-nav-active={isActive(item.url)}
                                        aria-current={isActive(item.url) ? "page" : undefined}
                                >
                                    {item.name}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </nav>
            </div>
        </div>
    {/if}
</nav>

<style>
    .nav-item {
        position: relative;
        border-bottom: 2px solid transparent;
        transition: border-bottom-color 0.2s ease-in-out;
    }

    @media (hover: hover) and (pointer: fine) {
        .nav-item:hover {
            border-bottom-color: #bf8d30;
        }

        .navActive:hover {
            border-bottom-color: #d19555;
        }
    }

    .navActive {
        border-bottom-color: var(--primary);
        font-weight: bold;
    }

    /* Mobile menu animations */
    .menu-item-animate {
        opacity: 0;
        transform: translateX(10px);
        animation: slideIn 0.3s ease-out forwards;
    }

    @keyframes slideIn {
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .mobile-nav-link {
        font-size: 1rem;
    }

    @media (hover: hover) and (pointer: fine) {
        .mobile-nav-link:hover {
            background: rgba(255, 255, 255, 0.05);
        }
    }

    .mobile-nav-active {
        background: rgba(var(--primary-rgb, 209, 149, 85), 0.15);
        color: var(--primary);
        font-weight: 600;
    }
</style>