<script lang='ts'>
  import { onMount } from "svelte";

  onMount(() => {
    const input = document.querySelector("input");
    if (!input) return;
    if (localStorage.theme == 'dark') {
      input.checked = false;
    } else {
      input.checked = true;
    }
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

<div class="toggle-switch">
  <label>
    <input type="checkbox" />
    <span class="slider" />
  </label>
</div>

<style>
  :root {
    --light: #d8dbe0;
    --dark: #28292c;
    --link: rgb(27, 129, 112);
    --link-hover: rgb(24, 94, 82);
  }

  .toggle-switch {
    margin-top: -20px;
    position: relative;
    width: 40px;
  }

  label {
    position: absolute;
    width: 100%;
    height: 20px;
    background-color: var(--dark);
    border-radius: 1em;
    cursor: pointer;
  }

  input {
    position: absolute;
    display: none;
  }

  .slider {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 1em;
    transition: 0.3s;
  }

  input:checked ~ .slider {
    background-color: var(--light);
  }

  .slider::before {
    content: "";
    position: absolute;
    top: 2.6px;
    left: 3.2px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    box-shadow: inset 5.6px -0.4px 0px 0px var(--light);
    background-color: var(--dark);
    transition: 0.3s;
  }

  input:checked ~ .slider::before {
    transform: translateX(19px);
    background-color: var(--dark);
    box-shadow: none;
  }
</style>
