import React, { useState, useEffect, useRef } from 'react';
import Board from './components/Board';
import { BOARD_CONNECTIONS } from './constants/gameData';
import { checkFormsMill, isPieceInMill, hasLegalMoves } from './logic/millEngine';
import { getAIPlacementNode, getAIPieceToRemove, getAIMove } from './logic/aiEngine';
import './App.css';

const DEFAULT_AVATARS = [
  '🦁', '🦅', '🐺', '🐉', '👑', '⚔️', '🛡️', '🧙‍♂️', '🥷', '🐻',
  '🐯', '🦊', '🦈', '🤖', '👾', '🔥', '⚡', '💎', '🎯', '🚀'
];

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
    heads: "HEADS",
    tails: "TAILS",
    resultTitle: "Pao je",
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
    menuTitle: "NINE MEN'S MORRIS",
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
    btnNextCoin: "Next to Coin Toss",
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
    }
  } catch (e) { }
};

export default function App() {
  const [lang, setLang] = useState('hr');
  const t = TRANSLATIONS[lang];

  const [currentScreen, setCurrentScreen] = useState('MAIN_MENU');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('mlin_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Igrač 1',
      avatar: '🦁',
      bio: 'Spreman za igru!',
      points: 0,
      wins: 0,
      losses: 0,
      matchHistory: []
    };
  });

  useEffect(() => {
    localStorage.setItem('mlin_user_profile', JSON.stringify(profile));
  }, [profile]);

  const [profileTab, setProfileTab] = useState('STATS');
  const [isEditingName, setIsEditingName] = useState(false);

  // AI STANJA
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState('EASY');
  const [aiColor, setAiColor] = useState('BLACK');

  const totalMatches = profile.wins + profile.losses;
  const winRate = totalMatches > 0 ? Math.round((profile.wins / totalMatches) * 100) : 0;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
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

  const [setupStep, setSetupStep] = useState('NAMES');
  const [p1Name, setP1Name] = useState(profile.name);
  const [p2Name, setP2Name] = useState('Igrač 2');

  const [coinRotation, setCoinRotation] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResultText, setCoinResultText] = useState('');
  const [coinWinner, setCoinWinner] = useState(null);

  const [players, setPlayers] = useState({
    WHITE: { name: '', id: 1 },
    BLACK: { name: '', id: 2 }
  });

  const [board, setBoard] = useState(Array(24).fill(null));
  const [turn, setTurn] = useState('WHITE');
  const [unplaced, setUnplaced] = useState({ WHITE: 9, BLACK: 9 });
  const [mustRemove, setMustRemove] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [winner, setWinner] = useState(null);

  // UNIVERZALNI SUSTAV NOŠENJA/POVLAČENJA (POINTER DRAG & DROP)
  const [activeHeldPiece, setActiveHeldPiece] = useState(null); // { type: 'RACK' | 'NODE', sourceIdx: number | null, color: 'WHITE' | 'BLACK' }
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleGlobalMouseUp = (e) => {
      isMouseDownRef.current = false;
      // Ako je igrač držao miša pritisnutim i otpustio ga iznad elementa koji nije čvor, puštanje se ignorira ili rješava u dropu
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

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
      setCoinResultText(isHeads ? 'HEADS' : 'TAILS');
      setCoinWinner(choice === (isHeads ? 'heads' : 'tails') ? 1 : 2);
      setSetupStep('COLOR_SELECT');
    }, 2500);
  };

  const handleColorSelect = (color) => {
    const winnerName = coinWinner === 1 ? p1Name : p2Name;
    const loserName = coinWinner === 1 ? p2Name : p1Name;

    const whitePlayer = color === 'WHITE' ? winnerName : loserName;
    const blackPlayer = color === 'WHITE' ? loserName : winnerName;

    setPlayers({
      WHITE: { name: whitePlayer, id: color === 'WHITE' ? coinWinner : (coinWinner === 1 ? 2 : 1) },
      BLACK: { name: blackPlayer, id: color === 'BLACK' ? coinWinner : (coinWinner === 1 ? 2 : 1) }
    });

    if (isAIMode) {
      setAiColor(color === 'WHITE' ? 'BLACK' : 'WHITE');
    }

    setTurn('WHITE');
    setSetupStep('PLAY');
  };

  const getPiecesCount = (color) => board.filter(cell => cell === color).length;

  const handleGameEnd = (winningColor) => {
    setWinner(winningColor);

    const userColor = players.WHITE.name === profile.name ? 'WHITE' : (players.BLACK.name === profile.name ? 'BLACK' : null);
    if (!userColor) return;

    const isUserWinner = winningColor === userColor;
    const pointDelta = isUserWinner ? 12 : -6;
    const newPoints = Math.max(0, profile.points + pointDelta);

    const today = new Date();
    const dateStr = `${today.getDate()}.${today.getMonth() + 1}.`;

    const newMatch = {
      vs: isAIMode ? `AI (${aiDifficulty})` : (userColor === 'WHITE' ? players.BLACK.name : players.WHITE.name),
      isWin: isUserWinner,
      score: isUserWinner ? '+12' : '-6',
      date: dateStr
    };

    setProfile(prev => ({
      ...prev,
      points: newPoints,
      wins: isUserWinner ? prev.wins + 1 : prev.wins,
      losses: !isUserWinner ? prev.losses + 1 : prev.losses,
      matchHistory: [newMatch, ...prev.matchHistory.slice(0, 9)]
    }));
  };

  // GLAVNA LOGIKA POTEZA
  const executePlaceOrMove = (nodeIndex, customSource = null) => {
    if (winner) return;
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
      setMustRemove(false);
      setSelectedNode(null);
      setActiveHeldPiece(null);

      if (unplaced[opponent] === 0 && newBoard.filter(c => c === opponent).length < 3) {
        handleGameEnd(turn);
        return;
      }
      setTurn(opponent);
      return;
    }

    // 2. FAZA POSTAVLJANJA FIGURA IZ STALKA
    const isPlacingFromRack = activeHeldPiece && activeHeldPiece.type === 'RACK';
    if (unplaced[turn] > 0 || isPlacingFromRack) {
      if (board[nodeIndex] !== null) return;

      playAudioEffect('place', soundEnabled);
      const newBoard = [...board];
      newBoard[nodeIndex] = turn;
      setBoard(newBoard);
      setUnplaced({ ...unplaced, [turn]: unplaced[turn] - 1 });
      setActiveHeldPiece(null);
      setSelectedNode(null);

      if (checkFormsMill(newBoard, nodeIndex, turn)) {
        setMustRemove(true);
      } else {
        setTurn(opponent);
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
        } else {
          if (!hasLegalMoves(newBoard, opponent, getPiecesCount(opponent) === 3)) {
            handleGameEnd(turn);
            return;
          }
          setTurn(opponent);
        }
      } else if (board[nodeIndex] === turn) {
        playAudioEffect('pickup', soundEnabled);
        setSelectedNode(nodeIndex);
        setActiveHeldPiece({ type: 'NODE', sourceIdx: nodeIndex, color: turn });
      }
    }
  };

  // AI POTEZ AUTOMATIKA
  useEffect(() => {
    if (!isAIMode || currentScreen !== 'GAME' || setupStep !== 'PLAY' || winner) return;

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
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [turn, mustRemove, board, unplaced, isAIMode, currentScreen, setupStep, winner, aiColor, aiDifficulty]);

  const opponentColor = turn === 'WHITE' ? 'BLACK' : 'WHITE';
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

  return (
    <div className="game-container" onClick={() => {
      // Poništavanje selekcije ako se klikne van ploče
      if (selectedNode !== null || activeHeldPiece !== null) {
        setSelectedNode(null);
        setActiveHeldPiece(null);
      }
    }}>
      {/* VIZUALNA FIGURA POD KURSOROM TIJEKOM NOŠENJA/POVLAČENJA */}
      {activeHeldPiece && !winner && (
        <div 
          className={`floating-cursor-piece ${activeHeldPiece.color === 'WHITE' ? 'piece-white' : 'piece-black'}`}
          style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
        />
      )}

      {/* ODABIR JEZIKA */}
      <div className="lang-switcher">
        <button className={`lang-btn ${lang === 'hr' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setLang('hr'); }}>HR</button>
        <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setLang('en'); }}>EN</button>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />

      {/* 1. GLAVNI IZBORNIK */}
      {currentScreen === 'MAIN_MENU' && (
        <div className="menu-card" onClick={(e) => e.stopPropagation()}>
          <h1 className="menu-title">{t.menuTitle}</h1>
          <div className="menu-list">
            <button className="btn-menu" onClick={startCouchGame}>{t.playOffline}</button>
            <button className="btn-menu" onClick={() => setCurrentScreen('AI_SETUP')}>{t.playAI}</button>
            <button className="btn-menu" disabled>{t.playOnline}</button>
            <button className="btn-menu" onClick={() => { setProfileTab('STATS'); setCurrentScreen('PROFILE'); }}>{t.profile}</button>
            <button className="btn-menu" onClick={() => setCurrentScreen('RANKING')}>{t.ranking}</button>
            <button className="btn-menu" onClick={() => setCurrentScreen('LEADERBOARD')}>{t.leaderboard}</button>
            <button className="btn-menu" onClick={() => setCurrentScreen('SCORING')}>{t.scoring}</button>
            <button className="btn-menu" onClick={() => setCurrentScreen('SETTINGS')}>{t.settings}</button>
          </div>
        </div>
      )}

      {/* AI SETUP TEŽINE (LAKO / SREDNJE / TEŠKO) */}
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
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          {profileTab !== 'AVATAR_SELECT' && (
            <div className="profile-tabs">
              <button className={`tab-btn ${profileTab === 'STATS' ? 'active' : ''}`} onClick={() => setProfileTab('STATS')}>{t.tabStats}</button>
              <button className={`tab-btn ${profileTab === 'BADGES' ? 'active' : ''}`} onClick={() => setProfileTab('BADGES')}>{t.tabBadges}</button>
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
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <div className="achievement-card">
                <div className="achievement-icon">⚡</div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{t.ach1Title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.ach1Desc}</div>
                </div>
              </div>
              <div className="achievement-card">
                <div className="achievement-icon">🏆</div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{t.ach2Title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t.ach2Desc}</div>
                </div>
              </div>
            </div>
          )}

          {profileTab === 'HISTORY' && (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {profile.matchHistory.length === 0 ? (
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
              <p style={{ fontSize: '0.85rem', color: '#fce055', marginBottom: '10px' }}>{t.editAvatarTitle}:</p>
              <div className="avatar-grid">
                {DEFAULT_AVATARS.map((emoji, index) => (
                  <div
                    key={index}
                    className="avatar-option"
                    onClick={() => {
                      setProfile({ ...profile, avatar: emoji });
                      setProfileTab('STATS');
                    }}
                  >
                    {emoji}
                  </div>
                ))}
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
              <tr><td>1</td><td>Grandmaster_HR</td><td>3840</td></tr>
              <tr><td>2</td><td>MlinKing</td><td>3110</td></tr>
              <tr><td>3</td><td>Ana_99</td><td>2685</td></tr>
              <tr className="highlight-row"><td>42</td><td>{profile.name} (Vi)</td><td>{profile.points}</td></tr>
            </tbody>
          </table>
          <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
        </div>
      )}

      {/* BODOVANJE */}
      {currentScreen === 'SCORING' && (
        <div className="menu-card" onClick={(e) => e.stopPropagation()}>
          <h2 className="menu-title">{t.scoringTitle}</h2>
          <div className="info-box">
            <div className="info-item"><span>{t.winPointsRule}</span></div>
            <div className="info-item"><span>{t.lossPointsRule}</span></div>
            <div className="info-item"><span>{t.millBonusRule}</span></div>
            <div className="info-item"><span>{t.domWinRule}</span></div>
            <div className="info-item"><span>{t.streakRule}</span></div>
            <div className="info-item"><span>{t.protectionRule}</span></div>
          </div>
          <button className="btn-menu btn-back" onClick={() => setCurrentScreen('MAIN_MENU')}>{t.back}</button>
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
                    <button className="btn-gold" onClick={() => setSetupStep('COIN_TOSS')}>{t.btnNextCoin}</button>
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
                        <div className="coin-face front">HEADS</div>
                        <div className="coin-face back">TAILS</div>
                      </div>
                    </div>
                    <div className="coin-choice-btns">
                      <button className="btn-gold" disabled={isFlipping} onClick={() => triggerCoinFlip('heads')}>{t.heads}</button>
                      <button className="btn-gold" disabled={isFlipping} onClick={() => triggerCoinFlip('tails')}>{t.tails}</button>
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
                  </>
                )}
                <button className="btn-menu btn-back" style={{ marginTop: '8px', padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setCurrentScreen('MAIN_MENU')}>
                  {t.btnQuit}
                </button>
              </div>

              <div className="main-play-area">
                {/* LIJEVI STALAK (BIJELI) */}
                <div className="side-rack" onClick={(e) => e.stopPropagation()}>
                  <div className="rack-title">{players.WHITE.name}</div>
                  <div className="rack-pieces">
                    {Array.from({ length: 9 }).map((_, i) => {
                      const isPieceAvailable = i < unplaced.WHITE;
                      const canInteract = turn === 'WHITE' && isPieceAvailable && (!isAIMode || aiColor !== 'WHITE');

                      return (
                        <div
                          key={`white-${i}`}
                          className={`piece-slot piece-white ${isPieceAvailable ? (canInteract ? 'draggable' : '') : 'disabled'}`}
                          onMouseDown={(e) => {
                            if (!canInteract) return;
                            e.stopPropagation();
                            isMouseDownRef.current = true;
                            playAudioEffect('pickup', soundEnabled);
                            setActiveHeldPiece({ type: 'RACK', sourceIdx: null, color: 'WHITE' });
                            setSelectedNode(null);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* PLOČA S PODRŠKOM ZA KLIK I MAGNETSKI DRAG-DROP */}
                <Board 
                  board={board} 
                  selectedNode={currentActiveNode} 
                  validMoves={validMoves} 
                  removableNodes={removableNodes}
                  mustRemove={mustRemove}
                  turn={turn}
                  isAIMode={isAIMode}
                  aiColor={aiColor}
                  onNodeInteract={(targetIdx) => {
                    executePlaceOrMove(targetIdx);
                  }}
                  onNodePick={(nodeIdx) => {
                    playAudioEffect('pickup', soundEnabled);
                    setSelectedNode(nodeIdx);
                    setActiveHeldPiece({ type: 'NODE', sourceIdx: nodeIdx, color: board[nodeIdx] });
                  }}
                />

                {/* DESNI STALAK (CRNI) */}
                <div className="side-rack" onClick={(e) => e.stopPropagation()}>
                  <div className="rack-title" style={{ color: '#cbd5e1' }}>{players.BLACK.name}</div>
                  <div className="rack-pieces">
                    {Array.from({ length: 9 }).map((_, i) => {
                      const isPieceAvailable = i < unplaced.BLACK;
                      const canInteract = turn === 'BLACK' && isPieceAvailable && (!isAIMode || aiColor !== 'BLACK');

                      return (
                        <div
                          key={`black-${i}`}
                          className={`piece-slot piece-black ${isPieceAvailable ? (canInteract ? 'draggable' : '') : 'disabled'}`}
                          onMouseDown={(e) => {
                            if (!canInteract) return;
                            e.stopPropagation();
                            isMouseDownRef.current = true;
                            playAudioEffect('pickup', soundEnabled);
                            setActiveHeldPiece({ type: 'RACK', sourceIdx: null, color: 'BLACK' });
                            setSelectedNode(null);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}