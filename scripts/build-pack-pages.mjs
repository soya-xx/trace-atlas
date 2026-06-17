import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const PACKS_PATH = "materials-packs.json";
const BASE_URL = "https://trace-atlas-codex.pages.dev";

const PACK_ROUTES = {
  read: {
    slug: "pack-read",
    eyebrow: "READ PACK / 阅读了解",
    accent: "#25785e",
    secondary: "#386fb0",
    audience: "第一次打开 Trace Atlas 的读者"
  },
  publish: {
    slug: "pack-publish",
    eyebrow: "PUBLISH PACK / 发帖发布",
    accent: "#386fb0",
    secondary: "#c9961a",
    audience: "准备发布或转述这个项目的人"
  },
  reuse: {
    slug: "pack-reuse",
    eyebrow: "REUSE PACK / 复用接力",
    accent: "#101113",
    secondary: "#25785e",
    audience: "想把流程迁移到新会话的人"
  },
  verify: {
    slug: "pack-verify",
    eyebrow: "VERIFY PACK / 验证维护",
    accent: "#c9961a",
    secondary: "#386fb0",
    audience: "需要复核公开状态的维护者"
  }
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeSvg(value) {
  return escapeHtml(value).replaceAll("'", "&apos;");
}

function pathFor(pack, extension) {
  return `${PACK_ROUTES[pack.id].slug}.${extension}`;
}

function cardPathFor(pack) {
  return `promo/${PACK_ROUTES[pack.id].slug}-card.svg`;
}

function externalUrlFor(pack) {
  return `${BASE_URL}/${PACK_ROUTES[pack.id].slug}`;
}

function splitLine(text, maxLength) {
  const words = String(text).split("");
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line.length >= maxLength && /[，。；、\s]/.test(word)) {
      lines.push(line.trim());
      line = "";
      continue;
    }
    line += word;
    if (line.length >= maxLength) {
      lines.push(line.trim());
      line = "";
    }
  }
  if (line.trim()) {
    lines.push(line.trim());
  }
  return lines.slice(0, 3);
}

function renderPrimaryLinks(pack) {
  return [
    ["材料选择器", "./materials-guide.html"],
    ["材料总览", "./materials.html"],
    ["行动包 JSON", "./materials-packs.json"],
    ["分享卡", `./${cardPathFor(pack)}`],
    ["打开主作品", "./"],
    ["工作日志", "https://github.com/soya-xx/trace-atlas/issues/1"]
  ]
    .map(([label, href]) => `<a href="${href}">${label}</a>`)
    .join("\n          ");
}

function renderItem(item) {
  return `          <article class="pack-item">
            <p class="eyebrow">${escapeHtml(item.kind)} / ${escapeHtml(item.format)}</p>
            <h2>${escapeHtml(item.label)}</h2>
            <p>受众：${escapeHtml(item.audience)}</p>
            <a href="${escapeHtml(item.href)}">打开材料</a>
          </article>`;
}

