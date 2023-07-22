<script>
  import InfoCard from "$lib/components/navbar/InfoCard.svelte";
</script>

<div class="mx-auto max-w-screen-2xl flex">
  <div class="min-w-1/4 max-w-lg grid grid-rows-2 grid-flow-col gap-4">
    <InfoCard>
      <p slot="title">Addresse</p>
      <div slot="content">
        <p>Lerchenweg 9</p>
        <p>94527 Aholming</p>
      </div>
    </InfoCard>
    <InfoCard>
      <div slot="title">Kontakt</div>
      <p slot="content"><a href="phone:+4915124235034">+4915124235034</a></p>
    </InfoCard>
    <InfoCard>
      <div slot="title">Links</div>
      <a slot="content" href="google.com">Google Bewertungen</a>
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
