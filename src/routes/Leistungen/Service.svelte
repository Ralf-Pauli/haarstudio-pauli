<script lang="ts">
  export let name: string;
  export let price: any;
  if (typeof price === "number" && !isNaN(price)) {
    price = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
</script>

<div class="">
  <div class="grid grid-cols-2 gap-4">
    <div class="">{name}</div>
    <div class="text-right">{price}</div>
  </div>
</div>