function renderPage(pack) {
  const route = PACK_ROUTES[pack.id];
  assert.ok(route, `${pack.id} needs route metadata`);
  const title = `Trace Atlas ${pack.title}`;
  const url = externalUrlFor(pack);
  const cardPath = `${BASE_URL}/${cardPathFor(pack)}`;
  const markdownJson = JSON.stringify(pack.markdown);
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="${route.accent}">
    <meta name="description" content="${escapeHtml(pack.summary)}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="zh_CN">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(pack.action)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${cardPath}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(pack.summary)}">
    <meta name="twitter:image" content="${cardPath}">
    <title>${escapeHtml(title)}</title>
    <link rel="icon" href="./icon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="./launch.css?v=13">
  </head>
  <body>
    <main class="launch-shell pack-shell" aria-labelledby="pack-title">
      <section class="intro route-intro">
        <p class="eyebrow">${route.eyebrow}</p>
        <h1 id="pack-title">${escapeHtml(pack.title)}</h1>
        <p class="lead">${escapeHtml(pack.summary)} ${escapeHtml(pack.action)}</p>
        <div class="primary-links" aria-label="行动包入口">
          ${renderPrimaryLinks(pack)}
        </div>
      </section>

      <section class="pack-hero" aria-label="行动包摘要">
        <article class="pack-copy-panel">
          <p class="eyebrow">可以直接带走</p>
          <h2>${pack.itemCount} 个材料</h2>
          <p>这页只整理公开链接。复制后得到 Markdown 清单，适合发帖、复核或带到另一个会话继续加工。</p>
          <button id="copy-pack-page" class="copy-button" type="button">复制这个行动包</button>
          <p id="pack-status" class="copy-status" aria-live="polite">行动包已准备好。</p>
        </article>
        <article class="pack-visual">
          <img src="./${cardPathFor(pack)}" alt="Trace Atlas ${escapeHtml(pack.title)}分享卡">
          <a href="./${cardPathFor(pack)}">打开分享卡</a>
        </article>
      </section>

      <section class="guide-results" aria-labelledby="pack-list-title">
        <div class="guide-results-head">
          <div>
            <p class="eyebrow">材料清单</p>
            <h2 id="pack-list-title">按当前任务打开</h2>
          </div>
          <a href="${url}">${url}</a>
        </div>
        <div class="pack-list">
${pack.items.map(renderItem).join("\n")}
        </div>
      </section>
    </main>
    <script id="pack-markdown" type="application/json">${markdownJson}</script>
    <script src="./pack-page.js?v=1"></script>
  </body>
</html>
`;
}

function renderCard(pack) {
  const route = PACK_ROUTES[pack.id];
  const titleLines = splitLine(pack.title, 11);
  const summaryLines = splitLine(pack.summary, 25);
  const actionLines = splitLine(pack.action, 24);
  const url = externalUrlFor(pack).replace("https://", "");
  const [domain, routePath] = url.split(/(?=\/pack-)/);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
  <title id="title">Trace Atlas ${escapeSvg(pack.title)}分享卡</title>
  <desc id="desc">${escapeSvg(pack.summary)}</desc>
  <defs>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#d6ddd8" stroke-width="1" opacity="0.72"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#fbfbf8"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect x="42" y="42" width="1116" height="546" rx="8" fill="#ffffff" stroke="#101113" stroke-width="3"/>
  <rect x="78" y="78" width="238" height="48" rx="8" fill="${route.accent}"/>
  <text x="100" y="111" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="900">${escapeSvg(route.eyebrow.split("/")[0].trim())}</text>
  <text x="78" y="188" fill="#101113" font-family="Inter, system-ui, sans-serif" font-size="78" font-weight="950">${titleLines.map((line, index) => `<tspan x="78" dy="${index === 0 ? 0 : 86}">${escapeSvg(line)}</tspan>`).join("")}</text>
  <text x="78" y="388" fill="#606763" font-family="Inter, system-ui, sans-serif" font-size="31" font-weight="760">${summaryLines.map((line, index) => `<tspan x="78" dy="${index === 0 ? 0 : 42}">${escapeSvg(line)}</tspan>`).join("")}</text>
  <g transform="translate(792 106)">
    <rect width="288" height="288" rx="8" fill="${route.accent}" opacity="0.96"/>
    <circle cx="88" cy="88" r="48" fill="#ffffff" opacity="0.92"/>
    <circle cx="200" cy="96" r="30" fill="${route.secondary}"/>
    <path d="M 76 198 C 120 132 178 144 220 204" fill="none" stroke="#ffffff" stroke-width="18" stroke-linecap="round"/>
    <text x="42" y="258" fill="#ffffff" font-family="Inter, system-ui, sans-serif" font-size="32" font-weight="950">${pack.itemCount} LINKS</text>
  </g>
  <text x="78" y="520" fill="#101113" font-family="Inter, system-ui, sans-serif" font-size="27" font-weight="860">${actionLines.map((line, index) => `<tspan x="78" dy="${index === 0 ? 0 : 36}">${escapeSvg(line)}</tspan>`).join("")}</text>
  <text x="792" y="508" fill="${route.accent}" font-family="Inter, system-ui, sans-serif" font-size="25" font-weight="950">${escapeSvg(domain)}</text>
  <text x="792" y="548" fill="#101113" font-family="Inter, system-ui, sans-serif" font-size="31" font-weight="950">${escapeSvg(routePath)}</text>
</svg>
`;
}

const payload = JSON.parse(readFileSync(PACKS_PATH, "utf8"));
assert.equal(payload.publicOnly, true, "pack pages must use public packs");
assert.equal(payload.counts.packs, 4, "expected four packs");

const outputs = new Map();
for (const pack of payload.packs) {
  outputs.set(pathFor(pack, "html"), renderPage(pack));
  outputs.set(cardPathFor(pack), renderCard(pack));
}

if (process.argv.includes("--check")) {
  for (const [path, output] of outputs) {
    assert.equal(readFileSync(path, "utf8"), output, `${path} is out of date`);
  }
} else {
  for (const [path, output] of outputs) {
    writeFileSync(path, output);
  }
}
