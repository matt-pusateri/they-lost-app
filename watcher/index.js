// watcher/index.js
const { onRequest } = require("firebase-functions/v2/https");

// This function receives the token and teams from your iPhone and saves them to Firestore
exports.registerToken = onRequest({ cors: true }, async (req, res) => {
  try {
    const { email, fcmToken, selectedTeams } = req.body;

    if (!email || !fcmToken) {
      return res.status(400).send("Missing data");
    }

    // This creates the document in the 'users' collection that was missing!
    await db.collection('users').doc(email).set({
      fcmToken: fcmToken,
      selectedTeams: selectedTeams,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    res.status(200).send({ message: "Handshake complete!" });
  } catch (error) {
    logger.error("Registration Error:", error);
    res.status(500).send(error.message);
  }
});


const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

const SCOREBOARD_URLS = {
  nba: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
  nfl: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
  mlb: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
  college_hoops: 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard'
};

/**
 * THE 5-MINUTE AUTOMATION
 * Wakes up every 5 minutes to check ESPN for losses.
 */
exports.checkScoresWatcher = onSchedule("every 5 minutes", async (event) => {
  logger.info("They Lost! Watcher: Starting score check...");

  for (const [league, url] of Object.entries(SCOREBOARD_URLS)) {
    try {
      const { data } = await axios.get(url);
      const events = data.events || [];

      for (const game of events) {
        if (game.status?.type?.name === "STATUS_FINAL") {
          const gameId = game.id;
          const competitors = game.competitions[0]?.competitors || [];
          
          for (const competitor of competitors) {
            const teamSlug = competitor.team?.slug;
            const teamName = competitor.team?.displayName || "Unknown Team";
            const isLoser = competitor.winner === false;

            if (isLoser && teamSlug) {
              const gameRef = db.collection('processedGames').doc(gameId);
              const doc = await gameRef.get();

              if (!doc.exists) {
                logger.info(`Detected Loss: ${teamName}`);
                await sendLossNotification(teamSlug, teamName);
                
                // Use serverTimestamp for accuracy in the cloud
                await gameRef.set({ 
                  processedAt: admin.firestore.FieldValue.serverTimestamp(), 
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
      logger.error(`ESPN API Error (${league}): ${error.message}`);
    }
  }
});

/**
 * THE NOTIFICATION DISPATCHER
 * Finds everyone hating that specific team and sends the alert.
 */
async function sendLossNotification(slug, teamName) {
  try {
    const usersSnapshot = await db.collection('users')
      .where('selectedTeams', 'array-contains', slug)
      .get();

    const tokens = [];
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.fcmToken) tokens.push(data.fcmToken);
    });

    if (tokens.length === 0) {
      logger.info(`No anti-fans found for the ${teamName}.`);
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
    logger.info(`Sent ${response.successCount} notifications for ${teamName}.`);
  } catch (error) {
    logger.error(`Notification Error for ${teamName}: ${error.message}`);
  }
}