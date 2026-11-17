// Tests scripts/fetch-content.mjs against a local mock of the Cloudflare D1 API and the R2 (S3) API.
// Run: pnpm test:fetch
import http from "node:http";
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ID1 = "11111111-1111-4111-8111-111111111111";
const ID2 = "22222222-2222-4222-8222-222222222222";
const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(200, 1)]);

const scenario = { docs: [], objects: {}, d1Fails: false, seenAuth: [] };

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url.includes("/d1/database/")) {
        if (req.headers.authorization !== "Bearer token") { res.statusCode = 403; return res.end("{}"); }
        res.setHeader("content-type", "application/json");
        return res.end(JSON.stringify(scenario.d1Fails ? { success: false, errors: [{ message: "boom" }] } : { success: true, result: [{ results: scenario.docs }] }));
    }
    if (req.method === "GET" && req.url.startsWith("/bucket/gallery/")) {
        scenario.seenAuth.push(req.headers.authorization ?? "");
        const body = scenario.objects[req.url.split("/").pop()];
        if (!body) { res.statusCode = 404; return res.end("nope"); }
        return res.end(body);
    }
    res.statusCode = 404; res.end();
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const script = fileURLToPath(new URL("./fetch-content.mjs", import.meta.url));
// Async on purpose: the mock server runs in this process and must keep answering while the script runs.
function run(extraEnv = {}) {
    const out = mkdtempSync(join(tmpdir(), "fetch-content-"));
    const child = spawn(process.execPath, [script], {
        env: {
            PATH: process.env.PATH,
            CF_ACCOUNT_ID: "acc", CF_API_TOKEN: "token", D1_DATABASE_ID: "db",
            R2_BUCKET_NAME: "bucket", R2_ACCESS_KEY_ID: "key", R2_SECRET_ACCESS_KEY: "secret",
            CF_API_BASE: base, R2_ENDPOINT: base, OUTPUT_ROOT: out, ...extraEnv,
        },
    });
    let log = "";
    child.stdout.on("data", (d) => (log += d));
    child.stderr.on("data", (d) => (log += d));
    return new Promise((resolve) => child.on("close", (code) => resolve({ out, code, log })));
}

let failed = 0;
const check = (name, ok, detail = "") => { if (!ok) failed++; console.log(ok ? "PASS" : "FAIL", name, ok ? "" : detail); };

const prices = [{ id: 1, name: "Herren", services: [] }];
const gallery = [
    { id: "a", builtin: "damen", title: "A", alt: "", filter: "damen" },
    { id: "b", imageId: ID1, title: "B", alt: "", filter: "farbe" },
    { id: "c", imageId: ID2, title: "C", alt: "", filter: "salon" },
];
const good = () => {
    scenario.d1Fails = false;
    scenario.docs = [{ key: "prices", published: JSON.stringify(prices) }, { key: "gallery", published: JSON.stringify(gallery) }, { key: "ignored", published: "{}" }];
    scenario.objects = { [`${ID1}.jpg`]: jpeg, [`${ID2}.jpg`]: jpeg };
    scenario.seenAuth = [];
};

// 1. success
good();
let r = await run();
check("success exits 0", r.code === 0, r.log);
check("prices written", existsSync(join(r.out, "static/data/categories.json")) && JSON.parse(readFileSync(join(r.out, "static/data/categories.json"), "utf-8"))[0].name === "Herren");
check("gallery written", JSON.parse(readFileSync(join(r.out, "static/data/gallery.json"), "utf-8")).length === 3);
check("unknown document ignored", !existsSync(join(r.out, "static/data/ignored.json")));
check("photos downloaded", readdirSync(join(r.out, "src/lib/assets/uploads")).sort().join() === `${ID1}.jpg,${ID2}.jpg`);
check("photo bytes intact", readFileSync(join(r.out, `src/lib/assets/uploads/${ID1}.jpg`)).equals(jpeg));
check("R2 requests are signed", scenario.seenAuth.length === 2 && scenario.seenAuth.every((a) => a.startsWith("AWS4-HMAC-SHA256")), scenario.seenAuth.join());
rmSync(r.out, { recursive: true, force: true });

// 2. not configured -> does nothing
r = await run({ CF_API_TOKEN: "" });
check("not configured exits 0", r.code === 0 && !existsSync(join(r.out, "static")), r.log);

// 3. failure cases must fail the build
good(); scenario.d1Fails = true; r = await run();
check("D1 error fails build", r.code === 1, r.log);

good(); r = await run({ R2_SECRET_ACCESS_KEY: "" });
check("missing R2 credentials fail build", r.code === 1 && r.log.includes("R2_"), r.log);

good(); delete scenario.objects[`${ID2}.jpg`]; r = await run();
check("missing photo fails build", r.code === 1 && r.log.includes("404"), r.log);

good(); scenario.objects[`${ID1}.jpg`] = Buffer.from("<html>not an image</html>".repeat(10)); r = await run();
check("non-JPEG fails build", r.code === 1 && r.log.includes("valid JPEG"), r.log);

good(); scenario.docs[1] = { key: "gallery", published: JSON.stringify([{ id: "x", imageId: "../../etc/passwd", title: "x", alt: "", filter: "damen" }]) }; r = await run();
check("invalid photo id fails build (no path traversal)", r.code === 1 && r.log.includes("invalid photo id"), r.log);

good(); scenario.docs[0] = { key: "prices", published: "{not json" }; r = await run();
check("corrupt document fails build", r.code === 1, r.log);

server.close();
process.exit(failed ? 1 : 0);
