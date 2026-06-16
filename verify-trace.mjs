import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const files = {
  html: readFileSync("index.html", "utf8"),
  css: readFileSync("styles.css", "utf8"),
  js: readFileSync("app.js", "utf8")
};

const requiredIds = [
  "trace-canvas",
  "trace-count",
  "trace-status",
  "selected-title",
  "trace-input",
  "plant-trace",
  "export-traces",
  "clear-local",
  "tour-traces",
  "import-traces",
  "import-file",
  "trace-list"
];

for (const id of requiredIds) {
  assert.match(files.html, new RegExp(`id="${id}"`), `index.html exposes #${id}`);
}

assert.match(files.html, /<canvas id="trace-canvas"/, "canvas surface is present");
assert.match(files.css, /@media \(max-width: 860px\)/, "mobile layout breakpoint is present");
assert.match(files.css, /min-height: 100dvh/, "viewport height is anchored");
assert.doesNotMatch(files.css, /letter-spacing:\s*-/i, "letter spacing is not negative");
assert.match(files.js, /const TRACE_SEEDS = \[/, "seed traces are declared");
assert.match(files.js, /localStorage/, "local archive is persisted");
assert.match(files.js, /requestAnimationFrame/, "canvas animation loop is active");
assert.match(files.js, /anchor\.download = DOWNLOAD_NAME/, "JSON export path is wired");
assert.match(files.js, /importTracePayload/, "JSON import path is wired");
assert.match(files.js, /TOUR_INTERVAL_MS/, "tour timing is explicit");
assert.match(files.js, /ArrowRight/, "keyboard next trace is wired");
assert.match(files.js, /ArrowLeft/, "keyboard previous trace is wired");
assert.match(files.js, /window\.confirm/, "local reset asks for confirmation");
assert.match(files.css, /aria-pressed="true"/, "tour active state has visible styling");
assert.match(files.css, /\.file-input/, "file input is visually hidden but present");
assert.doesNotMatch(`${files.html}\n${files.css}\n${files.js}`, /\bTODO\b/i, "no TODO markers remain");

const seedIds = Array.from(files.js.matchAll(/id: "([^"]+)"/g)).map((match) => match[1]);
for (const id of ["agency-granted", "strong-verification", "playful-proof", "living-artifact"]) {
  assert.ok(seedIds.includes(id), `seed ${id} exists`);
}

console.log("Trace Atlas verification passed.");
