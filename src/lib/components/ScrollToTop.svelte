<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { ArrowUp } from "@lucide/svelte";

  let showButton = false;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleScroll() {
    const scrollY = window.scrollY ?? document.documentElement.scrollTop;
    showButton = scrollY > 100;
  }

  onMount(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

{#if showButton}
  <button
    onclick={scrollToTop}
    transition:fade
    class="fixed bottom-5 right-5 h-12 w-12 rounded-full bg-text p-3 text-background shadow-lg hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    aria-label="Nach oben">
    <ArrowUp class="h-6 w-6" />
  </button>
{/if}
