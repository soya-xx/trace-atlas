const CACHE_NAME = "trace-atlas-shell-v36";
const APP_SHELL = [
  "./",
  "./index.html",
  "./start.html",
  "./reuse.html",
  "./launch.html",
  "./materials.html",
  "./materials-guide.html",
  "./monument.html",
  "./workflow.html",
  "./styles.css?v=13",
  "./launch.css?v=8",
  "./launch.js?v=1",
  "./materials-guide.js?v=1",
  "./app.js?v=16",
  "./icon.svg",
  "./social-card.svg",
  "./public-health-badge.svg",
  "./promo/xhs-cover.png",
  "./promo/workflow-card.png",
  "./promo/reuse-flow-card.png",
  "./promo/xhs-post-drafts.md",
  "./promo/xhs-feedback-loop-template.md",
  "./promo/xhs-publish-checklist.md",
  "./promo/xhs-publish-manifest.json",
  "./promo/xhs-publish-report.md",
  "./evidence-pack.md",
  "./verification-summary.md",
  "./templates/ai-session-artifact-kit.md",
  "./templates/ai-session-public-quickstart.md",
  "./site.webmanifest",
  "./progress-timeline.json?v=9",
  "./progress-timeline-source.json",
  "./world-sync.json?v=9",
  "./trace-ledger.json?v=9",
  "./public-health.json?v=9",
  "./materials-index.json",
  "./materials-api.json",
  "./reuse-map.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
