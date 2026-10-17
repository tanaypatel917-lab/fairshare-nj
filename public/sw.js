const CACHE = "fairshare-v3";
const SCOPE = new URL(self.registration.scope).pathname;
const PRECACHE = ["", "feed/", "tier/", "checklist/", "towns/", "start/", "about/", "manifest.webmanifest", "icon.svg"].map((p) => SCOPE + p);
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  const isPage = e.request.mode === "navigate" || (e.request.headers.get("accept") || "").includes("text/html");
  if (isPage) {
    e.respondWith(fetch(e.request).then((res) => { if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone())); return res; })
      .catch(() => caches.match(e.request).then((hit) => hit || caches.match(SCOPE))));
    return;
  }
  e.respondWith(caches.match(e.request).then((hit) => {
    const net = fetch(e.request).then((res) => { if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone())); return res; }).catch(() => hit);
    return hit || net;
  }));
});
