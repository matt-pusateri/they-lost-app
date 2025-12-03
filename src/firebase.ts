import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCX3GKVR7IEyPAzFgIPa1mHcPIo2CW2QZw",
  authDomain: "they-lost.firebaseapp.com",
  projectId: "they-lost",
  storageBucket: "they-lost.firebasestorage.app",
  messagingSenderId: "1089813412756",
  appId: "1:1089813412756:web:5d8d2887b9e896fcdb6d81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Messaging (only if supported in this browser)
let messaging = null;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.log("Firebase Messaging not supported in this environment.");
}

export const requestNotificationPermission = async () => {
  if (!messaging) return null;

  try {
    console.log('Requesting permission...');
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // Get the unique ID (Token) for this device
      const currentToken = await getToken(messaging, { 
        vapidKey: 'BAJPxoGPAf-BafrH03MqYfRfMRdA5mNy3yVR5ot2XsYPBKP0TqnxFEpXDpt2yvdBlTK8umwin2-MglbFYkiTmwM' 
      });

      if (currentToken) {
        console.log('FCM Token:', currentToken);
        // TODO: In Phase 3, we send this token to your server/database
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
});
