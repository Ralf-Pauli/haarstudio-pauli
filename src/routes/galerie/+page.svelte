<script lang="ts">
  import { PUBLIC_STRAPI_HOST } from "$env/static/public";
  import type { PageData } from "../$types";
  import { Gallery } from "flowbite-svelte";

  export let data: PageData;

  const allImages = data.images.map((image: any) => ({
    alt: image.alternativeText,
    src: PUBLIC_STRAPI_HOST + image.url,
  }));

  let barImages = allImages.slice(0, 5); // TODO: Implement
  let headerImage = allImages[0];

  function imageClick(event: any) {
    headerImage = allImages.find((item: any) => {
      return item.src === event.target.src;
    });
    updateImageBar();
  }

  function moveImageLeft() {
    let currIndex = allImages.findIndex((elem: any) => headerImage.src === elem.src);
    // currIndex = currIndex === 0 ? allImages.length - 1 : currIndex - 1;
    if (currIndex != 0) {
      currIndex = currIndex - 1;
    }
    headerImage = allImages[currIndex];
    updateImageBar();
  }

  function moveImageRight() {
    let currIndex = allImages.findIndex((elem: any) => headerImage.src === elem.src);
    if (currIndex != allImages.length - 1) {
      currIndex = currIndex + 1;
    }
    headerImage = allImages[currIndex];
    updateImageBar();
  }

  function updateImageBar() {
    let i = allImages.findIndex((elem: any) => headerImage.src === elem.src);
    if (barImages[barImages.length - 1].src === headerImage.src) {
      if (i === allImages.length - 1) return;
      barImages = allImages.slice(i - 3, i + 2);
    } else if (barImages[0].src === headerImage.src) {
      if (i === 0) return;
      barImages = allImages.slice(i - 1, i + 4);
    }
  }
</script>

<div class="mx-auto pt-4 flex inset-x-0 max-w-5xl">
  <div class="flex flex-col gap-4">
    <div class="relative inline-block">
      <button
        class="m-3 absolute left-0 top-1/2 -translate-y-1/2 drop-shadow-2xl"
        on:click={() => {
          moveImageLeft();
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
          ><path
            fill="currentColor"
            d="m3.55 12l7.35 7.35q.375.375.363.875t-.388.875q-.375.375-.875.375t-.875-.375l-7.7-7.675q-.3-.3-.45-.675T.825 12q0-.375.15-.75t.45-.675l7.7-7.7q.375-.375.888-.363t.887.388q.375.375.375.875t-.375.875z" /></svg>
      </button>
      <img src={headerImage.src} alt="" class="h-[600px] rounded-t-xl w-full object-cover" />
      <button class="m-3 absolute right-0 top-1/2 -translate-y-1/2" on:click={() => moveImageRight()}
        ><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
          ><path
            fill="currentColor"
            d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887q.375-.375.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75q0 .375-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1q-.375-.375-.375-.888t.375-.887z" /></svg
        ></button>
    </div>
    <div class="grid grid-cols-5 gap-4">
      {#each barImages as image}
        <div on:click={imageClick}>
          <img src={image.src} alt={image.alt} class="h-full object-cover rounded-b-lg barImage" draggable="false" />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .barImage {
    cursor: pointer;
  }

  .barImage:hover {
    opacity: 0.8;
    transition: transform 0.2s ease-in-out;
  }
</style>
