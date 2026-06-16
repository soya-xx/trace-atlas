import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const MANIFEST_PATH = "promo/xhs-publish-manifest.json";
const REPORT_PATH = "promo/xhs-publish-report.md";

function renderReport(manifest) {
  assert.equal(manifest.publicOnly, true, "manifest must be public-only");
  assert.ok(Array.isArray(manifest.links) && manifest.links.length > 0, "manifest links are required");
  assert.ok(Array.isArray(manifest.assets) && manifest.assets.length > 0, "manifest assets are required");
  assert.ok(Array.isArray(manifest.tags) && manifest.tags.length > 0, "manifest tags are required");
  assert.ok(Array.isArray(manifest.checks) && manifest.checks.length > 0, "manifest checks are required");

  const links = manifest.links.map((link) => `- ${link.label}：${link.href}`).join("\n");
  const assets = manifest.assets
    .map((asset) => `| ${asset.label} | ${asset.mimeType} | ${asset.width} × ${asset.height} | ${asset.href} |`)
    .join("\n");
  const checks = manifest.checks.map((item) => `- ${item}`).join("\n");

  return `# Trace Atlas 发布前报告

来源：\`${MANIFEST_PATH}\`

## 发布标题

${manifest.title}

## 一句话说明

${manifest.summary}

## 公开链接

${links}

## 图片素材

| 素材 | 类型 | 尺寸 | 链接 |
| --- | --- | --- | --- |
${assets}

## 推荐标签

${manifest.tags.join(" ")}

## 发布前检查

${checks}

## 边界

这份报告只使用公开链接和公开素材，不包含 token、账号密钥、本地路径或原始私密聊天。
`;
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
const report = renderReport(manifest);

if (process.argv.includes("--check")) {
  assert.equal(readFileSync(REPORT_PATH, "utf8"), report, `${REPORT_PATH} is out of date`);
} else {
  writeFileSync(REPORT_PATH, report);
}
