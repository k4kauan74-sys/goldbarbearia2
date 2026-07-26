
// This is a minimal Service Worker for Firebase Messaging.
// It allows background notifications to be received.

importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');

// These credentials will be automatically used by the browser if configured in Firebase Console
firebase.initializeApp({
  apiKey: "AIzaSyBbRAAwv-2-rgHji3jCM4zseCMMS5sxQl4",
  projectId: "studio-6777534353-e8d1f",
  messagingSenderId: "522168407459",
  appId: "1:522168407459:web:4eff295b53683d28377616"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
