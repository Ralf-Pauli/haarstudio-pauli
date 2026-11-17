// Tests the JPEG header reader that guards photo uploads. Run: pnpm test:jpeg
import { readdirSync, readFileSync } from "node:fs";
import { parseJpegSize } from "../src/lib/server/jpeg.ts";

let failed = 0;
const eq = (name, got, want) => {
    const ok = JSON.stringify(got) === JSON.stringify(want);
    if (!ok) failed++;
    console.log(ok ? "PASS" : "FAIL", name, ok ? "" : `got ${JSON.stringify(got)} want ${JSON.stringify(want)}`);
};

// Synthetic header: SOI, APP0 (16 bytes), SOF0 with 640x480
const synthetic = Uint8Array.from([
    0xff, 0xd8,
    0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00,
    0xff, 0xc0, 0x00, 0x11, 0x08, 0x01, 0xe0, 0x02, 0x80, 0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
]);
eq("synthetic baseline", parseJpegSize(synthetic), { width: 640, height: 480 });
const progressive = Uint8Array.from(synthetic);
progressive[21] = 0xc2;
eq("progressive (SOF2)", parseJpegSize(progressive), { width: 640, height: 480 });

eq("empty", parseJpegSize(new Uint8Array()), null);
eq("PNG signature", parseJpegSize(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), null);
eq("HTML", parseJpegSize(new TextEncoder().encode("<html><script>alert(1)</script></html>")), null);
eq("SOI only", parseJpegSize(Uint8Array.from([0xff, 0xd8])), null);
eq("truncated before SOF", parseJpegSize(synthetic.slice(0, 24)), null);
const zero = Uint8Array.from(synthetic);
zero[25] = 0; zero[26] = 0;
eq("zero height", parseJpegSize(zero), null);
const badLength = Uint8Array.from(synthetic);
badLength[4] = 0; badLength[5] = 1;
eq("invalid segment length", parseJpegSize(badLength), null);

// Real photos shipped with the site
const dir = new URL("../src/lib/assets/gallery/", import.meta.url);
for (const file of readdirSync(dir).filter((f) => f.endsWith(".jpg"))) {
    const size = parseJpegSize(new Uint8Array(readFileSync(new URL(file, dir))));
    eq(`real photo ${file}`, !!size && size.width > 100 && size.height > 100, true);
    console.log("     ", file, JSON.stringify(size));
}

process.exit(failed ? 1 : 0);
