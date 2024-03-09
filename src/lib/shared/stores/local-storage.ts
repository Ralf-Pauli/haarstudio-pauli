import { browser } from '$app/environment';
import { writable, type Writable, type Updater } from 'svelte/store';

export function createLocalStorage<T>(
  key: string,
  initialValue: T,
  onChange?: (value: T) => void,
): Writable<T> & { set: (value: T) => void; get: () => T | null; update: (updater: Updater<T>) => void } {
  const storedValue = browser ? window.localStorage.getItem(key) : null;
  const lStore = writable<T>(storedValue ? JSON.parse(storedValue) : initialValue);

  function update(updater: Updater<T>): void {
    lStore.update((current) => {
      const newValue = updater(current);
      if (newValue !== current) {
        onChange?.(newValue);
        if (browser) window.localStorage.setItem(key, JSON.stringify(newValue));
      }
      return newValue;
    });
  }

  function set(value: T): void {
    lStore.set(value);
    if (browser) window.localStorage.setItem(key, JSON.stringify(value));
    onChange?.(value);
  }

  function get(): T | null {
    const item = browser ? window.localStorage.getItem(key) : null;
    try {
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error parsing JSON from localStorage", error);
      return null;
    }
  }


  return {
    subscribe: lStore.subscribe,
    set,
    get,
    update,
  };
}
