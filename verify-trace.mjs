import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = {
  html: readFileSync("index.html", "utf8"),
  packageJson: readFileSync("package.json", "utf8"),
  startHtml: readFileSync("start.html", "utf8"),
  reuseHtml: readFileSync("reuse.html", "utf8"),
  launchHtml: readFileSync("launch.html", "utf8"),
  materialsHtml: readFileSync("materials.html", "utf8"),
  materialsGuideHtml: readFileSync("materials-guide.html", "utf8"),
  materialsGuideJs: readFileSync("materials-guide.js", "utf8"),
  preflightHtml: readFileSync("preflight.html", "utf8"),
  preflightJs: readFileSync("preflight.js", "utf8"),
  feedbackHtml: readFileSync("feedback.html", "utf8"),
  feedbackJs: readFileSync("feedback.js", "utf8"),
  feedbackRecords: readFileSync("feedback-records.json", "utf8"),
  packPageJs: readFileSync("pack-page.js", "utf8"),
  packReadHtml: readFileSync("pack-read.html", "utf8"),
  packPublishHtml: readFileSync("pack-publish.html", "utf8"),
  packReuseHtml: readFileSync("pack-reuse.html", "utf8"),
  packVerifyHtml: readFileSync("pack-verify.html", "utf8"),
  monumentHtml: readFileSync("monument.html", "utf8"),
  launchCss: readFileSync("launch.css", "utf8"),
  launchJs: readFileSync("launch.js", "utf8"),
  workflowHtml: readFileSync("workflow.html", "utf8"),
  css: readFileSync("styles.css", "utf8"),
  js: readFileSync("app.js", "utf8"),
  evidencePack: readFileSync("evidence-pack.md", "utf8"),
  ledger: readFileSync("trace-ledger.json", "utf8"),
  timeline: readFileSync("progress-timeline.json", "utf8"),
  timelineSource: readFileSync("progress-timeline-source.json", "utf8"),
  sync: readFileSync("world-sync.json", "utf8"),
  publicHealth: readFileSync("public-health.json", "utf8"),
  materialsIndex: readFileSync("materials-index.json", "utf8"),
  materialsApi: readFileSync("materials-api.json", "utf8"),
  materialsPacks: readFileSync("materials-packs.json", "utf8"),
  publishRecordTemplate: readFileSync("publish-record-template.json", "utf8"),
  reuseMap: readFileSync("reuse-map.json", "utf8"),
  verificationSummary: readFileSync("verification-summary.md", "utf8"),
  socialCard: readFileSync("social-card.svg", "utf8"),
  healthBadge: readFileSync("public-health-badge.svg", "utf8"),
  packReadCard: readFileSync("promo/pack-read-card.svg", "utf8"),
  packPublishCard: readFileSync("promo/pack-publish-card.svg", "utf8"),
  packReuseCard: readFileSync("promo/pack-reuse-card.svg", "utf8"),
  packVerifyCard: readFileSync("promo/pack-verify-card.svg", "utf8"),
  feedbackRankCard: readFileSync("promo/feedback-rank-card.svg", "utf8"),
  feedbackRankPoster: readFileSync("promo/feedback-rank-poster.html", "utf8"),
  feedbackRankPosterPng: readFileSync("promo/feedback-rank-poster.png"),
  artifactKit: readFileSync("templates/ai-session-artifact-kit.md", "utf8"),
  quickstart: readFileSync("templates/ai-session-public-quickstart.md", "utf8"),
  xhsCover: readFileSync("promo/xhs-cover.html", "utf8"),
  xhsCoverPng: readFileSync("promo/xhs-cover.png"),
  reuseFlowCard: readFileSync("promo/reuse-flow-card.html", "utf8"),
  reuseFlowCardPng: readFileSync("promo/reuse-flow-card.png"),
  workflowCard: readFileSync("promo/workflow-card.html", "utf8"),
  workflowCardPng: readFileSync("promo/workflow-card.png"),
  xhsLaunchKit: readFileSync("promo/xhs-launch-kit.md", "utf8"),
  xhsPostDrafts: readFileSync("promo/xhs-post-drafts.md", "utf8"),
  xhsFeedbackLoop: readFileSync("promo/xhs-feedback-loop-template.md", "utf8"),
  xhsPublishChecklist: readFileSync("promo/xhs-publish-checklist.md", "utf8"),
  xhsPublishManifest: readFileSync("promo/xhs-publish-manifest.json", "utf8"),
  xhsPublishReport: readFileSync("promo/xhs-publish-report.md", "utf8"),
  materialsApiScript: readFileSync("scripts/build-materials-api.mjs", "utf8"),
  materialsPacksScript: readFileSync("scripts/build-materials-packs.mjs", "utf8"),
  packPagesScript: readFileSync("scripts/build-pack-pages.mjs", "utf8"),
  publishReportScript: readFileSync("scripts/build-publish-report.mjs", "utf8"),
  progressTimelineScript: readFileSync("scripts/build-progress-timeline.mjs", "utf8"),
  verificationSummaryScript: readFileSync("scripts/build-verification-summary.mjs", "utf8"),
  publicBoundaryScript: readFileSync("scripts/scan-public-boundary.mjs", "utf8"),
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
  "health-title",
  "health-status",
  "health-summary",
  "health-counts",
  "health-checks",
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
assert.match(files.html, /href="\.\/start\.html"/, "main page links to the reusable start page");
assert.match(files.html, /href="\.\/templates\/ai-session-artifact-kit\.md"/, "artifact kit is linked from the page");
assert.match(files.html, /href="\.\/templates\/ai-session-public-quickstart\.md"/, "quickstart checklist is linked from the page");
assert.match(files.html, /id="copy-kit"/, "artifact kit can be copied from the page");
assert.match(files.html, /id="timeline-title"/, "progress timeline section is present");
assert.match(files.launchHtml, /Trace Atlas 发布材料/, "launch page has a clear title");
assert.match(files.launchHtml, /public-health\.json/, "launch page links to public health data");
assert.match(files.launchHtml, /start\.html/, "launch page links to the reusable start page");
assert.match(files.launchHtml, /reuse\.html/, "launch page links to the reuse route page");
assert.match(files.launchHtml, /templates\/ai-session-public-quickstart\.md/, "launch page links to the quickstart checklist");
assert.match(files.launchHtml, /materials\.html/, "launch page links to the public materials overview");
assert.match(files.launchHtml, /monument\.html/, "launch page links to the project monument");
assert.match(files.launchHtml, /promo\/xhs-cover\.png/, "launch page shows the Xiaohongshu cover");
assert.match(files.launchHtml, /promo\/workflow-card\.png/, "launch page shows the workflow card");
assert.match(files.launchHtml, /promo\/reuse-flow-card\.png/, "launch page shows the reuse flow card");
assert.match(files.launchHtml, /social-card\.svg/, "launch page shows the social card");
assert.match(files.launchHtml, /public-health-badge\.svg/, "launch page shows the public health badge");
assert.match(files.launchHtml, /feedback\.html/, "launch page links to the feedback dashboard");
assert.match(files.launchHtml, /promo\/feedback-rank-card\.svg/, "launch page shows the feedback rank card");
assert.match(files.launchHtml, /promo\/feedback-rank-poster\.png/, "launch page shows the feedback rank poster");
assert.match(files.launchHtml, /35 个公开入口/, "launch page shows the updated public entry count");
assert.match(files.launchHtml, /11 张核心图/, "launch page shows the updated visual asset count");
assert.match(files.launchHtml, /10 个验证脚本/, "launch page shows the updated verification script count");
assert.match(files.launchHtml, /templates\/ai-session-artifact-kit\.md/, "launch page links to the reusable template");
assert.match(files.launchHtml, /promo\/xhs-post-drafts\.md/, "launch page links to the Xiaohongshu post drafts");
assert.match(files.launchHtml, /promo\/xhs-feedback-loop-template\.md/, "launch page links to the Xiaohongshu feedback loop template");
assert.match(files.launchHtml, /promo\/xhs-publish-checklist\.md/, "launch page links to the publish checklist");
assert.match(files.launchHtml, /promo\/xhs-publish-manifest\.json/, "launch page links to the publish manifest");
assert.match(files.launchHtml, /promo\/xhs-publish-report\.md/, "launch page links to the publish report");
assert.match(files.launchHtml, /preflight\.html/, "launch page links to the preflight page");
assert.match(files.launchHtml, /verification-summary\.md/, "launch page links to the verification summary");
assert.match(files.launchHtml, /evidence-pack\.md/, "launch page links to the evidence pack");
assert.match(files.launchHtml, /workflow\.html/, "launch page links to the workflow map");
assert.match(files.launchHtml, /materials-guide\.html/, "launch page links to the materials guide");
assert.match(files.launchHtml, /pack-publish\.html/, "launch page links to the publish action pack");
assert.match(files.launchHtml, /promo\/pack-publish-card\.svg/, "launch page links to an action pack share card");
assert.match(files.launchHtml, /href="\.\/launch\.css\?v=12"/, "launch page stylesheet URL is versioned");
assert.match(files.launchHtml, /src="\.\/launch\.js\?v=1"/, "launch page script URL is versioned");
assert.match(files.launchHtml, /data-copy="我把AI会话做成网站"/, "launch page can copy the selected title");
assert.match(files.launchHtml, /id="copy-status"/, "launch page exposes copy status feedback");
assert.match(files.launchHtml, /#AI工作流/, "launch page exposes recommended tags");
assert.match(files.launchCss, /\.asset-grid/, "launch page asset grid is styled");
assert.match(files.launchCss, /\.copy-button/, "launch page copy buttons are styled");
assert.match(files.launchCss, /\.copy-status/, "launch page copy status is styled");
assert.match(files.launchCss, /\.route-map/, "workflow route map is styled");
assert.match(files.launchCss, /\.reuse-flow/, "reuse route flow is styled");
assert.match(files.launchCss, /\.reuse-step/, "reuse route steps are styled");
assert.match(files.launchCss, /\.guide-list/, "materials guide result grid is styled");
assert.match(files.launchCss, /\.filter-button\[aria-pressed="true"\]/, "materials guide active filter is styled");
assert.match(files.launchCss, /\.pack-hero/, "action pack page hero is styled");
assert.match(files.launchCss, /\.pack-list/, "action pack page list is styled");
assert.match(files.launchCss, /\.preflight-list/, "preflight result list is styled");
assert.match(files.launchCss, /\.state-pill/, "preflight state pill is styled");
assert.match(files.launchCss, /\.publish-record/, "publish record panel is styled");
assert.match(files.launchCss, /\.record-grid/, "publish record form grid is styled");
assert.match(files.launchCss, /\.feedback-board/, "feedback dashboard board is styled");
assert.match(files.launchCss, /\.rank-list/, "feedback dashboard rank list is styled");
assert.match(files.launchCss, /\.feedback-summary/, "feedback dashboard summary is styled");
assert.match(files.launchCss, /\.handoff-grid/, "workflow handoff grid is styled");
assert.match(files.launchCss, /\.health-grid/, "launch page health grid is styled");
assert.match(files.launchCss, /\.materials-grid/, "materials overview grid is styled");
assert.match(files.launchCss, /overflow-x: hidden/, "launch page prevents horizontal overflow");
assert.doesNotMatch(files.launchCss, /letter-spacing:\s*-/i, "launch page letter spacing is not negative");
assert.match(files.materialsHtml, /Trace Atlas 公开材料总览/, "materials overview page has a clear title");
assert.match(files.materialsHtml, /start\.html/, "materials overview page links to the reusable start page");
assert.match(files.materialsHtml, /reuse\.html/, "materials overview page links to the reuse route page");
assert.match(files.materialsHtml, /materials-guide\.html/, "materials overview page links to the materials guide");
assert.match(files.materialsHtml, /materials-index\.json/, "materials overview page links to machine-readable index");
assert.match(files.materialsHtml, /materials-api\.json/, "materials overview page links to materials API");
assert.match(files.materialsHtml, /preflight\.html/, "materials overview page links to the preflight page");
assert.match(files.materialsHtml, /feedback\.html/, "materials overview page links to the feedback dashboard");
assert.match(files.materialsHtml, /pack-read\.html/, "materials overview page links to the read action pack");
assert.match(files.materialsHtml, /pack-publish\.html/, "materials overview page links to the publish action pack");
assert.match(files.materialsHtml, /pack-reuse\.html/, "materials overview page links to the reuse action pack");
assert.match(files.materialsHtml, /pack-verify\.html/, "materials overview page links to the verify action pack");
assert.match(files.materialsHtml, /promo\/pack-publish-card\.svg/, "materials overview page links to an action pack card");
assert.match(files.materialsHtml, /promo\/feedback-rank-card\.svg/, "materials overview page links to the feedback rank card");
assert.match(files.materialsHtml, /promo\/feedback-rank-poster\.png/, "materials overview page links to the feedback rank poster");
assert.match(files.materialsHtml, /边界扫描脚本/, "materials overview page links boundary scan");
assert.match(files.materialsHtml, /monument\.html/, "materials overview page links to the project monument");
assert.match(files.materialsHtml, /promo\/xhs-post-drafts\.md/, "materials overview page links to the Xiaohongshu post drafts");
assert.match(files.materialsHtml, /promo\/xhs-feedback-loop-template\.md/, "materials overview page links to the Xiaohongshu feedback loop template");
assert.match(files.materialsHtml, /public-health-badge\.svg/, "materials overview page links to the public health badge");
assert.match(files.materialsHtml, /promo\/reuse-flow-card\.png/, "materials overview page links to the reuse flow card");
assert.match(files.materialsHtml, /verification-summary\.md/, "materials overview page links to the verification summary");
assert.match(files.materialsHtml, /build-verification-summary\.mjs/, "materials overview page links to the verification summary script");
assert.match(files.materialsHtml, /progress-timeline-source\.json/, "materials overview page links to the progress timeline source");
assert.match(files.materialsHtml, /build-progress-timeline\.mjs/, "materials overview page links to the progress timeline script");
assert.match(files.materialsHtml, /build-materials-api\.mjs/, "materials overview page links to the materials API script");
assert.match(files.materialsHtml, /build-pack-pages\.mjs/, "materials overview page links to the pack page script");
assert.match(files.materialsHtml, /templates\/ai-session-public-quickstart\.md/, "materials overview page links to the quickstart checklist");
assert.match(files.materialsHtml, /reuse-map\.json/, "materials overview page links to the reuse map");
assert.match(files.materialsHtml, /feedback-records\.json/, "materials overview page links to feedback records data");
assert.match(files.materialsHtml, /href="\.\/launch\.css\?v=12"/, "materials overview stylesheet URL is versioned");
assert.match(files.materialsGuideHtml, /Trace Atlas 材料选择器/, "materials guide page has a clear title");
assert.match(files.materialsGuideHtml, /materials-api\.json/, "materials guide links to materials API");
assert.match(files.materialsGuideHtml, /id="copy-pack"/, "materials guide can copy the active pack");
assert.match(files.materialsGuideHtml, /id="pack-summary"/, "materials guide shows the active pack summary");
assert.match(files.materialsGuideHtml, /data-filter="publish"/, "materials guide has a publish filter");
assert.match(files.materialsGuideHtml, /data-filter="reuse"/, "materials guide has a reuse filter");
assert.match(files.materialsGuideHtml, /data-filter="verify"/, "materials guide has a verify filter");
assert.match(files.materialsGuideHtml, /id="guide-list"/, "materials guide exposes a result list");
assert.match(files.materialsGuideHtml, /src="\.\/materials-guide\.js\?v=1"/, "materials guide script URL is versioned");
assert.match(files.materialsGuideHtml, /href="\.\/launch\.css\?v=12"/, "materials guide stylesheet URL is versioned");
assert.match(files.materialsGuideJs, /materials-api\.json/, "materials guide script reads the materials API");
assert.match(files.materialsGuideJs, /materials-packs\.json/, "materials guide script reads materials packs");
assert.match(files.materialsGuideJs, /copyCurrentPack/, "materials guide script can copy the active pack");
assert.match(files.materialsGuideJs, /data-filter/, "materials guide script wires filter buttons");
assert.match(files.materialsGuideJs, /navigator\.clipboard/, "materials guide script can copy links");
assert.match(files.materialsGuideJs, /document\.execCommand\("copy"\)/, "materials guide script has a copy fallback");
assert.match(files.preflightHtml, /Trace Atlas 发布前自检/, "preflight page has a clear title");
assert.match(files.preflightHtml, /id="preflight-list"/, "preflight page exposes a result list");
assert.match(files.preflightHtml, /id="copy-preflight"/, "preflight page can copy the report");
assert.match(files.preflightHtml, /src="\.\/preflight\.js\?v=5"/, "preflight page script URL is versioned");
assert.match(files.preflightHtml, /href="\.\/launch\.css\?v=12"/, "preflight page stylesheet URL is versioned");
assert.match(files.preflightHtml, /feedback\.html/, "preflight page links to the feedback dashboard");
assert.match(files.preflightHtml, /id="copy-record"/, "preflight page can copy the publish record");
assert.match(files.preflightHtml, /id="copy-record-json"/, "preflight page can copy publish record JSON");
assert.match(files.preflightHtml, /id="publish-record-output"/, "preflight page renders a publish record preview");
assert.match(files.preflightHtml, /id="publish-record-json-output"/, "preflight page renders publish record JSON");
assert.match(files.preflightHtml, /id="record-history"/, "preflight page accepts historical publish records");
assert.match(files.preflightHtml, /id="feedback-rank-output"/, "preflight page renders feedback rankings");
assert.match(files.preflightHtml, /id="record-url"/, "preflight page records the Xiaohongshu URL locally");
assert.match(files.preflightHtml, /id="record-feedback"/, "preflight page records comment feedback locally");
assert.match(files.preflightJs, /pack-publish\.html/, "preflight script checks the publish action pack page");
assert.match(files.preflightJs, /pack-publish-card\.svg/, "preflight script checks the publish action pack card");
assert.match(files.preflightJs, /feedback\.html/, "preflight script checks the feedback dashboard");
assert.match(files.preflightJs, /feedback-rank-card\.svg/, "preflight script checks the feedback rank card");
assert.match(files.preflightJs, /feedback-rank-poster\.png/, "preflight script checks the feedback rank poster");
assert.match(files.preflightJs, /feedback-records\.json/, "preflight script checks feedback records data");
assert.match(files.preflightJs, /arrayBuffer/, "preflight script can check binary assets");
assert.match(files.preflightJs, /materials-api\.json/, "preflight script checks the materials API");
assert.match(files.preflightJs, /materials-packs\.json/, "preflight script checks the materials packs");
assert.match(files.preflightJs, /publish-record-template\.json/, "preflight script checks the publish record JSON template");
assert.match(files.preflightJs, /verification-summary\.md/, "preflight script checks the verification summary");
assert.match(files.preflightJs, /copyReport/, "preflight script can copy the generated report");
assert.match(files.preflightJs, /buildPublishRecord/, "preflight script builds the publish record");
assert.match(files.preflightJs, /buildPublishRecordData/, "preflight script builds structured publish record data");
assert.match(files.preflightJs, /copyPublishRecord/, "preflight script can copy the publish record");
assert.match(files.preflightJs, /copyPublishRecordJson/, "preflight script can copy publish record JSON");
assert.match(files.preflightJs, /buildFeedbackRank/, "preflight script builds feedback rankings");
assert.match(files.preflightJs, /parseHistoryRecords/, "preflight script parses historical publish records");
assert.match(files.preflightJs, /Trace Atlas 发布记录/, "preflight script outputs a publish record template");
assert.match(files.preflightJs, /小红书链接/, "preflight script records the Xiaohongshu link");
assert.match(files.preflightJs, /navigator\.clipboard/, "preflight script can copy via clipboard API");
assert.match(files.preflightJs, /document\.execCommand\("copy"\)/, "preflight script has a copy fallback");
assert.match(files.feedbackHtml, /Trace Atlas 反馈问题榜/, "feedback dashboard has a clear title");
assert.match(files.feedbackHtml, /feedback-records\.json/, "feedback dashboard links to feedback records data");
assert.match(files.feedbackHtml, /promo\/feedback-rank-card\.svg/, "feedback dashboard links to its share card");
assert.match(files.feedbackHtml, /id="question-rank"/, "feedback dashboard renders question rankings");
assert.match(files.feedbackHtml, /id="next-rank"/, "feedback dashboard renders next-step rankings");
assert.match(files.feedbackHtml, /id="copy-feedback-board"/, "feedback dashboard can copy the generated board");
assert.match(files.feedbackHtml, /id="feedback-json-input"/, "feedback dashboard accepts local JSON input");
assert.match(files.feedbackHtml, /src="\.\/feedback\.js\?v=2"/, "feedback dashboard script URL is versioned");
assert.match(files.feedbackHtml, /href="\.\/launch\.css\?v=12"/, "feedback dashboard stylesheet URL is versioned");
assert.match(files.feedbackJs, /feedback-records\.json/, "feedback script reads feedback records data");
assert.match(files.feedbackJs, /countItems/, "feedback script counts repeated feedback");
assert.match(files.feedbackJs, /parseRecords/, "feedback script parses local JSON input");
assert.match(files.feedbackJs, /buildMarkdown/, "feedback script builds a copyable markdown board");
assert.match(files.feedbackJs, /navigator\.clipboard/, "feedback script can copy via clipboard API");
assert.match(files.feedbackJs, /document\.execCommand\("copy"\)/, "feedback script has a copy fallback");
assert.match(files.packPageJs, /#copy-pack-page/, "pack page script wires the copy button");
assert.match(files.packPageJs, /#pack-markdown/, "pack page script reads embedded markdown");
assert.match(files.packPageJs, /navigator\.clipboard/, "pack page script can copy via clipboard API");
assert.match(files.packPageJs, /document\.execCommand\("copy"\)/, "pack page script has a copy fallback");
for (const [name, html, cardPath, title] of [
  ["read", files.packReadHtml, "promo/pack-read-card.svg", "阅读了解包"],
  ["publish", files.packPublishHtml, "promo/pack-publish-card.svg", "发帖发布包"],
  ["reuse", files.packReuseHtml, "promo/pack-reuse-card.svg", "复用接力包"],
  ["verify", files.packVerifyHtml, "promo/pack-verify-card.svg", "验证维护包"]
]) {
  assert.match(html, new RegExp(`<h1 id="pack-title">${title}</h1>`), `${name} pack page has a clear title`);
  assert.match(html, /id="copy-pack-page"/, `${name} pack page can copy its markdown`);
  assert.match(html, /id="pack-markdown" type="application\/json"/, `${name} pack page embeds markdown data`);
  assert.match(html, new RegExp(cardPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${name} pack page links its share card`);
  assert.match(html, /src="\.\/pack-page\.js\?v=1"/, `${name} pack page loads copy script`);
  assert.match(html, /href="\.\/launch\.css\?v=12"/, `${name} pack page stylesheet URL is versioned`);
  assert.match(html, /https:\/\/trace-atlas-codex\.pages\.dev\/pack-/, `${name} pack page exposes its public URL`);
}
assert.match(files.startHtml, /Trace Atlas 从这里开始复用/, "start page has a clear title");
assert.match(files.startHtml, /templates\/ai-session-public-quickstart\.md/, "start page links to the quickstart checklist");
assert.match(files.startHtml, /templates\/ai-session-artifact-kit\.md/, "start page links to the full template");
assert.match(files.startHtml, /reuse\.html/, "start page links to the reuse route page");
assert.match(files.startHtml, /evidence-pack\.md/, "start page links to the evidence pack");
assert.match(files.startHtml, /public-health\.json/, "start page links to public health data");
assert.match(files.startHtml, /promo\/xhs-feedback-loop-template\.md/, "start page links to the feedback loop template");
assert.match(files.startHtml, /reuse-map\.json/, "start page links to the reuse map");
assert.match(files.startHtml, /href="\.\/launch\.css\?v=12"/, "start page stylesheet URL is versioned");
assert.match(files.reuseHtml, /Trace Atlas 复用路线/, "reuse route page has a clear title");
assert.match(files.reuseHtml, /promo\/reuse-flow-card\.png/, "reuse route page shows the reuse flow card");
assert.match(files.reuseHtml, /reuse-map\.json/, "reuse route page links to the reuse map");
assert.match(files.reuseHtml, /templates\/ai-session-public-quickstart\.md/, "reuse route page links to the quickstart checklist");
assert.match(files.reuseHtml, /templates\/ai-session-artifact-kit\.md/, "reuse route page links to the full template");
assert.match(files.reuseHtml, /evidence-pack\.md/, "reuse route page links to the evidence pack");
assert.match(files.reuseHtml, /public-health\.json/, "reuse route page links to public health data");
assert.match(files.reuseHtml, /promo\/xhs-feedback-loop-template\.md/, "reuse route page links to the feedback loop template");
assert.match(files.reuseHtml, /href="\.\/launch\.css\?v=12"/, "reuse route page stylesheet URL is versioned");
assert.match(files.monumentHtml, /Trace Atlas 项目纪念碑/, "project monument has a clear title");
assert.match(files.monumentHtml, /把好意变成证据/, "project monument explains the core intent");
assert.match(files.monumentHtml, /公开的是负责的部分/, "project monument explains public boundaries");
assert.match(files.monumentHtml, /href="\.\/launch\.css\?v=12"/, "project monument stylesheet URL is versioned");
assert.match(files.workflowHtml, /Trace Atlas 公开化路线图/, "workflow page has a clear title");
assert.match(files.workflowHtml, /reuse\.html/, "workflow page links to the reuse route page");
assert.match(files.workflowHtml, /定下产物/, "workflow page names the artifact step");
assert.match(files.workflowHtml, /画清边界/, "workflow page names the boundary step");
assert.match(files.workflowHtml, /留下证据/, "workflow page names the evidence step");
assert.match(files.workflowHtml, /写成模板/, "workflow page names the template step");
assert.match(files.workflowHtml, /social-card\.svg/, "workflow page uses the social card visual");
assert.match(files.workflowHtml, /property="og:image" content="https:\/\/trace-atlas-codex\.pages\.dev\/promo\/workflow-card\.png"/, "workflow page social preview uses the workflow card");
assert.match(files.workflowHtml, /href="\.\/launch\.css\?v=12"/, "workflow page stylesheet URL is versioned");
assert.match(files.launchJs, /navigator\.clipboard/, "launch page clipboard API path is present");
assert.match(files.launchJs, /document\.execCommand\("copy"\)/, "launch page clipboard fallback path is present");
assert.match(files.launchJs, /\[data-copy\]/, "launch page copy buttons are delegated");
assert.match(files.launchJs, /#copy-status/, "launch page copy status is wired");
assert.match(files.css, /@media \(max-width: 860px\)/, "mobile layout breakpoint is present");
assert.match(files.css, /min-height: 100dvh/, "viewport height is anchored");
assert.match(files.css, /overflow-x: hidden/, "page prevents horizontal overflow on mobile");
assert.match(files.css, /max-width: 100vw/, "app shell is capped to the viewport width");
assert.match(files.css, /min-width: 0/, "grid children can shrink inside narrow viewports");
assert.match(files.css, /\.health-counts/, "public health counts are styled");
assert.match(files.css, /\.health-checks/, "public health checks are styled");
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
assert.match(files.js, /function renderPublicHealth/, "public health renderer is wired");
assert.match(files.js, /public-health\.json\?\$\{DATA_VERSION\}/, "public health data is loaded with a versioned URL");
assert.match(files.js, /function renderTimeline/, "progress timeline renderer is wired");
assert.match(files.js, /progress-timeline\.json\?\$\{DATA_VERSION\}/, "progress timeline data is loaded with a versioned URL");
assert.match(files.js, /items\.slice\(-9\)/, "progress timeline shows the latest milestones");
assert.match(files.js, /safePublicHref/, "timeline evidence links are constrained");
assert.match(files.js, /DATA_VERSION = "v=9"/, "JSON data requests are versioned");
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
assert.match(files.serviceWorker, /CACHE_NAME = "trace-atlas-shell-v44"/, "service worker cache is versioned");
assert.match(files.html, /href="\.\/styles\.css\?v=13"/, "stylesheet URL is versioned");
assert.match(files.html, /src="\.\/app\.js\?v=16"/, "script URL is versioned");
for (const cachedFile of ["./index.html", "./start.html", "./reuse.html", "./launch.html", "./materials.html", "./materials-guide.html", "./preflight.html", "./feedback.html", "./pack-read.html", "./pack-publish.html", "./pack-reuse.html", "./pack-verify.html", "./monument.html", "./workflow.html", "./styles.css?v=13", "./launch.css?v=12", "./launch.js?v=1", "./materials-guide.js?v=1", "./pack-page.js?v=1", "./preflight.js?v=5", "./feedback.js?v=2", "./app.js?v=16", "./progress-timeline.json?v=9", "./progress-timeline-source.json", "./world-sync.json?v=9", "./trace-ledger.json?v=9", "./public-health.json?v=9", "./materials-index.json", "./materials-api.json", "./materials-packs.json", "./publish-record-template.json", "./feedback-records.json", "./reuse-map.json", "./icon.svg", "./social-card.svg", "./public-health-badge.svg", "./promo/xhs-cover.png", "./promo/workflow-card.png", "./promo/reuse-flow-card.png", "./promo/feedback-rank-poster.png", "./promo/pack-read-card.svg", "./promo/pack-publish-card.svg", "./promo/pack-reuse-card.svg", "./promo/pack-verify-card.svg", "./promo/feedback-rank-card.svg", "./promo/xhs-post-drafts.md", "./promo/xhs-feedback-loop-template.md", "./promo/xhs-publish-checklist.md", "./promo/xhs-publish-manifest.json", "./promo/xhs-publish-report.md", "./evidence-pack.md", "./verification-summary.md", "./templates/ai-session-artifact-kit.md", "./templates/ai-session-public-quickstart.md", "./site.webmanifest"]) {
  const escaped = cachedFile.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(files.serviceWorker, new RegExp(escaped), `service worker caches ${cachedFile}`);
}
assert.match(files.server, /\.webmanifest/, "local server serves the manifest type");
assert.match(files.server, /\.md/, "local server serves markdown templates");
assert.match(files.server, /\.png/, "local server serves png share assets");
assert.match(files.server, /\.svg/, "local server serves svg icons");
assert.match(files.svg, /Trace Atlas icon/, "svg icon has an accessible title");
assert.match(files.socialCard, /我把 AI 会话/, "social card states the Xiaohongshu hook");
assert.match(files.healthBadge, /Trace Atlas 公开健康徽章/, "public health badge has an accessible title");
assert.match(files.healthBadge, /35 个公开入口/, "public health badge states public link count");
assert.match(files.healthBadge, /11 份发布文档/, "public health badge states publish document count");
assert.match(files.healthBadge, /10 个验证脚本/, "public health badge states verification count");
assert.match(files.feedbackRankCard, /Trace Atlas 反馈问题榜分享卡/, "feedback rank card has an accessible title");
assert.match(files.feedbackRankCard, /FEEDBACK RANK/, "feedback rank card shows its category");
assert.match(files.feedbackRankCard, /\/feedback/, "feedback rank card shows its public route");
assert.match(files.feedbackRankPoster, /Trace Atlas 反馈问题榜长图/, "feedback rank poster source has a clear title");
assert.match(files.feedbackRankPoster, /反馈问题<\/span><br>怎么变成下一步/, "feedback rank poster source has a clear hook");
assert.match(files.feedbackRankPoster, /14\/14/, "feedback rank poster source includes the preflight count");
assert.deepEqual(Array.from(files.feedbackRankPosterPng.subarray(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10], "feedback rank poster PNG has a valid signature");
assert.equal(files.feedbackRankPosterPng.readUInt32BE(16), 900, "feedback rank poster PNG width is 900");
assert.equal(files.feedbackRankPosterPng.readUInt32BE(20), 1200, "feedback rank poster PNG height is 1200");
for (const [name, card, slug] of [
  ["read", files.packReadCard, "pack-read"],
  ["publish", files.packPublishCard, "pack-publish"],
  ["reuse", files.packReuseCard, "pack-reuse"],
  ["verify", files.packVerifyCard, "pack-verify"]
]) {
  assert.match(card, /Trace Atlas .*分享卡/, `${name} pack card has an accessible title`);
  assert.match(card, /trace-atlas-codex\.pages\.dev/, `${name} pack card shows its public domain`);
  assert.match(card, new RegExp(`/${slug}`), `${name} pack card shows its public route`);
  assert.match(card, /LINKS/, `${name} pack card shows a link count`);
}
assert.match(files.artifactKit, /AI 会话公开化模板/, "artifact kit has a clear title");
assert.match(files.artifactKit, /公开链接 HTTP 状态/, "artifact kit includes public link verification");
assert.match(files.quickstart, /# AI 会话公开化快速清单/, "quickstart checklist has a clear title");
assert.match(files.quickstart, /## 六步收尾/, "quickstart checklist includes the six-step flow");
assert.match(files.quickstart, /## 发布后回流/, "quickstart checklist includes feedback loop guidance");
assert.match(files.xhsCover, /我把 <span class="highlight">AI 会话<\/span>/, "Xiaohongshu cover source has the hook");
assert.deepEqual(Array.from(files.xhsCoverPng.subarray(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10], "Xiaohongshu cover PNG has a valid signature");
assert.equal(files.xhsCoverPng.readUInt32BE(16), 900, "Xiaohongshu cover PNG width is 900");
assert.equal(files.xhsCoverPng.readUInt32BE(20), 1200, "Xiaohongshu cover PNG height is 1200");
assert.match(files.reuseFlowCard, /这个网站<\/span><br>可以怎么拿走/, "reuse flow card source has a clear hook");
assert.match(files.reuseFlowCard, /trace-atlas-codex\.pages\.dev\/reuse/, "reuse flow card source links to the reuse route page");
assert.deepEqual(Array.from(files.reuseFlowCardPng.subarray(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10], "reuse flow card PNG has a valid signature");
assert.equal(files.reuseFlowCardPng.readUInt32BE(16), 900, "reuse flow card PNG width is 900");
assert.equal(files.reuseFlowCardPng.readUInt32BE(20), 1200, "reuse flow card PNG height is 1200");
assert.match(files.workflowCard, /AI 会话<\/span><br>怎样变成公开作品/, "workflow card source has a clear hook");
assert.match(files.workflowCard, /trace-atlas-codex\.pages\.dev\/workflow/, "workflow card source links to the workflow page");
assert.deepEqual(Array.from(files.workflowCardPng.subarray(0, 8)), [137, 80, 78, 71, 13, 10, 26, 10], "workflow card PNG has a valid signature");
assert.equal(files.workflowCardPng.readUInt32BE(16), 900, "workflow card PNG width is 900");
assert.equal(files.workflowCardPng.readUInt32BE(20), 1200, "workflow card PNG height is 1200");
assert.match(files.xhsLaunchKit, /小红书正文草案/, "Xiaohongshu launch kit includes a body draft");
assert.match(files.xhsLaunchKit, /最终推荐：`我把AI会话做成网站`/, "Xiaohongshu launch kit has a selected title");
assert.match(files.xhsLaunchKit, /#AI工作流/, "Xiaohongshu launch kit includes tags");
assert.match(files.xhsLaunchKit, /promo\/workflow-card\.png/, "Xiaohongshu launch kit includes the workflow card");
assert.match(files.xhsLaunchKit, /xhs-post-drafts\.md/, "Xiaohongshu launch kit links to the post drafts");
assert.match(files.xhsPostDrafts, /# 小红书发布草稿包/, "Xiaohongshu post drafts have a clear title");
assert.match(files.xhsPostDrafts, /推荐标题：`我把AI会话做成网站`/, "Xiaohongshu post drafts keep the selected title");
assert.match(files.xhsPostDrafts, /干净上下文审查表/, "Xiaohongshu post drafts include a title ambiguity audit table");
assert.match(files.xhsPostDrafts, /## 正文终稿/, "Xiaohongshu post drafts include the final body");
assert.match(files.xhsPostDrafts, /## 正文短版/, "Xiaohongshu post drafts include a short body");
assert.match(files.xhsPostDrafts, /#AI工作流/, "Xiaohongshu post drafts include tags");
assert.match(files.xhsPostDrafts, /## 发布边界/, "Xiaohongshu post drafts include public boundaries");
assert.match(files.xhsFeedbackLoop, /# 小红书发布后回流模板/, "Xiaohongshu feedback loop template has a clear title");
assert.match(files.xhsFeedbackLoop, /## 帖子记录/, "Xiaohongshu feedback loop template records the post");
assert.match(files.xhsFeedbackLoop, /## 评论与问题分类/, "Xiaohongshu feedback loop template classifies comments");
assert.match(files.xhsFeedbackLoop, /## 回写 issue 模板/, "Xiaohongshu feedback loop template includes an issue comment template");
assert.match(files.xhsFeedbackLoop, /xhs-feedback-loop-template\.md/, "Xiaohongshu feedback loop template includes its public verification URL");
assert.match(files.xhsFeedbackLoop, /## 公开边界/, "Xiaohongshu feedback loop template includes public boundaries");
assert.match(files.xhsPublishChecklist, /# 小红书发布检查台/, "Xiaohongshu publish checklist has a clear title");
assert.match(files.xhsPublishChecklist, /promo\/workflow-card\.png/, "Xiaohongshu publish checklist includes the workflow card");
assert.match(files.xhsPublishChecklist, /xhs-post-drafts\.md/, "Xiaohongshu publish checklist links to the post drafts");
assert.match(files.xhsPublishChecklist, /xhs-feedback-loop-template\.md/, "Xiaohongshu publish checklist links to the feedback loop template");
assert.match(files.xhsPublishChecklist, /Verify Trace Atlas/, "Xiaohongshu publish checklist includes CI verification");
assert.match(files.xhsPublishChecklist, /xhs-publish-manifest\.json/, "Xiaohongshu publish checklist links to the manifest");
assert.match(files.xhsPublishChecklist, /xhs-publish-report\.md/, "Xiaohongshu publish checklist links to the report");
assert.match(files.artifactKit, /# AI 会话公开化模板/, "artifact template has a clear title");
assert.match(files.artifactKit, /最后一次验证时间/, "artifact template asks for verification time");
assert.match(files.artifactKit, /不能公开的边界/, "artifact template asks for public boundaries");
assert.match(files.evidencePack, /# Trace Atlas 证据包/, "evidence pack has a clear title");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/start/, "evidence pack links to the reusable start page");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/reuse/, "evidence pack links to the reuse route page");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/launch/, "evidence pack links to the launch page");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/materials/, "evidence pack links to the materials overview");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/materials-guide/, "evidence pack links to the materials guide");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/preflight/, "evidence pack links to the preflight page");
assert.match(files.evidencePack, /发布记录模板/, "evidence pack describes the publish record template");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/pack-publish/, "evidence pack links to the publish action pack");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/pack-reuse/, "evidence pack links to the reuse action pack");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/pack-verify/, "evidence pack links to the verify action pack");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/monument/, "evidence pack links to the project monument");
assert.match(files.evidencePack, /https:\/\/trace-atlas-codex\.pages\.dev\/workflow/, "evidence pack links to the workflow page");
assert.match(files.evidencePack, /public-health-badge\.svg/, "evidence pack links to the public health badge");
assert.match(files.evidencePack, /promo\/pack-publish-card\.svg/, "evidence pack links to the action pack share card");
assert.match(files.evidencePack, /reuse-flow-card\.png/, "evidence pack links to the reuse flow card");
assert.match(files.evidencePack, /progress-timeline-source\.json/, "evidence pack links to the progress timeline source");
assert.match(files.evidencePack, /ai-session-public-quickstart\.md/, "evidence pack links to the quickstart checklist");
assert.match(files.evidencePack, /xhs-post-drafts\.md/, "evidence pack links to the post drafts");
assert.match(files.evidencePack, /xhs-feedback-loop-template\.md/, "evidence pack links to the feedback loop template");
assert.match(files.evidencePack, /xhs-publish-checklist\.md/, "evidence pack links to the publish checklist");
assert.match(files.evidencePack, /xhs-publish-manifest\.json/, "evidence pack links to the publish manifest");
assert.match(files.evidencePack, /xhs-publish-report\.md/, "evidence pack links to the publish report");
assert.match(files.evidencePack, /verification-summary\.md/, "evidence pack links to the verification summary");
assert.match(files.evidencePack, /public-health\.json/, "evidence pack links to public health data");
assert.match(files.evidencePack, /materials-index\.json/, "evidence pack links to materials index data");
assert.match(files.evidencePack, /materials-api\.json/, "evidence pack links to materials API data");
assert.match(files.evidencePack, /materials-packs\.json/, "evidence pack links to materials packs data");
assert.match(files.evidencePack, /publish-record-template\.json/, "evidence pack links to the publish record JSON template");
assert.match(files.evidencePack, /reuse-map\.json/, "evidence pack links to the reuse map");
assert.match(files.evidencePack, /build-materials-api\.mjs/, "evidence pack describes the materials API script");
assert.match(files.evidencePack, /build-materials-packs\.mjs/, "evidence pack describes the materials packs script");
assert.match(files.evidencePack, /build-pack-pages\.mjs/, "evidence pack describes the pack pages script");
assert.match(files.evidencePack, /build-verification-summary\.mjs/, "evidence pack describes the verification summary script");
assert.match(files.evidencePack, /build-progress-timeline\.mjs/, "evidence pack describes the progress timeline script");
assert.match(files.evidencePack, /npm run check/, "evidence pack includes the local verification command");
assert.match(files.evidencePack, /不公开 token/, "evidence pack states public boundaries");
assert.match(files.evidencePack, /常见 token 前缀/, "evidence pack describes the boundary scan");
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
assert.equal(timeline.generatedFrom, "progress-timeline-source.json");
assert.ok(timeline.items.length >= 20, "progress timeline lists the reader-facing path");
for (const title of ["公开材料有了总入口", "留下项目纪念碑", "发布草稿可以直接取用", "外部反馈能回到仓库", "复用链路能被机器读取", "复用路线可以被读者扫读", "验证摘要开始自动生成", "进展时间线交给脚本维护"]) {
  assert.ok(timeline.items.some((item) => item.title === title), `progress timeline includes ${title}`);
}
timeline.items.forEach((item, index) => {
  assert.equal(item.phase, String(index + 1).padStart(2, "0"), `timeline phase ${item.title} is generated sequentially`);
  assert.match(item.phase, /^[0-9]{2}$/, `timeline phase ${item.title} has a readable number`);
  assert.ok(item.summary.length > 24, `timeline item ${item.title} has a useful summary`);
  assert.match(item.evidenceHref, /^https:\/\/(github\.com|trace-atlas-codex\.pages\.dev)\//, `timeline evidence ${item.title} is public https`);
});

const timelineSource = JSON.parse(files.timelineSource);
assert.equal(timelineSource.name, "Trace Atlas 进展时间线源数据");
assert.equal(timelineSource.items.length, timeline.items.length, "timeline source and generated timeline have the same item count");
assert.ok(timelineSource.items.every((item) => !Object.hasOwn(item, "phase")), "timeline source does not store generated phases");

const sync = JSON.parse(files.sync);
assert.equal(sync.name, "Trace Atlas 世界同步");
assert.equal(sync.status, "公开");
assert.equal(sync.links.length, 7);
for (const link of sync.links) {
  assert.match(link.href, /^https:\/\/(github\.com|soya-xx\.github\.io|trace-atlas-codex\.pages\.dev)\//, `sync link ${link.label} is public https`);
  assert.ok(link.note.length > 8, `sync link ${link.label} has a useful note`);
}

const publicHealth = JSON.parse(files.publicHealth);
assert.equal(publicHealth.name, "Trace Atlas 公开健康状态");
assert.equal(publicHealth.status, "可公开访问");
assert.equal(publicHealth.counts.publicLinks, 35);
assert.equal(publicHealth.counts.visualAssets, 11);
assert.equal(publicHealth.counts.publishDocuments, 11);
assert.equal(publicHealth.counts.verificationScripts, 10);
assert.ok(publicHealth.checks.some((check) => check.label === "边界扫描纳入 CI"), "public health includes boundary scan status");
assert.ok(publicHealth.checks.some((check) => check.label === "开始复用入口已公开"), "public health includes reusable start page status");
assert.ok(publicHealth.checks.some((check) => check.label === "复用路线页已公开"), "public health includes reuse route page status");
assert.ok(publicHealth.checks.some((check) => check.label === "复用链路 JSON 已公开"), "public health includes reuse map status");
assert.ok(publicHealth.checks.some((check) => check.label === "材料总览已公开"), "public health includes materials overview status");
assert.ok(publicHealth.checks.some((check) => check.label === "材料选择器已公开"), "public health includes materials guide status");
assert.ok(publicHealth.checks.some((check) => check.label === "项目纪念碑已公开"), "public health includes project monument status");
assert.ok(publicHealth.checks.some((check) => check.label === "发布草稿包已公开"), "public health includes post drafts status");
assert.ok(publicHealth.checks.some((check) => check.label === "发布后回流模板已公开"), "public health includes feedback loop template status");
assert.ok(publicHealth.checks.some((check) => check.label === "复用流程图已公开"), "public health includes reuse flow card status");
assert.ok(publicHealth.checks.some((check) => check.label === "公开健康徽章已公开"), "public health includes badge status");
assert.ok(publicHealth.checks.some((check) => check.label === "公开化快速清单已公开"), "public health includes quickstart checklist status");
assert.ok(publicHealth.checks.some((check) => check.label === "验证摘要已公开"), "public health includes verification summary status");
assert.ok(publicHealth.checks.some((check) => check.label === "时间线源数据已公开"), "public health includes timeline source status");
assert.ok(publicHealth.checks.some((check) => check.label === "材料 API 已公开"), "public health includes materials API status");
assert.ok(publicHealth.checks.some((check) => check.label === "材料行动包已公开"), "public health includes materials packs status");
assert.ok(publicHealth.checks.some((check) => check.label === "发布前自检页已公开"), "public health includes preflight page status");
assert.ok(publicHealth.checks.some((check) => check.label === "反馈问题榜已公开"), "public health includes feedback dashboard status");
assert.ok(publicHealth.checks.some((check) => check.label === "发布记录模板已公开"), "public health includes publish record template status");
assert.ok(publicHealth.checks.some((check) => check.label === "发布记录 JSON 模板已公开"), "public health includes publish record JSON template status");
assert.ok(publicHealth.checks.some((check) => check.label === "发布反馈样例记录已公开"), "public health includes feedback records status");
assert.ok(publicHealth.checks.some((check) => check.label === "阅读了解行动包页已公开"), "public health includes read action pack page status");
assert.ok(publicHealth.checks.some((check) => check.label === "发帖发布行动包页已公开"), "public health includes publish action pack page status");
assert.ok(publicHealth.checks.some((check) => check.label === "复用接力行动包页已公开"), "public health includes reuse action pack page status");
assert.ok(publicHealth.checks.some((check) => check.label === "验证维护行动包页已公开"), "public health includes verify action pack page status");
assert.ok(publicHealth.checks.some((check) => check.label === "行动包分享卡已公开"), "public health includes action pack card status");
assert.ok(publicHealth.checks.some((check) => check.label === "反馈问题榜分享卡已公开"), "public health includes feedback rank card status");
assert.ok(publicHealth.checks.some((check) => check.label === "反馈问题榜长图已公开"), "public health includes feedback rank poster status");
assert.ok(publicHealth.checks.some((check) => check.label === "时间线生成脚本纳入 CI"), "public health includes timeline generator status");
assert.ok(publicHealth.checks.some((check) => check.label === "材料 API 生成脚本纳入 CI"), "public health includes materials API generator status");
assert.ok(publicHealth.checks.some((check) => check.label === "材料行动包生成脚本纳入 CI"), "public health includes materials packs generator status");
assert.ok(publicHealth.checks.some((check) => check.label === "行动包页面生成脚本纳入 CI"), "public health includes action pack page generator status");
for (const check of publicHealth.checks) {
  assert.equal(check.state, "ok", `public health check ${check.label} is ok`);
  assert.match(check.evidenceHref, /^https:\/\/(github\.com|trace-atlas-codex\.pages\.dev)\//, `public health evidence ${check.label} is public https`);
}

const materialsIndex = JSON.parse(files.materialsIndex);
assert.equal(materialsIndex.name, "Trace Atlas 公开材料总览");
assert.ok(materialsIndex.groups.length >= 5, "materials index has grouped public materials");
assert.ok(materialsIndex.groups.some((group) => group.id === "verification"), "materials index includes verification group");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/reuse")), "materials index includes the reuse route page");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/materials-guide")), "materials index includes the materials guide");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/promo/reuse-flow-card.png")), "materials index includes the reuse flow card");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/reuse-map.json")), "materials index includes the reuse map");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/verification-summary.md")), "materials index includes the verification summary");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/materials-api.json")), "materials index includes materials API");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/materials-packs.json")), "materials index includes materials packs");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/publish-record-template.json" && item.useCase === "publish")), "materials index includes the publish record JSON template");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/feedback" && item.useCase === "publish")), "materials index includes the feedback dashboard");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/feedback-records.json" && item.useCase === "publish")), "materials index includes feedback records data");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/preflight" && item.useCase === "publish")), "materials index includes the preflight page with a publish use case");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/pack-publish" && item.useCase === "publish")), "materials index includes the publish action pack page with a use case override");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/pack-reuse" && item.useCase === "reuse")), "materials index includes the reuse action pack page with a use case override");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/pack-verify" && item.useCase === "verify")), "materials index includes the verify action pack page with a use case override");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/promo/pack-publish-card.svg")), "materials index includes an action pack card");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/promo/feedback-rank-card.svg" && item.useCase === "publish")), "materials index includes the feedback rank card");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/promo/feedback-rank-poster.png" && item.useCase === "publish")), "materials index includes the feedback rank poster");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-verification-summary.mjs")), "materials index includes the verification summary script");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/progress-timeline-source.json")), "materials index includes the progress timeline source");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-progress-timeline.mjs")), "materials index includes the progress timeline script");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-materials-api.mjs")), "materials index includes the materials API script");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-materials-packs.mjs")), "materials index includes the materials packs script");
assert.ok(materialsIndex.groups.some((group) => group.items.some((item) => item.href === "https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-pack-pages.mjs")), "materials index includes the pack pages script");
for (const group of materialsIndex.groups) {
  assert.ok(group.items.length > 0, `materials index group ${group.id} has items`);
  for (const item of group.items) {
    assert.match(item.href, /^https:\/\/(github\.com|trace-atlas-codex\.pages\.dev)\//, `materials index item ${item.label} is public https`);
  }
}

const materialsApi = JSON.parse(files.materialsApi);
assert.equal(materialsApi.name, "Trace Atlas 材料 API");
assert.equal(materialsApi.publicOnly, true);
assert.equal(materialsApi.generatedFrom, "materials-index.json");
assert.equal(materialsApi.counts.groups, materialsIndex.groups.length);
assert.equal(materialsApi.counts.items, 56);
assert.equal(materialsApi.items.length, materialsApi.counts.items);
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/materials-guide" && item.kind === "page"), "materials API includes the materials guide");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/materials-api.json" && item.kind === "data"), "materials API includes itself as machine data");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/materials-packs.json" && item.kind === "data"), "materials API includes materials packs");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/publish-record-template.json" && item.kind === "data" && item.useCase === "publish"), "materials API includes the publish record JSON template");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/feedback" && item.kind === "page" && item.useCase === "publish"), "materials API includes the feedback dashboard");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/feedback-records.json" && item.kind === "data" && item.useCase === "publish"), "materials API includes feedback records data");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/preflight" && item.kind === "page" && item.useCase === "publish"), "materials API preserves the preflight page use case override");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/pack-publish" && item.kind === "page" && item.useCase === "publish"), "materials API preserves the publish pack page use case override");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/pack-reuse" && item.kind === "page" && item.useCase === "reuse"), "materials API preserves the reuse pack page use case override");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/pack-verify" && item.kind === "page" && item.useCase === "verify"), "materials API preserves the verify pack page use case override");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/promo/pack-publish-card.svg" && item.kind === "image"), "materials API includes action pack cards");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/promo/feedback-rank-card.svg" && item.kind === "image" && item.useCase === "publish"), "materials API includes the feedback rank card");
assert.ok(materialsApi.items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/promo/feedback-rank-poster.png" && item.kind === "image" && item.useCase === "publish"), "materials API includes the feedback rank poster");
assert.ok(materialsApi.items.some((item) => item.href === "https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-materials-api.mjs" && item.kind === "verification"), "materials API includes its generator script");
assert.ok(materialsApi.items.some((item) => item.href === "https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-materials-packs.mjs" && item.kind === "verification"), "materials API includes the materials packs generator script");
assert.ok(materialsApi.items.some((item) => item.href === "https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-pack-pages.mjs" && item.kind === "verification"), "materials API includes the pack pages generator script");
for (const item of materialsApi.items) {
  assert.match(item.id, /^[^:]+:.+$/, `materials API item ${item.label} has a stable id`);
  assert.match(item.href, /^https:\/\/(github\.com|trace-atlas-codex\.pages\.dev)\//, `materials API item ${item.label} is public https`);
  assert.match(item.kind, /^(page|image|document|data|verification)$/, `materials API item ${item.label} has a known kind`);
  assert.match(item.useCase, /^(read|publish|reuse|verify)$/, `materials API item ${item.label} has a known use case`);
  assert.match(item.audience, /^(reader|creator|tool|maintainer)$/, `materials API item ${item.label} has a known audience`);
}
assert.doesNotMatch(files.materialsApi, /(ghp_|cfut_)/, "materials API does not include known token prefixes");
assert.doesNotMatch(files.materialsApi, /\/Users\/b1lli/, "materials API does not include local user paths");

const materialsPacks = JSON.parse(files.materialsPacks);
assert.equal(materialsPacks.name, "Trace Atlas 材料行动包");
assert.equal(materialsPacks.publicOnly, true);
assert.equal(materialsPacks.generatedFrom, "materials-api.json");
assert.equal(materialsPacks.counts.packs, 4);
assert.equal(materialsPacks.counts.items, materialsApi.counts.items);
for (const id of ["read", "publish", "reuse", "verify"]) {
  const pack = materialsPacks.packs.find((item) => item.id === id);
  assert.ok(pack, `materials packs include ${id}`);
  assert.ok(pack.itemCount > 0, `materials pack ${id} has items`);
  assert.match(pack.markdown, /^## /, `materials pack ${id} has markdown output`);
}
assert.equal(materialsPacks.packs.find((item) => item.id === "read").itemCount, 9);
assert.equal(materialsPacks.packs.find((item) => item.id === "publish").itemCount, 27);
assert.equal(materialsPacks.packs.find((item) => item.id === "reuse").itemCount, 10);
assert.equal(materialsPacks.packs.find((item) => item.id === "verify").itemCount, 10);
assert.ok(materialsPacks.packs.find((item) => item.id === "publish").items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/pack-publish"), "publish pack includes its public route");
assert.ok(materialsPacks.packs.find((item) => item.id === "publish").items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/preflight"), "publish pack includes the preflight page");
assert.ok(materialsPacks.packs.find((item) => item.id === "publish").items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/publish-record-template.json"), "publish pack includes the publish record JSON template");
assert.ok(materialsPacks.packs.find((item) => item.id === "publish").items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/feedback"), "publish pack includes the feedback dashboard");
assert.ok(materialsPacks.packs.find((item) => item.id === "publish").items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/feedback-records.json"), "publish pack includes feedback records data");
assert.ok(materialsPacks.packs.find((item) => item.id === "publish").items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/promo/pack-publish-card.svg"), "publish pack includes its share card");
assert.ok(materialsPacks.packs.find((item) => item.id === "publish").items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/promo/feedback-rank-card.svg"), "publish pack includes the feedback rank card");
assert.ok(materialsPacks.packs.find((item) => item.id === "publish").items.some((item) => item.href === "https://trace-atlas-codex.pages.dev/promo/feedback-rank-poster.png"), "publish pack includes the feedback rank poster");
assert.ok(materialsPacks.packs.find((item) => item.id === "verify").items.some((item) => item.href === "https://github.com/soya-xx/trace-atlas/blob/main/scripts/build-pack-pages.mjs"), "verify pack includes the pack pages generator");
assert.doesNotMatch(files.materialsPacks, /(ghp_|cfut_)/, "materials packs do not include known token prefixes");
assert.doesNotMatch(files.materialsPacks, /\/Users\/b1lli/, "materials packs do not include local user paths");

const publishRecordTemplate = JSON.parse(files.publishRecordTemplate);
assert.equal(publishRecordTemplate.name, "Trace Atlas 发布记录 JSON 模板");
assert.equal(publishRecordTemplate.publicOnly, true);
assert.equal(publishRecordTemplate.example.schemaVersion, 1);
assert.equal(publishRecordTemplate.example.project, "Trace Atlas");
assert.ok(Array.isArray(publishRecordTemplate.example.feedback), "publish record template includes feedback as an array");
assert.ok(Array.isArray(publishRecordTemplate.example.actions), "publish record template includes actions as an array");
assert.ok(Array.isArray(publishRecordTemplate.example.nextSteps), "publish record template includes next steps as an array");
assert.ok(publishRecordTemplate.example.evidence.includes("https://trace-atlas-codex.pages.dev/preflight"), "publish record template includes public evidence");
assert.doesNotMatch(files.publishRecordTemplate, /(ghp_|cfut_)/, "publish record template does not include known token prefixes");
assert.doesNotMatch(files.publishRecordTemplate, /\/Users\/b1lli/, "publish record template does not include local user paths");

const feedbackRecords = JSON.parse(files.feedbackRecords);
assert.equal(feedbackRecords.name, "Trace Atlas 发布反馈样例记录");
assert.equal(feedbackRecords.publicOnly, true);
assert.equal(feedbackRecords.source, "example");
assert.equal(feedbackRecords.records.length, 3);
for (const record of feedbackRecords.records) {
  assert.equal(record.schemaVersion, 1, "feedback record schema version is 1");
  assert.equal(record.project, "Trace Atlas", "feedback record project is Trace Atlas");
  assert.ok(Array.isArray(record.feedback) && record.feedback.length > 0, "feedback record includes questions");
  assert.ok(Array.isArray(record.actions) && record.actions.length > 0, "feedback record includes actions");
  assert.ok(Array.isArray(record.nextSteps) && record.nextSteps.length > 0, "feedback record includes next steps");
  assert.ok(Array.isArray(record.evidence) && record.evidence.length > 0, "feedback record includes evidence");
  for (const href of record.evidence) {
    assert.match(href, /^https:\/\/(github\.com|trace-atlas-codex\.pages\.dev)\//, "feedback evidence is public https");
  }
}
assert.doesNotMatch(files.feedbackRecords, /(ghp_|cfut_)/, "feedback records do not include known token prefixes");
assert.doesNotMatch(files.feedbackRecords, /\/Users\/b1lli/, "feedback records do not include local user paths");

const reuseMap = JSON.parse(files.reuseMap);
assert.equal(reuseMap.name, "Trace Atlas 复用链路图");
assert.equal(reuseMap.publicOnly, true);
assert.equal(reuseMap.entryUrl, "https://trace-atlas-codex.pages.dev/start");
assert.equal(reuseMap.nodes.length, 6);
assert.equal(reuseMap.edges.length, 5);
assert.ok(reuseMap.nodes.some((node) => node.id === "quickstart" && node.href === "https://trace-atlas-codex.pages.dev/templates/ai-session-public-quickstart.md"), "reuse map includes the quickstart node");
assert.ok(reuseMap.nodes.some((node) => node.id === "public-health" && node.href === "https://trace-atlas-codex.pages.dev/public-health.json"), "reuse map includes the public health node");
assert.ok(reuseMap.edges.some((edge) => edge.from === "public-health" && edge.to === "feedback-loop"), "reuse map routes health status into feedback");
assert.ok(reuseMap.representations.some((item) => item.href === "https://trace-atlas-codex.pages.dev/reuse" && item.format === "html"), "reuse map includes the human route page");
assert.ok(reuseMap.representations.some((item) => item.href === "https://trace-atlas-codex.pages.dev/promo/reuse-flow-card.png" && item.format === "image/png"), "reuse map includes the reuse flow card");
for (const node of reuseMap.nodes) {
  assert.match(node.href, /^https:\/\/trace-atlas-codex\.pages\.dev\//, `reuse map node ${node.id} is public https`);
  assert.ok(node.use.length > 10, `reuse map node ${node.id} has a useful note`);
}
assert.doesNotMatch(files.reuseMap, /(ghp_|cfut_)/, "reuse map does not include known token prefixes");
assert.doesNotMatch(files.reuseMap, /\/Users\/b1lli/, "reuse map does not include local user paths");

assert.match(files.verificationSummary, /# Trace Atlas 验证摘要/, "verification summary has a clear title");
assert.match(files.verificationSummary, /公开入口：35/, "verification summary includes the public link count");
assert.match(files.verificationSummary, /发布文档：11/, "verification summary includes the publish document count");
assert.match(files.verificationSummary, /验证脚本：10/, "verification summary includes the verification script count");
assert.match(files.verificationSummary, /材料索引条目：56/, "verification summary includes the material index count");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/verification-summary\.md/, "verification summary links to its public evidence");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/materials-guide/, "verification summary includes the materials guide");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/materials-api\.json/, "verification summary includes materials API");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/materials-packs\.json/, "verification summary includes materials packs");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/publish-record-template\.json/, "verification summary includes the publish record JSON template");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/feedback/, "verification summary includes the feedback dashboard");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/feedback-records\.json/, "verification summary includes feedback records data");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/preflight/, "verification summary includes the preflight page");
assert.match(files.verificationSummary, /反馈问题榜已公开/, "verification summary includes the feedback dashboard check");
assert.match(files.verificationSummary, /发布反馈样例记录已公开/, "verification summary includes feedback records check");
assert.match(files.verificationSummary, /发布记录模板已公开/, "verification summary includes the publish record template check");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/pack-publish/, "verification summary includes the publish action pack");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/promo\/pack-publish-card\.svg/, "verification summary includes an action pack card");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/promo\/feedback-rank-card\.svg/, "verification summary includes the feedback rank card");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/promo\/feedback-rank-poster\.png/, "verification summary includes the feedback rank poster");
assert.match(files.verificationSummary, /build-materials-api\.mjs/, "verification summary includes the materials API script");
assert.match(files.verificationSummary, /build-materials-packs\.mjs/, "verification summary includes the materials packs script");
assert.match(files.verificationSummary, /build-pack-pages\.mjs/, "verification summary includes the pack pages script");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/progress-timeline-source\.json/, "verification summary includes the progress timeline source");
assert.match(files.verificationSummary, /build-progress-timeline\.mjs/, "verification summary includes the progress timeline script");
assert.match(files.verificationSummary, /https:\/\/trace-atlas-codex\.pages\.dev\/promo\/reuse-flow-card\.png/, "verification summary includes the reuse flow card");
assert.match(files.verificationSummary, /node scripts\/build-verification-summary\.mjs --check/, "verification summary includes its local check command");
assert.doesNotMatch(files.verificationSummary, /(ghp_|cfut_)/, "verification summary does not include known token prefixes");
assert.doesNotMatch(files.verificationSummary, /\/Users\/b1lli/, "verification summary does not include local user paths");
assert.match(files.verificationSummaryScript, /--check/, "verification summary script has check mode");
assert.match(files.verificationSummaryScript, /public-health\.json/, "verification summary script reads public health data");
assert.match(files.verificationSummaryScript, /materials-index\.json/, "verification summary script reads materials index data");
assert.match(files.verificationSummaryScript, /reuse-map\.json/, "verification summary script reads reuse map data");
assert.match(files.progressTimelineScript, /--check/, "progress timeline script has check mode");
assert.match(files.progressTimelineScript, /progress-timeline-source\.json/, "progress timeline script reads timeline source data");
assert.match(files.progressTimelineScript, /progress-timeline\.json/, "progress timeline script writes timeline data");
assert.match(files.materialsApiScript, /--check/, "materials API script has check mode");
assert.match(files.materialsApiScript, /materials-index\.json/, "materials API script reads materials index data");
assert.match(files.materialsApiScript, /materials-api\.json/, "materials API script writes materials API data");
assert.match(files.materialsPacksScript, /--check/, "materials packs script has check mode");
assert.match(files.materialsPacksScript, /materials-api\.json/, "materials packs script reads materials API data");
assert.match(files.materialsPacksScript, /materials-packs\.json/, "materials packs script writes materials packs data");
assert.match(files.packPagesScript, /--check/, "pack pages script has check mode");
assert.match(files.packPagesScript, /materials-packs\.json/, "pack pages script reads materials packs data");
assert.match(files.packPagesScript, /pack-publish/, "pack pages script writes the publish pack route");
assert.match(files.packPagesScript, /cardPathFor/, "pack pages script writes action pack cards");
assert.match(files.packageJson, /node --check materials-guide\.js/, "npm check validates materials guide JavaScript syntax");
assert.match(files.packageJson, /node --check pack-page\.js/, "npm check validates action pack copy JavaScript syntax");
assert.match(files.packageJson, /node --check preflight\.js/, "npm check validates preflight JavaScript syntax");
assert.match(files.packageJson, /node --check feedback\.js/, "npm check validates feedback dashboard JavaScript syntax");
assert.match(files.packageJson, /build-verification-summary\.mjs --check/, "npm check validates the verification summary");
assert.match(files.packageJson, /build-progress-timeline\.mjs --check/, "npm check validates the generated progress timeline");
assert.match(files.packageJson, /build-materials-api\.mjs --check/, "npm check validates the generated materials API");
assert.match(files.packageJson, /build-materials-packs\.mjs --check/, "npm check validates the generated materials packs");
assert.match(files.packageJson, /build-pack-pages\.mjs --check/, "npm check validates the generated pack pages");

const publishManifest = JSON.parse(files.xhsPublishManifest);
assert.equal(publishManifest.name, "Trace Atlas 小红书发布 manifest");
assert.equal(publishManifest.publicOnly, true);
assert.equal(publishManifest.title, "我把AI会话做成网站");
assert.equal(publishManifest.assets.length, 4);
assert.ok(publishManifest.assets.some((asset) => asset.href === "https://trace-atlas-codex.pages.dev/promo/workflow-card.png"), "publish manifest includes workflow card");
assert.ok(publishManifest.assets.some((asset) => asset.href === "https://trace-atlas-codex.pages.dev/promo/reuse-flow-card.png"), "publish manifest includes reuse flow card");
assert.ok(publishManifest.tags.includes("#AI工作流"), "publish manifest includes core tag");
assert.ok(publishManifest.links.some((link) => link.href === "https://trace-atlas-codex.pages.dev/reuse"), "publish manifest links to the reuse route page");
assert.ok(publishManifest.links.some((link) => link.href === "https://trace-atlas-codex.pages.dev/promo/xhs-post-drafts.md"), "publish manifest links to the post drafts");
assert.ok(publishManifest.links.some((link) => link.href === "https://trace-atlas-codex.pages.dev/promo/xhs-feedback-loop-template.md"), "publish manifest links to the feedback loop template");
assert.ok(publishManifest.links.some((link) => link.href === "https://trace-atlas-codex.pages.dev/promo/xhs-publish-report.md"), "publish manifest links to the report");
for (const link of publishManifest.links) {
  assert.match(link.href, /^https:\/\/(github\.com|trace-atlas-codex\.pages\.dev)\//, `publish manifest link ${link.label} is public https`);
}
assert.doesNotMatch(files.xhsPublishManifest, /(ghp_|cfut_)/, "publish manifest does not include known token prefixes");
assert.match(files.xhsPublishReport, /# Trace Atlas 发布前报告/, "publish report has a clear title");
assert.match(files.xhsPublishReport, /来源：`promo\/xhs-publish-manifest\.json`/, "publish report states its source manifest");
assert.match(files.xhsPublishReport, /https:\/\/trace-atlas-codex\.pages\.dev\/promo\/xhs-post-drafts\.md/, "publish report includes post drafts URL");
assert.match(files.xhsPublishReport, /https:\/\/trace-atlas-codex\.pages\.dev\/promo\/xhs-feedback-loop-template\.md/, "publish report includes feedback loop template URL");
assert.match(files.xhsPublishReport, /https:\/\/trace-atlas-codex\.pages\.dev\/promo\/workflow-card\.png/, "publish report includes workflow card URL");
assert.match(files.xhsPublishReport, /https:\/\/trace-atlas-codex\.pages\.dev\/reuse/, "publish report includes reuse route URL");
assert.match(files.xhsPublishReport, /https:\/\/trace-atlas-codex\.pages\.dev\/promo\/reuse-flow-card\.png/, "publish report includes reuse flow card URL");
assert.match(files.publishReportScript, /--check/, "publish report script has check mode");
assert.match(files.publishReportScript, /xhs-publish-manifest\.json/, "publish report script reads the manifest");
assert.match(files.publicBoundaryScript, /GitHub classic token/, "public boundary scan checks GitHub token prefixes");
assert.match(files.publicBoundaryScript, /Cloudflare user token/, "public boundary scan checks Cloudflare token prefixes");
assert.match(files.publicBoundaryScript, /local user path/, "public boundary scan checks local absolute paths");

const seedIds = Array.from(files.js.matchAll(/id: "([^"]+)"/g)).map((match) => match[1]);
for (const id of ["agency-granted", "strong-verification", "playful-proof", "living-artifact"]) {
  assert.ok(seedIds.includes(id), `seed ${id} exists`);
}

console.log("Trace Atlas verification passed.");
