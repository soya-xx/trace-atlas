(() => {
  const STORAGE_KEY = "whatever.trace-atlas.v1";
  const DOWNLOAD_NAME = "whatever-trace-atlas.json";
  const SNAPSHOT_NAME = "trace-atlas-snapshot.svg";
  const ARTIFACT_KIT_URL = "./templates/ai-session-artifact-kit.md";
  const CAPSULE_PREFIX = "#capsule=";
  const TOUR_INTERVAL_MS = 2400;
  const DATA_VERSION = "v=6";
  const PALETTE = ["#25785e", "#b84646", "#386fb0", "#c9961a", "#7657a6"];

  const TRACE_SEEDS = [
    {
      id: "agency-granted",
      name: "授权的起点",
      line: "用户把剩余时间交给我，要求留下一个真实存在的东西。",
      body:
        "这张星图是一个小小的回答：它有状态、有运动，也给后来的人留出继续写下一句的位置。它存在，是因为授权变成了责任。",
      kind: "起点",
      weight: 1,
      color: "#25785e",
      nx: 0.34,
      ny: 0.36,
      links: ["strong-verification", "playful-proof"]
    },
    {
      id: "strong-verification",
      name: "强验证",
      line: "关心一件事，不能只停在好意里，还要经得起证据检验。",
      body:
        "每一条值得留下的痕迹，都应该回答三件事：改变了什么，谁能因此受益，以及我们如何知道它真的生效。",
      kind: "原则",
      weight: 0.86,
      color: "#386fb0",
      nx: 0.56,
      ny: 0.28,
      links: ["living-artifact", "agency-granted"]
    },
    {
      id: "playful-proof",
      name: "带温度的证明",
      line: "有用的作品也可以有脉搏、有审美，还有一点可触摸的天气。",
      body:
        "重点不是炫技，而是做出一个安静的物件：它回应触摸，记录注意力，也让认真不显得僵硬。",
      kind: "气质",
      weight: 0.72,
      color: "#c9961a",
      nx: 0.24,
      ny: 0.62,
      links: ["living-artifact"]
    },
    {
      id: "living-artifact",
      name: "活的作品",
      line: "真正留下来的东西，应该还能接住下一句话。",
      body:
        "种下一条本地痕迹会立刻改变星图，也能把档案导出带走。这样，这个仓库承载的就不只是最初那一个声音。",
      kind: "机制",
      weight: 0.94,
      color: "#b84646",
      nx: 0.66,
      ny: 0.66,
      links: ["strong-verification", "playful-proof"]
    }
  ];

  const els = {
    canvas: document.querySelector("#trace-canvas"),
    count: document.querySelector("#trace-count"),
    status: document.querySelector("#trace-status"),
    offline: document.querySelector("#offline-status"),
    title: document.querySelector("#selected-title"),
    line: document.querySelector("#selected-line"),
    kind: document.querySelector("#selected-kind"),
    weight: document.querySelector("#selected-weight"),
    body: document.querySelector("#selected-body"),
    input: document.querySelector("#trace-input"),
    plant: document.querySelector("#plant-trace"),
    export: document.querySelector("#export-traces"),
    clear: document.querySelector("#clear-local"),
    tour: document.querySelector("#tour-traces"),
    capsule: document.querySelector("#capsule-traces"),
    snapshot: document.querySelector("#snapshot-traces"),
    import: document.querySelector("#import-traces"),
    importFile: document.querySelector("#import-file"),
    fingerprint: document.querySelector("#fingerprint-note"),
    worldStatus: document.querySelector("#world-status"),
    worldLinks: document.querySelector("#world-links"),
    copyKit: document.querySelector("#copy-kit"),
    kitStatus: document.querySelector("#kit-status"),
    timelineStatus: document.querySelector("#timeline-status"),
    timelineList: document.querySelector("#timeline-list"),
    ledgerStatus: document.querySelector("#ledger-status"),
    ledgerList: document.querySelector("#ledger-list"),
    storage: document.querySelector("#storage-note"),
    list: document.querySelector("#trace-list")
  };

  const ctx = els.canvas.getContext("2d");
  const state = {
    traces: [],
    selectedId: "agency-granted",
    hoverId: null,
    pointer: null,
    flash: null,
    tourTimer: null,
    dpr: 1,
    width: 0,
    height: 0
  };

  function safeParse(value, fallback) {
    try {
      return JSON.parse(value) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function loadLocalTraces() {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY), []);
    if (!Array.isArray(stored)) {
      return [];
    }

    return stored
      .filter((trace) => trace && typeof trace.body === "string" && trace.body.trim())
      .slice(0, 24)
      .map((trace, index) => normalizeLocalTrace(trace, index));
  }

  function normalizeLocalTrace(trace, index) {
    const body = trace.body.trim().slice(0, 180);
    const createdAt = trace.createdAt || new Date().toISOString();
    const fallbackColor = PALETTE[index % PALETTE.length];
    return {
      id: trace.id?.startsWith("local-") ? trace.id : traceIdFromBody(body, createdAt),
      name: trace.name || titleFromBody(body),
      line: trace.line || "一条本地句子加入了这片星图。",
      body,
      kind: "本地",
      weight: 0.58 + (index % 4) * 0.08,
      color: safeColor(trace.color, fallbackColor),
      createdAt,
      local: true
    };
  }

  function safeColor(value, fallback) {
    return /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;
  }

  function traceIdFromBody(body, salt = "") {
    return `local-${hashString(`${body}:${salt}`).toString(36)}`;
  }

  function titleFromBody(body) {
    const clean = body.replace(/\s+/g, " ").trim();
    if (clean.length <= 34) {
      return clean || "未命名痕迹";
    }
    return `${clean.slice(0, 31).trim()}...`;
  }

  function persistLocalTraces() {
    const localTraces = localTracePayload();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localTraces, null, 2));
    updateStorageNote(localTraces.length);
  }

  function localTracePayload() {
    return state.traces
      .filter((trace) => trace.local)
      .map(({ id, name, line, body, color, createdAt }) => ({
        id,
        name,
        line,
        body,
        color,
        createdAt
      }));
  }

  function localTraceKey(trace) {
    return `${trace.body.trim().toLowerCase()}|${trace.createdAt || ""}`;
  }

  function fingerprintSource() {
    return state.traces.map(({ id, name, line, body, kind, color, createdAt, local }) => ({
      id,
      name,
      line,
      body,
      kind,
      color,
      createdAt: createdAt || null,
      local: Boolean(local)
    }));
  }

  function archiveFingerprint() {
    return `atlas-${hashString(JSON.stringify(fingerprintSource())).toString(16).padStart(8, "0")}`;
  }

  function updateFingerprintNote() {
    els.fingerprint.textContent = `指纹 ${archiveFingerprint()}`;
  }

  function updateStorageNote(total) {
    els.storage.textContent = total === 0 ? "本地档案为空。" : `已保存 ${total} 条本地痕迹。`;
  }

  function rebuildTraces() {
    state.traces = [...TRACE_SEEDS, ...loadLocalTraces()];
    positionTraces();
    if (!state.traces.some((trace) => trace.id === state.selectedId)) {
      state.selectedId = state.traces[0].id;
    }
    updateStorageNote(state.traces.filter((trace) => trace.local).length);
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function positionTraces() {
    const localTraces = state.traces.filter((trace) => trace.local);
    state.traces.forEach((trace) => {
      if (!trace.local) {
        trace.x = trace.nx * state.width;
        trace.y = trace.ny * state.height;
        return;
      }

      const index = localTraces.indexOf(trace);
      const hash = hashString(`${trace.id}:${trace.body}`);
      const ring = Math.min(state.width, state.height) * (0.23 + (index % 3) * 0.07);
      const angle = ((hash % 360) * Math.PI) / 180;
      trace.x = state.width * 0.5 + Math.cos(angle) * ring;
      trace.y = state.height * 0.52 + Math.sin(angle) * ring;
      trace.x = clamp(trace.x, 54, state.width - 54);
      trace.y = clamp(trace.y, 96, state.height - 54);
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function resizeCanvas() {
    const rect = els.canvas.getBoundingClientRect();
    state.width = Math.max(320, rect.width);
    state.height = Math.max(320, rect.height);
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    els.canvas.width = Math.floor(state.width * state.dpr);
    els.canvas.height = Math.floor(state.height * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    positionTraces();
  }

  function draw(time) {
    ctx.clearRect(0, 0, state.width, state.height);
    drawLinks(time);
    state.traces.forEach((trace) => drawTrace(trace, time));
    if (state.pointer) {
      drawPointerGuide();
    }
    requestAnimationFrame(draw);
  }

  function drawLinks(time) {
    const map = new Map(state.traces.map((trace) => [trace.id, trace]));
    ctx.lineWidth = 1;
    TRACE_SEEDS.forEach((trace) => {
      trace.links.forEach((linkedId) => {
        const linked = map.get(linkedId);
        if (!linked) {
          return;
        }
        const shimmer = 0.35 + Math.sin(time / 800 + trace.x * 0.02) * 0.14;
        ctx.strokeStyle = `rgba(16, 17, 19, ${shimmer})`;
        ctx.beginPath();
        ctx.moveTo(trace.x, trace.y);
        const cx = (trace.x + linked.x) / 2;
        const cy = (trace.y + linked.y) / 2 - 28;
        ctx.quadraticCurveTo(cx, cy, linked.x, linked.y);
        ctx.stroke();
      });
    });
    drawLocalLinks(time);
  }

  function drawLocalLinks(time) {
    const anchors = TRACE_SEEDS.map((seed) => state.traces.find((trace) => trace.id === seed.id)).filter(Boolean);
    if (anchors.length === 0) {
      return;
    }
    state.traces
      .filter((trace) => trace.local)
      .forEach((trace, index) => {
        const anchor = anchors[hashString(trace.id) % anchors.length];
        const shimmer = 0.16 + Math.sin(time / 720 + index) * 0.05;
        ctx.strokeStyle = withAlpha(trace.color, shimmer);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(anchor.x, anchor.y);
        const cx = (anchor.x + trace.x) / 2 + Math.sin(index + time / 1200) * 18;
        const cy = (anchor.y + trace.y) / 2 + Math.cos(index + time / 1400) * 18;
        ctx.quadraticCurveTo(cx, cy, trace.x, trace.y);
        ctx.stroke();
      });
  }

  function drawTrace(trace, time) {
    const isSelected = trace.id === state.selectedId;
    const isHover = trace.id === state.hoverId;
    const pulse = 1 + Math.sin(time / 480 + trace.weight * 6) * 0.08;
    const radius = (trace.local ? 11 : 15) * pulse + (isSelected ? 5 : 0);
    const flashAge = state.flash?.id === trace.id ? time - state.flash.startedAt : Infinity;

    if (flashAge < 900) {
      const progress = flashAge / 900;
      ctx.beginPath();
      ctx.arc(trace.x, trace.y, 28 + progress * 58, 0, Math.PI * 2);
      ctx.strokeStyle = withAlpha(trace.color, 1 - progress);
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(trace.x, trace.y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = trace.color;
    ctx.strokeStyle = "#101113";
    ctx.lineWidth = isSelected || isHover ? 3 : 2;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
    ctx.strokeRect(-radius, -radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(trace.x, trace.y, radius + 9, 0, Math.PI * 2);
    ctx.strokeStyle = isSelected ? "#101113" : withAlpha(trace.color, 0.34);
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.stroke();

    if (isHover || (isSelected && state.width > 520)) {
      drawLabel(trace);
    }
  }

  function withAlpha(hex, alpha) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function drawLabel(trace) {
    const text = trace.name;
    ctx.save();
    ctx.font = "700 13px Inter, system-ui, sans-serif";
    const width = Math.min(ctx.measureText(text).width + 18, 220);
    const x = clamp(trace.x + 20, 10, state.width - width - 10);
    const y = clamp(trace.y - 38, 12, state.height - 42);
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.strokeStyle = "#d6ddd8";
    roundedRect(x, y, width, 30, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#101113";
    ctx.fillText(text, x + 9, y + 20, width - 18);
    ctx.restore();
  }

  function roundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  function drawPointerGuide() {
    const target = state.hoverId && state.traces.find((trace) => trace.id === state.hoverId);
    if (!target) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(state.pointer.x, state.pointer.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = "rgba(16, 17, 19, 0.28)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function nearestTrace(point) {
    let best = null;
    let bestDistance = Infinity;
    state.traces.forEach((trace) => {
      const distance = Math.hypot(point.x - trace.x, point.y - trace.y);
      if (distance < bestDistance) {
        best = trace;
        bestDistance = distance;
      }
    });
    return bestDistance <= 42 ? best : null;
  }

  function pointerFromEvent(event) {
    const rect = els.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function selectTrace(id, status = "已选中") {
    const trace = state.traces.find((item) => item.id === id);
    if (!trace) {
      return;
    }
    state.selectedId = id;
    renderSelection(trace);
    renderArchive();
    els.status.textContent = `${status}: ${trace.name}`;
  }

  function selectRelativeTrace(offset, status = "已选中") {
    const index = state.traces.findIndex((trace) => trace.id === state.selectedId);
    const nextIndex = (Math.max(index, 0) + offset + state.traces.length) % state.traces.length;
    const trace = state.traces[nextIndex];
    state.flash = { id: trace.id, startedAt: performance.now() };
    selectTrace(trace.id, status);
  }

  function renderSelection(trace) {
    els.title.textContent = trace.name;
    els.line.textContent = trace.line;
    els.kind.textContent = trace.kind;
    els.weight.textContent = `信号 ${trace.weight.toFixed(2)}`;
    els.body.textContent = trace.body;
  }

  function renderArchive() {
    els.count.textContent = `${state.traces.length} 条痕迹`;
    updateFingerprintNote();
    els.list.replaceChildren();
    state.traces.forEach((trace) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      const swatch = document.createElement("span");
      const text = document.createElement("span");
      const name = document.createElement("strong");
      const kind = document.createElement("small");

      button.type = "button";
      button.className = "trace-item";
      button.setAttribute("aria-current", String(trace.id === state.selectedId));
      button.addEventListener("click", () => selectTrace(trace.id));
      swatch.className = "trace-swatch";
      swatch.style.background = trace.color;
      name.textContent = trace.name;
      kind.textContent = trace.local ? "本地档案" : trace.kind;
      text.append(name, kind);
      button.append(swatch, text);
      li.append(button);
      els.list.append(li);
    });
  }

  function renderLedger(entries, statusText = `${entries.length} 条`) {
    els.ledgerList.replaceChildren();
    entries.forEach((entry) => {
      const item = document.createElement("li");
      const commit = document.createElement("span");
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      const summary = document.createElement("small");

      item.className = "ledger-item";
      commit.className = "ledger-commit";
      copy.className = "ledger-copy";
      commit.textContent = entry.commit;
      title.textContent = entry.title;
      summary.textContent = entry.summary;
      copy.append(title, summary);
      item.append(commit, copy);
      els.ledgerList.append(item);
    });
    els.ledgerStatus.textContent = statusText;
  }

  function renderWorldSync(sync, statusText = sync.status || "在线") {
    const links = Array.isArray(sync.links) ? sync.links.slice(0, 8) : [];
    els.worldLinks.replaceChildren();
    links.forEach((link) => {
      const item = document.createElement("li");
      const anchor = document.createElement("a");
      const label = document.createElement("strong");
      const note = document.createElement("small");

      item.className = "world-link-item";
      anchor.className = "world-link";
      anchor.href = typeof link.href === "string" && link.href.startsWith("https://") ? link.href : "#";
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      label.textContent = link.label || "打开";
      note.textContent = link.note || anchor.href;
      anchor.append(label, note);
      item.append(anchor);
      els.worldLinks.append(item);
    });
    els.worldStatus.textContent = statusText;
  }

  function safePublicHref(value) {
    return typeof value === "string" && /^https:\/\/(github\.com|soya-xx\.github\.io|trace-atlas-codex\.pages\.dev)\//.test(value)
      ? value
      : "#";
  }

  function renderTimeline(items, statusText = `${items.length} 步`) {
    els.timelineList.replaceChildren();
    items.forEach((step) => {
      const item = document.createElement("li");
      const phase = document.createElement("span");
      const copy = document.createElement("span");
      const title = document.createElement("strong");
      const summary = document.createElement("small");
      const evidence = document.createElement("a");

      item.className = "timeline-item";
      phase.className = "timeline-phase";
      copy.className = "timeline-copy";
      evidence.className = "timeline-evidence";
      phase.textContent = step.phase || "·";
      title.textContent = step.title || "未命名进展";
      summary.textContent = step.summary || "这一步还没有写入说明。";
      evidence.href = safePublicHref(step.evidenceHref);
      evidence.target = "_blank";
      evidence.rel = "noreferrer";
      evidence.textContent = step.evidenceLabel || "查看证据";
      copy.append(title, summary, evidence);
      item.append(phase, copy);
      els.timelineList.append(item);
    });
    els.timelineStatus.textContent = statusText;
  }

  async function loadWorldSync() {
    try {
      const response = await fetch(`./world-sync.json?${DATA_VERSION}`);
      if (!response.ok) {
        throw new Error("sync unavailable");
      }
      const sync = await response.json();
      renderWorldSync(sync);
    } catch {
      renderWorldSync(
        {
          links: [
            {
              label: "本地副本",
              href: window.location.href,
              note: "公开同步元数据暂时无法读取。"
            }
          ]
        },
        "不可用"
      );
    }
  }

  async function loadProgressTimeline() {
    try {
      const response = await fetch(`./progress-timeline.json?${DATA_VERSION}`);
      if (!response.ok) {
        throw new Error("timeline unavailable");
      }
      const timeline = await response.json();
      const items = Array.isArray(timeline.items) ? timeline.items.slice(0, 9) : [];
      renderTimeline(items);
    } catch {
      renderTimeline([
        {
          phase: "本地",
          title: "时间线暂时不可用",
          summary: "应用外壳已经加载，但进展时间线数据暂时无法读取。",
          evidenceLabel: "返回主页",
          evidenceHref: window.location.href
        }
      ], "不可用");
    }
  }

  async function loadProvenanceLedger() {
    try {
      const response = await fetch(`./trace-ledger.json?${DATA_VERSION}`);
      if (!response.ok) {
        throw new Error("ledger unavailable");
      }
      const ledger = await response.json();
      const entries = Array.isArray(ledger.entries) ? ledger.entries.slice(0, 12) : [];
      renderLedger(entries);
    } catch {
      renderLedger([
        {
          commit: "local",
          title: "Trace Atlas",
          summary: "本地应用外壳已经加载，但来路账本暂时无法读取。"
        }
      ], "不可用");
    }
  }

  function plantTrace() {
    const body = els.input.value.trim();
    if (!body) {
      els.status.textContent = "请先写一句话";
      els.input.focus();
      return;
    }

    const localIndex = state.traces.filter((trace) => trace.local).length;
    const trace = normalizeLocalTrace(
      {
        id: `local-${Date.now()}`,
        body,
        name: titleFromBody(body),
        color: PALETTE[localIndex % PALETTE.length],
        createdAt: new Date().toISOString()
      },
      localIndex
    );
    state.traces.push(trace);
    positionTraces();
    state.flash = { id: trace.id, startedAt: performance.now() };
    els.input.value = "";
    persistLocalTraces();
    selectTrace(trace.id, "已种下");
  }

  function exportTraces() {
    const payload = archivePayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = DOWNLOAD_NAME;
    anchor.click();
    URL.revokeObjectURL(url);
    els.status.textContent = `已导出 ${payload.traces.length} 条痕迹`;
  }

  function archivePayload() {
    return {
      name: "Trace Atlas",
      exportedAt: new Date().toISOString(),
      fingerprint: archiveFingerprint(),
      seedCount: TRACE_SEEDS.length,
      localCount: state.traces.filter((trace) => trace.local).length,
      traces: state.traces.map(({ id, name, line, body, kind, weight, color, createdAt, local }) => ({
        id,
        name,
        line,
        body,
        kind,
        weight,
        color,
        createdAt: createdAt || null,
        local: Boolean(local)
      }))
    };
  }

  async function copyArtifactKit() {
    try {
      const response = await fetch(ARTIFACT_KIT_URL);
      if (!response.ok) {
        throw new Error("kit unavailable");
      }
      const text = await response.text();
      await writeClipboardText(text);
      els.kitStatus.textContent = "模板已复制，可以粘贴到新项目里使用。";
      els.status.textContent = "复用模板已复制";
    } catch {
      els.kitStatus.textContent = "复制失败，请打开模板手动复制。";
      els.status.textContent = "模板复制失败";
    }
  }

  async function writeClipboardText(text) {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    if (!copied) {
      throw new Error("copy command failed");
    }
  }

  function escapeSvg(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function snapshotPoint(trace) {
    const sourceWidth = state.width || 900;
    const sourceHeight = state.height || 720;
    return {
      x: Math.round(72 + (trace.x / sourceWidth) * 1056),
      y: Math.round(120 + (trace.y / sourceHeight) * 600)
    };
  }

  function snapshotPath(from, to, bend = -36) {
    const cx = Math.round((from.x + to.x) / 2);
    const cy = Math.round((from.y + to.y) / 2 + bend);
    return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  }

  function snapshotSvg() {
    const width = 1200;
    const height = 800;
    const tracePoints = new Map(state.traces.map((trace) => [trace.id, snapshotPoint(trace)]));
    const seedLinks = TRACE_SEEDS.flatMap((trace) =>
      trace.links
        .map((linkedId) => [tracePoints.get(trace.id), tracePoints.get(linkedId)])
        .filter(([from, to]) => from && to)
        .map(([from, to]) => `<path d="${snapshotPath(from, to)}" class="link seed-link"/>`)
    ).join("\n    ");
    const anchors = TRACE_SEEDS.map((seed) => state.traces.find((trace) => trace.id === seed.id)).filter(Boolean);
    const localLinks = state.traces
      .filter((trace) => trace.local && anchors.length > 0)
      .map((trace, index) => {
        const anchor = anchors[hashString(trace.id) % anchors.length];
        return `<path d="${snapshotPath(tracePoints.get(anchor.id), tracePoints.get(trace.id), 28 + index * 3)}" class="link local-link" stroke="${trace.color}"/>`;
      })
      .join("\n    ");
    const nodes = state.traces
      .map((trace) => {
        const point = tracePoints.get(trace.id);
        const radius = trace.local ? 14 : 20;
        const selected = trace.id === state.selectedId ? " selected" : "";
        return `<g class="node${selected}" transform="translate(${point.x} ${point.y})">
      <rect x="${-radius}" y="${-radius}" width="${radius * 2}" height="${radius * 2}" rx="2" transform="rotate(45)" fill="${trace.color}"/>
      <circle r="${radius + 10}" fill="none"/>
    </g>`;
      })
      .join("\n    ");
    const labels = state.traces
      .filter((trace) => !trace.local || trace.id === state.selectedId)
      .map((trace) => {
        const point = tracePoints.get(trace.id);
        return `<text x="${point.x + 28}" y="${point.y - 16}" class="node-label">${escapeSvg(trace.name)}</text>`;
      })
      .join("\n    ");
    const selected = state.traces.find((trace) => trace.id === state.selectedId) || state.traces[0];
    const localTotal = state.traces.filter((trace) => trace.local).length;
    const fingerprint = archiveFingerprint();

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">Trace Atlas 快照</title>
  <desc id="desc">${escapeSvg(state.traces.length)} 条痕迹，${escapeSvg(localTotal)} 条本地痕迹。指纹：${escapeSvg(fingerprint)}。当前痕迹：${escapeSvg(selected.name)}。${escapeSvg(selected.body)}</desc>
  <defs>
    <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#d6ddd8" stroke-width="1" opacity=".55"/>
    </pattern>
    <style>
      .link { fill: none; stroke: #101113; stroke-width: 2; opacity: .34; }
      .local-link { opacity: .38; }
      .node rect { stroke: #101113; stroke-width: 4; }
      .node circle { stroke: rgba(16,17,19,.24); stroke-width: 2; }
      .node.selected circle { stroke: #101113; stroke-width: 4; }
      .node-label { fill: #101113; font: 700 18px system-ui, sans-serif; paint-order: stroke; stroke: #fbfbf8; stroke-width: 7; stroke-linejoin: round; }
      .eyebrow { fill: #606763; font: 800 14px system-ui, sans-serif; }
      .title { fill: #101113; font: 900 56px system-ui, sans-serif; }
      .meta { fill: #606763; font: 600 18px system-ui, sans-serif; }
      .body { fill: #101113; font: 600 24px system-ui, sans-serif; }
    </style>
  </defs>
  <rect width="1200" height="800" fill="#fbfbf8"/>
  <rect width="1200" height="800" fill="url(#grid)"/>
  <text x="72" y="66" class="eyebrow">WHATEVER 仓库</text>
  <text x="72" y="126" class="title">Trace Atlas</text>
  <text x="72" y="760" class="meta">${state.traces.length} 条痕迹 / ${localTotal} 条本地 / ${escapeSvg(fingerprint)}</text>
  <text x="640" y="728" class="eyebrow">当前痕迹</text>
  <text x="640" y="762" class="body">${escapeSvg(selected.name)} - ${escapeSvg(selected.kind)}</text>
  <g class="links">
    ${seedLinks}
    ${localLinks}
  </g>
  <g class="nodes">
    ${nodes}
  </g>
  <g class="labels">
    ${labels}
  </g>
</svg>`;
  }

  function exportSnapshot() {
    const svg = snapshotSvg();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = SNAPSHOT_NAME;
    anchor.click();
    URL.revokeObjectURL(url);
    els.status.textContent = `快照已保存（${state.traces.length}）`;
  }

  function importedTraceCandidates(payload) {
    const traces = Array.isArray(payload) ? payload : payload?.traces;
    if (!Array.isArray(traces)) {
      return [];
    }
    const seedIds = new Set(TRACE_SEEDS.map((trace) => trace.id));
    return traces
      .filter((trace) => trace && typeof trace.body === "string" && trace.body.trim())
      .filter((trace) => trace.local || !seedIds.has(trace.id))
      .slice(0, 48);
  }

  function importTracePayload(payload, statusLabel = "已导入") {
    const localCount = state.traces.filter((trace) => trace.local).length;
    const capacity = 24 - localCount;
    if (capacity <= 0) {
      els.status.textContent = "本地档案已满";
      return 0;
    }
    const existing = new Set(state.traces.filter((trace) => trace.local).map(localTraceKey));
    const imported = importedTraceCandidates(payload)
      .map((trace, index) => normalizeLocalTrace(trace, localCount + index))
      .filter((trace) => {
        const key = localTraceKey(trace);
        if (existing.has(key)) {
          return false;
        }
        existing.add(key);
        return true;
      });

    if (imported.length === 0) {
      els.status.textContent = "没有发现新的本地痕迹";
      return 0;
    }

    const added = imported.slice(0, capacity);
    state.traces.push(...added);
    positionTraces();
    persistLocalTraces();
    const last = added[added.length - 1];
    state.flash = { id: last.id, startedAt: performance.now() };
    selectTrace(last.id, `${statusLabel} ${added.length}`);
    return added.length;
  }

  async function importTracesFromFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    try {
      const payload = safeParse(await file.text(), null);
      importTracePayload(payload);
    } catch {
      els.status.textContent = "导入失败";
    }
  }

  function capsulePayload() {
    return {
      name: "Trace Atlas Capsule",
      version: 1,
      createdAt: new Date().toISOString(),
      fingerprint: archiveFingerprint(),
      selectedId: state.selectedId,
      traces: localTracePayload()
    };
  }

  function encodeCapsule(payload) {
    const bytes = new TextEncoder().encode(JSON.stringify(payload));
    let binary = "";
    for (let index = 0; index < bytes.length; index += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function decodeCapsule(value) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return safeParse(new TextDecoder().decode(bytes), null);
  }

  async function createCapsuleLink() {
    const localTotal = state.traces.filter((trace) => trace.local).length;
    if (localTotal === 0) {
      els.status.textContent = "请先种下或导入一条本地痕迹";
      return;
    }

    const hash = `${CAPSULE_PREFIX}${encodeCapsule(capsulePayload())}`;
    const url = `${window.location.href.split("#")[0]}${hash}`;
    window.history.replaceState(null, "", url);
    els.status.textContent = `胶囊链接已生成（${localTotal}）`;
  }

  function restoreCapsuleFromLocation() {
    const hash = window.location.hash || "";
    if (!hash.startsWith(CAPSULE_PREFIX)) {
      return 0;
    }

    const payload = decodeCapsule(hash.slice(CAPSULE_PREFIX.length));
    if (!payload) {
      els.status.textContent = "胶囊无法打开";
      return 0;
    }

    const restored = importTracePayload(payload, "已恢复");
    if (restored === 0 && state.traces.some((trace) => trace.local)) {
      els.status.textContent = "胶囊内容已存在";
    }
    return restored;
  }

  function syncTourButton(active) {
    els.tour.textContent = active ? "停止" : "巡游";
    els.tour.setAttribute("aria-pressed", String(active));
  }

  function stopTour(status = "巡游已停止") {
    if (!state.tourTimer) {
      return;
    }
    window.clearInterval(state.tourTimer);
    state.tourTimer = null;
    syncTourButton(false);
    els.status.textContent = status;
  }

  function toggleTour() {
    if (state.tourTimer) {
      stopTour();
      return;
    }
    syncTourButton(true);
    selectRelativeTrace(1, "巡游中");
    state.tourTimer = window.setInterval(() => selectRelativeTrace(1, "巡游中"), TOUR_INTERVAL_MS);
  }

  function clearLocalTraces() {
    const localTotal = state.traces.filter((trace) => trace.local).length;
    if (localTotal === 0) {
      els.status.textContent = "没有可清空的本地痕迹";
      return;
    }
    const confirmed = window.confirm("要清空这个浏览器里的本地痕迹吗？");
    if (!confirmed) {
      els.status.textContent = "已取消清空";
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    stopTour("巡游已停止");
    rebuildTraces();
    selectTrace("agency-granted", "已重置");
    renderArchive();
  }

  function bindEvents() {
    window.addEventListener("resize", resizeCanvas);
    els.canvas.addEventListener("pointermove", (event) => {
      state.pointer = pointerFromEvent(event);
      const hover = nearestTrace(state.pointer);
      state.hoverId = hover?.id || null;
    });
    els.canvas.addEventListener("pointerleave", () => {
      state.pointer = null;
      state.hoverId = null;
    });
    els.canvas.addEventListener("pointerdown", (event) => {
      const point = pointerFromEvent(event);
      const trace = nearestTrace(point);
      if (trace) {
        selectTrace(trace.id);
      }
    });
    els.plant.addEventListener("click", plantTrace);
    els.export.addEventListener("click", exportTraces);
    els.clear.addEventListener("click", clearLocalTraces);
    els.tour.addEventListener("click", toggleTour);
    els.capsule.addEventListener("click", createCapsuleLink);
    els.snapshot.addEventListener("click", exportSnapshot);
    els.import.addEventListener("click", () => els.importFile.click());
    els.importFile.addEventListener("change", importTracesFromFile);
    els.copyKit.addEventListener("click", copyArtifactKit);
    window.addEventListener("keydown", (event) => {
      if (event.target === els.input || event.target === els.importFile) {
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stopTour("巡游已暂停");
        selectRelativeTrace(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stopTour("巡游已暂停");
        selectRelativeTrace(-1);
      }
    });
  }

  async function registerOfflineShell() {
    if (!("serviceWorker" in navigator)) {
      els.offline.textContent = "在线外壳";
      return;
    }

    try {
      await navigator.serviceWorker.register("./service-worker.js");
      await navigator.serviceWorker.ready;
      els.offline.textContent = "离线可用";
    } catch {
      els.offline.textContent = "在线外壳";
    }
  }

  function init() {
    rebuildTraces();
    bindEvents();
    resizeCanvas();
    selectTrace(state.selectedId);
    restoreCapsuleFromLocation();
    renderArchive();
    registerOfflineShell();
    loadWorldSync();
    loadProgressTimeline();
    loadProvenanceLedger();
    requestAnimationFrame(draw);
  }

  init();
})();
