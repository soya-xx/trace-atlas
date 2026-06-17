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
    id: "materials-api",
    label: "材料 API",
    url: "./materials-api.json",
    type: "json",
    validate: (data) => data.publicOnly === true && data.counts.items === 51
  },
  {
    id: "materials-packs",
    label: "材料行动包 JSON",
    url: "./materials-packs.json",
    type: "json",
    validate: (data) => data.publicOnly === true && data.counts.packs === 4 && data.counts.items === 51
  },
  {
    id: "public-health",
    label: "公开健康状态",
    url: "./public-health.json",
    type: "json",
    validate: (data) =>
      data.counts.publicLinks === 30 && data.counts.visualAssets === 9 && data.counts.verificationScripts === 10
  },
  {
    id: "verification-summary",
    label: "验证摘要",
    url: "./verification-summary.md",
    type: "text",
    mustContain: ["公开入口：30", "材料索引条目：51", "发布前自检页已公开"]
  }
];

const listNode = document.querySelector("#preflight-list");
const statusNode = document.querySelector("#preflight-status");
const reportNode = document.querySelector("#preflight-report");
const copyButton = document.querySelector("#copy-preflight");
const rerunButton = document.querySelector("#rerun-preflight");

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
  try {
    await navigator.clipboard.writeText(report);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = report;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  setStatus("自检报告已复制。");
}

copyButton.addEventListener("click", copyReport);
rerunButton.addEventListener("click", runPreflight);

runPreflight();
