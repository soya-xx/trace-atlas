import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

class MockElement {
  constructor(tagName, options = {}) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.dataset = options.dataset || {};
    this.id = options.id || "";
    this.style = {};
    this.textContent = options.textContent || "";
    this.value = "";
  }

  append(...children) {
    this.children.push(...children);
  }

  closest(selector) {
    return selector === "[data-copy]" && this.dataset.copy ? this : null;
  }

  remove() {
    this.removed = true;
  }

  select() {
    this.selected = true;
  }

  setAttribute(name, value) {
    this[name] = String(value);
  }
}

class MockDocument {
  constructor({ execSucceeds = true } = {}) {
    this.body = new MockElement("body");
    this.execSucceeds = execSucceeds;
    this.listeners = new Map();
    this.status = new MockElement("p", { id: "copy-status", textContent: "复制台已就绪。" });
    this.lastField = null;
  }

  addEventListener(name, handler) {
    const handlers = this.listeners.get(name) || [];
    handlers.push(handler);
    this.listeners.set(name, handlers);
  }

  createElement(tagName) {
    const element = new MockElement(tagName);
    this.lastField = element;
    return element;
  }

  execCommand(command) {
    assert.equal(command, "copy");
    return this.execSucceeds;
  }

  querySelector(selector) {
    return selector === "#copy-status" ? this.status : null;
  }

  async dispatchClick(target) {
    const handlers = this.listeners.get("click") || [];
    await Promise.all(handlers.map((handler) => handler({ target })));
  }
}

function createRuntime({ secure = true, withClipboard = true, execSucceeds = true, clipboardFails = false } = {}) {
  const document = new MockDocument({ execSucceeds });
  let clipboardText = "";
  const navigator = withClipboard
    ? {
        clipboard: {
          writeText: async (text) => {
            if (clipboardFails) {
              throw new Error("clipboard unavailable");
            }
            clipboardText = text;
          }
        }
      }
    : {};
  const context = {
    document,
    navigator,
    window: { isSecureContext: secure }
  };
  vm.runInNewContext(readFileSync("launch.js", "utf8"), context, { filename: "launch.js" });
  return {
    button(label, text) {
      return new MockElement("button", { dataset: { copy: text }, textContent: label });
    },
    document,
    get clipboardText() {
      return clipboardText;
    }
  };
}

const clipboardRuntime = createRuntime();
await clipboardRuntime.document.dispatchClick(clipboardRuntime.button("复制标题", "我把AI会话做成网站"));
assert.equal(clipboardRuntime.clipboardText, "我把AI会话做成网站");
assert.equal(clipboardRuntime.document.status.textContent, "复制标题成功。");

const fallbackRuntime = createRuntime({ secure: false, withClipboard: false });
await fallbackRuntime.document.dispatchClick(fallbackRuntime.button("复制标签", "#AI工作流 #Codex"));
assert.equal(fallbackRuntime.document.lastField.value, "#AI工作流 #Codex");
assert.equal(fallbackRuntime.document.lastField.selected, true);
assert.equal(fallbackRuntime.document.lastField.removed, true);
assert.equal(fallbackRuntime.document.status.textContent, "复制标签成功。");

const clipboardFailureRuntime = createRuntime({ clipboardFails: true });
await clipboardFailureRuntime.document.dispatchClick(clipboardFailureRuntime.button("复制主链接", "https://trace-atlas-codex.pages.dev/"));
assert.equal(clipboardFailureRuntime.document.lastField.value, "https://trace-atlas-codex.pages.dev/");
assert.equal(clipboardFailureRuntime.document.status.textContent, "复制主链接成功。");

const failureRuntime = createRuntime({ secure: false, withClipboard: false, execSucceeds: false });
await failureRuntime.document.dispatchClick(failureRuntime.button("复制证据包链接", "https://trace-atlas-codex.pages.dev/evidence-pack.md"));
assert.equal(failureRuntime.document.status.textContent, "复制失败，请打开对应链接手动复制。");

const ignoredRuntime = createRuntime();
await ignoredRuntime.document.dispatchClick(new MockElement("span", { textContent: "普通文本" }));
assert.equal(ignoredRuntime.document.status.textContent, "复制台已就绪。");

console.log("Trace Atlas launch verification passed.");
