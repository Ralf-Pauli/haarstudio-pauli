/** Converts between what the owner types ("20", "20,50 €", "ab 55,00", "15 % Rabatt") and the stored value. */

const PLAIN_AMOUNT = /^(\d{1,6}(?:[.,]\d{1,2})?)\s*(?:€|eur)?$/i;

/** A plain amount becomes a number, anything else stays text. */
export function parsePrice(input: string): number | string {
    const text = input.trim();
    const match = PLAIN_AMOUNT.exec(text);
    if (match) return Number(match[1].replace(",", "."));
    return text;
}

/** Text shown in the input field for a stored price. */
export function formatPriceInput(value: number | string | undefined | null): string {
    if (value === undefined || value === null) return "";
    if (typeof value === "number") {
        return value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return value;
}
