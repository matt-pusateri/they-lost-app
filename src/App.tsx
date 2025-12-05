import React, { useState, useEffect, useRef } from 'react';
import { Trophy, AlertTriangle, RefreshCw, Share2, Trash2, X, Copy, PartyPopper, History, Search, Globe, Bell, ExternalLink, Palette, Settings, ToggleLeft, ToggleRight, Target, Activity, LogOut, Clock, Check } from 'lucide-react';

// --- 1. UTILITIES & CONFIG ---

const APP_VERSION = "1.3.1"; // Updated Version

const APP_ICON = "https://ik.imagekit.io/ipi1yjzh9/theylost%20icon%20512.png";

const CELEBRATION_GIFS = [
  "https://i.giphy.com/media/HmdsITkYtq5i/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmt2M2o4dnZ6OWRud2NmNm85bzNndmR6ZDRmemRmaWhjdW5oZmN4NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fUQ4rhUZJYiQsas6WD/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGhwZ3Q0dDE0NzF6MzY3bW1vdjMwcHo1ajdwM21zdjJ1cXMxdmdyNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/axu6dFuca4HKM/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGhwZ3Q0dDE0NzF6MzY3bW1vdjMwcHo1ajdwM21zdjJ1cXMxdmdyNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/o75ajIFH0QnQC3nCeD/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGhwZ3Q0dDE0NzF6MzY3bW1vdjMwcHo1ajdwM21zdjJ1cXMxdmdyNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9Y6n9TR7U07ew/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGhwZ3Q0dDE0NzF6MzY3bW1vdjMwcHo1ajdwM21zdjJ1cXMxdmdyNiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BWplyaNrHRjRvweNjS/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aGd2dGp4N2M2cHRlNzc4Yndvczg3N20zdDF2N3IyNXJoeDBmYXVmNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3NtY188QaxDdC/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aGd2dGp4N2M2cHRlNzc4Yndvczg3N20zdDF2N3IyNXJoeDBmYXVmNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kEKcOWl8RMLde/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Y3Btd3RqN3YzdHM4YTFlMWkzdjA4OGNvbG5iZjR1b2hvaTlxeWY3ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/aq6Thivv9V9lu/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3Y3Btd3RqN3YzdHM4YTFlMWkzdjA4OGNvbG5iZjR1b2hvaTlxeWY3ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kKo2x2QSWMNfW/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MWMwZnFieGtiOGxyd3ZqcmxqejNjcTVjcjloZHZsdGlvNG1oNGM0YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEjHI8WJv4x6UPDB6/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MWMwZnFieGtiOGxyd3ZqcmxqejNjcTVjcjloZHZsdGlvNG1oNGM0YSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/inyqrgp9o3NUA/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3NWFibGJuOGZwdmdwOXBlaTdseGt0eXo1cG10c3N2cGZ2b245OW8xbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XR9Dp54ZC4dji/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3aDk0OXJieXl2NWloNzU1dG9yZXB1dHJnaXlyN2xsYms3N20yM3BwdSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1LweXxLwVT0J2/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YXJ1aWprZnVlMDd3ajdlMGpnM2ljNHN6czVyaGZqdDE3N3hsdmtuNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DpB9NBjny7jF1pd0yt2/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3eHgzYzl2bHJvZmRkaG85eGhuYmkwaWIwa3dpdWtzNnJseWEyc3htbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/uxLVaMUiycgpO/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNG5xMW05NXE5N2JqeWV4d3lvcnJkejZmN3RmMWh1Nzc5b2gwdGVvaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/T87BZ7cyOH7TwDBgwy/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNG5xMW05NXE5N2JqeWV4d3lvcnJkejZmN3RmMWh1Nzc5b2gwdGVvaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/61MN4zqj333nTdtLEH/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNG5xMW05NXE5N2JqeWV4d3lvcnJkejZmN3RmMWh1Nzc5b2gwdGVvaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/11sBLVxNs7v6WA/giphy.gif"
];

const TRASH_TALK = [
  "Thoughts and prayers. 🙏", "Someone check on their fans. 😂", "Inject this into my veins. 💉",
  "Down bad. 📉", "Holding that L. 🥡", "Chef's kiss. 🤌", "Pure cinema. 🍿", "Exposed.",
  "They are who we thought they were.", "Hang the banner: 'Participated'.", "Sucks to suck.",
  "Have a safe flight home! 👋", "Call the waaaambulance. 🚑", "Keep crying.", "Delicious tears. 💧",
  "Oof. Big oof.", "Warm up the bus!", "This sparks joy. ✨", "Emotional damage. 💥"
];

const THEMES = {
  professional: { name: "Professional", bg: "bg-slate-100", text: "text-slate-900", header: "bg-blue-600 text-white shadow-md", card: "bg-white border-slate-200 shadow-sm rounded-2xl", accent: "text-blue-600", accentBg: "bg-blue-50", buttonPrimary: "bg-blue-900 text-white", lossBanner: "bg-green-600 text-white" },
  midnight: { name: "Midnight", bg: "bg-slate-950", text: "text-slate-100", header: "bg-slate-900 text-white border-b border-slate-800", card: "bg-slate-900 border-slate-800 shadow-lg rounded-xl", accent: "text-indigo-400", accentBg: "bg-slate-800", buttonPrimary: "bg-indigo-600 text-white", lossBanner: "bg-indigo-600 text-white" },
  playbook: { name: "Playbook", bg: "bg-emerald-50", text: "text-emerald-950", header: "bg-emerald-800 text-white border-b-4 border-emerald-600", card: "bg-white border-emerald-200 shadow-sm rounded-lg", accent: "text-emerald-700", accentBg: "bg-emerald-100", buttonPrimary: "bg-emerald-800 text-white", lossBanner: "bg-emerald-700 text-white" }
};

