import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { TextDecoder, TextEncoder } from "node:util";
import vm from "node:vm";

const provenanceLedger = JSON.parse(readFileSync("trace-ledger.json", "utf8"));
const worldSync = JSON.parse(readFileSync("world-sync.json", "utf8"));

class MockElement {
  constructor(tagName, id = "") {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.style = {};
    this.className = "";
    this.textContent = "";
    this.value = "";
    this.files = [];
  }

  append(...children) {
    this.children.push(...children);
  }

  replaceChildren(...children) {
    this.children = [...children];
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(name, handler) {
    const handlers = this.listeners.get(name) ?? [];
    handlers.push(handler);
    this.listeners.set(name, handlers);
  }

  async dispatch(name, event = {}) {
    const handlers = this.listeners.get(name) ?? [];
    await Promise.all(handlers.map((handler) => handler({ target: this, ...event })));
  }

  click() {
    return this.dispatch("click");
  }

  focus() {}

  getBoundingClientRect() {
    return { width: 900, height: 720, left: 0, top: 0 };
  }
}

class MockCanvas extends MockElement {
  constructor(id) {
    super("canvas", id);
    this.width = 900;
    this.height = 720;
  }

  getContext() {
    return {
      arc() {},
      beginPath() {},
      clearRect() {},
      fill() {},
      fillRect() {},
      fillText() {},
      lineTo() {},
      measureText: (text) => ({ width: String(text).length * 7 }),
      moveTo() {},
      quadraticCurveTo() {},
      restore() {},
      rotate() {},
      save() {},
      setLineDash() {},
      setTransform() {},
      stroke() {},
      strokeRect() {},
      translate() {}
    };
  }
}

class MockDocument {
  constructor() {
    this.elements = new Map();
    this.body = new MockElement("body");
  }

  register(element) {
    if (element.id) {
      this.elements.set(`#${element.id}`, element);
    }
    return element;
  }

  querySelector(selector) {
    return this.elements.get(selector) ?? null;
  }

  createElement(tagName) {
    return new MockElement(tagName);
  }
}

function createRuntime() {
  const document = new MockDocument();
  const ids = [
    "trace-count",
    "trace-status",
    "offline-status",
    "selected-title",
    "selected-line",
    "selected-kind",
    "selected-weight",
    "selected-body",
    "trace-input",
    "plant-trace",
    "export-traces",
    "clear-local",
    "tour-traces",
    "capsule-traces",
    "snapshot-traces",
    "import-traces",
    "import-file",
    "fingerprint-note",
    "world-status",
    "world-links",
    "ledger-status",
    "ledger-list",
    "storage-note",
    "trace-list"
  ];
  document.register(new MockCanvas("trace-canvas"));
  for (const id of ids) {
    document.register(new MockElement(id === "trace-input" ? "textarea" : "div", id));
  }

  const store = new Map();
  const listeners = new Map();
  const location = {
    href: "http://127.0.0.1:4174/",
    hash: ""
  };
  const history = {
    replaceState(_state, _title, url) {
      location.href = String(url);
      const hashIndex = location.href.indexOf("#");
      location.hash = hashIndex >= 0 ? location.href.slice(hashIndex) : "";
    }
  };
  const createdBlobs = [];
  const context = {
    atob: (value) => Buffer.from(value, "base64").toString("binary"),
    btoa: (value) => Buffer.from(value, "binary").toString("base64"),
    Blob,
    TextDecoder,
    TextEncoder,
    URL: {
      createObjectURL: (blob) => {
        createdBlobs.push(blob);
        return `blob:trace-${createdBlobs.length}`;
      },
      revokeObjectURL() {}
    },
    document,
    fetch: async (url) => {
      const requestUrl = String(url);
      if (requestUrl.includes("trace-ledger.json")) {
        return {
          ok: true,
          json: async () => provenanceLedger
        };
      }
      if (requestUrl.includes("world-sync.json")) {
        return {
          ok: true,
          json: async () => worldSync
        };
      }
      return {
        ok: false,
        json: async () => ({})
      };
    },
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      removeItem: (key) => store.delete(key),
      setItem: (key, value) => store.set(key, String(value))
    },
    navigator: {},
    performance: { now: () => 1000 },
    requestAnimationFrame: () => 1,
    window: {
      addEventListener(name, handler) {
        const handlers = listeners.get(name) ?? [];
        handlers.push(handler);
        listeners.set(name, handlers);
      },
      clearInterval,
      confirm: () => true,
      devicePixelRatio: 1,
      history,
      location,
      setInterval
    }
  };
  context.history = history;
  context.location = location;
  context.window.localStorage = context.localStorage;
  context.window.navigator = context.navigator;
  context.window.performance = context.performance;
  context.window.requestAnimationFrame = context.requestAnimationFrame;
  context.window.URL = context.URL;
  context.window.Blob = Blob;
  context.window.fetch = context.fetch;
  context.window.TextDecoder = TextDecoder;
  context.window.TextEncoder = TextEncoder;
  return { context, createdBlobs, document, listeners, location, store };
}

async function flushAsync() {
  for (let index = 0; index < 6; index += 1) {
    await Promise.resolve();
  }
}

