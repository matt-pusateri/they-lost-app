import React, { useState, useEffect } from 'react';
import { Trophy, AlertTriangle, RefreshCw, Share2, Plus, Trash2, X, Copy, PartyPopper, History, Filter, Search, Globe, Bell, ExternalLink, Palette, Settings, ToggleLeft, ToggleRight, Target, ChevronRight, Check, Activity, LogOut, Clock } from 'lucide-react';

// --- FIREBASE INTEGRATION (Mocked for Preview) ---
// In production, uncomment the import and remove this const:
// import { requestNotificationPermission } from './firebase';
const requestNotificationPermission = async () => {
  console.log("Simulating Notification Request (Preview Mode)");
  return "demo-token";
};

// --- ASSET DEFINITION ---
const CELEBRATION_GIFS = [
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

// --- THEME CONFIGURATION ---
const THEMES = {
  professional: {
    name: "Professional",
    bg: "bg-slate-100",
    text: "text-slate-900",
    header: "bg-blue-600 text-white shadow-md",
    card: "bg-white border-slate-200 shadow-sm rounded-2xl",
    cardBorder: "border-2",
    accent: "text-blue-600",
    accentBg: "bg-blue-50",
    buttonPrimary: "bg-blue-900 text-white hover:bg-blue-800",
    buttonSecondary: "bg-slate-200 text-slate-700 hover:bg-slate-300",
    nav: "bg-white border-t border-slate-200",
    navActive: "text-blue-600 bg-blue-50",
    navInactive: "text-slate-400 hover:bg-slate-50",
    font: "font-sans",
    lossBanner: "bg-green-600 text-white",
    winBanner: "bg-slate-200 text-slate-600"
  },
  midnight: {
    name: "Midnight",
    bg: "bg-slate-950",
    text: "text-slate-100",
    header: "bg-slate-900 text-white border-b border-slate-800",
    card: "bg-slate-900 border-slate-800 shadow-lg rounded-xl",
    cardBorder: "border",
    accent: "text-indigo-400",
    accentBg: "bg-slate-800",
    buttonPrimary: "bg-indigo-600 text-white hover:bg-indigo-500",
    buttonSecondary: "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700",
    nav: "bg-slate-900 border-t border-slate-800",
    navActive: "text-indigo-400 bg-slate-800",
    navInactive: "text-slate-500 hover:text-slate-300",
    font: "font-sans",
    lossBanner: "bg-indigo-600 text-white",
    winBanner: "bg-slate-800 text-slate-500"
  },
  playbook: {
    name: "Playbook",
    bg: "bg-emerald-50",
    text: "text-emerald-950",
    header: "bg-emerald-800 text-white border-b-4 border-emerald-600",
    card: "bg-white border-emerald-200 shadow-sm rounded-lg",
    cardBorder: "border",
    accent: "text-emerald-700",
    accentBg: "bg-emerald-100",
    buttonPrimary: "bg-emerald-800 text-white hover:bg-emerald-700",
    buttonSecondary: "bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50",
    nav: "bg-emerald-100 border-t border-emerald-200",
    navActive: "text-emerald-900 bg-white border border-emerald-200 font-bold",
    navInactive: "text-emerald-600 hover:text-emerald-800",
    font: "font-mono", // Technical/Tactical feel
    lossBanner: "bg-emerald-700 text-white",
    winBanner: "bg-emerald-100 text-emerald-700"
  }
};

// --- SPORTS DATA SERVICE ---
const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports';
const PROXY_URL = 'https://corsproxy.io/?'; 

const LEAGUE_MAP = {
  'NCAA': 'basketball/mens-college-basketball',
  'CFB': 'football/college-football', 
  'NBA': 'basketball/nba',
  'NFL': 'football/nfl',
  'MLB': 'baseball/mlb'
};

const getYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const processESPNData = (data, league) => {
  if (!data.events) return [];

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const lookbackWindow = new Date(todayStart);
  lookbackWindow.setDate(lookbackWindow.getDate() - 2);

  return data.events.filter(event => {
    if (league === 'NBA' || league === 'NCAA' || league === 'MLB') return true;
    const gameDate = new Date(event.date);
    return gameDate >= lookbackWindow;
  }).map(event => {
    const competition = event.competitions?.[0];
    if (!competition) return null;

    const home = competition.competitors?.find(c => c.homeAway === 'home');
    const away = competition.competitors?.find(c => c.homeAway === 'away');
    
    if (!home || !away) return null;

    const isFinal = event.status.type.completed;
    const isPreGame = event.status.type.state === 'pre'; 
    
    const homeScore = parseInt(home.score || '0');
    const awayScore = parseInt(away.score || '0');
    
    let loserId = null;
    let status = 'UPCOMING'; 

    if (isFinal) {
      if (homeScore < awayScore) loserId = home.team.abbreviation.toLowerCase();
      else if (awayScore < homeScore) loserId = away.team.abbreviation.toLowerCase();
      status = (loserId === null) ? 'WON' : 'LOST'; 
    } else if (!isPreGame) {
      status = 'PLAYING';
    }

    const gameDate = new Date(event.date);
    const isYesterday = gameDate < todayStart;

    return {
      gameId: event.id,
      league: league,
      isFinal: isFinal,
      isYesterday: isYesterday,
      rawStatus: status,
      homeTeam: {
        name: home.team.displayName,
        id: home.team.abbreviation.toLowerCase(),
        score: homeScore,
        logo: home.team.logo
      },
      awayTeam: {
        name: away.team.displayName,
        id: away.team.abbreviation.toLowerCase(),
        score: awayScore,
        logo: away.team.logo
      },
      loserId: loserId
    };
  }).filter(Boolean);
};

const fetchScoreboard = async (league) => {
  const sportPath = LEAGUE_MAP[league];
  if (!sportPath) return [];

  try {
    const cacheBuster = Math.floor(Math.random() * 10000);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date();
    dayBefore.setDate(dayBefore.getDate() - 2);

    const datesToFetch = [
      getYYYYMMDD(today), 
      getYYYYMMDD(yesterday),
      getYYYYMMDD(dayBefore)
    ];

    const promises = datesToFetch.map(dateStr => {
      let targetUrl = `${BASE_URL}/${sportPath}/scoreboard?limit=1000&dates=${dateStr}&cb=${cacheBuster}`;
      if (league === 'NCAA') targetUrl += '&groups=50';
      if (league === 'CFB') targetUrl += '&groups=80';
      return fetch(PROXY_URL + encodeURIComponent(targetUrl))
        .then(res => res.ok ? res.json() : { events: [] })
        .catch(err => {
             console.error("Fetch error for date " + dateStr, err);
             return { events: [] };
        });
    });

    const results = await Promise.all(promises);
    const allEvents = results.flatMap(data => data.events || []);
    const uniqueEvents = Array.from(new Map(allEvents.map(item => [item.id, item])).values());
    
    return processESPNData({ events: uniqueEvents }, league);

  } catch (error) {
    console.error(`Error fetching ${league} scores:`, error);
    return [];
  }
};

const HappyGuyIcon = ({ className }) => (
  <span className={`${className} flex items-center justify-center leading-none`} role="img" aria-label="Happy Face">
    😄
  </span>
);

// --- TEAMS DATA ---
const ALL_TEAMS = [
  // MLB
  { id: 'bal_mlb', league: 'MLB', name: 'Baltimore', mascot: 'Orioles', color: '#DF4601', conf: 'AL East' },
  { id: 'bos_mlb', league: 'MLB', name: 'Boston', mascot: 'Red Sox', color: '#BD3039', conf: 'AL East' },
  { id: 'nyy_mlb', league: 'MLB', name: 'NY Yankees', mascot: 'Yankees', color: '#003087', conf: 'AL East' },
  { id: 'tb_mlb', league: 'MLB', name: 'Tampa Bay', mascot: 'Rays', color: '#092C5C', conf: 'AL East' },
  { id: 'tor_mlb', league: 'MLB', name: 'Toronto', mascot: 'Blue Jays', color: '#134A8E', conf: 'AL East' },
  { id: 'cws_mlb', league: 'MLB', name: 'Chi White Sox', mascot: 'White Sox', color: '#27251F', conf: 'AL Central' },
  { id: 'cle_mlb', league: 'MLB', name: 'Cleveland', mascot: 'Guardians', color: '#00385D', conf: 'AL Central' },
  { id: 'det_mlb', league: 'MLB', name: 'Detroit', mascot: 'Tigers', color: '#0C2340', conf: 'AL Central' },
  { id: 'kc_mlb', league: 'MLB', name: 'Kansas City', mascot: 'Royals', color: '#004687', conf: 'AL Central' },
  { id: 'min_mlb', league: 'MLB', name: 'Minnesota', mascot: 'Twins', color: '#002B5C', conf: 'AL Central' },
  { id: 'hou_mlb', league: 'MLB', name: 'Houston', mascot: 'Astros', color: '#002D62', conf: 'AL West' },
  { id: 'laa_mlb', league: 'MLB', name: 'LA Angels', mascot: 'Angels', color: '#BA0021', conf: 'AL West' },
  { id: 'oak_mlb', league: 'MLB', name: 'Oakland', mascot: 'Athletics', color: '#003831', conf: 'AL West' },
  { id: 'sea_mlb', league: 'MLB', name: 'Seattle', mascot: 'Mariners', color: '#0C2C56', conf: 'AL West' },
  { id: 'tex_mlb', league: 'MLB', name: 'Texas', mascot: 'Rangers', color: '#003278', conf: 'AL West' },
  { id: 'atl_mlb', league: 'MLB', name: 'Atlanta', mascot: 'Braves', color: '#13274F', conf: 'NL East' },
  { id: 'mia_mlb', league: 'MLB', name: 'Miami', mascot: 'Marlins', color: '#00A3E0', conf: 'NL East' },
  { id: 'nym_mlb', league: 'MLB', name: 'NY Mets', mascot: 'Mets', color: '#002D72', conf: 'NL East' },
  { id: 'phi_mlb', league: 'MLB', name: 'Philadelphia', mascot: 'Phillies', color: '#E81828', conf: 'NL East' },
  { id: 'wsh_mlb', league: 'MLB', name: 'Washington', mascot: 'Nationals', color: '#AB0003', conf: 'NL East' },
  { id: 'chc_mlb', league: 'MLB', name: 'Chi Cubs', mascot: 'Cubs', color: '#0E3386', conf: 'NL Central' },
  { id: 'cin_mlb', league: 'MLB', name: 'Cincinnati', mascot: 'Reds', color: '#C6011F', conf: 'NL Central' },
  { id: 'mil_mlb', league: 'MLB', name: 'Milwaukee', mascot: 'Brewers', color: '#12284B', conf: 'NL Central' },
  { id: 'pit_mlb', league: 'MLB', name: 'Pittsburgh', mascot: 'Pirates', color: '#FDB827', conf: 'NL Central' },
  { id: 'stl_mlb', league: 'MLB', name: 'St. Louis', mascot: 'Cardinals', color: '#C41E3A', conf: 'NL Central' },
  { id: 'ari_mlb', league: 'MLB', name: 'Arizona', mascot: 'Diamondbacks', color: '#A71930', conf: 'NL West' },
  { id: 'col_mlb', league: 'MLB', name: 'Colorado', mascot: 'Rockies', color: '#333366', conf: 'NL West' },
  { id: 'lad_mlb', league: 'MLB', name: 'LA Dodgers', mascot: 'Dodgers', color: '#005A9C', conf: 'NL West' },
  { id: 'sd_mlb', league: 'MLB', name: 'San Diego', mascot: 'Padres', color: '#2F241D', conf: 'NL West' },
  { id: 'sf_mlb', league: 'MLB', name: 'San Francisco', mascot: 'Giants', color: '#FD5A1E', conf: 'NL West' },
  // NCAA BB
  { id: 'duke', league: 'NCAA', name: 'Duke', mascot: 'Blue Devils', color: '#003087', conf: 'ACC' },
  { id: 'unc', league: 'NCAA', name: 'North Carolina', mascot: 'Tar Heels', color: '#99badd', conf: 'ACC' },
  { id: 'uva', league: 'NCAA', name: 'Virginia', mascot: 'Cavaliers', color: '#232D4B', conf: 'ACC' },
  { id: 'mia', league: 'NCAA', name: 'Miami', mascot: 'Hurricanes', color: '#F47321', conf: 'ACC' }, 
  { id: 'ncst', league: 'NCAA', name: 'NC State', mascot: 'Wolfpack', color: '#CC0000', conf: 'ACC' },
  { id: 'msu', league: 'NCAA', name: 'Michigan St', mascot: 'Spartans', color: '#18453B', conf: 'Big Ten' },
  { id: 'mich', league: 'NCAA', name: 'Michigan', mascot: 'Wolverines', color: '#00274C', conf: 'Big Ten' },
  { id: 'osu', league: 'NCAA', name: 'Ohio State', mascot: 'Buckeyes', color: '#BB0000', conf: 'Big Ten' },
  { id: 'iu', league: 'NCAA', name: 'Indiana', mascot: 'Hoosiers', color: '#990000', conf: 'Big Ten' },
  { id: 'pur', league: 'NCAA', name: 'Purdue', mascot: 'Boilermakers', color: '#CEB888', conf: 'Big Ten' },
  { id: 'ill', league: 'NCAA', name: 'Illinois', mascot: 'Illini', color: '#E84A27', conf: 'Big Ten' },
  { id: 'ucla', league: 'NCAA', name: 'UCLA', mascot: 'Bruins', color: '#2D68C4', conf: 'Big Ten' },
  { id: 'usc', league: 'NCAA', name: 'USC', mascot: 'Trojans', color: '#990000', conf: 'Big Ten' },
  { id: 'md', league: 'NCAA', name: 'Maryland', mascot: 'Terrapins', color: '#E03A3E', conf: 'Big Ten' },
  { id: 'uky', league: 'NCAA', name: 'Kentucky', mascot: 'Wildcats', color: '#0033A0', conf: 'SEC' },
  { id: 'ala', league: 'NCAA', name: 'Alabama', mascot: 'Crimson Tide', color: '#9E1B32', conf: 'SEC' },
  { id: 'aub', league: 'NCAA', name: 'Auburn', mascot: 'Tigers', color: '#0C2340', conf: 'SEC' },
  { id: 'tenn', league: 'NCAA', name: 'Tennessee', mascot: 'Volunteers', color: '#FF8200', conf: 'SEC' },
  { id: 'fla', league: 'NCAA', name: 'Florida', mascot: 'Gators', color: '#0021A5', conf: 'SEC' },
  { id: 'ark', league: 'NCAA', name: 'Arkansas', mascot: 'Razorbacks', color: '#9D2235', conf: 'SEC' },
  { id: 'tex', league: 'NCAA', name: 'Texas', mascot: 'Longhorns', color: '#BF5700', conf: 'SEC' },
  { id: 'ku', league: 'NCAA', name: 'Kansas', mascot: 'Jayhawks', color: '#0051BA', conf: 'Big 12' },
  { id: 'bay', league: 'NCAA', name: 'Baylor', mascot: 'Bears', color: '#154734', conf: 'Big 12' },
  { id: 'hou', league: 'NCAA', name: 'Houston', mascot: 'Cougars', color: '#C8102E', conf: 'Big 12' },
  { id: 'isu', league: 'NCAA', name: 'Iowa State', mascot: 'Cyclones', color: '#C8102E', conf: 'Big 12' },
  { id: 'ari', league: 'NCAA', name: 'Arizona', mascot: 'Wildcats', color: '#CC0033', conf: 'Big 12' },
  { id: 'conn', league: 'NCAA', name: 'UConn', mascot: 'Huskies', color: '#000E2F', conf: 'Big East' },
  { id: 'nova', league: 'NCAA', name: 'Villanova', mascot: 'Wildcats', color: '#00205B', conf: 'Big East' },
  { id: 'marq', league: 'NCAA', name: 'Marquette', mascot: 'Golden Eagles', color: '#003366', conf: 'Big East' },
  { id: 'stj', league: 'NCAA', name: "St. John's", mascot: 'Red Storm', color: '#BA0C2F', conf: 'Big East' },
  { id: 'gonz', league: 'NCAA', name: 'Gonzaga', mascot: 'Bulldogs', color: '#041E42', conf: 'WCC' },
  { id: 'gtown', league: 'NCAA', name: 'Georgetown', mascot: 'Hoyas', color: '#041E42', conf: 'Big East' },
  // CFB
  { id: 'ala_fb', league: 'CFB', name: 'Alabama', mascot: 'Crimson Tide', color: '#9E1B32', conf: 'SEC' },
  { id: 'uga', league: 'CFB', name: 'Georgia', mascot: 'Bulldogs', color: '#BA0C2F', conf: 'SEC' },
  { id: 'tex_fb', league: 'CFB', name: 'Texas', mascot: 'Longhorns', color: '#BF5700', conf: 'SEC' },
  { id: 'lsu', league: 'CFB', name: 'LSU', mascot: 'Tigers', color: '#461D7C', conf: 'SEC' },
  { id: 'tenn_fb', league: 'CFB', name: 'Tennessee', mascot: 'Volunteers', color: '#FF8200', conf: 'SEC' },
  { id: 'ole', league: 'CFB', name: 'Ole Miss', mascot: 'Rebels', color: '#CE1126', conf: 'SEC' },
  { id: 'miz', league: 'CFB', name: 'Missouri', mascot: 'Tigers', color: '#F1B82D', conf: 'SEC' },
  { id: 'okl', league: 'CFB', name: 'Oklahoma', mascot: 'Sooners', color: '#841617', conf: 'SEC' },
  { id: 'fla_fb', league: 'CFB', name: 'Florida', mascot: 'Gators', color: '#0021A5', conf: 'SEC' },
  { id: 'aub_fb', league: 'CFB', name: 'Auburn', mascot: 'Tigers', color: '#0C2340', conf: 'SEC' },
  { id: 'tam', league: 'CFB', name: 'Texas A&M', mascot: 'Aggies', color: '#500000', conf: 'SEC' },
  { id: 'ark_fb', league: 'CFB', name: 'Arkansas', mascot: 'Razorbacks', color: '#9D2235', conf: 'SEC' },
  { id: 'uky_fb', league: 'CFB', name: 'Kentucky', mascot: 'Wildcats', color: '#0033A0', conf: 'SEC' },
  { id: 'sc', league: 'CFB', name: 'South Carolina', mascot: 'Gamecocks', color: '#73000A', conf: 'SEC' },
  { id: 'van', league: 'CFB', name: 'Vanderbilt', mascot: 'Commodores', color: '#000000', conf: 'SEC' },
  { id: 'msst', league: 'CFB', name: 'Miss State', mascot: 'Bulldogs', color: '#660000', conf: 'SEC' },
  { id: 'mich_fb', league: 'CFB', name: 'Michigan', mascot: 'Wolverines', color: '#00274C', conf: 'Big Ten' },
  { id: 'osu_fb', league: 'CFB', name: 'Ohio State', mascot: 'Buckeyes', color: '#BB0000', conf: 'Big Ten' },
  { id: 'psu', league: 'CFB', name: 'Penn State', mascot: 'Nittany Lions', color: '#041E42', conf: 'Big Ten' },
  { id: 'ore', league: 'CFB', name: 'Oregon', mascot: 'Ducks', color: '#154733', conf: 'Big Ten' },
  { id: 'wash', league: 'CFB', name: 'Washington', mascot: 'Huskies', color: '#4B2E83', conf: 'Big Ten' },
  { id: 'usc_fb', league: 'CFB', name: 'USC', mascot: 'Trojans', color: '#990000', conf: 'Big Ten' },
  { id: 'ucla_fb', league: 'CFB', name: 'UCLA', mascot: 'Bruins', color: '#2D68C4', conf: 'Big Ten' },
  { id: 'wis_fb', league: 'CFB', name: 'Wisconsin', mascot: 'Badgers', color: '#C5050C', conf: 'Big Ten' },
  { id: 'iowa', league: 'CFB', name: 'Iowa', mascot: 'Hawkeyes', color: '#FFCD00', conf: 'Big Ten' },
  { id: 'neb', league: 'CFB', name: 'Nebraska', mascot: 'Cornhuskers', color: '#E41C38', conf: 'Big Ten' },
  { id: 'msu_fb', league: 'CFB', name: 'Michigan St', mascot: 'Spartans', color: '#18453B', conf: 'Big Ten' },
  { id: 'minn_fb', league: 'CFB', name: 'Minnesota', mascot: 'Gophers', color: '#7A0019', conf: 'Big Ten' },
  { id: 'ill_fb', league: 'CFB', name: 'Illinois', mascot: 'Illini', color: '#E84A27', conf: 'Big Ten' },
  { id: 'pur_fb', league: 'CFB', name: 'Purdue', mascot: 'Boilermakers', color: '#CEB888', conf: 'Big Ten' },
  { id: 'umd_fb', league: 'CFB', name: 'Maryland', mascot: 'Terrapins', color: '#E03A3E', conf: 'Big Ten' },
  { id: 'rut', league: 'CFB', name: 'Rutgers', mascot: 'Scarlet Knights', color: '#CC0033', conf: 'Big Ten' },
  { id: 'ind_fb', league: 'CFB', name: 'Indiana', mascot: 'Hoosiers', color: '#990000', conf: 'Big Ten' },
  { id: 'nw', league: 'CFB', name: 'Northwestern', mascot: 'Wildcats', color: '#4E2A84', conf: 'Big Ten' },
  { id: 'fsu_fb', league: 'CFB', name: 'Florida St', mascot: 'Seminoles', color: '#782F40', conf: 'ACC' },
  { id: 'clem_fb', league: 'CFB', name: 'Clemson', mascot: 'Tigers', color: '#F56600', conf: 'ACC' },
  { id: 'mia_fb', league: 'CFB', name: 'Miami', mascot: 'Hurricanes', color: '#F47321', conf: 'ACC' },
  { id: 'unc_fb', league: 'CFB', name: 'North Carolina', mascot: 'Tar Heels', color: '#99badd', conf: 'ACC' },
  { id: 'ncst_fb', league: 'CFB', name: 'NC State', mascot: 'Wolfpack', color: '#CC0000', conf: 'ACC' },
  { id: 'duke_fb', league: 'CFB', name: 'Duke', mascot: 'Blue Devils', color: '#003087', conf: 'ACC' },
  { id: 'vt', league: 'CFB', name: 'Virginia Tech', mascot: 'Hokies', color: '#630031', conf: 'ACC' },
  { id: 'uva_fb', league: 'CFB', name: 'Virginia', mascot: 'Cavaliers', color: '#232D4B', conf: 'ACC' },
  { id: 'lou_fb', league: 'CFB', name: 'Louisville', mascot: 'Cardinals', color: '#C90031', conf: 'ACC' },
  { id: 'pitt', league: 'CFB', name: 'Pittsburgh', mascot: 'Panthers', color: '#003594', conf: 'ACC' },
  { id: 'syr_fb', league: 'CFB', name: 'Syracuse', mascot: 'Orange', color: '#F76900', conf: 'ACC' },
  { id: 'gt', league: 'CFB', name: 'Georgia Tech', mascot: 'Yellow Jackets', color: '#B3A369', conf: 'ACC' },
  { id: 'bc', league: 'CFB', name: 'Boston College', mascot: 'Eagles', color: '#98002E', conf: 'ACC' },
  { id: 'wake_fb', league: 'CFB', name: 'Wake Forest', mascot: 'Demon Deacons', color: '#9E7E38', conf: 'ACC' },
  { id: 'cal', league: 'CFB', name: 'Cal', mascot: 'Golden Bears', color: '#003262', conf: 'ACC' },
  { id: 'stan', league: 'CFB', name: 'Stanford', mascot: 'Cardinal', color: '#8C1515', conf: 'ACC' },
  { id: 'smu', league: 'CFB', name: 'SMU', mascot: 'Mustangs', color: '#0033A0', conf: 'ACC' },
  { id: 'okst', league: 'CFB', name: 'Oklahoma St', mascot: 'Cowboys', color: '#FF7300', conf: 'Big 12' },
  { id: 'ksu', league: 'CFB', name: 'Kansas St', mascot: 'Wildcats', color: '#512888', conf: 'Big 12' },
  { id: 'ku_fb', league: 'CFB', name: 'Kansas', mascot: 'Jayhawks', color: '#0051BA', conf: 'Big 12' },
  { id: 'isu_fb', league: 'CFB', name: 'Iowa State', mascot: 'Cyclones', color: '#C8102E', conf: 'Big 12' },
  { id: 'utah', league: 'CFB', name: 'Utah', mascot: 'Utes', color: '#CC0000', conf: 'Big 12' },
  { id: 'ari_fb', league: 'CFB', name: 'Arizona', mascot: 'Wildcats', color: '#CC0033', conf: 'Big 12' },
  { id: 'asu', league: 'CFB', name: 'Arizona St', mascot: 'Sun Devils', color: '#8C1D40', conf: 'Big 12' },
  { id: 'colo', league: 'CFB', name: 'Colorado', mascot: 'Buffaloes', color: '#CFB87C', conf: 'Big 12' },
  { id: 'byu', league: 'CFB', name: 'BYU', mascot: 'Cougars', color: '#002E5D', conf: 'Big 12' },
  { id: 'tcu', league: 'CFB', name: 'TCU', mascot: 'Horned Frogs', color: '#4D1979', conf: 'Big 12' },
  { id: 'bay_fb', league: 'CFB', name: 'Baylor', mascot: 'Bears', color: '#154734', conf: 'Big 12' },
  { id: 'tt', league: 'CFB', name: 'Texas Tech', mascot: 'Red Raiders', color: '#CC0000', conf: 'Big 12' },
  { id: 'wvu', league: 'CFB', name: 'West Virginia', mascot: 'Mountaineers', color: '#002855', conf: 'Big 12' },
  { id: 'ucf', league: 'CFB', name: 'UCF', mascot: 'Knights', color: '#BA9B37', conf: 'Big 12' },
  { id: 'cin_fb', league: 'CFB', name: 'Cincinnati', mascot: 'Bearcats', color: '#E00122', conf: 'Big 12' },
  { id: 'hou_fb', league: 'CFB', name: 'Houston', mascot: 'Cougars', color: '#C8102E', conf: 'Big 12' },
  { id: 'nd', league: 'CFB', name: 'Notre Dame', mascot: 'Fighting Irish', color: '#0C2340', conf: 'Ind' },
  { id: 'orst', league: 'CFB', name: 'Oregon St', mascot: 'Beavers', color: '#DC4405', conf: 'Pac-12' },
  { id: 'wsu', league: 'CFB', name: 'Wash State', mascot: 'Cougars', color: '#981E32', conf: 'Pac-12' },

  // --- NFL ---
  { id: 'dal', league: 'NFL', name: 'Dallas', mascot: 'Cowboys', color: '#003594', conf: 'NFC East' },
  { id: 'phi', league: 'NFL', name: 'Philadelphia', mascot: 'Eagles', color: '#004C54', conf: 'NFC East' },
  { id: 'wsh', league: 'NFL', name: 'Washington', mascot: 'Commanders', color: '#5A1414', conf: 'NFC East' }, 
  { id: 'nyg', league: 'NFL', name: 'NY Giants', mascot: 'Giants', color: '#0B2265', conf: 'NFC East' },
  { id: 'chi', league: 'NFL', name: 'Chicago', mascot: 'Bears', color: '#0B162A', conf: 'NFC North' },
  { id: 'gb', league: 'NFL', name: 'Green Bay', mascot: 'Packers', color: '#203731', conf: 'NFC North' },
  { id: 'min', league: 'NFL', name: 'Minnesota', mascot: 'Vikings', color: '#4F2683', conf: 'NFC North' },
  { id: 'det', league: 'NFL', name: 'Detroit', mascot: 'Lions', color: '#0076B6', conf: 'NFC North' },
  { id: 'atl', league: 'NFL', name: 'Atlanta', mascot: 'Falcons', color: '#a71930', conf: 'NFC South' },
  { id: 'no', league: 'NFL', name: 'New Orleans', mascot: 'Saints', color: '#D3BC8D', conf: 'NFC South' },
  { id: 'tb', league: 'NFL', name: 'Tampa Bay', mascot: 'Buccaneers', color: '#D50A0A', conf: 'NFC South' },
  { id: 'car', league: 'NFL', name: 'Carolina', mascot: 'Panthers', color: '#0085CA', conf: 'NFC South' },
  { id: 'sf', league: 'NFL', name: 'San Fran', mascot: '49ers', color: '#AA0000', conf: 'NFC West' },
  { id: 'sea', league: 'NFL', name: 'Seattle', mascot: 'Seahawks', color: '#002244', conf: 'NFC West' },
  { id: 'lar', league: 'NFL', name: 'LA Rams', mascot: 'Rams', color: '#003594', conf: 'NFC West' },
  { id: 'ari', league: 'NFL', name: 'Arizona', mascot: 'Cardinals', color: '#97233F', conf: 'NFC West' },
  { id: 'ne', league: 'NFL', name: 'New England', mascot: 'Patriots', color: '#002244', conf: 'AFC East' },
  { id: 'buf', league: 'NFL', name: 'Buffalo', mascot: 'Bills', color: '#00338D', conf: 'AFC East' },
  { id: 'mia', league: 'NFL', name: 'Miami', mascot: 'Dolphins', color: '#008E97', conf: 'AFC East' },
  { id: 'nyj', league: 'NFL', name: 'NY Jets', mascot: 'Jets', color: '#125740', conf: 'AFC East' },
  { id: 'pit', league: 'NFL', name: 'Pittsburgh', mascot: 'Steelers', color: '#FFB612', conf: 'AFC North' },
  { id: 'bal', league: 'NFL', name: 'Baltimore', mascot: 'Ravens', color: '#241773', conf: 'AFC North' },
  { id: 'cin', league: 'NFL', name: 'Cincinnati', mascot: 'Bengals', color: '#FB4F14', conf: 'AFC North' },
  { id: 'cle', league: 'NFL', name: 'Cleveland', mascot: 'Browns', color: '#311D00', conf: 'AFC North' },
  { id: 'ind', league: 'NFL', name: 'Indianapolis', mascot: 'Colts', color: '#002C5F', conf: 'AFC South' },
  { id: 'ten', league: 'NFL', name: 'Tennessee', mascot: 'Titans', color: '#0C2340', conf: 'AFC South' },
  { id: 'jax', league: 'NFL', name: 'Jacksonville', mascot: 'Jaguars', color: '#006778', conf: 'AFC South' },
  { id: 'hou', league: 'NFL', name: 'Houston', mascot: 'Texans', color: '#03202F', conf: 'AFC South' },
  { id: 'kc', league: 'NFL', name: 'Kansas City', mascot: 'Chiefs', color: '#E31837', conf: 'AFC West' },
  { id: 'lv', league: 'NFL', name: 'Las Vegas', mascot: 'Raiders', color: '#000000', conf: 'AFC West' },
  { id: 'den', league: 'NFL', name: 'Denver', mascot: 'Broncos', color: '#FB4F14', conf: 'AFC West' },
  { id: 'lac', league: 'NFL', name: 'LA Chargers', mascot: 'Chargers', color: '#0080C6', conf: 'AFC West' },

  // --- NBA ---
  { id: 'bos', league: 'NBA', name: 'Boston', mascot: 'Celtics', color: '#007A33', conf: 'East' },
  { id: 'bkn', league: 'NBA', name: 'Brooklyn', mascot: 'Nets', color: '#000000', conf: 'East' },
  { id: 'ny', league: 'NBA', name: 'New York', mascot: 'Knicks', color: '#F58426', conf: 'East' }, 
  { id: 'phi', league: 'NBA', name: 'Philly', mascot: '76ers', color: '#006BB6', conf: 'East' },
  { id: 'tor', league: 'NBA', name: 'Toronto', mascot: 'Raptors', color: '#CE1141', conf: 'East' },
  { id: 'chi', league: 'NBA', name: 'Chicago', mascot: 'Bulls', color: '#CE1141', conf: 'East' },
  { id: 'cle', league: 'NBA', name: 'Cleveland', mascot: 'Cavaliers', color: '#860038', conf: 'East' },
  { id: 'det', league: 'NBA', name: 'Detroit', mascot: 'Pistons', color: '#C8102E', conf: 'East' },
  { id: 'ind', league: 'NBA', name: 'Indiana', mascot: 'Pacers', color: '#FDBB30', conf: 'East' },
  { id: 'mil', league: 'NBA', name: 'Milwaukee', mascot: 'Bucks', color: '#00471B', conf: 'East' },
  { id: 'atl', league: 'NBA', name: 'Atlanta', mascot: 'Hawks', color: '#E03A3E', conf: 'East' },
  { id: 'cha', league: 'NBA', name: 'Charlotte', mascot: 'Hornets', color: '#1D1160', conf: 'East' },
  { id: 'mia', league: 'NBA', name: 'Miami', mascot: 'Heat', color: '#98002E', conf: 'East' },
  { id: 'orl', league: 'NBA', name: 'Orlando', mascot: 'Magic', color: '#0077C0', conf: 'East' },
  { id: 'wsh', league: 'NBA', name: 'Washington', mascot: 'Wizards', color: '#002B5C', conf: 'East' },
  { id: 'den', league: 'NBA', name: 'Denver', mascot: 'Nuggets', color: '#0E2240', conf: 'East' },
  { id: 'min', league: 'NBA', name: 'Minnesota', mascot: 'Timberwolves', color: '#0C2340', conf: 'West' },
  { id: 'okc', league: 'NBA', name: 'OKC', mascot: 'Thunder', color: '#007AC1', conf: 'West' },
  { id: 'por', league: 'NBA', name: 'Portland', mascot: 'Trail Blazers', color: '#E03A3E', conf: 'West' },
  { id: 'uta', league: 'NBA', name: 'Utah', mascot: 'Jazz', color: '#002B5C', conf: 'West' },
  { id: 'gs', league: 'NBA', name: 'Golden State', mascot: 'Warriors', color: '#1D428A', conf: 'West' }, 
  { id: 'lac', league: 'NBA', name: 'LA Clippers', mascot: 'Clippers', color: '#C8102E', conf: 'West' },
  { id: 'lal', league: 'NBA', name: 'L.A.', mascot: 'Lakers', color: '#552583', conf: 'West' },
  { id: 'phx', league: 'NBA', name: 'Phoenix', mascot: 'Suns', color: '#1D1160', conf: 'West' },
  { id: 'sac', league: 'NBA', name: 'Sacramento', mascot: 'Kings', color: '#5A2D81', conf: 'West' },
  { id: 'dal', league: 'NBA', name: 'Dallas', mascot: 'Mavericks', color: '#00538C', conf: 'West' },
  { id: 'hou', league: 'NBA', name: 'Houston', mascot: 'Rockets', color: '#CE1141', conf: 'West' },
  { id: 'mem', league: 'NBA', name: 'Memphis', mascot: 'Grizzlies', color: '#5D76A9', conf: 'West' },
  { id: 'no', league: 'NBA', name: 'New Orleans', mascot: 'Pelicans', color: '#0C2340', conf: 'West' },
  { id: 'sas', league: 'NBA', name: 'San Antonio', mascot: 'Spurs', color: '#C4CED4', conf: 'West' },
];

const HISTORIC_LOSSES = {
  // --- NCAA ---
  duke: [
    { winnerId: 'unc', headline: "The Final Four Nightmare", score: "UNC 81, Duke 77", date: "April 2, 2022", desc: "The first ever tournament meeting. Coach K's final season. Caleb Love's dagger three sent K into retirement with an L." },
    { winnerId: 'unc', headline: "K's Final Home Game", score: "UNC 94, Duke 81", date: "March 5, 2022", desc: "The 'uninvited guests' ruined the retirement party. 96 former players watched Duke get blown out at Cameron." },
    { winnerId: 'unc', headline: "The Cormac Ryan Game", score: "UNC 84, Duke 79", date: "March 9, 2024", desc: "UNC swept the season series. Cormac Ryan dropped 31 points and waved goodbye to the Crazies." },
    { winnerId: 'unc', headline: "The Austin Rivers Shot", score: "Duke 85, UNC 84", date: "Feb 8, 2012", desc: "Wait, this is a Duke win... oh wait, you mean when UNC blew them out later? No, remember 2021? UNC 91, Duke 73. Roy's final win at Cameron." },
    { winnerId: 'unc', headline: "Jerami Grant's Dunk", score: "UNC 74, Duke 66", date: "Feb 20, 2014", desc: "UNC rallied from 11 down in the second half. Duke fans stormed the court... oh wait, they lost." },
    { winnerId: 'mercer', headline: "Mercer danced on them", score: "Mercer 78, Duke 71", date: "March 21, 2014", desc: "A #3 seed Duke team with Jabari Parker lost to a bunch of seniors from the Atlantic Sun." },
    { winnerId: 'lehigh', headline: "CJ McCollum happened", score: "Lehigh 75, Duke 70", date: "March 16, 2012", desc: "A #2 seed lost to a #15 seed. One of the biggest upsets in tournament history." },
    { winnerId: 'conn', headline: "1999 Championship", score: "UConn 77, Duke 74", date: "March 29, 1999", desc: "This Duke team was considered one of the best ever. Rip Hamilton and Khalid El-Amin had other plans." },
    { winnerId: 'unlv', headline: "103-73", score: "UNLV 103, Duke 73", date: "April 2, 1990", desc: "The biggest blowout in National Championship history. Men against boys." },
    { winnerId: 'sc', headline: "South Carolina upset", score: "S. Carolina 88, Duke 81", date: "March 19, 2017", desc: "Playing in South Carolina, the #2 seed Duke got bullied out of the tournament in the Round of 32." }
  ],
  ncst: [
    { winnerId: 'pur', headline: "Final Four Heartbreak", score: "Purdue 63, NC State 50", date: "April 6, 2024", desc: "The magic ran out. Edey was too big, and the shots stopped falling. A sad end to a miracle run." },
    { winnerId: 'vt', headline: "24 Points Total", score: "Va Tech 47, NC State 24", date: "Feb 2, 2019", desc: "State scored 24 points in an entire 40-minute basketball game. 24. They shot 16% from the floor." },
    { winnerId: 'unc', headline: "The 51-Point Loss", score: "UNC 107, NC State 56", date: "Jan 8, 2017", desc: "The game was postponed for snow. It should have been canceled. A historic beatdown in Chapel Hill." },
    { winnerId: 'unc', headline: "Roy Williams 5-0", score: "UNC 5-0 vs Gottfried", date: "2012-2017 Era", desc: "Roy Williams absolutely owned PNC Arena for years. It became the 'Dean Dome East'." },
    { winnerId: 'stl', headline: "The meltdown vs St Louis", score: "St. Louis 83, NC State 80", date: "March 20, 2014", desc: "State led by 16 with 5 minutes left. They forgot how to play basketball and lost in OT." },
    { winnerId: 'fla', headline: "Gottfried's last stand", score: "Florida 79, NC State 78", date: "March 27, 2005", desc: "Okay, this was actually Herb Sendek, but blowing a lead to lose in the Sweet 16 hurts forever." },
    { winnerId: 'conn', headline: "Calhoun's dominance", score: "UConn 77, NC State 74", date: "March 19, 2006", desc: "Another close tournament loss where the Wolfpack just couldn't get over the hump." },
    { winnerId: 'wfu', headline: "The CP3 Game", score: "Wake Forest 95, NC State 82", date: "Jan 2004", desc: "Chris Paul punched Julius Hodge in the... well, you know. State lost the game too." }
  ],
  
  // --- NBA ---
  bos: [
    { winnerId: 'lal', headline: "Game 7, 2010", score: "Lakers 83, Celtics 79", date: "June 17, 2010", desc: "Up 3-2 in the series. Rasheed Wallace played his heart out, but Kobe and Artest took the ring. The sweetest Lakers win ever." },
    { winnerId: 'lal', headline: "Baby Skyhook", score: "Lakers 107, Celtics 106", date: "June 9, 1987", desc: "Magic Johnson's junior skyhook across the lane stunned the Garden. 'Tragic Johnson' no more." },
    { winnerId: 'lal', headline: "Memorial Day Massacre", score: "Lakers 148, Celtics 114", date: "May 27, 1985", desc: "The Lakers absolutely destroyed them. The 'Ghost of the Garden' died that day." },
    { winnerId: 'lal', headline: "Ended the Streak", score: "Lakers 108, Celtics 102", date: "2008 Finals Gm 5", desc: "Okay they won the series, but the Lakers stealing a road game to keep the series alive was classic resistance." },
    { winnerId: 'lal', headline: "Showtime Arrives", score: "Lakers 4-2 Series", date: "June 1985", desc: "The first time the Lakers beat the Celtics in the Finals. Kareem was MVP at age 38." },
    { winnerId: 'mia', headline: "Game 7 at Home", score: "Heat 103, Celtics 84", date: "May 29, 2023", desc: "Fought back from 0-3 just to get blown out on their own floor in Game 7. Tatum rolled his ankle immediately." },
    { winnerId: 'gsw', headline: "Curry's Night Night", score: "Warriors 4-2 Series", date: "June 2022", desc: "Up 2-1 in the Finals. Then Steph Curry destroyed their soul in Boston. TD Garden went silent." },
    { winnerId: 'mia', headline: "LeBron's Stare", score: "Heat 98, Celtics 79", date: "June 7, 2012", desc: "Game 6. LeBron had 45 points and 15 rebounds. The look in his eyes ended the Pierce/KG era." },
    { winnerId: 'orl', headline: "Dwight's Block Party", score: "Magic 4-3 Series", date: "May 2009", desc: "The defending champs lost Game 7 at home to Dwight Howard and Hedo Turkoglu." },
    { winnerId: 'cle', headline: "LeBron again", score: "Cavs 87, Celtics 79", date: "May 27, 2018", desc: "Game 7 at home. Scary Terry couldn't hit a shot. LeBron dragged a terrible Cavs team past them." }
  ],
  det: [
    { winnerId: 'sas', headline: "Horry left open", score: "Spurs 4-3 Series", date: "June 2005", desc: "Sheed left Robert Horry open in the corner in Game 5. Then they lost Game 7. A dynasty denied." },
    { winnerId: 'cle', headline: "LeBron's 25 straight", score: "Cavs 109, Pistons 107", date: "May 31, 2007", desc: "LeBron scored the Cavs' last 25 points. He single-handedly dismantled the 'Goin to Work' Pistons." },
    { winnerId: 'bos', headline: "Bird stole the ball", score: "Celtics 108, Pistons 107", date: "May 26, 1987", desc: "Isiah Thomas threw it away. Bird to DJ. Layup. Heartbreak." },
    { winnerId: 'lal', headline: "The Phantom Foul", score: "Lakers 103, Pistons 102", date: "June 19, 1988", desc: "Laimbeer didn't touch Kareem. A questionable foul call arguably cost them the title." },
    { winnerId: 'mia', headline: "Shaq's Revenge", score: "Heat 4-2 Series", date: "May 2006", desc: "The Heat finally got past them. The end of the Ben Wallace era in Detroit." },
    { winnerId: 'bos', headline: "The Big 3", score: "Celtics 4-2 Series", date: "May 2008", desc: "The last gasp of the Billups/Hamilton core. They couldn't hang with KG and Pierce." },
    { winnerId: 'all', headline: "28 Straight Losses", score: "The Streak", date: "Dec 2023", desc: "They set the single-season record for consecutive losses. 28 games without a win. Pure misery." },
    { winnerId: 'draft', headline: "Darko Milicic", score: "Draft Pick #2", date: "2003 NBA Draft", desc: "They took Darko over Carmelo, Bosh, and Wade. Imagine that 2004 team with D-Wade." }
  ],
  mia: [
     { winnerId: 'dal', headline: "LeBron's Meltdown", score: "Mavs 4-2 Series", date: "June 2011", desc: "The Heatles were arrogant. Dirk humbled them. LeBron scored 8 points in a Finals game." },
     { winnerId: 'sas', headline: "The AC Game", score: "Spurs 110, Heat 95", date: "June 5, 2014", desc: "The AC broke in San Antonio. LeBron cramped up. The Spurs blew them out by record margins in the series." },
     { winnerId: 'den', headline: "Gentleman's Sweep", score: "Nuggets 4-1 Series", date: "June 2023", desc: "Jimmy Butler ran out of gas. Jokic played with his food." }
  ],
  phi: [
     { winnerId: 'tor', headline: "The Bounce", score: "Raptors 92, 76ers 90", date: "May 12, 2019", desc: "Kawhi's shot bounced four times. Embiid cried in the tunnel. The Process failed." },
     { winnerId: 'atl', headline: "Ben Simmons passed", score: "Hawks 103, 76ers 96", date: "June 20, 2021", desc: "Simmons had a wide open dunk. He passed it. The Process died that moment." },
     { winnerId: 'bos', headline: "Tatum 51", score: "Celtics 112, Sixers 88", date: "May 14, 2023", desc: "Game 7. Harden disappeared. Embiid disappeared. Tatum set a record." }
  ],
  lal: [
      { winnerId: 'bos', headline: "The Wheelchair Game", score: "Celtics 4-2 Series", date: "June 2008", desc: "Paul Pierce faked an injury, came back, and the Celtics blew out the Lakers by 39 in the clincher." },
      { winnerId: 'det', headline: "Five Game Sweep", score: "Pistons 4-1 Series", date: "June 2004", desc: "The Kobe/Shaq divorce was finalized by a Pistons beatdown. Malone retired ringless." },
      { winnerId: 'phx', headline: "Kobe quit?", score: "Suns 121, Lakers 90", date: "May 6, 2006", desc: "Game 7 against the Suns. Kobe refused to shoot in the second half to prove a point." }
  ],

  // --- NFL ---
  gb: [
    { winnerId: 'sea', headline: "The NFC Championship Collapse", score: "Seahawks 28, Packers 22", date: "Jan 18, 2015", desc: "Up 19-7 with 3 mins left. Brandon Bostick dropped the onside kick. Ha Ha Clinton-Dix stood still on the 2pt conversion." },
    { winnerId: 'tb', headline: "Kick the Field Goal?", score: "Bucs 31, Packers 26", date: "Jan 24, 2021", desc: "NFC Championship at home. 4th and Goal. Rodgers wanted to go for it. LaFleur kicked a FG. Brady knelt out the clock." },
    { winnerId: 'sf', headline: "Blocked Punt", score: "49ers 13, Packers 10", date: "Jan 22, 2022", desc: "Top seed in the NFC. Home field. Offense scored 10 points. Special teams allowed a blocked punt TD." },
    { winnerId: 'nyg', headline: "15-1 Season Ruined", score: "Giants 37, Packers 20", date: "Jan 15, 2012", desc: "Rodgers was MVP. The team was 15-1. Eli Manning came into Lambeau and humiliated them." },
    { winnerId: 'phi', headline: "4th and 26", score: "Eagles 20, Packers 17", date: "Jan 11, 2004", desc: "Donovan McNabb converted a 4th and 26. Favre threw a duck in OT. Heartbreak." },
    { winnerId: 'den', headline: "Super Bowl XXXII", score: "Broncos 31, Packers 24", date: "Jan 25, 1998", desc: "Favre vs Elway. The Packers were heavy favorites. Terrell Davis had a migraine and still ran over them." },
    { winnerId: 'nyg', headline: "Favre's Last Pass", score: "Giants 23, Packers 20", date: "Jan 20, 2008", desc: "Overtime in the frozen tundra. Favre threw an INT on his final pass as a Packer." },
    { winnerId: 'atl', headline: "Falcons Blowout", score: "Falcons 44, Packers 21", date: "Jan 22, 2017", desc: "NFC Championship. The Packers were down 31-0. It wasn't even competitive." }
  ],
  min: [
    { winnerId: 'phi', headline: "38-7", score: "Eagles 38, Vikings 7", date: "Jan 21, 2018", desc: "After the Minneapolis Miracle, they laid an absolute egg. Nick Foles looked like Montana." },
    { winnerId: 'sea', headline: "Blair Walsh Wide Left", score: "Seahawks 10, Vikings 9", date: "Jan 10, 2016", desc: "27 yards. Chip shot. Sub-zero temps. He missed it. The laces were in!" },
    { winnerId: 'no', headline: "Bountygate Game", score: "Saints 31, Vikings 28", date: "Jan 24, 2010", desc: "Favre threw across his body in field goal range. Tracy Porter picked it off. 12 men in the huddle penalty." },
    { winnerId: 'nyg', headline: "41-Donut", score: "Giants 41, Vikings 0", date: "Jan 14, 2001", desc: "NFC Championship. Kerry Collins torched them. It was 14-0 before the fans sat down." },
    { winnerId: 'atl', headline: "Gary Anderson's Miss", score: "Falcons 30, Vikings 27", date: "Jan 17, 1999", desc: "15-1 season. Offense was unstoppable. Anderson hadn't missed all year. He missed the clincher." },
    { winnerId: 'dal', headline: "The Hail Mary", score: "Cowboys 17, Vikings 14", date: "Dec 28, 1975", desc: "Roger Staubach to Drew Pearson. Drew pushed off. No call. Ref got hit with a whiskey bottle." },
    { winnerId: 'kc', headline: "Super Bowl IV", score: "Chiefs 23, Vikings 7", date: "Jan 11, 1970", desc: "Heavily favored. Got bullied by Hank Stram's Chiefs." },
    { winnerId: 'oak', headline: "Super Bowl XI", score: "Raiders 32, Vikings 14", date: "Jan 9, 1977", desc: "Fran Tarkenton couldn't do it. The Purple People Eaters got eaten." }
  ],
  det_nfl: [
    { winnerId: 'sf', headline: "24-7 Halftime Lead", score: "49ers 34, Lions 31", date: "Jan 28, 2024", desc: "One half away from the Super Bowl. Dropped passes, a fumble, and analytics decisions led to a historic collapse." },
    { winnerId: 'gb', headline: "The 0-16 Season", score: "0 Wins, 16 Losses", date: "2008 Season", desc: "The first team to go 0-16. Dan Orlovsky running out of the back of the end zone sums it up." },
    { winnerId: 'bal', headline: "Record Breaker", score: "Ravens 19, Lions 17", date: "Sept 26, 2021", desc: "Justin Tucker hit a NFL record 66-yard field goal off the crossbar as time expired." },
    { winnerId: 'gb', headline: "The Hail Mary", score: "Packers 27, Lions 23", date: "Dec 3, 2015", desc: "A phantom facemask penalty gave Rodgers one more play. He threw it to the moon." },
    { winnerId: 'sea', headline: "The Bat", score: "Seahawks 13, Lions 10", date: "Oct 5, 2015", desc: "Calvin Johnson fumbled at the 1. KJ Wright batted it out of the endzone. Illegal play, but refs missed it." },
    { winnerId: 'dal', headline: "Flag Picked Up", score: "Cowboys 24, Lions 20", date: "Jan 4, 2015", desc: "Playoff game. Pass interference called. Then the refs picked up the flag without explanation." },
    { winnerId: 'ret', headline: "Megatron Retires", score: "Early Retirement", date: "March 2016", desc: "Just like Barry Sanders, Calvin Johnson retired early because he was tired of losing." },
    { winnerId: 'chi', headline: "Process of the Catch", score: "Bears 19, Lions 14", date: "Sept 12, 2010", desc: "Calvin caught the winning TD. Put the ball down. Refs said he didn't 'complete the process'." }
  ],
  dal: [
    { winnerId: 'sea', headline: "The Romo Bobble", score: "Seahawks 21, Cowboys 20", date: "Jan 6, 2007", desc: "A chip shot to win. Romo dropped the snap. He cried in the locker room." },
    { winnerId: 'gb', headline: "Dez Caught It", score: "Packers 26, Cowboys 21", date: "Jan 11, 2015", desc: "It looked like a catch. The rules said no. Playoff hopes dashed again." },
    { winnerId: 'gb', headline: "Dak runs out of time", score: "49ers 23, Cowboys 17", date: "Jan 16, 2022", desc: "Dak ran a QB draw with no timeouts. The clock hit zero before they could snap it." },
    { winnerId: 'gb', headline: "Love destroys Dallas", score: "Packers 48, Cowboys 32", date: "Jan 14, 2024", desc: "The #2 seed Cowboys got absolutely smoked at home by the #7 seed Packers." }
  ],
  sf: [
    { winnerId: 'kc', headline: "Super Bowl LVIII", score: "Chiefs 25, 49ers 22", date: "Feb 11, 2024", desc: "Overtime. Muffed punt. Shanahan blew a 10 point lead in the Super Bowl... again." },
    { winnerId: 'kc', headline: "Super Bowl LIV", score: "Chiefs 31, 49ers 20", date: "Feb 2, 2020", desc: "Up 20-10 with 7 minutes left. Jimmy G closed his eyes and threw a pick." },
    { winnerId: 'sea', headline: "Sherman's Tip", score: "Seahawks 23, 49ers 17", date: "Jan 19, 2014", desc: "Kaep threw to Crabtree in the endzone. Sherman tipped it. 'Don't you ever talk about me!'" },
    { winnerId: 'bal', headline: "Super Bowl XLVII", score: "Ravens 34, 49ers 31", date: "Feb 3, 2013", desc: "4 plays from the 5-yard line to win. Four incompletions. Har-Bowl lost." }
  ],
  buf: [
    { winnerId: 'kc', headline: "13 Seconds", score: "Chiefs 42, Bills 36", date: "Jan 23, 2022", desc: "They scored to take the lead with 13 seconds left. They still lost. Unforgivable defense." },
    { winnerId: 'nyg', headline: "Wide Right", score: "Giants 20, Bills 19", date: "Jan 27, 1991", desc: "Scott Norwood. 47 yards. It sailed wide right. The start of 4 straight Super Bowl losses." },
    { winnerId: 'ten', headline: "Music City Miracle", score: "Titans 22, Bills 16", date: "Jan 8, 2000", desc: "It was a forward pass. But the refs didn't see it that way." }
  ],
  atl: [
    { winnerId: 'ne', headline: "28-3", score: "Patriots 34, Falcons 28", date: "Feb 5, 2017", desc: "The biggest choke in sports history. Up 25 late in the 3rd. Kyle Shanahan forgot to run the ball." },
    { winnerId: 'den', headline: "Super Bowl XXXIII", score: "Broncos 34, Falcons 19", date: "Jan 31, 1999", desc: "Eugene Robinson got arrested the night before. They got torched by Elway." }
  ],
  chi: [
      { winnerId: 'phi', headline: "Double Doink", score: "Eagles 16, Bears 15", date: "Jan 6, 2019", desc: "Cody Parkey's kick hit the upright AND the crossbar. The sound haunts Chicago." },
      { winnerId: 'gb', headline: "NFC Championship", score: "Packers 21, Bears 14", date: "Jan 23, 2011", desc: "Lost to their arch-rivals at home to go to the Super Bowl. Cutler sat out with a 'knee injury'." }
  ],
  cin: [
      { winnerId: 'lar', headline: "Super Bowl LVI", score: "Rams 23, Bengals 20", date: "Feb 13, 2022", desc: "Aaron Donald blew up the final play. Burrow had no time." },
      { winnerId: 'pit', headline: "The Fumble", score: "Steelers 18, Bengals 16", date: "Jan 9, 2016", desc: "Jeremy Hill fumbled. Burfict tried to kill Antonio Brown. Pacman Jones fought a ref. Meltdown." }
  ],
  cle: [
      { winnerId: 'den', headline: "The Drive", score: "Broncos 23, Browns 20", date: "Jan 11, 1987", desc: "Elway went 98 yards in 5 minutes. Cleveland hearts broken." },
      { winnerId: 'den', headline: "The Fumble", score: "Broncos 38, Browns 33", date: "Jan 17, 1988", desc: "Earnest Byner was crossing the goal line to tie the game. He stripped." },
      { winnerId: 'bal', headline: "The Move", score: "Franchise Left", date: "1995", desc: "Art Modell took the team to Baltimore and won a Super Bowl. Pain." }
  ],
  generic: [
    { winnerId: 'opponent', headline: "They choked", score: "Big Loss", date: "Recently", desc: "Honestly, they just aren't a serious franchise. You know it, I know it." }
  ]
};

const TRASH_TALK = [
  "Thoughts and prayers. 🙏",
  "Someone check on their fans. 😂",
  "Inject this into my veins. 💉",
  "Down bad. 📉",
  "Holding that L. 🥡",
  "Chef's kiss. 🤌",
  "Pure cinema. 🍿",
  "Exposed.",
  "They are who we thought they were.",
  "Hang the banner: 'Participated'.",
  "Sucks to suck.",
  "Have a safe flight home! 👋",
  "Call the waaaambulance. 🚑",
  "Keep crying.",
  "Delicious tears. 💧",
  "Oof. Big oof.",
  "Warm up the bus!",
  "This sparks joy. ✨",
  "Emotional damage. 💥",
  "Someone give them a hug."
];

const TEMPLATE_LIBRARY = {
  Casual: [
    "So... [TEAM] lost [SCORE]-[OPP_SCORE]. Hate to see it. 😬 [LINK]",
    "Just checking in. You see [TEAM] lost [SCORE]-[OPP_SCORE]? [LINK]",
    "Oof. [TEAM] dropped one. [SCORE]-[OPP_SCORE]. [LINK]",
    "Hey, did you see [TEAM] lost? [SCORE]-[OPP_SCORE]. [LINK]",
    "Tough look for [TEAM] today. [SCORE]-[OPP_SCORE]. [LINK]"
  ],
  Receipts: [
    "FINAL: [TEAM] [SCORE], [OPPONENT] [OPP_SCORE]. See for yourself: [LINK]",
    "Scoreboard: [TEAM] [SCORE] - [OPPONENT] [OPP_SCORE]. [LINK]",
    "In case you missed it: [TEAM] [SCORE], [OPPONENT] [OPP_SCORE]. [LINK]",
    "Just stating facts: [TEAM] lost [SCORE]-[OPP_SCORE]. [LINK]",
    "[TEAM] [SCORE], [OPPONENT] [OPP_SCORE]. Just leaving this here. [LINK]"
  ],
  Toxic: [
    "IMAGINE LOSING [SCORE]-[OPP_SCORE] TO [OPPONENT]. [TEAM] DOWN BAD. 📉🤡 [LINK]",
    "lol [TEAM] lost. [SCORE]-[OPP_SCORE]. Trash franchise. 🗑️ [LINK]",
    "[TEAM] fans real quiet after losing [SCORE]-[OPP_SCORE]. 😂 [LINK]",
    "Hold this L. [TEAM] [SCORE]-[OPP_SCORE]. 🤡 [LINK]",
    "Imagine being a [TEAM] fan right now. Couldn't be me. [SCORE]-[OPP_SCORE]. 📉 [LINK]"
  ]
};

const getHistoryHeader = (fact) => {
    if (fact.intro) return `${fact.intro} ${fact.headline}`;
    // Heuristic: If headline starts with "The", "Game", or a Year/Number, use "Remember" or "Remember the"
    if (/^\d/.test(fact.headline)) return `Remember the ${fact.headline}`;
    if (fact.headline.startsWith("The ")) return `Remember ${fact.headline}`;
    
    // Default fallback
    return `Remember when ${fact.headline}`;
};

// --- ONBOARDING COMPONENT ---
const Onboarding = ({ onComplete, currentTheme }) => {
  const [step, setStep] = useState(0);
  
  const nextStep = () => setStep(s => s + 1);

  // New function to actually request permission
  const handleEnableNotifications = async () => {
    try {
        await requestNotificationPermission();
    } catch(e) {
        console.log("Notification setup skipped or failed in demo mode");
    }
    // Proceed regardless of the answer
    onComplete();
  }

  // Step 1: Value Prop
  if (step === 0) {
    return (
      <div className="fixed inset-0 z-[100] bg-blue-600 text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="bg-white/20 p-6 rounded-full mb-6">
            <HappyGuyIcon className="text-6xl text-white" />
        </div>
        <h1 className="text-3xl font-black italic mb-4">Fill your hater's heart with joy</h1>
        <div className="text-lg font-medium opacity-90 mb-8 max-w-xs mx-auto space-y-4">
          <p>
            Love the jolt of joy you get when you see that a team you hate loses?
          </p>
          <p>
            This app tracks the teams you hate and sends you an alert every time they lose. And ONLY when they lose.
          </p>
        </div>
        <button 
          onClick={nextStep}
          className="bg-white text-blue-600 text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform w-full max-w-xs"
        >
          Let your hate flow
        </button>
      </div>
    );
  }

  // Step 2: Pick Enemies (Just a visual placeholder for the concept, we direct them to Manage)
  if (step === 1) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-50 text-slate-900 flex flex-col p-6 animate-in slide-in-from-right duration-300">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-6 relative">
                <Target size={64} className="text-red-500" />
                <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                    STEP 1
                </div>
            </div>
            <h2 className="text-2xl font-black mb-2">Pick Your Targets</h2>
            <p className="text-slate-500 mb-8 max-w-xs">
                Search for teams across NCAA, NFL, and NBA. Add them to your "Enemies List."
            </p>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 w-full max-w-xs mb-8 text-left">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold">DUK</div>
                    <div className="flex-1">
                        <div className="font-bold text-sm">Duke</div>
                        <div className="text-[10px] text-slate-400">NCAA</div>
                    </div>
                    <Trash2 size={16} className="text-red-500" />
                </div>
                <div className="flex items-center gap-3 opacity-50">
                    <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold">DAL</div>
                    <div className="flex-1">
                        <div className="font-bold text-sm">Dallas</div>
                        <div className="text-[10px] text-slate-400">NFL</div>
                    </div>
                    <Target size={16} />
                </div>
            </div>
        </div>
        <button 
          onClick={nextStep}
          className="bg-slate-900 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-slate-800 transition-colors w-full"
        >
          Got it, next
        </button>
      </div>
    );
  }

  // Step 3: Notifications
  if (step === 2) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900 text-white flex flex-col p-6 animate-in slide-in-from-right duration-300">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mb-6 bg-white/10 p-6 rounded-full">
                <Bell size={48} className="text-yellow-400 animate-bounce" />
            </div>
            <h2 className="text-2xl font-black mb-2">Don't Miss the Moment</h2>
            <p className="text-slate-400 mb-8 max-w-xs">
                We'll send you a notification any time that rival team blows it.
            </p>
            <p className="text-xs text-slate-500 mt-4">
              (Note: Notifications currently require the app to be open)
            </p>
        </div>
        <div className="space-y-3 w-full">
            <button 
            onClick={handleEnableNotifications}
            className="bg-white text-slate-900 text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-slate-100 transition-colors w-full"
            >
            Enable Notifications
            </button>
            <button 
            onClick={onComplete}
            className="text-slate-500 text-sm font-bold py-2 w-full hover:text-white transition-colors"
            >
            Maybe Later
            </button>
        </div>
      </div>
    );
  }

  return null;
};


