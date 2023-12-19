<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils";
  import { Card } from "flowbite-svelte";

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props["class"] = undefined;
  let img: any = undefined;
  export { className as class, img };
</script>

<div class={cn("", className)} {...$$restProps}>
  <Card {img} href="/" horizontal class="mb-4">
    <slot />
  </Card>
</div>
