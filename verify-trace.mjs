import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = {
  html: readFileSync("index.html", "utf8"),
  launchHtml: readFileSync("launch.html", "utf8"),
  launchCss: readFileSync("launch.css", "utf8"),
  css: readFileSync("styles.css", "utf8"),
  js: readFileSync("app.js", "utf8"),
  evidencePack: readFileSync("evidence-pack.md", "utf8"),
  ledger: readFileSync("trace-ledger.json", "utf8"),
  timeline: readFileSync("progress-timeline.json", "utf8"),
  sync: readFileSync("world-sync.json", "utf8"),
  socialCard: readFileSync("social-card.svg", "utf8"),
  artifactKit: readFileSync("templates/ai-session-artifact-kit.md", "utf8"),
  xhsCover: readFileSync("promo/xhs-cover.html", "utf8"),
  xhsCoverPng: readFileSync("promo/xhs-cover.png"),
  xhsLaunchKit: readFileSync("promo/xhs-launch-kit.md", "utf8"),
  manifest: readFileSync("site.webmanifest", "utf8"),
  server: readFileSync("server.mjs", "utf8"),
  serviceWorker: readFileSync("service-worker.js", "utf8"),
  svg: readFileSync("icon.svg", "utf8")
};

const requiredIds = [
  "trace-canvas",
  "trace-count",
  "trace-status",
  "offline-status",
  "selected-title",
  "trace-input",
  "plant-trace",
  "export-traces",
  "clear-local",
  "tour-traces",
  "capsule-traces",
  "snapshot-traces",
  "import-traces",
  "import-file",
  "fingerprint-note",
  "world-status",
  "world-links",
  "kit-title",
  "copy-kit",
  "kit-status",
  "timeline-status",
  "timeline-list",
  "ledger-status",
  "ledger-list",
  "trace-list"
];

for (const id of requiredIds) {
  assert.match(files.html, new RegExp(`id="${id}"`), `index.html exposes #${id}`);
}

