import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { TextDecoder, TextEncoder } from "node:util";
import vm from "node:vm";

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
  context.window.TextDecoder = TextDecoder;
  context.window.TextEncoder = TextEncoder;
  return { context, createdBlobs, document, listeners, location, store };
}

const runtime = createRuntime();
vm.runInNewContext(readFileSync("app.js", "utf8"), runtime.context, { filename: "app.js" });

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

assert.equal(runtime.document.querySelector("#trace-count").textContent, "5 traces");
assert.match(runtime.document.querySelector("#trace-status").textContent, /^Imported 1:/);
assert.equal(runtime.document.querySelector("#storage-note").textContent, "1 local trace stored.");
assert.equal(runtime.document.querySelector("#offline-status").textContent, "Live shell");

const stored = JSON.parse(runtime.store.get("whatever.trace-atlas.v1"));
assert.equal(stored.length, 1);
assert.equal(stored[0].body, "Runtime import proves the archive can return.");
assert.match(stored[0].id, /^local-/);

const fingerprint = runtime.document.querySelector("#fingerprint-note").textContent.replace("fingerprint ", "");
assert.match(fingerprint, /^atlas-[0-9a-f]{8}$/);

await runtime.document.querySelector("#export-traces").dispatch("click");
assert.equal(runtime.createdBlobs.length, 1);
assert.equal(runtime.createdBlobs[0].type, "application/json");
const archiveExport = JSON.parse(await runtime.createdBlobs[0].text());
assert.equal(archiveExport.fingerprint, fingerprint);

await runtime.document.querySelector("#snapshot-traces").dispatch("click");
assert.match(runtime.document.querySelector("#trace-status").textContent, /^Snapshot saved \(5\)$/);
assert.equal(runtime.createdBlobs.length, 2);
assert.equal(runtime.createdBlobs[1].type, "image/svg+xml");
const snapshotSvg = await runtime.createdBlobs[1].text();
assert.match(snapshotSvg, /<title id="title">Trace Atlas snapshot<\/title>/);
assert.match(snapshotSvg, /Runtime import proves the archive can return\./);
assert.match(snapshotSvg, new RegExp(`5 traces / 1 local / ${fingerprint}`));
assert.match(snapshotSvg, new RegExp(`Fingerprint: ${fingerprint}`));
assert.doesNotMatch(snapshotSvg, /onload=/);

await runtime.document.querySelector("#capsule-traces").dispatch("click");
assert.match(runtime.location.hash, /^#capsule=/);
assert.match(runtime.document.querySelector("#trace-status").textContent, /^Capsule link ready \(1\)$/);
const capsulePayload = JSON.parse(Buffer.from(runtime.location.hash.slice("#capsule=".length), "base64url").toString("utf8"));
assert.equal(capsulePayload.fingerprint, fingerprint);

const restoredRuntime = createRuntime();
restoredRuntime.location.href = runtime.location.href;
restoredRuntime.location.hash = runtime.location.hash;
vm.runInNewContext(readFileSync("app.js", "utf8"), restoredRuntime.context, { filename: "app.js" });
assert.equal(restoredRuntime.document.querySelector("#trace-count").textContent, "5 traces");
assert.match(restoredRuntime.document.querySelector("#trace-status").textContent, /^Restored 1:/);
assert.equal(restoredRuntime.document.querySelector("#fingerprint-note").textContent, `fingerprint ${fingerprint}`);
const restoredStored = JSON.parse(restoredRuntime.store.get("whatever.trace-atlas.v1"));
assert.equal(restoredStored[0].body, "Runtime import proves the archive can return.");

const keyHandlers = runtime.listeners.get("keydown") ?? [];
assert.equal(keyHandlers.length, 1);
keyHandlers[0]({ key: "ArrowRight", preventDefault() {}, target: runtime.document.body });
assert.match(runtime.document.querySelector("#trace-status").textContent, /^Selected:/);

console.log("Trace Atlas runtime verification passed.");
