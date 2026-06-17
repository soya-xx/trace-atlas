import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const PUBLIC_HEALTH_PATH = "public-health.json";
const MATERIALS_INDEX_PATH = "materials-index.json";
const REUSE_MAP_PATH = "reuse-map.json";
const SUMMARY_PATH = "verification-summary.md";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function listItems(items, render) {
  return items.map(render).join("\n");
}

function renderSummary({ publicHealth, materialsIndex, reuseMap }) {
  assert.equal(publicHealth.status, "可公开访问", "public health must be online");
  assert.equal(reuseMap.publicOnly, true, "reuse map must be public-only");
  assert.ok(materialsIndex.groups.length > 0, "materials index groups are required");

  const materialCount = materialsIndex.groups.reduce((sum, group) => sum + group.items.length, 0);
  const checks = listItems(
    publicHealth.checks,
    (check) => `- ${check.label}：${check.state}，证据：${check.evidenceHref}`
  );
  const materialGroups = listItems(
    materialsIndex.groups,
    (group) => `- ${group.title}：${group.items.length} 项`
  );
  const reuseNodes = listItems(
    reuseMap.nodes,
    (node) => `- ${node.label}：${node.href}`
  );
  const representations = listItems(
    reuseMap.representations,
    (item) => `- ${item.label}（${item.format}）：${item.href}`
  );
  const boundaries = listItems(reuseMap.boundaries, (item) => `- ${item}`);

  return `# Trace Atlas 验证摘要

来源：\`${PUBLIC_HEALTH_PATH}\`、\`${MATERIALS_INDEX_PATH}\`、\`${REUSE_MAP_PATH}\`

这份摘要只使用公开 JSON 和公开链接，方便读者、维护者和 issue 评论快速复核当前状态。

## 当前状态

- 状态：${publicHealth.status}
- 公开入口：${publicHealth.counts.publicLinks}
- 视觉素材：${publicHealth.counts.visualAssets}
- 发布文档：${publicHealth.counts.publishDocuments}
- 验证脚本：${publicHealth.counts.verificationScripts}
- 材料索引条目：${materialCount}

## 公开检查

${checks}

## 材料分组

${materialGroups}

## 复用链路

- 入口：${reuseMap.entryUrl}
- 核心节点：${reuseMap.nodes.length}
- 连接关系：${reuseMap.edges.length}

${reuseNodes}

## 读者呈现

${representations}

## 公开边界

${boundaries}

## 本地复核命令

\`\`\`bash
npm run check
node scripts/build-verification-summary.mjs --check
\`\`\`
`;
}

const summary = renderSummary({
  publicHealth: readJson(PUBLIC_HEALTH_PATH),
  materialsIndex: readJson(MATERIALS_INDEX_PATH),
  reuseMap: readJson(REUSE_MAP_PATH)
});

if (process.argv.includes("--check")) {
  assert.equal(readFileSync(SUMMARY_PATH, "utf8"), summary, `${SUMMARY_PATH} is out of date`);
} else {
  writeFileSync(SUMMARY_PATH, summary);
}
