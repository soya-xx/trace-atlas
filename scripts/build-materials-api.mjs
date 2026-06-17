import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const INDEX_PATH = "materials-index.json";
const API_PATH = "materials-api.json";

const GROUP_META = {
  pages: {
    kind: "page",
    useCase: "read",
    audience: "reader"
  },
  "visual-assets": {
    kind: "image",
    useCase: "publish",
    audience: "creator"
  },
  "publish-docs": {
    kind: "document",
    useCase: "publish",
    audience: "creator"
  },
  "machine-data": {
    kind: "data",
    useCase: "reuse",
    audience: "tool"
  },
  verification: {
    kind: "verification",
    useCase: "verify",
    audience: "maintainer"
  }
};

function assertPublicHref(href, label) {
  assert.match(
    href,
    /^https:\/\/(github\.com|trace-atlas-codex\.pages\.dev)\//,
    `${label} must use a public Trace Atlas or GitHub URL`
  );
}

function inferFormat(href) {
  if (href.endsWith(".png")) return "image/png";
  if (href.endsWith(".svg")) return "image/svg+xml";
  if (href.endsWith(".md")) return "text/markdown";
  if (href.endsWith(".json")) return "application/json";
  if (href.endsWith(".mjs")) return "text/javascript";
  if (href.includes("/blob/main/scripts/")) return "source/script";
  if (href.includes("/actions/")) return "github/actions";
  if (href.includes("/issues/")) return "github/issue";
  return "text/html";
}

function renderApi(index) {
  assert.equal(index.schemaVersion, 1, "materials index schema version must be 1");
  assert.ok(Array.isArray(index.groups) && index.groups.length > 0, "materials index groups are required");

  const items = [];
  for (const group of index.groups) {
    const meta = GROUP_META[group.id];
    assert.ok(meta, `missing metadata for group ${group.id}`);
    assert.ok(group.title.length > 0, `group ${group.id} needs a title`);
    assert.ok(Array.isArray(group.items) && group.items.length > 0, `group ${group.id} needs items`);

    for (const item of group.items) {
      assert.ok(item.label.length > 0, `item in ${group.id} needs a label`);
      assertPublicHref(item.href, item.label);
      items.push({
        id: `${group.id}:${item.label}`,
        label: item.label,
        href: item.href,
        groupId: group.id,
        groupTitle: group.title,
        kind: meta.kind,
        useCase: meta.useCase,
        audience: meta.audience,
        format: inferFormat(item.href)
      });
    }
  }

  assert.equal(new Set(items.map((item) => item.id)).size, items.length, "materials API item ids must be unique");

  return {
    schemaVersion: 1,
    name: "Trace Atlas 材料 API",
    summary: "由 materials-index.json 生成的扁平公开材料索引，方便脚本按用途、格式和受众筛选。",
    generatedFrom: INDEX_PATH,
    publicOnly: true,
    counts: {
      groups: index.groups.length,
      items: items.length
    },
    items
  };
}

const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
const api = renderApi(index);
const output = `${JSON.stringify(api, null, 2)}\n`;

if (process.argv.includes("--check")) {
  assert.equal(readFileSync(API_PATH, "utf8"), output, `${API_PATH} is out of date`);
} else {
  writeFileSync(API_PATH, output);
}
