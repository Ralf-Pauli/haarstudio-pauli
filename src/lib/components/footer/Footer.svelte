<script lang="ts">
  import InfoCard from "$components/navbar/InfoCard.svelte";
  import addressIcon from "$lib/assets/maps-and-flags.png";
  import phoneIcon from "$lib/assets/phone-receiver-silhouette.png";

  export let footer: any;
</script>

<footer class="mx-auto pt-4 flex inset-x-0 h-44 max-w-5xl sticky top-[100vh]">
  <div class="container mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <InfoCard>
        <div slot="title">Kontakt</div>
        <div slot="content">
          <div class="flex flex-row items-center gap-2">
            <img alt="Address Icon" class="h-5" src={phoneIcon}>
            <a href="tel:{footer.contact.phone_number}">{footer.contact.phone_number}</a>
          </div>
        </div>
      </InfoCard>
      <InfoCard>
        <p slot="title">Addresse</p>
        <div slot="content">
          <div class="flex flex-row items-center gap-2">
            <img alt="Address Icon" class="h-5" src={addressIcon}>
            <div>
              <p> {footer.address.street} {footer.address.house_number}</p>
              <p>{footer.address.zip_code} {footer.address.city}</p>
            </div>
          </div>
        </div>
      </InfoCard>
      <InfoCard>
        <div slot="title">Informationen</div>
        <div slot="content" class="flex flex-col gap-1">
          <a href="/kontakt">Kontakt</a>
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
        </div>
      </InfoCard>
    </div>
  </div>
</footer>