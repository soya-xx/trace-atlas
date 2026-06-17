const checks = [
  {
    id: "pack-read",
    label: "阅读了解行动包页",
    url: "./pack-read.html",
    type: "text",
    mustContain: ["阅读了解包", "copy-pack-page", "pack-read-card.svg"]
  },
  {
    id: "pack-publish",
    label: "发帖发布行动包页",
    url: "./pack-publish.html",
    type: "text",
    mustContain: ["发帖发布包", "copy-pack-page", "pack-publish-card.svg"]
  },
  {
    id: "pack-reuse",
    label: "复用接力行动包页",
    url: "./pack-reuse.html",
    type: "text",
    mustContain: ["复用接力包", "copy-pack-page", "pack-reuse-card.svg"]
  },
  {
    id: "pack-verify",
    label: "验证维护行动包页",
    url: "./pack-verify.html",
    type: "text",
    mustContain: ["验证维护包", "copy-pack-page", "pack-verify-card.svg"]
  },
  {
    id: "card-publish",
    label: "发帖包分享卡",
    url: "./promo/pack-publish-card.svg",
    type: "text",
    mustContain: ["Trace Atlas 发帖发布包分享卡", "LINKS", "/pack-publish"]
  },
  {
    id: "feedback-page",
    label: "反馈问题榜",
    url: "./feedback.html",
    type: "text",
    mustContain: ["反馈问题榜", "feedback-records.json", "copy-feedback-board"]
  },
  {
    id: "faq-page",
    label: "公开 FAQ",
    url: "./faq.html",
    type: "text",
    mustContain: ["公开 FAQ", "feedback-records.json", "faq.js?v=1", "FAQ 摘要"]
  },
  {
    id: "feedback-card",
    label: "反馈榜分享卡",
    url: "./promo/feedback-rank-card.svg",
    type: "text",
    mustContain: ["Trace Atlas 反馈问题榜分享卡", "FEEDBACK RANK", "/feedback"]
  },
  {
    id: "feedback-poster",
    label: "反馈榜长图",
    url: "./promo/feedback-rank-poster.png",
    type: "binary",
    validate: (bytes) =>
      bytes.length > 8 &&
      bytes[0] === 137 &&
      bytes[1] === 80 &&
      bytes[2] === 78 &&
      bytes[3] === 71
  },
  {
    id: "materials-api",
    label: "材料 API",
    url: "./materials-api.json",
    type: "json",
    validate: (data) => data.publicOnly === true && data.counts.items === 57
  },
  {
    id: "materials-packs",
    label: "材料行动包 JSON",
    url: "./materials-packs.json",
    type: "json",
    validate: (data) => data.publicOnly === true && data.counts.packs === 4 && data.counts.items === 57
  },
  {
    id: "publish-record-template",
    label: "发布记录 JSON 模板",
    url: "./publish-record-template.json",
    type: "json",
    validate: (data) => data.publicOnly === true && data.example.schemaVersion === 1
  },
  {
    id: "feedback-records",
    label: "发布反馈样例记录",
    url: "./feedback-records.json",
    type: "json",
    validate: (data) => data.publicOnly === true && data.source === "example" && data.records.length === 3
  },
  {
    id: "public-health",
    label: "公开健康状态",
    url: "./public-health.json",
    type: "json",
    validate: (data) =>
      data.counts.publicLinks === 36 && data.counts.visualAssets === 11 && data.counts.verificationScripts === 10
  },
  {
    id: "verification-summary",
    label: "验证摘要",
    url: "./verification-summary.md",
    type: "text",
    mustContain: ["公开入口：36", "材料索引条目：57", "公开 FAQ 已公开", "反馈问题榜长图已公开", "发布反馈样例记录已公开"]
  }
];

const listNode = document.querySelector("#preflight-list");
const statusNode = document.querySelector("#preflight-status");
const reportNode = document.querySelector("#preflight-report");
const copyButton = document.querySelector("#copy-preflight");
const rerunButton = document.querySelector("#rerun-preflight");
const recordUrl = document.querySelector("#record-url");
const recordTime = document.querySelector("#record-time");
const recordStatus = document.querySelector("#record-status");
const recordFeedback = document.querySelector("#record-feedback");
const recordAction = document.querySelector("#record-action");
const recordNext = document.querySelector("#record-next");
const recordOutput = document.querySelector("#publish-record-output");
const recordJsonOutput = document.querySelector("#publish-record-json-output");
const copyRecordButton = document.querySelector("#copy-record");
const copyRecordJsonButton = document.querySelector("#copy-record-json");
const recordHistory = document.querySelector("#record-history");
const feedbackRankOutput = document.querySelector("#feedback-rank-output");
const copyFeedbackRankButton = document.querySelector("#copy-feedback-rank");

