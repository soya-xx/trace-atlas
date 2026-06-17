const DATA_URL = "./feedback-records.json";
const DATA_PUBLIC_URL = "https://trace-atlas-codex.pages.dev/feedback-records.json";

const FAQ_ITEMS = [
  {
    id: "reuse",
    question: "能不能复用到自己的项目？",
    match: ["复用到自己的项目"],
    answer:
      "可以。这个项目把“公开页面、传播素材、机器可读数据、验证脚本、issue 记录”拆成独立材料，你可以从开始复用页拿走最小步骤，也可以用材料选择器按发布、复用、验证三种目的筛选。",
    links: [
      ["开始复用入口", "https://trace-atlas-codex.pages.dev/start"],
      ["复用路线页", "https://trace-atlas-codex.pages.dev/reuse"],
      ["材料选择器", "https://trace-atlas-codex.pages.dev/materials-guide"]
    ]
  },
  {
    id: "start",
    question: "第一次打开应该从哪里看？",
    match: ["从哪里开始看"],
    answer:
      "只想快速理解作品，可以先看主站和开始复用入口；想发帖或复查材料，就看发布材料页；想确认所有公开入口是否还活着，就打开发布前自检。",
    links: [
      ["主作品", "https://trace-atlas-codex.pages.dev/"],
      ["发布材料", "https://trace-atlas-codex.pages.dev/launch"],
      ["发布前自检", "https://trace-atlas-codex.pages.dev/preflight"]
    ]
  },
  {
    id: "verify",
    question: "怎么确认公开链接都有效？",
    match: ["确认公开链接都有效"],
    answer:
      "公开链接不是靠口头承诺。预检页会在浏览器里请求关键页面、JSON、SVG 和 PNG；仓库里的 `npm run check` 还会检查结构、边界扫描、材料生成一致性和验证摘要。",
    links: [
      ["发布前自检", "https://trace-atlas-codex.pages.dev/preflight"],
      ["公开健康状态", "https://trace-atlas-codex.pages.dev/public-health.json"],
      ["GitHub Actions", "https://github.com/soya-xx/trace-atlas/actions/workflows/verify.yml"]
    ]
  },
  {
    id: "pack",
    question: "有没有一键复制的材料包？",
    match: ["一键复制的材料包"],
    answer:
      "有。材料选择器会按“阅读、发布、复用、验证”生成行动包；每个行动包都有独立页面和可复制清单，适合发给不同角色的人。",
    links: [
      ["材料行动包 JSON", "https://trace-atlas-codex.pages.dev/materials-packs.json"],
      ["发帖发布行动包", "https://trace-atlas-codex.pages.dev/pack-publish"],
      ["验证维护行动包", "https://trace-atlas-codex.pages.dev/pack-verify"]
    ]
  },
  {
    id: "feedback",
    question: "发布之后反馈怎么回流？",
    match: ["反馈怎么回流"],
    answer:
      "发布后把评论、问题、处理动作和下一步写成发布记录 JSON。反馈问题榜会合并重复问题，FAQ 页再把这些问题变成长期可引用的回答。",
    links: [
      ["反馈问题榜", "https://trace-atlas-codex.pages.dev/feedback"],
      ["反馈记录 JSON", DATA_PUBLIC_URL],
      ["工作日志 issue", "https://github.com/soya-xx/trace-atlas/issues/1"]
    ]
  }
];

const recordCountNode = document.querySelector("#faq-record-count");
const itemCountNode = document.querySelector("#faq-item-count");
const evidenceCountNode = document.querySelector("#faq-evidence-count");
const statusNode = document.querySelector("#faq-status");
const sourceNode = document.querySelector("#faq-source");
const faqListNode = document.querySelector("#faq-list");
const evidenceListNode = document.querySelector("#faq-evidence-list");
const recordListNode = document.querySelector("#faq-record-list");
const markdownNode = document.querySelector("#faq-markdown");
const copyButton = document.querySelector("#copy-faq-summary");

let currentMarkdown = "";

function normalizeText(value) {
  return String(value || "").trim();
}