const runtime = createRuntime();
vm.runInNewContext(readFileSync("app.js", "utf8"), runtime.context, { filename: "app.js" });
await flushAsync();

assert.equal(runtime.document.querySelector("#ledger-status").textContent, "12 条");
assert.equal(runtime.document.querySelector("#ledger-list").children.length, 12);
const firstLedgerEntry = runtime.document.querySelector("#ledger-list").children[0];
assert.equal(firstLedgerEntry.children[0].textContent, "834d3b7");
assert.equal(firstLedgerEntry.children[1].children[0].textContent, "创建 Trace Atlas 作品");
assert.equal(runtime.document.querySelector("#world-status").textContent, "公开");
assert.equal(runtime.document.querySelector("#world-links").children.length, 4);
const firstWorldLink = runtime.document.querySelector("#world-links").children[0].children[0];
assert.equal(firstWorldLink.href, "https://trace-atlas-codex.pages.dev/");
assert.equal(firstWorldLink.children[0].textContent, "Cloudflare Pages");

const importFile = runtime.document.querySelector("#import-file");
importFile.files = [
  {
    text: async () =>
      JSON.stringify({
        name: "Trace Atlas",
        traces: [
          {
            id: "agency-granted",
            body: "Seed should not be imported as local.",
            local: false
          },
          {
            body: "Runtime import proves the archive can return.",
            color: "\" onload=\"alert(1)",
            createdAt: "2026-06-17T00:00:00.000Z",
            local: true
          }
        ]
      })
  }
];
await importFile.dispatch("change");

assert.equal(runtime.document.querySelector("#trace-count").textContent, "5 条痕迹");
assert.match(runtime.document.querySelector("#trace-status").textContent, /^已导入 1:/);
assert.equal(runtime.document.querySelector("#storage-note").textContent, "已保存 1 条本地痕迹。");
assert.equal(runtime.document.querySelector("#offline-status").textContent, "在线外壳");

const stored = JSON.parse(runtime.store.get("whatever.trace-atlas.v1"));
assert.equal(stored.length, 1);
assert.equal(stored[0].body, "Runtime import proves the archive can return.");
assert.match(stored[0].id, /^local-/);

const fingerprint = runtime.document.querySelector("#fingerprint-note").textContent.replace("指纹 ", "");
assert.match(fingerprint, /^atlas-[0-9a-f]{8}$/);

await runtime.document.querySelector("#export-traces").dispatch("click");
assert.equal(runtime.createdBlobs.length, 1);
assert.equal(runtime.createdBlobs[0].type, "application/json");
const archiveExport = JSON.parse(await runtime.createdBlobs[0].text());
assert.equal(archiveExport.fingerprint, fingerprint);

await runtime.document.querySelector("#snapshot-traces").dispatch("click");
assert.match(runtime.document.querySelector("#trace-status").textContent, /^快照已保存（5）$/);
assert.equal(runtime.createdBlobs.length, 2);
assert.equal(runtime.createdBlobs[1].type, "image/svg+xml");
const snapshotSvg = await runtime.createdBlobs[1].text();
assert.match(snapshotSvg, /<title id="title">Trace Atlas 快照<\/title>/);
assert.match(snapshotSvg, /Runtime import proves the archive can return\./);
assert.match(snapshotSvg, new RegExp(`5 条痕迹 / 1 条本地 / ${fingerprint}`));
assert.match(snapshotSvg, new RegExp(`指纹：${fingerprint}`));
assert.doesNotMatch(snapshotSvg, /onload=/);

await runtime.document.querySelector("#capsule-traces").dispatch("click");
assert.match(runtime.location.hash, /^#capsule=/);
assert.match(runtime.document.querySelector("#trace-status").textContent, /^胶囊链接已生成（1）$/);
const capsulePayload = JSON.parse(Buffer.from(runtime.location.hash.slice("#capsule=".length), "base64url").toString("utf8"));
assert.equal(capsulePayload.fingerprint, fingerprint);

const restoredRuntime = createRuntime();
restoredRuntime.location.href = runtime.location.href;
restoredRuntime.location.hash = runtime.location.hash;
vm.runInNewContext(readFileSync("app.js", "utf8"), restoredRuntime.context, { filename: "app.js" });
await flushAsync();
assert.equal(restoredRuntime.document.querySelector("#trace-count").textContent, "5 条痕迹");
assert.match(restoredRuntime.document.querySelector("#trace-status").textContent, /^已恢复 1:/);
assert.equal(restoredRuntime.document.querySelector("#fingerprint-note").textContent, `指纹 ${fingerprint}`);
const restoredStored = JSON.parse(restoredRuntime.store.get("whatever.trace-atlas.v1"));
assert.equal(restoredStored[0].body, "Runtime import proves the archive can return.");

const keyHandlers = runtime.listeners.get("keydown") ?? [];
assert.equal(keyHandlers.length, 1);
keyHandlers[0]({ key: "ArrowRight", preventDefault() {}, target: runtime.document.body });
assert.match(runtime.document.querySelector("#trace-status").textContent, /^已选中:/);

console.log("Trace Atlas runtime verification passed.");
