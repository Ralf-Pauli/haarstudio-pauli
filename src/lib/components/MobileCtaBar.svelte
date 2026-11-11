<script lang="ts">
    import {siteConfig} from "$lib/config";
</script>

<div class="fixed inset-x-0 bottom-0 z-30 flex gap-2.5 border-t border-rule bg-background px-4 pb-5 pt-3 md:hidden">
    <a href="tel:{siteConfig.contact.phone.replaceAll(' ', '')}"
       class="flex min-h-12 flex-1 items-center justify-center rounded-full border border-text text-[15px] font-medium">
        Anrufen
    </a>
    <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer"
       class="flex min-h-12 flex-[2] items-center justify-center rounded-full bg-text text-[15px] font-medium text-background">
        Termin reservieren →
    </a>
</div>
