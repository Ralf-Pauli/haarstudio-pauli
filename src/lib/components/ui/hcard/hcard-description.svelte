<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "$lib/utils";

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<div class={cn("mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight", className)} {...$$restProps}>
  <p>
    <slot />
  </p>
</div>
