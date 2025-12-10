<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { ArrowUp } from "lucide-svelte";

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
    class="fixed h-12 w-12 bottom-5 right-5 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    aria-label="Scroll to top">
    <ArrowUp class="h-6 w-6" />
  </button>
{/if}