function listFrom(value) {
  return Array.isArray(value) ? value.map(normalizeText).filter(Boolean) : [];
}

function countMatches(records, patterns) {
  return records.reduce((sum, record) => {
    const questions = listFrom(record.feedback);
    return sum + questions.filter((question) => patterns.some((pattern) => question.includes(pattern))).length;
  }, 0);
}

function uniqueRecordEvidence(records) {
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

function uniqueFaqLinks(items) {
  const seen = new Set();
  const links = [];
  for (const item of items) {
    for (const [label, href] of item.links) {
      if (seen.has(href)) continue;
      seen.add(href);
      links.push({ label, href });
    }
  }
  return links;
}

function createFaqCard(item) {
  const article = document.createElement("article");
  article.className = "faq-card";

  const meta = document.createElement("p");
  meta.className = "eyebrow";
  meta.textContent = item.count > 0 ? `反馈中出现 ${item.count} 次` : "补充说明";

  const title = document.createElement("h2");
  title.textContent = item.question;

  const answer = document.createElement("p");
  answer.textContent = item.answer;

  const links = document.createElement("div");
  links.className = "faq-evidence";
  for (const [label, href] of item.links) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    links.append(a);
  }

  article.append(meta, title, answer, links);
  return article;
}

function renderEvidence(links) {
  if (links.length === 0) {
    evidenceListNode.textContent = "暂无证据链接。";
    return;
  }
  evidenceListNode.replaceChildren(
    ...links.map(({ label, href }) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = `${label}：${href}`;
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
      meta.textContent = `${record.publishedAt || "未记录时间"} · ${listFrom(record.feedback).length} 个问题`;

      const link = document.createElement("a");
      link.href = record.postUrl || DATA_PUBLIC_URL;
      link.textContent = record.postUrl || "打开数据源";

      article.append(eyebrow, title, meta, link);
      return article;
    })
  );
}

function buildMarkdown(records, items, links) {
  const lines = [
    "## Trace Atlas 公开 FAQ",
    "",
    `记录数：${records.length}`,
    `FAQ 条目：${items.length}`,
    `证据入口：${links.length}`,
    "",
    ...items.flatMap((item, index) => [
      `### ${index + 1}. ${item.question}`,
      `反馈中出现：${item.count} 次`,
      item.answer,
      ...item.links.map(([label, href]) => `- ${label}：${href}`),
      ""
    ])
  ];
  return `${lines.join("\n").trim()}\n`;
}

function render(records, sourceLabel) {
  const enrichedItems = FAQ_ITEMS.map((item) => ({
    ...item,
    count: countMatches(records, item.match)
  }));
  const faqLinks = uniqueFaqLinks(enrichedItems);
  const recordLinks = uniqueRecordEvidence(records).map((href) => ({ label: "反馈记录证据", href }));
  const evidenceLinks = [...faqLinks, ...recordLinks];

  recordCountNode.textContent = String(records.length);
  itemCountNode.textContent = String(enrichedItems.length);
  evidenceCountNode.textContent = String(evidenceLinks.length);
  statusNode.textContent = records.length > 0 ? "已生成" : "无记录";
  sourceNode.textContent = sourceLabel;
  faqListNode.replaceChildren(...enrichedItems.map(createFaqCard));
  renderEvidence(evidenceLinks);
  renderRecords(records);
  currentMarkdown = buildMarkdown(records, enrichedItems, evidenceLinks);
  markdownNode.textContent = currentMarkdown;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Embedded browsers can expose Clipboard API but deny writes.
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

async function copyFaqSummary() {
  await copyText(currentMarkdown);
  statusNode.textContent = "已复制";
  sourceNode.textContent = "FAQ 摘要已复制。";
}

async function loadRecords() {
  statusNode.textContent = "读取中";
  const response = await fetch(DATA_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  render(data.records || [], `${data.name} · ${data.source === "example" ? "公开样例" : "公开记录"}`);
}

copyButton.addEventListener("click", copyFaqSummary);

loadRecords().catch((error) => {
  statusNode.textContent = "读取失败";
  sourceNode.textContent = error.message;
});
