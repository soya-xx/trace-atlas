const API_URL = "./materials-api.json";
const PACKS_URL = "./materials-packs.json";

const labels = {
  all: "全部",
  read: "阅读了解",
  publish: "发帖发布",
  reuse: "复用接力",
  verify: "验证维护"
};

const guideList = document.querySelector("#guide-list");
const guideStatus = document.querySelector("#guide-status");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const copyPackButton = document.querySelector("#copy-pack");
const packTitle = document.querySelector("#pack-title");
const packSummary = document.querySelector("#pack-summary");

let materials = [];
let packs = [];
let activeFilter = "all";

function setStatus(message) {
  guideStatus.textContent = message;
}

function createCard(item) {
  const article = document.createElement("article");
  article.className = "guide-card";

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = `${item.groupTitle} / ${item.format}`;

  const title = document.createElement("h2");
  title.textContent = item.label;

  const meta = document.createElement("p");
  meta.textContent = `用途：${labels[item.useCase] || item.useCase}；受众：${item.audience}；类型：${item.kind}`;

  const actions = document.createElement("div");
  actions.className = "guide-actions";

  const open = document.createElement("a");
  open.href = item.href;
  open.textContent = "打开";
  open.target = "_blank";
  open.rel = "noreferrer";

  const copy = document.createElement("button");
  copy.className = "copy-button";
  copy.type = "button";
  copy.textContent = "复制链接";
  copy.addEventListener("click", () => copyLink(item.href));

  actions.append(open, copy);
  article.append(eyebrow, title, meta, actions);
  return article;
}

async function copyLink(href) {
  await copyText(href);
  setStatus("链接已复制。");
}

function currentPack() {
  return packs.find((pack) => pack.id === activeFilter);
}

function allMarkdown() {
  return `## 全部材料\n\n${materials.map((item) => `- [${item.label}](${item.href})`).join("\n")}\n`;
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

async function copyCurrentPack() {
  const pack = currentPack();
  await copyText(pack ? pack.markdown : allMarkdown());
  setStatus("当前行动包已复制。");
}

function filteredItems() {
  if (activeFilter === "all") {
    return materials;
  }
  return materials.filter((item) => item.useCase === activeFilter);
}

function render() {
  const items = filteredItems();
  guideList.replaceChildren(...items.map(createCard));
  setStatus(`${labels[activeFilter]}：${items.length} 个材料。`);
  const pack = currentPack();
  packTitle.textContent = pack ? pack.title : "全部材料";
  packSummary.textContent = pack ? `${pack.summary} ${pack.action}` : "当前显示所有公开材料，复制后会得到完整链接清单。";

  for (const button of filterButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
  }
}

async function loadMaterials() {
  try {
    const [apiResponse, packsResponse] = await Promise.all([fetch(API_URL), fetch(PACKS_URL)]);
    if (!apiResponse.ok || !packsResponse.ok) {
      throw new Error("materials data unavailable");
    }
    const payload = await apiResponse.json();
    const packPayload = await packsResponse.json();
    materials = payload.items;
    packs = packPayload.packs;
    render();
  } catch {
    setStatus("材料 API 暂时不可读，请打开材料总览。");
  }
}

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    render();
  });
}

copyPackButton.addEventListener("click", copyCurrentPack);

loadMaterials();
