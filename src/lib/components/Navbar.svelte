<script>
    import logoImage from "$lib/assets/logo.png"
    import logoNameImage from "$lib/assets/logoName.png"
    import ThemeToggle from "./ThemeToggle.svelte";


</script>

<nav class="bg-black">
    <div class="mx-auto max-w-5xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
            <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <!-- Mobile menu button-->
                <button type="button" class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <!-- Icon when menu is closed. Menu open: "hidden", Menu closed: "block" -->
                    <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <!-- Icon when menu is open. Menu open: "block", Menu closed: "hidden" -->
                    <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div class="flex flex-shrink-0 items-center cursor-pointer">
                    <img class="block h-9 w-auto lg:block" src={logoImage} alt="Logo">
                    <img class="block h-9 w-auto lg:block" src={logoNameImage} alt="Logo Name">
                </div>
                <div class="hidden sm:ml-6 sm:block">
                    <div class="absolute inset-y-0 right-0 flex items-center space-x-4">
                        <a href="#" class="nav-item text-white px-3 pt-2 pb-1 mb-1 text-sm font-bold border-b-2 !border-primary" aria-current="page">Home</a>
                        <a href="#" class="nav-item text-gray-300 px-3 pt-2 pb-1 mb-1 text-sm font-medium">Team</a>
                        <a href="#" class="nav-item text-gray-300 px-3 pt-2 pb-1 mb-1 text-sm font-medium">Leistungen</a>
                        <a href="#" class="nav-item text-gray-300 px-3 pt-2 pb-1 mb-1 text-sm font-medium">Galerie</a>
                        <a href="#" class="nav-item text-gray-300 px-3 pt-2 pb-1 mb-1 text-sm font-medium">Kontakt</a>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div class="sm:hidden" id="mobile-menu">
        <div class="space-y-1 px-2 pb-3 pt-2">
            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
            <a href="#" class="bg-gray-900 !text-green-700 rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Home</a>
            <a href="#" class="text-gray-300 hover:bg-[#BF8D30] hover:text-white rounded-md px-3 py-2 text-sm font-medium">Team</a>
            <a href="#" class="text-gray-300 hover:bg-[#BF8D30] hover:text-white rounded-md px-3 py-2 text-sm font-medium">Leistungen</a>
            <a href="#" class="text-gray-300 hover:bg-[#BF8D30] hover:text-white rounded-md px-3 py-2 text-sm font-medium">Galerie</a>
            <a href="#" class="text-gray-300 hover:bg-[#BF8D30] hover:text-white rounded-md px-3 py-2 text-sm font-medium">Kontakt</a>
        </div>
    </div>
</nav>

<style>
.nav-item {
    border-bottom: transparent 2px solid;
    background: linear-gradient(to top, var(--myColor1), var(--myColor2));
    transition: --myColor1 350ms linear, --myColor2 350ms, all 350ms;
}

.nav-item:hover {
    --myColor1: #bf8d30;
    border-bottom: #bf8d30 2px solid;
}

@property --myColor1 {
    syntax: '<color>';
    initial-value: transparent;
    inherits: false;
}

@property --myColor2 {
    syntax: '<color>';
    initial-value: transparent;
    inherits: false;
}
</style>