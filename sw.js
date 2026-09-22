// Service worker de Armario Virtual — cachea solo el "app shell" (los
// archivos estáticos propios de la app) para que abra rápido y no quede en
// blanco con mala señal. A propósito NO intercepta nada que no sea
// same-origin GET, así Firebase (auth/Firestore/Storage/Functions), Gemini y
// Open-Meteo siempre van directo a la red y nunca sirven datos viejos/cache.

const CACHE = 'armario-virtual-shell-v1';
const BASE = self.registration.scope; // ej: https://user.github.io/armario-virtual/

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll([BASE, `${BASE}index.html`])),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo GET, solo mismo origen que la app (deja pasar Firebase/Gemini/clima
  // directo a la red, sin tocarlos).
  if (request.method !== 'GET' || !request.url.startsWith(BASE)) return;

  // Navegación (abrir/recargar la app): red primero, cache como respaldo
  // offline — así siempre ves la versión nueva si hay conexión.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(`${BASE}index.html`)),
    );
    return;
  }

  // Estáticos propios (JS/CSS/íconos generados por el build): cache primero,
  // con actualización en segundo plano.
  const esEstaticoPropio = /\.(js|css|svg|png|woff2?)$/.test(new URL(request.url).pathname);
  if (!esEstaticoPropio) return;

  event.respondWith(
    caches.match(request).then((cacheada) => {
      const red = fetch(request)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((cache) => cache.put(request, res.clone()));
          return res;
        })
        .catch(() => cacheada);
      return cacheada || red;
    }),
  );
});
