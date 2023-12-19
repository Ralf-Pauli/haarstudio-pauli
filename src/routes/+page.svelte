<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";

	const categoriesPerRow = 3;
	const categories = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Category 6"];
	const rows = Math.ceil(categories.length / categoriesPerRow);


	const splitCategories = Array.from({ length: rows }, (_, i) =>
		categories.slice(i * categoriesPerRow, i * categoriesPerRow + categoriesPerRow),
	);
</script>

<div class="flex flex-col items-center justify-center gap-4">
	{#each splitCategories as row}
		<div class="flex justify-center gap-4">
			{#each row as category}
				<Card.Root class="w-[350px]">
					<Card.Header>
						<Card.Title>{category}</Card.Title>
						<Card.Description>Deploy your new project in one-click.</Card.Description>
					</Card.Header>
					<Card.Content>
					</Card.Content>
					<Card.Footer class="flex justify-between">
						<Button variant="outline">Cancel</Button>
						<Button>Deploy</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{/each}
</div>