export default function App() {
  const [view, setView] = useState('scoreboard');
  const [activeLeague, setActiveLeague] = useState('NCAA');
  const [activeTheme, setActiveTheme] = useState('professional');
  
  // --- ONBOARDING STATE ---
  const [showOnboarding, setShowOnboarding] = useState(
    // Check local storage on initial render
    () => localStorage.getItem('tl_onboarded') !== 'true'
  );

  // --- SETTINGS STATE ---
  const [enabledLeagues, setEnabledLeagues] = useState({
    NCAA: true,
    CFB: false, // Defaulting CFB to False for Post-Season
    NBA: true,
    NFL: true,
    MLB: false 
  });

  // --- PERSISTENT ENEMIES STATE ---
  // Initialize from localStorage if available, otherwise default to empty array
  const [hatedTeams, setHatedTeams] = useState(() => {
    const saved = localStorage.getItem('tl_hated_teams');
    return saved ? JSON.parse(saved) : [];
  });

  const [gameResults, setGameResults] = useState([]);
  const [celebration, setCelebration] = useState(null);
  const [shareModal, setShareModal] = useState(null);
  const [consolationFact, setConsolationFact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [noGamesMsg, setNoGamesMsg] = useState(null);
  
  // NEW STATE FOR SHARE OPTIONS
  const [shareOptions, setShareOptions] = useState([]);


  const styles = THEMES[activeTheme] || THEMES.professional;

  // Ensure activeLeague is always enabled
  useEffect(() => {
    if (!enabledLeagues[activeLeague]) {
      const firstEnabled = Object.keys(enabledLeagues).find(k => enabledLeagues[k]);
      if (firstEnabled) setActiveLeague(firstEnabled);
    }
  }, [enabledLeagues, activeLeague]);

  // AUTO-CHECK ON LOAD
  useEffect(() => {
    checkLiveScores();
  }, []); 

  // Persist hatedTeams to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tl_hated_teams', JSON.stringify(hatedTeams));
  }, [hatedTeams]);

  const completeOnboarding = () => {
      localStorage.setItem('tl_onboarded', 'true');
      setShowOnboarding(false);
  };

  // --- LOGIC ---

  // REAL LIVE DATA FETCH
  const checkLiveScores = async () => {
    setLoading(true);
    setConsolationFact(null);
    setCelebration(null);
    setNoGamesMsg(null);
    setGameResults([]);
    
    try {
      const liveData = await fetchScoreboard(activeLeague);
      
      if (!liveData || liveData.length === 0) {
        setNoGamesMsg(`No active/completed ${activeLeague} games found right now.`);
        setLoading(false);
        return;
      }

      // --- NEW FUZZY MATCH LOGIC ---
      const isHated = (apiId, gameLeague) => {
          return hatedTeams.some(hatedId => {
              // 1. Exact Match (e.g. 'duke' === 'duke')
              if (hatedId === apiId) return true;
              
              // 2. Suffix Match for Conflicts (e.g. 'duke' matches 'duke_fb' IF we are in CFB mode)
              const internalTeamConfig = ALL_TEAMS.find(t => t.id === hatedId);
              if (internalTeamConfig && internalTeamConfig.league === gameLeague) {
                  // Check if the hated ID starts with the API ID plus an underscore
                  // This covers '_fb', '_m', '_c' etc.
                  if (hatedId.startsWith(apiId + '_')) return true;
              }
              return false;
          });
      };

      // --- LEAGUE DETECTION FIX ---
      // We need to know which leagues to check based on the hated teams.
      // BUT, because IDs like 'hou' are duplicated in ALL_TEAMS, we need to check ALL potential matches for an ID.
      const leaguesToCheck = ['NCAA', 'CFB', 'NBA', 'NFL', 'MLB'].filter(league => 
        enabledLeagues[league] && 
        hatedTeams.some(teamId => {
          // FIX: Filter instead of Find to handle duplicate IDs (like 'hou') across leagues
          const matchingTeams = ALL_TEAMS.filter(at => at.id === teamId);
          return matchingTeams.some(t => t.league === league);
        })
      );

      const results = await Promise.all(leaguesToCheck.map(l => fetchScoreboard(l)));
      const allGames = results.flat();
      
      if (!allGames || allGames.length === 0) {
        setNoGamesMsg(`No active/completed games found right now.`);
        setLoading(false);
        return;
      }

      const relevantGames = allGames.filter(game => {
        return isHated(game.homeTeam.id, game.league) || isHated(game.awayTeam.id, game.league);
      }).map(game => {
        
        // We need to find the "Internal Team Object" to get the right colors/names.
        // We use the same fuzzy logic in reverse.
        const findInternalTeam = (apiId) => {
             return ALL_TEAMS.find(t => {
                 if (t.league !== game.league) return false;
                 if (t.id === apiId) return true;
                 if (t.id.startsWith(apiId + '_')) return true;
                 return false;
             });
        };

        const isHomeHated = isHated(game.homeTeam.id, game.league);
        const hatedTeamObj = isHomeHated ? game.homeTeam : game.awayTeam;
        const opponentObj = isHomeHated ? game.awayTeam : game.homeTeam;
        
        const internalTeam = findInternalTeam(hatedTeamObj.id);

        if (!internalTeam) return null;

        return {
          team: internalTeam || { ...hatedTeamObj, color: '#333', name: hatedTeamObj.name, league: game.league }, 
          opponent: opponentObj.name,
          teamScore: hatedTeamObj.score,
          opponentScore: opponentObj.score,
          status: game.loserId === hatedTeamObj.id ? 'LOST' : (game.isFinal ? 'WON' : 'PLAYING'),
          rawStatus: game.rawStatus, // Pass through raw status
          gameId: game.gameId,
          isLive: true,
          isYesterday: game.isYesterday
        };
      }).filter(Boolean);

      setGameResults(relevantGames);
      
      const losers = relevantGames.filter(r => r.status === 'LOST');
      if (losers.length > 0) {
          triggerCelebration(losers.length);
      } else {
          processResults(relevantGames);
      }

    } catch (err) {
      console.error(err);
      setNoGamesMsg("Error fetching data. Try simulating instead.");
    } finally {
      setLoading(false);
    }
  };

  const processResults = (results) => {
    const losers = results.filter(r => r.status === 'LOST');
    
    if (losers.length > 0) {
      triggerCelebration(losers.length);
    } else if (results.length > 0) {
      pickHistoricLoss();
    } else {
      // Changed message to be less definitive/gaslighting
      if (!loading && !noGamesMsg) setNoGamesMsg("No active games found for your enemies.");
    }
  };

  const pickHistoricLoss = () => {
    const candidates = hatedTeams.filter(id => HISTORIC_LOSSES[id]);
    
    // Fallback ID fix: Some IDs like 'det' are used for both NBA and NFL
    // We need to check for suffix matches if direct match fails
    const extendedCandidates = [];
    hatedTeams.forEach(id => {
        if (HISTORIC_LOSSES[id]) extendedCandidates.push(id);
        else {
            // Check for potential suffix key in HISTORIC_LOSSES (e.g. det_nfl)
             const foundKey = Object.keys(HISTORIC_LOSSES).find(k => k.startsWith(id + '_'));
             if (foundKey) extendedCandidates.push(foundKey);
        }
    });
    
    const validFacts = [];
    extendedCandidates.forEach(key => {
      const facts = HISTORIC_LOSSES[key];
      // Extract original team ID from key (remove _nfl suffix if present for looking up Team Object)
      const originalTeamId = key.includes('_') ? key.split('_')[0] : key;
      
      if (facts) {
        facts.forEach(fact => {
          if (!hatedTeams.includes(fact.winnerId)) {
            // Try to find team object, handle the suffix matching for the object lookup
            const teamObj = ALL_TEAMS.find(t => t.id === originalTeamId) || ALL_TEAMS.find(t => t.id === key);
            validFacts.push({ team: teamObj, ...fact });
          }
        });
      }
    });

    if (validFacts.length === 0) {
      const genericFact = HISTORIC_LOSSES.generic ? HISTORIC_LOSSES.generic[0] : null;
      if (genericFact) {
        setConsolationFact({ team: { name: "Sports History" }, ...genericFact });
      }
      return;
    }

    const randomFact = validFacts[Math.floor(Math.random() * validFacts.length)];
    setConsolationFact(randomFact);
  };

  const triggerCelebration = (count) => {
    const randomMsg = TRASH_TALK[Math.floor(Math.random() * TRASH_TALK.length)];
    const randomGif = CELEBRATION_GIFS[Math.floor(Math.random() * CELEBRATION_GIFS.length)];
    
    setCelebration({ count, message: randomMsg, gif: randomGif });
    setTimeout(() => setCelebration(null), 8000);
  };

  const toggleHate = (teamId) => {
    if (hatedTeams.includes(teamId)) {
      setHatedTeams(hatedTeams.filter(id => id !== teamId));
    } else {
      setHatedTeams([...hatedTeams, teamId]);
    }
  };

  const toggleLeague = (leagueCode) => {
    setEnabledLeagues(prev => ({
      ...prev,
      [leagueCode]: !prev[leagueCode]
    }));
  };

  const openShareModal = (game) => {
    const newOptions = [
      { label: "Casual", text: TEMPLATE_LIBRARY.Casual[Math.floor(Math.random() * TEMPLATE_LIBRARY.Casual.length)] },
      { label: "Receipts", text: TEMPLATE_LIBRARY.Receipts[Math.floor(Math.random() * TEMPLATE_LIBRARY.Receipts.length)] },
      { label: "Toxic", text: TEMPLATE_LIBRARY.Toxic[Math.floor(Math.random() * TEMPLATE_LIBRARY.Toxic.length)] },
    ];
    setShareOptions(newOptions);
    setShareModal(game);
  };

  const handleShare = async (text) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'They Lost!',
          text: text,
        });
        setShareModal(null);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      setShareModal(null);
      alert("Copied to clipboard: " + text);
    }
  };

  const displayResults = gameResults.filter(g => g.status === 'LOST');

  const teamsToManage = ALL_TEAMS
    .filter(t => t.league === activeLeague)
    .filter(t => 
      searchTerm === '' || 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.mascot.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // --- COMPONENTS ---

  const Confetti = () => {
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-fall"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `-20px`,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              width: '10px',
              height: '10px',
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    );
  };

  // --- NOTIFICATION HELPER ---
  // Notification state is removed, but this component definition was causing errors.
  // Removed PushNotification component entirely as it's no longer used.

  return (
    <div className={`min-h-screen ${styles.bg} ${styles.font} ${styles.text} max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-slate-200 flex flex-col h-[100dvh]`}>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes slideDownBounce {
          0% { transform: translateY(-100%); opacity: 0; }
          60% { transform: translateY(10%); opacity: 1; }
          80% { transform: translateY(-5%); }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-enter-banner {
          animation: slideDownBounce 0.8s ease-out forwards;
        }
        @keyframes slideInTop {
            0% { transform: translateY(-120%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-in-top {
            animation: slideInTop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>

      {/* ONBOARDING MODAL */}
      {showOnboarding && <Onboarding onComplete={completeOnboarding} currentTheme={activeTheme} />}

      {/* NOTIFICATION OVERLAY */}
      {/* Notification component removed to fix reference errors */}

      {/* HEADER */}
      <header className={`p-4 sticky top-0 z-30 shrink-0 ${styles.header}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* Removed container div and explicit text color. It now inherits white from the header. */}
            <HappyGuyIcon className="text-4xl" />
            <h1 className="font-black text-xl tracking-tight italic">THEY LOST!</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={checkLiveScores}
              disabled={loading}
              className={`p-2 rounded-lg transition hover:bg-white/10 ${loading ? 'opacity-50' : ''}`}
              title="Refresh Scores"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>

            <button 
              onClick={() => setView('scoreboard')}
              className={`p-2 rounded-lg transition hover:opacity-80 ${view === 'scoreboard' ? 'bg-black/20 shadow-inner' : ''}`}
            >
              <PartyPopper size={20} />
            </button>
            <button 
              onClick={() => setView('manage')}
              className={`p-2 rounded-lg transition hover:opacity-80 ${view === 'manage' ? 'bg-black/20 shadow-inner' : ''}`}
            >
              <Target size={20} />
            </button>
             {/* NEW SETTINGS BUTTON */}
            <button 
              onClick={() => setView('settings')}
              className={`p-2 rounded-lg transition hover:opacity-80 ${view === 'settings' ? 'bg-black/20 shadow-inner' : ''}`}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* CELEBRATION BANNER */}
      {celebration && (
        <>
          <Confetti />
          <div className={`p-4 text-center animate-enter-banner shadow-lg relative z-20 shrink-0 ${styles.lossBanner}`}>
            {celebration.gif && (
              <div className="w-full mb-3 flex justify-center">
                <img 
                  src={celebration.gif} 
                  alt="Celebration" 
                  className="max-h-48 w-auto object-contain rounded-lg border-2 border-white/50 shadow-sm"
                />
              </div>
            )}
            <h2 className="text-xl font-black uppercase tracking-widest leading-none mb-1">IT HAPPENED!</h2>
            <p className="text-xs font-bold uppercase opacity-90">{celebration.message}</p>
          </div>
        </>
      )}

      {/* SHARE MODAL */}
      {shareModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Share2 size={18} />
                Spread the News
              </h3>
              <button onClick={() => setShareModal(null)} className="p-1 hover:bg-slate-200 rounded-full">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">Select your vibe:</p>
              
              {/* RENDER DYNAMIC OPTIONS FROM STATE */}
              {shareOptions.map((option, i) => {
                
                let leagueUrl = "espn.com";
                if (shareModal.team.league === 'NBA') leagueUrl = `espn.com/nba/game/_/gameId/${shareModal.gameId}`;
                else if (shareModal.team.league === 'NFL') leagueUrl = `espn.com/nfl/game/_/gameId/${shareModal.gameId}`;
                else if (shareModal.team.league === 'NCAA') leagueUrl = `espn.com/mens-college-basketball/game/_/gameId/${shareModal.gameId}`;
                else if (shareModal.team.league === 'CFB') leagueUrl = `espn.com/college-football/game/_/gameId/${shareModal.gameId}`;

                const filledText = option.text
                  .replace('[TEAM]', shareModal.team.name)
                  .replace('[SCORE]', shareModal.teamScore)
                  .replace('[OPP_SCORE]', shareModal.opponentScore)
                  .replace('[OPPONENT]', shareModal.opponent)
                  .replace('[LINK]', leagueUrl);
                
                return (
                  <button
                    key={i}
                    onClick={() => handleShare(filledText)}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-green-500 hover:bg-green-50 transition group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-400 group-hover:text-green-600 uppercase">{option.label}</span>
                      <Copy size={14} className="text-slate-300 group-hover:text-green-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-snug break-words">{filledText}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SCROLLABLE CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 pb-6">
        
        {/* --- SCOREBOARD VIEW --- */}
        {view === 'scoreboard' && (
          <div className="space-y-6">
            
            {/* CONTROLS SECTION REMOVED */}
             {/* FOOTER: TRACKING COUNT */}
            <div className="text-center pt-4 pb-2 opacity-40">
               <p className="text-xs font-bold tracking-widest uppercase">
                 Tracking {hatedTeams.length} Enemies
               </p>
            </div>

            {/* RESULTS LIST */}
            <div className="space-y-4">
               {/* EMPTY STATE CHECK */}
               {hatedTeams.length === 0 ? (
                   <div className="text-center py-12 px-6 animate-in fade-in duration-500">
                       <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-slate-100`}>
                            <Target className="text-slate-300" size={40} />
                       </div>
                       <h3 className="text-xl font-black mb-2 text-slate-800">Peaceful... too peaceful.</h3>
                       <p className="text-slate-500 mb-8 text-sm">You have no enemies yet. That sounds boring.</p>
                       <button 
                         onClick={() => setView('manage')}
                         className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform ${styles.buttonPrimary}`}
                       >
                         Pick Your Enemies
                       </button>
                   </div>
               ) : (
                 <>
                  {noGamesMsg && (
                    <div className={`text-center py-8 rounded-xl border ${styles.card} opacity-80`}>
                      <p className="text-sm font-medium">{noGamesMsg}</p>
                    </div>
                  )}

                  {/* STATE: No games run yet */}
                  {!noGamesMsg && gameResults.length === 0 && (
                    <div className="text-center py-12 px-6">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${styles.accentBg}`}>
                        <RefreshCw className={styles.accent} size={24} />
                      </div>
                      <h3 className={`font-bold text-lg ${styles.text}`}>No Scores Yet</h3>
                      <p className="opacity-60 text-sm mt-1">Checking scores...</p>
                    </div>
                  )}

                  {/* STATE: Games run, but EVERYONE WON (Gross) + Consolation Fact */}
                  {gameResults.length > 0 && displayResults.length === 0 && (
                    <div className={`text-center py-8 px-5 ${styles.card} border-dashed`}>
                      <div className="mb-6">
                        {gameResults.some(g => g.rawStatus === 'PLAYING') ? (
                            <>
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                                    <Activity className="text-yellow-600" size={24} />
                                </div>
                                <h3 className="text-slate-800 font-bold text-lg">One or more enemies are active right now...</h3>
                                <p className="text-slate-500 text-xs mt-1">We are monitoring the situation. Stand by.</p>
                            </>
                        ) : gameResults.some(g => g.rawStatus === 'UPCOMING') ? (
                            <>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Clock className="text-blue-600" size={24} />
                                </div>
                                <h3 className="text-slate-800 font-bold text-lg">Patience, hater.</h3>
                                <p className="text-slate-500 text-xs mt-1">Your enemies haven't started failing yet. Check back later.</p>
                            </>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <AlertTriangle className="text-red-500" size={24} />
                                </div>
                                <h3 className="text-slate-800 font-bold text-lg">Nobody you hate lost today (yet).</h3>
                                <p className="text-slate-500 text-xs mt-1">We'll keep watching.</p>
                            </>
                        )}
                      </div>

                      {consolationFact && (
                        <div className={`${styles.accentBg} border-2 border-current rounded-xl p-5 relative shadow-sm text-left rotate-1 transition hover:rotate-0`}>
                          <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${styles.header}`}>
                            <History size={10} /> History Lesson
                          </div>
                          
                          <div className="mb-2 border-b border-current/20 pb-2">
                            {/* UPDATED: Smart Header with Logic */}
                            <span className="text-xs font-bold opacity-80 uppercase">
                                {getHistoryHeader(consolationFact)}
                                {consolationFact.headline.endsWith('?') ? '' : '?'}
                            </span>
                          </div>
                          
                          <h4 className="font-black text-lg mb-1">{consolationFact.score}</h4>
                          <p className="text-xs font-bold opacity-60 mb-3 uppercase">{consolationFact.date}</p>
                          <p className="text-sm font-medium leading-relaxed opacity-90">{consolationFact.desc}</p>
                        </div>
                      )}

                      {/* REMOVED: "Try simulating again" link */}
                    </div>
                  )}

                  {/* STATE: Happy Times (Losses Displayed) */}
                  {displayResults.map((game, idx) => (
                    <div 
                      key={idx} 
                      className={`relative overflow-hidden transition-all duration-500 animate-in slide-in-from-bottom-5 ${styles.card} ${styles.cardBorder}`}
                    >
                      {/* Result Header */}
                      <div className={`p-2 text-center text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-2 ${
                        game.isYesterday ? 'bg-slate-200 text-slate-600' : styles.lossBanner
                      }`}>
                        {game.isYesterday && <History size={12} />} 
                        {game.status === 'LOST' ? 'THEY LOST!' : 'SCORES'} 
                        {game.isYesterday && <span className="opacity-75 ml-1">(YESTERDAY)</span>}
                        {!game.isYesterday && <PartyPopper size={12} />}
                        {!game.isYesterday && <PartyPopper size={12} />}
                      </div>

                      <div className="p-5 flex justify-between items-center">
                        {/* Hated Team */}
                        <div className="flex flex-col items-center w-1/3">
                          <div 
                            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-sm mb-2 shadow-md border-2 border-white ring-1 ring-slate-100"
                            style={{ backgroundColor: game.team.color }}
                          >
                            {game.team.id.substring(0,3).toUpperCase()}
                          </div>
                          <span className={`font-bold leading-tight text-center text-sm ${styles.text}`}>{game.team.name}</span>
                          <span className="text-[10px] font-bold opacity-50 uppercase tracking-wider">{game.team.league}</span>
                          <span className="text-3xl font-black mt-1 text-red-500">
                            {game.teamScore}
                          </span>
                        </div>

                        <div className="text-slate-300 font-black text-xl italic opacity-50">VS</div>

                        {/* Opponent */}
                        <div className="flex flex-col items-center w-1/3 opacity-80">
                          <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs mb-2 border-2 border-white">
                            OPP
                          </div>
                          <span className="font-medium text-slate-600 text-xs leading-tight text-center uppercase tracking-wide">{game.opponent}</span>
                          <span className="text-3xl font-bold mt-1 text-slate-500">{game.opponentScore}</span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className={`p-3 flex gap-2 border-t ${activeTheme === 'retro' ? 'border-black' : 'border-slate-100 bg-slate-50'}`}>
                        <button 
                          onClick={() => openShareModal(game)}
                          className={`flex-1 text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition shadow-sm ${styles.buttonPrimary}`}
                        >
                          <Share2 size={16} />
                          Rub It In
                        </button>
                        <a 
                          href={
                            game.team.league === 'NBA' ? `https://www.espn.com/nba/game/_/gameId/${game.gameId}` :
                            game.team.league === 'NFL' ? `https://www.espn.com/nfl/game/_/gameId/${game.gameId}` :
                            game.team.league === 'CFB' ? `https://www.espn.com/college-football/game/_/gameId/${game.gameId}` :
                            `https://www.espn.com/mens-college-basketball/game/_/gameId/${game.gameId}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 text-sm font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition shadow-sm ${styles.buttonSecondary}`}
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
            
           

          </div>
        )}

        {/* --- MANAGE VIEW --- */}
        {view === 'manage' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className={`p-5 ${styles.card} ${styles.cardBorder}`}>
              <h2 className={`font-bold text-lg mb-4 flex items-center gap-2 ${styles.text}`}>
                <AlertTriangle className={styles.accent} size={20} />
                Manage Your Enemies
              </h2>

              {/* League Tabs - FILTERED BY SETTINGS */}
              <div className={`flex gap-1 mb-4 p-1 rounded-lg overflow-x-auto ${activeTheme === 'retro' ? 'bg-black' : 'bg-slate-100'}`}>
                {['NCAA', 'CFB', 'NFL', 'NBA', 'MLB'].filter(l => enabledLeagues[l]).map(league => (
                  <button
                    key={league}
                    onClick={() => {
                        setActiveLeague(league);
                        setSearchTerm('');
                    }}
                    className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-md transition whitespace-nowrap ${
                      activeLeague === league 
                        ? 'bg-white text-black shadow-sm' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {league === 'NCAA' ? 'NCAA BB' : league}
                  </button>
                ))}
              </div>

               {/* Search Input */}
               <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="opacity-40" />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeLeague === 'NCAA' ? 'NCAA BB' : activeLeague} teams...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 bg-transparent ${styles.text} border-current/20`}
                />
              </div>

              <div className="space-y-2">
                {teamsToManage.length === 0 ? (
                    <div className="text-center opacity-50 py-8 text-sm">
                        No teams found. Try a different search.
                    </div>
                ) : (
                    teamsToManage.map(team => {
                    const isHated = hatedTeams.includes(team.id);
                    return (
                        <button
                        key={team.id}
                        onClick={() => toggleHate(team.id)}
                        className={`w-full p-3 rounded-xl flex items-center justify-between border transition group ${
                            isHated 
                            ? `border-red-500 ${styles.accentBg} ${styles.text}` 
                            : `border-transparent hover:border-current/10 hover:bg-black/5`
                        }`}
                        >
                        <div className="flex items-center gap-3">
                            <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                            style={{ backgroundColor: team.color }}
                            >
                            {team.id.substring(0,3).toUpperCase()}
                            </div>
                            <div className="text-left">
                            <div className={`font-bold text-sm ${styles.text}`}>{team.name}</div>
                            <div className="text-[10px] font-bold opacity-60 uppercase tracking-wider">{team.conf}</div>
                            </div>
                        </div>
                        {isHated ? (
                            <div className={`p-2 rounded-full shadow-sm ${styles.accent}`}>
                            <Target size={16} />
                            </div>
                        ) : (
                            <div className="text-[10px] font-bold opacity-50 px-3 py-1.5 rounded-full bg-black/5">
                            <Target size={16} />
                            </div>
                        )}
                        </button>
                    );
                    })
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- SETTINGS VIEW --- */}
        {view === 'settings' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className={`p-5 ${styles.card} ${styles.cardBorder}`}>
                    <h2 className={`font-bold text-lg mb-6 flex items-center gap-2 ${styles.text}`}>
                        <Settings className={styles.accent} size={20} />
                        Settings
                    </h2>

                    {/* SECTION: SPORTS TO TRACK */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-3 flex items-center gap-1">
                            <Globe size={12} /> Sports to Track
                        </h3>
                        <div className="space-y-2">
                            {[
                                { id: 'NCAA', label: 'NCAA Basketball' },
                                { id: 'CFB', label: 'NCAA Football' },
                                { id: 'NBA', label: 'NBA' },
                                { id: 'NFL', label: 'NFL' },
                                { id: 'MLB', label: 'MLB Baseball' }
                            ].map(sport => (
                                <div key={sport.id} className="flex justify-between items-center p-3 rounded-lg border border-current/10">
                                    <span className={`text-sm font-medium ${!enabledLeagues[sport.id] && 'opacity-50'}`}>{sport.label}</span>
                                    <button 
                                        onClick={() => toggleLeague(sport.id)}
                                        className={`text-2xl transition-colors ${enabledLeagues[sport.id] ? 'text-green-500' : 'text-slate-300'}`}
                                    >
                                        {enabledLeagues[sport.id] ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: APPEARANCE */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-3 flex items-center gap-1">
                            <Palette size={12} /> Appearance
                        </h3>
                        <div className="space-y-3">
                            <p className={`text-sm mb-2 opacity-80 ${styles.text}`}>Choose your vibe:</p>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.keys(THEMES).map(key => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTheme(key)}
                                    className={`w-full p-3 text-sm font-bold rounded-lg border-2 transition-all flex items-center justify-between ${
                                    activeTheme === key 
                                        ? 'border-current opacity-100 ring-1 ring-current' 
                                        : 'border-transparent opacity-60 hover:opacity-100 hover:bg-black/5'
                                    }`}
                                    style={{ 
                                        backgroundColor: THEMES[key].bg === 'bg-slate-950' ? '#0f172a' : (THEMES[key].bg === 'bg-emerald-50' ? '#ecfdf5' : '#f1f5f9'), 
                                        color: THEMES[key].name === 'Midnight' ? '#fff' : '#000' 
                                    }}
                                >
                                    <span>{THEMES[key].name}</span>
                                    {activeTheme === key && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                                </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-4 border-t border-current/10">
                        <p className="text-[10px] opacity-40">THEY LOST v1.1</p>
                        {/* Reset Onboarding Button */}
                        <button 
                            onClick={() => {
                                localStorage.removeItem('tl_onboarded');
                                window.location.reload();
                            }}
                            className="mt-4 text-xs font-bold text-red-400 hover:text-red-500 flex items-center justify-center gap-1 mx-auto"
                        >
                            <LogOut size={10} /> Reset Onboarding
                        </button>
                    </div>

                </div>
            </div>
        )}

      </main>

    </div>
  );
}
