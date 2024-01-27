<script lang="ts">
  import InfoCard from "$components/navbar/InfoCard.svelte";

  export let footer: any;
</script>

<div class="mx-auto pt-4 flex inset-x-0 h-44 max-w-5xl sticky top-[100vh]">
  <div class="min-w-1/4 max-w-lg grid grid-rows-2 grid-flow-col gap-4">
    <InfoCard>
      <p slot="title">Addresse</p>
      <div slot="content">
        <p>{footer.address.street} {footer.address.house_number}</p>
        <p>{footer.address.zip_code} {footer.address.city}</p>
      </div>
    </InfoCard>
    <InfoCard>
      <div slot="title">Kontakt</div>
      <p slot="content"><a href="tel:{footer.contact.phone_number}">{footer.contact.phone_number}</a></p>
    </InfoCard>
    <InfoCard>
      <div slot="title">Links</div>
      <a href="https://google.com" slot="content">Google Bewertungen</a>
    </InfoCard>
  </div>
</div>