let latestResults = [];

function setStatus(message) {
  statusNode.textContent = message;
}

function resultIcon(ok) {
  return ok ? "ok" : "fail";
}

function renderResults(results) {
  listNode.replaceChildren(
    ...results.map((result) => {
      const article = document.createElement("article");
      article.className = "preflight-check";
      article.dataset.state = result.ok ? "ok" : "fail";

      const head = document.createElement("div");
      head.className = "preflight-check-head";

      const title = document.createElement("h2");
      title.textContent = result.label;

      const state = document.createElement("span");
      state.className = "state-pill";
      state.textContent = resultIcon(result.ok);

      const detail = document.createElement("p");
      detail.textContent = result.ok ? `已验证：${result.url}` : `失败：${result.reason}`;

      head.append(title, state);
      article.append(head, detail);
      return article;
    })
  );
}

function buildReport(results) {
  const passed = results.filter((result) => result.ok).length;
  const failed = results.length - passed;
  const lines = [
    "## Trace Atlas 发布前自检",
    "",
    `时间：${new Date().toISOString()}`,
    `结果：${passed}/${results.length} 通过，${failed} 失败。`,
    "",
    ...results.map((result) => `- ${result.ok ? "ok" : "fail"} ${result.label}：${result.url}`)
  ];
  return `${lines.join("\n")}\n`;
}

function updateReport(results) {
  const report = buildReport(results);
  reportNode.textContent = report;
  copyButton.disabled = results.length === 0;
  updatePublishRecord();
}

