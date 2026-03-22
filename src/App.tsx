import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Trophy, RefreshCw, PartyPopper, Settings, Target, Zap, LogOut, Check, Search, Bell, X, ToggleLeft, ToggleRight, History, Share2 } from 'lucide-react';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { LocalNotifications } from '@capacitor/local-notifications';

const APP_VERSION = "2.1.1"; 
const DEBUG_MODE = false; // Set to true to show test buttons and debug info in settings
const API_BASE = 'https://us-central1-they-lost.cloudfunctions.net/registerToken';
const APP_ICON = "https://ik.imagekit.io/ipi1yjzh9/theylost%20icon%20512.png";

const THEMES = {
  professional: { name: "Professional", bg: "bg-slate-100", text: "text-slate-900", header: "bg-blue-600 text-white shadow-md", card: "bg-white border-slate-200 shadow-sm rounded-2xl", accent: "text-blue-600", accentBg: "bg-blue-50", buttonPrimary: "bg-blue-900 text-white", buttonSecondary: "bg-slate-200 text-slate-700 hover:bg-slate-300", lossBanner: "bg-green-600 text-white" },
  midnight: { name: "Midnight", bg: "bg-slate-950", text: "text-slate-100", header: "bg-slate-900 text-white border-b border-slate-800", card: "bg-slate-900 border-slate-800 shadow-lg rounded-xl", accent: "text-indigo-400", accentBg: "bg-slate-800", buttonPrimary: "bg-indigo-600 text-white", buttonSecondary: "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700", lossBanner: "bg-indigo-600 text-white" },
  playbook: { name: "Playbook", bg: "bg-emerald-50", text: "text-emerald-950", header: "bg-emerald-800 text-white border-b-4 border-emerald-600", card: "bg-white border-emerald-200 shadow-sm rounded-lg", accent: "text-emerald-700", accentBg: "bg-emerald-100", buttonPrimary: "bg-emerald-800 text-white", buttonSecondary: "bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50", lossBanner: "bg-emerald-700 text-white" }
};

const WAITING_GIFS = [
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzk0MmM0bzh3ZzRqN3JsM2duOW00emdkc2hlZWVhend0eWZ0bXFrcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tXL4FHPSnVJ0A/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3I0OXc0ZXEzazdvd29tMGcwZzQzazhkdHhlYWc4eGpyNGJ3d2o0MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QBd2kLB5qDmysEXre9/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjVvaHlvZ3k5czltbHZxeDFmYnZyYTRsOHIzb2djNmJqa3M3d3dicyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FoH28ucxZFJZu/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3Q2cjd3YXltdmwwa2RzZzcwNGJ3czM5MmpscDhhaGpyZGdvcDllbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BDQmMy3ZM8sgRNFkhe/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmh2YWlzZjhkcmRyaW5hbGFqdHB6b2czbGhobzJ5MDJyNzRvd2E4dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IcoMfdWwY26mBcX008/giphy.gif",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExamlpbXplcWhycDNtMTNkeDdqeXVwaDBybjJzZ2xxanJlN3JqdmhjbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hCiQVo1dzVwPu/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjA0NGNlYmI1NzQ0ZDlnNTk5ZjkzZHoxcjY0a3BpbHh3ejVmeWNyMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ARH12W5IVAbni/giphy.gif"
];

