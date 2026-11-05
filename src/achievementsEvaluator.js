// src/achievementsEvaluator.js
import { getStoredAchievements } from './achievementsData';

/**
 * Računa nizove pobjeda i poraza iz povijesti mečeva.
 * Podržava i slučaj kada je najnoviji meč već ubačen u matchHistory[0] i kada nije.
 */
const calculateStreaks = (history = [], currentIsWin, alreadyInHistory = false) => {
  const historyBooleans = history.map(m => Boolean(m.isWin ?? m.won));
  const fullHistory = alreadyInHistory
    ? historyBooleans
    : (typeof currentIsWin === 'boolean' ? [currentIsWin, ...historyBooleans] : historyBooleans);

  let winStreak = 0;
  for (const win of fullHistory) {
    if (win === true) winStreak++;
    else break;
  }

  let lossStreak = 0;
  for (const win of fullHistory) {
    if (win === false) lossStreak++;
    else break;
  }

  return { winStreak, lossStreak };
};

/**
 * Glavna funkcija za evaluaciju i automatsko otključavanje postignuća
 * @param {Object} currentProfile Trenutni profil igrača
 * @param {Object} ctx Kontekst upravo završene partije ili akcije
 * @returns {Object} Ažurirani profil s novim postignućima i bodovima
 */
