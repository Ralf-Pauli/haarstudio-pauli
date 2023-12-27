import { browser } from "$app/environment";
import { writable, type Updater } from "svelte/store";

export function createLocalStorage(
  key: string,
  onChange?: (value: any) => void,
) {
  const lStore = writable();

  function update(updater: Updater<any>) {
    lStore.update((current) => {
      const newValue = updater(current);
      if (newValue !== current) {
        onChange?.(newValue);
      }
      return newValue;
    });
  }

  function set(value: any) {
    update(() => value);
  }

  function get() {
    if (browser) return window.localStorage.getItem(key);
  }

  lStore.subscribe((value) => {
    if (browser) window.localStorage.setItem(key, value as string);
  });

  return {
    ...lStore,
    set,
    get,
    update,
  };
}
