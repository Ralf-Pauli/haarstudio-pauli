// Tests the price input parsing/formatting and the editor model round trip. Run: pnpm test:price
import { readFileSync } from "node:fs";
import { parsePrice, formatPriceInput } from "../src/lib/content/price.ts";
import { toUi, toDoc, validate, nextId } from "../src/lib/content/price-editor.ts";

let failed = 0;
const eq = (name, got, want) => {
    const ok = JSON.stringify(got) === JSON.stringify(want);
    if (!ok) failed++;
    console.log(ok ? "PASS" : "FAIL", name, ok ? "" : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`);
};

eq("20", parsePrice("20"), 20);
eq("20,50", parsePrice("20,50"), 20.5);
eq("20.5 €", parsePrice("20.5 €"), 20.5);
eq("7,5", parsePrice("7,5"), 7.5);
eq("ab 55", parsePrice("ab 55"), "ab 55");
eq("15 % Rabatt", parsePrice(" 15 % Rabatt "), "15 % Rabatt");
eq("1.000 stays text", parsePrice("1.000,00"), "1.000,00");
eq("format 20", formatPriceInput(20), "20,00");
eq("format 7.5", formatPriceInput(7.5), "7,50");
eq("format text", formatPriceInput("ab 55"), "ab 55");

// Round trip with the real price list: editing nothing must not change the data.
const data = JSON.parse(readFileSync(new URL("../static/data/categories.json", import.meta.url), "utf-8"));
const round = toDoc(toUi(data));
eq("round trip ids", round.map((c) => c.id), data.map((c) => c.id));
eq("round trip services", round.map((c) => c.services), data.map((c) => c.services));
eq("no validation problems", validate(toUi(data)), []);
eq("nextId unique", nextId(toUi(data)) > 1006, true);

const ui = toUi(data);
ui[0].entries.push({ kind: "group", id: 9999, name: "", rows: [] });
ui[0].entries.push({ kind: "leaf", id: 10000, name: "X", price: "" });
eq("detects problems", validate(ui).length, 3);

process.exit(failed ? 1 : 0);
