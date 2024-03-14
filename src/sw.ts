import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope & Window & typeof globalThis

self.addEventListener('message', (event) => {
    console.log({ event });

    if (event.data && event.data.type === 'SKIP_WAITING')
        self.skipWaiting()
})


self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        console.log("Push Recieved...");
        console.log({ data });
        self.registration.showNotification(data.title, {
            body: "Notified for TEST!",
            icon: "/notification.png"
        });
    }
})

self.addEventListener('pushsubscriptionchange', () => {
    self.registration.showNotification('your push subscription has changed', {
        body: "Notified for TEST!",
        icon: "/notification.png"
    });
})

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))