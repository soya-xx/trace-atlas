const CACHE_NAME = "trace-atlas-shell-v18";
const APP_SHELL = [
  "./",
  "./index.html",
  "./launch.html",
  "./workflow.html",
  "./styles.css?v=12",
  "./launch.css?v=4",
  "./launch.js?v=1",
  "./app.js?v=13",
  "./icon.svg",
  "./social-card.svg",
  "./promo/xhs-cover.png",
  "./promo/workflow-card.png",
  "./promo/xhs-publish-checklist.md",
  "./promo/xhs-publish-manifest.json",
  "./evidence-pack.md",
  "./templates/ai-session-artifact-kit.md",
  "./site.webmanifest",
  "./progress-timeline.json?v=6",
  "./world-sync.json?v=6",
  "./trace-ledger.json?v=6"
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