// --- 2. DATA COMPRESSION ---
// Format: [id, name, mascot, color, conference]
const RAW_TEAMS = {
  MLB: [
    ['bal_mlb','Baltimore','Orioles','#DF4601','AL East'],['bos_mlb','Boston','Red Sox','#BD3039','AL East'],
    ['nyy_mlb','NY Yankees','Yankees','#003087','AL East'],['tb_mlb','Tampa Bay','Rays','#092C5C','AL East'],
    ['tor_mlb','Toronto','Blue Jays','#134A8E','AL East'],['cws_mlb','Chi White Sox','White Sox','#27251F','AL Central'],
    ['cle_mlb','Cleveland','Guardians','#00385D','AL Central'],['det_mlb','Detroit','Tigers','#0C2340','AL Central'],
    ['kc_mlb','Kansas City','Royals','#004687','AL Central'],['min_mlb','Minnesota','Twins','#002B5C','AL Central'],
    ['hou_mlb','Houston','Astros','#002D62','AL West'],['laa_mlb','LA Angels','Angels','#BA0021','AL West'],
    ['oak_mlb','Oakland','Athletics','#003831','AL West'],['sea_mlb','Seattle','Mariners','#0C2C56','AL West'],
    ['tex_mlb','Texas','Rangers','#003278','AL West'],['atl_mlb','Atlanta','Braves','#13274F','NL East'],
    ['mia_mlb','Miami','Marlins','#00A3E0','NL East'],['nym_mlb','NY Mets','Mets','#002D72','NL East'],
    ['phi_mlb','Philadelphia','Phillies','#E81828','NL East'],['wsh_mlb','Washington','Nationals','#AB0003','NL East'],
    ['chc_mlb','Chi Cubs','Cubs','#0E3386','NL Central'],['cin_mlb','Cincinnati','Reds','#C6011F','NL Central'],
    ['mil_mlb','Milwaukee','Brewers','#12284B','NL Central'],['pit_mlb','Pittsburgh','Pirates','#FDB827','NL Central'],
    ['stl_mlb','St. Louis','Cardinals','#C41E3A','NL Central'],['ari_mlb','Arizona','Diamondbacks','#A71930','NL West'],
    ['col_mlb','Colorado','Rockies','#333366','NL West'],['lad_mlb','LA Dodgers','Dodgers','#005A9C','NL West'],
    ['sd_mlb','San Diego','Padres','#2F241D','NL West'],['sf_mlb','San Francisco','Giants','#FD5A1E','NL West']
  ],
  NCAA: [
    ['duke','Duke','Blue Devils','#003087','ACC'],['unc','North Carolina','Tar Heels','#99badd','ACC'],
    ['uva','Virginia','Cavaliers','#232D4B','ACC'],['mia','Miami','Hurricanes','#F47321','ACC'],
    ['ncst','NC State','Wolfpack','#CC0000','ACC'],['msu','Michigan St','Spartans','#18453B','Big Ten'],
    ['mich','Michigan','Wolverines','#00274C','Big Ten'],['osu','Ohio State','Buckeyes','#BB0000','Big Ten'],
    ['iu','Indiana','Hoosiers','#990000','Big Ten'],['pur','Purdue','Boilermakers','#CEB888','Big Ten'],
    ['ill','Illinois','Illini','#E84A27','Big Ten'],['ucla','UCLA','Bruins','#2D68C4','Big Ten'],
    ['usc','USC','Trojans','#990000','Big Ten'],['md','Maryland','Terrapins','#E03A3E','Big Ten'],
    ['uky','Kentucky','Wildcats','#0033A0','SEC'],['ala','Alabama','Crimson Tide','#9E1B32','SEC'],
    ['aub','Auburn','Tigers','#0C2340','SEC'],['tenn','Tennessee','Volunteers','#FF8200','SEC'],
    ['fla','Florida','Gators','#0021A5','SEC'],['ark','Arkansas','Razorbacks','#9D2235','SEC'],
    ['tex','Texas','Longhorns','#BF5700','SEC'],['ku','Kansas','Jayhawks','#0051BA','Big 12'],
    ['bay','Baylor','Bears','#154734','Big 12'],['hou','Houston','Cougars','#C8102E','Big 12'],
    ['isu','Iowa State','Cyclones','#C8102E','Big 12'],['ari','Arizona','Wildcats','#CC0033','Big 12'],
    ['conn','UConn','Huskies','#000E2F','Big East'],['nova','Villanova','Wildcats','#00205B','Big East'],
    ['marq','Marquette','Golden Eagles','#003366','Big East'],['stj',"St. John's",'Red Storm','#BA0C2F','Big East'],
    ['gonz','Gonzaga','Bulldogs','#041E42','WCC'],['gtown','Georgetown','Hoyas','#041E42','Big East']
  ],
  CFB: [
    ['ala_fb','Alabama','Crimson Tide','#9E1B32','SEC'],['uga','Georgia','Bulldogs','#BA0C2F','SEC'],
    ['tex_fb','Texas','Longhorns','#BF5700','SEC'],['lsu','LSU','Tigers','#461D7C','SEC'],
    ['tenn_fb','Tennessee','Volunteers','#FF8200','SEC'],['ole','Ole Miss','Rebels','#CE1126','SEC'],
    ['miz','Missouri','Tigers','#F1B82D','SEC'],['okl','Oklahoma','Sooners','#841617','SEC'],
    ['fla_fb','Florida','Gators','#0021A5','SEC'],['aub_fb','Auburn','Tigers','#0C2340','SEC'],
    ['tam','Texas A&M','Aggies','#500000','SEC'],['ark_fb','Arkansas','Razorbacks','#9D2235','SEC'],
    ['uky_fb','Kentucky','Wildcats','#0033A0','SEC'],['sc','South Carolina','Gamecocks','#73000A','SEC'],
    ['van','Vanderbilt','Commodores','#000000','SEC'],['msst','Miss State','Bulldogs','#660000','SEC'],
    ['mich_fb','Michigan','Wolverines','#00274C','Big Ten'],['osu_fb','Ohio State','Buckeyes','#BB0000','Big Ten'],
    ['psu','Penn State','Nittany Lions','#041E42','Big Ten'],['ore','Oregon','Ducks','#154733','Big Ten'],
    ['wash','Washington','Huskies','#4B2E83','Big Ten'],['usc_fb','USC','Trojans','#990000','Big Ten'],
    ['ucla_fb','UCLA','Bruins','#2D68C4','Big Ten'],['wis_fb','Wisconsin','Badgers','#C5050C','Big Ten'],
    ['iowa','Iowa','Hawkeyes','#FFCD00','Big Ten'],['neb','Nebraska','Cornhuskers','#E41C38','Big Ten'],
    ['msu_fb','Michigan St','Spartans','#18453B','Big Ten'],['minn_fb','Minnesota','Gophers','#7A0019','Big Ten'],
    ['ill_fb','Illinois','Illini','#E84A27','Big Ten'],['pur_fb','Purdue','Boilermakers','#CEB888','Big Ten'],
    ['umd_fb','Maryland','Terrapins','#E03A3E','Big Ten'],['rut','Rutgers','Scarlet Knights','#CC0033','Big Ten'],
    ['ind_fb','Indiana','Hoosiers','#990000','Big Ten'],['nw','Northwestern','Wildcats','#4E2A84','Big Ten'],
    ['fsu_fb','Florida St','Seminoles','#782F40','ACC'],['clem_fb','Clemson','Tigers','#F56600','ACC'],
    ['mia_fb','Miami','Hurricanes','#F47321','ACC'],['unc_fb','North Carolina','Tar Heels','#99badd','ACC'],
    ['ncst_fb','NC State','Wolfpack','#CC0000','ACC'],['duke_fb','Duke','Blue Devils','#003087','ACC'],
    ['vt','Virginia Tech','Hokies','#630031','ACC'],['uva_fb','Virginia','Cavaliers','#232D4B','ACC'],
    ['lou_fb','Louisville','Cardinals','#C90031','ACC'],['pitt','Pittsburgh','Panthers','#003594','ACC'],
    ['syr_fb','Syracuse','Orange','#F76900','ACC'],['gt','Georgia Tech','Yellow Jackets','#B3A369','ACC'],
    ['bc','Boston College','Eagles','#98002E','ACC'],['wake_fb','Wake Forest','Demon Deacons','#9E7E38','ACC'],
    ['cal','Cal','Golden Bears','#003262','ACC'],['stan','Stanford','Cardinal','#8C1515','ACC'],
    ['smu','SMU','Mustangs','#0033A0','ACC'],['okst','Oklahoma St','Cowboys','#FF7300','Big 12'],
    ['ksu','Kansas St','Wildcats','#512888','Big 12'],['ku_fb','Kansas','Jayhawks','#0051BA','Big 12'],
    ['isu_fb','Iowa State','Cyclones','#C8102E','Big 12'],['utah','Utah','Utes','#CC0000','Big 12'],
    ['ari_fb','Arizona','Wildcats','#CC0033','Big 12'],['asu','Arizona St','Sun Devils','#8C1D40','Big 12'],
    ['colo','Colorado','Buffaloes','#CFB87C','Big 12'],['byu','BYU','Cougars','#002E5D','Big 12'],
    ['tcu','TCU','Horned Frogs','#4D1979','Big 12'],['bay_fb','Baylor','Bears','#154734','Big 12'],
    ['tt','Texas Tech','Red Raiders','#CC0000','Big 12'],['wvu','West Virginia','Mountaineers','#002855','Big 12'],
    ['ucf','UCF','Knights','#BA9B37','Big 12'],['cin_fb','Cincinnati','Bearcats','#E00122','Big 12'],
    ['hou_fb','Houston','Cougars','#C8102E','Big 12'],['nd','Notre Dame','Fighting Irish','#0C2340','Ind'],
    ['orst','Oregon St','Beavers','#DC4405','Pac-12'],['wsu','Wash State','Cougars','#981E32','Pac-12']
  ],
  NFL: [
    ['dal','Dallas','Cowboys','#003594','NFC East'],['phi','Philadelphia','Eagles','#004C54','NFC East'],
    ['wsh','Washington','Commanders','#5A1414','NFC East'],['nyg','NY Giants','Giants','#0B2265','NFC East'],
    ['chi','Chicago','Bears','#0B162A','NFC North'],['gb','Green Bay','Packers','#203731','NFC North'],
    ['min','Minnesota','Vikings','#4F2683','NFC North'],['det','Detroit','Lions','#0076B6','NFC North'],
    ['atl','Atlanta','Falcons','#a71930','NFC South'],['no','New Orleans','Saints','#D3BC8D','NFC South'],
    ['tb','Tampa Bay','Buccaneers','#D50A0A','NFC South'],['car','Carolina','Panthers','#0085CA','NFC South'],
    ['sf','San Fran','49ers','#AA0000','NFC West'],['sea','Seattle','Seahawks','#002244','NFC West'],
    ['lar','LA Rams','Rams','#003594','NFC West'],['ari','Arizona','Cardinals','#97233F','NFC West'],
    ['ne','New England','Patriots','#002244','AFC East'],['buf','Buffalo','Bills','#00338D','AFC East'],
    ['mia','Miami','Dolphins','#008E97','AFC East'],['nyj','NY Jets','Jets','#125740','AFC East'],
    ['pit','Pittsburgh','Steelers','#FFB612','AFC North'],['bal','Baltimore','Ravens','#241773','AFC North'],
    ['cin','Cincinnati','Bengals','#FB4F14','AFC North'],['cle','Cleveland','Browns','#311D00','AFC North'],
    ['ind','Indianapolis','Colts','#002C5F','AFC South'],['ten','Tennessee','Titans','#0C2340','AFC South'],
    ['jax','Jacksonville','Jaguars','#006778','AFC South'],['hou','Houston','Texans','#03202F','AFC South'],
    ['kc','Kansas City','Chiefs','#E31837','AFC West'],['lv','Las Vegas','Raiders','#000000','AFC West'],
    ['den','Denver','Broncos','#FB4F14','AFC West'],['lac','LA Chargers','Chargers','#0080C6','AFC West']
  ],
  NBA: [
    ['bos','Boston','Celtics','#007A33','East'],['bkn','Brooklyn','Nets','#000000','East'],
    ['ny','New York','Knicks','#F58426','East'],['phi','Philly','76ers','#006BB6','East'],
    ['tor','Toronto','Raptors','#CE1141','East'],['chi','Chicago','Bulls','#CE1141','East'],
    ['cle','Cleveland','Cavaliers','#860038','East'],['det','Detroit','Pistons','#C8102E','East'],
    ['ind','Indiana','Pacers','#FDBB30','East'],['mil','Milwaukee','Bucks','#00471B','East'],
    ['atl','Atlanta','Hawks','#E03A3E','East'],['cha','Charlotte','Hornets','#1D1160','East'],
    ['mia','Miami','Heat','#98002E','East'],['orl','Orlando','Magic','#0077C0','East'],
    ['wsh','Washington','Wizards','#002B5C','East'],['den','Denver','Nuggets','#0E2240','East'],
    ['min','Minnesota','Timberwolves','#0C2340','West'],['okc','OKC','Thunder','#007AC1','West'],
    ['por','Portland','Trail Blazers','#E03A3E','West'],['uta','Utah','Jazz','#002B5C','West'],
    ['gs','Golden State','Warriors','#1D428A','West'],['lac','LA Clippers','Clippers','#C8102E','West'],
    ['lal','L.A.','Lakers','#552583','West'],['phx','Phoenix','Suns','#1D1160','West'],
    ['sac','Sacramento','Kings','#5A2D81','West'],['dal','Dallas','Mavericks','#00538C','West'],
    ['hou','Houston','Rockets','#CE1141','West'],['mem','Memphis','Grizzlies','#5D76A9','West'],
    ['no','New Orleans','Pelicans','#0C2340','West'],['sas','San Antonio','Spurs','#C4CED4','West']
  ]
};

