// Service Worker My Alka v2.6 - Background Push & Offline Cache
const CACHE_NAME = 'my-alka-v26';
const SUPABASE_URL = 'https://vjgydzodhejzwlvwxbmu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_m_i6gSzO4cdebG975Vqthw_Gn-iT2Uv';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// 1. Menangkap Sinyal Web Push Server (Saat Aplikasi Ditutup Total 100%)
self.addEventListener('push', (event) => {
    let data = {
        title: 'My Alka - SDIT Al Kautsar',
        body: 'Ada pengumuman baru di Portal My Alka.',
        icon: './MyAlka.png',
        badge: './MyAlka.png'
    };
    if (event.data) {
        try {
            const parsed = event.data.json();
            data = { ...data, ...parsed };
        } catch (err) {
            data.body = event.data.text();
        }
    }
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || './MyAlka.png',
            badge: data.badge || './MyAlka.png',
            vibrate: [200, 100, 200],
            tag: data.tag || ('alka-push-' + Date.now()),
            renotify: true,
            data: { url: self.registration.scope }
        })
    );
});

// 2. Saat Banner Notifikasi di HP Diklik -> Buka Aplikasi My Alka
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : self.registration.scope;
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let client of windowClients) {
                if ('focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(targetUrl);
        })
    );
});

// 3. Fetch Handler untuk Offline Cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
