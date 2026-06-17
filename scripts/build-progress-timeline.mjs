import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const SOURCE_PATH = "progress-timeline-source.json";
const OUTPUT_PATH = "progress-timeline.json";

function padPhase(index) {
  return String(index + 1).padStart(2, "0");
}

function assertPublicHref(href, label) {
  assert.match(
    href,
    /^https:\/\/(github\.com|trace-atlas-codex\.pages\.dev)\//,
    `${label} must use a public Trace Atlas or GitHub URL`
  );
}

function renderTimeline(source) {
  assert.equal(source.schemaVersion, 1, "source schema version must be 1");
  assert.equal(source.name, "Trace Atlas 进展时间线源数据", "source name is unexpected");
  assert.ok(source.summary.length > 20, "source summary is required");
  assert.ok(Array.isArray(source.items) && source.items.length >= 20, "source needs at least 20 timeline items");

  const titles = new Set();
  const items = source.items.map((item, index) => {
    assert.ok(item.title.length >= 4, `item ${index + 1} needs a useful title`);
    assert.ok(item.summary.length >= 24, `item ${item.title} needs a useful summary`);
    assert.ok(item.evidenceLabel.length >= 3, `item ${item.title} needs an evidence label`);
    assertPublicHref(item.evidenceHref, `item ${item.title}`);
    assert.equal(titles.has(item.title), false, `duplicate timeline title: ${item.title}`);
    titles.add(item.title);

    return {
      phase: padPhase(index),
      title: item.title,
      summary: item.summary,
      evidenceLabel: item.evidenceLabel,
      evidenceHref: item.evidenceHref
    };
  });

  return {
    schemaVersion: 1,
    name: "Trace Atlas 进展时间线",
    summary: source.summary.replace("phase 编号由脚本生成。", "阶段编号由脚本生成，公开证据可逐项复核。"),
    generatedFrom: SOURCE_PATH,
    items
  };
}

const source = JSON.parse(readFileSync(SOURCE_PATH, "utf8"));
const timeline = renderTimeline(source);
const output = `${JSON.stringify(timeline, null, 2)}\n`;

if (process.argv.includes("--check")) {
  assert.equal(readFileSync(OUTPUT_PATH, "utf8"), output, `${OUTPUT_PATH} is out of date`);
} else {
  writeFileSync(OUTPUT_PATH, output);
}