async function readCheck(check) {
  const response = await fetch(check.url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  if (check.type === "json") {
    const data = await response.json();
    if (!check.validate(data)) {
      throw new Error("JSON 内容不符合预期");
    }
    return;
  }
  if (check.type === "binary") {
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (!check.validate(bytes)) {
      throw new Error("二进制内容不符合预期");
    }
    return;
  }
  const text = await response.text();
  for (const needle of check.mustContain) {
    if (!text.includes(needle)) {
      throw new Error(`缺少 ${needle}`);
    }
  }
}

async function runPreflight() {
  setStatus("正在检查公开材料。");
  copyButton.disabled = true;
  latestResults = [];
  renderResults(
    checks.map((check) => ({
      ...check,
      ok: true,
      reason: "等待检查"
    }))
  );

  latestResults = await Promise.all(
    checks.map(async (check) => {
      try {
        await readCheck(check);
        return { ...check, ok: true, reason: "" };
      } catch (error) {
        return { ...check, ok: false, reason: error.message };
      }
    })
  );

  const passed = latestResults.filter((result) => result.ok).length;
  setStatus(`${passed}/${latestResults.length} 项通过。`);
  renderResults(latestResults);
  updateReport(latestResults);
}

async function copyReport() {
  const report = buildReport(latestResults);
  await copyText(report);
  setStatus("自检报告已复制。");
}

function fieldValue(node, fallback) {
  const value = node.value.trim();
  return value.length > 0 ? value : fallback;
}

function preflightLine() {
  if (latestResults.length === 0) {
    return "自检：尚未完成。";
  }
  const passed = latestResults.filter((result) => result.ok).length;
  return `自检：${passed}/${latestResults.length} 通过。`;
}

function listFromTextarea(node) {
  return node.value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function preflightData() {
  if (latestResults.length === 0) {
    return { passed: 0, total: 0 };
  }
  return {
    passed: latestResults.filter((result) => result.ok).length,
    total: latestResults.length
  };
}

function buildPublishRecordData() {
  return {
    schemaVersion: 1,
    project: "Trace Atlas",
    status: recordStatus.value,
    postUrl: fieldValue(recordUrl, ""),
    publishedAt: fieldValue(recordTime, ""),
    preflight: preflightData(),
    feedback: listFromTextarea(recordFeedback),
    actions: listFromTextarea(recordAction),
    nextSteps: listFromTextarea(recordNext),
    evidence: [
      "https://trace-atlas-codex.pages.dev/preflight",
      "https://trace-atlas-codex.pages.dev/pack-publish",
      "https://trace-atlas-codex.pages.dev/verification-summary.md"
    ]
  };
}

function buildPublishRecord() {
  const data = buildPublishRecordData();
  const lines = [
    "## Trace Atlas 发布记录",
    "",
    `状态：${data.status}`,
    `小红书链接：${data.postUrl || "待补充"}`,
    `发布时间：${data.publishedAt || "待补充"}`,
    `发布前${preflightLine()}`,
    "",
    "### 评论与问题",
    fieldValue(recordFeedback, "待记录"),
    "",
    "### 处理动作",
    fieldValue(recordAction, "待记录"),
    "",
    "### 下一步",
    fieldValue(recordNext, "待记录"),
    "",
    "### 公开证据",
    "- 自检页：https://trace-atlas-codex.pages.dev/preflight",
    "- 发帖发布包：https://trace-atlas-codex.pages.dev/pack-publish",
    "- 验证摘要：https://trace-atlas-codex.pages.dev/verification-summary.md"
  ];
  return `${lines.join("\n")}\n`;
}

function updatePublishRecord() {
  recordOutput.textContent = buildPublishRecord();
  recordJsonOutput.textContent = `${JSON.stringify(buildPublishRecordData(), null, 2)}\n`;
  updateFeedbackRank();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

async function copyPublishRecord() {
  await copyText(buildPublishRecord());
  setStatus("发布记录已复制。");
}

async function copyPublishRecordJson() {
  await copyText(recordJsonOutput.textContent);
  setStatus("发布记录 JSON 已复制。");
}

function parseHistoryRecords() {
  const text = recordHistory.value.trim();
  if (!text) {
    return [];
  }
  try {
    const payload = JSON.parse(text);
    return Array.isArray(payload) ? payload : [payload];
  } catch {
    return text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }
}

function normalizeIssue(text) {
  return String(text)
    .replace(/[。！？!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildFeedbackRank() {
  let records = [];
  try {
    records = parseHistoryRecords();
  } catch (error) {
    return `发布记录 JSON 无法读取：${error.message}\n`;
  }
  if (records.length === 0) {
    return "等待发布记录 JSON。\n";
  }

  const issueCounts = new Map();
  const nextCounts = new Map();
  for (const record of records) {
    for (const item of record.feedback || []) {
      const normalized = normalizeIssue(item);
      if (normalized) {
        issueCounts.set(normalized, (issueCounts.get(normalized) || 0) + 1);
      }
    }
    for (const item of record.nextSteps || []) {
      const normalized = normalizeIssue(item);
      if (normalized) {
        nextCounts.set(normalized, (nextCounts.get(normalized) || 0) + 1);
      }
    }
  }

  const issues = Array.from(issueCounts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"));
  const nextSteps = Array.from(nextCounts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"));
  const lines = [
    "## Trace Atlas 反馈问题榜",
    "",
    `记录数：${records.length}`,
    "",
    "### 高频问题",
    ...(issues.length > 0 ? issues.map(([label, count], index) => `${index + 1}. ${label}（${count} 次）`) : ["暂无"]),
    "",
    "### 下一步建议",
    ...(nextSteps.length > 0 ? nextSteps.map(([label, count], index) => `${index + 1}. ${label}（${count} 次）`) : ["暂无"]),
    ""
  ];
  return `${lines.join("\n")}\n`;
}

function updateFeedbackRank() {
  feedbackRankOutput.textContent = buildFeedbackRank();
}

async function copyFeedbackRank() {
  await copyText(feedbackRankOutput.textContent);
  setStatus("反馈问题榜已复制。");
}

copyButton.addEventListener("click", copyReport);
rerunButton.addEventListener("click", runPreflight);
copyRecordButton.addEventListener("click", copyPublishRecord);
copyRecordJsonButton.addEventListener("click", copyPublishRecordJson);
copyFeedbackRankButton.addEventListener("click", copyFeedbackRank);
recordHistory.addEventListener("input", updateFeedbackRank);

for (const node of [recordUrl, recordTime, recordStatus, recordFeedback, recordAction, recordNext]) {
  node.addEventListener("input", updatePublishRecord);
}

updatePublishRecord();
runPreflight();
