import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const binaryExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".pdf",
  ".png",
  ".webp",
  ".zip"
]);

const forbiddenPatterns = [
  { label: "GitHub classic token", pattern: new RegExp("ghp" + "_[A-Za-z0-9_]+") },
  { label: "GitHub fine-grained token", pattern: new RegExp("github" + "_pat_[A-Za-z0-9_]+") },
  { label: "Cloudflare user token", pattern: new RegExp("cfut" + "_[A-Za-z0-9_]+") },
  { label: "OpenAI token", pattern: /sk-[A-Za-z0-9_-]{20,}/ },
  { label: "local user path", pattern: new RegExp("/Users/" + "b1lli\\b") }
];

function extensionOf(path) {
  const match = path.match(/\.[^.]+$/);
  return match ? match[0].toLowerCase() : "";
}

const trackedFiles = execFileSync("git", ["ls-files"], { encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .filter((path) => !binaryExtensions.has(extensionOf(path)));

const findings = [];
for (const path of trackedFiles) {
  const content = readFileSync(path, "utf8");
  for (const rule of forbiddenPatterns) {
    if (rule.pattern.test(content)) {
      findings.push(`${path}: ${rule.label}`);
    }
  }
}

assert.equal(findings.length, 0, `public boundary scan failed:\n${findings.join("\n")}`);
console.log("Trace Atlas public boundary scan passed.");
