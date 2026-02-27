const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();
const fcm = admin.messaging();

// --- 1. CONFIGURATION & DATA MAPPING ---
// (We keep the raw teams list compact for brevity, but this must match your frontend list)
const RAW_TEAMS = {
  NBA: [['bos_nba','Boston','Celtics','#007A33','East'],['bkn_nba','Brooklyn','Nets','#000000','East'],['ny_nba','New York','Knicks','#F58426','East'],['phi_nba','Philly','76ers','#006BB6','East'],['tor_nba','Toronto','Raptors','#CE1141','East'],['chi_nba','Chicago','Bulls','#CE1141','East'],['cle_nba','Cleveland','Cavaliers','#860038','East'],['det_nba','Detroit','Pistons','#C8102E','East'],['ind_nba','Indiana','Pacers','#FDBB30','East'],['mil_nba','Milwaukee','Bucks','#00471B','East'],['atl_nba','Atlanta','Hawks','#E03A3E','East'],['cha_nba','Charlotte','Hornets','#1D1160','East'],['mia_nba','Miami','Heat','#98002E','East'],['orl_nba','Orlando','Magic','#0077C0','East'],['wsh_nba','Washington','Wizards','#002B5C','East'],['den_nba','Denver','Nuggets','#0E2240','East'],['min_nba','Minnesota','Timberwolves','#0C2340','West'],['okc_nba','OKC','Thunder','#007AC1','West'],['por_nba','Portland','Trail Blazers','#E03A3E','West'],['uta_nba','Utah','Jazz','#002B5C','West'],['gs_nba','Golden State','Warriors','#1D428A','West'],['lac_nba','LA Clippers','Clippers','#C8102E','West'],['lal_nba','LA Lakers','Lakers','#552583','West'],['phx_nba','Phoenix','Suns','#1D1160','West'],['sac_nba','Sacramento','Kings','#5A2D81','West'],['dal_nba','Dallas','Mavericks','#00538C','West'],['hou_nba','Houston','Rockets','#CE1141','West'],['mem_nba','Memphis','Grizzlies','#5D76A9','West'],['no_nba','New Orleans','Pelicans','#0C2340','West'],['sas_nba','San Antonio','Spurs','#C4CED4','West']],
  MLB: [['bal_mlb','Baltimore','Orioles','#DF4601','AL East'],['bos_mlb','Boston','Red Sox','#BD3039','AL East'],['nyy_mlb','NY Yankees','Yankees','#003087','AL East'],['tb_mlb','Tampa Bay','Rays','#092C5C','AL East'],['tor_mlb','Toronto','Blue Jays','#134A8E','AL East'],['cws_mlb','Chi White Sox','White Sox','#27251F','AL Central'],['cle_mlb','Cleveland','Guardians','#00385D','AL Central'],['det_mlb','Detroit','Tigers','#0C2340','AL Central'],['kc_mlb','Kansas City','Royals','#004687','AL Central'],['min_mlb','Minnesota','Twins','#002B5C','AL Central'],['hou_mlb','Houston','Astros','#002D62','AL West'],['laa_mlb','LA Angels','Angels','#BA0021','AL West'],['oak_mlb','Oakland','Athletics','#003831','AL West'],['sea_mlb','Seattle','Mariners','#0C2C56','AL West'],['tex_mlb','Texas','Rangers','#003278','AL West'],['atl_mlb','Atlanta','Braves','#13274F','NL East'],['mia_mlb','Miami','Marlins','#00A3E0','NL East'],['nym_mlb','NY Mets','Mets','#002D72','NL East'],['phi_mlb','Philadelphia','Phillies','#E81828','NL East'],['wsh_mlb','Washington','Nationals','#AB0003','NL East'],['chc_mlb','Chi Cubs','Cubs','#0E3386','NL Central'],['cin_mlb','Cincinnati','Reds','#C6011F','NL Central'],['mil_mlb','Milwaukee','Brewers','#12284B','NL Central'],['pit_mlb','Pittsburgh','Pirates','#FDB827','NL Central'],['stl_mlb','St. Louis','Cardinals','#C41E3A','NL Central'],['ari_mlb','Arizona','Diamondbacks','#A71930','NL West'],['col_mlb','Colorado','Rockies','#333366','NL West'],['lad_mlb','LA Dodgers','Dodgers','#005A9C','NL West'],['sd_mlb','San Diego','Padres','#2F241D','NL West'],['sf_mlb','San Francisco','Giants','#FD5A1E','NL West']],
  NFL: [['ari_nfl','Arizona','Cardinals','#97233F','NFC West'],['atl_nfl','Atlanta','Falcons','#a71930','NFC South'],['bal_nfl','Baltimore','Ravens','#241773','AFC North'],['buf_nfl','Buffalo','Bills','#00338D','AFC East'],['car_nfl','Carolina','Panthers','#0085CA','NFC South'],['chi_nfl','Chicago','Bears','#0B162A','NFC North'],['cin_nfl','Cincinnati','Bengals','#fb4f14','AFC North'],['cle_nfl','Cleveland','Browns','#311D00','AFC North'],['dal_nfl','Dallas','Cowboys','#003594','NFC East'],['den_nfl','Denver','Broncos','#FB4F14','AFC West'],['det_nfl','Detroit','Lions','#0076b6','NFC North'],['gb_nfl','Green Bay','Packers','#203731','NFC North'],['hou_nfl','Houston','Texans','#03202f','AFC South'],['ind_nfl','Indianapolis','Colts','#002C5F','AFC South'],['jax_nfl','Jacksonville','Jaguars','#101820','AFC South'],['kc_nfl','Kansas City','Chiefs','#E31837','AFC West'],['lv_nfl','Las Vegas','Raiders','#000000','AFC West'],['lac_nfl','LA Chargers','Chargers','#0080C6','AFC West'],['lar_nfl','LA Rams','Rams','#003594','NFC West'],['mia_nfl','Miami','Dolphins','#008E97','AFC East'],['min_nfl','Minnesota','Vikings','#4F2683','NFC North'],['ne_nfl','New England','Patriots','#002244','AFC East'],['no_nfl','New Orleans','Saints','#D3BC8D','NFC South'],['nyg_nfl','NY Giants','Giants','#0B2265','NFC East'],['nyj_nfl','NY Jets','Jets','#125740','AFC East'],['phi_nfl','Philadelphia','Eagles','#004C54','NFC East'],['pit_nfl','Pittsburgh','Steelers','#FFB612','AFC North'],['sf_nfl','San Francisco','49ers','#AA0000','NFC West'],['sea_nfl','Seattle','Seahawks','#002244','NFC West'],['tb_nfl','Tampa Bay','Buccaneers','#D50A0A','NFC South'],['ten_nfl','Tennessee','Titans','#0C2340','AFC South'],['wsh_nfl','Washington','Commanders','#5a1414','NFC East']],
  NCAA: [['unc','North Carolina','Tar Heels','#4B9CD3','ACC'],['duke','Duke','Blue Devils','#003087','ACC'],['uva','Virginia','Cavaliers','#232D4B','ACC'],['vtech','Virginia Tech','Hokies','#630031','ACC'],['mia','Miami','Hurricanes','#F47321','ACC'],['ncst','NC State','Wolfpack','#CC0000','ACC'],['lou','Louisville','Cardinals','#C90031','ACC'],['nd','Notre Dame','Fighting Irish','#0C2340','ACC'],['fsu','Florida St','Seminoles','#782F40','ACC'],['syr','Syracuse','Orange','#F76900','ACC'],['bc','Boston College','Eagles','#98002E','ACC'],['msu','Michigan St','Spartans','#18453B','Big Ten'],['mich','Michigan','Wolverines','#00274C','Big Ten'],['osu','Ohio State','Buckeyes','#BB0000','Big Ten'],['ill','Illinois','Illini','#E84A27','Big Ten'],['pur','Purdue','Boilermakers','#CEB888','Big Ten'],['iu','Indiana','Hoosiers','#990000','Big Ten'],['wis','Wisconsin','Badgers','#C5050C','Big Ten'],['iowa','Iowa','Hawkeyes','#FFCD00','Big Ten'],['umd','Maryland','Terrapins','#E03A3E','Big Ten'],['rut','Rutgers','Scarlet Knights','#CC0033','Big Ten'],['nw','Northwestern','Wildcats','#4E2A84','Big Ten'],['nebr','Nebraska','Cornhuskers','#E41C38','Big Ten'],['uky','Kentucky','Wildcats','#0033A0','SEC'],['ala','Alabama','Crimson Tide','#9E1B32','SEC'],['aub','Auburn','Tigers','#0C2340','SEC'],['tenn','Tennessee','Volunteers','#FF8200','SEC'],['fla','Florida','Gators','#0021A5','SEC'],['ark','Arkansas','Razorbacks','#9D2235','SEC'],['lsu_bb','LSU','Tigers','#461D7C','SEC'],['miz_bb','Missouri','Tigers','#F1B82D','SEC'],['sc_bb','South Carolina','Gamecocks','#73000A','SEC'],['uga_bb','Georgia','Bulldogs','#BA0C2F','SEC'],['ole_bb','Ole Miss','Rebels','#CE1126','SEC'],['msst_bb','Miss State','Bulldogs','#660000','SEC'],['tam_bb','Texas A&M','Aggies','#500000','SEC'],['van_bb','Vanderbilt','Commodores','#000000','SEC'],['tex','Texas','Longhorns','#BF5700','SEC'],['okl_bb','Oklahoma','Sooners','#841617','SEC'],['ku','Kansas','Jayhawks','#0051BA','Big 12'],['bay','Baylor','Bears','#154734','Big 12'],['hou','Houston','Cougars','#C8102E','Big 12'],['isu','Iowa State','Cyclones','#C8102E','Big 12'],['textech','Texas Tech','Red Raiders','#CC0000','Big 12'],['conn','UConn','Huskies','#000E2F','Big East'],['nova','Villanova','Wildcats','#00205B','Big East'],['marq','Marquette','Golden Eagles','#003366','Big East'],['stj',"St. John's",'Red Storm','#BA0C2F','Big East'],['gonz','Gonzaga','Bulldogs','#041E42','WCC'],['ucla','UCLA','Bruins','#2D68C4','Pac-12'],['usc_bb','USC','Trojans','#990000','Pac-12'],['ari','Arizona','Wildcats','#CC0033','Pac-12'],['asu','Arizona St','Sun Devils','#8C1D40','Pac-12'],['sdsu','San Diego St','Aztecs','#A6192E','MWC'],['mem','Memphis','Tigers','#0033A0','AAC'],['gtown','Georgetown','Hoyas','#041E42','Big East'],['psu','Penn State','Nittany Lions','#041E42','Big Ten'],['minn','Minnesota','Golden Gophers','#7A0019','Big Ten'],['ore','Oregon','Ducks','#154733','Big Ten'],['wash','Washington','Huskies','#4B2E83','Big Ten'],['crei','Creighton','Bluejays','#0055A2','Big East'],['prov','Providence','Friars','#000000','Big East'],['hall','Seton Hall','Pirates','#004488','Big East'],['xav','Xavier','Musketeers','#0C2340','Big East'],['but','Butler','Bulldogs','#003162','Big East'],['dep','DePaul','Blue Demons','#0055A2','Big East'],['ksu','Kansas St','Wildcats','#512888','Big 12'],['okst','Oklahoma St','Cowboys','#FF7300','Big 12'],['tcu','TCU','Horned Frogs','#4D1979','Big 12'],['wvu','West Virginia','Mountaineers','#002855','Big 12'],['byu','BYU','Cougars','#002E5D','Big 12'],['cin','Cincinnati','Bearcats','#E00122','Big 12'],['ucf','UCF','Knights','#BA9B37','Big 12'],['colo','Colorado','Buffaloes','#CFB87C','Big 12'],['utah','Utah','Utes','#CC0000','Big 12'],['clem','Clemson','Tigers','#F56600','ACC'],['gt','Georgia Tech','Yellow Jackets','#B3A369','ACC'],['pitt','Pittsburgh','Panthers','#003594','ACC'],['wake','Wake Forest','Demon Deacons','#9E7E38','ACC'],['smu','SMU','Mustangs','#0033A0','ACC'],['cal','Cal','Golden Bears','#003262','ACC'],['stan','Stanford','Cardinal','#8C1515','ACC']],
  CFB: [['ala_fb','Alabama','Crimson Tide','#9E1B32','SEC'],['uga','Georgia','Bulldogs','#BA0C2F','SEC'],['tex_fb','Texas','Longhorns','#BF5700','SEC'],['lsu','LSU','Tigers','#461D7C','SEC'],['tenn_fb','Tennessee','Volunteers','#FF8200','SEC'],['ole','Ole Miss','Rebels','#CE1126','SEC'],['miz','Missouri','Tigers','#F1B82D','SEC'],['okl','Oklahoma','Sooners','#841617','SEC'],['fla_fb','Florida','Gators','#0021A5','SEC'],['aub_fb','Auburn','Tigers','#0C2340','SEC'],['tam','Texas A&M','Aggies','#500000','SEC'],['ark_fb','Arkansas','Razorbacks','#9D2235','SEC'],['uky_fb','Kentucky','Wildcats','#0033A0','SEC'],['sc','South Carolina','Gamecocks','#73000A','SEC'],['van','Vanderbilt','Commodores','#000000','SEC'],['msst','Miss State','Bulldogs','#660000','SEC'],['mich_fb','Michigan','Wolverines','#00274C','Big Ten'],['osu_fb','Ohio State','Buckeyes','#BB0000','Big Ten'],['psu','Penn State','Nittany Lions','#041E42','Big Ten'],['ore','Oregon','Ducks','#154733','Big Ten'],['wash','Washington','Huskies','#4B2E83','Big Ten'],['usc_fb','USC','Trojans','#990000','Big Ten'],['ucla_fb','UCLA','Bruins','#2D68C4','Big Ten'],['wis_fb','Wisconsin','Badgers','#C5050C','Big Ten'],['iowa','Iowa','Hawkeyes','#FFCD00','Big Ten'],['neb','Nebraska','Cornhuskers','#E41C38','Big Ten'],['msu_fb','Michigan St','Spartans','#18453B','Big Ten'],['minn_fb','Minnesota','Gophers','#7A0019','Big Ten'],['ill_fb','Illinois','Illini','#E84A27','Big Ten'],['pur_fb','Purdue','Boilermakers','#CEB888','Big Ten'],['umd_fb','Maryland','Terrapins','#E03A3E','Big Ten'],['rut','Rutgers','Scarlet Knights','#CC0033','Big Ten'],['ind_fb','Indiana','Hoosiers','#990000','Big Ten'],['nw','Northwestern','Wildcats','#4E2A84','Big Ten'],['fsu_fb','Florida St','Seminoles','#782F40','ACC'],['clem_fb','Clemson','Tigers','#F56600','ACC'],['mia_fb','Miami','Hurricanes','#F47321','ACC'],['unc_fb','North Carolina','Tar Heels','#99badd','ACC'],['ncst_fb','NC State','Wolfpack','#CC0000','ACC'],['duke_fb','Duke','Blue Devils','#003087','ACC'],['vt','Virginia Tech','Hokies','#630031','ACC'],['uva_fb','Virginia','Cavaliers','#232D4B','ACC'],['lou_fb','Louisville','Cardinals','#C90031','ACC'],['pitt','Pittsburgh','Panthers','#003594','ACC'],['syr_fb','Syracuse','Orange','#F76900','ACC'],['gt','Georgia Tech','Yellow Jackets','#B3A369','ACC'],['bc','Boston College','Eagles','#98002E','ACC'],['wake_fb','Wake Forest','Demon Deacons','#9E7E38','ACC'],['cal','Cal','Golden Bears','#003262','ACC'],['stan','Stanford','Cardinal','#8C1515','ACC'],['smu','SMU','Mustangs','#0033A0','ACC'],['okst','Oklahoma St','Cowboys','#FF7300','Big 12'],['ksu','Kansas St','Wildcats','#512888','Big 12'],['ku_fb','Kansas','Jayhawks','#0051BA','Big 12'],['isu_fb','Iowa State','Cyclones','#C8102E','Big 12'],['utah','Utah','Utes','#CC0000','Big 12'],['ari_fb','Arizona','Wildcats','#CC0033','Big 12'],['asu','Arizona St','Sun Devils','#8C1D40','Big 12'],['colo','Colorado','Buffaloes','#CFB87C','Big 12'],['byu','BYU','Cougars','#002E5D','Big 12'],['tcu','TCU','Horned Frogs','#4D1979','Big 19'],['bay_fb','Baylor','Bears','#154734','Big 12'],['tt','Texas Tech','Red Raiders','#CC0000','Big 12'],['wvu','West Virginia','Mountaineers','#002855','Big 12'],['ucf','UCF','Knights','#BA9B37','Big 12'],['cin_fb','Cincinnati','Bearcats','#E00122','Big 12'],['hou_fb','Houston','Cougars','#C8102E','Big 12'],['nd','Notre Dame','Fighting Irish','#0C2340','Ind'],['orst','Oregon St','Beavers','#DC4405','Pac-12'],['wsu','Wash State','Cougars','#981E32','Pac-12']]
};

