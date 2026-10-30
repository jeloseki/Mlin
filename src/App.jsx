import React, { useState, useEffect, useRef } from 'react';
import Board from './components/Board';
import { BOARD_CONNECTIONS } from './constants/gameData';
import { checkFormsMill, isPieceInMill, hasLegalMoves } from './logic/millEngine';
import { getAIPlacementNode, getAIPieceToRemove, getAIMove } from './logic/aiEngine';
import './App.css';
import { getNextNodeByDirection } from './utils/keyboardNav';
import { getOrCreateProfile, updateMatchResults, saveMatchHistory, getLeaderboard } from './gameService';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { getStoredAchievements, ACHIEVEMENT_TIERS } from './achievementsData';
import { evaluateGameAchievements } from './achievementsEvaluator';
import { getStoredAvatars, getDefaultUnlockedAvatarIds, fetchAvatarsFromFirebase, evaluateGameAvatars } from './avatarsData';

const RANK_STEPS = [
  { min: 0, hr: '🥉 Bronca III', en: '🥉 Bronze III' },
  { min: 50, hr: '🥉 Bronca II', en: '🥉 Bronze II' },
  { min: 120, hr: '🥉 Bronca I', en: '🥉 Bronze I' },
  { min: 200, hr: '🥈 Srebro III', en: '🥈 Silver III' },
  { min: 300, hr: '🥈 Srebro II', en: '🥈 Silver II' },
  { min: 420, hr: '🥈 Srebro I', en: '🥈 Silver I' },
  { min: 560, hr: '🥇 Zlato III', en: '🥇 Gold III' },
  { min: 720, hr: '🥇 Zlato II', en: '🥇 Gold II' },
  { min: 900, hr: '🥇 Zlato I', en: '🥇 Gold I' },
  { min: 1100, hr: '💎 Platina III', en: '💎 Platinum III' },
  { min: 1350, hr: '💎 Platina II', en: '💎 Platinum II' },
  { min: 1600, hr: '💎 Platina I', en: '💎 Platinum I' },
  { min: 1900, hr: '🔮 Dijamant III', en: '🔮 Diamond III' },
  { min: 2250, hr: '🔮 Dijamant II', en: '🔮 Diamond II' },
  { min: 2650, hr: '🔮 Dijamant I', en: '🔮 Diamond I' },
  { min: 3100, hr: '⚔️ Majstor', en: '⚔️ Master' },
  { min: 3800, hr: '🏆 Velemajstor', en: '🏆 Grandmaster' }
];

const getRankName = (points, lang) => {
  let rank = RANK_STEPS[0];
  for (let r of RANK_STEPS) {
    if (points >= r.min) rank = r;
    else break;
  }
  return lang === 'hr' ? rank.hr : rank.en;
};

const TRANSLATIONS = {
  hr: {
    menuTitle: "MLIN",
    playOffline: "👥 Igraj 1 na 1 (Lokalno)",
    playAI: "🤖 Igraj Protiv Računala (AI)",
    playOnline: "🌐 Igraj Na Mreži (Uskoro)",
    profile: "👤 Profil",
    ranking: "🏆 Rangovi",
    leaderboard: "🥇 Ljestvica Prvih 100",
    scoring: "📊 Bodovanje",
    settings: "⚙️ Postavke",
    back: "⬅️ Natrag",
    btnQuit: "🚪 Izađi u Izbornik",
    soundEffects: "Zvučni Efekti",
    on: "Uključeno",
    off: "Isključeno",
    tabStats: "Statistika",
    tabBadges: "Postignuća",
    tabHistory: "Povijest Mečeva",
    editAvatarTitle: "Odaberi Avatara ili Učitaj Sliku",
    uploadCustom: "📷 Učitaj vlastitu sliku sa uređaja",
    rankClass: "Klasa / Rang",
    totalPoints: "Bodovi",
    winRate: "Postotak Pobjeda",
    matches: "Pobjede / Porazi",
    titleLabel: "Titula",
    defaultTitle: "Početnik",
    win: "Pobjeda",
    loss: "Poraz",
    ach1Title: "Prvi Mlin",
    ach1Desc: "Složen prvi mlin u karijeri",
    ach2Title: "Prva Pobjeda",
    ach2Desc: "Pobijeđeno u prvoj partiji",
    ach3Title: "Nepobjedivi",
    ach3Desc: "Ostvareno 5 pobjeda u nizu",
    scoringTitle: "Sustav Bodovanja",
    winPointsRule: "🏆 Pobjeda: +12 Bodova",
    lossPointsRule: "❌ Poraz: -6 Bodova",
    millBonusRule: "⚡ Mlin bonus: +1 Bod po mlinu (Max +4 po meču)",
    domWinRule: "🔥 Dominantna pobjeda (6+ figura): +3 Boda",
    streakRule: "🔥 Niz pobjeda (3+ pobjede u nizu): +3 Boda",
    protectionRule: "🛡️ Zaštita: Bodovi ne mogu pasti ispod 0",
    rankingTitle: "Hijerarhija Rangova",
    ptsRequired: "bodova",
    aiDifficultyTitle: "Odaberite Težinu AI-ja",
    easy: "🟢 Lako",
    medium: "🟡 Srednje",
    hard: "🔴 Teško",
    titleNames: "Unesite Imena Igrača",
    p1Label: "Igrač 1 (Max 12 slova):",
    p2Label: "Igrač 2 (Max 12 slova):",
    btnNextCoin: "Dalje na Novčić",
    titleCoin: "Bacanje Novčića",
    coinPrompt: "bira stranu novčića:",
    heads: "GLAVA",
    tails: "PISMO",
    resultTitle: "Pala je",
    winnerIs: "Pobjednik novčića je",
    chooseColor: "Odaberite boju (Bijeli igrač uvijek igra prvi):",
    white: "Bijele",
    black: "Crne",
    turn: "Na potezu:",
    whiteLabel: "Bijeli",
    blackLabel: "Crni",
    alertRemove: "⚠️ IZABERITE PROTIVNIČKU FIGURU ZA IZBACIVANJE!",
    millAlert: "Ne možete izbaciti figuru iz Mlina osim ako protivnik nema slobodnih figura!",
    gameOverWinner: "🎉 Pobjednik je"
  },
  en: {
    menuTitle: "NINE MEN'S MORRIS / MILLS",
    playOffline: "👥 2 Players (Local)",
    playAI: "🤖 Play Against Computer (AI)",
    playOnline: "🌐 Play Online (Coming Soon)",
    profile: "👤 Profile",
    ranking: "🏆 Ranking",
    leaderboard: "🥇 Top 100 Leaderboard",
    scoring: "📊 Scoring System",
    settings: "⚙️ Settings",
    back: "⬅️ Back",
    btnQuit: "🚪 Main Menu",
    soundEffects: "Sound Effects",
    on: "ON",
    off: "OFF",
    tabStats: "Stats",
    tabBadges: "Achievements",
    tabHistory: "Match History",
    editAvatarTitle: "Select Avatar or Upload Image",
    uploadCustom: "📷 Upload custom image from device",
    rankClass: "Rank Class",
    totalPoints: "Points",
    winRate: "Win Rate",
    matches: "Wins / Losses",
    titleLabel: "Title",
    defaultTitle: "Rookie",
    win: "Victory",
    loss: "Defeat",
    ach1Title: "First Mill",
    ach1Desc: "Formed the first mill of your career",
    ach2Title: "First Victory",
    ach2Desc: "Won your first game",
    ach3Title: "Unstoppable",
    ach3Desc: "Achieved a 5 win streak",
    scoringTitle: "Scoring Rules",
    winPointsRule: "🏆 Victory: +12 Points",
    lossPointsRule: "❌ Defeat: -6 Points",
    millBonusRule: "⚡ Mill Bonus: +1 Point per mill (Max +4 per match)",
    domWinRule: "🔥 Dominant Victory (6+ pieces remaining): +3 Points",
    streakRule: "🔥 Win Streak (3+ wins): +3 Points",
    protectionRule: "🛡️ Floor Protection: Points cannot drop below 0",
    rankingTitle: "Rank Hierarchy",
    ptsRequired: "points",
    aiDifficultyTitle: "Select AI Difficulty",
    easy: "🟢 Easy",
    medium: "🟡 Medium",
    hard: "🔴 Hard",
    titleNames: "Enter Player Names",
    p1Label: "Player 1 (Max 12 chars):",
    p2Label: "Player 2 (Max 12 chars):",
    btnNextCoin: "Continue to Coin Toss",
    titleCoin: "Coin Toss",
    coinPrompt: "chooses the coin side:",
    heads: "HEADS",
    tails: "TAILS",
    resultTitle: "Result is",
    winnerIs: "Coin toss winner is",
    chooseColor: "Choose color (White player always moves first):",
    white: "White",
    black: "Black",
    turn: "Turn:",
    whiteLabel: "White",
    blackLabel: "Black",
    alertRemove: "⚠️ SELECT AN OPPONENT'S PIECE TO REMOVE!",
    millAlert: "You cannot remove a piece from a Mill unless the opponent has no other free pieces!",
    gameOverWinner: "🎉 Winner is"
  }
};

