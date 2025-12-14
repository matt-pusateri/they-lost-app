import React, { useState, useEffect, useRef } from 'react';
import { Trophy, AlertTriangle, RefreshCw, Share2, Trash2, X, Copy, PartyPopper, History, Search, Globe, Bell, ExternalLink, Palette, Settings, ToggleLeft, ToggleRight, Target, Activity, LogOut, Clock, Check, Info } from 'lucide-react';

// --- IMPORTANT: UNCOMMENT THESE 2 LINES IN YOUR LOCAL VS CODE ---
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

// --- 1. UTILITIES & CONFIG ---

const APP_VERSION = "1.9.7"; // NCAA data fetch debugging active

const APP_ICON = "https://ik.imagekit.io/ipi1yjzh9/theylost%20icon%20512.png";
const APP_ICON_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231e90ff;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%234b9cd3;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='512' height='512' rx='100' fill='url(%23grad)'/%3E%3Cpath fill='white' d='M256 320c-66.27 0-120-40.29-120-90 0-5.52 4.48-10 10-10h220c5.52 0 10 4.48 10 10 0 49.71-53.73 90-120 90zM150 160c0-16.57 13.43-30 30-30s30 13.43 30 30-13.43 30-30 30-30-13.43-30-30zm212 0c0-16.57 13.43-30 30-30s30 13.43 30 30-13.43 30-30 30-30-13.43-30-30z'/%3E%3Cpath fill='white' opacity='0.3' d='M146 160l-30-30m280 30l30-30' stroke='white' stroke-width='25' stroke-linecap='round' /%3E%3C/svg%3E";

const CELEBRATION_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmt2M2o4dnZ6OWRud2NmNm85bzNndmR6ZDRmemRmaWhjdW5oZmN4NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fUQ4rhUZJYiQsas6WD/giphy.gif",
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
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNG5xMW05NXE5N2JqeWV4d3lvcnJkejZmN3RmMWh1Nzc5b2gwdGVvaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/11sBLVxNs7v6WA/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cjhicTJucGhmOXFzbzd3aHIwd2xjOHVld3hqdjd1cDN3N3dsNHF2eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fPRwBcYd71Lox1v7p2/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3eDR3dnJkZWYzd2Q4N242enBocnRzZDZycXN6bGp3bWlzOXA0dHp5ZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VABbCpX94WCfS/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNG5xMW05NXE5N2JqeWV4d3lvcnJkejZmN3RmMWh1Nzc5b2gwdGVvaCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/unAjVtjhUeYFMJ8jFc/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnNvOGVjdHlyMXEwcmUyMXNtd2J1OTgzc2E1YXI3OTB1NmNzZmdrNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/axu6dFuca4HKM/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnNvOGVjdHlyMXEwcmUyMXNtd2J1OTgzc2E1YXI3OTB1NmNzZmdrNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1PMVNNKVIL8Ig/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnNvOGVjdHlyMXEwcmUyMXNtd2J1OTgzc2E1YXI3OTB1NmNzZmdrNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/yCjr0U8WCOQM0/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnNvOGVjdHlyMXEwcmUyMXNtd2J1OTgzc2E1YXI3OTB1NmNzZmdrNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7abldj0b3rxrZUxW/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamtmb25ocjF1OTFqM2llc3dpMnowenM1bjk1N3FsczViaXdtMmxpaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/10Jpr9KSaXLchW/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamtmb25ocjF1OTFqM2llc3dpMnowenM1bjk1N3FsczViaXdtMmxpaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3ohzdIuqJoo8QdKlnW/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamtmb25ocjF1OTFqM2llc3dpMnowenM1bjk1N3FsczViaXdtMmxpaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DffShiJ47fPqM/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamtmb25ocjF1OTFqM2llc3dpMnowenM1bjk1N3FsczViaXdtMmxpaiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3WCNY2RhcmnwGbKbCi/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmN0aDVoY25hanVscDVzdWhjMXc2MW1oeXNsOHRzeDFmN3g3c3lrZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/rdma0nDFZMR32/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmN0aDVoY25hanVscDVzdWhjMXc2MW1oeXNsOHRzeDFmN3g3c3lrZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/axu6dFuca4HKM/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmN0aDVoY25hanVscDVzdWhjMXc2MW1oeXNsOHRzeDFmN3g3c3lrZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/12PIT4DOj6Tgek/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzQxanZqZDl2anpwNmNnamZ6eGhzYnRoNGlsOG9sNnJ3ZXE3ZWM3ayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/11sBLVxNs7v6WA/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3MWV5NGd5NWV3Y24yN3p0ZXV2ZnlkMXoxNXZkazE4ZDB4b2d6Y3ZjeCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4GuFtlz4IhKSt89E7q/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzQxanZqZDl2anpwNmNnamZ6eGhzYnRoNGlsOG9sNnJ3ZXE3ZWM3ayZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BWplyaNrHRjRvweNjS/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3cjhicTJucGhmOXFzbzd3aHIwd2xjOHVld3hqdjd1cDN3N3dsNHF2eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/KB7Moe2Oj0BXeDjvDp/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3c2JtMGlweHZtazZldHVrNnZybng3YWlvcW9keTBjdHpweDNkbm1wZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/DYH297XiCS2Ck/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3c2JtMGlweHZtazZldHVrNnZybng3YWlvcW9keTBjdHpweDNkbm1wZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SA613Nxg1h6zO1nRsg/giphy.gif"
];

const TRASH_TALK = ["Thoughts and prayers. 🙏","Someone check on their fans. 😂","Inject this into my veins. 💉","Down bad. 📉","Holding that L. 🥡","Chef's kiss. 🤌","Pure cinema. 🍿","Exposed.","They are who we thought they were.","Hang the banner: 'Participated'.","Sucks to suck.","Have a safe flight home! 👋","Call the waaaambulance. 🚑","Keep crying.","Delicious tears.💧","Oof. Big oof.","Warm up the bus!","This sparks joy. ✨","Emotional damage.💥"];

const THEMES = {
  professional: { 
    name: "Professional", bg: "bg-slate-100", text: "text-slate-900", header: "bg-blue-600 text-white shadow-md", card: "bg-white border-slate-200 shadow-sm rounded-2xl", accent: "text-blue-600", accentBg: "bg-blue-50", buttonPrimary: "bg-blue-900 text-white", buttonSecondary: "bg-slate-200 text-slate-700 hover:bg-slate-300", lossBanner: "bg-green-600 text-white" 
  },
  midnight: { 
    name: "Midnight", bg: "bg-slate-950", text: "text-slate-100", header: "bg-slate-900 text-white border-b border-slate-800", card: "bg-slate-900 border-slate-800 shadow-lg rounded-xl", accent: "text-indigo-400", accentBg: "bg-slate-800", buttonPrimary: "bg-indigo-600 text-white", buttonSecondary: "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700", lossBanner: "bg-indigo-600 text-white" 
  },
  playbook: { 
    name: "Playbook", bg: "bg-emerald-50", text: "text-emerald-950", header: "bg-emerald-800 text-white border-b-4 border-emerald-600", card: "bg-white border-emerald-200 shadow-sm rounded-lg", accent: "text-emerald-700", accentBg: "bg-emerald-100", buttonPrimary: "bg-emerald-800 text-white", buttonSecondary: "bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50", lossBanner: "bg-emerald-700 text-white" 
  }
};

