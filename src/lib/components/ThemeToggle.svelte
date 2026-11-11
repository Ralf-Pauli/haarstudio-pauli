<script lang="ts">
    import {onMount} from "svelte";
    import {Moon, Sun} from "@lucide/svelte";

    let isDark = $state(true);

    onMount(() => {
        isDark = document.documentElement.classList.contains("dark");
    });

    function toggleTheme() {
        isDark = !isDark;
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.theme = isDark ? "dark" : "light";
    }
</script>

<button
        type="button"
        onclick={toggleTheme}
        class="inline-flex size-11 items-center justify-center rounded-full text-text transition-colors hover:bg-secondary"
        aria-label={isDark ? "Helles Design aktivieren" : "Dunkles Design aktivieren"}
>
    {#if isDark}
        <Sun class="size-5"/>
    {:else}
        <Moon class="size-5"/>
    {/if}
</button>
