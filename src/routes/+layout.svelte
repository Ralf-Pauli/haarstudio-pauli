<script lang="ts">
  import "../app.postcss";
  import type { LayoutData } from "../../.svelte-kit/types/src/routes/$types";
  import Navbar from "$lib/components/navbar/Navbar.svelte";
  import Footer from "$lib/components/footer/Footer.svelte";

  export let data: LayoutData;
  const footerData = data?.footer;

</script>

<Navbar />
<Footer {footerData} />
<slot />
