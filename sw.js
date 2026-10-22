const CACHE_NAME = 'ramadan-masged-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png'
];

// تثبيت الـ Service Worker وحفظ الملفات الأساسية مؤقتاً
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// تفعيل الخدمة وحذف التخزين القديم إن وجد
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// التعامل مع الطلبات (جلب البيانات من الكاش عندما يكون الهاتف أوفلاين)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وُجد الملف في الـ Cache يتم إرجاعه، وإلا يتم جلبه من الشبكة
        return response || fetch(event.request);
      })
      .catch(() => {
        // في حال انقطاع الإنترنت تماماً وعدم وجود الملف في الكاش
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});
