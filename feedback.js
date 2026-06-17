const DATA_URL = "./feedback-records.json";
const DATA_PUBLIC_URL = "https://trace-atlas-codex.pages.dev/feedback-records.json";

const recordCountNode = document.querySelector("#feedback-record-count");
const questionCountNode = document.querySelector("#feedback-question-count");
const nextCountNode = document.querySelector("#feedback-next-count");
const statusNode = document.querySelector("#feedback-status");
const sourceNode = document.querySelector("#feedback-source");
const questionRankNode = document.querySelector("#question-rank");
const nextRankNode = document.querySelector("#next-rank");
const evidenceListNode = document.querySelector("#evidence-list");
const recordListNode = document.querySelector("#record-list");
const markdownNode = document.querySelector("#feedback-markdown");
const copyButton = document.querySelector("#copy-feedback-board");
const inputNode = document.querySelector("#feedback-json-input");
const applyButton = document.querySelector("#apply-feedback-json");

let currentRecords = [];
let currentMarkdown = "";

function normalizeText(value) {
  return String(value || "")
    .replace(/[。！？!?；;，,、\s]+$/g, "")
    .trim();
}

function listFrom(value) {
  return Array.isArray(value) ? value.map(normalizeText).filter(Boolean) : [];
}

function countItems(records, key) {
  const counts = new Map();
  for (const record of records) {
    for (const item of listFrom(record[key])) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "zh-CN"));
}

function uniqueEvidence(records) {
  const seen = new Set();
  const links = [];
  for (const record of records) {
    for (const href of listFrom(record.evidence)) {
      if (seen.has(href)) continue;
      seen.add(href);
      links.push(href);
    }
  }
  return links;
}

function parseRecords(raw) {
  const text = raw.trim();
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.records)) return parsed.records;
    return [parsed];
  } catch {
    return text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line));
  }
}

function createRankItem(item) {
  const li = document.createElement("li");
  const label = document.createElement("span");
  const count = document.createElement("strong");
  label.textContent = item.label;
  count.textContent = `${item.count} 次`;
  li.append(label, count);
  return li;
}

function renderRank(node, items, emptyText) {
  if (items.length === 0) {
    const li = document.createElement("li");
    li.textContent = emptyText;
    node.replaceChildren(li);
    return;
  }
  node.replaceChildren(...items.slice(0, 6).map(createRankItem));
}

function renderEvidence(links) {
  if (links.length === 0) {
    evidenceListNode.textContent = "暂无证据链接。";
    return;
  }
  evidenceListNode.replaceChildren(
    ...links.slice(0, 9).map((href) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = href;
      return a;
    })
  );
}

function renderRecords(records) {
  recordListNode.replaceChildren(
    ...records.map((record, index) => {
      const article = document.createElement("article");
      article.className = "record-card";

      const eyebrow = document.createElement("p");
      eyebrow.className = "eyebrow";
      eyebrow.textContent = record.status || "记录";

      const title = document.createElement("h2");
      title.textContent = `记录 ${index + 1}`;

      const meta = document.createElement("p");
      meta.textContent = `${record.publishedAt || "未记录时间"} · ${record.preflight?.passed || 0}/${record.preflight?.total || 0} 自检`;

      const link = document.createElement("a");
      link.href = record.postUrl || DATA_PUBLIC_URL;
      link.textContent = record.postUrl || "打开数据源";

      article.append(eyebrow, title, meta, link);
      return article;
    })
  );
}

function buildMarkdown(records, questions, nextSteps, links) {
  const lines = [
    "## Trace Atlas 反馈问题榜",
    "",
    `记录数：${records.length}`,
    `问题种类：${questions.length}`,
    `下一步动作：${nextSteps.length}`,
    "",
    "### 高频问题",
    ...(questions.length ? questions.slice(0, 6).map((item, index) => `${index + 1}. ${item.label}（${item.count} 次）`) : ["暂无"]),
    "",
    "### 下一步动作",
    ...(nextSteps.length ? nextSteps.slice(0, 6).map((item, index) => `${index + 1}. ${item.label}（${item.count} 次）`) : ["暂无"]),
    "",
    "### 证据入口",
    ...(links.length ? links.slice(0, 9).map((href) => `- ${href}`) : ["暂无"])
  ];
  return `${lines.join("\n")}\n`;
}

function render(records, sourceLabel) {
  currentRecords = records;
  const questions = countItems(records, "feedback");
  const nextSteps = countItems(records, "nextSteps");
  const links = uniqueEvidence(records);

  recordCountNode.textContent = String(records.length);
  questionCountNode.textContent = String(questions.length);
  nextCountNode.textContent = String(nextSteps.length);
  statusNode.textContent = records.length > 0 ? "已生成" : "无记录";
  sourceNode.textContent = sourceLabel;
  renderRank(questionRankNode, questions, "暂无问题记录。");
  renderRank(nextRankNode, nextSteps, "暂无下一步动作。");
  renderEvidence(links);
  renderRecords(records);
  currentMarkdown = buildMarkdown(records, questions, nextSteps, links);
  markdownNode.textContent = currentMarkdown;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Some embedded browsers expose the Clipboard API but deny writes.
      // Keep the user gesture alive and fall back to the older copy path.
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

async function copyMarkdown() {
  await copyText(currentMarkdown);
  statusNode.textContent = "已复制";
  sourceNode.textContent = `已复制 ${currentRecords.length} 条记录生成的问题榜。`;
}

async function loadRecords() {
  statusNode.textContent = "读取中";
  const response = await fetch(DATA_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  render(data.records || [], `${data.name} · ${data.source === "example" ? "公开样例" : "公开记录"}`);
  inputNode.value = JSON.stringify(data.records || [], null, 2);
}

function applyInputRecords() {
  try {
    const records = parseRecords(inputNode.value);
    render(records, "来自本地输入，未上传。");
  } catch (error) {
    statusNode.textContent = "解析失败";
    sourceNode.textContent = error.message;
  }
}

copyButton.addEventListener("click", copyMarkdown);
applyButton.addEventListener("click", applyInputRecords);
inputNode.addEventListener("input", () => {
  statusNode.textContent = "待生成";
  sourceNode.textContent = "输入已变化，点击生成榜单。";
});

loadRecords().catch((error) => {
  statusNode.textContent = "读取失败";
  sourceNode.textContent = error.message;
});
