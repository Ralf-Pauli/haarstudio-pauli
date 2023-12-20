<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils";
  import { Card } from "flowbite-svelte";

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props["class"] = undefined;
  let img: any = undefined;
  export { className as class, img };
</script>

<Card {img} horizontal class={cn("dark:bg-transparent dark:hover:bg-secondary !border-[#e1a847]/[.20]", className)} {...$$restProps}>
  <slot />
</Card>
