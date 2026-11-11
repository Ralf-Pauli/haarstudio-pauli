<script lang="ts">
    import {afterNavigate} from "$app/navigation";
    import {page} from "$app/state";
    import {fly, fade} from "svelte/transition";
    import {cubicOut} from "svelte/easing";
    import {Menu, X} from "@lucide/svelte";
    import ThemeToggle from "$components/ThemeToggle.svelte";
    import {siteConfig} from "$lib/config";

    let {isMobileMenuOpen = $bindable(false)} = $props();

    let pathName = $state(page.url.pathname);

    const menuItems = [
        {name: "Start", url: "/"},
        {name: "Leistungen & Preise", url: "/leistungen"},
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

<header class="border-b border-rule lg:border-b-0">
    <div class="container-page flex items-center justify-between gap-x-8 py-3 lg:py-4">
        <!-- Logo -->
        <a href="/" class="flex shrink-0 items-center gap-2 lg:gap-3 focus:outline-none" aria-label="{siteConfig.name} – Startseite">
            <enhanced:img class="block h-[34px] w-auto lg:h-11" src="$lib/assets/logo.png" alt=""/>
            <enhanced:img class="block h-[22px] w-auto lg:h-7" src="$lib/assets/logoName.png" alt={siteConfig.name}/>
        </a>

        <!-- Desktop menu -->
        <nav aria-label="Hauptnavigation" class="hidden lg:flex lg:items-center lg:gap-x-8">
            {#each menuItems as item}
                <a
                        href={item.url}
                        class="nav-item font-display py-1.5 text-xl whitespace-nowrap"
                        class:navActive={isActive(item.url)}
                        aria-current={isActive(item.url) ? "page" : undefined}
                >
                    {item.name}
                </a>
            {/each}
            <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" class="btn-pill whitespace-nowrap font-sans text-sm">Termin reservieren →</a>
            <ThemeToggle/>
        </nav>

        <!-- Mobile controls -->
        <div class="flex items-center lg:hidden">
            <ThemeToggle/>
            <button
                    onclick={toggleMobileMenu}
                    class="inline-flex size-11 items-center justify-center rounded-md text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-controls="mobile-menu"
                    aria-expanded={isMobileMenuOpen}
                    aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            >
                {#if isMobileMenuOpen}
                    <X class="size-6"/>
                {:else}
                    <Menu class="size-6"/>
                {/if}
            </button>
        </div>
    </div>

    <!-- Mobile Menu -->
    {#if isMobileMenuOpen}
        <!-- Backdrop -->
        <div
                class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                transition:fade={{ duration: 250 }}
                onclick={closeMobileMenu}
                role="presentation"
        ></div>

        <!-- Menu Panel -->
        <div
                id="mobile-menu"
                class="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background shadow-2xl"
                transition:fly={{ x: 300, duration: 350, easing: cubicOut }}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile Navigation"
        >
            <div class="flex h-full flex-col">
                <div class="flex items-center justify-between border-b border-rule p-4">
                    <h2 class="font-display text-lg font-bold text-brand">Menü</h2>
                    <button
                            onclick={closeMobileMenu}
                            class="inline-flex size-11 items-center justify-center rounded-lg transition-colors hover:bg-secondary focus:outline-none"
                            aria-label="Menü schließen"
                    >
                        <X class="size-5"/>
                    </button>
                </div>

                <nav class="flex-1 overflow-y-auto p-4" aria-label="Mobile Navigation">
                    <ul class="space-y-1">
                        {#each mobileMenuItems as item, i}
                            <li style="animation-delay: {i * 40}ms" class="menu-item-animate">
                                <a
                                        href={item.url}
                                        class="mobile-nav-link block rounded-lg px-4 py-3 transition-colors"
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
</header>

<style>
    .nav-item {
        border-bottom: 2px solid transparent;
        text-decoration: none;
        transition: color 0.2s ease-in-out, border-bottom-color 0.2s ease-in-out;
    }

    @media (hover: hover) and (pointer: fine) {
        .nav-item:hover {
            color: var(--brand);
        }
    }

    .navActive {
        border-bottom-color: var(--primary);
    }

    .mobile-nav-link {
        font-family: var(--font-display);
        font-size: 1.25rem;
    }

    @media (hover: hover) and (pointer: fine) {
        .mobile-nav-link:hover {
            background: var(--secondary);
        }
    }

    .mobile-nav-active {
        background: var(--secondary);
        color: var(--brand);
        font-weight: 600;
    }
</style>