assert.match(files.html, /<canvas id="trace-canvas"/, "canvas surface is present");
assert.match(files.html, /rel="manifest" href="\.\/site\.webmanifest"/, "web manifest is linked");
assert.match(files.html, /rel="icon" href="\.\/icon\.svg"/, "svg icon is linked");
assert.match(files.html, /property="og:title" content="Trace Atlas 痕迹星图"/, "Open Graph title is Chinese");
assert.match(files.html, /property="og:image" content="https:\/\/trace-atlas-codex\.pages\.dev\/social-card\.svg"/, "Open Graph image is wired");
assert.match(files.html, /name="twitter:card" content="summary_large_image"/, "Twitter large card is wired");
assert.match(files.html, /href="\.\/templates\/ai-session-artifact-kit\.md"/, "artifact kit is linked from the page");
assert.match(files.html, /id="copy-kit"/, "artifact kit can be copied from the page");
assert.match(files.html, /id="timeline-title"/, "progress timeline section is present");
assert.match(files.launchHtml, /Trace Atlas 发布材料/, "launch page has a clear title");
assert.match(files.launchHtml, /promo\/xhs-cover\.png/, "launch page shows the Xiaohongshu cover");
assert.match(files.launchHtml, /social-card\.svg/, "launch page shows the social card");
assert.match(files.launchHtml, /templates\/ai-session-artifact-kit\.md/, "launch page links to the reusable template");
assert.match(files.launchHtml, /evidence-pack\.md/, "launch page links to the evidence pack");
assert.match(files.launchCss, /\.asset-grid/, "launch page asset grid is styled");
assert.match(files.launchCss, /overflow-x: hidden/, "launch page prevents horizontal overflow");
assert.doesNotMatch(files.launchCss, /letter-spacing:\s*-/i, "launch page letter spacing is not negative");
assert.match(files.css, /@media \(max-width: 860px\)/, "mobile layout breakpoint is present");
assert.match(files.css, /min-height: 100dvh/, "viewport height is anchored");
assert.match(files.css, /overflow-x: hidden/, "page prevents horizontal overflow on mobile");
assert.match(files.css, /max-width: 100vw/, "app shell is capped to the viewport width");
assert.match(files.css, /min-width: 0/, "grid children can shrink inside narrow viewports");
assert.doesNotMatch(files.css, /letter-spacing:\s*-/i, "letter spacing is not negative");
assert.match(files.js, /const TRACE_SEEDS = \[/, "seed traces are declared");
assert.match(files.js, /localStorage/, "local archive is persisted");
assert.match(files.js, /requestAnimationFrame/, "canvas animation loop is active");
assert.match(files.js, /serviceWorker/, "service worker registration is wired");
assert.match(files.js, /anchor\.download = DOWNLOAD_NAME/, "JSON export path is wired");
assert.match(files.js, /SNAPSHOT_NAME = "trace-atlas-snapshot\.svg"/, "SVG snapshot filename is declared");
assert.match(files.js, /function snapshotSvg/, "SVG snapshot renderer is wired");
assert.match(files.js, /image\/svg\+xml/, "SVG snapshot uses an SVG MIME type");
assert.match(files.js, /function archiveFingerprint/, "archive fingerprint is wired");
assert.match(files.js, /fingerprint: archiveFingerprint\(\)/, "exports include archive fingerprints");
assert.match(files.js, /function renderLedger/, "provenance ledger renderer is wired");
assert.match(files.js, /trace-ledger\.json\?\$\{DATA_VERSION\}/, "provenance ledger data is loaded with a versioned URL");
assert.match(files.js, /function renderWorldSync/, "world sync renderer is wired");
assert.match(files.js, /world-sync\.json\?\$\{DATA_VERSION\}/, "world sync metadata is loaded with a versioned URL");
assert.match(files.js, /function renderTimeline/, "progress timeline renderer is wired");
assert.match(files.js, /progress-timeline\.json\?\$\{DATA_VERSION\}/, "progress timeline data is loaded with a versioned URL");
assert.match(files.js, /safePublicHref/, "timeline evidence links are constrained");
assert.match(files.js, /DATA_VERSION = "v=5"/, "JSON data requests are versioned");
assert.match(files.js, /ARTIFACT_KIT_URL = "\.\/templates\/ai-session-artifact-kit\.md"/, "artifact kit copy source is declared");
assert.match(files.js, /function copyArtifactKit/, "artifact kit copy handler is wired");
assert.match(files.js, /navigator\.clipboard/, "clipboard API copy path is present");
assert.match(files.js, /document\.execCommand\("copy"\)/, "clipboard fallback path is present");
assert.match(files.js, /importTracePayload/, "JSON import path is wired");
assert.match(files.js, /CAPSULE_PREFIX/, "capsule URL prefix is declared");
assert.match(files.js, /encodeCapsule/, "capsule encoder is wired");
assert.match(files.js, /restoreCapsuleFromLocation/, "capsule restore path is wired");
assert.match(files.js, /TOUR_INTERVAL_MS/, "tour timing is explicit");
assert.match(files.js, /ArrowRight/, "keyboard next trace is wired");
assert.match(files.js, /ArrowLeft/, "keyboard previous trace is wired");
assert.match(files.js, /window\.confirm/, "local reset asks for confirmation");
assert.match(files.css, /aria-pressed="true"/, "tour active state has visible styling");
assert.match(files.css, /\.file-input/, "file input is visually hidden but present");
assert.match(files.serviceWorker, /CACHE_NAME = "trace-atlas-shell-v13"/, "service worker cache is versioned");
assert.match(files.html, /href="\.\/styles\.css\?v=12"/, "stylesheet URL is versioned");
assert.match(files.html, /src="\.\/app\.js\?v=12"/, "script URL is versioned");
for (const cachedFile of ["./index.html", "./launch.html", "./styles.css?v=12", "./launch.css?v=1", "./app.js?v=12", "./progress-timeline.json?v=5", "./world-sync.json?v=5", "./trace-ledger.json?v=5", "./icon.svg", "./social-card.svg", "./promo/xhs-cover.png", "./evidence-pack.md", "./templates/ai-session-artifact-kit.md", "./site.webmanifest"]) {
  const escaped = cachedFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(files.serviceWorker, new RegExp(escaped), `service worker caches ${cachedFile}`);
}
assert.match(files.server, /\.webmanifest/, "local server serves the manifest type");
assert.match(files.server, /\.md/, "local server serves markdown templates");
assert.match(files.server, /\.png/, "local server serves png share assets");
assert.match(files.server, /\.svg/, "local server serves svg icons");
assert.match(files.svg, /Trace Atlas icon/, "svg icon has an accessible title");
assert.match(files.socialCard, /我把 AI 会话/, "social card states the Xiaohongshu hook");
assert.match(files.artifactKit, /AI 会话公开化模板/, "artifact kit has a clear title");
assert.match(files.artifactKit, /公开链接 HTTP 状态/, "artifact kit includes public link verification");
assert.match(files.xhsCover, /我把 <span class="highlight">AI 会话<\/span>/, "Xiaohongshu cover source has the hook");
assert.deepEqual(Array.from(files.xhsCoverPng.subarray(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10], "Xiaohongshu cover PNG has a valid signature");
assert.equal(files.xhsCoverPng.readUInt32BE(16), 900, "Xiaohongshu cover PNG width is 900");
assert.equal(files.xhsCoverPng.readUInt32BE(20), 1200, "Xiaohongshu cover PNG height is 1200");
assert.match(files.xhsLaunchKit, /小红书正文草案/, "Xiaohongshu launch kit includes a body draft");
assert.match(files.xhsLaunchKit, /最终推荐：`我把AI会话做成网站`/, "Xiaohongshu launch kit has a selected title");
assert.match(files.xhsLaunchKit, /#AI工作流/, "Xiaohongshu launch kit includes tags");
assert.match(files.artifactKit, /# AI 会话公开化模板/, "artifact template has a clear title");
assert.match(files.artifactKit, /最后一次验证时间/, "artifact template asks for verification time");
assert.match(files.artifactKit, /不能公开的边界/, "artifact template asks for public boundaries");
assert.match(files.evidencePack, /# Trace Atlas 证据包/, "evidence pack has a clear title");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/launch/, "evidence pack links to the launch page");
assert.match(files.evidencePack, /npm run check/, "evidence pack includes the local verification command");
assert.match(files.evidencePack, /不公开 token/, "evidence pack states public boundaries");
assert.doesNotMatch(Object.values(files).join("\n"), /\bTODO\b/i, "no TODO markers remain");

const manifest = JSON.parse(files.manifest);
assert.equal(manifest.name, "Trace Atlas 痕迹星图");
assert.equal(manifest.display, "standalone");
assert.equal(manifest.icons[0].src, "./icon.svg");

const ledger = JSON.parse(files.ledger);
assert.equal(ledger.name, "Trace Atlas 来路账本");
assert.ok(ledger.entries.length >= 6, "provenance ledger lists verified milestones");
const gitLog = execFileSync("git", ["log", "--oneline"], { encoding: "utf8" });
for (const entry of ledger.entries) {
  assert.match(entry.commit, /^[0-9a-f]{7,40}$/, `ledger commit ${entry.title} is a short hash`);
  assert.match(gitLog, new RegExp(`^${entry.commit}\\b`, "m"), `ledger commit ${entry.commit} exists in git history`);
  assert.ok(entry.summary.length > 20, `ledger entry ${entry.commit} has a useful summary`);
}

const timeline = JSON.parse(files.timeline);
assert.equal(timeline.name, "Trace Atlas 进展时间线");
assert.ok(timeline.items.length >= 8, "progress timeline lists the reader-facing path");
for (const item of timeline.items) {
  assert.match(item.phase, /^[0-9]{2}$/, `timeline phase ${item.title} has a readable number`);
  assert.ok(item.summary.length > 24, `timeline item ${item.title} has a useful summary`);
  assert.match(item.evidenceHref, /^https:\/\/(github\.com|trace-atlas-codex\.pages\.dev)\//, `timeline evidence ${item.title} is public https`);
}

const sync = JSON.parse(files.sync);
assert.equal(sync.name, "Trace Atlas 世界同步");
assert.equal(sync.status, "公开");
assert.equal(sync.links.length, 6);
for (const link of sync.links) {
  assert.match(link.href, /^https:\/\/(github\.com|soya-xx\.github\.io|trace-atlas-codex\.pages\.dev)\//, `sync link ${link.label} is public https`);
  assert.ok(link.note.length > 8, `sync link ${link.label} has a useful note`);
}

const seedIds = Array.from(files.js.matchAll(/id: "([^"]+)"/g)).map((match) => match[1]);
for (const id of ["agency-granted", "strong-verification", "playful-proof", "living-artifact"]) {
  assert.ok(seedIds.includes(id), `seed ${id} exists`);
}

console.log("Trace Atlas verification passed.");