const playAudioEffect = (type, soundEnabled = true) => {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    if (type === 'pickup') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
      gain.gain.setValueAtTime(0.25, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(); osc.stop(now + 0.08);
    } else if (type === 'place') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'triangle'; osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      gain.gain.setValueAtTime(0.4, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(); osc.stop(now + 0.12);
    } else if (type === 'coinSpin') {
      for (let i = 0; i < 14; i++) {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine'; osc.frequency.setValueAtTime(700 + Math.random() * 300, now + i * 0.14);
        gain.gain.setValueAtTime(0.02, now + i * 0.14); gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.05);
        osc.start(now + i * 0.14); osc.stop(now + i * 0.14 + 0.05);
      }
    } else if (type === 'coinLand') {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.12);
      gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(); osc.stop(now + 0.12);
    } else if (type === 'victory') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        const duration = idx === notes.length - 1 ? 0.35 : 0.11;
        gain.gain.setValueAtTime(0.25, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + duration);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + duration);
      });
    } else if (type === 'defeat') {
      const tones = [440, 370, 280];
      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + idx * 0.18 + 0.17);
        gain.gain.setValueAtTime(0.2, now + idx * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.18 + 0.17);
        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 0.17);
      });
    }
  } catch (e) { }
};

// Pomoćna funkcija koja čita i spaja profil iz mlin_user_profile i mlin_admin_profiles
const loadSyncedProfile = () => {
  const defaultAvatars = getDefaultUnlockedAvatarIds();
  let userProf = {
    name: 'Igrač 1',
    avatar: '🦁',
    bio: 'Spreman za igru!',
    points: 0,
    wins: 0,
    losses: 0,
    matchHistory: [],
    achievements: [],
    unlockedAvatars: defaultAvatars
  };

  try {
    const savedUser = localStorage.getItem('mlin_user_profile');
    if (savedUser) {
      userProf = { ...userProf, ...JSON.parse(savedUser) };
    }
  } catch (e) { }

  // Provjeri postoji li taj igrač u mlin_admin_profiles i spoji njegova postignuća I otključane avatare (M:N)
  try {
    const savedAdminProfiles = localStorage.getItem('mlin_admin_profiles');
    if (savedAdminProfiles) {
      const adminList = JSON.parse(savedAdminProfiles);
      if (Array.isArray(adminList)) {
        const match = adminList.find(
          p => (p.id && p.id === userProf.id) || (p.name && userProf.name && p.name.toLowerCase() === userProf.name.toLowerCase())
        );
        if (match) {
          const mergedAchs = Array.from(new Set([
            ...(Array.isArray(userProf.achievements) ? userProf.achievements : []),
            ...(Array.isArray(match.achievements) ? match.achievements : [])
          ]));
          const mergedAvatars = Array.from(new Set([
            ...defaultAvatars,
            ...(Array.isArray(userProf.unlockedAvatars) ? userProf.unlockedAvatars : []),
            ...(Array.isArray(match.unlockedAvatars) ? match.unlockedAvatars : [])
          ]));
          userProf = {
            ...userProf,
            id: userProf.id || match.id,
            achievements: mergedAchs,
            unlockedAvatars: mergedAvatars
          };
        }
      }
    }
  } catch (e) { }

  if (!Array.isArray(userProf.achievements)) userProf.achievements = [];
  if (!Array.isArray(userProf.unlockedAvatars) || userProf.unlockedAvatars.length === 0) {
    userProf.unlockedAvatars = defaultAvatars;
  }

  return evaluateGameAvatars(userProf);
};

// Pomoćna funkcija koja skuplja SVA postignuća iz svih mogućih izvora u localStorageu + osnovni katalog
const loadFullAchievementsCatalog = (extraList = []) => {
  let base = [];
  try {
    const stored = getStoredAchievements();
    if (Array.isArray(stored)) base = [...stored];
  } catch (e) { }

  const storageKeys = ['mlin_admin_achievements', 'mlin_achievements', 'achievements'];
  storageKeys.forEach(key => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          base = [...base, ...parsed];
        }
      }
    } catch (e) { }
  });

  if (Array.isArray(extraList)) {
    base = [...base, ...extraList];
  }

  const map = new Map();
  base.forEach(item => {
    if (item && item.id) {
      map.set(String(item.id).trim(), item);
    }
  });

  return Array.from(map.values());
};

