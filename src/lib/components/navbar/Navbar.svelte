<script lang="ts">
  import logoImage from "$lib/assets/logo.png";
  import logoNameImage from "$lib/assets/logoName.png";
  import { createLocalStorage } from "$lib/shared/stores/local-storage";
  import ThemeToggle from "$components/ThemeToggle.svelte";
  import { Separator } from "$components/ui/separator";
  import { page } from "$app/stores";
  import { afterNavigate } from "$app/navigation";

  $: pathName = $page.url.pathname;

  const navActive = createLocalStorage("active-nav");

  function toggleMobileMenu() {
    const buttonOpen = document.getElementById("mobile-menu-button-open");
    const buttonClose = document.getElementById("mobile-menu-button-close");
    buttonOpen?.classList.toggle("hidden");
    buttonClose?.classList.toggle("hidden");
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu?.classList.toggle("hidden");
  }

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

  afterNavigate(function () {
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
          id="mobile-menu-button-open"
          type="button"
          on:click={toggleMobileMenu}
          class="inline-flex items-center justify-center rounded-md p-2 text-text hover:text-white focus:outline-none ring-0"
          aria-controls="mobile-menu"
          aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <!-- Icon when menu is closed. Menu open: "hidden", Menu closed: "block" -->
          <svg class="block h-6 w-6 z-20" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <!-- Icon when menu is open. Menu open: "block", Menu closed: "hidden" -->
          <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button id="mobile-menu-button-close" class="hidden z-20 pl-1 transition" on:click={toggleMobileMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"
            ><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m7 7l10 10M7 17L17 7" /></svg>
        </button>
      </div>
      <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <button
          on:click={() => {
            document.getElementById("homeLink")?.click();
          }}>
          <div class="flex flex-shrink-0 items-center cursor-pointer">
            <img class="block h-9 w-auto lg:block" src={logoImage} alt="Logo" />
            <img class="block h-9 w-auto lg:block" src={logoNameImage} alt="Logo Name" />
          </div>
        </button>
        <div class="hidden sm:ml-6 sm:block">
          <div class="absolute inset-y-0 right-0 flex items-center space-x-4 font-medium" id="nav-links-container">
            <a id="homeLink" href="/" class="nav-item px-3 pt-2 pb-1 mb-1 text-sm font-bold" aria-current="page">Home</a>
            <a href="/team" class="nav-item px-3 pt-2 pb-1 mb-1 text-sm">Team</a>
            <a href="/leistungen" class="nav-item px-3 pt-2 pb-1 mb-1 text-sm">Leistungen</a>
            <a href="/galerie" class="nav-item px-3 pt-2 pb-1 mb-1 text-sm">Galerie</a>
            <a href="/kontakt" class="nav-item px-3 pt-2 pb-1 mb-1 text-sm">Kontakt</a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile menu, show/hide based on menu state. -->
  <div class="sm:hidden hidden z-10 absolute w-full h-full top-0 pt-12" id="mobile-menu">
    <div class="space-y-1 px-2 pb-3 pt-2 flex flex-col gap-1">
      <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
      <a href="/" class="bg-[#573e10] text-white px-3 py-2 text-sm font-medium" aria-current="page">Home</a>
      <Separator class="bg-primary" />
      <a href="/team" class="text-gray-300 hover:bg-[#BF8D30] hover:text-white px-3 py-2 text-sm font-medium">Team</a>
      <Separator class="bg-primary" />
      <a href="/leistungen" class="text-gray-300 hover:bg-[#BF8D30] hover:text-white px-3 py-2 text-sm font-medium">Leistungen</a>
      <Separator class="bg-primary" />
      <a href="/galerie" class="text-gray-300 hover:bg-[#BF8D30] hover:text-white px-3 py-2 text-sm font-medium">Galerie</a>
      <Separator class="bg-primary" />
      <a href="/kontakt" class="text-gray-300 hover:bg-[#BF8D30] hover:text-white px-3 py-2 text-sm font-medium">Kontakt</a>
    </div>
  </div>
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
