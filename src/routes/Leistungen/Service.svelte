<script lang="ts">
    export let name: string;
    export let price: any;
</script>

<div class="grid grid-cols-2 gap-4">
    <div>{name}</div>
    <div>{price} €</div>
</div>
