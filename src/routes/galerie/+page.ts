import type {PageLoad} from './$types';

export type GalleryFilter = 'herren' | 'damen' | 'kinder' | 'farbe' | 'styling' | 'pflege' | 'salon';

const META: Record<string, { filter: GalleryFilter; title: string; alt: string }> = {
    damen: {filter: 'damen', title: 'Wellen & Volumen', alt: 'Lange blonde Haare mit Volumen, im Wind'},
    herren: {filter: 'herren', title: 'Kurzhaarschnitt mit Kontur', alt: 'Herrenschnitt mit Kamm und Konturen'},
    coloration: {filter: 'farbe', title: 'Kupferrot, frisch gefärbt', alt: 'Kupferrotes Haar wird mit Holzkamm gekämmt'},
    hero: {filter: 'salon', title: 'Unser Salon am Stadtgraben', alt: 'Innenansicht des Salons mit Bedienplätzen und Regal'},
    styling: {filter: 'styling', title: 'Hochsteckfrisur', alt: 'Hochsteckfrisur mit Haarnadeln'},
    kinder: {filter: 'kinder', title: 'Kinderschnitt mit Spange', alt: 'Kinderfrisur mit Haarspange'},
    cosmetic: {filter: 'pflege', title: 'Intensivpflege', alt: 'Pflegebehandlung für lange Haare'},
};

// Display order of the gallery
const ORDER = ['damen', 'herren', 'coloration', 'hero', 'styling', 'kinder', 'cosmetic'];

export const load: PageLoad = async () => {
    const modules = import.meta.glob(['/src/lib/assets/gallery/*.{png,jpg,jpeg,webp}', '/src/lib/assets/hero.jpg'], {
        eager: true,
        query: {enhanced: true},
        import: 'default'
    });

    const images = Object.entries(modules)
        .map(([path, asset]) => {
            const name = path.split('/').pop()?.split('.').shift() || 'galerie';
            const meta = META[name];
            return {
                name,
                asset: asset as string,
                filter: meta?.filter ?? ('salon' as GalleryFilter),
                title: meta?.title ?? 'Haarstudio Pauli',
                alt: meta?.alt ?? 'Haarstudio Pauli Galerie',
            };
        })
        .sort((a, b) => {
            const ia = ORDER.indexOf(a.name);
            const ib = ORDER.indexOf(b.name);
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        });

    return {
        images
    };
};