// Hydrate teams helper
const ALL_TEAMS = Object.entries(RAW_TEAMS).flatMap(([league, teams]) => 
  teams.map(t => ({ id: t[0], league, name: t[1], mascot: t[2], color: t[3], conf: t[4] }))
);

// Format: [winnerId, headline, score, date, desc]
const RAW_HISTORY = {
  duke: [
    ['unc', "The Final Four Nightmare", "UNC 81, Duke 77", "April 2, 2022", "The first ever tournament meeting. Coach K's final season. Caleb Love's dagger three sent K into retirement with an L."],
    ['unc', "K's Final Home Game", "UNC 94, Duke 81", "March 5, 2022", "The 'uninvited guests' ruined the retirement party. 96 former players watched Duke get blown out at Cameron."],
    ['mercer', "Mercer danced on them", "Mercer 78, Duke 71", "March 21, 2014", "A #3 seed Duke team with Jabari Parker lost to a bunch of seniors from the Atlantic Sun."],
    ['lehigh', "CJ McCollum happened", "Lehigh 75, Duke 70", "March 16, 2012", "A #2 seed lost to a #15 seed. One of the biggest upsets in tournament history."],
    ['conn', "1999 Championship", "UConn 77, Duke 74", "March 29, 1999", "This Duke team was considered one of the best ever. Rip Hamilton and Khalid El-Amin had other plans."],
    ['unlv', "103-73", "UNLV 103, Duke 73", "April 2, 1990", "The biggest blowout in National Championship history. Men against boys."],
    ['lsu', "Big Baby Davis", "LSU 62, Duke 54", "March 23, 2006", "The #1 overall seed Duke. JJ Redick shot 3-for-18 in his final college game. Glen 'Big Baby' Davis ate them alive in the paint."]
  ],
  ncst: [
    ['pur', "Final Four Heartbreak", "Purdue 63, NC State 50", "April 6, 2024", "The magic ran out. Edey was too big, and the shots stopped falling. A sad end to a miracle run."],
    ['vt', "24 Points Total", "Va Tech 47, NC State 24", "Feb 2, 2019", "State scored 24 points in an entire 40-minute basketball game. 24. They shot 16% from the floor."]
  ],
  bos: [
    ['lal', "Game 7, 2010", "Lakers 83, Celtics 79", "June 17, 2010", "Up 3-2 in the series. Rasheed Wallace played his heart out, but Kobe and Artest took the ring. The sweetest Lakers win ever."],
    ['mia', "Game 7 at Home", "Heat 103, Celtics 84", "May 29, 2023", "Fought back from 0-3 just to get blown out on their own floor in Game 7. Tatum rolled his ankle immediately."],
    ['gsw', "Curry's Night Night", "Warriors 4-2 Series", "June 2022", "Up 2-1 in the Finals. Then Steph Curry destroyed their soul in Boston. TD Garden went silent."]
  ],
  det: [
    ['sas', "Horry left open", "Spurs 4-3 Series", "June 2005", "Sheed left Robert Horry open in the corner in Game 5. Then they lost Game 7. A dynasty denied."],
    ['all', "28 Straight Losses", "The Streak", "Dec 2023", "They set the single-season record for consecutive losses. 28 games without a win. Pure misery."]
  ],
  mia: [
    ['dal', "LeBron's Meltdown", "Mavs 4-2 Series", "June 2011", "The Heatles were arrogant. Dirk humbled them. LeBron scored 8 points in a Finals game."],
    ['sas', "The AC Game", "Spurs 110, Heat 95", "June 5, 2014", "The AC broke in San Antonio. LeBron cramped up. The Spurs blew them out by record margins in the series."]
  ],
  phi: [
    ['tor', "The Bounce", "Raptors 92, 76ers 90", "May 12, 2019", "Kawhi's shot bounced four times. Embiid cried in the tunnel. The Process failed."],
    ['atl', "Ben Simmons passed", "Hawks 103, 76ers 96", "June 20, 2021", "Simmons had a wide open dunk. He passed it. The Process died that moment."],
    ['bos', "Tatum 51", "Celtics 112, Sixers 88", "May 14, 2023", "Game 7. Harden disappeared. Embiid disappeared. Tatum set a record."]
  ],
  lal: [
    ['bos', "The Wheelchair Game", "Celtics 4-2 Series", "June 2008", "Paul Pierce faked an injury, came back, and the Celtics blew out the Lakers by 39 in the clincher."],
    ['det', "Five Game Sweep", "Pistons 4-1 Series", "June 2004", "The Kobe/Shaq divorce was finalized by a Pistons beatdown. Malone retired ringless."],
    ['phx', "Kobe quit?", "Suns 121, Lakers 90", "May 6, 2006", "Game 7 against the Suns. Kobe refused to shoot in the second half to prove a point."]
  ],
  gb: [
    ['sea', "The NFC Championship Collapse", "Seahawks 28, Packers 22", "Jan 18, 2015", "Up 19-7 with 3 mins left. Brandon Bostick dropped the onside kick. Ha Ha Clinton-Dix stood still on the 2pt conversion."],
    ['tb', "Kick the Field Goal?", "Bucs 31, Packers 26", "Jan 24, 2021", "NFC Championship at home. 4th and Goal. Rodgers wanted to go for it. LaFleur kicked a FG. Brady knelt out the clock."],
    ['sf', "Blocked Punt", "49ers 13, Packers 10", "Jan 22, 2022", "Top seed in the NFC. Home field. Offense scored 10 points. Special teams allowed a blocked punt TD."],
    ['nyg', "15-1 Season Ruined", "Giants 37, Packers 20", "Jan 15, 2012", "Rodgers was MVP. The team was 15-1. Eli Manning came into Lambeau and humiliated them."]
  ],
  min: [
    ['phi', "38-7", "Eagles 38, Vikings 7", "Jan 21, 2018", "After the Minneapolis Miracle, they laid an absolute egg. Nick Foles looked like Montana."],
    ['sea', "Blair Walsh Wide Left", "Seahawks 10, Vikings 9", "Jan 10, 2016", "27 yards. Chip shot. Sub-zero temps. He missed it. The laces were in!"],
    ['no', "Bountygate Game", "Saints 31, Vikings 28", "Jan 24, 2010", "Favre threw across his body in field goal range. Tracy Porter picked it off. 12 men in the huddle penalty."]
  ],
  det_nfl: [
    ['sf', "24-7 Halftime Lead", "49ers 34, Lions 31", "Jan 28, 2024", "One half away from the Super Bowl. Dropped passes, a fumble, and analytics decisions led to a historic collapse."],
    ['gb', "The 0-16 Season", "0 Wins, 16 Losses", "2008 Season", "The first team to go 0-16. Dan Orlovsky running out of the back of the end zone sums it up."]
  ],
  dal: [
    ['sea', "The Romo Bobble", "Seahawks 21, Cowboys 20", "Jan 6, 2007", "A chip shot to win. Romo dropped the snap. He cried in the locker room."],
    ['gb', "Dez Caught It", "Packers 26, Cowboys 21", "Jan 11, 2015", "It looked like a catch. The rules said no. Playoff hopes dashed again."],
    ['gb', "Dak runs out of time", "49ers 23, Cowboys 17", "Jan 16, 2022", "Dak ran a QB draw with no timeouts. The clock hit zero before they could snap it."],
    ['gb', "Love destroys Dallas", "Packers 48, Cowboys 32", "Jan 14, 2024", "The #2 seed Cowboys got absolutely smoked at home by the #7 seed Packers."]
  ],
  sf: [
    ['kc', "Super Bowl LVIII", "Chiefs 25, 49ers 22", "Feb 11, 2024", "Overtime. Muffed punt. Shanahan blew a 10 point lead in the Super Bowl... again."],
    ['kc', "Super Bowl LIV", "Chiefs 31, 49ers 20", "Feb 2, 2020", "Up 20-10 with 7 minutes left. Jimmy G closed his eyes and threw a pick."],
    ['sea', "Sherman's Tip", "Seahawks 23, 49ers 17", "Jan 19, 2014", "Kaep threw to Crabtree in the endzone. Sherman tipped it. 'Don't you ever talk about me!'"],
    ['bal', "Super Bowl XLVII", "Ravens 34, 49ers 31", "Feb 3, 2013", "4 plays from the 5-yard line to win. Four incompletions. Har-Bowl lost."]
  ],
  buf: [
    ['kc', "13 Seconds", "Chiefs 42, Bills 36", "Jan 23, 2022", "They scored to take the lead with 13 seconds left. They still lost. Unforgivable defense."],
    ['nyg', "Wide Right", "Giants 20, Bills 19", "Jan 27, 1991", "Scott Norwood. 47 yards. It sailed wide right. The start of 4 straight Super Bowl losses."]
  ],
  atl: [
    ['ne', "28-3", "Patriots 34, Falcons 28", "Feb 5, 2017", "The biggest choke in sports history. Up 25 late in the 3rd. Kyle Shanahan forgot to run the ball."]
  ],
  chi: [
    ['phi', "Double Doink", "Eagles 16, Bears 15", "Jan 6, 2019", "Cody Parkey's kick hit the upright AND the crossbar. The sound haunts Chicago."]
  ],
  cin: [
    ['lar', "Super Bowl LVI", "Rams 23, Bengals 20", "Feb 13, 2022", "Aaron Donald blew up the final play. Burrow had no time."],
    ['pit', "The Fumble", "Steelers 18, Bengals 16", "Jan 9, 2016", "Jeremy Hill fumbled. Burfict tried to kill Antonio Brown. Pacman Jones fought a ref. Meltdown."]
  ],
  cle: [
    ['den', "The Drive", "Broncos 23, Browns 20", "Jan 11, 1987", "Elway went 98 yards in 5 minutes. Cleveland hearts broken."],
    ['den', "The Fumble", "Broncos 38, Browns 33", "Jan 17, 1988", "Earnest Byner was crossing the goal line to tie the game. He stripped."],
    ['bal', "The Move", "Franchise Left", "1995", "Art Modell took the team to Baltimore and won a Super Bowl. Pain."]
  ],
  generic: [
    ['opponent', "They choked", "Big Loss", "Recently", "Honestly, they just aren't a serious franchise. You know it, I know it."]
  ]
};

