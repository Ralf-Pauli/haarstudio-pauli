<script lang="ts">
  import "../app.postcss";
  import type { LayoutData } from "./$types";
  import Navbar from "$components/navbar/Navbar.svelte";
  import Footer from "$components/footer/Footer.svelte";

  export let data: LayoutData;
  const footer = data?.footer;
</script>

<div class="h-screen px-3">
  <Navbar />
  <slot />
  <Footer {footer} />
</div>
