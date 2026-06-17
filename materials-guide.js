const API_URL = "./materials-api.json";

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

let materials = [];
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
  try {
    await navigator.clipboard.writeText(href);
    setStatus("链接已复制。");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = href;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    setStatus("链接已复制。");
  }
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

  for (const button of filterButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
  }
}

async function loadMaterials() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const payload = await response.json();
    materials = payload.items;
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

loadMaterials();
