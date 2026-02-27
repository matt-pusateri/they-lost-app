import admin from 'firebase-admin';
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(cors());

// 1. INITIALIZE FIREBASE
const serviceAccount = JSON.parse(
  fs.readFileSync('./serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 2. SCOREBOARD SOURCES
const SCOREBOARD_URLS = {
  nba: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
  nfl: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
  mlb: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
  college_hoops: 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard'
};

/**
 * 3. THE MAIN AUTOMATION FUNCTION
 */
async function checkGamesAndNotify() {
  console.log(`Checking scores at ${new Date().toLocaleTimeString()}...`);
  
  for (const [league, url] of Object.entries(SCOREBOARD_URLS)) {
    try {
      const { data } = await axios.get(url);
      const events = data.events || [];

      for (const game of events) {
        if (game.status?.type?.name === "STATUS_FINAL") {
          const gameId = game.id;
          const competitors = game.competitions[0]?.competitors || [];
          
          for (const competitor of competitors) {
            // Defensive check: Ensure we actually have the team slug
            const teamSlug = competitor.team?.slug;
            const teamName = competitor.team?.displayName || "Unknown Team";
            const isLoser = competitor.winner === false;

            if (isLoser && teamSlug) {
              const gameRef = db.collection('processedGames').doc(gameId);
              const doc = await gameRef.get();

              if (!doc.exists) {
                console.log(`Loss detected: The ${teamName} (${teamSlug}) lost!`);
                await sendLossNotification(teamSlug, teamName);
                
                // Mark as processed using only valid data
                await gameRef.set({ 
                  processedAt: new Date(), 
                  team: teamSlug,
                  teamName: teamName,
                  league: league 
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error checking ${league}:`, error.message);
    }
  }
}

/**
 * 4. NOTIFICATION DISPATCHER
 */
async function sendLossNotification(slug, teamName) {
  // If slug is somehow missing, abort before Firestore crashes
  if (!slug) return;

  try {
    const usersSnapshot = await db.collection('users')
      .where('selectedTeams', 'array-contains', slug)
      .get();

    const tokens = [];
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.fcmToken) {
        tokens.push(data.fcmToken);
      }
    });

    if (tokens.length === 0) {
      console.log(`No anti-fans found for the ${teamName}.`);
      return;
    }

    const message = {
      notification: {
        title: 'They Lost!',
        body: `Great news: The ${teamName} just lost!`,
      },
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Successfully sent ${response.successCount} notifications for the ${teamName} loss.`);
  } catch (error) {
    console.error(`Error sending notifications for ${teamName}:`, error.message);
  }
}

// 5. SCHEDULE & START
setInterval(checkGamesAndNotify, 5 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`They Lost! server is running on port ${PORT}`);
  checkGamesAndNotify();
});