// --- 3. ONBOARDING ---
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
        alert("This browser does not support desktop notification");
        onComplete();
        return;
    }
    
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log("Notification permission granted!");
            new Notification("They Lost", { body: "Notifications are set up! We'll tell you when they choke." });
        }
    } catch (error) {
        console.error("Error requesting permission", error);
    }
    onComplete();
  }

  return (
    step === 0 ? (
      <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#1e90ff] to-[#99badd] text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="w-48 h-48 mb-6 rounded-2xl shadow-xl overflow-hidden bg-white/20 backdrop-blur-sm p-4">
            <img src={APP_ICON} alt="App Icon" className="w-full h-full object-cover rounded-xl" />
        </div>
        <h1 className="text-3xl font-black italic mb-4 drop-shadow-md">Their misery. Your joy.</h1>
        <p className="text-lg font-medium opacity-90 mb-8 max-w-xs drop-shadow">Love the jolt of joy when a team you hate loses? This app alerts you ONLY when they lose.</p>
        <button onClick={() => setStep(1)} className="bg-[#1e90ff] text-white text-lg font-black py-4 px-8 rounded-2xl shadow-2xl w-full max-w-xs hover:scale-105 transition-transform ring-4 ring-white/50">Let your hate flow</button>
      </div>
    ) : step === 1 ? (
      <div className="fixed inset-0 z-[100] bg-green-900 bg-[url('https://ik.imagekit.io/ipi1yjzh9/grass-bg.jpg')] bg-cover bg-center bg-blend-overlay text-white flex flex-col p-6 animate-in slide-in-from-right duration-300">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-6 relative"><div className="p-4 bg-white/20 backdrop-blur-md rounded-full shadow-xl"><Target size={64} className="text-white drop-shadow-lg relative z-10" /> <div className="absolute inset-0 bg-white/30 rounded-full animate-ping z-0"></div></div><div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-20">STEP 1</div></div>
            <h2 className="text-2xl font-black mb-2 drop-shadow-md">Pick Your Targets</h2>
            <p className="text-white/90 mb-8 max-w-xs drop-shadow font-medium">Search for teams across NBA, NFL, MLB, and NCAA sports. Add them to your "Enemies List."</p>
        </div>
        <button onClick={() => setStep(2)} className="bg-white text-emerald-700 text-lg font-bold py-4 px-8 rounded-xl shadow-lg w-full hover:bg-emerald-50 transition-colors">Got it, next</button>
      </div>
    ) : (
      <div className="fixed inset-0 z-[100] bg-orange-500 bg-[url('https://www.transparenttextures.com/patterns/basketball.png')] bg-blend-overlay text-white flex flex-col p-6 animate-in slide-in-from-right duration-300">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-6 bg-white/20 backdrop-blur-md p-6 rounded-full shadow-xl relative"><Bell size={48} className="text-yellow-300 animate-bounce drop-shadow-lg" /><div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">STEP 2</div></div>
            <h2 className="text-2xl font-black mb-2 drop-shadow-md">Don't Miss the Moment</h2>
            <p className="text-white/90 mb-8 max-w-xs drop-shadow font-medium">We'll send a notification any time a team you hate blows it.</p>
        </div>
        <div className="space-y-3 w-full">
            <button onClick={handleEnableNotifications} className="bg-white text-orange-600 text-lg font-bold py-4 px-8 rounded-xl shadow-lg w-full hover:bg-orange-50 transition-colors">Enable Notifications</button>
            <button onClick={() => onComplete()} className="text-white/80 text-sm font-bold py-2 w-full hover:text-white transition-colors">Maybe Later</button>
        </div>
      </div>
    )
  );
};