const RAW_TEAMS = {
  NBA: [['bos_nba','Boston','Celtics','#007A33','East'],['bkn_nba','Brooklyn','Nets','#000000','East'],['ny_nba','New York','Knicks','#F58426','East'],['phi_nba','Philly','76ers','#006BB6','East'],['tor_nba','Toronto','Raptors','#CE1141','East'],['chi_nba','Chicago','Bulls','#CE1141','East'],['cle_nba','Cleveland','Cavaliers','#860038','East'],['det_nba','Detroit','Pistons','#C8102E','East'],['ind_nba','Indiana','Pacers','#FDBB30','East'],['mil_nba','Milwaukee','Bucks','#00471B','East'],['atl_nba','Atlanta','Hawks','#E03A3E','East'],['cha_nba','Charlotte','Hornets','#1D1160','East'],['mia_nba','Miami','Heat','#98002E','East'],['orl_nba','Orlando','Magic','#0077C0','East'],['wsh_nba','Washington','Wizards','#002B5C','East'],['den_nba','Denver','Nuggets','#0E2240','West'],['min_nba','Minnesota','Timberwolves','#0C2340','West'],['okc_nba','OKC','Thunder','#007AC1','West'],['por_nba','Portland','Trail Blazers','#E03A3E','West'],['uta_nba','Utah','Jazz','#002B5C','West'],['gs_nba','Golden State','Warriors','#1D428A','West'],['lac_nba','LA Clippers','Clippers','#C8102E','West'],['lal_nba','LA Lakers','Lakers','#552583','West'],['phx_nba','Phoenix','Suns','#1D1160','West'],['sac_nba','Sacramento','Kings','#5A2D81','West'],['dal_nba','Dallas','Mavericks','#00538C','West'],['hou_nba','Houston','Rockets','#CE1141','West'],['mem_nba','Memphis','Grizzlies','#5D76A9','West'],['no_nba','New Orleans','Pelicans','#0C2340','West'],['sas_nba','San Antonio','Spurs','#C4CED4','West']],
  MLB: [['bal_mlb','Baltimore','Orioles','#DF4601','AL East'],['bos_mlb','Boston','Red Sox','#BD3039','AL East'],['nyy_mlb','NY Yankees','Yankees','#003087','AL East'],['tb_mlb','Tampa Bay','Rays','#092C5C','AL East'],['tor_mlb','Toronto','Blue Jays','#134A8E','AL East'],['cws_mlb','Chi White Sox','White Sox','#27251F','AL Central'],['cle_mlb','Cleveland','Guardians','#00385D','AL Central'],['det_mlb','Detroit','Tigers','#0C2340','AL Central'],['kc_mlb','Kansas City','Royals','#004687','AL Central'],['min_mlb','Minnesota','Twins','#002B5C','AL Central'],['hou_mlb','Houston','Astros','#002D62','AL West'],['laa_mlb','LA Angels','Angels','#BA0021','AL West'],['oak_mlb','Oakland','Athletics','#003831','AL West'],['sea_mlb','Seattle','Mariners','#0C2C56','AL West'],['tex_mlb','Texas','Rangers','#003278','AL West'],['atl_mlb','Atlanta','Braves','#13274F','NL East'],['mia_mlb','Miami','Marlins','#00A3E0','NL East'],['nym_mlb','NY Mets','Mets','#002D72','NL East'],['phi_mlb','Philadelphia','Phillies','#E81828','NL East'],['wsh_mlb','Washington','Nationals','#AB0003','NL East'],['chc_mlb','Chi Cubs','Cubs','#0E3386','NL Central'],['cin_mlb','Cincinnati','Reds','#C6011F','NL Central'],['mil_mlb','Milwaukee','Brewers','#12284B','NL Central'],['pit_mlb','Pittsburgh','Pirates','#FDB827','NL Central'],['stl_mlb','St. Louis','Cardinals','#C41E3A','NL Central'],['ari_mlb','Arizona','Diamondbacks','#A71930','NL West'],['col_mlb','Colorado','Rockies','#333366','NL West'],['lad_mlb','LA Dodgers','Dodgers','#005A9C','NL West'],['sd_mlb','San Diego','Padres','#2F241D','NL West'],['sf_mlb','San Francisco','Giants','#FD5A1E','NL West']],
  NFL: [['ari_nfl','Arizona','Cardinals','#97233F','NFC West'],['atl_nfl','Atlanta','Falcons','#a71930','NFC South'],['bal_nfl','Baltimore','Ravens','#241773','AFC North'],['buf_nfl','Buffalo','Bills','#00338D','AFC East'],['car_nfl','Carolina','Panthers','#0085CA','NFC South'],['chi_nfl','Chicago','Bears','#0B162A','NFC North'],['cin_nfl','Cincinnati','Bengals','#fb4f14','AFC North'],['cle_nfl','Cleveland','Browns','#311D00','AFC North'],['dal_nfl','Dallas','Cowboys','#003594','NFC East'],['den_nfl','Denver','Broncos','#FB4F14','AFC West'],['det_nfl','Detroit','Lions','#0076b6','NFC North'],['gb_nfl','Green Bay','Packers','#203731','NFC North'],['hou_nfl','Houston','Texans','#03202f','AFC South'],['ind_nfl','Indianapolis','Colts','#002C5F','AFC South'],['jax_nfl','Jacksonville','Jaguars','#101820','AFC South'],['kc_nfl','Kansas City','Chiefs','#E31837','AFC West'],['lv_nfl','Las Vegas','Raiders','#000000','AFC West'],['lac_nfl','LA Chargers','Chargers','#0080C6','AFC West'],['lar_nfl','LA Rams','Rams','#003594','NFC West'],['mia_nfl','Miami','Dolphins','#008E97','AFC East'],['min_nfl','Minnesota','Vikings','#4F2683','NFC North'],['ne_nfl','New England','Patriots','#002244','AFC East'],['no_nfl','New Orleans','Saints','#D3BC8D','NFC South'],['nyg_nfl','NY Giants','Giants','#0B2265','NFC East'],['nyj_nfl','NY Jets','Jets','#125740','AFC East'],['phi_nfl','Philadelphia','Eagles','#004C54','NFC East'],['pit_nfl','Pittsburgh','Steelers','#FFB612','AFC North'],['sf_nfl','San Francisco','49ers','#AA0000','NFC West'],['sea_nfl','Seattle','Seahawks','#002244','NFC West'],['tb_nfl','Tampa Bay','Buccaneers','#D50A0A','NFC South'],['ten_nfl','Tennessee','Titans','#0C2340','AFC South'],['wsh_nfl','Washington','Commanders','#5a1414','NFC East']],
  NCAA: [['unc','North Carolina','Tar Heels','#4B9CD3','ACC'],['duke','Duke','Blue Devils','#003087','ACC'],['uva','Virginia','Cavaliers','#232D4B','ACC'],['vtech','Virginia Tech','Hokies','#630031','ACC'],['mia','Miami','Hurricanes','#F47321','ACC'],['ncst','NC State','Wolfpack','#CC0000','ACC'],['lou','Louisville','Cardinals','#C90031','ACC'],['nd','Notre Dame','Fighting Irish','#0C2340','ACC'],['fsu','Florida St','Seminoles','#782F40','ACC'],['syr','Syracuse','Orange','#F76900','ACC'],['bc','Boston College','Eagles','#98002E','ACC'],['msu','Michigan St','Spartans','#18453B','Big Ten'],['mich','Michigan','Wolverines','#00274C','Big Ten'],['osu','Ohio State','Buckeyes','#BB0000','Big Ten'],['ill','Illinois','Illini','#E84A27','Big Ten'],['pur','Purdue','Boilermakers','#CEB888','Big Ten'],['iu','Indiana','Hoosiers','#990000','Big Ten'],['wis','Wisconsin','Badgers','#C5050C','Big Ten'],['iowa','Iowa','Hawkeyes','#FFCD00','Big Ten'],['umd','Maryland','Terrapins','#E03A3E','Big Ten'],['rut','Rutgers','Scarlet Knights','#CC0033','Big Ten'],['nw','Northwestern','Wildcats','#4E2A84','Big Ten'],['nebr','Nebraska','Cornhuskers','#E41C38','Big Ten'],['uky','Kentucky','Wildcats','#0033A0','SEC'],['ala','Alabama','Crimson Tide','#9E1B32','SEC'],['aub','Auburn','Tigers','#0C2340','SEC'],['tenn','Tennessee','Volunteers','#FF8200','SEC'],['fla','Florida','Gators','#0021A5','SEC'],['ark','Arkansas','Razorbacks','#9D2235','SEC'],['lsu_bb','LSU','Tigers','#461D7C','SEC'],['miz_bb','Missouri','Tigers','#F1B82D','SEC'],['sc_bb','South Carolina','Gamecocks','#73000A','SEC'],['uga_bb','Georgia','Bulldogs','#BA0C2F','SEC'],['ole_bb','Ole Miss','Rebels','#CE1126','SEC'],['msst_bb','Miss State','Bulldogs','#660000','SEC'],['tam_bb','Texas A&M','Aggies','#500000','SEC'],['van_bb','Vanderbilt','Commodores','#000000','SEC'],['tex','Texas','Longhorns','#BF5700','SEC'],['okl_bb','Oklahoma','Sooners','#841617','SEC'],['ku','Kansas','Jayhawks','#0051BA','Big 12'],['bay','Baylor','Bears','#154734','Big 12'],['hou','Houston','Cougars','#C8102E','Big 12'],['isu','Iowa State','Cyclones','#C8102E','Big 12'],['textech','Texas Tech','Red Raiders','#CC0000','Big 12'],['conn','UConn','Huskies','#000E2F','Big East'],['nova','Villanova','Wildcats','#00205B','Big East'],['marq','Marquette','Golden Eagles','#003366','Big East'],['stj',"St. John's",'Red Storm','#BA0C2F','Big East'],['gonz','Gonzaga','Bulldogs','#041E42','WCC'],['ucla','UCLA','Bruins','#2D68C4','Pac-12'],['usc_bb','USC','Trojans','#990000','Pac-12'],['ari','Arizona','Wildcats','#CC0033','Pac-12'],['asu','Arizona St','Sun Devils','#8C1D40','Pac-12'],['sdsu','San Diego St','Aztecs','#A6192E','MWC'],['mem','Memphis','Tigers','#0033A0','AAC'],['gtown','Georgetown','Hoyas','#041E42','Big East'],['psu','Penn State','Nittany Lions','#041E42','Big Ten'],['minn','Minnesota','Golden Gophers','#7A0019','Big Ten'],['ore','Oregon','Ducks','#154733','Big Ten'],['wash','Washington','Huskies','#4B2E83','Big Ten'],['crei','Creighton','Bluejays','#0055A2','Big East'],['prov','Providence','Friars','#000000','Big East'],['hall','Seton Hall','Pirates','#004488','Big East'],['xav','Xavier','Musketeers','#0C2340','Big East'],['but','Butler','Bulldogs','#003162','Big East'],['dep','DePaul','Blue Demons','#0055A2','Big East'],['ksu','Kansas St','Wildcats','#512888','Big 12'],['okst','Oklahoma St','Cowboys','#FF7300','Big 12'],['tcu','TCU','Horned Frogs','#4D1979','Big 12'],['wvu','West Virginia','Mountaineers','#002855','Big 12'],['byu','BYU','Cougars','#002E5D','Big 12'],['cin','Cincinnati','Bearcats','#E00122','Big 12'],['ucf','UCF','Knights','#BA9B37','Big 12'],['colo','Colorado','Buffaloes','#CFB87C','Big 12'],['utah','Utah','Utes','#CC0000','Big 12'],['clem','Clemson','Tigers','#F56600','ACC'],['gt','Georgia Tech','Yellow Jackets','#B3A369','ACC'],['pitt','Pittsburgh','Panthers','#003594','ACC'],['wake','Wake Forest','Demon Deacons','#9E7E38','ACC'],['smu','SMU','Mustangs','#0033A0','ACC'],['cal','Cal','Golden Bears','#003262','ACC'],['stan','Stanford','Cardinal','#8C1515','ACC']],
  CFB: [['ala_fb','Alabama','Crimson Tide','#9E1B32','SEC'],['uga','Georgia','Bulldogs','#BA0C2F','SEC'],['tex_fb','Texas','Longhorns','#BF5700','SEC'],['lsu','LSU','Tigers','#461D7C','SEC'],['tenn_fb','Tennessee','Volunteers','#FF8200','SEC'],['ole','Ole Miss','Rebels','#CE1126','SEC'],['miz','Missouri','Tigers','#F1B82D','SEC'],['okl','Oklahoma','Sooners','#841617','SEC'],['fla_fb','Florida','Gators','#0021A5','SEC'],['aub_fb','Auburn','Tigers','#0C2340','SEC'],['tam','Texas A&M','Aggies','#500000','SEC'],['ark_fb','Arkansas','Razorbacks','#9D2235','SEC'],['uky_fb','Kentucky','Wildcats','#0033A0','SEC'],['sc','South Carolina','Gamecocks','#73000A','SEC'],['van','Vanderbilt','Commodores','#000000','SEC'],['msst','Miss State','Bulldogs','#660000','SEC'],['mich_fb','Michigan','Wolverines','#00274C','Big Ten'],['osu_fb','Ohio State','Buckeyes','#BB0000','Big Ten'],['psu','Penn State','Nittany Lions','#041E42','Big Ten'],['ore','Oregon','Ducks','#154733','Big Ten'],['wash','Washington','Huskies','#4B2E83','Big Ten'],['usc_fb','USC','Trojans','#990000','Big Ten'],['ucla_fb','UCLA','Bruins','#2D68C4','Big Ten'],['wis_fb','Wisconsin','Badgers','#C5050C','Big Ten'],['iowa','Iowa','Hawkeyes','#FFCD00','Big Ten'],['neb','Nebraska','Cornhuskers','#E41C38','Big Ten'],['msu_fb','Michigan St','Spartans','#18453B','Big Ten'],['minn_fb','Minnesota','Gophers','#7A0019','Big Ten'],['ill_fb','Illinois','Illini','#E84A27','Big Ten'],['pur_fb','Purdue','Boilermakers','#CEB888','Big Ten'],['umd_fb','Maryland','Terrapins','#E03A3E','Big Ten'],['rut','Rutgers','Scarlet Knights','#CC0033','Big Ten'],['ind_fb','Indiana','Hoosiers','#990000','Big Ten'],['nw','Northwestern','Wildcats','#4E2A84','Big Ten'],['fsu_fb','Florida St','Seminoles','#782F40','ACC'],['clem_fb','Clemson','Tigers','#F56600','ACC'],['mia_fb','Miami','Hurricanes','#F47321','ACC'],['unc_fb','North Carolina','Tar Heels','#99badd','ACC'],['ncst_fb','NC State','Wolfpack','#CC0000','ACC'],['duke_fb','Duke','Blue Devils','#003087','ACC'],['vt','Virginia Tech','Hokies','#630031','ACC'],['uva_fb','Virginia','Cavaliers','#232D4B','ACC'],['lou_fb','Louisville','Cardinals','#C90031','ACC'],['pitt','Pittsburgh','Panthers','#003594','ACC'],['syr_fb','Syracuse','Orange','#F76900','ACC'],['gt','Georgia Tech','Yellow Jackets','#B3A369','ACC'],['bc','Boston College','Eagles','#98002E','ACC'],['wake_fb','Wake Forest','Demon Deacons','#9E7E38','ACC'],['cal','Cal','Golden Bears','#003262','ACC'],['stan','Stanford','Cardinal','#8C1515','ACC'],['smu','SMU','Mustangs','#0033A0','ACC'],['okst','Oklahoma St','Cowboys','#FF7300','Big 12'],['ksu','Kansas St','Wildcats','#512888','Big 12'],['ku_fb','Kansas','Jayhawks','#0051BA','Big 12'],['isu_fb','Iowa State','Cyclones','#C8102E','Big 12'],['utah','Utah','Utes','#CC0000','Big 12'],['ari_fb','Arizona','Wildcats','#CC0033','Big 12'],['asu','Arizona St','Sun Devils','#8C1D40','Big 12'],['colo','Colorado','Buffaloes','#CFB87C','Big 12'],['byu','BYU','Cougars','#002E5D','Big 12'],['tcu','TCU','Horned Frogs','#4D1979','Big 19'],['bay_fb','Baylor','Bears','#154734','Big 12'],['tt','Texas Tech','Red Raiders','#CC0000','Big 12'],['wvu','West Virginia','Mountaineers','#002855','Big 12'],['ucf','UCF','Knights','#BA9B37','Big 12'],['cin_fb','Cincinnati','Bearcats','#E00122','Big 12'],['hou_fb','Houston','Cougars','#C8102E','Big 12'],['nd','Notre Dame','Fighting Irish','#0C2340','Ind'],['orst','Oregon St','Beavers','#DC4405','Pac-12'],['wsu','Wash State','Cougars','#981E32','Pac-12']]
};

