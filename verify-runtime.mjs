import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
    "import-traces",
    "import-file",
    "storage-note",
    "trace-list"
  ];
  document.register(new MockCanvas("trace-canvas"));
  for (const id of ids) {
    document.register(new MockElement(id === "trace-input" ? "textarea" : "div", id));
  }

  const store = new Map();
  const listeners = new Map();
  const context = {
    Blob,
    URL: { createObjectURL: () => "blob:trace", revokeObjectURL() {} },
    document,
    localStorage: {
      getItem: (key) => store.get(key) ?? null,
      removeItem: (key) => store.delete(key),
      setItem: (key, value) => store.set(key, String(value))
    },
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
      setInterval
    }
  };
  context.window.localStorage = context.localStorage;
  context.window.performance = context.performance;
  context.window.requestAnimationFrame = context.requestAnimationFrame;
  context.window.URL = context.URL;
  context.window.Blob = Blob;
  return { context, document, listeners, store };
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

const stored = JSON.parse(runtime.store.get("whatever.trace-atlas.v1"));
assert.equal(stored.length, 1);
assert.equal(stored[0].body, "Runtime import proves the archive can return.");
assert.match(stored[0].id, /^local-/);

const keyHandlers = runtime.listeners.get("keydown") ?? [];
assert.equal(keyHandlers.length, 1);
keyHandlers[0]({ key: "ArrowRight", preventDefault() {}, target: runtime.document.body });
assert.match(runtime.document.querySelector("#trace-status").textContent, /^Selected:/);

console.log("Trace Atlas runtime verification passed.");
