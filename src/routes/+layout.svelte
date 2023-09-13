<script lang="ts">
  import "../app.postcss";
  import Navbar from "$lib/components/Navbar.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<Navbar />
<slot />
