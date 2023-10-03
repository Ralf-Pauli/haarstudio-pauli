<script lang="ts">
  import InfoCard from "$lib/components/navbar/InfoCard.svelte";
  export let footerData: any;
  const strapi = footerData.data;
</script>

<div class="mx-auto max-w-screen-2xl flex absolute bottom-0 inset-x-0 h-17">
  <div class="min-w-1/4 max-w-lg grid grid-rows-2 grid-flow-col gap-4">
    <InfoCard>
      <p slot="title">Addresse</p>
      <div slot="content">
        <p>{strapi.address.street} {strapi.address.house_number}</p>
        <p>{strapi.address.zip_code} {strapi.address.city}</p>
      </div>
    </InfoCard>
    <InfoCard>
      <div slot="title">Kontakt</div>
      <p slot="content"><a href='tel:{strapi.contact.phone_number}'>{strapi.contact.phone_number}</a></p>
    </InfoCard>
    <InfoCard>
      <div slot="title">Links</div>
      <a slot="content" href="https://google.com">Google Bewertungen</a>
    </InfoCard>
  </div>
  <div class="red min-w-1/4 max-w-lg">wb</div>
  <div class="red max-w-lg">g</div>
</div>

<style>
  .red {
    margin: 10px;
    background-color: red;
    flex-grow: 1;
  }
</style>
