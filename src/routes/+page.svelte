<script lang="ts">
    import type {PageProps} from './$types';
    import {Button} from "$components/ui/button";
    import BookingWidget from "$components/BookingWidget.svelte";
    import type {Category} from "$utils/types";

    // Import images
    // import BleachingImage from 'src/lib/assets/categories/bleaching.jpg'

    // TODO add url to categories

    const COLUMNS_PER_ROW = 3;
    let {data}: PageProps = $props();
    const categories: Category[] = data.categories;

    let categoryRows = chunkCategoriesIntoRows(categories, COLUMNS_PER_ROW);

    function chunkCategoriesIntoRows(categories: Category[], columns: number): any[] {
        const rows: any[] = [];
        for (let i = 0; i < categories.length; i += columns) {
            rows.push(categories.slice(i, i + columns));
        }
        return rows;
    }
</script>

<div class="flex flex-col gap-5">
    <section class="relative flex justify-center items-center">
        <div class="w-11/12 md:w-4/5 h-[24rem] md:h-[40rem] max-h-screen max-w-5xl mx-auto relative">
            <enhanced:img src="$lib/assets/hero.jpg" alt="Hero Image"
                          class="w-full h-full object-cover rounded-xl absolute opacity-10"/>
            <div class="relative h-full text-white">
                <div class="flex flex-col items-center justify-center h-full bg-opacity-10 p-4 rounded-xl relative">
                    <h1 class="text-2xl md:text-4xl font-bold inline border-b-primary mb-2 underline decoration-primary decoration-4 underline-offset-4 text-center">
                        Willkommen bei Haarstudio&nbsp;Pauli
                    </h1>
                    <p class="text-base md:text-xl my-1 text-center">Erleben Sie Exzellenz und Präzision bei&nbsp;jedem
                        Termin.</p>
                    <Button
                            target="_blank"
                            href="https://connect.shore.com/bookings/haarstudio-pauli/services?locale=de"
                            class="text-sm md:text-base mt-4 bg-primary text-black font-bold p-2 px-4 rounded-md">
                        Termin Buchen
                    </Button>
                </div>
            </div>
        </div>
    </section>

    <!-- Services -->
    <div class="max-w-5xl mx-auto mb-10 p-4">
        <h2 class="text-2xl font-bold text-center mb-8">Unsere Leistungen</h2>
        <div class="space-y-6">
            {#each categoryRows as row}
                <div class="flex flex-wrap justify-center gap-6">
                    {#each row as category}
                        <a href="/leistungen?tab={category.name}" class="flex flex-col items-center text-center w-60">
                            <div class="flex flex-col items-center text-center w-60">
                                <div class="text-lg font-bold border-b-primary pb-1 underline decoration-primary decoration-2 underline-offset-4">{category.name}</div>
                                <img class="w-full h-40 object-cover rounded-md mt-2"
                                     src="src/lib/assets/categories/{category?.image}" alt={category.name}/>
                            </div>
                        </a>
                    {/each}
                </div>
            {/each}
        </div>
    </div>

    <BookingWidget/>
</div>
