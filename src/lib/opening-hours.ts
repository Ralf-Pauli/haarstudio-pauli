import { siteConfig } from "$lib/config";

const DAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export type DayRow = { index: number; name: string; hours: string; today: boolean; closed: boolean };

export type OpeningStatus = {
    isOpen: boolean;
    title: string;
    line: string;
    remaining: string;
    todayName: string;
    week: DayRow[];
};

export function getOpeningStatus(now: Date): OpeningStatus {
    const hours = siteConfig.openingHours;
    const today = now.getDay();
    const h = now.getHours() + now.getMinutes() / 60;
    const todayHours = hours[today];
    const isOpen = !!todayHours && h >= todayHours[0] && h < todayHours[1];

    let title: string;
    let line: string;
    let remaining = "";

    if (isOpen && todayHours) {
        const mins = Math.round((todayHours[1] - h) * 60);
        remaining = mins >= 60 ? `noch ${Math.floor(mins / 60)} Std. ${mins % 60} Min.` : `noch ${mins} Min.`;
        title = "Jetzt geöffnet";
        line = `Heute bis ${todayHours[1]} Uhr`;
    } else if (todayHours && h < todayHours[0]) {
        title = "Noch geschlossen";
        line = `Öffnet heute um ${todayHours[0]} Uhr`;
    } else {
        let next = today;
        let steps = 0;
        do {
            next = (next + 1) % 7;
            steps++;
        } while (!hours[next] && steps < 7);
        title = "Geschlossen";
        line = `Öffnet ${steps === 1 ? "morgen" : DAY_NAMES[next]} um ${hours[next]?.[0]} Uhr`;
    }

    const week = WEEK_ORDER.map((i) => ({
        index: i,
        name: DAY_NAMES[i],
        today: i === today,
        closed: !hours[i],
        hours: hours[i] ? `${hours[i]![0]} – ${hours[i]![1]} Uhr` : "geschlossen"
    }));

    return { isOpen, title, line, remaining, todayName: `Heute, ${DAY_NAMES[today]}`, week };
}