export const evaluateGameAchievements = (currentProfile, ctx = {}) => {
  if (!currentProfile) return currentProfile;

  const userAchs = new Set(Array.isArray(currentProfile.achievements) ? currentProfile.achievements : []);
  const initialCount = userAchs.size;

  const wins = Number(currentProfile.wins) || 0;
  const losses = Number(currentProfile.losses) || 0;
  const totalMatches = wins + losses;
  let points = Number(currentProfile.points) || 0;

  const isMatchEnd = typeof ctx.isWin === 'boolean';
  const isWin = Boolean(ctx.isWin);
  const isLoss = isMatchEnd && !ctx.isWin;

  // Provjeri je li meč već upisan u currentProfile.matchHistory prije poziva evaluatora
  const history = Array.isArray(currentProfile.matchHistory) ? currentProfile.matchHistory : [];
  const alreadyInHistory = history.length >= totalMatches && totalMatches > 0;
  const { winStreak, lossStreak } = calculateStreaks(history, ctx.isWin, alreadyInHistory);

  // Normalizacija boje igrača (radi za 'WHITE', 'white', 'W', 'BLACK', 'black', 'B')
  const rawColor = String(ctx.playerColor || ctx.myColor || ctx.color || '').trim().toUpperCase();
  const isWhite = rawColor === 'WHITE' || rawColor === 'W' || rawColor === 'BIJELA' || rawColor === 'BIJELI';
  const isBlack = rawColor === 'BLACK' || rawColor === 'B' || rawColor === 'CRNA' || rawColor === 'CRNI';

  // Normalizacija težine AI bota
  const isAI = Boolean(ctx.isAIMode);
  const diff = String(ctx.aiDifficulty || ctx.difficulty || '').trim().toUpperCase();
  const isEasy = isAI && (diff === 'EASY' || diff === 'LAKO' || diff === 'LAGANO' || diff === '1');
  const isMedium = isAI && (diff === 'MEDIUM' || diff === 'SREDNJE' || diff === 'NORMAL' || diff === '2');
  const isHard = isAI && (diff === 'HARD' || diff === 'TESKO' || diff === 'TEŠKO' || diff === '3');
  const isExpert = isAI && (diff === 'EXPERT' || diff === 'BRUTAL' || diff === 'EKSPERT' || diff === '4');

  // Broj lokalnih mečeva iz povijesti
  const localMatchesCount = history.filter(m => {
    const vs = String(m.vs || m.opponent || '').toUpperCase();
    return !vs.includes('AI') && !vs.includes('BOT');
  }).length;

  // Broj figura i mlinova (s pametnim fallbackovima ako ctx šalje drugačiji naziv)
  const millsFormed = Number(ctx.millsFormed ?? ctx.playerMills ?? 0);
  const opponentMillsFormed = Number(ctx.opponentMillsFormed ?? ctx.aiMills ?? ctx.enemyMills ?? 0);
  const playerPiecesRemaining = Number(ctx.playerPiecesRemaining ?? ctx.myPieces ?? (isWin ? 4 : 2));
  const opponentPiecesRemaining = Number(ctx.opponentPiecesRemaining ?? ctx.enemyPieces ?? (isWin ? 2 : 4));
  const piecesCaptured = Number(ctx.piecesCaptured ?? (9 - opponentPiecesRemaining));
  const playerPiecesLost = Number(ctx.playerPiecesLost ?? (9 - playerPiecesRemaining));
  const opponentPiecesLost = Number(ctx.opponentPiecesLost ?? (9 - opponentPiecesRemaining));
  const totalTurns = Number(ctx.totalTurns ?? ctx.movesCount ?? ctx.turnCount ?? 40);

  // Automatska detekcija faze letenja (ako je igrač pao na 3 figure u bilo kojem trenutku ili na kraju)
  const reachedFlying = Boolean(ctx.reachedFlyingPhase) || playerPiecesRemaining === 3;
  const coinTossWon = Boolean(ctx.coinTossWon || ctx.wonCoinToss || ctx.coinWon);

  // Definicija uvjeta za katalog
  const rules = [
    // --- 1. POČETAK I OSNOVE ---
    { id: 'ach_001', cond: totalMatches >= 1 || isMatchEnd },
    { id: 'ach_002', cond: millsFormed >= 1 || isWin },
    { id: 'ach_003', cond: isWin || wins >= 1 },
    { id: 'ach_004', cond: piecesCaptured >= 1 || isWin },
    { id: 'ach_005', cond: isWin && isWhite },
    { id: 'ach_006', cond: isWin && isBlack },
    { id: 'ach_007', cond: coinTossWon },
    { id: 'ach_008', cond: (!isAI && isMatchEnd) || localMatchesCount >= 1 },
    { id: 'ach_009', cond: isWin && isEasy },
    { id: 'ach_010', cond: Boolean(ctx.blockedOpponentMillInPlacement) || (isWin && opponentMillsFormed === 0) },
    { id: 'ach_011', cond: isMatchEnd && (Number(ctx.piecesLostInPlacement ?? playerPiecesLost) === 0) },
    { id: 'ach_012', cond: Boolean(ctx.blockedEnemyPiece) || Boolean(ctx.wonByBlock) },
    { id: 'ach_013', cond: reachedFlying },
    { id: 'ach_014', cond: Boolean(ctx.reopenedMill) || millsFormed >= 2 },
    { id: 'ach_015', cond: Boolean(ctx.doubleThreatCreated) || millsFormed >= 3 },

    // --- 2. TAKTIKA I RAZVOJ ---
    { id: 'ach_016', cond: winStreak >= 3 },
    { id: 'ach_017', cond: isWin && isMedium },
    { id: 'ach_018', cond: isWin && Boolean(ctx.wonByBlock) },
    { id: 'ach_019', cond: millsFormed >= 3 },
    { id: 'ach_020', cond: isWin && reachedFlying },
    { id: 'ach_021', cond: isWin && totalTurns < 30 },
    { id: 'ach_022', cond: isWin && opponentPiecesRemaining <= 2 && playerPiecesLost < 2 },
    { id: 'ach_023', cond: Boolean(ctx.usedSeesaw) || millsFormed >= 4 },
    { id: 'ach_024', cond: Boolean(ctx.outerRingMills) },
    { id: 'ach_025', cond: isWin && Boolean(ctx.controlledCenter) },
    { id: 'ach_026', cond: isWin && Boolean(ctx.isTimedGame || ctx.gameMode === 'COMPETITIVE') },
    { id: 'ach_027', cond: isWin && opponentMillsFormed === 0 },
    { id: 'ach_028', cond: Boolean(ctx.millFormedByFlying) || (isWin && reachedFlying && millsFormed >= 1) },
    { id: 'ach_029', cond: wins >= 10 },
    { id: 'ach_030', cond: Boolean(ctx.earlyCapture) },
    { id: 'ach_031', cond: Boolean(ctx.clutchMill) },
    { id: 'ach_032', cond: isWin && piecesCaptured >= 5 && playerPiecesLost === 0 },
    { id: 'ach_033', cond: Boolean(ctx.counterMill) },
    { id: 'ach_034', cond: localMatchesCount >= 10 },
    { id: 'ach_035', cond: winStreak >= 5 },

    // --- 3. NAPREDNO I MAJSTORSTVO ---
    { id: 'ach_036', cond: isWin && isHard },
    { id: 'ach_037', cond: isWin && playerPiecesRemaining >= 7 },
    { id: 'ach_038', cond: winStreak >= 7 },
    { id: 'ach_039', cond: Boolean(ctx.sniperBlocks) },
    { id: 'ach_040', cond: isWin && Boolean(ctx.wonByBlock) },
    { id: 'ach_041', cond: isWin && Boolean(ctx.wonByTimeout) },
    { id: 'ach_042', cond: wins >= 25 },
    { id: 'ach_043', cond: Boolean(ctx.isTournament) },
    { id: 'ach_044', cond: isWin && Boolean(ctx.isTournament) },
    { id: 'ach_045', cond: millsFormed >= 6 },
    { id: 'ach_046', cond: isWin && isHard && opponentMillsFormed === 0 },
    { id: 'ach_047', cond: isWin && playerPiecesRemaining === 3 && opponentPiecesRemaining >= 6 },
    { id: 'ach_048', cond: wins >= 3 && localMatchesCount >= 1 },
    { id: 'ach_049', cond: isWin && Boolean(ctx.wonByBlock) && opponentPiecesRemaining > 2 },
    { id: 'ach_050', cond: isWin && millsFormed >= 3 && playerPiecesRemaining >= 7 },
    { id: 'ach_051', cond: Boolean(ctx.innerSquareMillHeld) },
    { id: 'ach_052', cond: Boolean(ctx.threeActiveMills) },
    { id: 'ach_053', cond: isWin && Boolean(ctx.wonByBlock) && totalTurns <= 26 },
    { id: 'ach_054', cond: totalMatches >= 50 },
    { id: 'ach_055', cond: winStreak >= 10 },

    // --- 4. VRHUNSKI STRUČNJAK ---
    { id: 'ach_056', cond: isWin && isExpert },
    { id: 'ach_057', cond: Boolean(ctx.tournamentWinner) },
    { id: 'ach_058', cond: isWin && reachedFlying && millsFormed >= 3 },
    { id: 'ach_059', cond: totalMatches >= 100 },
    { id: 'ach_060', cond: isWin && Boolean(ctx.isTimedGame) && totalTurns < 25 },
    { id: 'ach_061', cond: winStreak >= 15 },
    { id: 'ach_062', cond: isWin && (playerPiecesLost === 0 || playerPiecesRemaining === 9) },
    { id: 'ach_063', cond: wins >= 35 },
    { id: 'ach_064', cond: isWin && isHard && winStreak >= 5 },
    { id: 'ach_065', cond: wins >= 40 },
    { id: 'ach_066', cond: isWin && Boolean(ctx.wonByBlock) && opponentPiecesRemaining === 3 },
    { id: 'ach_067', cond: points >= 500 },
    { id: 'ach_068', cond: wins >= 50 },

    // --- 5. LEGENDA I ELITA ---
    { id: 'ach_069', cond: wins >= 100 },
    { id: 'ach_070', cond: winStreak >= 20 },
    { id: 'ach_071', cond: points >= 1000 },
    { id: 'ach_072', cond: isWin && isExpert && wins >= 10 },
    { id: 'ach_073', cond: totalMatches >= 250 },
    { id: 'ach_074', cond: isWin && isHard && playerPiecesRemaining === 9 && totalTurns < 30 },
    { id: 'ach_075', cond: userAchs.size >= 60 },

    // --- 6. NEGATIVNA I UTJEŠNA (PEH / SHAME) ---
    { id: 'ach_076', cond: isLoss || losses >= 1 },
    { id: 'ach_077', cond: isLoss && Boolean(ctx.lostByBlock) },
    { id: 'ach_078', cond: isLoss && Boolean(ctx.lostByBlock) && totalTurns <= 18 },
    { id: 'ach_079', cond: isLoss && Boolean(ctx.lostByTimeout) },
    { id: 'ach_080', cond: isLoss && isEasy },
    { id: 'ach_081', cond: isMatchEnd && millsFormed === 0 },
    { id: 'ach_082', cond: Number(ctx.coinTossLossStreak || 0) >= 3 },
    { id: 'ach_083', cond: lossStreak >= 3 },
    { id: 'ach_084', cond: lossStreak >= 5 },
    { id: 'ach_085', cond: isLoss && (opponentPiecesLost === 0 || opponentPiecesRemaining === 9) },
    { id: 'ach_086', cond: isLoss && Number(ctx.piecesLostInPlacement || 0) >= 3 },
    { id: 'ach_087', cond: isLoss && reachedFlying && totalTurns <= 24 },
    { id: 'ach_091', cond: isLoss && playerPiecesRemaining >= opponentPiecesRemaining + 2 },
    { id: 'ach_092', cond: isLoss && totalTurns < 20 },
    { id: 'ach_093', cond: isLoss && Boolean(ctx.lostByBlock) && playerPiecesRemaining >= 5 },
    { id: 'ach_094', cond: losses >= 25 },
    { id: 'ach_097', cond: isLoss && coinTossWon && isWhite && totalTurns < 25 },
    { id: 'ach_098', cond: lossStreak >= 7 }
  ];

  const catalog = getStoredAchievements();
  let newlyEarnedPoints = 0;
  const newlyUnlockedIds = [];

  // Provjeri i otključaj nova postignuća
  rules.forEach(rule => {
    if (rule.cond && !userAchs.has(rule.id)) {
      userAchs.add(rule.id);
      newlyUnlockedIds.push(rule.id);
      const achMeta = catalog.find(a => a.id === rule.id);
      if (achMeta && Number(achMeta.points) > 0) {
        newlyEarnedPoints += Number(achMeta.points);
      }
      console.log(`🏅 Otključano postignuće: ${rule.id} (${achMeta?.title || ''})`);
    }
  });

  // Provjera za ach_075 (Besmrtnik - 60 postignuća) nakon što su dodana nova
  if (userAchs.size >= 60 && !userAchs.has('ach_075')) {
    userAchs.add('ach_075');
    newlyUnlockedIds.push('ach_075');
    newlyEarnedPoints += 350;
  }

  // Ako nema novih znački, vraća postojeći objekt
  if (userAchs.size === initialCount) {
    return currentProfile;
  }

  const updatedProfile = {
    ...currentProfile,
    points: points + newlyEarnedPoints,
    achievements: Array.from(userAchs)
  };

  // Trajno spremi u localStorage
  localStorage.setItem('mlin_user_profile', JSON.stringify(updatedProfile));

  try {
    const adminProfiles = JSON.parse(localStorage.getItem('mlin_admin_profiles') || '[]');
    const updatedAdminList = adminProfiles.map(p => {
      if ((p.id && p.id === updatedProfile.id) || p.name === updatedProfile.name) {
        return {
          ...p,
          points: updatedProfile.points,
          wins: updatedProfile.wins,
          losses: updatedProfile.losses,
          matchHistory: updatedProfile.matchHistory,
          achievements: updatedProfile.achievements
        };
      }
      return p;
    });

    localStorage.setItem('mlin_admin_profiles', JSON.stringify(updatedAdminList));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.warn("Greška pri sinkronizaciji u mlin_admin_profiles:", err);
  }

  return updatedProfile;
};