// --- 4. MAIN APP ---
export default function App() {
  const [view, setView] = useState('scoreboard');
  const [activeLeague, setActiveLeague] = useState('NCAA');
  const [activeTheme, setActiveTheme] = useState('professional');
  const [showOnboarding, setShowOnboarding] = useState(() => localStorage.getItem('tl_onboarded') !== 'true');
  const [enabledLeagues, setEnabledLeagues] = useState({ NCAA: true, CFB: true, NBA: true, NFL: true, MLB: false });
  const [hatedTeams, setHatedTeams] = useState(() => JSON.parse(localStorage.getItem('tl_hated_teams') || '[]'));
  const [gameResults, setGameResults] = useState([]);
  const [celebration, setCelebration] = useState(null);
  const [shareModal, setShareModal] = useState(null);
  const [consolationFact, setConsolationFact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [noGamesMsg, setNoGamesMsg] = useState(null);
  const [shareOptions, setShareOptions] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [pullStartPoint, setPullStartPoint] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  // NEW: Track notified games to prevent spamming
  const [notifiedGames, setNotifiedGames] = useState(new Set());
  const scrollRef = useRef(null);

  const styles = THEMES[activeTheme];

  useEffect(() => { if (!enabledLeagues[activeLeague]) setActiveLeague(Object.keys(enabledLeagues).find(k => enabledLeagues[k]) || 'NCAA'); }, [enabledLeagues]);
  useEffect(() => { localStorage.setItem('tl_hated_teams', JSON.stringify(hatedTeams)); }, [hatedTeams]);

  // --- POLLING & VISIBILITY LOGIC (Fixing the "Sleeping App" issue) ---
  useEffect(() => { 
    checkLiveScores(); 

    // 1. Poll every 60 seconds while open
    const interval = setInterval(() => {
        checkLiveScores();
    }, 60000);

    // 2. Check immediately when user switches back to app tab/window
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            checkLiveScores();
        }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
        clearInterval(interval);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hatedTeams, enabledLeagues]); // Re-run if preferences change

  // --- LOGIC ---
  const checkLiveScores = async () => {
    if (loading) return; // Don't stack requests
    
    // Don't set global loading state for background polls (it flickers UI)
    // Only set it if it's a manual refresh or first load
    const isManual = refreshing || gameResults.length === 0;
    if (isManual) setLoading(true);
    
    setConsolationFact(null); 
    setNoGamesMsg(null); 
    
    try {
      const getYYYYMMDD = (d) => d.toISOString().split('T')[0].replace(/-/g, '');
      const dates = [new Date(), new Date(Date.now()-864e5), new Date(Date.now()-1728e5)].map(getYYYYMMDD);
      
      const fetchLeague = async (lg) => {
        const path = {'NCAA':'basketball/mens-college-basketball','CFB':'football/college-football','NBA':'basketball/nba','NFL':'football/nfl','MLB':'baseball/mlb'}[lg];
        if (!path) return [];
        const calls = dates.map(d => fetch(`https://corsproxy.io/?${encodeURIComponent(`https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?limit=1000&dates=${d}`)}`).then(r=>r.json()).catch(()=>({events:[]})));
        const res = await Promise.all(calls);
        return res.flatMap(r => r.events || []).map(e => ({...e, _league: lg}));
      };

      const targets = Object.keys(enabledLeagues).filter(l => enabledLeagues[l]);
      const allRaw = (await Promise.all(targets.map(fetchLeague))).flat();
      const uniq = Array.from(new Map(allRaw.map(e => [e.id, e])).values());

      const results = uniq.map(event => {
        const h = event.competitions[0].competitors.find(c=>c.homeAway==='home'), a = event.competitions[0].competitors.find(c=>c.homeAway==='away');
        if(!h||!a) return null;
        
        const findConf = (abbr) => ALL_TEAMS.find(t => (t.id === abbr || t.id.startsWith(abbr + '_')) && t.league === event._league);

        const isHated = (id) => hatedTeams.some(ht => ht === id || ht.startsWith(id + '_'));
        const hatedHome = isHated(h.team.abbreviation.toLowerCase());
        const hatedAway = isHated(a.team.abbreviation.toLowerCase());
        if(!hatedHome && !hatedAway) return null;

        const hated = hatedHome ? h : a;
        const opp = hatedHome ? a : h;
        const hatedConf = findConf(hated.team.abbreviation.toLowerCase());
        
        let oppConf = findConf(opp.team.abbreviation.toLowerCase());
        if (!oppConf) {
            oppConf = { id: opp.team.abbreviation.toLowerCase(), name: opp.team.displayName, color: '#94a3b8', league: event._league };
        }

        if (!hatedConf) return null;

        const scoreH = parseInt(h.score||0), scoreA = parseInt(a.score||0);
        const isFinal = event.status.type.completed;
        const lost = isFinal && ((hatedHome && scoreH < scoreA) || (!hatedHome && scoreA < scoreH));
        
        return {
          team: {...hatedConf, score: parseInt(hated.score||0)},
          opponentTeam: {...oppConf, score: parseInt(opp.score||0)},
          status: lost ? 'LOST' : (isFinal ? 'WON' : 'PLAYING'),
          gameId: event.id, isYesterday: new Date(event.date) < new Date(new Date().setHours(0,0,0,0))
        };
      }).filter(Boolean);

      setGameResults(results);
      
      const losers = results.filter(r => r.status === 'LOST');
      
      if (losers.length > 0) {
          // Check if we already notified about these specific games
          const newLosers = losers.filter(l => !notifiedGames.has(l.gameId));
          
          if (newLosers.length > 0) {
              triggerCelebration();
              
              // --- TRIGGER REAL NOTIFICATION ---
              if ('Notification' in window && Notification.permission === 'granted') {
                  const game = newLosers[0]; // Just show one if multiple happen at once
                  new Notification("THEY LOST!", {
                      body: `${game.team.name} lost ${game.team.score}-${game.opponentTeam.score} to ${game.opponentTeam.name}.`,
                      icon: APP_ICON
                  });
              }

              // Update tracked notifications
              setNotifiedGames(prev => {
                  const next = new Set(prev);
                  newLosers.forEach(l => next.add(l.gameId));
                  return next;
              });
          }
      } else if (results.length > 0 && isManual) {
          pickHistoricLoss();
      } else if (results.length === 0 && isManual) {
          setNoGamesMsg("No active games found for your enemies.");
      }

    } catch (e) { 
        if (isManual) setNoGamesMsg("Error fetching data."); 
    } finally { 
        setLoading(false); 
        setRefreshing(false); 
    }
  };

  const pickHistoricLoss = () => {
    const relevant = hatedTeams.flatMap(id => HISTORIC_LOSSES[id] || HISTORIC_LOSSES[Object.keys(HISTORIC_LOSSES).find(k=>k.startsWith(id+'_'))] || []);
    const fact = relevant.length ? relevant[Math.floor(Math.random()*relevant.length)] : HISTORIC_LOSSES.generic[0];
    setConsolationFact({ ...fact, team: ALL_TEAMS.find(t => hatedTeams.includes(t.id)) });
  };

  const triggerCelebration = () => {
    setCelebration({ message: TRASH_TALK[Math.floor(Math.random()*TRASH_TALK.length)], gif: CELEBRATION_GIFS[Math.floor(Math.random()*CELEBRATION_GIFS.length)] });
    setTimeout(() => setCelebration(null), 8000);
  };

  const toggleHate = (id) => setHatedTeams(prev => prev.includes(id) ? prev.filter(t => t!==id) : [...prev, id]);

  const openShare = (g) => {
    const lib = {
      Casual: ["So... [TEAM] lost [SCORE]-[OPP_SCORE]. 😬 [LINK]", "Oof. [TEAM] dropped one. [SCORE]-[OPP_SCORE]. [LINK]"],
      Receipts: ["FINAL: [TEAM] [SCORE], [OPP] [OPP_SCORE]. [LINK]"],
      Toxic: ["IMAGINE LOSING [SCORE]-[OPP_SCORE]. [TEAM] DOWN BAD. 📉🤡 [LINK]"]
    };
    
    const format = (t) => {
       const url = `espn.com/${{'NBA':'nba','NFL':'nfl','CFB':'college-football','NCAA':'mens-college-basketball'}[g.team.league]}/game/_/gameId/${g.gameId}`;
       return t.replace('[TEAM]',g.team.name).replace('[SCORE]',g.team.score).replace('[OPP_SCORE]',g.opponentTeam.score).replace('[OPP]',g.opponentTeam.name).replace('[LINK]',url);
    };

    setShareOptions(Object.entries(lib).map(([k,v]) => ({label:k, text: format(v[Math.floor(Math.random()*v.length)])})));
    setShareModal(g);
  };

  const doShare = (txt, g, index) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = txt; 
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedIndex(index);
      setTimeout(() => { setCopiedIndex(null); setShareModal(null); }, 1000);
    } catch (err) { console.error('Fallback error', err); }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    checkLiveScores();
  };

  const handleTouchStart = (e) => {
    const scrollTop = scrollRef.current ? scrollRef.current.scrollTop : 0;
    if (scrollTop === 0) setPullStartPoint(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (pullStartPoint === 0) return;
    const pullDistance = e.changedTouches[0].clientY - pullStartPoint;
    if (pullDistance > 150) handleRefresh();
    setPullStartPoint(0);
  };

  const displayResults = gameResults.filter(g => g.status === 'LOST');
  const manageList = ALL_TEAMS.filter(t => t.league === activeLeague && (searchTerm==='' || t.name.toLowerCase().includes(searchTerm.toLowerCase()))).sort((a,b)=>a.name.localeCompare(b.name));

  return (
    <div className={`min-h-screen ${styles.bg} ${styles.font} ${styles.text} max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-slate-200 flex flex-col h-[100dvh]`}>
      <style>{`@keyframes fall { 0% {transform:translateY(0) rotate(0deg);opacity:1} 100% {transform:translateY(100vh) rotate(720deg);opacity:0} } .animate-fall {animation:fall linear infinite} @keyframes slideDown {0% {transform:translateY(-100%)} 100% {transform:translateY(0)}} .animate-enter-banner {animation:slideDown 0.5s ease-out forwards}`}</style>
      
      {showOnboarding && <Onboarding onComplete={() => { localStorage.setItem('tl_onboarded','true'); setShowOnboarding(false); }} />}
      
      <header className={`p-4 sticky top-0 z-30 shrink-0 flex justify-between items-center ${styles.header}`}>
        <div onClick={handleRefresh} className="flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity">
            <div className="w-12 h-12 rounded-md overflow-hidden bg-gradient-to-br from-[#1e90ff] to-[#99badd] shadow-sm flex items-center justify-center">
                <img src={APP_ICON} alt="App Icon" className="w-full h-full object-cover" />
            </div>
            <h1 className="font-black text-xl italic">THEY LOST!</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setView('scoreboard'); checkLiveScores(); }} disabled={loading} className="p-2 hover:bg-white/10 rounded-lg"><RefreshCw size={24} className={loading?"animate-spin":""}/></button>
          <button onClick={() => { setView('scoreboard'); checkLiveScores(); }} className={`p-2 rounded-lg ${view==='scoreboard'?'bg-black/20':''}`}><PartyPopper size={24}/></button>
          <button onClick={() => setView('manage')} className={`p-2 rounded-lg ${view==='manage'?'bg-black/20':''}`}><Target size={24}/></button>
          <button onClick={() => setView('settings')} className={`p-2 rounded-lg ${view==='settings'?'bg-black/20':''}`}><Settings size={24}/></button>
        </div>
      </header>

      {celebration && (
        <div className={`p-4 text-center animate-enter-banner shadow-lg relative z-20 shrink-0 ${styles.lossBanner}`}>
          <div className="fixed inset-0 pointer-events-none z-50">{[...Array(30)].map((_,i)=><div key={i} className="absolute animate-fall" style={{left:`${Math.random()*100}vw`,top:'-20px',width:'10px',height:'10px',background:['#f00','#0f0','#00f'][Math.floor(Math.random()*3)],animationDuration:`${2+Math.random()*3}s`}}/>)}</div>
          <img src={celebration.gif} className="mx-auto max-h-48 rounded-lg border-2 border-white/50 mb-3" alt="Celebrate" referrerPolicy="no-referrer" onError={(e) => e.target.style.display = 'none'} />
          <h2 className="text-xl font-black uppercase">IT HAPPENED!</h2><p className="text-xs font-bold uppercase">{celebration.message}</p>
        </div>
      )}

      {refreshing && !celebration && <div className="absolute top-20 left-0 right-0 z-20 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-4"><div className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold"><RefreshCw size={16} className="animate-spin" /> Checking Scores...</div></div>}

      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-100 p-4 border-b flex justify-between font-bold text-slate-700"><span className="flex gap-2"><Share2/> Share</span><button onClick={()=>setShareModal(null)}><X/></button></div>
            <div className="p-4 space-y-2">{shareOptions.map((opt,i) => (<button key={i} onClick={()=>doShare(opt.text, shareModal, i)} className="w-full text-left p-3 rounded-xl border hover:bg-green-50 hover:border-green-500 transition group relative"><div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-1"><span>{opt.label}</span>{copiedIndex === i ? <Check size={12} className="text-green-600"/> : <Copy size={12}/>}</div><p className="text-sm font-medium text-slate-800">{opt.text}</p>{copiedIndex === i && <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center font-black text-green-700 uppercase tracking-widest text-xs">Copied!</div>}</button>))}</div>
          </div>
        </div>
      )}

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 pb-6" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {view === 'scoreboard' && (
          <div className="space-y-6">
            <div className="text-center opacity-40 text-xs font-bold uppercase tracking-widest">Tracking {hatedTeams.length} Enemies</div>
            {hatedTeams.length === 0 ? (
               <div className="text-center py-12 px-6"><div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-slate-100"><Target className="text-slate-300" size={40}/></div><h3 className="text-xl font-black mb-2">Peaceful... too peaceful.</h3><button onClick={()=>setView('manage')} className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg ${styles.buttonPrimary}`}>Pick Enemies</button></div>
            ) : (
              <>
                {(!gameResults.length && !loading) && <div className="text-center py-12"><RefreshCw className={`mx-auto mb-4 ${styles.accent}`} size={32}/><h3 className="font-bold">No Scores Yet</h3><p className="opacity-60 text-sm">{noGamesMsg || "Checking..."}</p></div>}
                {gameResults.length > 0 && !displayResults.length && (
                  <div className={`text-center py-8 px-5 ${styles.card} border-dashed`}>
                    <div className="mb-6"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><AlertTriangle className="text-red-500"/></div><h3 className="font-bold text-lg">Nobody lost today (yet).</h3></div>
                    {consolationFact && <div className={`${styles.accentBg} border-2 border-current rounded-xl p-5 text-left rotate-1 hover:rotate-0 transition`}><div className="text-[10px] font-black uppercase opacity-60 mb-1"><History size={12} className="inline mr-1"/>History Lesson</div><h4 className="font-bold opacity-80 mb-2">Remember {consolationFact.headline}?</h4><div className="font-black text-xl mb-1">{consolationFact.score}</div><p className="text-xs uppercase opacity-60 mb-2">{consolationFact.date}</p><p className="text-base opacity-90">{consolationFact.desc}</p></div>}
                  </div>
                )}
                {displayResults.map((g,i) => (
                  <div key={i} className={`relative overflow-hidden animate-in slide-in-from-bottom-5 ${styles.card} border-2`}>
                    <div className={`p-2 text-center text-[10px] font-black uppercase flex justify-center gap-2 ${g.isYesterday?'bg-slate-200 text-slate-600':styles.lossBanner}`}>{g.status==='LOST'?'THEY LOST!':'SCORES'} {g.isYesterday && '(YESTERDAY)'}</div>
                    <div className="p-5 flex justify-between items-center">
                      <div className="flex flex-col items-center w-1/3"><div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-sm mb-2 shadow-md border-2 border-white" style={{background:g.team.color}}>{g.team.id.substring(0,3).toUpperCase()}</div><span className="font-bold text-base text-center">{g.team.name}</span><span className="text-3xl font-black mt-1 text-red-500">{g.team.score}</span></div>
                      <div className="opacity-50 font-black italic">VS</div>
                      <div className="flex flex-col items-center w-1/3 opacity-80"><div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xs mb-2 text-white shadow-sm border-2 border-white" style={{background: g.opponentTeam.color}}>{g.opponentTeam.id.substring(0,3).toUpperCase()}</div><span className="font-bold text-sm text-center">{g.opponentTeam.name}</span><span className="text-3xl font-bold mt-1 text-slate-500">{g.opponentTeam.score}</span></div>
                    </div>
                    <div className="p-3 border-t bg-slate-50 flex gap-2"><button onClick={()=>openShare(g)} className={`flex-1 py-2 rounded-lg text-base font-bold flex items-center justify-center gap-2 ${styles.buttonPrimary}`}>Rub It In</button></div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {view === 'manage' && (
          <div className={`p-5 space-y-4 animate-in slide-in-from-bottom-4 ${styles.card} border-2`}>
            <h2 className="font-bold flex items-center gap-2 text-xl"><Target className={styles.accent}/> Manage Enemies</h2>
            <div className="flex gap-1 overflow-x-auto pb-2">{Object.keys(enabledLeagues).filter(k=>enabledLeagues[k]).map(l=><button key={l} onClick={()=>setActiveLeague(l)} className={`px-3 py-1 text-sm font-bold rounded ${activeLeague===l?'bg-slate-900 text-white':'bg-slate-100'}`}>{l === 'NCAA' ? 'NCAA Hoops' : l}</button>)}</div>
            <div className="relative"><Search className="absolute left-3 top-3.5 opacity-40" size={16}/><input placeholder={`Search ${activeLeague === 'NCAA' ? 'NCAA Hoops' : activeLeague} teams...`} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg bg-transparent text-base"/></div>
            <div className="space-y-2">{manageList.map(t=><button key={t.id} onClick={()=>toggleHate(t.id)} className={`w-full p-3 rounded-xl flex items-center justify-between border transition ${hatedTeams.includes(t.id)?`border-red-500 ${styles.accentBg}`:'hover:bg-slate-50'}`}><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{background:t.color}}>{t.id.substring(0,2).toUpperCase()}</div><div className="text-left"><div className="font-bold text-base">{t.name}</div><div className="text-xs opacity-60 uppercase">{t.conf}</div></div></div>{hatedTeams.includes(t.id)&&<Target size={20} className={styles.accent}/>}</button>)}</div>
          </div>
        )}

        {view === 'settings' && (
          <div className={`p-5 space-y-6 animate-in slide-in-from-bottom-4 ${styles.card} border-2`}>
            <h2 className="font-bold flex items-center gap-2 text-xl"><Settings className={styles.accent}/> Settings</h2>
            <div><h3 className="text-sm font-bold uppercase opacity-50 mb-3">Sports</h3><div className="space-y-2">{Object.keys(enabledLeagues).map(l=><div key={l} className="flex justify-between p-3 border rounded-lg"><span className="font-bold text-base">{l}</span><button onClick={()=>setEnabledLeagues(p=>({...p,[l]:!p[l]}))} className={enabledLeagues[l]?'text-green-500':'text-slate-300'}>{enabledLeagues[l]?<ToggleRight size={32}/>:<ToggleLeft size={32}/>}</button></div>)}</div></div>
            <div><h3 className="text-sm font-bold uppercase opacity-50 mb-3">Theme</h3><div className="grid gap-2">{Object.keys(THEMES).map(k=><button key={k} onClick={()=>setActiveTheme(k)} className={`p-3 text-base font-bold border-2 rounded-lg flex justify-between ${activeTheme===k?'border-current':'border-transparent bg-slate-50'}`}><span>{THEMES[k].name}</span>{activeTheme===k&&<div className="w-3 h-3 rounded-full bg-green-500"/>}</button>)}</div></div>
            <button onClick={()=>{localStorage.clear();window.location.reload()}} className="w-full py-3 text-red-400 text-sm font-bold flex justify-center items-center gap-1"><LogOut size={16}/> Reset App</button>
            <p className="text-center text-xs opacity-30 mt-4">v{APP_VERSION}</p>
          </div>
        )}
      </main>
    </div>
  );
}
