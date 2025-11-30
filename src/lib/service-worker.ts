/**
 * Service Worker registration and management
 */

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Only register in production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered successfully:', registration);

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify user
              console.log('New content available, please refresh.');
              
              // Optionally show a notification to the user
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Update Available', {
                  body: 'New content is available. Please refresh the page.',
                  icon: '/favicon.ico',
                });
              }
            }
          });
        }
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload the page when a new service worker takes control
        window.location.reload();
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}

export function unregisterServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.unregister();
    })
    .catch((error) => {
      console.error('Service Worker unregistration failed:', error);
    });
}

export async function checkForUpdates() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  } catch (error) {
    console.error('Failed to check for updates:', error);
  }
}

export function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

export function getServiceWorkerStatus(): Promise<string> {
  if (!isServiceWorkerSupported()) {
    return Promise.resolve('not-supported');
  }

  return navigator.serviceWorker.ready
    .then((registration) => {
      if (registration.active) {
        return 'active';
      } else if (registration.installing) {
        return 'installing';
      } else if (registration.waiting) {
        return 'waiting';
      } else {
        return 'not-registered';
      }
    })
    .catch(() => 'error');
}