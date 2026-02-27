import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { Capacitor } from '@capacitor/core';

/**
 * Initializes push permissions and registers the device with FCM.
 * This should be called once when the app starts.
 */
export const initPushNotifications = async () => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.warn("User denied push permissions.");
      return;
    }

    await PushNotifications.register();

    // Listen for registration success to ensure we have a token
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

  } catch (e) {
    console.error("Error initializing push notifications", e);
  }
};

/**
 * Subscribes or unsubscribes the device from a specific team topic.
 * @param {string} teamId - The ID (e.g., 'det_nba', 'unc_fb')
 * @param {boolean} subscribe - True to subscribe, false to unsubscribe
 */
export const manageTeamSubscription = async (teamId, subscribe) => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    if (subscribe) {
      // FCM.subscribeTo handles the heavy lifting of telling the server
      // to link this device to the team's topic string.
      await FCM.subscribeTo({ topic: teamId });
      console.log(`Subscribed to topic: ${teamId}`);
    } else {
      await FCM.unsubscribeFrom({ topic: teamId });
      console.log(`Unsubscribed from topic: ${teamId}`);
    }
  } catch (e) {
    console.error(`FCM Topic Error for ${teamId}:`, e);
  }
};