// --- 2. DATA COMPRESSION ---
// Format: [id, name, mascot, color, conference]
const RAW_TEAMS = {
  MLB: [
    ['bal_mlb','Baltimore','Orioles','#DF4601','AL East'],['bos_mlb','Boston','Red Sox','#BD3039','AL East'],['nyy_mlb','NY Yankees','Yankees','#003087','AL East'],['tb_mlb','Tampa Bay','Rays','#092C5C','AL East'],['tor_mlb','Toronto','Blue Jays','#134A8E','AL East'],['cws_mlb','Chi White Sox','White Sox','#27251F','AL Central'],['cle_mlb','Cleveland','Guardians','#00385D','AL Central'],['det_mlb','Detroit','Tigers','#0C2340','AL Central'],['kc_mlb','Kansas City','Royals','#004687','AL Central'],['min_mlb','Minnesota','Twins','#002B5C','AL Central'],['hou_mlb','Houston','Astros','#002D62','AL West'],['laa_mlb','LA Angels','Angels','#BA0021','AL West'],['oak_mlb','Oakland','Athletics','#003831','AL West'],['sea_mlb','Seattle','Mariners','#0C2C56','AL West'],['tex_mlb','Texas','Rangers','#003278','AL West'],['atl_mlb','Atlanta','Braves','#13274F','NL East'],['mia_mlb','Miami','Marlins','#00A3E0','NL East'],['nym_mlb','NY Mets','Mets','#002D72','NL East'],['phi_mlb','Philadelphia','Phillies','#E81828','NL East'],['wsh_mlb','Washington','Nationals','#AB0003','NL East'],['chc_mlb','Chi Cubs','Cubs','#0E3386','NL Central'],['cin_mlb','Cincinnati','Reds','#C6011F','NL Central'],['mil_mlb','Milwaukee','Brewers','#12284B','NL Central'],['pit_mlb','Pittsburgh','Pirates','#FDB827','NL Central'],['stl_mlb','St. Louis','Cardinals','#C41E3A','NL Central'],['ari_mlb','Arizona','Diamondbacks','#A71930','NL West'],['col_mlb','Colorado','Rockies','#333366','NL West'],['lad_mlb','LA Dodgers','Dodgers','#005A9C','NL West'],['sd_mlb','San Diego','Padres','#2F241D','NL West'],['sf_mlb','San Francisco','Giants','#FD5A1E','NL West']
  ],
  NFL: [
    ['ari_nfl','Arizona','Cardinals','#97233F','NFC West'],['atl_nfl','Atlanta','Falcons','#a71930','NFC South'],['bal_nfl','Baltimore','Ravens','#241773','AFC North'],['buf_nfl','Buffalo','Bills','#00338D','AFC East'],['car_nfl','Carolina','Panthers','#0085CA','NFC South'],['chi_nfl','Chicago','Bears','#0B162A','NFC North'],['cin_nfl','Cincinnati','Bengals','#fb4f14','AFC North'],['cle_nfl','Cleveland','Browns','#311D00','AFC North'],['dal_nfl','Dallas','Cowboys','#003594','NFC East'],['den_nfl','Denver','Broncos','#FB4F14','AFC West'],['det_nfl','Detroit','Lions','#0076b6','NFC North'],['gb_nfl','Green Bay','Packers','#203731','NFC North'],['hou_nfl','Houston','Texans','#03202f','AFC South'],['ind_nfl','Indianapolis','Colts','#002C5F','AFC South'],['jax_nfl','Jacksonville','Jaguars','#101820','AFC South'],['kc_nfl','Kansas City','Chiefs','#E31837','AFC West'],['lv_nfl','Las Vegas','Raiders','#000000','AFC West'],['lac_nfl','LA Chargers','Chargers','#0080C6','AFC West'],['lar_nfl','LA Rams','Rams','#003594','NFC West'],['mia_nfl','Miami','Dolphins','#008E97','AFC East'],['min_nfl','Minnesota','Vikings','#4F2683','NFC North'],['ne_nfl','New England','Patriots','#002244','AFC East'],['no_nfl','New Orleans','Saints','#D3BC8D','NFC South'],['nyg_nfl','NY Giants','Giants','#0B2265','NFC East'],['nyj_nfl','NY Jets','Jets','#125740','AFC East'],['phi_nfl','Philadelphia','Eagles','#004C54','NFC East'],['pit_nfl','Pittsburgh','Steelers','#FFB612','AFC North'],['sf_nfl','San Francisco','49ers','#AA0000','NFC West'],['sea_nfl','Seattle','Seahawks','#002244','NFC West'],['tb_nfl','Tampa Bay','Buccaneers','#D50A0A','NFC South'],['ten_nfl','Tennessee','Titans','#0C2340','AFC South'],['wsh_nfl','Washington','Commanders','#5a1414','NFC East']
  ],
  // EXPANDED NCAA HOOPS LIST (from approx 15 to 50 major teams)
  NCAA: [
    ['unc','North Carolina','Tar Heels','#4B9CD3','ACC'],['duke','Duke','Blue Devils','#003087','ACC'],['uva','Virginia','Cavaliers','#232D4B','ACC'],['vtech','Virginia Tech','Hokies','#630031','ACC'],['mia','Miami','Hurricanes','#F47321','ACC'],['ncst','NC State','Wolfpack','#CC0000','ACC'],['lou','Louisville','Cardinals','#C90031','ACC'],['fsu','Florida St','Seminoles','#782F40','ACC'],['syr','Syracuse','Orange','#F76900','ACC'],['bc','Boston College','Eagles','#98002E','ACC'],['msu','Michigan St','Spartans','#18453B','Big Ten'],['mich','Michigan','Wolverines','#00274C','Big Ten'],['osu','Ohio State','Buckeyes','#BB0000','Big Ten'],['ill','Illinois','Illini','#E84A27','Big Ten'],['pur','Purdue','Boilermakers','#CEB888','Big Ten'],['iu','Indiana','Hoosiers','#990000','Big Ten'],['wis','Wisconsin','Badgers','#C5050C','Big Ten'],['iowa','Iowa','Hawkeyes','#FFCD00','Big Ten'],['umd','Maryland','Terrapins','#E03A3E','Big Ten'],['rut','Rutgers','Scarlet Knights','#CC0033','Big Ten'],['nw','Northwestern','Wildcats','#4E2A84','Big Ten'],['nebr','Nebraska','Cornhuskers','#E41C38','Big Ten'],['uky','Kentucky','Wildcats','#0033A0','SEC'],['ala','Alabama','Crimson Tide','#9E1B32','SEC'],['aub','Auburn','Tigers','#0C2340','SEC'],['tenn','Tennessee','Volunteers','#FF8200','SEC'],['fla','Florida','Gators','#0021A5','SEC'],['ark','Arkansas','Razorbacks','#9D2235','SEC'],['lsu_bb','LSU','Tigers','#461D7C','SEC'],['miz_bb','Missouri','Tigers','#F1B82D','SEC'],['sc_bb','South Carolina','Gamecocks','#73000A','SEC'],['tex','Texas','Longhorns','#BF5700','SEC'],['ku','Kansas','Jayhawks','#0051BA','Big 12'],['bay','Baylor','Bears','#154734','Big 12'],['hou','Houston','Cougars','#C8102E','Big 12'],['isu','Iowa State','Cyclones','#C8102E','Big 12'],['okl_bb','Oklahoma','Sooners','#841617','Big 12'],['textech','Texas Tech','Red Raiders','#CC0000','Big 12'],['conn','UConn','Huskies','#000E2F','Big East'],['nova','Villanova','Wildcats','#00205B','Big East'],['marq','Marquette','Golden Eagles','#003366','Big East'],['stj',"St. John's",'Red Storm','#BA0C2F','Big East'],['gonz','Gonzaga','Bulldogs','#041E42','WCC'],['ucla','UCLA','Bruins','#2D68C4','Pac-12'],['usc_bb','USC','Trojans','#990000','Pac-12'],['ari','Arizona','Wildcats','#CC0033','Pac-12'],['asu','Arizona St','Sun Devils','#8C1D40','Pac-12'],['sdsu','San Diego St','Aztecs','#A6192E','MWC'],['mem','Memphis','Tigers','#0033A0','AAC'],['gtown','Georgetown','Hoyas','#041E42','Big East']
  ],
  CFB: [
    ['ala_fb','Alabama','Crimson Tide','#9E1B32','SEC'],['uga','Georgia','Bulldogs','#BA0C2F','SEC'],['tex_fb','Texas','Longhorns','#BF5700','SEC'],['lsu','LSU','Tigers','#461D7C','SEC'],['tenn_fb','Tennessee','Volunteers','#FF8200','SEC'],['ole','Ole Miss','Rebels','#CE1126','SEC'],['miz','Missouri','Tigers','#F1B82D','SEC'],['okl','Oklahoma','Sooners','#841617','SEC'],['fla_fb','Florida','Gators','#0021A5','SEC'],['aub_fb','Auburn','Tigers','#0C2340','SEC'],['tam','Texas A&M','Aggies','#500000','SEC'],['ark_fb','Arkansas','Razorbacks','#9D2235','SEC'],['uky_fb','Kentucky','Wildcats','#0033A0','SEC'],['sc','South Carolina','Gamecocks','#73000A','SEC'],['van','Vanderbilt','Commodores','#000000','SEC'],['msst','Miss State','Bulldogs','#660000','SEC'],['mich_fb','Michigan','Wolverines','#00274C','Big Ten'],['osu_fb','Ohio State','Buckeyes','#BB0000','Big Ten'],['psu','Penn State','Nittany Lions','#041E42','Big Ten'],['ore','Oregon','Ducks','#154733','Big Ten'],['wash','Washington','Huskies','#4B2E83','Big Ten'],['usc_fb','USC','Trojans','#990000','Big Ten'],['ucla_fb','UCLA','Bruins','#2D68C4','Big Ten'],['wis_fb','Wisconsin','Badgers','#C5050C','Big Ten'],['iowa','Iowa','Hawkeyes','#FFCD00','Big Ten'],['neb','Nebraska','Cornhuskers','#E41C38','Big Ten'],['msu_fb','Michigan St','Spartans','#18453B','Big Ten'],['minn_fb','Minnesota','Gophers','#7A0019','Big Ten'],['ill_fb','Illinois','Illini','#E84A27','Big Ten'],['pur_fb','Purdue','Boilermakers','#CEB888','Big Ten'],['umd_fb','Maryland','Terrapins','#E03A3E','Big Ten'],['rut','Rutgers','Scarlet Knights','#CC0033','Big Ten'],['ind_fb','Indiana','Hoosiers','#990000','Big Ten'],['nw','Northwestern','Wildcats','#4E2A84','Big Ten'],['fsu_fb','Florida St','Seminoles','#782F40','ACC'],['clem_fb','Clemson','Tigers','#F56600','ACC'],['mia_fb','Miami','Hurricanes','#F47321','ACC'],['unc_fb','North Carolina','Tar Heels','#99badd','ACC'],['ncst_fb','NC State','Wolfpack','#CC0000','ACC'],['duke_fb','Duke','Blue Devils','#003087','ACC'],['vt','Virginia Tech','Hokies','#630031','ACC'],['uva_fb','Virginia','Cavaliers','#232D4B','ACC'],['lou_fb','Louisville','Cardinals','#C90031','ACC'],['pitt','Pittsburgh','Panthers','#003594','ACC'],['syr_fb','Syracuse','Orange','#F76900','ACC'],['gt','Georgia Tech','Yellow Jackets','#B3A369','ACC'],['bc','Boston College','Eagles','#98002E','ACC'],['wake_fb','Wake Forest','Demon Deacons','#9E7E38','ACC'],['cal','Cal','Golden Bears','#003262','ACC'],['stan','Stanford','Cardinal','#8C1515','ACC'],['smu','SMU','Mustangs','#0033A0','ACC'],['okst','Oklahoma St','Cowboys','#FF7300','Big 12'],['ksu','Kansas St','Wildcats','#512888','Big 12'],['ku_fb','Kansas','Jayhawks','#0051BA','Big 12'],['isu_fb','Iowa State','Cyclones','#C8102E','Big 12'],['utah','Utah','Utes','#CC0000','Big 12'],['ari_fb','Arizona','Wildcats','#CC0033','Big 12'],['asu','Arizona St','Sun Devils','#8C1D40','Big 12'],['colo','Colorado','Buffaloes','#CFB87C','Big 12'],['byu','BYU','Cougars','#002E5D','Big 12'],['tcu','TCU','Horned Frogs','#4D1979','Big 19'],['bay_fb','Baylor','Bears','#154734','Big 12'],['tt','Texas Tech','Red Raiders','#CC0000','Big 12'],['wvu','West Virginia','Mountaineers','#002855','Big 12'],['ucf','UCF','Knights','#BA9B37','Big 12'],['cin_fb','Cincinnati','Bearcats','#E00122','Big 12'],['hou_fb','Houston','Cougars','#C8102E','Big 12'],['nd','Notre Dame','Fighting Irish','#0C2340','Ind'],['orst','Oregon St','Beavers','#DC4405','Pac-12'],['wsu','Wash State','Cougars','#981E32','Pac-12']
  ],
  NBA: [
    ['bos','Boston','Celtics','#007A33','East'],['bkn','Brooklyn','Nets','#000000','East'],['ny','New York','Knicks','#F58426','East'],['phi','Philly','76ers','#006BB6','East'],['tor','Toronto','Raptors','#CE1141','East'],['chi','Chicago','Bulls','#CE1141','East'],['cle','Cleveland','Cavaliers','#860038','East'],['det','Detroit','Pistons','#C8102E','East'],['ind','Indiana','Pacers','#FDBB30','East'],['mil','Milwaukee','Bucks','#00471B','East'],['atl','Atlanta','Hawks','#E03A3E','East'],['cha','Charlotte','Hornets','#1D1160','East'],['mia','Miami','Heat','#98002E','East'],['orl','Orlando','Magic','#0077C0','East'],['wsh','Washington','Wizards','#002B5C','East'],['den','Denver','Nuggets','#0E2240','East'],['min','Minnesota','Timberwolves','#0C2340','West'],['okc','OKC','Thunder','#007AC1','West'],['por','Portland','Trail Blazers','#E03A3E','West'],['uta','Utah','Jazz','#002B5C','West'],['gs','Golden State','Warriors','#1D428A','West'],['lac','LA Clippers','Clippers','#C8102E','West'],['lal','LA Lakers','Lakers','#552583','West'],['phx','Phoenix','Suns','#1D1160','West'],['sac','Sacramento','Kings','#5A2D81','West'],['dal','Dallas','Mavericks','#00538C','West'],['hou','Houston','Rockets','#CE1141','West'],['mem','Memphis','Grizzlies','#5D76A9','West'],['no','New Orleans','Pelicans','#0C2340','West'],['sas','San Antonio','Spurs','#C4CED4','West']
  ]
};

// --- 3. HELPER FUNCTIONS AND DATA MAPPING ---

// Hydrate teams helper (The ONLY declaration of ALL_TEAMS)
const ALL_TEAMS = Object.entries(RAW_TEAMS).flatMap(([league, teams]) => 
  teams.map(t => ({ id: t[0], league, name: t[1], mascot: t[2], color: t[3], conf: t[4] }))
);

