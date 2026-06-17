import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const API_PATH = "materials-api.json";
const PACKS_PATH = "materials-packs.json";

const PACK_META = {
  read: {
    title: "阅读了解包",
    summary: "适合第一次打开 Trace Atlas 的读者，先看主作品、路线和材料入口。",
    action: "按顺序打开这些页面，先判断这个项目是不是你想复用的类型。"
  },
  publish: {
    title: "发帖发布包",
    summary: "适合准备小红书或外部平台发布时取用，包含图片、文档、检查清单和证据。",
    action: "发布前按清单核对链接和配图，正文只使用已经公开验证过的事实。"
  },
  reuse: {
    title: "复用接力包",
    summary: "适合把这套公开化流程带到另一个 AI 会话或作品里，优先保留机器可读数据。",
    action: "把 JSON 和模板作为起点，按自己的项目改写目标、边界和验证方式。"
  },
  verify: {
    title: "验证维护包",
    summary: "适合维护者复核公开状态、检查脚本和自动化是否仍然有效。",
    action: "从 Actions、脚本和摘要开始核验，发现过期材料后重新生成并部署。"
  }
};

function renderMarkdownList(items) {
  return items.map((item) => `- [${item.label}](${item.href})`).join("\n");
}

function renderPacks(api) {
  assert.equal(api.publicOnly, true, "materials API must be public-only");
  assert.ok(Array.isArray(api.items) && api.items.length > 0, "materials API items are required");

  const packs = Object.entries(PACK_META).map(([useCase, meta]) => {
    const items = api.items.filter((item) => item.useCase === useCase);
    assert.ok(items.length > 0, `${useCase} pack needs items`);
    return {
      id: useCase,
      ...meta,
      itemCount: items.length,
      items: items.map((item) => ({
        label: item.label,
        href: item.href,
        kind: item.kind,
        format: item.format,
        audience: item.audience
      })),
      markdown: `## ${meta.title}\n\n${meta.summary}\n\n${meta.action}\n\n${renderMarkdownList(items)}\n`
    };
  });

  return {
    schemaVersion: 1,
    name: "Trace Atlas 材料行动包",
    summary: "由 materials-api.json 生成的可复制材料包，按阅读、发布、复用和验证组织公开链接。",
    generatedFrom: API_PATH,
    publicOnly: true,
    counts: {
      packs: packs.length,
      items: packs.reduce((sum, pack) => sum + pack.itemCount, 0)
    },
    packs
  };
}

const api = JSON.parse(readFileSync(API_PATH, "utf8"));
const packs = renderPacks(api);
const output = `${JSON.stringify(packs, null, 2)}\n`;

if (process.argv.includes("--check")) {
  assert.equal(readFileSync(PACKS_PATH, "utf8"), output, `${PACKS_PATH} is out of date`);
} else {
  writeFileSync(PACKS_PATH, output);
}
