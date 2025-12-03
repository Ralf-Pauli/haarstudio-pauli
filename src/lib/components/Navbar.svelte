<script lang="ts">
    import {createLocalStorage} from "$lib/shared/stores/local-storage";
    import {afterNavigate} from "$app/navigation";
    import {page} from "$app/state";
    import ThemeToggle from "$components/ThemeToggle.svelte";

    export let isMobileMenuOpen = false;
    export let toggleMobileMenu = () => {
    };

    $: pathName = page.url.pathname;

    const navActive = createLocalStorage("active-nav", "/");

    function updateActiveNavItem() {
        // set active nav into localstorage
        navActive.set(pathName);
        const navigationLinksContainer = document.getElementById("nav-links-container");
        const navigationLinks: HTMLCollection | undefined = navigationLinksContainer?.getElementsByClassName("nav-item");

        for (const navigationLink of navigationLinks! as unknown as HTMLAnchorElement[]) {
            if (navigationLink.pathname == navActive.get()) navigationLink.classList.add("navActive");
            else navigationLink.classList.remove("navActive");
        }
    }

    const menuItems = [
        {name: "Hauptseite", url: "/"},
        {name: "Leistungen", url: "/leistungen"},
        {name: "Galerie", url: "/galerie"},
        {name: "Kontakt", url: "/kontakt"},
    ];


    const mobileMenuItems = [...menuItems, {name: "Impressum", url: "/impressum"}, {
        name: "Datenschutz",
        url: "/datenschutz"
    }];

    afterNavigate(() => {
        updateActiveNavItem();
    });
</script>

<nav class="mb-2">
    <div class="navActive invisible"></div>
    <div class="mx-auto max-w-5xl">
        <div class="relative flex h-16 items-center justify-between">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <!-- Mobile menu button-->
                <button
                        onclick={toggleMobileMenu}
                        class="inline-flex items-center justify-center rounded-md p-2 text-text hover:text-white focus:outline-none ring-0"
                        aria-controls="mobile-menu"
                        aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="block h-6 w-6 z-20" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                    </svg>
                </button>

                <button id="mobile-menu-button-close" class="hidden z-20 pl-1 transition" onclick={toggleMobileMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"
                    >
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                              d="m7 7l10 10M7 17L17 7"/>
                    </svg>
                </button>
            </div>

            <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <button
                        onclick={() => {
            document.getElementById("homeLink")?.click();
          }}>
                    <div class="flex flex-shrink-0 items-center cursor-pointer">
                        <enhanced:img class="block h-9 w-auto lg:block" src="$lib/assets/logo.png" alt="Logo"/>
                        <enhanced:img class="block h-9 w-auto lg:block" src="$lib/assets/logoName.png" alt="Logo Name"/>
                    </div>
                </button>
                <div class="hidden sm:ml-6 sm:block">
                    <div class="absolute inset-y-0 right-0 flex items-center space-x-4 font-medium"
                         id="nav-links-container">
                        <a id="homeLink" href="/" class="nav-item px-3 pt-2 pb-1 mb-1 text-sm font-bold"
                           aria-current="page">Home</a>
                        <a href="/leistungen" class="nav-item px-3 pt-2 pb-1 mb-1 text-sm">Leistungen</a>
                        <a href="/galerie" class="nav-item px-3 pt-2 pb-1 mb-1 text-sm">Galerie</a>
                        <a href="/kontakt" class="nav-item px-3 pt-2 pb-1 mb-1 text-sm">Kontakt</a>
<!--                        <ThemeToggle/>-->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile Menu-->
    {#if isMobileMenuOpen}
        <div class="fixed inset-0 bg-background text-white flex flex-col items-center justify-center z-50 h-screen">
            <button class="absolute top-5 left-2 text-2xl" onclick={toggleMobileMenu}>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
            <nav>
                <ul class="text-center">
                    {#each mobileMenuItems as item}
                        <li class="mb-6">
                            <a href={item.url} onclick={toggleMobileMenu} class="text-2xl hover:text-gray-300">
                                {item.name}
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
        </div>
    {/if}
</nav>

<style>
    .nav-item {
        border-bottom: transparent 2px solid;
    }

    .nav-item:hover {
        --myColor1: #bf8d30;
        border-bottom: #bf8d30 2px solid;
    }

    .navActive {
        border-bottom-width: 2px;
        border-bottom-color: #d19555;
    }
</style>