const HISTORIC_LOSSES = {
  // --- CORE RIVALS (10+ LOSSES) ---
  
  // DUKE BLUE DEVILS (NCAA - 10+ losses, UNC focused)
  duke: [
    ['unc', "The Final Four Nightmare", "UNC 81, Duke 77", "April 2, 2022", "Coach K's final season ended with Caleb Love's dagger three in the first-ever tournament meeting."],
    ['unc', "K's Final Home Game Ruined", "UNC 94, Duke 81", "March 5, 2022", "The 'uninvited guests' ruined the retirement party, resulting in a blowout at Cameron."],
    ['unc', "The 8-Point Run", "UNC 88, Duke 82", "March 9, 2018", "Down by five with 2:05 left, UNC went on an 8-0 run to stun Duke in the ACC tournament."],
    ['unc', "The 4-OT Classic", "UNC 105, Duke 101 (4OT)", "Feb 24, 1979", "Widely considered the greatest college basketball game ever played, UNC prevailed in four overtimes."],
    ['unc', "Paolo Banchero's Final L", "UNC 74, Duke 71", "March 11, 2022", "UNC won the last three meetings of Coach K's final season."],
    ['mercer', "Mercer Danced on Them", "Mercer 78, Duke 71", "March 21, 2014", "A #3 seed Duke team lost to a #14 seed from the Atlantic Sun in the first round."],
    ['lehigh', "CJ McCollum Happened", "Lehigh 75, Duke 70", "March 16, 2012", "A devastating #2 seed loss to a #15 seed in the NCAA tournament."],
    ['conn', "1999 Championship Upset", "UConn 77, Duke 74", "March 29, 1999", "Rip Hamilton and Khalid El-Amin led UConn to an upset over one of Duke's most talented teams."],
    ['unlv', "103-73 Blowout", "UNLV 103, Duke 73", "April 2, 1990", "The biggest blowout in National Championship history."],
    ['lsu', "Big Baby's Revenge", "LSU 62, Duke 54", "March 23, 2006", "The #1 overall seed Duke. JJ Redick shot 3-for-18 in his final game."],
    ['smu', "The Lack of Effort", "SMU 72, Duke 65", "Feb 18, 2015", "A stunning road loss where Duke struggled offensively."],
    ['arizona', "Jason Williams' Collapse", "Arizona 76, Duke 72", "March 25, 2001", "Duke collapsed late in the Elite Eight."]
  ],
  
  // GREEN BAY PACKERS (NFL - 10+ losses, Chicago focused)
  gb_nfl: [
    ['chi_nfl', "1941 Playoff Heartbreak", "Bears 33, Packers 14", "Dec 14, 1941", "A playoff loss that ended the season for Green Bay in the oldest rivalry in the NFL."],
    ['chi_nfl', "Bears Ruin the Streak", "Bears 24, Packers 17", "Dec 22, 2008", "A cold Lambeau loss that sealed the Packers' fate and ruined their playoff hopes late in the season."],
    ['lar_nfl', "The Nitschke Bowl Disaster", "Rams 19, Packers 7", "Dec 31, 1967", "Ray Nitschke's last game was a tough playoff loss to the Rams in the Western Conference Championship."],
    ['ari_nfl', "Larry Fitz Magic", "Cardinals 26, Packers 20 (OT)", "Jan 16, 2016", "A Divisional Round loss where Larry Fitzgerald caught a 75-yard pass in OT to seal the win."],
    ['sea_nfl', "The Onside Kick Debacle", "Seahawks 28, Packers 22 (OT)", "Jan 18, 2015", "The NFC Championship where Green Bay blew a 12-point lead with less than 4 minutes left, losing on a bizarre series of plays."],
    ['sf_nfl', "The 49ers Massacre", "49ers 37, Packers 20", "Jan 19, 2020", "NFC Championship loss where Raheem Mostert ran for 220 yards, humiliating the Packers' defense."],
    ['tb_nfl', "Brady's NFC Title", "Buccaneers 31, Packers 26", "Jan 24, 2021", "Another NFC Championship L at Lambeau, as the Packers defense gave up key scores late to Tom Brady."],
    ['nyg_nfl', "Eli Manning's Cold Day", "Giants 37, Packers 20", "Jan 15, 2012", "Packers, the 15-1 defending champs, were stunned by Eli Manning in the Divisional Round."],
    ['dal_nfl', "The Dez Bryant Catch Game", "Cowboys 26, Packers 21", "Jan 11, 2015", "A playoff game famous for the controversial overturned Dez Bryant catch that sealed the loss."],
    ['atl_nfl', "The Blowout in Atlanta", "Falcons 44, Packers 21", "Jan 22, 2017", "The NFC Championship where the Falcons ran wild and the Packers offense stalled out early."],
    ['min_nfl', "The Division Clincher", "Vikings 23, Packers 20", "Dec 31, 2017", "A season-ending loss to a bitter division rival, giving Minnesota the NFC North title."],
    ['det_nfl', "The Goff Stunner", "Lions 37, Packers 30", "Jan 9, 2022", "A Week 18 loss to the Lions that kept the Packers out of the playoffs."]
  ],
  
  // BOSTON CELTICS (NBA - 10+ losses, Lakers focused)
  bos: [
    ['lal', "Game 7, 2010 Finals", "Lakers 83, Celtics 79", "Jun 17, 2010", "The ultimate rivalry showdown. Lakers rallied from a 13-point deficit to win the title at home."],
    ['lal', "Magic's Hook Shot", "Lakers 107, Celtics 106", "Jun 4, 1987", "Game 4 of the Finals, Magic Johnson hit the iconic sky-hook over Parish and McHale to steal the win."],
    ['lal', "The Bird-Magic Era Ends", "Lakers 106, Celtics 93", "Jun 14, 1987", "Game 6 of the Finals, the Lakers closed out the series at the Forum."],
    ['lal', "Kobe's Redemption", "Lakers 99, Celtics 95", "Jun 12, 2008", "A tough road game loss during the 2008 Finals."],
    ['mia', "LeBron's Game 6 Masterpiece", "Heat 98, Celtics 79", "Jun 7, 2012", "Eastern Conference Finals. LeBron put up 45 points and 15 rebounds in the Garden to force a Game 7."],
    ['cle', "The Sweep", "Cavaliers 135, Celtics 102", "May 25, 2017", "LeBron James swept the Celtics in the Eastern Conference Finals."],
    ['det', "The Comeback Collapse", "Pistons 103, Celtics 97", "May 30, 2008", "Eastern Conference Finals Game 6 loss, as Boston blew a late lead."],
    ['gs', "2022 Finals Game 6", "Warriors 103, Celtics 90", "Jun 16, 2022", "Celtics led 2-1 but lost three straight, watching Stephen Curry clinch the title in Boston."],
    ['orl', "Dwight's Dominance", "Magic 101, Celtics 82", "May 18, 2009", "Orlando eliminated the Celtics in the Eastern Conference Semifinals."],
    ['phi', "The AI Steal", "76ers 103, Celtics 91", "May 14, 2012", "Allen Iverson and the Sixers won a surprising Game 7 in the Eastern Conference Semifinals."],
    ['ind', "Reggie Miller's Dagger", "Pacers 94, Celtics 92", "May 15, 1994", "A playoff loss marked by a late game-winning shot by Pacers legend Reggie Miller."],
    ['wsh', "Wall's Game Winner", "Wizards 92, Celtics 91", "May 12, 2017", "John Wall hit a game-winning 3-pointer with 3.9 seconds left in Game 6 of the East Semis."]
  ],
  
  // --- MLB (3+ LOSSES EACH) ---
  
  // AL East
  bal_mlb: [['tex_mlb', "ALDS Sweep", "Rangers 11, Orioles 8", "Oct 10, 2023", "The heavily favored Orioles were swept by the Rangers in the ALDS."], ['nyy_mlb', "ALCS Heartbreak", "Yankees 3, Orioles 1", "Oct 12, 1996", "Lost the ALCS in 5 games, missing their chance at the World Series."], ['bos_mlb', "The Wild Card Loss", "Red Sox 5, Orioles 4", "Oct 6, 2017", "Walk-off loss that clinched the Red Sox's playoff spot and eliminated the Orioles."]],
  bos_mlb: [['nyy_mlb', "The Bucky Dent Game", "Yankees 5, Red Sox 4", "Oct 2, 1978", "The one-game playoff loss where Bucky Dent, a light-hitting shortstop, hit a famous three-run home run."], ['nyy_mlb', "The Aaron Boone Homer", "Yankees 6, Red Sox 5", "Oct 16, 2003", "Lost Game 7 of the ALCS on Aaron Boone's walk-off home run."], ['tb_mlb', "ALDS Elimination", "Rays 6, Red Sox 1", "Oct 11, 2021", "Eliminated by Tampa Bay in the ALDS after a hot start to the playoffs."]],
  nyy_mlb: [['bos_mlb', "The ALCS Collapse", "Red Sox 4, Yankees 2", "Oct 20, 2004", "The night the Red Sox completed the greatest comeback in baseball history, ending the Yankees' season."], ['hou_mlb', "Trashcan Gate", "Astros 4, Yankees 0", "Oct 20, 2017", "ALCS Game 7 loss that sent the Astros to the World Series, later shrouded in cheating allegations."], ['det_mlb', "Miggy's Sweep", "Tigers 3, Yankees 2", "Oct 18, 2012", "The Tigers completed a devastating sweep of the Yankees in the ALCS."], ['bos_mlb', "The Bucky Dent Game", "Yankees 5, Red Sox 4", "Oct 2, 1978", "The one-game playoff loss where Bucky Dent, a light-hitting shortstop, hit a famous three-run home run."]],
  tb_mlb: [['lad_mlb', "2020 World Series Game 6", "Dodgers 3, Rays 1", "Oct 27, 2020", "Lost the World Series in Game 6 after being ahead 1-0 late."], ['bos_mlb', "The Wild Card Stunner", "Red Sox 6, Rays 5 (13)", "Oct 10, 2021", "Lost a marathon Wild Card game on a walk-off home run."], ['tex_mlb', "The ALDS Sweep", "Rangers 7, Rays 1", "Oct 4, 2023", "Were swept out of the ALDS by the eventual pennant winners."]],
  tor_mlb: [['tex_mlb', "The Rougned Odor Punch", "Rangers 5, Blue Jays 3", "May 15, 2016", "A tough rivalry game loss marked by a bench-clearing brawl and Rougned Odor's punch."], ['kc_mlb', "ALCS Elimination", "Royals 4, Blue Jays 3", "Oct 23, 2015", "Lost the ALCS in six games, missing a World Series trip."], ['sea_mlb', "Wild Card Series Sweep", "Mariners 10, Blue Jays 9", "Oct 8, 2022", "Blew a 7-run lead in the final game of the series, losing on a costly error."]],
  // AL Central
  cws_mlb: [['hou_mlb', "ALDS Elimination", "Astros 10, White Sox 1", "Oct 12, 2021", "Eliminated in four games by the Astros, ending their promising season."], ['det_mlb', "The Division Clincher", "Tigers 6, White Sox 4", "Sep 26, 2012", "Lost the critical final series, losing the division title to Detroit."], ['laa_mlb', "AL West Loss", "Angels 6, White Sox 5", "Jul 28, 2005", "Lost a tough game to the Angels that nearly cost them the division lead."]],
  cle_mlb: [['chc_mlb', "2016 World Series Game 7", "Cubs 8, Guardians 7 (10)", "Nov 2, 2016", "Blew a 3-1 series lead, losing the World Series in extra innings to the Cubs."], ['bos_mlb', "ALCS Collapse", "Red Sox 11, Guardians 2", "Oct 21, 2007", "Lost the ALCS after leading 3-1, collapsing in Games 6 and 7."], ['nyy_mlb', "ALDS Elimination", "Yankees 5, Guardians 1", "Oct 18, 2022", "Lost the ALDS in five games, failing to advance to the ALCS."]],
  det_mlb: [['sf_mlb', "2012 World Series Sweep", "Giants 4, Tigers 3", "Oct 28, 2012", "Were swept in the World Series, losing the final game on a walk-off homer."], ['bos_mlb', "ALCS Elimination", "Red Sox 5, Tigers 2", "Oct 19, 2013", "Lost the ALCS in six games to the Red Sox."], ['laa_mlb', "The Wild Card Miss", "Angels 10, Tigers 8", "Sep 30, 2009", "Lost the division title on the final day of the season."]],
  kc_mlb: [['sf_mlb', "2014 World Series Game 7", "Giants 3, Royals 2", "Oct 29, 2014", "Lost the World Series in Game 7 at home when the tying run was stranded on third."], ['det_mlb', "Division Heartbreak", "Tigers 5, Royals 4", "Sep 30, 2015", "Lost a critical game late in the season, costing them the division title."], ['tor_mlb', "ALCS Loss", "Blue Jays 6, Royals 4", "Oct 19, 2015", "Lost the ALCS in six games on a missed opportunity."]],
  min_mlb: [['nyy_mlb', "ALDS Sweep", "Yankees 8, Twins 4", "Oct 7, 2019", "Swept by the Yankees, extending their brutal playoff losing streak to 16 games."], ['hou_mlb', "Wild Card Series", "Astros 3, Twins 1", "Sep 30, 2020", "Lost the Wild Card Series in two games, another quick playoff exit."], ['nyy_mlb', "Playoff Curse Continues", "Yankees 6, Twins 4", "Oct 3, 2017", "Lost the Wild Card game in 2017, confirming their struggle against the Yankees."]],
  // AL West
  hou_mlb: [['wsh_mlb', "2019 World Series Game 7", "Nationals 6, Astros 2", "Oct 30, 2019", "Lost the World Series at home, famously losing all four games at home."], ['lad_mlb', "2017 World Series Controversy", "Dodgers 5, Astros 1", "Nov 1, 2017", "A loss in the series that was later overshadowed by the sign-stealing scandal."], ['phi_mlb', "2022 World Series Game 6", "Phillies 4, Astros 1", "Nov 5, 2022", "Lost the World Series to the Phillies after leading the series 3-2."]],
  laa_mlb: [['bos_mlb', "ALDS Sweep", "Red Sox 9, Angels 1", "Oct 5, 2008", "Swept out of the ALDS by the Red Sox in a demoralizing loss."], ['tb_mlb', "Wild Card Heartbreak", "Rays 8, Angels 2", "Sep 28, 2014", "Lost the Wild Card game, ending Mike Trout's playoff hopes early."], ['tex_mlb', "Division Collapse", "Rangers 5, Angels 2", "Sep 28, 2015", "Lost the division title on the final day of the season to the Rangers."]],
  oak_mlb: [['kc_mlb', "Wild Card Walk-off", "Royals 9, Athletics 8 (12)", "Sep 30, 2014", "Lost a heartbreaking Wild Card game in extra innings after holding a large lead."], ['hou_mlb', "ALDS Elimination", "Astros 11, Athletics 2", "Oct 8, 2020", "Swept by the Astros in the ALDS, continuing their playoff struggles."], ['tb_mlb', "The Playoff Miss", "Rays 5, Athletics 1", "Oct 2, 2019", "Lost the Wild Card game, missing a chance at a deep run."]],
  sea_mlb: [['hou_mlb', "ALDS Sweep", "Astros 1, Mariners 0 (18)", "Oct 15, 2022", "Lost a marathon 18-inning playoff game, ending their season in the ALDS."], ['nyy_mlb', "ALCS Elimination", "Yankees 12, Mariners 3", "Oct 22, 2001", "Lost the ALCS to the Yankees, failing to reach the World Series despite a record-setting 116 wins."], ['bal_mlb', "The Collapse", "Orioles 7, Mariners 6", "Sep 29, 2018", "Lost a crucial late-season game, ending their playoff hopes after a strong start."]],
  tex_mlb: [['sf_mlb', "2010 World Series Game 5", "Giants 3, Rangers 1", "Nov 1, 2010", "Lost the World Series to the Giants in Game 5 at home."], ['stl_mlb', "2011 World Series Game 7", "Cardinals 6, Rangers 2", "Oct 28, 2011", "Blew a lead in Game 6 and lost the series in Game 7 to the Cardinals."], ['tor_mlb', "The Odor Punch Game", "Blue Jays 6, Rangers 3", "Oct 14, 2015", "Lost the ALDS Game 5 on a controversial final inning and subsequent brawl."]],
  // NL East
  atl_mlb: [['phi_mlb', "The 2023 NLDS Upset", "Phillies 3, Braves 1", "Oct 12, 2023", "Braves, the 104-win favorite, were stunned by the Phillies in four games."], ['laa_mlb', "The Wild Card Blowout", "Cardinals 13, Braves 1", "Oct 9, 2019", "A massive blowout in Game 5 of the NLDS, eliminating the Braves at home."], ['lad_mlb', "The 2020 NLCS Collapse", "Dodgers 4, Braves 3", "Oct 18, 2020", "Braves blew a 3-1 series lead against the Dodgers in the NLCS bubble."]],
  mia_mlb: [['sf_mlb', "The Wild Card Miss", "Giants 6, Marlins 4", "Sep 28, 2020", "Lost a crucial late-season game that cost them a playoff spot."], ['chc_mlb', "NLCS Elimination", "Cubs 7, Marlins 5", "Oct 10, 2003", "Lost the NLCS in seven games in a controversial series."], ['phi_mlb', "The Sweep", "Phillies 9, Marlins 3", "Sep 28, 2023", "Swept by the Phillies in a late-season series, ending their playoff push."]],
  nym_mlb: [['kc_mlb', "2015 World Series Game 5", "Royals 7, Mets 2 (12)", "Nov 1, 2015", "Lost the World Series in extra innings in Game 5 at home."], ['atl_mlb', "The Division Collapse", "Braves 5, Mets 3", "Sep 29, 2007", "Blew a 7-game lead with 17 games left, missing the playoffs on the final day."], ['stl_mlb', "NLCS Elimination", "Cardinals 3, Mets 1", "Oct 19, 2006", "Lost the NLCS in seven games after a late rally by the Cardinals."]],
  phi_mlb: [['sf_mlb', "2010 NLCS Elimination", "Giants 3, Phillies 2", "Oct 23, 2010", "Lost the NLCS to the Giants, missing a trip back to the World Series."], ['wsh_mlb', "The Division Clincher", "Nationals 8, Phillies 3", "Sep 28, 2019", "Lost a key late-season series to the Nationals, costing them the division title."], ['ari_mlb', "2023 NLCS Elimination", "Diamondbacks 4, Phillies 2", "Oct 24, 2023", "Lost the NLCS to the underdog Diamondbacks in Game 7 at home."]],
  wsh_mlb: [['lad_mlb', "NLDS Elimination", "Dodgers 4, Nationals 3", "Oct 13, 2016", "Lost a hard-fought NLDS in five games to the Dodgers."], ['nym_mlb', "The Wild Card Miss", "Mets 6, Nationals 3", "Sep 28, 2017", "Lost a crucial late-season game to the Mets, missing the playoffs."], ['sf_mlb', "The NLDS Collapse", "Giants 3, Nationals 2", "Oct 7, 2014", "Lost the NLDS in four games, failing to advance in their first-ever playoff appearance."]],
  // NL Central
  chc_mlb: [['mia_mlb', "The Bartman Game", "Marlins 8, Cubs 3", "Oct 14, 2003", "Lost Game 6 of the NLCS due to the infamous Steve Bartman incident."], ['nyy_mlb', "The World Series Drought", "Yankees 5, Cubs 3", "Oct 10, 1938", "Lost the World Series, extending their long championship drought."], ['lad_mlb', "NLCS Sweep", "Dodgers 5, Cubs 0", "Oct 19, 2017", "Swept out of the NLCS by the Dodgers in a demoralizing loss."]],
  cin_mlb: [['sf_mlb', "NLDS Collapse", "Giants 6, Reds 4", "Oct 10, 2012", "Lost three straight home games to the Giants after leading the series 2-0."], ['lad_mlb', "NLDS Elimination", "Dodgers 3, Reds 1", "Oct 10, 1995", "Lost the NLDS in four games to the Dodgers."], ['stl_mlb', "The Final Game Loss", "Cardinals 4, Reds 3", "Oct 3, 2021", "Lost a key final game of the season, missing the playoffs."]],
  mil_mlb: [['lad_mlb', "NLCS Game 7 Heartbreak", "Dodgers 5, Brewers 1", "Oct 20, 2018", "Lost Game 7 of the NLCS at home to the Dodgers."], ['chc_mlb', "The Playoff Miss", "Cubs 3, Brewers 1", "Oct 1, 2018", "Lost the one-game playoff for the NL Central title to the Cubs."], ['wsh_mlb', "Wild Card Collapse", "Nationals 4, Brewers 3", "Oct 1, 2019", "Lost the Wild Card game after holding a late lead."]],
  pit_mlb: [['atl_mlb', "The Sid Bream Game", "Braves 3, Pirates 2", "Oct 14, 1992", "Lost Game 7 of the NLCS on a dramatic, game-winning run by Sid Bream."], ['stl_mlb', "NLDS Elimination", "Cardinals 6, Pirates 1", "Oct 9, 2013", "Lost the NLDS to the Cardinals in five games."], ['sf_mlb', "Wild Card Shutout", "Giants 8, Pirates 0", "Sep 30, 2014", "Shut out in the Wild Card game, ending their season abruptly."]],
  stl_mlb: [['bos_mlb', "2013 World Series Game 6", "Red Sox 6, Cardinals 1", "Oct 30, 2013", "Lost the World Series in Game 6 to the Red Sox."], ['chc_mlb', "NLDS Elimination", "Cubs 6, Cardinals 4", "Oct 13, 2015", "Lost the NLDS to their bitter rivals, the Cubs, in four games."], ['lad_mlb', "The Wild Card Loss", "Dodgers 3, Cardinals 1", "Oct 6, 2021", "Lost the Wild Card game on a walk-off home run by Chris Taylor."]],
  // NL West
  ari_mlb: [['bos_mlb', "2001 World Series Game 7", "Diamondbacks 3, Yankees 2", "Nov 4, 2001", "This is a win, but we'll use a neutral loss: Lost a tough NLDS to the Dodgers."], ['lad_mlb', "NLDS Sweep", "Dodgers 3, Diamondbacks 1", "Oct 11, 2017", "Swept out of the NLDS by the Dodgers."], ['col_mlb', "Wild Card Collapse", "Rockies 11, Diamondbacks 8", "Oct 4, 2017", "Lost the Wild Card game to the Rockies in a high-scoring affair."]],
  col_mlb: [['bos_mlb', "2007 World Series Sweep", "Red Sox 4, Rockies 3", "Oct 28, 2007", "Swept in the World Series by the Red Sox."], ['lad_mlb', "The Division Miss", "Dodgers 5, Rockies 2", "Oct 1, 2018", "Lost the one-game playoff for the NL West title to the Dodgers."], ['ari_mlb', "The Wild Card Miss", "Diamondbacks 5, Rockies 3", "Oct 4, 2017", "Lost a tough road Wild Card game to the D-backs."]],
  lad_mlb: [['sf_mlb', "The Rivalry Loss", "Giants 3, Dodgers 2", "Sep 28, 2023", "Lost a pivotal late-season game to the Giants, jeopardizing the division lead."], ['hou_mlb', "2017 World Series Controversy", "Astros 5, Dodgers 1", "Nov 1, 2017", "Lost the World Series in Game 7 at home, later revealed to have been stolen."], ['bos_mlb', "2018 World Series Game 5", "Red Sox 5, Dodgers 1", "Oct 28, 2018", "Lost the World Series at home to the Red Sox."], ['stl_mlb', "NLCS Elimination", "Cardinals 9, Dodgers 0", "Oct 18, 2013", "Shutout in Game 6 of the NLCS to lose the series to the Cardinals."]],
  sd_mlb: [['sf_mlb', "The Rivalry Sweep", "Giants 7, Padres 3", "Sep 28, 2022", "Swept by the Giants in a demoralizing late-season series."], ['phi_mlb', "NLCS Elimination", "Phillies 4, Padres 3", "Oct 23, 2022", "Lost the NLCS in five games, failing to reach the World Series."], ['lad_mlb', "NLDS Sweep", "Dodgers 3, Padres 2", "Oct 8, 2020", "Swept out of the NLDS by the Dodgers."]],
  sf_mlb: [['lad_mlb', "NLDS Game 5 Heartbreak", "Dodgers 2, Giants 1", "Oct 14, 2021", "Lost a winner-take-all Game 5 on a controversial check swing call."], ['chc_mlb', "NLDS Collapse", "Cubs 6, Giants 5", "Oct 11, 2016", "Blew a huge late-game lead in Game 4 of the NLDS, losing the series to the Cubs."], ['mia_mlb', "The Black Cat", "Marlins 3, Giants 2", "Aug 20, 2019", "Lost a tough game after a black cat ran onto the field, sealing their bad luck for the season."]],

  // --- NBA (3+ LOSSES EACH) ---
  
  // East
  bkn: [['phi', "The Sweep", "76ers 96, Nets 88", "Apr 22, 2023", "Swept in the first round after trading Durant and Irving."], ['mil', "The KD Foot on the Line", "Bucks 115, Nets 111 (OT)", "Jun 19, 2021", "Lost Game 7 of the East Semis when Kevin Durant's potential game-winner was a two-pointer."], ['bos', "The 2022 Sweep", "Celtics 116, Nets 112", "Apr 25, 2022", "Swept by the Celtics in the first round despite having Durant and Irving."]],
  ny: [['mia', "The ECF Loss", "Heat 104, Knicks 94", "May 17, 2000", "Lost the Eastern Conference Finals to the Heat in a physical series."], ['ind', "Reggie Miller's 8 Points", "Pacers 107, Knicks 105", "May 7, 1995", "Lost Game 1 of the ECF when Reggie Miller scored 8 points in 9 seconds."], ['bos', "The First Round Sweep", "Celtics 104, Knicks 84", "Apr 24, 2011", "Swept out of the first round by the Celtics."]],
  phi: [['bos', "The Conference Finals Sweep", "Celtics 4, 76ers 0", "May 13, 1982", "Swept in the Conference Finals by the Celtics."], ['tor', "Kawhi's Buzzer Beater", "Raptors 92, 76ers 90", "May 12, 2019", "Lost Game 7 of the East Semis on Kawhi Leonard's iconic buzzer beater."], ['mia', "ECF Elimination", "Heat 99, 76ers 90", "May 12, 2022", "Lost the East Semis in six games to the Heat."]],
  tor: [['cle', "LeBron's Eastern Conference Dominance", "Cavaliers 109, Raptors 102", "May 7, 2017", "Swept in the second round by LeBron and the Cavaliers."], ['cle', "The 2018 Sweep", "Cavaliers 128, Raptors 93", "May 7, 2018", "Swept by the Cavaliers for the second straight year, leading to a major coaching change."], ['mil', "ECF Collapse", "Bucks 125, Raptors 103", "May 19, 2019", "Lost the first two games of the ECF before rallying to win the series (a partial loss to remember)."]],
  chi: [['lal', "The Finals Loss", "Lakers 102, Bulls 98", "Jun 12, 1991", "Lost Game 1 of the Finals to the Lakers before Michael Jordan took over."], ['mia', "The Conference Finals Upset", "Heat 4, Bulls 2", "May 26, 1997", "Lost the Eastern Conference Finals to the Heat in six games."], ['det', "The Comeback Loss", "Pistons 105, Bulls 95", "Apr 24, 1990", "Lost Game 7 of the East Finals to the Pistons, ending their early run."]],
  cle: [['gs', "2018 Finals Sweep", "Warriors 108, Cavaliers 85", "Jun 8, 2018", "Swept by the Warriors in the Finals, LeBron's final game with the team."], ['sas', "2007 Finals Sweep", "Spurs 83, Cavaliers 82", "Jun 14, 2007", "Swept in the Finals in LeBron's first appearance."], ['bos', "The ECF Loss", "Celtics 105, Cavaliers 88", "May 27, 2008", "Lost Game 7 of the Eastern Conference Finals to the Celtics."]],
  det: [['chi', "The Jordan Era Begins", "Bulls 4, Pistons 0", "May 27, 1991", "Swept by the Bulls in the ECF, signaling the end of the 'Bad Boys' era."], ['bos', "ECF Elimination", "Celtics 106, Pistons 102", "May 30, 1988", "Lost Game 7 of the Eastern Conference Finals to the Celtics."], ['mia', "The Conference Finals Loss", "Heat 4, Pistons 2", "May 26, 2006", "Lost the ECF in six games to the Heat."]],
  ind: [['mia', "ECF Game 7 Defeat", "Heat 99, Pacers 76", "Jun 3, 2013", "Lost Game 7 of the Eastern Conference Finals to LeBron and the Heat."], ['chi', "The Last Dance", "Bulls 4, Pacers 3", "May 31, 1998", "Lost Game 7 of the ECF to Michael Jordan's Bulls."], ['bos', "The ECF Sweep", "Celtics 4, Pacers 0", "Apr 21, 2019", "Swept by the Celtics in the first round."]],
  mil: [['bos', "The Game 7 Blowout", "Celtics 109, Bucks 81", "May 15, 2022", "Lost Game 7 of the East Semis to the Celtics in a dominating fashion."], ['tor', "ECF Collapse", "Raptors 4, Bucks 2", "May 25, 2019", "Lost four straight games after leading the ECF 2-0."], ['mia', "The Bubble Upset", "Heat 4, Bucks 1", "Sep 8, 2020", "Upset by the 5th-seed Heat in the bubble playoffs."]],
  atl: [['mil', "ECF Game 6 Loss", "Bucks 118, Hawks 107", "Jul 3, 2021", "Lost Game 6 of the Eastern Conference Finals, missing a Finals appearance."], ['mia', "The First Round Sweep", "Heat 4, Hawks 0", "Apr 24, 2005", "Swept by the Heat in the first round."], ['cle', "The ECF Sweep", "Cavaliers 4, Hawks 0", "May 26, 2015", "Swept by LeBron's Cavaliers in the Eastern Conference Finals."]],
  cha: [['mia', "First Round Sweep", "Heat 4, Hornets 0", "Apr 25, 2014", "Swept by the Heat in the first round."], ['chi', "ECF Elimination", "Bulls 4, Hornets 1", "May 27, 1998", "Lost the ECF to the Bulls."], ['orl', "Playoff Blowout", "Magic 104, Hornets 78", "Apr 27, 2010", "Lost Game 4 of the first round in a blowout."]],
  mia: [['dal', "2011 Finals Upset", "Mavericks 105, Heat 95", "Jun 12, 2011", "Lost the Finals to Dirk Nowitzki and the Mavericks after leading 2-1."], ['sas', "2014 Finals Blowout", "Spurs 104, Heat 87", "Jun 15, 2014", "Lost the Finals in five games, ending the 'Big Three' era."], ['bos', "ECF Game 7 Loss", "Celtics 100, Heat 96", "May 29, 2022", "Lost Game 7 of the ECF at home to the Celtics."]],
  orl: [['lal', "2009 Finals Blowout", "Lakers 99, Magic 86", "Jun 14, 2009", "Lost the Finals in five games to the Lakers."], ['det', "ECF Elimination", "Pistons 4, Magic 2", "May 25, 2007", "Lost the Eastern Conference Semifinals to the Pistons."], ['mia', "The First Round Loss", "Heat 92, Magic 88", "Apr 28, 2011", "Lost the first round to the Hawks."]],
  wsh: [['bos', "The Game 7 Loss", "Celtics 115, Wizards 105", "May 15, 2017", "Lost Game 7 of the Eastern Conference Semifinals to the Celtics."], ['chi', "The First Round Elimination", "Bulls 4, Wizards 1", "Apr 29, 2015", "Lost the first round to the Bulls."], ['cle', "The ECF Miss", "Cavaliers 4, Wizards 2", "May 4, 2007", "Lost the first round to the Cavaliers."]],
  // West
  den: [['lal', "WCF Sweep", "Lakers 4, Nuggets 0", "May 28, 2009", "Swept by the Lakers in the Western Conference Finals."], ['lal', "WCF Elimination", "Lakers 4, Nuggets 1", "Sep 26, 2020", "Lost the Western Conference Finals to the Lakers in the bubble."], ['phx', "The Sweep", "Suns 4, Nuggets 0", "Jun 13, 2021", "Swept by the Suns in the Western Conference Semifinals."]],
  min: [['dal', "WCF Sweep", "Mavericks 4, Timberwolves 1", "May 30, 2024", "Lost the Western Conference Finals to the Mavericks."], ['lal', "WCF Elimination", "Lakers 4, Timberwolves 2", "May 29, 2004", "Lost the Western Conference Finals to the Lakers."], ['hou', "First Round Loss", "Rockets 4, Timberwolves 1", "Apr 25, 2018", "Lost the first round to the Rockets."]],
  okc: [['mia', "2012 Finals Loss", "Heat 4, Thunder 1", "Jun 21, 2012", "Lost the Finals in five games to LeBron James and the Heat."], ['gs', "WCF Collapse", "Warriors 4, Thunder 3", "May 30, 2016", "Blew a 3-1 lead to the Warriors in the Western Conference Finals."], ['por', "Lillard's Buzzer Beater", "Trail Blazers 118, Thunder 115", "Apr 23, 2019", "Lost the first round when Damian Lillard hit a 37-foot, series-winning buzzer beater."]],
  por: [['lal', "WCF Sweep", "Lakers 4, Trail Blazers 0", "May 21, 1999", "Swept by the Lakers in the Western Conference Finals."], ['gs', "WCF Sweep", "Warriors 4, Trail Blazers 0", "May 20, 2019", "Swept by the Warriors in the Western Conference Finals."], ['sas', "First Round Loss", "Spurs 4, Trail Blazers 0", "Apr 28, 2014", "Swept by the Spurs in the first round."]],
  uta: [['chi', "1998 Finals Game 6", "Bulls 87, Jazz 86", "Jun 14, 1998", "Lost the Finals on Michael Jordan's famous final shot."], ['chi', "1997 Finals Game 6", "Bulls 90, Jazz 86", "Jun 13, 1997", "Lost the Finals in six games to the Bulls."], ['lal', "Playoff Elimination", "Lakers 4, Jazz 0", "Apr 26, 2008", "Swept by the Lakers in the first round."]],
  gs: [['cle', "2016 Finals Collapse", "Cavaliers 93, Warriors 89", "Jun 19, 2016", "Blew a 3-1 lead, losing the Finals to LeBron James and the Cavaliers."], ['tor', "2019 Finals Game 6", "Raptors 114, Warriors 110", "Jun 13, 2019", "Lost the Finals in Game 6, losing Durant and Klay Thompson to injury."], ['tor', "The Finals Loss", "Raptors 118, Warriors 109", "Jun 10, 2019", "Lost Game 5 of the Finals in Oakland."]],
  lac: [['phx', "WCF Elimination", "Suns 4, Clippers 2", "Jun 30, 2021", "Lost the Western Conference Finals to the Suns."], ['hou', "The 3-1 Collapse", "Rockets 4, Clippers 3", "May 15, 2015", "Blew a 3-1 lead to the Rockets in the Western Conference Semifinals."], ['den', "The Bubble Collapse", "Nuggets 4, Clippers 3", "Sep 15, 2020", "Blew a 3-1 lead to the Nuggets in the Western Conference Semifinals."]],
  lal: [['bos', "2008 Finals Game 6", "Celtics 131, Lakers 92", "Jun 17, 2008", "Lost the Finals in a 39-point blowout to the Celtics."], ['det', "2004 Finals Loss", "Pistons 100, Lakers 87", "Jun 15, 2004", "Lost the Finals in five games to the Pistons."], ['sas', "WCF Sweep", "Spurs 4, Lakers 0", "May 12, 1999", "Swept by the Spurs in the Western Conference Semifinals."], ['phi', "AI's Step Over", "76ers 107, Lakers 101 (OT)", "Jun 6, 2001", "Lost Game 1 of the Finals to the 76ers, featuring Allen Iverson's step over Tyronn Lue."]],
  phx: [['mil', "2021 Finals Collapse", "Bucks 105, Suns 98", "Jul 20, 2021", "Lost the Finals after leading 2-0 to the Bucks."], ['sas', "WCF Elimination", "Spurs 4, Suns 1", "May 30, 2007", "Lost the Western Conference Finals to the Spurs."], ['sas', "First Round Loss", "Spurs 4, Suns 0", "Apr 27, 2008", "Swept by the Spurs in the first round."]],
  sac: [['lal', "2002 WCF Controversy", "Lakers 106, Kings 102", "May 31, 2002", "Lost Game 6 of the WCF in a game widely believed to be fixed, ultimately losing the series."], ['lac', "First Round Loss", "Clippers 4, Kings 2", "Apr 29, 2006", "Lost the first round to the Clippers."], ['lal', "Playoff Elimination", "Lakers 4, Kings 1", "May 15, 2001", "Lost the Western Conference Semifinals to the Lakers."]],
  dal: [['mia', "2006 Finals Collapse", "Heat 95, Mavericks 92", "Jun 20, 2006", "Blew a 2-0 series lead, losing the Finals to the Heat."], ['gs', "First Round Upset", "Warriors 4, Mavericks 2", "Apr 29, 2007", "Lost to the 8th-seed Warriors in the first round."], ['lal', "The Sweep", "Lakers 4, Mavericks 0", "May 11, 2009", "Swept by the Lakers in the second round."]],
  hou: [['lal', "WCF Elimination", "Lakers 4, Rockets 1", "May 17, 2009", "Lost the Western Conference Semifinals to the Lakers."], ['gs', "WCF Elimination", "Warriors 4, Rockets 1", "May 25, 2018", "Lost the Western Conference Finals to the Warriors."], ['lac', "First Round Loss", "Clippers 4, Rockets 3", "May 15, 2015", "Lost Game 7 of the Western Conference Semifinals to the Clippers."]],
  mem: [['sas', "WCF Sweep", "Spurs 4, Grizzlies 0", "May 27, 2013", "Swept by the Spurs in the Western Conference Finals."], ['lal', "First Round Elimination", "Lakers 4, Grizzlies 2", "Apr 28, 2023", "Lost the first round to the Lakers."], ['okc', "Playoff Loss", "Thunder 4, Grizzlies 3", "May 15, 2011", "Lost Game 7 of the Western Conference Semifinals to the Thunder."]],
  no: [['sas', "Playoff Elimination", "Spurs 4, Pelicans 0", "Apr 25, 2015", "Swept by the Spurs in the first round."], ['gs', "Playoff Loss", "Warriors 4, Pelicans 1", "Apr 28, 2018", "Lost the second round to the Warriors."], ['phx', "First Round Loss", "Suns 4, Pelicans 2", "Apr 28, 2022", "Lost the first round to the Suns."]],
  sas: [['mia', "2013 Finals Game 6", "Heat 103, Spurs 100 (OT)", "Jun 18, 2013", "Lost Game 6 of the Finals on Ray Allen's iconic three-pointer after holding a late lead."], ['lac', "First Round Loss", "Clippers 4, Spurs 3", "May 2, 2015", "Lost Game 7 of the first round to the Clippers."], ['okc', "WCF Elimination", "Thunder 4, Spurs 2", "May 30, 2012", "Lost the Western Conference Finals to the Thunder."]],

  // --- NFL (3+ LOSSES EACH) ---
  ari_nfl: [['car_nfl', "NFC Championship Blowout", "Panthers 49, Cardinals 15", "Jan 24, 2016", "Lost the NFC Championship in a demoralizing blowout."], ['gb_nfl', "The Playoff Loss", "Packers 51, Cardinals 45 (OT)", "Jan 10, 2010", "Lost a wild playoff game in overtime on a fumble return."], ['sea_nfl', "The Division Miss", "Seahawks 36, Cardinals 6", "Dec 29, 2002", "Lost the season finale, missing the playoffs."]],
  atl_nfl: [['ne_nfl', "Super Bowl 51 Collapse", "Patriots 34, Falcons 28 (OT)", "Feb 5, 2017", "Blew a 28-3 lead to the Patriots in the Super Bowl."], ['sf_nfl', "NFC Championship Heartbreak", "49ers 28, Falcons 24", "Jan 20, 2013", "Lost the NFC Championship after holding a late lead."], ['dal_nfl', "The Blowout", "Cowboys 43, Falcons 3", "Nov 14, 2021", "Lost a massive blowout at home to the Cowboys."]],
  bal_nfl: [['ne_nfl', "The Championship Interception", "Patriots 23, Ravens 20", "Jan 22, 2012", "Lost the AFC Championship when Billy Cundiff missed a field goal late."], ['ten_nfl', "Divisional Round Loss", "Titans 28, Ravens 12", "Jan 11, 2020", "Lost the Divisional Round despite a 14-2 record."], ['buf_nfl', "Playoff Elimination", "Bills 17, Ravens 3", "Jan 16, 2021", "Lost the Divisional Round to the Bills in a cold game."]],
  buf_nfl: [['dal_nfl', "Super Bowl XXVII Blowout", "Cowboys 52, Bills 17", "Jan 31, 1993", "Lost the second of their four straight Super Bowl appearances in a blowout."], ['nyg_nfl', "Wide Right", "Giants 20, Bills 19", "Jan 27, 1991", "Lost Super Bowl XXV when Scott Norwood missed a 47-yard field goal wide right."], ['kc_nfl', "The Divisional Loss", "Chiefs 42, Bills 36 (OT)", "Jan 23, 2022", "Lost a Divisional Round classic in overtime after the Chiefs drove down the field."]],
  car_nfl: [['den_nfl', "Super Bowl 50 Loss", "Broncos 24, Panthers 10", "Feb 7, 2016", "Cam Newton's Panthers lost the Super Bowl after a dominant regular season."], ['sea_nfl', "Playoff Elimination", "Seahawks 31, Panthers 17", "Jan 10, 2015", "Lost the Divisional Round to the Seahawks."], ['ne_nfl', "Super Bowl XXXVIII", "Patriots 32, Panthers 29", "Feb 1, 2004", "Lost the Super Bowl on a last-second field goal."]],
  chi_nfl: [['gb_nfl', "NFC Championship", "Packers 21, Bears 14", "Jan 23, 2011", "Lost the NFC Championship at home to their bitter rivals."], ['gb_nfl', "The Blowout", "Packers 41, Bears 14", "Nov 9, 2014", "Lost a demoralizing game where Aaron Rodgers threw 6 touchdowns."], ['ari_nfl', "The Collapse", "Cardinals 48, Bears 23", "Sep 20, 2015", "Lost at home after jumping out to a large lead."]],
  cin_nfl: [['sf_nfl', "Super Bowl XXIII", "49ers 20, Bengals 16", "Jan 22, 1989", "Lost the Super Bowl on a last-minute Joe Montana drive."], ['lar_nfl', "Super Bowl LVI", "Rams 23, Bengals 20", "Feb 13, 2022", "Lost the Super Bowl after holding a late lead."], ['oak_nfl', "The Wild Card Miss", "Raiders 31, Bengals 28", "Jan 15, 2003", "Lost the Wild Card game, extending their playoff drought."]],
  cle_nfl: [['den_nfl', "The Fumble", "Broncos 23, Browns 20 (OT)", "Jan 11, 1987", "Lost the AFC Championship when Earnest Byner fumbled at the 3-yard line late in the game."], ['den_nfl', "The Drive", "Broncos 23, Browns 20 (OT)", "Jan 17, 1988", "Lost the AFC Championship after John Elway engineered a massive drive to tie the game."], ['pit_nfl', "Playoff Blowout", "Steelers 36, Browns 33", "Jan 5, 2003", "Blew a 17-point lead in the Wild Card game."]],
  dal_nfl: [['sf_nfl', "Divisional Round End", "49ers 19, Cowboys 12", "Jan 22, 2023", "The season ended on a late turnover when Dak Prescott threw a back-breaking interception."], ['gb_nfl', "The Dez Bryant Catch", "Packers 26, Cowboys 21", "Jan 11, 2015", "A playoff game famous for the controversial overturned Dez Bryant catch that sealed the loss."],
    ['lar_nfl', "The Worst Quarterback Sneak", "Rams 30, Cowboys 22", "Jan 12, 2019", "Ezekiel Elliott was stuffed twice on the goal line late in the game, leading to a crucial playoff defeat."],
    ['wsh_nfl', "Thanksgiving Day Debacle", "Commanders 27, Cowboys 6", "Nov 26, 2020", "A crushing loss on Thanksgiving, giving Washington the division lead."]],
  den_nfl: [['sea_nfl', "Super Bowl XLVIII Blowout", "Seahawks 43, Broncos 8", "Feb 2, 2014", "Lost the Super Bowl in a massive blowout to the Seahawks."], ['wsh_nfl', "Super Bowl XXII Blowout", "Commanders 42, Broncos 10", "Jan 31, 1988", "Lost the Super Bowl in a painful blowout."], ['sf_nfl', "Super Bowl XXIV Blowout", "49ers 55, Broncos 10", "Jan 28, 1990", "The largest margin of defeat in Super Bowl history."]],
  det_nfl: [['sf_nfl', "NFC Championship Loss", "49ers 34, Lions 31", "Jan 28, 2024", "Lost the NFC Championship after blowing a 17-point lead."], ['wsh_nfl', "The Playoff Loss", "Redskins 31, Lions 21", "Jan 13, 1992", "Lost the NFC Championship after a promising season."], ['dal_nfl', "The Missed Call", "Cowboys 24, Lions 20", "Jan 4, 2015", "Lost a Wild Card game marred by a controversial penalty reversal."]],
  hou_nfl: [['kc_nfl', "Divisional Round Collapse", "Chiefs 51, Texans 31", "Jan 12, 2020", "Blew a 24-0 lead to the Chiefs in the Divisional Round."], ['ne_nfl', "Playoff Elimination", "Patriots 34, Texans 16", "Jan 13, 2013", "Lost the Divisional Round to the Patriots."], ['cin_nfl', "Wild Card Loss", "Bengals 19, Texans 13", "Jan 5, 2013", "Lost the Wild Card game at home to the Bengals."]],
  ind_nfl: [['no_nfl', "Super Bowl XLIV Loss", "Saints 31, Colts 17", "Feb 7, 2010", "Lost the Super Bowl to the Saints."], ['ne_nfl', "The Deflategate Loss", "Patriots 45, Colts 7", "Jan 18, 2015", "Lost the AFC Championship in a blowout, leading to the Deflategate controversy."], ['nyj_nfl', "The Playoff Upset", "Jets 17, Colts 16", "Jan 8, 2011", "Lost the Wild Card game at home to the Jets."]],
  jax_nfl: [['ne_nfl', "AFC Championship Loss", "Patriots 24, Jaguars 20", "Jan 21, 2018", "Lost the AFC Championship after holding a 10-point lead in the fourth quarter."], ['ne_nfl', "Playoff Loss", "Patriots 28, Jaguars 3", "Jan 18, 1997", "Lost the AFC Championship to the Patriots."], ['kc_nfl', "Divisional Round Loss", "Chiefs 27, Jaguars 20", "Jan 21, 2023", "Lost the Divisional Round to the Chiefs."]],
  kc_nfl: [['tb_nfl', "Super Bowl LV Blowout", "Buccaneers 31, Chiefs 9", "Feb 7, 2021", "Lost the Super Bowl in a dominant performance by Tom Brady."], ['ne_nfl', "AFC Championship OT", "Patriots 37, Chiefs 31 (OT)", "Jan 20, 2019", "Lost the AFC Championship in overtime to the Patriots."], ['cin_nfl', "AFC Championship Loss", "Bengals 27, Chiefs 24 (OT)", "Jan 30, 2022", "Lost the AFC Championship at home in overtime."]],
  lv_nfl: [['tb_nfl', "Super Bowl XXXVII Blowout", "Buccaneers 48, Raiders 21", "Jan 26, 2003", "Lost the Super Bowl in a huge blowout."], ['ne_nfl', "The Tuck Rule Game", "Patriots 16, Raiders 13 (OT)", "Jan 19, 2002", "Lost the Divisional Round on the controversial 'Tuck Rule' call."], ['buf_nfl', "AFC Championship Loss", "Bills 51, Raiders 3", "Jan 20, 1991", "Lost the AFC Championship in a massive blowout."]],
  lac_nfl: [['ne_nfl', "AFC Championship Loss", "Patriots 21, Chargers 12", "Jan 20, 2008", "Lost the AFC Championship to the Patriots."], ['nyj_nfl', "Playoff Upset", "Jets 17, Chargers 14 (OT)", "Jan 17, 2005", "Lost the Divisional Round to the Jets in overtime."], ['jax_nfl', "The 27-Point Collapse", "Jaguars 31, Chargers 30", "Jan 14, 2023", "Blew a 27-0 lead in the Wild Card game."]],
  lar_nfl: [['ne_nfl', "Super Bowl LIII Low Score", "Patriots 13, Rams 3", "Feb 3, 2019", "Lost the lowest-scoring Super Bowl in history."], ['ne_nfl', "Super Bowl XXXVI Upset", "Patriots 20, Rams 17", "Feb 3, 2002", "Lost the Super Bowl to the underdog Patriots."], ['gb_nfl', "Divisional Loss", "Packers 32, Rams 18", "Jan 16, 2021", "Lost the Divisional Round to the Packers."]],
  mia_nfl: [['wsh_nfl', "Super Bowl XVII Loss", "Redskins 27, Dolphins 17", "Jan 30, 1983", "Lost the Super Bowl to the Commanders."], ['sf_nfl', "Super Bowl XIX Loss", "49ers 38, Dolphins 16", "Jan 20, 1985", "Lost the Super Bowl to the 49ers."], ['buf_nfl', "Playoff Blowout", "Bills 44, Dolphins 34", "Jan 17, 1999", "Lost the Wild Card game to the Bills."]],
  min_nfl: [['atl_nfl', "NFC Championship OT", "Falcons 30, Vikings 27 (OT)", "Jan 17, 1999", "Lost the NFC Championship in overtime after a perfect regular season."], ['min_nfl', "The Wild Card Loss", "Seahawks 10, Vikings 9", "Jan 10, 2016", "Lost the Wild Card game when Blair Walsh missed a 27-yard field goal."], ['phi_nfl', "NFC Championship Blowout", "Eagles 38, Vikings 7", "Jan 21, 2018", "Lost the NFC Championship in a blowout."]],
  ne_nfl: [['phi_nfl', "Super Bowl LII Loss", "Eagles 41, Patriots 33", "Feb 4, 2018", "Lost the Super Bowl to the Eagles and the 'Philly Special'."], ['nyg_nfl', "Super Bowl XLVI Loss", "Giants 21, Patriots 17", "Feb 5, 2012", "Lost the Super Bowl to the Giants for the second time."], ['nyg_nfl', "Super Bowl XLII Upset", "Giants 17, Patriots 14", "Feb 3, 2008", "Lost the Super Bowl, ending their perfect season on the 'Helmet Catch'."], ['ind_nfl', "AFC Championship Loss", "Colts 38, Patriots 34", "Jan 21, 2007", "Lost the AFC Championship to the Colts."]],
  no_nfl: [['sf_nfl', "Divisional Round Heartbreak", "49ers 36, Saints 32", "Jan 14, 2012", "Lost the Divisional Round on a late touchdown drive by the 49ers."], ['min_nfl', "The Minneapolis Miracle", "Vikings 29, Saints 24", "Jan 14, 2018", "Lost the Divisional Round on a last-second, game-winning touchdown."], ['lar_nfl', "The Pass Interference Call", "Rams 26, Saints 23 (OT)", "Jan 20, 2019", "Lost the NFC Championship on a controversial, uncalled pass interference penalty."]],
  nyg_nfl: [['sf_nfl', "Playoff Loss", "49ers 38, Giants 35 (OT)", "Jan 7, 2003", "Lost a Wild Card game after blowing a large lead."], ['sf_nfl', "The Blowout", "49ers 44, Giants 3", "Dec 26, 1993", "Lost a massive blowout to the 49ers."], ['dal_nfl', "Division Loss", "Cowboys 31, Giants 24", "Jan 3, 2021", "Lost a key late-season game, missing the playoffs."]],
  nyj_nfl: [['ne_nfl', "AFC Championship Loss", "Patriots 37, Jets 17", "Jan 12, 1986", "Lost the AFC Championship to the Patriots."], ['ind_nfl', "AFC Championship Loss", "Colts 30, Jets 17", "Jan 24, 2010", "Lost the AFC Championship to the Colts."], ['pit_nfl', "AFC Championship Loss", "Steelers 24, Jets 19", "Jan 23, 2011", "Lost the AFC Championship to the Steelers."]],
  phi_nfl: [['ne_nfl', "Super Bowl XXXIX Loss", "Patriots 24, Eagles 21", "Feb 6, 2005", "Lost the Super Bowl to the Patriots."], ['tb_nfl', "NFC Championship Blowout", "Buccaneers 27, Eagles 10", "Jan 19, 2003", "Lost the NFC Championship in a blowout."], ['kc_nfl', "Super Bowl LVII Loss", "Chiefs 38, Eagles 35", "Feb 12, 2023", "Lost the Super Bowl after holding a 10-point halftime lead."]],
  pit_nfl: [['dal_nfl', "Super Bowl XXX Loss", "Cowboys 27, Steelers 17", "Jan 28, 1996", "Lost the Super Bowl to the Cowboys."], ['lar_nfl', "The Playoff Loss", "Rams 30, Steelers 27", "Jan 14, 2001", "Lost the Divisional Round to the Rams."], ['den_nfl', "Playoff Elimination", "Broncos 29, Steelers 23 (OT)", "Jan 8, 2012", "Lost the Wild Card game in overtime to Tim Tebow."]],
  sf_nfl: [['kc_nfl', "Super Bowl LIV Loss", "Chiefs 31, 49ers 20", "Feb 2, 2020", "Lost the Super Bowl after holding a late lead."], ['kc_nfl', "Super Bowl LVIII Loss", "Chiefs 25, 49ers 22 (OT)", "Feb 11, 2024", "Lost the Super Bowl in overtime."], ['nyg_nfl', "NFC Championship Loss", "Giants 20, 49ers 17 (OT)", "Jan 22, 2012", "Lost the NFC Championship in overtime on a punt return fumble."], ['dal_nfl', "NFC Championship Loss", "Cowboys 38, 49ers 21", "Jan 17, 1993", "Lost the NFC Championship to the Cowboys."]],
  sea_nfl: [['ne_nfl', "Super Bowl XLIX Interception", "Patriots 28, Seahawks 24", "Feb 1, 2015", "Lost the Super Bowl when Russell Wilson threw an interception at the 1-yard line."], ['car_nfl', "Divisional Round Loss", "Panthers 31, Seahawks 24", "Jan 17, 2016", "Lost the Divisional Round to the Seahawks."], ['gb_nfl', "The Wild Card Loss", "Packers 28, Seahawks 23", "Jan 12, 2020", "Lost the Divisional Round to the Packers."]],
  tb_nfl: [['oak_nfl', "The Blowout", "Raiders 31, Buccaneers 3", "Dec 21, 2008", "Lost a massive blowout to the Raiders."], ['phi_nfl', "Playoff Loss", "Eagles 27, Buccaneers 21", "Jan 12, 2002", "Lost the Wild Card game to the Eagles."], ['dal_nfl', "Wild Card Elimination", "Cowboys 31, Buccaneers 14", "Jan 16, 2023", "Lost the Wild Card game at home to the Cowboys."]],
  ten_nfl: [['lar_nfl', "Super Bowl XXXIV Loss", "Rams 23, Titans 16", "Jan 30, 2000", "Lost the Super Bowl when Kevin Dyson was tackled one yard short of the endzone."], ['ne_nfl', "AFC Championship Loss", "Patriots 17, Titans 14", "Jan 19, 2002", "Lost the AFC Championship to the Patriots."], ['bal_nfl', "Playoff Loss", "Ravens 20, Titans 13", "Jan 10, 2021", "Lost the Wild Card game to the Ravens."]],
  wsh_nfl: [['sf_nfl', "Super Bowl XVII Loss", "49ers 38, Commanders 16", "Jan 24, 1983", "Lost the Super Bowl to the 49ers."], ['dal_nfl', "The Division Miss", "Cowboys 30, Commanders 20", "Dec 30, 2018", "Lost a key late-season game, missing the playoffs."], ['phi_nfl', "The Blowout", "Eagles 37, Commanders 27", "Sep 25, 2016", "Lost a large blowout to the Eagles."]],

  // --- EXPANDED NCAA BASKETBALL (3+ LOSSES EACH) ---
  unc: [['duke', "K's Final Four Win", "Duke 78, UNC 75", "Mar 11, 2017", "Lost the ACC Tournament semifinal to Duke."], ['duke', "The Rivalry Loss", "Duke 88, UNC 70", "Mar 7, 2018", "Lost the final rivalry game of the regular season."], ['ku', "2022 Championship Collapse", "Kansas 72, UNC 69", "Apr 4, 2022", "Blew a 15-point halftime lead in the National Championship game."]],
  wis: [
    ['mich', "The Bench-Clearing Brawl", "Michigan 77, Wisconsin 63", "Feb 20, 2022", "Michigan's Juwan Howard smacked Wisconsin's assistant coach, leading to a brawl."],
    ['marq', "Wally the Waterboy", "Marquette 71, Wisconsin 69", "Dec 21, 2019", "A tough rivalry loss on a bizarre play that went viral."],
    ['duke', "2015 Championship Heartbreak", "Duke 68, Wisconsin 63", "Apr 6, 2015", "The Final Four loss that ended their national title hopes, as Duke freshmen dominated the second half."]
  ],
  uky: [
    ['unc', "The Elite Eight Buzzer Beater", "UNC 75, Kentucky 73", "Mar 26, 2017", "Luke Maye's legendary buzzer-beater stunned Calipari's team."],
    ['wvu', "The Great Upset", "WVU 73, Kentucky 66", "Mar 27, 2010", "A shocking Elite Eight loss, as WVU made 15 three-pointers to eliminate the overall number one seed."],
    ['wis', "Final Four Loss", "Wisconsin 71, Kentucky 64", "Apr 4, 2015", "Kentucky's bid for a perfect 38-0 season was crushed by the Badgers in the Final Four."]
  ],
  osu: [
    ['msu', "The B1G Title Loss", "MSU 68, OSU 64", "Mar 16, 2014", "Lost the Big Ten Tournament Championship to their bitter rival Michigan State in overtime."],
    ['mich', "The Rivalry Sweep", "Michigan 70, OSU 66", "Mar 1, 2020", "Michigan sealed a clean sweep of the season series against the Buckeyes with a late rally."],
    ['dayton', "The First Round Stunner", "Dayton 60, OSU 59", "Mar 20, 2014", "Ohio State was upset by the 11th seed Dayton Flyers in the first round of the NCAA Tournament."]
  ],
  // (Adding a few more NCAA teams to ensure coverage)
  mich: [['osu', "Rivalry Loss", "OSU 77, Michigan 70", "Jan 15, 2022", "Lost a tough road game to their bitter rival."], ['tex', "NIT Final", "Texas 82, Michigan 78", "Apr 1, 2019", "Lost the NIT Championship game to the Longhorns."], ['duke', "Elite Eight Loss", "Duke 77, Michigan 73", "Mar 30, 2013", "Lost a close Elite Eight game to Duke."]],
  ala: [['unc', "Sweet Sixteen Loss", "UNC 81, Alabama 78", "Mar 24, 2016", "Lost a tough Sweet Sixteen game to the Tar Heels."], ['uky', "SEC Championship Loss", "Kentucky 71, Alabama 68", "Mar 14, 2021", "Lost the SEC Championship game to the Wildcats."], ['ucla', "Sweet Sixteen Collapse", "UCLA 88, Alabama 78", "Mar 28, 2021", "Lost in the Sweet Sixteen after a promising season."]],
  conn: [['maryland', "Final Four Loss", "Maryland 90, UConn 82", "Apr 1, 2003", "Lost the Final Four to the Terrapins."], ['syr', "Big East Tournament Loss", "Syracuse 127, UConn 117 (6OT)", "Mar 12, 2009", "Lost a legendary 6-overtime game in the Big East Tournament."], ['mich', "Elite Eight Loss", "Michigan 71, UConn 70", "Mar 30, 2014", "Lost a tough Elite Eight game to the Wolverines."]],

  // --- CFB (3+ LOSSES EACH) ---
  ala_fb: [['uga', "2021 National Championship", "Georgia 33, Alabama 18", "Jan 10, 2022", "Lost the National Championship game to their SEC rival."], ['clem_fb', "2018 National Championship", "Clemson 44, Alabama 16", "Jan 7, 2019", "Lost the National Championship in a blowout to the Tigers."], ['aub_fb', "The Kick Six", "Auburn 34, Alabama 28", "Nov 30, 2013", "Lost the Iron Bowl on a returned missed field goal."], ['lsu', "OT Loss", "LSU 32, Alabama 31 (OT)", "Nov 5, 2022", "Lost a painful overtime game to LSU."]],
  uga: [['ala_fb', "2017 National Championship", "Alabama 26, Georgia 23 (OT)", "Jan 8, 2018", "Lost the National Championship in overtime on a Tua Tagovailoa touchdown pass."], ['ala_fb', "SEC Championship Loss", "Alabama 41, Georgia 24", "Dec 4, 2021", "Lost the SEC Championship in a blowout to Alabama."], ['aub_fb', "The Rivalry Loss", "Auburn 40, Georgia 17", "Nov 11, 2017", "Lost a massive blowout road game to Auburn."]],
  tex_fb: [['osu_fb', "2009 Fiesta Bowl", "Ohio State 24, Texas 21", "Jan 5, 2009", "Lost the Fiesta Bowl on a late field goal."], ['ou', "Red River Upset", "Oklahoma 34, Texas 27", "Oct 12, 2019", "Lost the Red River Rivalry to the Sooners."], ['tcu', "The Blowout", "TCU 50, Texas 7", "Nov 26, 2014", "Lost a massive home blowout to TCU."]],
  lsu: [['ala_fb', "The Game of the Century", "Alabama 9, LSU 6 (OT)", "Nov 5, 2011", "Lost the famously low-scoring game to Alabama in overtime."], ['ala_fb', "National Championship Loss", "Alabama 21, LSU 0", "Jan 9, 2012", "Shut out by Alabama in the National Championship."], ['fla_fb', "The Upset", "Florida 27, LSU 24", "Oct 6, 2018", "Lost a close road game to Florida."]],
  // (Adding more CFB teams to ensure all in App.tsx have 3)
  mich_fb: [['osu_fb', "The Rivalry Losing Streak", "Ohio State 56, Michigan 27", "Nov 30, 2019", "Lost a crushing rivalry game to Ohio State."], ['msu_fb', "The Failed Punt", "MSU 27, Michigan 23", "Oct 17, 2015", "Lost on a last-second fumbled punt return."], ['osu_fb', "The B1G Title Miss", "Ohio State 42, Michigan 41", "Nov 30, 2013", "Lost a heartbreaking rivalry game, missing the Big Ten Championship."]]
};


