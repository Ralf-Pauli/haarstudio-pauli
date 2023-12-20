<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => {
    const input: HTMLInputElement = document.getElementById("toggle-switch-cb") as HTMLInputElement;
    if (!input) return;
    input.checked = localStorage.theme === "dark" ? false : true;
    input?.addEventListener("input", toggleDarkMode);
  });
  function toggleDarkMode() {
    if (localStorage.theme == "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.querySelector("html")?.classList.add("dark");
      localStorage.theme = "dark";
    }
  }
</script>

<div class="toggle-switch-container relative w-[24px]">
  <input type="checkbox" class="hidden" id="toggle-switch-cb" />
  <label for="toggle-switch-cb" class="absolute top-0 left-0 svg-overlay">
    <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24" class="night-icon" {...$$props}
      ><path
        fill="currentColor"
        d="M12 21q-3.775 0-6.387-2.613T3 12q0-3.45 2.25-5.988T11 3.05q.325-.05.575.088t.4.362q.15.225.163.525t-.188.575q-.425.65-.638 1.375T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q.775 0 1.538-.225t1.362-.625q.275-.175.563-.162t.512.137q.25.125.388.375t.087.6q-.35 3.45-2.937 5.725T12 21Zm0-2q2.2 0 3.95-1.213t2.55-3.162q-.5.125-1 .2t-1 .075q-3.075 0-5.238-2.163T9.1 7.5q0-.5.075-1t.2-1q-1.95.8-3.163 2.55T5 12q0 2.9 2.05 4.95T12 19Zm-.25-6.75Z" /></svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24" class="day-icon" {...$$props}
      ><path
        fill="currentColor"
        d="M12 15q1.25 0 2.125-.875T15 12q0-1.25-.875-2.125T12 9q-1.25 0-2.125.875T9 12q0 1.25.875 2.125T12 15Zm0 2q-2.075 0-3.537-1.463T7 12q0-2.075 1.463-3.537T12 7q2.075 0 3.538 1.463T17 12q0 2.075-1.463 3.538T12 17ZM2 13q-.425 0-.712-.288T1 12q0-.425.288-.712T2 11h2q.425 0 .713.288T5 12q0 .425-.288.713T4 13H2Zm18 0q-.425 0-.712-.288T19 12q0-.425.288-.712T20 11h2q.425 0 .713.288T23 12q0 .425-.288.713T22 13h-2Zm-8-8q-.425 0-.712-.288T11 4V2q0-.425.288-.712T12 1q.425 0 .713.288T13 2v2q0 .425-.288.713T12 5Zm0 18q-.425 0-.712-.288T11 22v-2q0-.425.288-.712T12 19q.425 0 .713.288T13 20v2q0 .425-.288.713T12 23ZM5.65 7.05L4.575 6q-.3-.275-.288-.7t.288-.725q.3-.3.725-.3t.7.3L7.05 5.65q.275.3.275.7t-.275.7q-.275.3-.687.288T5.65 7.05ZM18 19.425l-1.05-1.075q-.275-.3-.275-.712t.275-.688q.275-.3.688-.287t.712.287L19.425 18q.3.275.288.7t-.288.725q-.3.3-.725.3t-.7-.3ZM16.95 7.05q-.3-.275-.288-.687t.288-.713L18 4.575q.275-.3.7-.288t.725.288q.3.3.3.725t-.3.7L18.35 7.05q-.3.275-.7.275t-.7-.275ZM4.575 19.425q-.3-.3-.3-.725t.3-.7l1.075-1.05q.3-.275.712-.275t.688.275q.3.275.288.688t-.288.712L6 19.425q-.275.3-.7.288t-.725-.288ZM12 12Z" /></svg>
  </label>
</div>

<style>
  .toggle-switch-container {
    margin-top: -1.4em;
  }
  label {
    position: absolute;
    cursor: pointer;
  }
  .night-icon,
  .day-icon {
    position: absolute;
    opacity: 1;
    transition: opacity 0.5s ease;
  }
  .day-icon {
    opacity: 0;
  }
  #toggle-switch-cb:checked + .svg-overlay .day-icon {
    opacity: 1;
  }
  #toggle-switch-cb:checked + .svg-overlay .night-icon {
    opacity: 0;
  }
</style>
