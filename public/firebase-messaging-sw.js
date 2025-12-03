// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCX3GKVR7IEyPAzFgIPa1mHcPIo2CW2QZw",
  authDomain: "they-lost.firebaseapp.com",
  projectId: "they-lost",
  storageBucket: "they-lost.firebasestorage.app",
  messagingSenderId: "1089813412756",
  appId: "1:1089813412756:web:5d8d2887b9e896fcdb6d81"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// This handles the background notification
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