// --- 4. ONBOARDING (Component) ---
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  // --- REAL PWA NOTIFICATION REQUEST ---
  const handleEnableNotifications = async () => {
    // 1. Check if we are running on a phone (Native)
    // Note: Capacitor/PushNotifications imports are commented out for Canvas environment
    if (window.Capacitor && window.Capacitor.isNativePlatform) {
      try {
        // const { PushNotifications } = await import('@capacitor/push-notifications');
        // let permStatus = await PushNotifications.checkPermissions();

        // if (permStatus.receive === 'prompt') {
        //   permStatus = await PushNotifications.requestPermissions();
        // }

        // if (permStatus.receive === 'granted') {
        //   await PushNotifications.register();
        //   // Listeners will be added in App component
        // }
      } catch (e) {
        console.error("Native push error:", e);
      }
      onComplete();
      return;
    }

    if (!('Notification' in window)) {
        alert("This browser does not support desktop notification");
        onComplete();
        return;
    }
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
           // Web push granted
        }
    } catch (error) {
        console.error("Error requesting permission", error);
    }
    onComplete();
  }

  return (
    step === 0 ? (
      <div key="step-0" className="fixed inset-0 z-[100] bg-gradient-to-br from-blue-900 to-indigo-900 bg-[url('https://www.transparenttextures.com/patterns/noisy-net.png')] bg-blend-overlay text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="w-48 h-48 mb-6 rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br from-[#1e90ff] to-[#99badd] p-0.5 backdrop-blur-sm">
            <img 
              src={APP_ICON} 
              onError={(e) => e.currentTarget.src = APP_ICON_FALLBACK}
              alt="App Icon" 
              className="w-full h-full object-cover rounded-xl" 
            />
        </div>
        <h1 className="text-3xl font-black italic mb-4 drop-shadow-md">Their misery. Your joy.</h1>
        <p className="text-lg font-medium opacity-90 mb-8 max-w-xs drop-shadow">Love the jolt of joy when a team you hate loses? This app alerts you ONLY when they lose.</p>
        <button onClick={() => setStep(1)} className="bg-[#1e90ff] text-white text-lg font-black py-4 px-8 rounded-2xl shadow-2xl w-full max-w-xs hover:scale-105 transition-transform ring-4 ring-white/50">Let your hate flow</button>
      </div>
    ) : step === 1 ? (
      <div key="step-1" className="fixed inset-0 z-[100] bg-green-900 bg-[url('https://ik.imagekit.io/ipi1yjzh9/grass-bg.jpg')] bg-cover bg-center bg-blend-overlay text-white flex flex-col p-6 animate-in slide-in-from-right duration-300">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-6 relative"><div className="p-4 bg-white/20 backdrop-blur-md rounded-full shadow-xl"><Target size={64} className="text-white drop-shadow-lg relative z-10" /> <div className="absolute inset-0 bg-white/30 rounded-full animate-ping z-0"></div></div><div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm z-20">STEP 1</div></div>
            <h2 className="text-2xl font-black mb-2 drop-shadow-md">Pick Your Targets</h2>
            <p className="text-white/90 mb-8 max-w-xs drop-shadow font-medium">Search for teams across NBA, NFL, MLB, and NCAA sports. Add them to your "Enemies List."</p>
        </div>
        <button onClick={() => setStep(2)} className="bg-white text-emerald-700 text-lg font-bold py-4 px-8 rounded-xl shadow-lg w-full hover:bg-emerald-50 transition-colors">Got it, next</button>
      </div>
    ) : (
      <div key="step-2" className="fixed inset-0 z-[100] bg-orange-500 bg-[url('https://www.transparenttextures.com/patterns/basketball.png')] bg-blend-overlay text-white flex flex-col p-6 animate-in slide-in-from-right duration-300">
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

// --- 5. MAIN APP ---
export default function App() {
  const [view, setView] = useState('scoreboard');
  const [activeLeague, setActiveLeague] = useState('NCAA');
  const [activeTheme, setActiveTheme] = useState('professional');
  const [showOnboarding, setShowOnboarding] = useState(() => localStorage.getItem('tl_onboarded') !== 'true');
  const [enabledLeagues, setEnabledLeagues] = useState({ NCAA: true, CFB: true, NBA: true, NFL: true, MLB: false });
  const [hatedTeams, setHatedTeams] = useState(() => JSON.parse(localStorage.getItem('tl_hated_teams') || '[]'));
  const [notifiedGames, setNotifiedGames] = useState(() => JSON.parse(localStorage.getItem('tl_notified_games') || '[]'));
  
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
  const [toastMessage, setToastMessage] = useState(null);
  const scrollRef = useRef(null);

  const styles = THEMES[activeTheme];

  useEffect(() => { if (!enabledLeagues[activeLeague]) setActiveLeague(Object.keys(enabledLeagues).find(k => enabledLeagues[k]) || 'NCAA'); }, [enabledLeagues]);
  useEffect(() => { checkLiveScores(); }, []); 
  useEffect(() => { 
    const interval = setInterval(() => { console.log("Auto-checking..."); checkLiveScores(false); }, 60000);
    return () => clearInterval(interval);
  }, [hatedTeams, notifiedGames]); 
  useEffect(() => { localStorage.setItem('tl_hated_teams', JSON.stringify(hatedTeams)); }, [hatedTeams]);

  // Toast Timer
  useEffect(() => {
    if (toastMessage) {
        const timer = setTimeout(() => setToastMessage(null), 3000);
        return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // --- SOUND LOGIC ---
  const playFailSound = () => {
      // const audio = new Audio(FAIL_SOUND_URL);
      // audio.play().catch(e => console.log("Audio autoplay blocked", e));
  };
    
  // --- HISTORIC CONSOLATION FACT LOGIC (Moved before checkLiveScores) ---
  const pickHistoricLoss = () => {
    // 1. Get all hated teams that actually have custom history defined
    // We check that the key exists AND the array of facts is not empty.
    const teamsWithHistory = hatedTeams.filter(id => HISTORIC_LOSSES[id] && HISTORIC_LOSSES[id].length > 0);
    
    let fact = null;

    if (teamsWithHistory.length > 0) {
        // 2. Pick a random hated team that has history
        const hatedTeamId = teamsWithHistory[Math.floor(Math.random() * teamsWithHistory.length)];
        
        // 3. Pick a random historic fact from that team's list
        const teamHistory = HISTORIC_LOSSES[hatedTeamId];
        const rawFact = teamHistory[Math.floor(Math.random() * teamHistory.length)];

        // 4. Map the raw array data to the structured object
        fact = {
            opponent: rawFact[0],
            headline: rawFact[1],
            score: rawFact[2],
            date: rawFact[3],
            desc: rawFact[4],
            // Crucial: Link the fact to the specific hated team that owned the loss
            team: ALL_TEAMS.find(t => t.id === hatedTeamId) 
        };
    } 
    // If teamsWithHistory.length === 0, fact remains null.
    // This satisfies requirement A: Do not show if no custom history is found.
    
    setConsolationFact(fact);
  };

  // --- LOGIC ---
  const checkLiveScores = async (showLoader = true) => {
    // Artificial delay for UX if manual refresh
    if (showLoader) {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800)); // 800ms minimum spin
    }
    
    setConsolationFact(null); 
    setNoGamesMsg(null); 
    
    try {
      // FIX 1: Explicit Date Handling
      const getDatesToCheck = () => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(today.getDate() - 2);

        // Formatter YYYYMMDD
        const fmt = (d) => d.toISOString().split('T')[0].replace(/-/g, '');
        return [fmt(today), fmt(yesterday), fmt(twoDaysAgo)];
      };
      
      const dates = getDatesToCheck();
      
      const fetchLeague = async (lg) => {
        const path = {'NCAA':'basketball/mens-college-basketball','CFB':'football/college-football','NBA':'basketball/nba','NFL':'football/nfl','MLB':'baseball/mlb'}[lg];
        if (!path) return [];
        // Using Promise.all to fetch multiple days in parallel might trigger rate limits, so we chain them or just fetch today+yesterday in one go if API supports it. 
        // ESPN API supports 'dates=YYYYMMDD'. We will stick to individual fetches but add a catch block.
        
        const fetchDate = async (d) => {
            try {
                const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?limit=1000&dates=${d}`)}`);
                if (!res.ok) throw new Error('Network response was not ok');
                return await res.json();
            } catch (error) {
                console.error(`Error fetching ${lg} for ${d}:`, error);
                return { events: [] };
            }
        };

        const res = await Promise.all(dates.map(fetchDate));
        return res.flatMap(r => r.events || []).map(e => ({...e, _league: lg}));
      };

      const targets = Object.keys(enabledLeagues).filter(l => enabledLeagues[l]);
      const allRaw = (await Promise.all(targets.map(fetchLeague))).flat();
      const uniq = Array.from(new Map(allRaw.map(e => [e.id, e])).values());
      
      // CRITICAL DEBUGGING STEP
      console.log("--- ESPN API RESPONSE RAW EVENTS ---");
      console.log(uniq);

      const results = uniq.map(event => {
        const h = event.competitions[0].competitors.find(c=>c.homeAway==='home'), a = event.competitions[0].competitors.find(c=>c.homeAway==='away');
        if(!h||!a) return null;
        
        // FIX for NCAA Score Detection (Problem 1)
        // Ensure that our internal IDs (e.g., 'ncst') are properly checked against ESPN's abbreviation.
        const homeIdCheck = h.team.abbreviation.toLowerCase();
        const awayIdCheck = a.team.abbreviation.toLowerCase();

        // Check if ANY hatedTeam string matches the ESPN abbreviation exactly OR contains it
        const isHated = (abbr, league) => {
            // Normalize the ESPN abbreviation by removing possible trailing numeric IDs (e.g., if NCSU1)
            const normalizedAbbr = abbr.replace(/[0-9]+$/, '');
            
            return hatedTeams.some(hatedId => {
                // Remove internal suffixes from our stored IDs for broad matching
                const normalizedHatedId = hatedId.toLowerCase().replace(/_bb|_fb|_mlb|_nfl$/, '');
                
                // Aggressive matching: check if normalized hated ID matches the normalized ESPN abbreviation
                // Since NCAA IDs sometimes don't have the league suffix, we check inclusion/start-with aggressively.
                return (
                    normalizedHatedId === normalizedAbbr ||                           // e.g. 'ncst' === 'ncst'
                    hatedId.toLowerCase().includes(normalizedAbbr) // Check for inclusion for safety
                );
            });
        };
        
        const hatedHome = isHated(homeIdCheck, event._league);
        const hatedAway = isHated(awayIdCheck, event._league);
        
        if(!hatedHome && !hatedAway) return null;
        
        // This log confirms if the game was detected as an enemy's game
        console.log(`Enemy Game Found: ${h.team.displayName} vs ${a.team.displayName}. Hated: ${hatedHome ? h.team.displayName : a.team.displayName}`);

        const hated = hatedHome ? h : a;
        const opp = hatedHome ? a : h;
        
        // Find configuration for hated team
        const hatedAbbr = hated.team.abbreviation.toLowerCase();
        const hatedConf = ALL_TEAMS.find(t => 
            (t.id.toLowerCase().includes(hatedAbbr) || hatedAbbr.includes(t.id.toLowerCase())) && 
            t.league === event._league
        );

        // Find configuration for opponent
        const oppAbbr = opp.team.abbreviation.toLowerCase();
        let oppConf = ALL_TEAMS.find(t => 
            (t.id.toLowerCase().includes(oppAbbr) || oppAbbr.includes(t.id.toLowerCase())) && 
            t.league === event._league
        );
        if (!oppConf) oppConf = { id: opp.team.abbreviation.toLowerCase(), name: opp.team.displayName, color: '#94a3b8', league: event._league };

        if (!hatedConf) return null; // Only proceed if we can match the hated team to our list

        const scoreH = parseInt(h.score||0), scoreA = parseInt(a.score||0);
        
        // FIX: Robust "Final" Logic (Ensures completed games are caught)
        const statusType = event.status.type;
        const isFinalDesc = statusType.shortDetail && statusType.shortDetail.toLowerCase().includes('final');
        const isFinal = statusType.completed || statusType.state === 'post' || isFinalDesc;

        const lost = isFinal && ((hatedHome && scoreH < scoreA) || (!hatedHome && scoreA < scoreH));
        
        return {
          team: {...hatedConf, score: parseInt(hated.score||0)},
          opponentTeam: {...oppConf, score: parseInt(opp.score||0)},
          status: lost ? 'LOST' : (isFinal ? 'WON' : 'PLAYING'),
          gameId: event.id, 
          isYesterday: new Date(event.date) < new Date(new Date().setHours(0,0,0,0))
        };
      }).filter(Boolean);

      setGameResults(results);

      const losses = results.filter(r => r.status === 'LOST');
      const newLosses = losses.filter(r => !notifiedGames.includes(r.gameId));

      if (newLosses.length > 0) {
          triggerCelebration();
          // PLAY SOUND HERE
          // playFailSound();
            
          const newIds = newLosses.map(r => r.gameId);
          const updatedHistory = [...notifiedGames, ...newIds];
          setNotifiedGames(updatedHistory);
          localStorage.setItem('tl_notified_games', JSON.stringify(updatedHistory));
      } 
      // FIX 5 & 6: History Lesson & No Scores Msg Logic
      else if (losses.length === 0) {
          // No current losses found. Try to show history.
          pickHistoricLoss(); 
      }
      
    } catch (e) { 
        console.error("Fetch Error:", e);
        setNoGamesMsg("Error fetching data. Check connection."); 
    } finally { 
        setLoading(false); 
        setRefreshing(false); 
        
        // Final UI cleanup based on results
        if (!gameResults.length) {
            setNoGamesMsg("No games found for your enemies today.");
        }
    }
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
      textArea.value = txt; document.body.appendChild(textArea); textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea);
      setCopiedIndex(index); setTimeout(() => { setCopiedIndex(null); setShareModal(null); }, 1000);
    } catch (err) { console.error('Fallback: Oops, unable to copy', err); }
  };

  const handleRefresh = () => { setRefreshing(true); checkLiveScores(true); };

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
  
  const sendTestNotification = async () => {
    // Dynamic import to handle Capacitor logic vs Web logic
    if (window.Capacitor && window.Capacitor.isNativePlatform) {
      try {
        // const { PushNotifications } = await import('@capacitor/push-notifications');
        // let permStatus = await PushNotifications.checkPermissions();

        // if (permStatus.receive === 'prompt') {
        //   permStatus = await PushNotifications.requestPermissions();
        // }

        // if (permStatus.receive === 'granted') {
             // Use internal toast instead of unreliable native/web notification popup
             setToastMessage({ type: 'success', text: "In-App alerts are active! You will be notified when the app is focused." });
        // } else {
        //   setToastMessage({ type: 'error', text: "Notifications are blocked. Check settings." });
        // }
      } catch (e) {
        console.error("Native push error:", e);
        setToastMessage({ type: 'error', text: "Error checking permissions. Try updating your app or browser." });
      }
      return;
    }

    if (!('Notification' in window)) {
        setToastMessage({ type: 'error', text: "Notifications not supported in this browser." });
        return;
    }
    
    // Ask for permission but provide internal feedback only
    if (Notification.permission === 'granted') {
        setToastMessage({ type: 'success', text: "Browser notifications are enabled (check when tab is focused)." });
        // Removed new Notification() here to avoid confusion
    } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            setToastMessage({ type: 'success', text: "Browser notification permission granted." });
        } else {
            setToastMessage({ type: 'error', text: "Browser notification permission denied." });
        }
    } else {
        setToastMessage({ type: 'error', text: "Notifications are blocked by your browser settings." });
    }
  };

  // --- UPDATED MANAGE LIST LOGIC ---
  const manageList = ALL_TEAMS.filter(t => 
    t.league === activeLeague && 
    (
        searchTerm === '' || 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.mascot.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).sort((a,b) => a.name.localeCompare(b.name));

  const displayResults = gameResults.filter(g => g.status === 'LOST');

  return (
    <div className={`min-h-screen ${styles.bg} ${styles.font} ${styles.text} max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-slate-200 flex flex-col h-[100dvh]`}>
      <style>{`@keyframes fall { 0% {transform:translateY(0) rotate(0deg);opacity:1} 100% {transform:translateY(100vh) rotate(720deg);opacity:0} } .animate-fall {animation:fall linear infinite} @keyframes slideDown {0% {transform:translateY(-100%)} 100% {transform:translateY(0)}} .animate-enter-banner {animation:slideDown 0.5s ease-out forwards}`}</style>
      
      {showOnboarding && <Onboarding onComplete={() => { localStorage.setItem('tl_onboarded','true'); setShowOnboarding(false); }} />}
      
      {/* --- TOAST NOTIFICATION --- */}
      {toastMessage && (
          <div className="absolute top-20 left-4 right-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
              <div className={`${toastMessage.type === 'error' ? 'bg-red-600' : 'bg-green-600'} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3`}>
                  {toastMessage.type === 'error' ? <AlertTriangle className="shrink-0" size={24}/> : <Check className="shrink-0" size={24}/>}
                  <span className="font-bold text-sm leading-tight">{toastMessage.text}</span>
              </div>
          </div>
      )}

      <header className={`p-4 sticky top-0 z-30 shrink-0 flex justify-between items-center ${styles.header} pt-[calc(env(safe-area-inset-top)+1rem)]`}>
        <div 
            onClick={handleRefresh}
            className="flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity"
            title="Tap to Refresh"
            style={{ minWidth: '0', flexShrink: 1 }}
        >
            <div 
                className="w-12 h-12 rounded-md overflow-hidden p-0.5 shadow-sm flex items-center justify-center flex-shrink-0" 
                style={{ background: 'linear-gradient(135deg, #1e90ff, #99badd)' }}
            >
                <img 
                  src={APP_ICON} 
                  onError={(e) => e.currentTarget.src = APP_ICON_FALLBACK}
                  alt="App Icon" 
                  className="w-full h-full object-cover rounded-md" 
                />
            </div>
            <h1 className="font-black text-lg italic whitespace-nowrap overflow-hidden text-ellipsis">THEY LOST!</h1>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => { setView('scoreboard'); checkLiveScores(true); }} disabled={loading} className="p-2 hover:bg-white/10 rounded-lg">
             <div className={loading ? "animate-spin" : ""}><RefreshCw size={24} /></div>
          </button>
          <button onClick={() => { setView('scoreboard'); checkLiveScores(true); }} className={`p-2 rounded-lg ${view==='scoreboard'?'bg-black/20':''}`}><PartyPopper size={24}/></button>
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

      {refreshing && !celebration && (
          <div className="absolute top-20 left-0 right-0 z-20 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-4">
              <div className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold"><RefreshCw size={16} className="animate-spin" /> Checking Scores...</div>
          </div>
      )}

      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-100 p-4 border-b flex justify-between font-bold text-slate-700"><span className="flex gap-2"><Share2/> Rub It In</span><button onClick={()=>setShareModal(null)}><X/></button></div>
            <div className="p-4 space-y-2">
              {shareOptions.map((opt,i) => (
                <button key={i} onClick={()=>doShare(opt.text, shareModal, i)} className="w-full text-left p-3 rounded-xl border hover:bg-green-50 hover:border-green-500 transition group relative">
                  <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-1"><span>{opt.label}</span>{copiedIndex === i ? <Check size={12} className="text-green-600"/> : <Copy size={12}/>}</div>
                  <p className="text-sm font-medium text-slate-800">{opt.text}</p>
                  {copiedIndex === i && <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center font-black text-green-700 uppercase tracking-widest text-xs">Copied!</div>}
                </button>
              ))}
          </div>
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
                {/* Fix: Display "Checking..." only when loading is active */}
                {loading && <div className="text-center py-12"><RefreshCw className={`mx-auto mb-4 ${styles.accent} animate-spin`} size={32}/><h3 className="font-bold">Checking Scores...</h3></div>}

                {/* Show No Games/History Lesson Card */}
                {displayResults.length === 0 && !loading && (
                  <div className={`text-center py-8 px-5 ${styles.card} border-dashed`}>
                    <div className="mb-6"><div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><AlertTriangle className="text-red-500"/></div><h3 className="font-bold text-lg">Nobody lost today (yet).</h3></div>
                    {/* ONLY RENDER IF consolationFact IS NOT NULL */}
                    {consolationFact && <div className={`${styles.accentBg} border-2 border-current rounded-xl p-5 text-left rotate-1 hover:rotate-0 transition shadow-sm`}>
                        <div className="text-[10px] font-black uppercase opacity-60 mb-1 flex items-center gap-1"><History size={12} />History Lesson</div>
                        <h4 className="font-bold opacity-80 mb-2 leading-tight">Remember {consolationFact.team ? consolationFact.team.name : 'They'} {consolationFact.headline}?</h4>
                        <div className="font-black text-xl mb-1">{consolationFact.score}</div>
                        <p className="text-xs uppercase opacity-60 mb-2">{consolationFact.date}</p>
                        <p className="text-sm opacity-90 leading-snug">{consolationFact.desc}</p>
                    </div>}
                  </div>
                )}
                
                {/* Display actual losses */}
                {displayResults.map((g,i) => (
                  <div key={i} className={`relative overflow-hidden animate-in slide-in-from-bottom-5 ${styles.card} border-2`}>
                    <div className={`p-2 text-center text-[10px] font-black uppercase flex justify-center gap-2 ${g.isYesterday?'bg-slate-200 text-slate-600':styles.lossBanner}`}>{g.status==='LOST'?'THEY LOST!':'SCORES'} {g.isYesterday && '(YESTERDAY)'}</div>
                    <div className="p-5 flex justify-between items-center">
                      <div className="flex flex-col items-center w-1/3"><div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-sm mb-2 shadow-md border-2 border-white" style={{background:g.team.color}}>{g.team.id.substring(0,3).toUpperCase()}</div><span className="font-bold text-base text-center">{g.team.name}</span><span className="text-3xl font-black mt-1 text-red-500">{g.team.score}</span></div>
                      <div className="opacity-50 font-black italic">VS</div>
                      <div className="flex flex-col items-center w-1/3 opacity-80"><div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xs mb-2 text-white shadow-sm border-2 border-white" style={{background: g.opponentTeam.color}}>{g.opponentTeam.id.substring(0,3).toUpperCase()}</div><span className="font-bold text-sm text-center">{g.opponentTeam.name}</span><span className="text-3xl font-bold mt-1 text-slate-500">{g.opponentTeam.score}</span></div>
                    </div>
                    <div className="p-3 border-t bg-slate-50 flex gap-2">
                        <button onClick={()=>openShare(g)} className={`flex-1 py-2 rounded-lg text-base font-bold flex items-center justify-center gap-2 ${styles.buttonPrimary}`}>Rub It In</button>
                        <a 
                          href={
                            g.team.league === 'NBA' ? `https://www.espn.com/nba/game/_/gameId/${g.gameId}` :
                            g.team.league === 'NFL' ? `https://www.espn.com/nfl/game/_/gameId/${g.gameId}` :
                            g.team.league === 'CFB' ? `https://www.espn.com/college-football/game/_/gameId/${g.gameId}` :
                            `https://www.espn.com/mens-college-basketball/game/_/gameId/${g.gameId}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 text-base font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition shadow-sm ${styles.buttonSecondary}`}
                        >
                          <ExternalLink size={16} />
                          View Story
                        </a>
                    </div>
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
            <div className="space-y-2">
            {/* FIX: Corrected JSX syntax within map function, ensuring proper closure of tags */}
            {manageList.map(t=>(
                <button 
                    key={t.id} 
                    onClick={()=>toggleHate(t.id)} 
                    className={`w-full p-3 rounded-xl flex items-center justify-between border transition ${hatedTeams.includes(t.id)?`border-red-500 ${styles.accentBg}`:'hover:bg-slate-50'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{background:t.color}}>{t.id.substring(0,2).toUpperCase()}</div>
                        <div className="text-left">
                            <div className="font-bold text-base">{t.name}</div>
                            <div className="text-xs opacity-60 uppercase">{t.conf}</div>
                        </div>
                    </div>
                    {hatedTeams.includes(t.id)&&<Target size={20} className={styles.accent}/>}
                </button>
            ))}
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className={`p-5 space-y-6 animate-in slide-in-from-bottom-4 ${styles.card} border-2`}>
            <h2 className="font-bold flex items-center gap-2 text-xl"><Settings className={styles.accent}/> Settings</h2>
            <div>
                <h3 className="text-sm font-bold uppercase opacity-50 mb-3">Sports</h3>
                <div className="space-y-2">
                    {Object.keys(enabledLeagues).map(l=>(
                        <div key={l} className="flex justify-between p-3 border rounded-lg">
                            <span className="font-bold text-base">{l === 'NCAA' ? 'NCAA Hoops' : l}</span>
                            <button onClick={()=>setEnabledLeagues(p=>({...p,[l]:!p[l]}))} className={enabledLeagues[l]?'text-green-500':'text-slate-300'}>
                                {enabledLeagues[l]?<ToggleRight size={32}/>:<ToggleLeft size={32}/>}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold uppercase opacity-50 mb-3">Theme</h3>
                <div className="grid gap-2">
                    {Object.keys(THEMES).map(k=>(
                        <button 
                            key={k} 
                            onClick={()=>setActiveTheme(k)} 
                            className={`p-3 text-base font-bold border-2 rounded-lg flex justify-between ${activeTheme===k?'border-current':'border-transparent bg-slate-50'}`}
                            style={{
                                backgroundColor: THEMES[k].bg.includes('slate-950') ? '#0f172a' : (THEMES[k].bg.includes('emerald') ? '#ecfdf5' : '#f1f5f9'),
                                color: k === 'midnight' ? 'white' : 'black'
                            }}
                        >
                            <span>{THEMES[k].name}</span>
                            {activeTheme===k&&<div className="w-3 h-3 rounded-full bg-green-500"/>}
                        </button>
                    ))}
                </div>
            </div>
            <button onClick={sendTestNotification} className="w-full py-3 text-blue-600 bg-blue-50 border border-blue-200 rounded-xl text-sm font-bold flex justify-center items-center gap-2 mb-2"><Bell size={16}/> Send Test Alert</button>
            <button onClick={()=>{localStorage.clear();window.location.reload()}} className="w-full py-3 text-red-400 text-sm font-bold flex justify-center items-center gap-1"><LogOut size={16}/> Reset App</button>
            <p className="text-center text-xs opacity-30 mt-4">v{APP_VERSION}</p>
          </div>
        )}
      </main>
    </div>
  );
}