const TEAM_MAP = {};
Object.entries(RAW_TEAMS).forEach(([league, teams]) => {
    teams.forEach(t => {
        TEAM_MAP[t[0]] = { id: t[0], name: t[1], mascot: t[2], color: t[3], league: league };
    });
});

// --- HELPER: FIND TEAM ID ---
const findTeamIdByEspnData = (espnTeam, league) => {
    const abbr = espnTeam.team.abbreviation.toLowerCase();
    const displayName = espnTeam.team.displayName.toLowerCase();
    
    // 1. Try strict ID match (e.g. "LAL" -> "lal_nba")
    const directMatch = Object.values(TEAM_MAP).find(t => {
        const cleanId = t.id.replace(/_nba|_bb|_fb|_mlb|_nfl|_wnba$/, '').toLowerCase();
        return cleanId === abbr && t.league === league; 
    });
    if (directMatch) return directMatch.id;

    // 2. Try Name Match (e.g. "Lakers" -> "lal_nba")
    const nameMatch = Object.values(TEAM_MAP).find(t => {
        return (displayName === t.name.toLowerCase() || displayName === t.mascot.toLowerCase()) && t.league === league;
    });
    if (nameMatch) return nameMatch.id;

    return null; 
};

// --- HELPER: GET DATES WITH NY TIMEZONE ---
const getTargetDates = () => {
    // FORCE New York Time for "Today" and "Yesterday"
    const now = new Date();
    
    // Convert current server time to NY time options
    const nyOptions = { timeZone: "America/New_York", year: 'numeric', month: '2-digit', day: '2-digit' };
    
    // Format Today
    const todayParts = new Intl.DateTimeFormat('en-CA', nyOptions).formatToParts(now);
    // en-CA gives YYYY-MM-DD. We can just use the formatter directly.
    
    // Easier way:
    const getNYDateStr = (dateObj) => {
        return dateObj.toLocaleDateString("en-CA", { timeZone: "America/New_York" }).replace(/-/g, '');
    };

    const todayStr = getNYDateStr(now);
    
    const yesterday = new Date(now);
    yesterday.setHours(yesterday.getHours() - 24); // Subtract 24 hours safely
    const yesterdayStr = getNYDateStr(yesterday);

    return [todayStr, yesterdayStr];
};

