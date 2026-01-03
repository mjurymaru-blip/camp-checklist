const CACHE_NAME = 'camp-checklist-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    // レシピJSON（初回ロード時にキャッシュ）
    '/recipes/index.json',
    '/recipes/core.json',
    '/recipes/meat.json',
    '/recipes/seafood.json',
    '/recipes/vegetable.json',
    '/recipes/noodle.json',
    '/recipes/rice.json',
    '/recipes/snack.json',
    '/recipes/soup.json',
    '/recipes/convenience.json',
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting()) // 新しいSWをすぐにアクティブ化
    );
});

// Stale-While-Revalidate: キャッシュを即座に返しつつ、バックグラウンドで更新
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    // バックグラウンドで更新（キャッシュヒット時も実行）
    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => null);

    // キャッシュがあれば即座に返す、なければフェッチを待つ
    return cachedResponse || fetchPromise;
}

// フェッチ時の戦略
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // レシピJSONはStale-While-Revalidate
    if (url.pathname.includes('/recipes/') && url.pathname.endsWith('.json')) {
        event.respondWith(staleWhileRevalidate(event.request));
        return;
    }

    // その他はネットワークファースト（既存ロジック）
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // レスポンスをキャッシュに保存
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.put(event.request, responseClone));
                }
                return response;
            })
            .catch(() => {
                // オフライン時はキャッシュから返す
                return caches.match(event.request);
            })
    );
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim()) // 既存タブにも新SWを適用
    );
});