export default function App() {
  const location = useLocation();
  const onlineGameId = location.pathname.startsWith('/game/')
    ? location.pathname.split('/game/')[1]
    : null;

  const myColor = sessionStorage.getItem('mlin_my_color');
  const navigate = useNavigate();

  const [lang, setLang] = useState('hr');
  const t = TRANSLATIONS[lang];

  const [currentScreen, setCurrentScreen] = useState('MAIN_MENU');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const fileInputRef = useRef(null);

  const [leaderboard, setLeaderboard] = useState([]);

  const [profile, setProfile] = useState(() => loadSyncedProfile());
  const [achievementsCatalog, setAchievementsCatalog] = useState(() => {
    try {
      return getStoredAchievements();
    } catch (e) {
      return [];
    }
  });

  const [avatarsCatalog, setAvatarsCatalog] = useState(() => getStoredAvatars());
  const [achievementFilter, setAchievementFilter] = useState('ALL');

  // Helper za ručnu promjenu profila iz UI-a (ime, bio, avatar) koji odmah sprema u localStorage
  const updateProfileAndSave = (updater) => {
    setProfile(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('mlin_user_profile', JSON.stringify(next));
      } catch (e) { }
      return next;
    });
  };

  // Osvježi katalog postignuća i avatara iz Admin panela i Firebasea
  useEffect(() => {
    const updateCatalogs = async () => {
      const freshProfile = loadSyncedProfile();
      setProfile(freshProfile);

      const savedCustomAch = localStorage.getItem('mlin_admin_achievements');
      if (savedCustomAch) {
        try {
          const parsed = JSON.parse(savedCustomAch);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAchievementsCatalog(parsed);
          }
        } catch (err) { }
      }

      setAvatarsCatalog(getStoredAvatars());

      if (db) {
        try {
          const fbAvatars = await fetchAvatarsFromFirebase();
          if (fbAvatars && fbAvatars.length > 0) {
            setAvatarsCatalog(fbAvatars);
          }
        } catch (e) { }
      }
    };

    if (currentScreen === 'PROFILE' || currentScreen === 'ACHIEVEMENTS') {
      updateCatalogs();
    }

    window.addEventListener('storage', updateCatalogs);
    return () => window.removeEventListener('storage', updateCatalogs);
  }, [currentScreen]);

  const [profileTab, setProfileTab] = useState('STATS');
  const [isEditingName, setIsEditingName] = useState(false);

  // AI STANJA
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState('EASY');
  const [aiColor, setAiColor] = useState('BLACK');

  const [setupStep, setSetupStep] = useState('NAMES');
  const [p1Name, setP1Name] = useState(profile.name);
  const [p2Name, setP2Name] = useState('Igrač 2');

  const [coinRotation, setCoinRotation] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResultText, setCoinResultText] = useState('');
  const [coinWinner, setCoinWinner] = useState(null);
  const [captured, setCaptured] = useState({ WHITE: 0, BLACK: 0 });

  const [players, setPlayers] = useState({
    WHITE: { name: '', id: 1 },
    BLACK: { name: '', id: 2 }
  });

  const [board, setBoard] = useState(Array(24).fill(null));
  const [turn, setTurn] = useState('WHITE');
  const [unplaced, setUnplaced] = useState({ WHITE: 9, BLACK: 9 });
  const [mustRemove, setMustRemove] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [keyboardFocusNode, setKeyboardFocusNode] = useState(0);
  const [winner, setWinner] = useState(null);

  const [gameCategory, setGameCategory] = useState('CASUAL');
  const [timeControl, setTimeControl] = useState(120);
  const [timeLeft, setTimeLeft] = useState({ WHITE: 120, BLACK: 120 });

  const [activeHeldPiece, setActiveHeldPiece] = useState(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const isMouseDownRef = useRef(false);

  // Učitavanje pravila bodovanja (iz admin panela ili zadani niz)
  const DEFAULT_SCORING_RULES = [
    { id: 'rule-win', icon: '🏆', title: 'Pobjeda', value: '+12 Bodova' },
    { id: 'rule-loss', icon: '❌', title: 'Poraz', value: '-6 Bodova' },
    { id: 'rule-mill', icon: '🎯', title: 'Mlin bonus', value: '+1 Bod po mlinu (Max +4 po meču)' },
    { id: 'rule-dom', icon: '👑', title: 'Dominantna pobjeda (6+ figura)', value: '+3 Boda' },
    { id: 'rule-streak', icon: '🔥', title: 'Niz pobjeda (3+ pobjede u nizu)', value: '+3 Boda' },
    { id: 'rule-prot', icon: '🛡️', title: 'Zaštita', value: 'Bodovi ne mogu pasti ispod 0' }
  ];

  const [activeScoringRules, setActiveScoringRules] = useState(() => {
    const saved = localStorage.getItem('mlin_scoring_rules');
    return saved ? JSON.parse(saved) : DEFAULT_SCORING_RULES;
  });

  useEffect(() => {
    const refreshRules = () => {
      const saved = localStorage.getItem('mlin_scoring_rules');
      if (saved) {
        try {
          setActiveScoringRules(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    };

    refreshRules();
    window.addEventListener('storage', refreshRules);
    return () => window.removeEventListener('storage', refreshRules);
  }, [currentScreen]);

  // Ako smo u online meču, automatski gasi AI i odmah prebaci na PLAY ekran
  useEffect(() => {
    if (onlineGameId) {
      setIsAIMode(false);
      setCurrentScreen('GAME');
      setSetupStep('PLAY');
    }
  }, [onlineGameId]);

  // Firestore sinkronizacija u stvarnom vremenu
  useEffect(() => {
    if (!onlineGameId) return;

    const unsubscribe = onSnapshot(doc(db, "games", onlineGameId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.board) setBoard(data.board);
        if (data.currentTurn) setTurn(data.currentTurn);
        if (typeof data.mustRemove === 'boolean') setMustRemove(data.mustRemove);
        if (data.unplaced) setUnplaced(data.unplaced);

        if (data.winner && !winner) {
          setWinner(data.winner);
          const userColor = players.WHITE.name === profile.name ? 'WHITE' : (players.BLACK.name === profile.name ? 'BLACK' : null);
          if (userColor) {
            playAudioEffect(data.winner === userColor ? 'victory' : 'defeat', soundEnabled);
          }
        }

        if (data.playerWhite && data.playerBlack) {
          const whiteName = typeof data.playerWhite === 'object' ? (data.playerWhite.name || 'Bijeli') : data.playerWhite;
          const blackName = typeof data.playerBlack === 'object' ? (data.playerBlack.name || 'Crni') : data.playerBlack;
          setPlayers({
            WHITE: { name: whiteName, id: 1 },
            BLACK: { name: blackName, id: 2 }
          });
          setP1Name(whiteName);
          setP2Name(blackName);
        }
      }
    });

    return () => unsubscribe();
  }, [onlineGameId]);

  // Globalni slušač za pomicanje miša
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleGlobalMouseUp = () => {
      isMouseDownRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // AI POTEZ AUTOMATIKA
  useEffect(() => {
    if (!isAIMode || onlineGameId || currentScreen !== 'GAME' || setupStep !== 'PLAY' || winner) return;

    if (turn === aiColor) {
      const timer = setTimeout(() => {
        if (mustRemove) {
          const targetNode = getAIPieceToRemove(board, turn === 'WHITE' ? 'BLACK' : 'WHITE', aiDifficulty);
          if (targetNode !== null) {
            executePlaceOrMove(targetNode);
          }
          return;
        }

        if (unplaced[aiColor] > 0) {
          const targetNode = getAIPlacementNode(board, aiColor, aiDifficulty);
          if (targetNode !== null) {
            executePlaceOrMove(targetNode);
          }
          return;
        }

        const move = getAIMove(board, aiColor, aiDifficulty);
        if (move) {
          executePlaceOrMove(move.to, move.from);
        } else {
          const humanPlayer = aiColor === 'WHITE' ? 'BLACK' : 'WHITE';
          handleGameEnd(humanPlayer);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [turn, mustRemove, board, unplaced, isAIMode, onlineGameId, currentScreen, setupStep, winner, aiColor, aiDifficulty]);

  // ŠAHOVSKI SAT
  useEffect(() => {
    if (gameCategory !== 'COMPETITIVE' || currentScreen !== 'GAME' || setupStep !== 'PLAY' || winner) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const currentTime = prev[turn];
        if (currentTime === null || currentTime === undefined) return prev;

        if (currentTime <= 1) {
          clearInterval(timer);
          const winningColor = turn === 'WHITE' ? 'BLACK' : 'WHITE';
          handleGameEnd(winningColor);
          return { ...prev, [turn]: 0 };
        }
        return { ...prev, [turn]: currentTime - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameCategory, currentScreen, setupStep, winner, turn]);

  // KONTROLA IGRE TIPKOVNICOM
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentScreen !== 'GAME' || setupStep !== 'PLAY' || winner) return;
      if (onlineGameId && turn !== myColor) return;
      if (isAIMode && turn === aiColor) return;

      let direction = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') direction = 'UP';
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') direction = 'DOWN';
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') direction = 'LEFT';
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') direction = 'RIGHT';

      if (direction) {
        e.preventDefault();
        setKeyboardFocusNode((prev) => getNextNodeByDirection(prev, direction));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (keyboardFocusNode !== null) {
          executePlaceOrMove(keyboardFocusNode);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen, setupStep, winner, isAIMode, onlineGameId, myColor, turn, aiColor, keyboardFocusNode]);

  // POMOĆNE METODE I LOGIKA
  const fetchLeaderboard = async () => {
    const data = await getLeaderboard();
    setLeaderboard(data);
  };

  const totalMatches = profile.wins + profile.losses;
  const winRate = totalMatches > 0 ? Math.round((profile.wins / totalMatches) * 100) : 0;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfileAndSave((prev) => ({ ...prev, avatar: reader.result }));
        setProfileTab('STATS');
      };
      reader.readAsDataURL(file);
    }
  };

  const renderAvatar = (src) => {
    if (src && (src.startsWith('data:image') || src.startsWith('http'))) {
      return <img src={src} alt="Avatar" className="avatar-img" />;
    }
    return <span>{src || '🦁'}</span>;
  };

  const syncGameState = (nextBoard, nextTurn, extraUpdates = {}) => {
    setBoard(nextBoard);
    if (nextTurn) setTurn(nextTurn);

    if (onlineGameId) {
      updateDoc(doc(db, "games", onlineGameId), {
        board: nextBoard,
        ...(nextTurn ? { currentTurn: nextTurn } : {}),
        ...extraUpdates
      });
    }
  };

  const startCouchGame = () => {
    setIsAIMode(false);
    setBoard(Array(24).fill(null));
    setTurn('WHITE');
    setUnplaced({ WHITE: 9, BLACK: 9 });
    setMustRemove(false);
    setSelectedNode(null);
    setActiveHeldPiece(null);
    setWinner(null);
    setP1Name(profile.name);
    setP2Name('Igrač 2');
    setSetupStep('NAMES');
    setCurrentScreen('GAME');
    setCaptured({ WHITE: 0, BLACK: 0 });
  };

  const startAIGame = (difficulty) => {
    setIsAIMode(true);
    setAiDifficulty(difficulty);
    setAiColor('BLACK');
    setBoard(Array(24).fill(null));
    setTurn('WHITE');
    setUnplaced({ WHITE: 9, BLACK: 9 });
    setMustRemove(false);
    setSelectedNode(null);
    setActiveHeldPiece(null);
    setWinner(null);
    setP1Name(profile.name);
    setP2Name(`AI (${difficulty})`);
    setSetupStep('NAMES');
    setCurrentScreen('GAME');
    setCaptured({ WHITE: 0, BLACK: 0 });
  };

  const handleProceedToCoinToss = async () => {
    const p1Data = await getOrCreateProfile(p1Name);
    if (p1Data) {
      updateProfileAndSave(prev => ({
        ...prev,
        name: p1Data.name,
        points: p1Data.rankPoints || 0,
        wins: p1Data.wins || 0,
        losses: p1Data.losses || 0
      }));
    }

    if (!isAIMode && p2Name) {
      await getOrCreateProfile(p2Name);
    }

    setSetupStep('COIN_TOSS');
  };

  const triggerCoinFlip = (choice) => {
    if (isFlipping) return;
    setIsFlipping(true);
    playAudioEffect('coinSpin', soundEnabled);

    const isHeads = Math.random() < 0.5;
    const currentBaseSpins = Math.floor(coinRotation / 360) + 6;
    const finalDegree = isHeads ? currentBaseSpins * 360 : currentBaseSpins * 360 + 180;

    setCoinRotation(finalDegree);

    setTimeout(() => {
      playAudioEffect('coinLand', soundEnabled);
      setIsFlipping(false);
      const isWinnerP1 = choice === (isHeads ? 'heads' : 'tails');
      const winnerId = isWinnerP1 ? 1 : 2;

      setCoinResultText(isHeads ? t.heads : t.tails);
      setCoinWinner(winnerId);

      if (isAIMode && winnerId === 2) {
        setPlayers({
          WHITE: { name: p2Name, id: 2 },
          BLACK: { name: p1Name, id: 1 }
        });
        setAiColor('WHITE');

        const initialSecondsAI = gameCategory === 'COMPETITIVE' ? timeControl : null;
        setTimeLeft({ WHITE: initialSecondsAI, BLACK: initialSecondsAI });

        setTurn('WHITE');
        setSetupStep('PLAY');
      } else {
        setSetupStep('COLOR_SELECT');
      }
    }, 2500);
  };

  const handleColorSelect = (color) => {
    const p1Color = coinWinner === 1 ? color : (color === 'WHITE' ? 'BLACK' : 'WHITE');
    const p2Color = coinWinner === 2 ? color : (color === 'WHITE' ? 'BLACK' : 'WHITE');

    setPlayers({
      WHITE: {
        name: p1Color === 'WHITE' ? p1Name : p2Name,
        id: p1Color === 'WHITE' ? 1 : 2
      },
      BLACK: {
        name: p1Color === 'BLACK' ? p1Name : p2Name,
        id: p1Color === 'BLACK' ? 1 : 2
      }
    });

    if (isAIMode) {
      setAiColor(p2Color);
    }

    const initialSeconds = gameCategory === 'COMPETITIVE' ? timeControl : null;
    setTimeLeft({ WHITE: initialSeconds, BLACK: initialSeconds });

    setTurn('WHITE');
    setSetupStep('PLAY');
  };

  const getPiecesCount = (color) => board.filter(cell => cell === color).length;

  const handleGameEnd = (winningColor) => {
    setWinner(winningColor);

    if (onlineGameId) {
      updateDoc(doc(db, "games", onlineGameId), {
        winner: winningColor
      });
    }
    const userColor = players.WHITE.name === profile.name ? 'WHITE' : (players.BLACK.name === profile.name ? 'BLACK' : null);

    if (userColor) {
      const isUserWinner = winningColor === userColor;
      playAudioEffect(isUserWinner ? 'victory' : 'defeat', soundEnabled);
    } else {
      playAudioEffect('victory', soundEnabled);
    }

    if (!userColor) return;

    const isUserWinner = winningColor === userColor;
    const pointDelta = isUserWinner ? 12 : -6;
    const newPoints = Math.max(0, profile.points + pointDelta);

    const today = new Date();
    const dateStr = `${today.getDate()}.${today.getMonth() + 1}.`;
    const opponentName = isAIMode ? `AI (${aiDifficulty})` : (userColor === 'WHITE' ? players.BLACK.name : players.WHITE.name);

    const newMatch = {
      player: profile.name,
      vs: opponentName,
      isWin: isUserWinner,
      score: isUserWinner ? '+12' : '-6',
      date: dateStr,
      category: gameCategory
    };

    const baseUpdatedProfile = {
      ...profile,
      points: newPoints,
      wins: isUserWinner ? (profile.wins || 0) + 1 : (profile.wins || 0),
      losses: !isUserWinner ? (profile.losses || 0) + 1 : (profile.losses || 0),
      matchHistory: [newMatch, ...(profile.matchHistory || []).slice(0, 9)]
    };

    const finalProfile = evaluateGameAchievements(baseUpdatedProfile, {
      isWin: isUserWinner,
      isAIMode: isAIMode,
      aiDifficulty: typeof aiDifficulty !== 'undefined' ? aiDifficulty : (opponentName?.includes('Lako') ? 'EASY' : 'MEDIUM'),
      millsFormed: typeof playerMillsCount !== 'undefined' ? playerMillsCount : (isUserWinner ? 1 : 0),
      wonByBlock: typeof isOpponentTrapped !== 'undefined' ? isOpponentTrapped : false,
      lostByBlock: typeof isPlayerTrapped !== 'undefined' ? isPlayerTrapped : false,
      piecesCaptured: typeof enemyCapturedCount !== 'undefined' ? enemyCapturedCount : (isUserWinner ? 7 : 0),
      totalTurns: typeof moveCount !== 'undefined' ? moveCount : 40
    });

    updateProfileAndSave(finalProfile);
    saveMatchHistory(newMatch);

    if (!isAIMode) {
      const winnerPlayer = isUserWinner ? profile.name : opponentName;
      const loserPlayer = isUserWinner ? opponentName : profile.name;
      updateMatchResults(winnerPlayer, loserPlayer, false, gameCategory);
    }
  };

  const handleCancelSelection = () => {
    setSelectedNode(null);
    setActiveHeldPiece(null);
  };

  const executePlaceOrMove = (nodeIndex, customSource = null) => {
    if (winner) return;
    if (onlineGameId && turn !== myColor) return;

    const opponent = turn === 'WHITE' ? 'BLACK' : 'WHITE';

    // 1. FAZA UKLANJANJA FIGURA
    if (mustRemove) {
      if (board[nodeIndex] !== opponent) return;

      const opponentNodes = board.map((val, idx) => val === opponent ? idx : null).filter(val => val !== null);
      const allInMill = opponentNodes.every(idx => isPieceInMill(board, idx, opponent));

      if (!allInMill && isPieceInMill(board, nodeIndex, opponent)) {
        alert(t.millAlert);
        return;
      }

      playAudioEffect('pickup', soundEnabled);
      const newBoard = [...board];
      newBoard[nodeIndex] = null;
      setBoard(newBoard);
      setCaptured(prev => ({ ...prev, [turn]: prev[turn] + 1 }));
      setMustRemove(false);
      setSelectedNode(null);
      setActiveHeldPiece(null);

      const isOpponentDefeated = unplaced[opponent] === 0 && newBoard.filter(c => c === opponent).length < 3;

      if (isOpponentDefeated) {
        syncGameState(newBoard, turn, { mustRemove: false, winner: turn });
        handleGameEnd(turn);
        return;
      }

      setTimeout(() => {
        syncGameState(newBoard, opponent, { mustRemove: false });
      }, 50);
      return;
    }

    // 2. FAZA POSTAVLJANJA FIGURA IZ STALKA
    const isPlacingFromRack = activeHeldPiece && activeHeldPiece.type === 'RACK';
    if (unplaced[turn] > 0 || isPlacingFromRack) {
      if (board[nodeIndex] !== null) return;

      playAudioEffect('place', soundEnabled);
      const newBoard = [...board];
      newBoard[nodeIndex] = turn;

      const nextUnplaced = { ...unplaced, [turn]: unplaced[turn] - 1 };
      setUnplaced(nextUnplaced);

      setActiveHeldPiece(null);
      setSelectedNode(null);

      if (checkFormsMill(newBoard, nodeIndex, turn)) {
        setMustRemove(true);
        syncGameState(newBoard, turn, {
          mustRemove: true,
          unplaced: nextUnplaced
        });
      } else {
        const isPlacementPhaseOver = nextUnplaced.WHITE === 0 && nextUnplaced.BLACK === 0;
        const oppCount = newBoard.filter(cell => cell === opponent).length;
        if (isPlacementPhaseOver && (oppCount < 3 || !hasLegalMoves(newBoard, opponent, oppCount === 3))) {
          handleGameEnd(turn);
          return;
        }

        syncGameState(newBoard, opponent, {
          mustRemove: false,
          unplaced: nextUnplaced
        });
      }
      return;
    }

    // 3. FAZA POMICANJA / LETENJA PO PLOČI
    const source = customSource !== null ? customSource : (activeHeldPiece?.sourceIdx ?? selectedNode);
    const isFlying = getPiecesCount(turn) === 3;

    if (source === null) {
      if (board[nodeIndex] === turn) {
        playAudioEffect('pickup', soundEnabled);
        setSelectedNode(nodeIndex);
        setActiveHeldPiece({ type: 'NODE', sourceIdx: nodeIndex, color: turn });
      }
    } else {
      if (nodeIndex === source) {
        setSelectedNode(null);
        setActiveHeldPiece(null);
        return;
      }

      const isAdjacent = (BOARD_CONNECTIONS[source] || []).includes(nodeIndex);
      if (board[nodeIndex] === null && (isAdjacent || isFlying)) {
        playAudioEffect('place', soundEnabled);
        const newBoard = [...board];
        newBoard[source] = null;
        newBoard[nodeIndex] = turn;
        setBoard(newBoard);
        setSelectedNode(null);
        setActiveHeldPiece(null);

        if (checkFormsMill(newBoard, nodeIndex, turn)) {
          setMustRemove(true);
          syncGameState(newBoard, turn, { mustRemove: true });
        } else {
          const oppCount = newBoard.filter(cell => cell === opponent).length;

          if (oppCount < 3 || !hasLegalMoves(newBoard, opponent, oppCount === 3)) {
            handleGameEnd(turn);
            return;
          }
          syncGameState(newBoard, opponent, { mustRemove: false });
        }
      } else if (board[nodeIndex] === turn) {
        playAudioEffect('pickup', soundEnabled);
        setSelectedNode(nodeIndex);
        setActiveHeldPiece({ type: 'NODE', sourceIdx: nodeIndex, color: turn });
      }
    }
  };

  const opponentColor = turn === 'WHITE' ? 'BLACK' : 'WHITE';
  const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const opponentNodes = board.map((val, idx) => val === opponentColor ? idx : null).filter(val => val !== null);
  const opponentNotInMill = opponentNodes.filter(idx => !isPieceInMill(board, idx, opponentColor));

  const removableNodes = mustRemove
    ? (opponentNotInMill.length > 0 ? opponentNotInMill : opponentNodes)
    : [];

  const currentActiveNode = activeHeldPiece?.sourceIdx ?? selectedNode;
  const validMoves = currentActiveNode !== null
    ? (getPiecesCount(turn) === 3
      ? board.map((v, i) => v === null ? i : null).filter(v => v !== null)
      : (BOARD_CONNECTIONS[currentActiveNode] || []).filter(i => board[i] === null))
    : [];

  const p1Color = players.WHITE.id === 1 ? 'WHITE' : 'BLACK';
  const p2Color = players.WHITE.id === 2 ? 'WHITE' : 'BLACK';

  const p1CapturedCount = captured[p1Color] || 0;
  const p2CapturedCount = captured[p2Color] || 0;

  return (
    <div className="game-container" onClick={() => {
      if (selectedNode !== null || activeHeldPiece !== null) {
        setSelectedNode(null);
        setActiveHeldPiece(null);
      }
    }}>
      {activeHeldPiece && !winner && (
        <div
          className={`floating-cursor-piece ${activeHeldPiece.color === 'WHITE' ? 'piece-white' : 'piece-black'}`}
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        />
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />

      {/* 1. GLAVNI IZBORNIK */}
      {currentScreen === 'MAIN_MENU' && (
        <div className="menu-card menu-card-wide" onClick={(e) => e.stopPropagation()}>
          <div className="menu-header">
            <h1 className="menu-title">{t.menuTitle}</h1>
            <div className="lang-switcher-inline">
              <button className={`lang-btn ${lang === 'hr' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setLang('hr'); }}>HR</button>
              <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setLang('en'); }}>EN</button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 16px 0' }}>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              style={{
                backgroundColor: '#1e293b',
                color: '#fbbf24',
                border: '1px solid #d97706',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                letterSpacing: '0.5px'
              }}
            >
              ⚙️ Admin Panel
            </button>
          </div>
          <div className="menu-grid-2col">
            <button className="btn-menu" onClick={startCouchGame}>{t.playOffline}</button>
            <button
              className="btn-menu"
              onClick={() => {
                setProfile(loadSyncedProfile());
                setAchievementsCatalog(loadFullAchievementsCatalog());
                setProfileTab('STATS');
                setCurrentScreen('PROFILE');
              }}
            >
              {t.profile}
            </button>

            <button className="btn-menu" onClick={() => setCurrentScreen('AI_SETUP')}>{t.playAI}</button>
            <button className="btn-menu" onClick={() => setCurrentScreen('RANKING')}>{t.ranking}</button>

            <button className="btn-menu" disabled>{t.playOnline}</button>
            <button className="btn-menu" onClick={() => { fetchLeaderboard(); setCurrentScreen('LEADERBOARD'); }}>{t.leaderboard}</button>

            <button className="btn-menu" onClick={() => setCurrentScreen('SCORING')}>{t.scoring}</button>
            <button
              className="btn-menu"
              onClick={() => {
                setProfile(loadSyncedProfile());
                setAchievementsCatalog(loadFullAchievementsCatalog());
                setCurrentScreen('ACHIEVEMENTS');
              }}
            >
              🏅 Postignuća
            </button>

            <button className="btn-menu" onClick={() => setCurrentScreen('SETTINGS')}>{t.settings}</button>
            <button className="btn-menu" onClick={() => navigate('/admin')}>⁉️ Dodajem poslije</button>
          </div>
        </div>
      )}

      {/* AI SETUP */}
      {currentScreen === 'AI_SETUP' && (
        <div className="menu-card" onClick={(e) => e.stopPropagation()}>
          <h2 className="menu-title">{t.aiDifficultyTitle}</h2>
          <div className="menu-list">
            <button className="btn-menu" onClick={() => startAIGame('EASY')}>{t.easy}</button>
            <button className="btn-menu" onClick={() => startAIGame('MEDIUM')}>{t.medium}</button>
            <button className="btn-menu" onClick={() => startAIGame('HARD')}>{t.hard}</button>
            <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
          </div>
        </div>
      )}

      {/* PROFIL */}
      {currentScreen === 'PROFILE' && (
        <div className="menu-card" onClick={(e) => e.stopPropagation()}>
          <div className="profile-header">
            <div className="avatar-container">
              {renderAvatar(profile.avatar)}
              <button className="avatar-edit-btn" onClick={() => setProfileTab('AVATAR_SELECT')}>✏️</button>
            </div>

            {isEditingName ? (
              <input
                type="text"
                value={profile.name}
                maxLength={12}
                onChange={(e) => updateProfileAndSave({ ...profile, name: e.target.value })}
                onBlur={() => setIsEditingName(false)}
                autoFocus
                style={{ textAlign: 'center', width: '70%', background: '#071524', color: '#fff', border: '1px solid #d4af37', borderRadius: '6px', padding: '4px' }}
              />
            ) : (
              <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setIsEditingName(true)}>
                {profile.name} ✏️
              </h2>
            )}

            <span className="profile-title-tag">{t.defaultTitle}</span>

            <input
              className="bio-input"
              value={profile.bio}
              maxLength={40}
              placeholder="Upišite status poruku..."
              onChange={(e) => updateProfileAndSave({ ...profile, bio: e.target.value })}
            />
          </div>

          {profileTab !== 'AVATAR_SELECT' && (
            <div className="profile-tabs">
              <button className={`tab-btn ${profileTab === 'STATS' ? 'active' : ''}`} onClick={() => setProfileTab('STATS')}>{t.tabStats}</button>
              <button
                className={`tab-btn ${profileTab === 'BADGES' ? 'active' : ''}`}
                onClick={() => {
                  setProfile(loadSyncedProfile());
                  setAchievementsCatalog(loadFullAchievementsCatalog());
                  setProfileTab('BADGES');
                }}
              >
                {t.tabBadges}
              </button>
              <button className={`tab-btn ${profileTab === 'HISTORY' ? 'active' : ''}`} onClick={() => setProfileTab('HISTORY')}>{t.tabHistory}</button>
            </div>
          )}

          {profileTab === 'STATS' && (
            <div className="info-box">
              <div className="info-item"><span>{t.rankClass}:</span> <span className="badge-rank">{getRankName(profile.points, lang)}</span></div>
              <div className="info-item"><span>{t.totalPoints}:</span> <strong>{profile.points} B</strong></div>
              <div className="info-item"><span>{t.winRate}:</span> <strong>{winRate}%</strong></div>
              <div className="info-item"><span>{t.matches}:</span> <strong>{profile.wins} / {profile.losses}</strong></div>
            </div>
          )}

          {profileTab === 'BADGES' && (
            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
              {(() => {
                const liveProfile = loadSyncedProfile();
                const userAchs = (Array.isArray(liveProfile?.achievements) ? liveProfile.achievements : []).map(id => String(id).trim());
                const uniqueCatalog = loadFullAchievementsCatalog(achievementsCatalog);

                // Pronađi svako postignuće iz kataloga, a ako ga nekim slučajem nema u katalogu, prikaži fallback karticu da se uvijek vidi!
                const unlockedList = userAchs.map(achId => {
                  const found = uniqueCatalog.find(a => String(a.id).trim() === achId);
                  if (found) return found;
                  return {
                    id: achId,
                    title: `Postignuće (${achId})`,
                    desc: 'Posebno dodijeljeno postignuće',
                    icon: '🏅'
                  };
                });

                if (unlockedList.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '0.85rem' }}>
                      Igrač još nema dodijeljenih postignuća.
                    </div>
                  );
                }

                return unlockedList.map((ach) => (
                  <div
                    key={ach.id}
                    className="achievement-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#0f172a',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      borderLeft: '4px solid #22c55e'
                    }}
                  >
                    <div className="achievement-icon" style={{ fontSize: '1.4rem' }}>
                      {ach.icon || '🏅'}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#f8fafc' }}>
                        {ach.title || ach.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {ach.description || ach.desc}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}

          {profileTab === 'HISTORY' && (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {(!profile.matchHistory || profile.matchHistory.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '15px', color: '#94a3b8', fontSize: '0.85rem' }}>
                  Nema odigranih mečeva.
                </div>
              ) : (
                profile.matchHistory.map((m, idx) => (
                  <div key={idx} className="history-item">
                    <span>vs <strong>{m.vs}</strong> ({m.date})</span>
                    <span className={m.isWin ? 'win-text' : 'loss-text'}>
                      {m.isWin ? t.win : t.loss} ({m.score})
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {profileTab === 'AVATAR_SELECT' && (
            <div>
              <button className="upload-avatar-btn" onClick={() => fileInputRef.current.click()}>
                {t.uploadCustom}
              </button>
              <p style={{ fontSize: '0.85rem', color: '#fce055', marginBottom: '10px' }}>
                {t.editAvatarTitle} — Otključano: {(profile.unlockedAvatars || []).length} / {avatarsCatalog.length}
              </p>
              <div
                className="avatar-grid"
                style={{
                  maxHeight: '240px',
                  overflowY: 'auto',
                  paddingRight: '6px'
                }}
              >
                {getStoredAvatars().map((avItem) => {
                  const unlockedIds = Array.isArray(profile.unlockedAvatars) ? profile.unlockedAvatars : [];
                  const isUnlocked = avItem.isDefault || unlockedIds.includes(avItem.id);
                  const isSelected = profile.avatar === avItem.icon;

                  return (
                    <div
                      key={avItem.id}
                      className="avatar-option"
                      title={isUnlocked ? `${avItem.name} (Klikni za odabir)` : `🔒 ${avItem.name} — ${avItem.unlockHint || 'Zaključano'}`}
                      style={{
                        opacity: isUnlocked ? 1 : 0.35,
                        filter: isUnlocked ? 'none' : 'grayscale(100%)',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        border: isSelected ? '2px solid #22c55e' : '1px solid #334155',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px 4px',
                        minHeight: '64px'
                      }}
                      onClick={() => {
                        if (!isUnlocked) return;
                        updateProfileAndSave({ ...profile, avatar: avItem.icon });
                        setProfileTab('STATS');
                      }}
                    >
                      <span style={{ fontSize: '1.45rem' }}>{avItem.icon}</span>
                      <span style={{ fontSize: '0.58rem', color: isUnlocked ? '#e2e8f0' : '#94a3b8', marginTop: '3px', textAlign: 'center', lineHeight: '1.1' }}>
                        {isUnlocked ? avItem.name : `🔒 ${avItem.unlockHint || 'Zaključano'}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
        </div>
      )}

      {/* RANGOVI */}
      {currentScreen === 'RANKING' && (
        <div className="menu-card" onClick={(e) => e.stopPropagation()}>
          <h2 className="menu-title">{t.rankingTitle}</h2>
          <div className="info-box" style={{ maxHeight: '260px', overflowY: 'auto' }}>
            {RANK_STEPS.map((r, i) => (
              <div key={i} className="info-item">
                <span>{lang === 'hr' ? r.hr : r.en}</span>
                <span>{r.min}+ {t.ptsRequired}</span>
              </div>
            ))}
          </div>
          <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
        </div>
      )}

      {/* LEADERBOARD */}
      {currentScreen === 'LEADERBOARD' && (
        <div className="menu-card" onClick={(e) => e.stopPropagation()}>
          <h2 className="menu-title">{t.leaderboard}</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Igrač</th>
                <th>Bodovi</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '12px', color: '#94a3b8' }}>
                    Učitavanje ljestvice...
                  </td>
                </tr>
              ) : (
                leaderboard.map((entry, idx) => {
                  const isCurrent = entry.name === profile.name;
                  return (
                    <tr key={entry.name || idx} className={isCurrent ? 'highlight-row' : ''}>
                      <td>{idx + 1}</td>
                      <td>{entry.name}{isCurrent ? ' (Vi)' : ''}</td>
                      <td>{entry.rankPoints || 0}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
        </div>
      )}

      {/* BODOVANJE - DINAMIČKI PRIKAZ IZ ADMIN PANELA */}
      {currentScreen === 'SCORING' && (
        <div className="menu-card" onClick={(e) => e.stopPropagation()}>
          <h2 className="menu-title">{t.scoringTitle}</h2>
          <div className="info-box" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
            {activeScoringRules.map((rule) => (
              <div key={rule.id} className="info-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem' }}>{rule.icon}</span>
                <span style={{ fontWeight: 'bold' }}>{rule.title}:</span>
                <span style={{ color: '#94a3b8' }}>{rule.value}</span>
              </div>
            ))}
          </div>
          <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>
            {t.back}
          </button>
        </div>
      )}

      {/* POSTAVKE */}
      {currentScreen === 'SETTINGS' && (
        <div className="menu-card" onClick={(e) => e.stopPropagation()}>
          <h2 className="menu-title">{t.settings}</h2>
          <div className="info-box">
            <div className="info-item">
              <span>{t.soundEffects}:</span>
              <button className="lang-btn" onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? t.on : t.off}
              </button>
            </div>
          </div>
          <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
        </div>
      )}

      {/* EKRAN: POSTIGNUĆA */}
      {currentScreen === 'ACHIEVEMENTS' && (
        <div
          className="menu-card"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '650px', width: '95%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        >
          {(() => {
            const liveProfile = loadSyncedProfile();
            const userAchs = (Array.isArray(liveProfile?.achievements) ? liveProfile.achievements : []).map(id => String(id).trim());
            const fullCat = loadFullAchievementsCatalog(achievementsCatalog);

            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h2 className="menu-title" style={{ margin: 0 }}>🏅 Postignuća</h2>
                  <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 'bold' }}>
                    Otključano: {userAchs.length} / {fullCat.length}
                  </div>
                </div>

                {/* Filteri */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'ALL', label: 'Sve' },
                    { id: 'UNLOCKED', label: 'Otključana' },
                    { id: 'LOCKED', label: 'Zaključana' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setAchievementFilter(f.id)}
                      style={{
                        background: achievementFilter === f.id ? '#3b82f6' : '#1e293b',
                        color: achievementFilter === f.id ? '#fff' : '#94a3b8',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Popis kartica postignuća */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                  {fullCat
                    .filter(ach => {
                      const isUnlocked = userAchs.includes(String(ach.id).trim());
                      if (achievementFilter === 'UNLOCKED') return isUnlocked;
                      if (achievementFilter === 'LOCKED') return !isUnlocked;
                      return true;
                    })
                    .map((ach) => {
                      const isUnlocked = userAchs.includes(String(ach.id).trim());
                      const defaultTier = { label: 'Bronca', color: '#cd7f32', bg: 'rgba(205, 127, 50, 0.15)', border: '#cd7f32' };
                      const tierInfo = (ACHIEVEMENT_TIERS && ACHIEVEMENT_TIERS[ach.tier]) ? ACHIEVEMENT_TIERS[ach.tier] : defaultTier;

                      return (
                        <div
                          key={ach.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            background: isUnlocked ? tierInfo.bg : 'rgba(15, 23, 42, 0.6)',
                            border: isUnlocked ? `1px solid ${tierInfo.border}` : '1px solid #334155',
                            opacity: isUnlocked ? 1 : 0.45,
                            filter: isUnlocked ? 'none' : 'grayscale(80%)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ fontSize: '1.8rem', minWidth: '40px', textAlign: 'center' }}>
                            {ach.icon || '🏅'}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 'bold', color: isUnlocked ? '#f8fafc' : '#94a3b8', fontSize: '0.95rem' }}>
                                {ach.title || ach.name}
                              </span>
                              <span style={{
                                fontSize: '0.65rem',
                                textTransform: 'uppercase',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                background: tierInfo.border,
                                color: '#000',
                                fontWeight: 'bold'
                              }}>
                                {tierInfo.label}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                              {ach.desc || ach.description}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', minWidth: '70px' }}>
                            <div style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 'bold' }}>
                              +{ach.points || 10} B
                            </div>
                            <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                              {isUnlocked ? (
                                <span style={{ color: '#4ade80', fontWeight: 'bold' }}>✓ Osvojeno</span>
                              ) : (
                                <span style={{ color: '#64748b' }}>🔒 Zaključano</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            );
          })()}

          <button
            type="button"
            className="btn-menu btn-back"
            onClick={() => setCurrentScreen('MAIN_MENU')}
            style={{ marginTop: '14px' }}
          >
            {t?.back || 'Natrag'}
          </button>
        </div>
      )}

      {/* IGRA */}
      {currentScreen === 'GAME' && (
        <>
          {setupStep !== 'PLAY' && (
            <div className="setup-overlay">
              <div className="setup-card menu-card" onClick={(e) => e.stopPropagation()}>
                {setupStep === 'NAMES' && (
                  <>
                    <h2>{t.titleNames}</h2>
                    <div>
                      <label>{t.p1Label}</label>
                      <input type="text" maxLength={12} value={p1Name} onChange={(e) => setP1Name(e.target.value)} />
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <label>{t.p2Label}</label>
                      <input type="text" maxLength={12} value={p2Name} disabled={isAIMode} onChange={(e) => setP2Name(e.target.value)} />
                    </div>

                    <div className="game-mode-selector">
                      <div className="mode-toggle-group">
                        <button
                          type="button"
                          className={`mode-btn ${gameCategory === 'CASUAL' ? 'active' : ''}`}
                          onClick={() => setGameCategory('CASUAL')}
                        >
                          ☕ Casual
                        </button>
                        <button
                          type="button"
                          className={`mode-btn ${gameCategory === 'COMPETITIVE' ? 'active' : ''}`}
                          onClick={() => setGameCategory('COMPETITIVE')}
                        >
                          ⚡ Natjecateljski
                        </button>
                      </div>

                      {gameCategory === 'COMPETITIVE' && (
                        <div className="time-preset-group">
                          <button
                            type="button"
                            className={`time-preset-btn ${timeControl === 300 ? 'selected' : ''}`}
                            onClick={() => setTimeControl(300)}
                          >
                            5 min (Classic)
                          </button>
                          <button
                            type="button"
                            className={`time-preset-btn ${timeControl === 120 ? 'selected' : ''}`}
                            onClick={() => setTimeControl(120)}
                          >
                            2 min (Rapid)
                          </button>
                          <button
                            type="button"
                            className={`time-preset-btn ${timeControl === 45 ? 'selected' : ''}`}
                            onClick={() => setTimeControl(45)}
                          >
                            45s (Blitz)
                          </button>
                        </div>
                      )}
                    </div>
                    <button className="btn-gold" onClick={handleProceedToCoinToss}>{t.btnNextCoin}</button>
                    <br />
                    <button className="btn-menu btn-back" style={{ width: '100%' }} onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
                  </>
                )}

                {setupStep === 'COIN_TOSS' && (
                  <>
                    <h2>{t.titleCoin}</h2>
                    <p><strong>{p1Name}</strong> {t.coinPrompt}</p>
                    <div className="coin-stage">
                      <div className="coin-3d" style={{ transform: `rotateY(${coinRotation}deg)` }}>
                        <div className="coin-face front">{t.heads}</div>
                        <div
                          className="coin-face back"
                          style={{
                            background: 'radial-gradient(circle, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%)',
                            color: '#0f172a',
                            border: '3px solid #e2e8f0',
                            boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.25)'
                          }}
                        >
                          {t.tails}
                        </div>
                      </div>
                    </div>
                    <div className="coin-choice-btns">
                      <button className="btn-gold" disabled={isFlipping} onClick={() => triggerCoinFlip('heads')}>{t.heads}</button>
                      <button
                        className="btn-gold"
                        disabled={isFlipping}
                        onClick={() => triggerCoinFlip('tails')}
                        style={{
                          background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                          color: '#0f172a',
                          border: '1px solid #cbd5e1'
                        }}
                      >
                        {t.tails}
                      </button>
                    </div>
                  </>
                )}

                {setupStep === 'COLOR_SELECT' && (
                  <>
                    <h2>{t.resultTitle}: {coinResultText}!</h2>
                    <p>{t.winnerIs} <strong>{coinWinner === 1 ? p1Name : p2Name}</strong>!</p>
                    <p>{t.chooseColor}</p>
                    <div className="coin-choice-btns">
                      <button className="btn-gold" style={{ background: '#ffffff', color: '#000' }} onClick={() => handleColorSelect('WHITE')}>⚪ {t.white}</button>
                      <button className="btn-gold" style={{ background: '#071524', color: '#fff', border: '1px solid #d4af37' }} onClick={() => handleColorSelect('BLACK')}>⚫ {t.black}</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {setupStep === 'PLAY' && (
            <>
              <div className="status-bar" onClick={(e) => e.stopPropagation()}>
                {winner ? (
                  <div className="status-turn" style={{ color: '#4ade80' }}>{t.gameOverWinner} {players[winner].name}!</div>
                ) : (
                  <>
                    <div className="status-turn">
                      {t.turn} <span style={{ color: turn === 'WHITE' ? '#ffffff' : '#cbd5e1', textDecoration: 'underline' }}>{players[turn].name} ({turn === 'WHITE' ? t.whiteLabel : t.blackLabel})</span>
                    </div>
                    {mustRemove && <div className="status-alert">{t.alertRemove}</div>}
                    {gameCategory === 'COMPETITIVE' && (
                      <div className="timer-container" style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '10px 0' }}>
                        <div className={`timer-badge ${turn === 'WHITE' ? 'timer-active' : ''}`} style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          background: turn === 'WHITE' ? '#1e293b' : '#0f172a',
                          border: turn === 'WHITE' ? '2px solid #eab308' : '1px solid #334155',
                          color: (timeLeft.WHITE !== null && timeLeft.WHITE <= 10) ? '#ef4444' : '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          fontFamily: 'monospace'
                        }}>
                          ⚪ {players.WHITE.name}: {formatTime(timeLeft.WHITE)}
                        </div>

                        <div className={`timer-badge ${turn === 'BLACK' ? 'timer-active' : ''}`} style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          background: turn === 'BLACK' ? '#1e293b' : '#0f172a',
                          border: turn === 'BLACK' ? '2px solid #eab308' : '1px solid #334155',
                          color: (timeLeft.BLACK !== null && timeLeft.BLACK <= 10) ? '#ef4444' : '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          fontFamily: 'monospace'
                        }}>
                          ⚫ {players.BLACK.name}: {formatTime(timeLeft.BLACK)}
                        </div>
                      </div>
                    )}
                  </>
                )}
                <button className="btn-menu btn-back" style={{ marginTop: '8px', padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setCurrentScreen('MAIN_MENU')}>
                  {t.btnQuit}
                </button>
              </div>

              <div className="main-play-area">
                {/* OSVOJENE FIGURE KOJE DRŽI IGRAČ 1 */}
                <div className="captured-tray tray-left">
                  {Array.from({ length: p1CapturedCount }).map((_, i) => (
                    <div
                      key={`captured-by-p1-${i}`}
                      className={`piece-slot piece-captured ${p2Color === 'WHITE' ? 'piece-white' : 'piece-black'}`}
                    />
                  ))}
                </div>

                {/* LIJEVI STALAK: IGRAČ 1 */}
                <div className="side-rack" onClick={(e) => e.stopPropagation()}>
                  <div className="rack-title">{p1Name}</div>
                  <div className="rack-pieces">
                    {Array.from({ length: 9 }).map((_, i) => {
                      const isPieceAvailable = i < unplaced[p1Color];
                      const canInteract = !mustRemove && turn === p1Color && isPieceAvailable && (!isAIMode || aiColor !== p1Color) && (!onlineGameId || turn === myColor);

                      return (
                        <div
                          key={`p1-slot-${i}`}
                          className={`piece-slot ${p1Color === 'WHITE' ? 'piece-white' : 'piece-black'} ${isPieceAvailable ? (canInteract ? 'draggable' : '') : 'disabled'}`}
                          onMouseDown={(e) => {
                            if (!canInteract) return;
                            e.stopPropagation();
                            isMouseDownRef.current = true;
                            playAudioEffect('pickup', soundEnabled);
                            setActiveHeldPiece({ type: 'RACK', sourceIdx: null, color: p1Color });
                            setSelectedNode(null);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* PLOČA */}
                <Board
                  board={board}
                  selectedNode={currentActiveNode}
                  validMoves={validMoves}
                  removableNodes={removableNodes}
                  mustRemove={mustRemove}
                  turn={turn}
                  isAIMode={onlineGameId ? false : isAIMode}
                  aiColor={aiColor}
                  focusedNode={keyboardFocusNode}
                  onCancelSelection={handleCancelSelection}
                  onNodeInteract={(targetIdx) => {
                    if (onlineGameId && turn !== myColor) return;
                    if (selectedNode === targetIdx) {
                      handleCancelSelection();
                      return;
                    }
                    setKeyboardFocusNode(targetIdx);
                    executePlaceOrMove(targetIdx);
                  }}
                  onNodePick={(nodeIdx) => {
                    if (onlineGameId && turn !== myColor) return;
                    if (mustRemove) {
                      executePlaceOrMove(nodeIdx);
                      return;
                    }
                    if (selectedNode === nodeIdx) {
                      handleCancelSelection();
                      return;
                    }
                    playAudioEffect('pickup', soundEnabled);
                    setSelectedNode(nodeIdx);
                    setKeyboardFocusNode(nodeIdx);
                    setActiveHeldPiece({ type: 'NODE', sourceIdx: nodeIdx, color: board[nodeIdx] });
                  }}
                />

                {/* DESNI STALAK: IGRAČ 2 */}
                <div className="side-rack" onClick={(e) => e.stopPropagation()}>
                  <div className="rack-title" style={{ color: '#cbd5e1' }}>{p2Name}</div>
                  <div className="rack-pieces">
                    {Array.from({ length: 9 }).map((_, i) => {
                      const isPieceAvailable = i < unplaced[p2Color];
                      const canInteract = !mustRemove && turn === p2Color && isPieceAvailable && (!isAIMode || aiColor !== p2Color) && (!onlineGameId || turn === myColor);

                      return (
                        <div
                          key={`p2-slot-${i}`}
                          className={`piece-slot ${p2Color === 'WHITE' ? 'piece-white' : 'piece-black'} ${isPieceAvailable ? (canInteract ? 'draggable' : '') : 'disabled'}`}
                          onMouseDown={(e) => {
                            if (!canInteract) return;
                            e.stopPropagation();
                            isMouseDownRef.current = true;
                            playAudioEffect('pickup', soundEnabled);
                            setActiveHeldPiece({ type: 'RACK', sourceIdx: null, color: p2Color });
                            setSelectedNode(null);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* OSVOJENE FIGURE KOJE DRŽI IGRAČ 2 */}
                <div className="captured-tray tray-right">
                  {Array.from({ length: p2CapturedCount }).map((_, i) => (
                    <div
                      key={`captured-by-p2-${i}`}
                      className={`piece-slot piece-captured ${p1Color === 'WHITE' ? 'piece-white' : 'piece-black'}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}