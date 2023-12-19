<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils";

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<div class={cn("mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white", className)} {...$$restProps}>
  <h5>
    <slot />
  </h5>
</div>