// --- REGISTER TOKEN ---
exports.registerToken = onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(204).send('');

    try {
        const { email, fcmToken, selectedTeams } = req.body;
        if (!fcmToken) return res.status(400).json({ error: 'Missing fcmToken' });

        await db.collection('users').doc(fcmToken).set({
            email: email || null,
            fcmToken: fcmToken,
            selectedTeams: selectedTeams || [],
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        return res.status(200).json({ message: 'Handshake complete!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// --- CHECK SCORES (CRITICAL TIMEZONE FIX) ---
exports.checkScores = onSchedule("every 5 minutes", async (event) => {
    const datesToCheck = getTargetDates();
    console.log(`🔍 Checking scores for: ${datesToCheck.join(', ')} (NY Time)`);

    // Added random number to bypass aggressive caching
    const ts = Date.now(); 

    const leagues = ['NCAA', 'NBA', 'NFL', 'MLB', 'CFB'];
    const pathMap = {
        'NCAA': 'basketball/mens-college-basketball',
        'CFB': 'football/college-football',
        'NBA': 'basketball/nba',
        'NFL': 'football/nfl',
        'MLB': 'baseball/mlb'
    };

    for (const league of leagues) {
        const sportPath = pathMap[league];
        let urls = [];
        
        datesToCheck.forEach(dateStr => {
            // Added limit=1000 and cache buster
            urls.push(`https://site.api.espn.com/apis/site/v2/sports/${sportPath}/scoreboard?dates=${dateStr}&limit=1000&_=${ts}`);
        });

        try {
            const responses = await Promise.all(urls.map(url => axios.get(url).catch(e => null)));
            const allEvents = responses.reduce((acc, res) => {
                if (res && res.data && res.data.events) return [...acc, ...res.data.events];
                return acc;
            }, []);

            const uniqueEvents = Array.from(new Map(allEvents.map(e => [e.id, e])).values());

            for (const event of uniqueEvents) {
                if (!event.status.type.completed) continue;

                // *** TIMEZONE FIX ***
                // Convert the Game's date to NY time string (YYYYMMDD) to compare with datesToCheck
                const gameDateNY = new Date(event.date).toLocaleDateString("en-CA", { timeZone: "America/New_York" }).replace(/-/g, '');
                
                // If the game date (in NY time) matches our target dates, process it.
                if (!datesToCheck.includes(gameDateNY)) {
                    // It's an old game or future game relative to NY, skip.
                    continue; 
                }

                // Check specifically for deduplication
                const gameRef = db.collection('alerted_games').doc(event.id);
                const doc = await gameRef.get();
                if (doc.exists) continue;

                const comp = event.competitions[0];
                const h = comp.competitors.find(c => c.homeAway === 'home');
                const a = comp.competitors.find(c => c.homeAway === 'away');
                const scoreH = parseInt(h.score);
                const scoreA = parseInt(a.score);
                
                let loser = null;
                let winner = null;
                
                if (scoreH < scoreA) { loser = h; winner = a; }
                else if (scoreA < scoreH) { loser = a; winner = h; }

                if (!loser) continue; 

                const loserTeamId = findTeamIdByEspnData(loser, league);

                if (loserTeamId) {
                    try {
                        await db.runTransaction(async (t) => {
                            const freshDoc = await t.get(gameRef);
                            if (freshDoc.exists) return; // double-check inside transaction

                            const teamName = TEAM_MAP[loserTeamId].name;
                            const winnerName = winner.team.displayName;
                            const margin = Math.abs(winner.score - loser.score);
                            const isBigMargin = (league === 'NBA' || league === 'NCAA') && margin > 10;
                            
                            const messages = isBigMargin ? 
                                [`All is right with the world. ${teamName} lost by ${margin}! 🌍`, `${teamName} got demolished by ${margin} points. 📉`] : 
                                [`So... ${winnerName} beat ${teamName}. 😬`, `Yes! ${winnerName} took down ${teamName}.`];

                            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                            
                            // FIND USERS
                            const usersSnapshot = await db.collection('users')
                                .where('selectedTeams', 'array-contains-any', [
                                    loserTeamId,
                                    loserTeamId.split('_')[0],
                                    loserTeamId.split('_')[0].toUpperCase(),
                                    teamName,
                                    TEAM_MAP[loserTeamId].mascot
                                ])
                                .get();

                            if (usersSnapshot.empty) return;

                            // SEND PUSH
                            const notifications = [];
                            usersSnapshot.forEach(userDoc => {
                                const token = userDoc.data().fcmToken;
                                if (token) {
                                    const payload = {
                                        notification: { title: "🎉 THEY LOST!", body: randomMessage },
                                        apns: {
                                            payload: {
                                                aps: {
                                                    alert: { title: "🎉 THEY LOST!", body: randomMessage },
                                                    sound: "default",
                                                    badge: 1,
                                                    "content-available": 1
                                                }
                                            }
                                        },
                                        data: { gameId: String(event.id), teamName: String(teamName) },
                                        token: token
                                    };
                                    notifications.push(fcm.send(payload).catch(e => console.error(e)));
                                }
                            });

                            await Promise.all(notifications);

                            t.set(gameRef, { 
                                sentAt: admin.firestore.FieldValue.serverTimestamp(),
                                matchup: `${teamName} vs ${winnerName}`,
                                notifiedUsers: usersSnapshot.size
                            });
                        });
                    } catch (e) { console.error(e); }
                }
            }
        } catch (err) { console.error(err); }
    }
});