const ALL_TEAMS_DATA = Object.entries(RAW_TEAMS).flatMap(([league, teams]) => 
  teams.map(t => ({ id: t[0], league, name: t[1], mascot: t[2], color: t[3], conf: t[4] }))
);

const CELEBRATION_GIFS_LIST = [
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
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmt2M2o4dnZ6OWRud2NmNm85bzNndmR6ZDRmemRmaWhjdW5oZmN4NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/unAjVtjhUeYFMJ8jFc/giphy.gif",
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

const CELEBRATION_ONELINERS = [
  "It Happened!", "Scoreboard.", "Boom Goes the Dynamite!", "Things Are Looking Up!",
  "Nice!", "It's Over!", "Thanks for Participating!", "You Love to See It.",
  "Chef's Kiss.", "Poetry in Motion.", "Hate to See It. 😏", "That's Tough.",
  "Couldn't Have Happened to Nicer People.", "What a Time to Be Alive!",
  "And There It Is.", "Mission Accomplished.", "Perfection."
];

const HISTORY_HEADERS = [
  "NEVER FORGET", "HISTORY LESSON", "WHILE WE WAIT... REMEMBER THIS?",
  "SCHADENFREUDE FLASHBACK:", "\"THEY LOST!\" FLASHBACK", "REMEMBER WHEN...."
];

const HISTORIC_LOSSES = {
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
    ['lsu', "Big Baby's Revenge", "LSU 62, Duke 54", "March 23, 2006", "The #1 overall seed Duke. JJ Redick shot 3-for-18 in his final game."]
  ],
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
    ['det_nfl', "The Goff Stunner", "Lions 37, Packers 30", "Jan 9, 2022", "A Week 18 loss to the Lions that kept the Packers out of the playoffs."]
  ],
  bos: [
    ['lal', "Game 7, 2010 Finals", "Lakers 83, Celtics 79", "Jun 17, 2010", "The ultimate rivalry showdown. Lakers rallied from a 13-point deficit to win the title at home."],
    ['lal', "Magic's Hook Shot", "Lakers 107, Celtics 106", "Jun 4, 1987", "Game 4 of the Finals, Magic Johnson hit the iconic sky-hook over Parish and McHale to steal the win."],
    ['lal', "The Bird-Magic Era Ends", "Lakers 106, Celtics 93", "Jun 14, 1987", "Game 6 of the Finals, the Lakers closed out the series at the Forum."],
    ['lal', "Kobe's Redemption", "Lakers 99, Celtics 95", "Jun 12, 2008", "A tough road game loss during the 2008 Finals."],
    ['mia', "LeBron's Game 6 Masterpiece", "Heat 98, Celtics 79", "Jun 7, 2012", "Eastern Conference Finals. LeBron put up 45 points and 15 rebounds in the Garden to force a Game 7."],
    ['cle', "The Sweep", "Cavaliers 135, Celtics 102", "May 25, 2017", "LeBron James swept the Celtics in the Eastern Conference Finals."],
    ['det', "The Comeback Collapse", "Pistons 103, Celtics 97", "May 30, 2008", "Eastern Conference Finals Game 6 loss, as Boston blew a late lead."],
    ['gs', "2022 Finals Game 6", "Warriors 103, Celtics 90", "Jun 16, 2022", "Celtics led 2-1 but lost three straight, watching Stephen Curry clinch the title in Boston."],
    ['orl', "Dwight's Dominance", "Magic 101, Celtics 82", "May 18, 2009", "Orlando eliminated the Celtics in the Eastern Conference Semifinals."]
  ]
};

// ---- HELPER: safe clipboard copy ----
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch (e) {
    // fallback below
  }
  // Fallback for older WebViews
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

