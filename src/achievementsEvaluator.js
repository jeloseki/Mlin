// src/achievementsEvaluator.js

/**
 * Računa nizove pobjeda i poraza iz povijesti mečeva
 */
const calculateStreaks = (history = [], currentIsWin) => {
    const fullHistory = [currentIsWin, ...history.map(m => m.isWin)];

    let winStreak = 0;
    for (const win of fullHistory) {
        if (win) winStreak++;
        else break;
    }

    let lossStreak = 0;
    for (const win of fullHistory) {
        if (!win) lossStreak++;
        else break;
    }

    return { winStreak, lossStreak };
};

/**
 * Glavna funkcija za evaluaciju i automatsko otključavanje postignuća
 * @param {Object} currentProfile - Trenutni profil igrača
 * @param {Object} ctx - Kontekst upravo završene partije ili akcije
 * @returns {Object} Ažurirani profil s novim postignućima
 */
export const evaluateGameAchievements = (currentProfile, ctx = {}) => {
    if (!currentProfile) return currentProfile;

    const userAchs = new Set(Array.isArray(currentProfile.achievements) ? currentProfile.achievements : []);
    const initialCount = userAchs.size;

    const wins = currentProfile.wins || 0;
    const losses = currentProfile.losses || 0;
    const totalMatches = (wins + losses);
    const points = currentProfile.points || 0;

    const { winStreak, lossStreak } = calculateStreaks(currentProfile.matchHistory || [], ctx.isWin);

    // Normalizacija težine bota
    const isAI = Boolean(ctx.isAIMode);
    const diff = (ctx.aiDifficulty || '').toUpperCase();
    const isEasy = isAI && (diff === 'EASY' || diff === 'LAKO');
    const isMedium = isAI && (diff === 'MEDIUM' || diff === 'SREDNJE');
    const isHard = isAI && (diff === 'HARD' || diff === 'TESKO' || diff === 'TEŠKO');
    const isExpert = isAI && (diff === 'EXPERT' || diff === 'BRUTAL' || diff === 'EKSPERT');

    // Definicija uvjeta za katalog
    const rules = [
        // --- 1. POČETAK I OSNOVE ---
        { id: 'ach_001', cond: totalMatches >= 1 },
        { id: 'ach_002', cond: (ctx.millsFormed || 0) >= 1 },
        { id: 'ach_003', cond: ctx.isWin },
        { id: 'ach_004', cond: (ctx.piecesCaptured || 0) >= 1 },
        { id: 'ach_005', cond: ctx.isWin && (ctx.playerColor === 'white' || ctx.playerColor === 'W') },
        { id: 'ach_006', cond: ctx.isWin && (ctx.playerColor === 'black' || ctx.playerColor === 'B') },
        { id: 'ach_007', cond: Boolean(ctx.coinTossWon) },
        { id: 'ach_008', cond: !isAI && totalMatches >= 1 },
        { id: 'ach_009', cond: ctx.isWin && isEasy },
        { id: 'ach_010', cond: Boolean(ctx.blockedOpponentMillInPlacement) },
        { id: 'ach_011', cond: (ctx.piecesLostInPlacement || 0) === 0 },
        { id: 'ach_012', cond: Boolean(ctx.blockedEnemyPiece) },
        { id: 'ach_013', cond: Boolean(ctx.reachedFlyingPhase) },
        { id: 'ach_014', cond: Boolean(ctx.reopenedMill) },
        { id: 'ach_015', cond: Boolean(ctx.doubleThreatCreated) },

        // --- 2. TAKTIKA I RAZVOJ ---
        { id: 'ach_016', cond: winStreak >= 3 },
        { id: 'ach_017', cond: ctx.isWin && isMedium },
        { id: 'ach_018', cond: ctx.isWin && Boolean(ctx.wonByBlock) },
        { id: 'ach_019', cond: (ctx.millsFormed || 0) >= 3 },
        { id: 'ach_020', cond: ctx.isWin && Boolean(ctx.reachedFlyingPhase) },
        { id: 'ach_021', cond: ctx.isWin && (ctx.totalTurns || 999) < 30 },
        { id: 'ach_026', cond: ctx.isWin && ctx.isTimedGame },
        { id: 'ach_027', cond: ctx.isWin && (ctx.opponentMillsFormed || 0) === 0 },
        { id: 'ach_028', cond: Boolean(ctx.millFormedByFlying) },
        { id: 'ach_029', cond: wins >= 10 },
        { id: 'ach_035', cond: winStreak >= 5 },

        // --- 3. NAPREDNO I MAJSTORSTVO ---
        { id: 'ach_036', cond: ctx.isWin && isHard },
        { id: 'ach_037', cond: ctx.isWin && (ctx.playerPiecesRemaining || 0) >= 7 },
        { id: 'ach_038', cond: winStreak >= 7 },
        { id: 'ach_042', cond: wins >= 25 },
        { id: 'ach_045', cond: (ctx.millsFormed || 0) >= 6 },
        { id: 'ach_046', cond: ctx.isWin && isHard && (ctx.opponentMillsFormed || 0) === 0 },
        { id: 'ach_049', cond: ctx.isWin && Boolean(ctx.wonByBlock) && (ctx.opponentPiecesRemaining || 0) > 2 },
        { id: 'ach_054', cond: totalMatches >= 50 },
        { id: 'ach_055', cond: winStreak >= 10 },

        // --- 4. VRHUNSKI STRUČNJAK ---
        { id: 'ach_056', cond: ctx.isWin && isExpert },
        { id: 'ach_059', cond: totalMatches >= 100 },
        { id: 'ach_061', cond: winStreak >= 15 },
        { id: 'ach_062', cond: ctx.isWin && (ctx.playerPiecesLost || 0) === 0 },
        { id: 'ach_067', cond: points >= 500 },
        { id: 'ach_068', cond: wins >= 50 },

        // --- 5. LEGENDA I ELITA ---
        { id: 'ach_069', cond: wins >= 100 },
        { id: 'ach_070', cond: winStreak >= 20 },
        { id: 'ach_071', cond: points >= 1000 },
        { id: 'ach_073', cond: totalMatches >= 250 },
        { id: 'ach_075', cond: userAchs.size >= 60 },

        // --- 6. NEGATIVNA I UTJEŠNA (PEH / SHAME) ---
        { id: 'ach_076', cond: !ctx.isWin },
        { id: 'ach_077', cond: !ctx.isWin && Boolean(ctx.lostByBlock) },
        { id: 'ach_079', cond: !ctx.isWin && Boolean(ctx.lostByTimeout) },
        { id: 'ach_080', cond: !ctx.isWin && isEasy },
        { id: 'ach_081', cond: (ctx.millsFormed || 0) === 0 },
        { id: 'ach_083', cond: lossStreak >= 3 },
        { id: 'ach_084', cond: lossStreak >= 5 },
        { id: 'ach_085', cond: !ctx.isWin && (ctx.opponentPiecesLost || 0) === 0 },
        { id: 'ach_092', cond: !ctx.isWin && (ctx.totalTurns || 999) < 20 },
        { id: 'ach_094', cond: losses >= 25 },
        { id: 'ach_098', cond: lossStreak >= 7 }
    ];

    // Provjeri i otključaj nova postignuća
    rules.forEach(rule => {
        if (rule.cond && !userAchs.has(rule.id)) {
            userAchs.add(rule.id);
            console.log(`🏅 Otključano postignuće: ${rule.id}`);
        }
    });

    // Ako nema novih znački, vraća postojeći objekt
    if (userAchs.size === initialCount) {
        return currentProfile;
    }

    const updatedProfile = {
        ...currentProfile,
        achievements: Array.from(userAchs)
    };

    // Trajno spremi u localStorage
    localStorage.setItem('mlin_user_profile', JSON.stringify(updatedProfile));

    try {
        const adminProfiles = JSON.parse(localStorage.getItem('mlin_admin_profiles') || '[]');
        const updatedAdminList = adminProfiles.map(p => {
            if ((p.id && p.id === updatedProfile.id) || p.name === updatedProfile.name) {
                // OVDJE TREBA SPREMITI SVE STATISTIKE, A NE SAMO ACHIEVEMENTS!
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
    } catch (err) {
        console.warn("Greška pri sinkronizaciji u mlin_admin_profiles:", err);
    }

    return updatedProfile;
};