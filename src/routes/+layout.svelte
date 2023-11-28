<script lang="ts">
  import "../app.postcss";
  import type { LayoutData } from "./$types";
  import Navbar from "$components/navbar/Navbar.svelte";
  import Footer from "$components/footer/Footer.svelte";

  export let data: LayoutData;
  const footerData = data?.footer;
</script>

<div class="min-h-full !h-auto m-[0_auto_-11rem]">
  <Navbar />
  <slot />
  <div class="h-44"></div>
</div>
<Footer {footerData} />
