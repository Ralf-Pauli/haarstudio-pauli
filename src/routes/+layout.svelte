<script lang="ts">
  import "../app.postcss";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$components/Footer.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
  console.log(data)
</script>

<Navbar />
<slot />
