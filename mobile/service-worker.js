// service-worker.js

self.addEventListener('push', function (event) {
    const data = event.data?.json() ?? {};

    const title = data.title || 'Notification de PhytoVigil 🌿';
    const options = {
        body: data.body || '',
        icon: '/assets/images/icon.png',         // 🟢 chemin absolu (web best practice)
        badge: '/assets/images/favicon.png',     // badge (optionnel mais recommandé)
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',                  // redirection au clic
        },
        actions: [
            {
                action: 'open_app',
                title: 'Ouvrir PhytoVigil',
            },
            {
                action: 'dismiss',
                title: 'Ignorer',
            },
        ],
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.action === 'open_app') {
        event.waitUntil(clients.openWindow(event.notification.data.url));
    } else {
        // Default behavior (open app anyway)
        event.waitUntil(clients.openWindow(event.notification.data.url));
    }
});