// ---- HELPER: pick random item from array (stable outside render) ----
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const Confetti = () => {
  return (
      <div className="fixed inset-0 pointer-events-none z-[110] overflow-hidden">
          {[...Array(30)].map((_, i) => (
              <div key={i} className="absolute animate-confetti" style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                  backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
                  width: '10px',
                  height: '10px',
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 2}s`
              }} />
          ))}
          <style>{`
              @keyframes confetti {
                  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
              }
              .animate-confetti { animation: confetti linear infinite; }
          `}</style>
      </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', textAlign: 'center', paddingTop: '100px' }}>
            <h1>⚠️ App Crashed</h1>
            <pre style={{ textAlign: 'left', background: '#eee', padding: '10px', borderRadius: '8px', overflow: 'auto' }}>
                {this.state.error?.toString()}
            </pre>
            <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', background: 'red', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', marginTop: '20px' }}>Reload App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [imgError, setImgError] = useState(false);

  const handleEnableNotifications = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        let perm = await FirebaseMessaging.checkPermissions();
        if (perm.receive !== 'granted') perm = await FirebaseMessaging.requestPermissions();
        if (perm.receive === 'granted') {
          try { await FirebaseMessaging.getToken(); } catch (e) { console.warn("getToken in onboarding:", e); }
        }
      }
    } catch (e) { console.error("Native push error:", e); }
    onComplete();
  };

  return (
    step === 0 ? (
      <div className="fixed inset-0 z-[100] bg-gradient-to-br from-blue-900 to-indigo-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-48 h-48 mb-6 rounded-2xl shadow-xl overflow-hidden bg-white p-0.5">
           <div className="w-full h-full relative bg-blue-600 rounded-xl flex items-center justify-center">
             {!imgError ? (
                <img src={APP_ICON} onError={() => setImgError(true)} alt="App Icon" className="w-full h-full object-cover rounded-xl" />
             ) : (
                <Trophy size={64} className="text-white opacity-50" />
             )}
           </div>
        </div>
        <h1 className="text-3xl font-black italic uppercase mb-4">Their misery. Your joy.</h1>
        <p className="text-lg font-medium opacity-90 mb-8 max-w-xs">Love the jolt of joy when a team you hate loses? This app alerts you ONLY when they lose.</p>
        <button onClick={() => setStep(1)} className="bg-[#1e90ff] text-white text-lg font-black py-4 px-8 rounded-2xl shadow-2xl w-full active:scale-95 transition-transform">Let your hate flow</button>
      </div>
    ) : step === 1 ? (
      <div className="fixed inset-0 z-[100] bg-green-900 text-white flex flex-col p-6 text-center justify-center">
        <Target size={64} className="mx-auto mb-6" />
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">Pick Your Targets</h2>
        <p className="text-white/90 mb-8 max-w-xs mx-auto font-bold leading-tight">Search for teams across NBA, NFL, MLB, and NCAA. Add them to your "Enemies List."</p>
        <button onClick={() => setStep(2)} className="bg-white text-emerald-700 text-lg font-bold py-4 px-8 rounded-xl shadow-lg w-full">Got it, next</button>
      </div>
    ) : (
      <div className="fixed inset-0 z-[100] bg-orange-500 text-white flex flex-col p-6 text-center justify-center">
        <Bell size={64} className="mx-auto mb-6 animate-bounce text-yellow-300" />
        <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">Don't Miss the Moment</h2>
        <div className="space-y-3 mt-4">
            <button onClick={handleEnableNotifications} className="bg-white text-orange-600 text-lg font-bold py-4 px-8 rounded-xl shadow-lg w-full">Enable Notifications</button>
            <button onClick={() => onComplete()} className="text-white/80 text-sm font-bold py-2 w-full">Maybe Later</button>
        </div>
      </div>
    )
  );
}

function App() {
  const [view, setView] = useState('scoreboard');
  const [activeLeague, setActiveLeague] = useState('NCAA');
  const [activeTheme, setActiveTheme] = useState('professional');
  const [fcmToken, setFcmToken] = useState(null); 
  const [syncStatus, setSyncStatus] = useState('Idle');
  const [bridgeStatus, setBridgeStatus] = useState('Detecting...');
  const [lastError, setLastError] = useState(null); 
  const [shareOptions, setShareOptions] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return localStorage.getItem('tl_onboarded') !== 'true'; } catch (e) { return true; }
  });

  // FIX: Default leagues — NBA, NCAA (hoops), MLB on; NFL & CFB off
  const [enabledLeagues, setEnabledLeagues] = useState({ NCAA: true, CFB: false, NBA: true, NFL: false, MLB: true });
  const [hatedTeams, setHatedTeams] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tl_hated_teams') || '[]'); } catch (e) { return []; }
  });
  
  const [notifiedGames, setNotifiedGames] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tl_notified_games') || '[]'); } catch (e) { return []; }
  });

  const [rawGameEvents, setRawGameEvents] = useState([]);
  const [celebration, setCelebration] = useState(null);
  const [shareModal, setShareModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [debugMsg, setDebugMsg] = useState('Init...');

  // FIX: Ref to track current enabledLeagues for use in callbacks/effects without stale closures
  const enabledLeaguesRef = useRef(enabledLeagues);
  useEffect(() => { enabledLeaguesRef.current = enabledLeagues; }, [enabledLeagues]);

  // FIX: Ref to track fcmToken for listener callbacks
  const fcmTokenRef = useRef(fcmToken);
  useEffect(() => { fcmTokenRef.current = fcmToken; }, [fcmToken]);

  // FIX: Ref to track hatedTeams for listener callbacks
  const hatedTeamsRef = useRef(hatedTeams);
  useEffect(() => { hatedTeamsRef.current = hatedTeams; }, [hatedTeams]);

  // FIX: Track push listener cleanup handles
  const pushListenersRef = useRef([]);

  // Ref to access current gameResults from notification tap handlers
  const gameResultsRef = useRef([]);

  // Stores notification body when tapped, so we can match to a game once results load
  const pendingNotificationRef = useRef(null);

  // Try to match a notification body to a current game result and show celebration
  const showCelebrationFromNotification = (body) => {
    if (!body) return false;
    const bodyLower = body.toLowerCase();
    const results = gameResultsRef.current;
    
    // Search for a matching LOST game by team name or mascot
    const match = results.find(g => {
      if (g.status !== 'LOST') return false;
      const teamName = (g.team.name || '').toLowerCase();
      const mascot = (g.team.mascot || '').toLowerCase();
      return bodyLower.includes(teamName) || bodyLower.includes(mascot);
    });
    
    if (match) {
      setCelebration({
        gif: pickRandom(CELEBRATION_GIFS_LIST),
        game: match,
        tagline: pickRandom(CELEBRATION_ONELINERS)
      });
      setView('scoreboard');
      return true;
    }
    return false;
  };

  // FIX: Stable random values — only re-roll on explicit refresh, not on every loading toggle
  const [randomSeed, setRandomSeed] = useState(0);

  const styles = THEMES[activeTheme];

  // FIX: Stable random gif — re-rolls only when user explicitly triggers a refresh (randomSeed changes)
  const randomWaitingGif = useMemo(() => {
      return pickRandom(WAITING_GIFS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomSeed]);

  const syncPreferencesWithServer = async (token, teams) => {
    if (!token) return;
    setSyncStatus('Syncing...');

    const explodedTeams = teams.flatMap(hId => {
       const tData = ALL_TEAMS_DATA.find(t => t.id === hId);
       if (!tData) return [hId];
       const baseId = hId.split('_')[0];
       return [
           hId, baseId, baseId.toUpperCase(), tData.name, tData.mascot
       ];
    });
    const finalTeams = [...new Set(explodedTeams)];

    try {
        const options = {
            url: API_BASE,
            headers: { 'Content-Type': 'application/json' },
            data: { email: "mattdc@gmail.com", fcmToken: token, selectedTeams: finalTeams }
        };
        await CapacitorHttp.post(options);
        setSyncStatus('✅ Registered');
    } catch (e) {
      console.error("[Server] Sync failed:", e);
      setSyncStatus('❌ Sync Failed');
      setLastError(e.message || JSON.stringify(e));
    }
  };

  const handleForceSync = async () => {
    if (!fcmToken) {
        try {
            tokenReceivedRef.current = false;
            registerRetryCountRef.current = 0;
            await attemptGetToken();
            alert("Requesting new FCM token... check status bar for updates.");
        } catch(e) {
            alert("Error requesting token: " + e.message);
        }
        return;
    }
    alert("Forcing sync with server...");
    await syncPreferencesWithServer(fcmToken, hatedTeams);
  };

  const testLocalNotification = async () => {
    try {
        await LocalNotifications.requestPermissions();
        await LocalNotifications.schedule({
            notifications: [{
                title: "🔔 It Works!",
                body: "If you see this outside the app, your permissions are perfect.",
                id: 1,
                schedule: { at: new Date(Date.now() + 2000) },
                sound: null,
                attachments: null,
                actionTypeId: "",
                extra: null
            }]
        });
        alert("Alert scheduled for 2 seconds. CLOSE THE APP NOW to test!");
    } catch (e) {
        alert("Local Notification Failed: " + e.message);
    }
  };

  // Track whether we've successfully received a token this session
  const tokenReceivedRef = useRef(false);
  const registerRetryCountRef = useRef(0);
  const MAX_REGISTER_RETRIES = 3;

  const initNativeRegistration = async () => {
    try {
      const platform = Capacitor.getPlatform();
      setBridgeStatus(String(platform)); 
      
      const isNative = Capacitor.isNativePlatform();
      
      if (!isNative) { 
        setSyncStatus('Status: Non-native'); 
        return;
      }

      setSyncStatus('Checking Permissions...');
      
      try {
        await FirebaseMessaging.removeAllDeliveredNotifications();
      } catch (e) {
        console.warn("removeAllDelivered failed (non-fatal):", e);
      }

      let perm = await FirebaseMessaging.checkPermissions();
      if (perm.receive !== 'granted') perm = await FirebaseMessaging.requestPermissions();

      if (perm.receive !== 'granted') {
        setSyncStatus('❌ Notifications Disabled'); 
        return;
      }

      setSyncStatus('Getting FCM Token...');

      // Clean up previous listeners before adding new ones to prevent stacking
      for (const handle of pushListenersRef.current) {
        try { await handle.remove(); } catch (_) {}
      }
      pushListenersRef.current = [];

      // Listen for foreground notifications — show as local notification with data attached
      const h1 = await FirebaseMessaging.addListener('notificationReceived', (notification) => {
         console.log("📬 Foreground notification:", notification);
         const title = notification.notification?.title || "THEY LOST!";
         const body = notification.notification?.body || "";
         LocalNotifications.schedule({
             notifications: [{
                 title,
                 body,
                 id: new Date().getTime(),
                 schedule: { at: new Date(Date.now() + 100) },
                 extra: { notificationBody: body, notificationTitle: title }
             }]
         });
      });

      // Listen for background/quit push notification taps (FCM)
      const h2 = await FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
        console.log("👆 FCM notification tapped:", event);
        const body = event.notification?.body || event.notification?.data?.body || "";
        if (body) {
          const matched = showCelebrationFromNotification(body);
          if (!matched) {
            // Game results may not be loaded yet — store for later
            pendingNotificationRef.current = body;
            checkLiveScores(false); // refresh scores so we can match
          }
        }
      });

      // Listen for local notification taps (foreground-scheduled)
      const h3 = await LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
        console.log("👆 Local notification tapped:", event);
        const body = event.notification?.extra?.notificationBody || event.notification?.body || "";
        if (body) {
          const matched = showCelebrationFromNotification(body);
          if (!matched) {
            pendingNotificationRef.current = body;
            checkLiveScores(false);
          }
        }
      });

      // Listen for token refreshes — FCM can rotate tokens
      const h4 = await FirebaseMessaging.addListener('tokenReceived', (event) => {
        console.log("🔄 FCM token refreshed:", event.token);
        setFcmToken(event.token);
        syncPreferencesWithServer(event.token, hatedTeamsRef.current);
      });

      pushListenersRef.current = [h1, h2, h3, h4];

      // Get FCM token directly — this is the key difference from the generic plugin
      await attemptGetToken();

    } catch (err) {
      console.error("Handshake Logic Failure:", err);
      setSyncStatus('❌ Bridge Error');
      setLastError(err.message || JSON.stringify(err));
    }
  };

  const attemptGetToken = async () => {
    try {
      const result = await FirebaseMessaging.getToken();
      console.log("✅ FCM Token received:", result.token);
      tokenReceivedRef.current = true;
      registerRetryCountRef.current = 0;
      setFcmToken(result.token);
      setSyncStatus('Syncing...');
      syncPreferencesWithServer(result.token, hatedTeamsRef.current);
    } catch (regErr) {
      console.warn(`getToken() failed (attempt ${registerRetryCountRef.current + 1}):`, regErr);
      
      if (!tokenReceivedRef.current) {
        registerRetryCountRef.current += 1;
        
        if (registerRetryCountRef.current < MAX_REGISTER_RETRIES) {
          const delay = registerRetryCountRef.current * 2000;
          setSyncStatus(`⏳ Retry ${registerRetryCountRef.current}/${MAX_REGISTER_RETRIES} in ${delay/1000}s...`);
          setTimeout(() => {
            if (!tokenReceivedRef.current) {
              attemptGetToken();
            }
          }, delay);
        } else {
          setSyncStatus('❌ Token Timeout');
          setLastError(regErr.message || JSON.stringify(regErr));
        }
      }
    }
  };
  
  useEffect(() => {
    const handleVisibilityChange = async () => {
        if (document.visibilityState === 'visible') {
            try {
                if (Capacitor.isNativePlatform()) {
                     await FirebaseMessaging.removeAllDeliveredNotifications();
                }
            } catch (e) {
                console.error("Error clearing badges:", e);
            }
        }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (Capacitor.isNativePlatform()) {
         FirebaseMessaging.removeAllDeliveredNotifications().catch(console.error);
    }
    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // FIX: Use useCallback for checkLiveScores so it reads current enabledLeagues from ref
  const checkLiveScores = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
      setRandomSeed(prev => prev + 1); // re-roll random visuals on explicit refresh
    }
    try {
      const now = new Date(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}));
      const todayStr = now.toLocaleDateString('en-CA').replace(/-/g, '');
      const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString('en-CA').replace(/-/g, '');
      const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toLocaleDateString('en-CA').replace(/-/g, '');

      const ts = Date.now();

      const fetchLeague = async (lg) => {
        const path = {'NCAA':'basketball/mens-college-basketball','CFB':'football/college-football','NBA':'basketball/nba','NFL':'football/nfl','MLB':'baseball/mlb'}[lg];
        if (!path) return [];
        
        const [res1, res2, res3] = await Promise.all([
          CapacitorHttp.get({ url: `https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${todayStr}&limit=1000&_=${ts}` }),
          CapacitorHttp.get({ url: `https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${yesterdayStr}&limit=1000&_=${ts}` }),
          CapacitorHttp.get({ url: `https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${tomorrowStr}&limit=1000&_=${ts}` })
        ]);

        const safeParse = (res) => {
            if (res.data && typeof res.data === 'object') return res.data;
            if (res.data && typeof res.data === 'string') {
                try { return JSON.parse(res.data); } catch(e) { return {}; }
            }
            return {};
        };

        const data1 = safeParse(res1);
        const data2 = safeParse(res2);
        const data3 = safeParse(res3);

        const events1 = (data1.events || []).map(e => ({...e, _league: lg}));
        const events2 = (data2.events || []).map(e => ({...e, _league: lg}));
        const events3 = (data3.events || []).map(e => ({...e, _league: lg}));
        return [...events1, ...events2, ...events3];
      };

      // FIX: Read from ref so we always get the latest enabled leagues
      const currentLeagues = enabledLeaguesRef.current;
      const targets = Object.keys(currentLeagues).filter(l => currentLeagues[l]);
      const allRaw = (await Promise.all(targets.map(fetchLeague))).flat();
      const uniq = Array.from(new Map(allRaw.map(e => [e.id, e])).values());
      
      setDebugMsg(`Lgs: ${targets.length} | Raw: ${uniq.length}`);
      setRawGameEvents(uniq);

    } catch (e) { 
        console.error(e); 
        setDebugMsg(`Err: ${e.message}`);
    } finally { setLoading(false); }
  }, []); // no deps needed — reads from refs

  useEffect(() => {
    // Give the native bridge more time to fully initialize before hitting push APIs
    setTimeout(() => initNativeRegistration(), 1500);
    checkLiveScores();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => { 
    try {
      localStorage.setItem('tl_hated_teams', JSON.stringify(hatedTeams)); 
      if (fcmToken) syncPreferencesWithServer(fcmToken, hatedTeams);
    } catch (e) {}
  }, [hatedTeams]);

  useEffect(() => {
    try {
      localStorage.setItem('tl_notified_games', JSON.stringify(notifiedGames));
    } catch (e) {}
  }, [notifiedGames]);

  useEffect(() => {
    if (celebration) {
        const timer = setTimeout(() => setShowCelebration(true), 50);
        return () => clearTimeout(timer);
    } else {
        setShowCelebration(false);
    }
  }, [celebration]);

  // FIX: Pure computation in useMemo — no side effects
  const gameResults = useMemo(() => {
      return rawGameEvents.map(event => {
        const h = event.competitions[0].competitors.find(c=>c.homeAway==='home'), a = event.competitions[0].competitors.find(c=>c.homeAway==='away');
        if(!h||!a) return null;
        
        const isHated = (tObj) => {
          const apiAbbr = tObj.team.abbreviation.toLowerCase();
          const apiName = tObj.team.name.toLowerCase(); 
          const apiLoc = tObj.team.location.toLowerCase(); 

          return hatedTeams.some(hId => {
            const tData = ALL_TEAMS_DATA.find(t => t.id === hId);
            if (!tData) return false;
            if (tData.league !== event._league) return false;
            const idAbbr = hId.split('_')[0];
            if (idAbbr === apiAbbr) return true;
            if (tData.mascot.toLowerCase() === apiName) return true;
            if (tData.name.toLowerCase() === apiLoc) return true;
            return false;
          });
        };

        const hatedHome = isHated(h), hatedAway = isHated(a);
        if(!hatedHome && !hatedAway) return null;
        
        let pRaw = hatedHome ? h : a, oRaw = hatedHome ? a : h;
        const pA = pRaw.team.abbreviation.toLowerCase(), oA = oRaw.team.abbreviation.toLowerCase();
        const hConf = ALL_TEAMS_DATA.find(t => t.league === event._league && t.id.startsWith(pA)) || { name: pRaw.team.location, mascot: pRaw.team.name, color: `#${pRaw.team.color}`, id: pRaw.team.abbreviation };
        const oConf = ALL_TEAMS_DATA.find(t => t.league === event._league && t.id.startsWith(oA)) || { name: oRaw.team.location, mascot: oRaw.team.name, color: `#${oRaw.team.color}`, id: oRaw.team.abbreviation };

        const sH = Number(h.score) || 0, sA = Number(a.score) || 0;
        const isF = event.status.type.completed || event.status.type.state === 'post' || (event.status.type.shortDetail && event.status.type.shortDetail.toLowerCase().includes('final'));

        let status = 'SCHEDULED';
        if (event.status.type.state === 'in') status = 'PLAYING';
        if (isF) status = ((hatedHome && sH < sA) || (hatedAway && sA < sH)) ? 'LOST' : 'WON';
        
        return { 
          team: { ...hConf, score: Number(pRaw.score) || 0 }, 
          opponentTeam: { ...oConf, score: Number(oRaw.score) || 0 }, 
          status, gameId: event.id, league: event._league, gameDate: event.date
        };
      }).filter(Boolean);
  }, [rawGameEvents, hatedTeams]);

  // FIX: Side effects (celebration trigger) moved to useEffect reacting to gameResults
  useEffect(() => {
    // Keep ref in sync for notification tap handlers
    gameResultsRef.current = gameResults;

    gameResults.forEach(g => {
      if (g.status === 'LOST' && !notifiedGames.includes(g.gameId)) {
        setCelebration({
          gif: pickRandom(CELEBRATION_GIFS_LIST),
          game: g,
          tagline: pickRandom(CELEBRATION_ONELINERS)
        });
        setNotifiedGames(prev => [...prev, g.gameId]);
      }
    });

    // If there's a pending notification tap waiting for gameResults, try to match it now
    if (pendingNotificationRef.current && gameResults.length > 0) {
      const matched = showCelebrationFromNotification(pendingNotificationRef.current);
      if (matched) pendingNotificationRef.current = null;
    }
  // We intentionally only run this when gameResults changes.
  // notifiedGames is read but we don't want it as a dep (would cause loops).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameResults]);

  const displayResults = gameResults.filter(g => g.status === 'LOST');

  const getStoryUrl = (league, gameId) => {
    const slugMap = { 'NBA': 'nba', 'NFL': 'nfl', 'MLB': 'mlb', 'NCAA': 'mens-college-basketball', 'CFB': 'college-football' };
    const slug = slugMap[league] || 'nba';
    return `https://www.espn.com/${slug}/game/_/gameId/${gameId}`;
  };

  const getGameLabel = (dateStr) => {
    if (!dateStr) return '';
    const gDate = new Date(dateStr);
    const today = new Date();
    gDate.setHours(0,0,0,0); today.setHours(0,0,0,0);
    const diffTime = today - gDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays === 1) return 'YESTERDAY';
    if (diffDays === 0) return 'TODAY';
    return '';
  };

  const toggleHate = (id) => { 
    setHatedTeams(prev => {
      const isRemoving = prev.includes(id);
      if (isRemoving) {
        setNotifiedGames(notified => notified.filter(gameId => {
          const game = rawGameEvents.find(e => e.id === gameId);
          if (!game) return true;
          
          const h = game.competitions?.[0]?.competitors?.find(c => c.homeAway === 'home');
          const a = game.competitions?.[0]?.competitors?.find(c => c.homeAway === 'away');
          if (!h || !a) return true;
          
          const teamAbbr = id.split('_')[0];
          const homeAbbr = h.team.abbreviation.toLowerCase();
          const awayAbbr = a.team.abbreviation.toLowerCase();
          
          return homeAbbr !== teamAbbr && awayAbbr !== teamAbbr;
        }));
        return prev.filter(t => t !== id);
      } else {
        // When ADDING a team, pre-mark any already-finished losses as notified
        // so the celebration doesn't fire for old results
        const tData = ALL_TEAMS_DATA.find(t => t.id === id);
        if (tData) {
          const existingLossIds = rawGameEvents.filter(event => {
            if (!event.status?.type?.completed && event.status?.type?.state !== 'post') return false;
            const h = event.competitions?.[0]?.competitors?.find(c => c.homeAway === 'home');
            const a = event.competitions?.[0]?.competitors?.find(c => c.homeAway === 'away');
            if (!h || !a) return false;
            if (event._league !== tData.league) return false;
            
            const idAbbr = id.split('_')[0];
            const apiAbbrH = h.team.abbreviation.toLowerCase();
            const apiAbbrA = a.team.abbreviation.toLowerCase();
            const isHome = idAbbr === apiAbbrH || tData.mascot.toLowerCase() === h.team.name.toLowerCase();
            const isAway = idAbbr === apiAbbrA || tData.mascot.toLowerCase() === a.team.name.toLowerCase();
            if (!isHome && !isAway) return false;
            
            const sH = Number(h.score) || 0, sA = Number(a.score) || 0;
            return (isHome && sH < sA) || (isAway && sA < sH);
          }).map(e => e.id);
          
          if (existingLossIds.length > 0) {
            setNotifiedGames(notified => [...new Set([...notified, ...existingLossIds])]);
          }
        }
        return [...prev, id];
      }
    }); 
  };

  const manageList = useMemo(() => {
      return ALL_TEAMS_DATA.filter(t => t.league === activeLeague && (searchTerm === '' || String(t.name).toLowerCase().includes(searchTerm.toLowerCase()) || String(t.mascot).toLowerCase().includes(searchTerm.toLowerCase()))).sort((a,b) => String(a.name).localeCompare(String(b.name)));
  }, [activeLeague, searchTerm]);

  // FIX: Stable random history — re-rolls only on explicit refresh via randomSeed
  const randomHistory = useMemo(() => {
      if (hatedTeams.length === 0) return null;
      const availableHistory = [];
      hatedTeams.forEach(teamId => {
          const simpleId = teamId.split('_')[0]; 
          if (HISTORIC_LOSSES[simpleId]) {
              HISTORIC_LOSSES[simpleId].forEach(h => availableHistory.push({...h, teamId}));
          }
      });
      if (availableHistory.length === 0) return null;
      const picked = pickRandom(availableHistory);
      const pickedHeader = pickRandom(HISTORY_HEADERS);
      return {
          teamId: picked.teamId,
          title: picked[1],
          score: picked[2],
          date: picked[3],
          blurb: picked[4],
          header: pickedHeader
      };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hatedTeams, randomSeed]);

  const openShare = (g) => {
    const lib = {
      Casual: [
        "So... [TEAM] lost [SCORE]-[OPP_SCORE]. 😬 [LINK]",
        "Yes! [TEAM] dropped one. [SCORE]-[OPP_SCORE]. [LINK]",
        "Welp. [TEAM] just lost [SCORE]-[OPP_SCORE] 🤷 [LINK]",
        "Update: [TEAM] couldn't pull it off. [SCORE]-[OPP_SCORE]. [LINK]",
        "Not their night... [TEAM] lost [SCORE]-[OPP_SCORE]. [LINK]",
        "[TEAM] took the L tonight. [SCORE]-[OPP_SCORE]. [LINK]",
        "Well well well... [TEAM] lost [SCORE]-[OPP_SCORE] 👀 [LINK]",
        "Just checking in: [TEAM] lost [SCORE]-[OPP_SCORE]. [LINK]",
        "Friendly reminder that [TEAM] lost today. [SCORE]-[OPP_SCORE]. [LINK]",
        "Tough day for [TEAM] fans. [SCORE]-[OPP_SCORE]. [LINK]",
        "In case you missed it: [TEAM] lost [SCORE]-[OPP_SCORE]. [LINK]"
      ],
      'THEY LOST': [
        "FINAL: [TEAM] [SCORE], [OPP] [OPP_SCORE]. [LINK]",
        "THEY LOST! [TEAM] [SCORE], [OPP] [OPP_SCORE]. [LINK]",
        "GAME OVER: [TEAM] falls [SCORE]-[OPP_SCORE]. [LINK]",
        "IT HAPPENED. [TEAM] [SCORE], [OPP] [OPP_SCORE]. [LINK]",
        "[TEAM] LOST [SCORE]-[OPP_SCORE] 🎉 [LINK]",
        "LOSS ALERT: [TEAM] [SCORE], [OPP] [OPP_SCORE]. [LINK]",
        "🚨 [TEAM] DEFEATED 🚨 [SCORE]-[OPP_SCORE]. [LINK]",
        "Another one bites the dust: [TEAM] [SCORE]-[OPP_SCORE]. [LINK]",
        "[TEAM] GOES DOWN [SCORE]-[OPP_SCORE]. [LINK]",
        "CONFIRMED: [TEAM] lost to [OPP] [SCORE]-[OPP_SCORE]. [LINK]"
      ],
      Toxic: [
        "YEP! [SCORE]-[OPP_SCORE]. [TEAM] BLEW IT. 📉🤡 [LINK]",
        "LMAOOO [TEAM] really lost [SCORE]-[OPP_SCORE] 💀 [LINK]",
        "Embarrassing. [TEAM] got smoked [SCORE]-[OPP_SCORE]. 😂 [LINK]",
        "[TEAM] = 🗑️. Lost [SCORE]-[OPP_SCORE]. [LINK]",
        "How did [TEAM] manage to lose [SCORE]-[OPP_SCORE]? 🤦 [LINK]",
        "Another L for [TEAM]. [SCORE]-[OPP_SCORE]. Yikes. 💩 [LINK]",
        "[TEAM] got absolutely cooked. [SCORE]-[OPP_SCORE]. 🔥😭 [LINK]",
        "[TEAM] woke up and chose LOSING today. [SCORE]-[OPP_SCORE]. 😭 [LINK]",
        "Down HORRENDOUS: [TEAM] [SCORE]-[OPP_SCORE] 💀💀💀 [LINK]",
        "[TEAM] folded like a lawn chair. [SCORE]-[OPP_SCORE]. 🪑 [LINK]",
        "Couldn't happen to a nicer team 🙃 [TEAM] [SCORE]-[OPP_SCORE] [LINK]",
        "[TEAM] taking Ls like it's their job. [SCORE]-[OPP_SCORE]. 📉 [LINK]",
        "GET WRECKED: [TEAM] [SCORE]-[OPP_SCORE] 🤡 [LINK]",
        "[TEAM] got sent to the shadow realm. [SCORE]-[OPP_SCORE]. ☠️ [LINK]"
      ]
    };
    
    const format = (t) => {
      return t
        .replace('[TEAM]', String(g.team.name))
        .replace('[SCORE]', String(g.team.score))
        .replace('[OPP_SCORE]', String(g.opponentTeam.score))
        .replace('[OPP]', String(g.opponentTeam.name))
        .replace('[LINK]', getStoryUrl(g.league, g.gameId));
    };
    
    setShareOptions(
      Object.entries(lib).map(([k, v]) => ({
        label: k,
        text: format(pickRandom(v))
      }))
    );
    setShareModal(g);
  };

  const doShare = async (txt, index) => {
    // FIX: Use modern clipboard API with fallback
    await copyToClipboard(txt);
    setCopiedIndex(index); 
    setTimeout(() => { setCopiedIndex(null); setShareModal(null); }, 1000);
  };

  if (showOnboarding) return <Onboarding onComplete={() => { try { localStorage.setItem('tl_onboarded','true'); } catch(e) {} setShowOnboarding(false); setView('scoreboard'); }} />;

  return (
    <div className={`w-full md:max-w-md mx-auto min-h-screen ${styles.bg} ${styles.text} relative flex flex-col h-[100dvh]`}>
      <header className={`p-4 sticky top-0 z-30 shrink-0 flex justify-between items-center ${styles.header} pt-[calc(env(safe-area-inset-top)+1rem)]`}>
        <div onClick={() => checkLiveScores(true)} className="flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity">
            <div className="w-10 h-10 rounded-md overflow-hidden bg-white p-0.5 shadow-sm flex items-center justify-center flex-shrink-0 relative">
               <div className="w-full h-full relative bg-blue-600 rounded-md flex items-center justify-center">
                 {!imgError ? (
                    <img src={APP_ICON} onError={() => setImgError(true)} alt="Icon" className="w-full h-full object-cover rounded-md bg-transparent z-10" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white"><Trophy size={16} /></div>
                 )}
               </div>
            </div>
            <h1 className="font-black text-lg italic whitespace-nowrap uppercase tracking-tighter">They Lost!</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => checkLiveScores(true)} className="p-2 hover:bg-black/10 rounded-lg"><RefreshCw size={22} className={loading ? "animate-spin" : ""} /></button>
          <button onClick={() => setView('scoreboard')} className={`p-2 rounded-lg ${view==='scoreboard'?'bg-black/20':''}`}><PartyPopper size={22}/></button>
          <button onClick={() => setView('manage')} className={`p-2 rounded-lg ${view==='manage'?'bg-black/20':''}`}><Target size={22}/></button>
          <button onClick={() => setView('settings')} className={`p-2 rounded-lg ${view==='settings'?'bg-black/20':''}`}><Settings size={22}/></button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-6 space-y-6">
        {view === 'scoreboard' && (
          <div className="space-y-6">
            {displayResults.length === 0 && !loading && (
              <div className={`text-center py-12 px-5 ${styles.card} border-dashed border-2 flex flex-col items-center justify-center`}>
                <div className="w-full max-w-[200px] aspect-square rounded-xl overflow-hidden mb-4 shadow-sm bg-slate-100">
                    <img src={randomWaitingGif} alt="Waiting..." className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-lg opacity-70 italic uppercase text-slate-500 mb-6">Waiting for the next final score...</h3>
                
                {randomHistory && (
                  <div className="w-full text-left bg-white p-4 rounded-xl border-l-4 border-red-500 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-red-500 font-bold uppercase text-[10px] tracking-widest">
                          <History size={14}/> {randomHistory.header}
                      </div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight mb-1">{randomHistory.title}</h4>
                      <div className="text-xs font-bold text-slate-400 mb-3">{randomHistory.score} • {randomHistory.date}</div>
                      <p className="text-sm text-slate-600 leading-snug">{randomHistory.blurb}</p>
                  </div>
                )}
              </div>
            )}

            {displayResults.map((g,i) => {
              const dateLabel = getGameLabel(g.gameDate);
              return (
                <div key={g.gameId} className={`relative overflow-hidden ${styles.card} border-2`}>
                  <div className={`p-2 text-center text-[10px] font-black uppercase ${g.status === 'LOST' ? styles.lossBanner : 'bg-slate-300 text-slate-700'}`}>
                      {g.status === 'LOST' ? `THEY LOST!${dateLabel ? ` • ${dateLabel}` : ''}` : 'PLAYING'}
                  </div>
                  <div className="p-5 flex justify-between items-center">
                    <div className="flex flex-col items-center w-1/3 text-center">
                      <div className="w-14 h-14 rounded-full mb-2 flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-white" style={{background:g.team.color}}>{String(g.team.id).substring(0,3).toUpperCase()}</div>
                      <span className="font-bold text-[10px] leading-tight uppercase">
                          {String(g.team.name).replace(String(g.team.mascot), '')} {String(g.team.mascot)}
                      </span>
                      <span className={`text-3xl font-black mt-1 ${g.status === 'LOST' ? 'text-red-500' : ''}`}>{String(g.team.score)}</span>
                    </div>
                    <div className="opacity-30 font-black italic text-sm">VS</div>
                    <div className="flex flex-col items-center w-1/3 opacity-80 text-center">
                      <div className="w-14 h-14 rounded-full mb-2 flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-white" style={{background: g.opponentTeam.color}}>{String(g.opponentTeam.id || '???').substring(0,3).toUpperCase()}</div>
                      <span className="font-bold text-[10px] leading-tight uppercase">
                          {String(g.opponentTeam.name).replace(String(g.opponentTeam.mascot), '')} {String(g.opponentTeam.mascot)}
                      </span>
                      <span className="text-3xl font-black text-slate-400 mt-1">{String(g.opponentTeam.score)}</span>
                    </div>
                  </div>
                  <div className="p-3 border-t bg-slate-50 flex gap-2">
                      <button onClick={()=>openShare(g)} className={`flex-1 py-2 rounded-lg text-xs font-bold ${styles.buttonPrimary}`}>Rub It In</button>
                      <a href={getStoryUrl(g.league, g.gameId)} target="_blank" rel="noopener noreferrer" className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition shadow-sm ${styles.buttonSecondary}`}>Story</a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === 'manage' && (
          <div className="space-y-4">
            <div className="flex gap-1 overflow-x-auto pb-2">
                {['NCAA', 'CFB', 'NBA', 'NFL', 'MLB'].filter(lg => enabledLeagues[lg]).map(lg => (
                    <button key={lg} onClick={() => setActiveLeague(lg)} className={`px-4 py-1 text-xs font-bold rounded-full whitespace-nowrap ${activeLeague===lg ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>{lg}</button>
                ))}
            </div>
            <div className="relative"><Search className="absolute left-3 top-3 opacity-40" size={16}/><input placeholder={`Search ${activeLeague}...`} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="w-full pl-10 py-3 border rounded-lg bg-white text-sm" /></div>
            <div className="space-y-2">
                {manageList.map(t => (
                    <button key={t.id} onClick={() => toggleHate(t.id)} className={`w-full p-3 rounded-xl border flex items-center justify-between transition ${hatedTeams.includes(t.id)?`border-red-500 bg-red-50`:''}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{background:t.color}}>{String(t.id).substring(0,3).toUpperCase()}</div>
                            <div className="text-left font-bold text-sm uppercase">{String(t.name).replace(String(t.mascot), '')} {String(t.mascot)}</div>
                        </div>
                        {hatedTeams.includes(t.id) && <Check size={18} className="text-red-500" />}
                    </button>
                ))}
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="space-y-6">
            {DEBUG_MODE && (<>
            <button onClick={() => initNativeRegistration()} className="w-full p-4 bg-blue-600 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform italic uppercase tracking-tighter">
              <Zap size={20}/> Force Handshake Retry
            </button>
            <button onClick={handleForceSync} className="w-full p-4 bg-blue-600 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform italic uppercase tracking-tighter">
              <RefreshCw size={20}/> Force Server Sync
            </button>
            <button onClick={() => setCelebration({
                gif: CELEBRATION_GIFS_LIST[0],
                tagline: "TESTING 1, 2, 3...",
                game: {
                    team: { name: "Duke", score: 60, color: '#003087' },
                    opponentTeam: { name: "UNC", score: 85, color: '#4B9CD3' },
                    league: "NCAA"
                }
            })} className="w-full p-4 bg-purple-600 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform italic uppercase tracking-tighter">
                <PartyPopper size={20}/> Test Celebration
            </button>
            <button onClick={() => testLocalNotification()} className="w-full p-4 bg-orange-600 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform italic uppercase tracking-tighter">
                <Bell size={20}/> Test Local Alert (2s)
            </button>
            
            <div className="p-4 bg-slate-200 rounded-xl break-all text-[10px] font-mono select-all active:bg-slate-300" onClick={async () => {
                if(fcmToken) {
                    await copyToClipboard(fcmToken);
                    alert('Token Copied to Clipboard!');
                }
            }}>
                <p className="font-bold mb-1 text-slate-500">DEBUG TOKEN (Tap to Copy):</p>
                {fcmToken || "Waiting for token..."}
            </div>
            </>)}

            <div className={`p-4 rounded-xl border-2 ${styles.card}`}>
                <h3 className="text-xs font-bold uppercase opacity-50 mb-3 tracking-widest">Sports</h3>
                {Object.keys(enabledLeagues).map(l=>(
                  <div key={l} className="flex justify-between items-center py-2 border-b last:border-0 border-slate-100 font-bold text-sm uppercase">
                    {String(l)} <button onClick={()=>setEnabledLeagues(p=>({...p,[l]:!p[l]}))} className={enabledLeagues[l]?'text-green-500':'text-slate-300'}>{enabledLeagues[l]?<ToggleRight size={32}/>:<ToggleLeft size={32}/>}</button>
                  </div>
                ))}
            </div>
            <button onClick={()=>{try{localStorage.clear();window.location.reload()}catch(e){}}} className="w-full py-3 text-red-400 text-xs font-bold flex justify-center items-center gap-1 uppercase tracking-widest"><LogOut size={14}/> Reset App</button>
            
            <p className="text-center text-[10px] opacity-20 font-black tracking-widest pb-6">v{APP_VERSION}</p>
          </div>
        )}
      </main>

      <footer className="p-2 px-4 bg-black/5 text-[10px] font-mono flex justify-between items-center border-t shrink-0">
        <span className="opacity-40">v{APP_VERSION}</span>
        {DEBUG_MODE && (
        <div className="flex gap-4 cursor-pointer" onClick={() => lastError && alert(`Bridge Error:\n\n${lastError}`)}>
          <span className="text-blue-600 font-bold">{syncStatus} • {debugMsg}</span>
        </div>
        )}
      </footer>

      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl text-slate-900">
            <div className="bg-slate-100 p-4 border-b flex justify-between font-bold text-slate-700">
                <span>Share Their Pain</span>
                <button onClick={()=>setShareModal(null)}><X/></button>
            </div>
            <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
              {shareOptions.map((opt,i) => (
                <button key={i} onClick={()=>doShare(opt.text, i)} className="w-full text-left p-3 rounded-xl border relative hover:bg-slate-50 transition-colors">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{String(opt.label)}</div>
                  <p className="text-sm font-medium">{String(opt.text)}</p>
                  {copiedIndex === i && (
                      <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center rounded-xl backdrop-blur-[1px]">
                          <span className="font-bold text-green-700 uppercase bg-white/90 px-3 py-1 rounded-full shadow-sm animate-in zoom-in">Copied!</span>
                      </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {celebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-0" onClick={() => setCelebration(null)}>
           <div 
             className={`w-full h-full flex flex-col relative overflow-hidden bg-white/5 backdrop-blur-sm transition-transform duration-700 ease-out ${showCelebration ? 'translate-y-0' : '-translate-y-full'}`}
             onClick={(e) => e.stopPropagation()} 
           >
              <Confetti />
              <div className="w-full bg-green-500 py-12 pb-24 shadow-2xl relative z-10 flex flex-col items-center justify-end" style={{height: '45%'}}>
                  <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white translate-y-1/2">
                    <img src={celebration.gif} alt="Celebration" className="w-full h-full object-cover" />
                  </div>
              </div>
              <div className="flex-1 bg-white flex flex-col items-center pt-32 px-6 text-center" onClick={() => setCelebration(null)}>
                  <h1 className="text-4xl font-black italic text-slate-900 mb-2 tracking-tighter uppercase animate-bounce">IT HAPPENED!</h1>
                  <div className="mt-4 mb-2">
                    <p className="text-xl font-bold text-slate-700 mb-3">
                      {celebration.game.opponentTeam.name} beat {celebration.game.team.name}
                    </p>
                    <p className="text-6xl font-black text-slate-900 my-2">{celebration.game.opponentTeam.score} - {celebration.game.team.score}</p>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm tracking-widest uppercase bg-slate-900 px-3 py-1 rounded-full mt-4">
                      <Target size={14} className="fill-current" /> {celebration.tagline} <Target size={14} className="fill-current" />
                  </div>
                  <p className="mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest">Tap anywhere to dismiss</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

window.onerror = function(message, source, lineno, colno, error) {
  if (!message.includes('Script error')) {
    alert(`System Error: ${message}`);
  }
};

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}