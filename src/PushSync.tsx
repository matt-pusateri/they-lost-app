import React, { useState } from 'react';
import axios from 'axios';
import { PushNotifications } from '@capacitor/push-notifications';

const API_BASE = 'http://localhost:3000'; // Your server URL

const PushSync = ({ selectedTeams, userEmail }: { selectedTeams: string[], userEmail: string }) => {
  const [status, setStatus] = useState<'idle' | 'syncing' | 'success'>('idle');

  const handleSync = async () => {
    setStatus('syncing');
    try {
      // 1. Get the device token
      await PushNotifications.register();
      const tokenListener = await PushNotifications.addListener('registration', async (token) => {
        // 2. Send everything to your server.js
        await axios.post(`${API_BASE}/register-token`, {
          email: userEmail,
          fcmToken: token.value,
          selectedTeams: selectedTeams
        });
        setStatus('success');
      });
    } catch (err) {
      console.error("Sync failed", err);
      setStatus('idle');
    }
  };

  return (
    <button onClick={handleSync} className="sync-btn">
      {status === 'idle' && "🔔 Enable Outside Alerts"}
      {status === 'syncing' && "Connecting..."}
      {status === 'success' && "✅ Alerts Active!"}
    </button>
  );
};

export default PushSync;