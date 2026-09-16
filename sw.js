// 月影の探偵騎士団 - Service Worker
// オフラインキャッシュを担当します。
//
// 【重要】資材（index.html・アイコン等）を更新したら、必ず CACHE_NAME の
// バージョン番号を上げてください。上げないと、ユーザーのブラウザに古い
// キャッシュが残り続け、更新が反映されません。
const CACHE_NAME = "tsukikage-cache-v1";

// 同一オリジンの静的資材のみキャッシュ対象にする（フォントCDN等は対象外）
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "./icons/favicon-16.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  // すぐに新しいSWへ切り替える（次回起動時に反映）
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 同一オリジンのみキャッシュ戦略を適用。外部（Googleフォント等）はそのままネットワークへ。
  if (url.origin !== self.location.origin) {
    return;
  }

  // HTMLはネットワーク優先（最新のゲーム内容を優先し、オフライン時のみキャッシュへフォールバック）
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  // それ以外の静的資材（アイコン等）はキャッシュ優先
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      });
    })
  );
});
