import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PushNotifications } from '@capacitor/push-notifications';

// REPLACE THIS with your actual deployed backend URL (e.g., https://your-app.render.com)
const API_BASE = 'http://localhost:3000'; 

const ManageEnemies = ({ userEmail }) => {
  const [allTeams, setAllTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fcmToken, setFcmToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // 1. Fetch the dynamic team list from the server
        const { data } = await axios.get(`${API_BASE}/available-teams`);
        setAllTeams(data);

        // 2. Setup Push Notifications to get the device token
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive !== 'granted') {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive === 'granted') {
          await PushNotifications.register();
          
          PushNotifications.addListener('registration', (token) => {
            setFcmToken(token.value);
            console.log("Device Token registered:", token.value);
          });
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const toggleTeam = (teamId) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    );
  };

  const savePreferences = async () => {
    if (!fcmToken) {
      alert("Push notification token not found. Please ensure notifications are enabled in your phone settings.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/register-token`, {
        email: userEmail,
        fcmToken: fcmToken,
        selectedTeams: selectedTeams
      });
      alert("Success! Your enemies have been updated.");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Check your server connection.");
    }
  };

  const filteredTeams = allTeams.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading team rosters...</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Manage Your Enemies</h2>
      <p className="text-sm text-gray-600 mb-4">
        Search for teams you want to see lose. We'll send a "They Lost!" alert when they do.
      </p>
      
      <input 
        type="text" 
        placeholder="Search (e.g. Lakers, Bears, Duke...)" 
        className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="h-96 overflow-y-auto border border-gray-200 rounded p-2 mb-4 bg-gray-50">
        {filteredTeams.length > 0 ? (
          filteredTeams.map(team => (
            <div key={team.id} className="flex items-center p-3 hover:bg-gray-100 border-b border-gray-100 last:border-0">
              <input 
                type="checkbox"
                id={team.id}
                className="w-5 h-5 text-red-600 border-gray-300 rounded cursor-pointer"
                checked={selectedTeams.includes(team.id)}
                onChange={() => toggleTeam(team.id)}
              />
              <label htmlFor={team.id} className="ml-3 flex-grow cursor-pointer flex justify-between">
                <span className="font-medium text-gray-800">{team.name}</span>
                <span className="text-xs font-bold text-gray-400 uppercase">{team.league}</span>
              </label>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No teams found. Try another search.</div>
        )}
      </div>

      <button 
        onClick={savePreferences}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md"
      >
        Save & Sync Preferences
      </button>
    </div>
  );
};

export default ManageEnemies;