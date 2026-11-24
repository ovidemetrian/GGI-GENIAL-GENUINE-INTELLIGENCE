/* GGI Control Panel — offline shell.
   Law VIII: preservation of record. The panel must open with or without a network.
   The page title is set here to "GGI Control Panel — Genial Genuine Intelligence". */
const CACHE = 'ggi-panel-v34-8';
const TITLE = 'GGI Control Panel — Genial Genuine Intelligence';

/* Required: install fails if any of these are missing. Keep this list minimal. */
const CORE = ['./', './index.html', './manifest.json'];

/* Optional: cached best-effort. A missing file here must not break the install. */
const EXTRAS = ['./icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(CORE).then(() =>
        /* Each extra is added on its own so one 404 cannot reject the batch. */
        Promise.all(EXTRAS.map(url =>
          c.add(url).catch(() => console.warn('[sw] optional asset missing:', url))
        ))
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

/* give the page its proper title */
function titled(res){
  if (!res || !res.ok || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  return res.text().then(html => {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, '<title>' + TITLE + '</title>');
    const h = new Headers(res.headers); h.delete('content-length');
    return new Response(html, {status: res.status, statusText: res.statusText, headers: h});
  }).catch(() => res);
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  /* Only the panel's own files are cached. API traffic is never stored. */
  if (new URL(e.request.url).origin !== self.location.origin) return;
  const nav = e.request.mode === 'navigate';

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return nav ? titled(res) : res;
      })
      .catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html'))
                                  .then(hit => nav ? titled(hit) : hit))
  );
});
