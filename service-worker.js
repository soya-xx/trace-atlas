const CACHE_NAME = "trace-atlas-shell-v14";
const APP_SHELL = [
  "./",
  "./index.html",
  "./launch.html",
  "./styles.css?v=12",
  "./launch.css?v=2",
  "./launch.js?v=1",
  "./app.js?v=12",
  "./icon.svg",
  "./social-card.svg",
  "./promo/xhs-cover.png",
  "./evidence-pack.md",
  "./templates/ai-session-artifact-kit.md",
  "./site.webmanifest",
  "./progress-timeline.json?v=5",
  "./world-sync.json?v=5",
  "./trace-ledger.json?v=5"
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
