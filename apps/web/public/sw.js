self.addEventListener('push', (event) => {
  let payload = { title: 'قسمة و نصيب', body: '', url: '/' };
  try {
    payload = { ...payload, ...event.data.json() };
  } catch {
    // Best-effort: fall back to the default payload if the push body isn't JSON.
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/logo-icon.png',
      badge: '/logo-icon.png',
      data: { url: payload.url ?? '/' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? '/';

  event.waitUntil(
    (async () => {
      const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clientsList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      return self.clients.openWindow(url);
    })(),
  );
});
