import { browser } from "$app/environment";
import { writable } from "svelte/store";

const defaultValue = "/";
const initialValue = browser
  ? window.localStorage.getItem("navActive") ?? defaultValue
  : defaultValue;

export const navActive = writable(initialValue);

navActive.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem("navActive", value);
  }
});

export { navActive as default };
