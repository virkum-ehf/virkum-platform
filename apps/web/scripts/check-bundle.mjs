// Checks the static export after `next build`:
//   1. no page loads Three.js up front (it must arrive on demand with the 3D scenes), and
//   2. each page's initial JavaScript stays within the budget (gzip size).
// Usage: node scripts/check-bundle.mjs [outDir]
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const BUDGET_KB = 250;
const out = process.argv[2] ?? new URL("../out/", import.meta.url).pathname;

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );

const sizes = new Map();
const chunk = (src) => {
  if (!sizes.has(src)) {
    const code = readFileSync(join(out, src.replace(/^\//, "")));
    sizes.set(src, { gzip: gzipSync(code).length, three: code.includes("WebGLRenderer") });
  }
  return sizes.get(src);
};

const problems = [];
const rows = [];
for (const page of walk(out).filter((file) => file.endsWith(".html"))) {
  const html = readFileSync(page, "utf8");
  const scripts = [...new Set([...html.matchAll(/<script[^>]*\ssrc="([^"]+\.js)"/g)].map((match) => match[1]))];
  const total = scripts.reduce((sum, src) => sum + chunk(src).gzip, 0) / 1024;
  const name = "/" + relative(out, page);
  rows.push(`${total.toFixed(0).padStart(5)} KB  ${name}`);
  if (total > BUDGET_KB)
    problems.push(`${name}: initial JavaScript is ${total.toFixed(0)} KB gzip (budget ${BUDGET_KB} KB)`);
  for (const src of scripts.filter((src) => chunk(src).three))
    problems.push(`${name}: loads Three.js up front (${src})`);
}

console.log(`Initial JavaScript per page (gzip, budget ${BUDGET_KB} KB):\n${rows.sort().join("\n")}`);
if (problems.length > 0) {
  console.error(`\n${problems.join("\n")}`);
  process.exit(1);
}
console.log("\nBundle check passed.");
