<script lang="ts">
  import "../app.postcss";
  import type { LayoutData } from "./$types";
  import Navbar from "$components/navbar/Navbar.svelte";
  import Footer from "$components/footer/Footer.svelte";

  export let data: LayoutData;
  const footerData = data?.footer;

</script>

<Navbar />
<Footer {footerData} />
<slot />
