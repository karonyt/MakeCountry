// 本番用にビルドされた index.js を、@minecraft/* を何でも受け流す偽物に差し替えて Node で読み込む。
// 目的は 1 つ: モジュールの読み込み時 (トップレベル) に例外が出ないかを確かめる。
//   node bundle-smoke.mjs <index.js>
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const bundlePath = process.argv[2];
let code = fs.readFileSync(bundlePath, "utf8");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bundle-smoke-"));

// import { a, b as c } from "@minecraft/x"  /  import * as ns from "@minecraft/x"
const named = new Map();
const importRe = /import\s*(?:\*\s*as\s+\w+|\{([^}]*)\}|\w+)?\s*(?:,\s*\{([^}]*)\})?\s*from\s*["'](@minecraft\/[\w-]+)["'];?/g;
for (const m of code.matchAll(importRe)) {
    const names = named.get(m[3]) ?? new Set();
    for (const group of [m[1], m[2]]) {
        for (const part of (group ?? "").split(",")) {
            const name = part.trim().split(/\s+as\s+/)[0].trim();
            if (name) names.add(name);
        }
    }
    named.set(m[3], names);
}

const stubSource = (names) => `
const registered = [];
const handler = {
    get(target, key) {
        if (key === "then") return undefined;
        if (key === Symbol.toPrimitive) return () => "";
        if (key === Symbol.iterator) return function* () {};
        if (key === Symbol.hasInstance) return () => false;
        if (key === "prototype") return target.prototype;
        if (key === "length") return 0;
        return make();
    },
    apply() { return make(); },
    construct() { return make(); },
    has() { return true; },
};
function make() { return new Proxy(function stub() {}, handler); }
export default make();
${[...names].map((n) => `export const ${n} = make();`).join("\n")}
`;

for (const [spec, names] of named) {
    const file = path.join(dir, spec.replace(/[@/]/g, "_") + ".mjs");
    fs.writeFileSync(file, stubSource(names));
    code = code.split(`"${spec}"`).join(JSON.stringify(pathToFileURL(file).href));
    code = code.split(`'${spec}'`).join(JSON.stringify(pathToFileURL(file).href));
}
const target = path.join(dir, "bundle.mjs");
fs.writeFileSync(target, code);

console.log("stubbed modules:", [...named.keys()].join(", "));
const timers = [];
const realSetInterval = globalThis.setInterval;
globalThis.setInterval = (...args) => { const t = realSetInterval(...args); timers.push(t); return t; };
try {
    await import(pathToFileURL(target).href);
    console.log("RESULT: loaded without a top-level exception");
} catch (error) {
    console.log("RESULT: top-level exception ->", error?.name, String(error?.message).slice(0, 300));
    console.log(String(error?.stack ?? "").split("\n").slice(0, 6).join("\n"));
    process.exitCode = 1;
} finally {
    for (const t of timers) clearInterval(t);
    fs.rmSync(dir, { recursive: true, force: true });
    setTimeout(() => process.exit(process.exitCode ?? 0), 200);
}
