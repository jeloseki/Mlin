// src/achievementsData.js
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

export const ACHIEVEMENT_TIERS = {
  BRONZE: { label: 'Bronze', color: '#cd7f32', bg: 'rgba(205, 127, 50, 0.15)', border: '#cd7f32' },
  SILVER: { label: 'Silver', color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.15)', border: '#94a3b8' },
  GOLD: { label: 'Gold', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: '#f59e0b' },
  PLATINUM: { label: 'Platinum', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: '#0ea5e9' },
  LEGENDARY: { label: 'Legendary', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', border: '#db2777' },
  SHAME: { label: 'Fumble', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: '#dc2726' }
};

export const INITIAL_ACHIEVEMENTS = [
  // 1. START & BASICS (Bronze - Positive: 1-15)
  { id: 'ach_001', tier: 'BRONZE', icon: '🌱', title: 'First Step', desc: 'Play your first game of Mlin', points: 5, isDefault: true },
  { id: 'ach_002', tier: 'BRONZE', icon: '🎯', title: 'First Mill', desc: 'Build your first mill in your career', points: 5, isDefault: true },
  { id: 'ach_003', tier: 'BRONZE', icon: '🏆', title: 'First Triumph', desc: 'Achieve your first win', points: 10, isDefault: true },
  { id: 'ach_004', tier: 'BRONZE', icon: '⚔️', title: 'Piece Killer', desc: 'Remove the first enemy piece from the board', points: 5, isDefault: true },
  { id: 'ach_005', tier: 'BRONZE', icon: '⚪', title: 'White Power', desc: 'Win playing with white pieces', points: 10, isDefault: true },
  { id: 'ach_006', tier: 'BRONZE', icon: '⚫', title: 'Black Magic', desc: 'Win playing with black pieces', points: 10, isDefault: true },
  { id: 'ach_007', tier: 'BRONZE', icon: '🪙', title: 'Lucky Coin', desc: 'Guess the coin toss correctly', points: 5, isDefault: true },
  { id: 'ach_008', tier: 'BRONZE', icon: '🤝', title: 'Local Derby', desc: 'Play a match in local two-player mode', points: 5, isDefault: true },
  { id: 'ach_009', tier: 'BRONZE', icon: '🤖', title: 'Student and Bot', desc: 'Beat the Easy AI opponent', points: 10, isDefault: true },
  { id: 'ach_010', tier: 'BRONZE', icon: '🛡️', title: 'Wall Guardian', desc: 'Prevent the opponent from forming a mill during placement', points: 10, isDefault: true },
  { id: 'ach_011', tier: 'BRONZE', icon: '📦', title: 'All Counted', desc: 'Finish the placement phase without losing a piece', points: 10, isDefault: true },
  { id: 'ach_012', tier: 'BRONZE', icon: '🪨', title: 'First Block', desc: 'Block an opponent piece so it has nowhere to move', points: 10, isDefault: true },
  { id: 'ach_013', tier: 'BRONZE', icon: '🕊️', title: 'Takeoff', desc: 'Reach the flying phase (exactly 3 pieces left)', points: 10, isDefault: true },
  { id: 'ach_014', tier: 'BRONZE', icon: '🔄', title: 'Reverser', desc: 'Break and re-form the same mill in consecutive moves', points: 10, isDefault: true },
  { id: 'ach_015', tier: 'BRONZE', icon: '⚡', title: 'Double Threat', desc: 'Set up two potential mills in the same move', points: 10, isDefault: true },

  // 2. TACTICS & PROGRESS (Silver - Positive: 16-35)
  { id: 'ach_016', tier: 'SILVER', icon: '🔥', title: 'Warming Up', desc: 'Score 3 wins in a row', points: 20, isDefault: true },
  { id: 'ach_017', tier: 'SILVER', icon: '🧠', title: 'Outsmarted Bot', desc: 'Beat the Medium AI opponent', points: 25, isDefault: true },
  { id: 'ach_018', tier: 'SILVER', icon: '🏰', title: 'Siege', desc: 'Defeat the opponent by blocking all of their pieces', points: 30, isDefault: true },
  { id: 'ach_019', tier: 'SILVER', icon: '🏭', title: 'Miller', desc: 'Build 3 or more mills in a single game', points: 20, isDefault: true },
  { id: 'ach_020', tier: 'SILVER', icon: '🦅', title: 'Comeback from the Dead', desc: 'Win after dropping to 3 pieces (flying phase)', points: 30, isDefault: true },
  { id: 'ach_021', tier: 'SILVER', icon: '⏱️', title: 'Lightning Move', desc: 'Play a winning match in under 30 total moves', points: 25, isDefault: true },
  { id: 'ach_022', tier: 'SILVER', icon: '🥇', title: 'Merciless', desc: 'Reduce the opponent to just 2 pieces before they take 2 of yours', points: 25, isDefault: true },
  { id: 'ach_023', tier: 'SILVER', icon: '🧩', title: 'Harmonica', desc: 'Use the seesaw (alternating two mills) successfully', points: 25, isDefault: true },
  { id: 'ach_024', tier: 'SILVER', icon: '📐', title: 'Outer Ring', desc: 'Form all 4 possible mills on the outer square during a match', points: 25, isDefault: true },
  { id: 'ach_025', tier: 'SILVER', icon: '🎯', title: 'Central Node', desc: 'Win while controlling all 4 central connecting points', points: 25, isDefault: true },
  { id: 'ach_026', tier: 'SILVER', icon: '🥋', title: 'Quick Fingers', desc: 'Win a timed competitive match', points: 25, isDefault: true },
  { id: 'ach_027', tier: 'SILVER', icon: '🛡️', title: 'Fortress', desc: 'Win without the opponent forming a single mill', points: 35, isDefault: true },
  { id: 'ach_028', tier: 'SILVER', icon: '🥈', title: 'Hopper', desc: 'Form a mill by jumping with exactly 3 pieces', points: 20, isDefault: true },
  { id: 'ach_029', tier: 'SILVER', icon: '📈', title: 'Ten Count', desc: 'Reach 10 total career wins', points: 25, isDefault: true },
  { id: 'ach_030', tier: 'SILVER', icon: '🎖️', title: 'Early Cut', desc: 'Remove an opponent piece within your first 3 moves', points: 20, isDefault: true },
  { id: 'ach_031', tier: 'SILVER', icon: '⏳', title: 'Under Pressure', desc: 'Make a move and form a mill in the last 3 seconds of the clock', points: 25, isDefault: true },
  { id: 'ach_032', tier: 'SILVER', icon: '🧹', title: 'Board Cleaner', desc: 'Take 5 opponent pieces before they take your first', points: 30, isDefault: true },
  { id: 'ach_033', tier: 'SILVER', icon: '🥊', title: 'Counter Strike', desc: 'Form a mill right after the opponent forms theirs', points: 20, isDefault: true },
  { id: 'ach_034', tier: 'SILVER', icon: '🌐', title: 'Local Champion', desc: 'Play 10 matches in local mode', points: 20, isDefault: true },
  { id: 'ach_035', tier: 'SILVER', icon: '🔥', title: 'On Fire', desc: 'Score 5 wins in a row', points: 35, isDefault: true },

  // 3. ADVANCED & MASTERY (Gold - Positive: 36-55)
  { id: 'ach_036', tier: 'GOLD', icon: '🤖', title: 'Algorithm Breaker', desc: 'Beat the Hard AI bot', points: 50, isDefault: true },
  { id: 'ach_037', tier: 'GOLD', icon: '👑', title: 'Domination', desc: 'Win while keeping 7 or more of your pieces on the board', points: 50, isDefault: true },
  { id: 'ach_038', tier: 'GOLD', icon: '🏆', title: 'Golden Streak', desc: 'Score 7 wins in a row', points: 50, isDefault: true },
  { id: 'ach_039', tier: 'GOLD', icon: '🏹', title: 'Sniper', desc: 'Break a key enemy mill 3 times in one game', points: 40, isDefault: true },
  { id: 'ach_040', tier: 'GOLD', icon: '🪤', title: 'Trap of the Century', desc: 'Force the opponent into a move that automatically blocks their remaining pieces', points: 45, isDefault: true },
  { id: 'ach_041', tier: 'GOLD', icon: '⏱️', title: 'Master of Seconds', desc: 'Win on time in COMPETITIVE mode', points: 40, isDefault: true },
  { id: 'ach_042', tier: 'GOLD', icon: '🎖️', title: 'Quarter Century', desc: 'Win 25 games in your career', points: 50, isDefault: true },
  { id: 'ach_043', tier: 'GOLD', icon: '🏟️', title: 'Tournament Debut', desc: 'Play your first official tournament match', points: 40, isDefault: true },
  { id: 'ach_044', tier: 'GOLD', icon: '🥇', title: 'Tournament Win', desc: 'Win a tournament match', points: 50, isDefault: true },
  { id: 'ach_045', tier: 'GOLD', icon: '🌪️', title: 'Mill Tornado', desc: 'Build 6 or more mills in a single match', points: 50, isDefault: true },
  { id: 'ach_046', tier: 'GOLD', icon: '💎', title: 'Perfect Defense', desc: 'Beat the Hard AI bot without it forming a single mill', points: 60, isDefault: true },
  { id: 'ach_047', tier: 'GOLD', icon: '🧗', title: 'Return from the Brink', desc: 'Opponent has 6 pieces and you have 3 - and still you win', points: 60, isDefault: true },
  { id: 'ach_048', tier: 'GOLD', icon: '🎛️', title: 'All-Rounder', desc: 'Win at least once in Casual, Competitive and AI mode', points: 45, isDefault: true },
  { id: 'ach_049', tier: 'GOLD', icon: '⚙️', title: 'Tactical Mind', desc: 'Win by blocking alone (without dropping to 2 pieces)', points: 50, isDefault: true },
  { id: 'ach_050', tier: 'GOLD', icon: '♟️', title: 'Monolith', desc: 'Finish the game with an unbroken triple mill', points: 45, isDefault: true },
  { id: 'ach_051', tier: 'GOLD', icon: '🏰', title: 'Inner Court', desc: 'Control the center of the board for 5 moves in a row', points: 40, isDefault: true },
  { id: 'ach_052', tier: 'GOLD', icon: '🎪', title: 'Juggler', desc: 'Play 3 pieces in 3 different directions in one game', points: 60, isDefault: true },
  { id: 'ach_053', tier: 'GOLD', icon: '🛑', title: 'Stop the Machine', desc: 'Block the opponent within the first 4 moves of their turn', points: 50, isDefault: true },
  { id: 'ach_054', tier: 'GOLD', icon: '🏅', title: 'Fifty', desc: 'Reach 50 total career wins', points: 50, isDefault: true },
  { id: 'ach_055', tier: 'GOLD', icon: '🔥', title: 'Blazing 10', desc: 'Score 10 wins in a row', points: 70, isDefault: true },

  // 4. TOP EXPERT (Platinum - Positive: 56-68)
  { id: 'ach_056', tier: 'PLATINUM', icon: '🤖', title: 'Master vs Machine', desc: 'Win against all 3 AI difficulty levels (Easy, Medium, Hard)', points: 100, isDefault: true },
  { id: 'ach_057', tier: 'PLATINUM', icon: '🏆', title: 'Tournament Conqueror', desc: 'Win your first official tournament', points: 120, isDefault: true },
  { id: 'ach_058', tier: 'PLATINUM', icon: '🦅', title: 'Iron Wings', desc: 'Reach the flying phase 10 times in your career', points: 90, isDefault: true },
  { id: 'ach_059', tier: 'PLATINUM', icon: '💯', title: 'Centurion', desc: 'Reach 100 total career wins', points: 100, isDefault: true },
  { id: 'ach_060', tier: 'PLATINUM', icon: '⚡', title: 'Absolute Speed', desc: 'Win a Blitz match without flagging', points: 90, isDefault: true },
  { id: 'ach_061', tier: 'PLATINUM', icon: '👑', title: 'King of Streak 15', desc: 'Score 15 wins in a row', points: 120, isDefault: true },
  { id: 'ach_062', tier: 'PLATINUM', icon: '🛡️', title: 'Flawless Game', desc: 'Win without losing a single piece (all 9 remain)', points: 150, isDefault: true },
  { id: 'ach_063', tier: 'PLATINUM', icon: '🎯', title: 'Hundred Mills', desc: 'Build 100 total mills in your career', points: 100, isDefault: true },
  { id: 'ach_064', tier: 'PLATINUM', icon: '🦾', title: 'Bot Tamer', desc: 'Win 3 games in a row against the Hard AI', points: 110, isDefault: true },
  { id: 'ach_065', tier: 'PLATINUM', icon: '⚔️', title: 'Butcher', desc: 'Take 7 opponent pieces in a single game', points: 100, isDefault: true },
  { id: 'ach_066', tier: 'PLATINUM', icon: '🏛️', title: 'Game Architect', desc: 'Win in every one of the 3 game modes (Casual, Competitive, AI)', points: 90, isDefault: true },
  { id: 'ach_067', tier: 'PLATINUM', icon: '🌟', title: 'Half a Thousand', desc: 'Reach 500 wins on your profile', points: 100, isDefault: true },
  { id: 'ach_068', tier: 'PLATINUM', icon: '🏆', title: '50 Wins', desc: 'Score 50 matches in one season', points: 120, isDefault: true },

  // 5. LEGEND & ELITE (Legendary - Positive: 69-75)
  { id: 'ach_069', tier: 'LEGENDARY', icon: '👑', title: 'Lord of the Mill', desc: 'Build 10 mills in a single match', points: 250, isDefault: true },
  { id: 'ach_070', tier: 'LEGENDARY', icon: '🔥', title: 'Mythic Streak 20', desc: 'Score 20 wins in a row', points: 300, isDefault: true },
  { id: 'ach_071', tier: 'LEGENDARY', icon: '💎', title: 'Point Millionaire', desc: 'Reach 1 million total points', points: 250, isDefault: true },
  { id: 'ach_072', tier: 'LEGENDARY', icon: '🤖', title: 'Cyborg Nightmare', desc: 'Win 5 games in a row against all AI levels', points: 200, isDefault: true },
  { id: 'ach_073', tier: 'LEGENDARY', icon: '📜', title: 'Eternal Player', desc: 'Play 500 matches in the app', points: 200, isDefault: true },
  { id: 'ach_074', tier: 'LEGENDARY', icon: '✨', title: 'Perfection', desc: 'Win 3 tournaments in a row', points: 300, isDefault: true },
  { id: 'ach_075', tier: 'LEGENDARY', icon: '🌌', title: 'Immortal', desc: 'Win 100 matches in a row', points: 350, isDefault: true },

  // 6. NEGATIVE & CONSOLATION (Fumble: 76-100)
  { id: 'ach_076', tier: 'SHAME', icon: '🩹', title: 'First Bitter Pill', desc: 'Suffer your first defeat in the app', points: 0, isDefault: true },
  { id: 'ach_077', tier: 'SHAME', icon: '🧊', title: 'Dead End', desc: 'Have all your pieces blocked by the opponent', points: 0, isDefault: true },
  { id: 'ach_078', tier: 'SHAME', icon: '🚪', title: 'Early Lock', desc: 'Lose with 7 or more of your pieces still on the board', points: 0, isDefault: true },
  { id: 'ach_079', tier: 'SHAME', icon: '⏰', title: 'Out of Time', desc: 'Lose a game due to running out of time on the clock', points: 0, isDefault: true },
  { id: 'ach_080', tier: 'SHAME', icon: '🤖', title: 'Humbled by a Novice', desc: 'Lose a game against the Easy AI bot', points: 0, isDefault: true },
  { id: 'ach_081', tier: 'SHAME', icon: '💨', title: 'Empty Pocket', desc: 'Lose all your pieces without the opponent scoring a single mill', points: 0, isDefault: true },
  { id: 'ach_082', tier: 'SHAME', icon: '🪙', title: 'Unlucky Coin', desc: 'Guess the coin toss wrong and then also lose the game', points: 0, isDefault: true },
  { id: 'ach_083', tier: 'SHAME', icon: '📉', title: 'Cold Shower', desc: 'Lose 3 games in a row', points: 0, isDefault: true },
  { id: 'ach_084', tier: 'SHAME', icon: '🌪️', title: 'Black Hole', desc: 'Lose 2 games in a row against the Hard AI bot', points: 0, isDefault: true },
  { id: 'ach_085', tier: 'SHAME', icon: '🪦', title: 'Total Debacle', desc: 'Suffer a defeat in which the opponent did not lose a single piece', points: 0, isDefault: true },
  { id: 'ach_086', tier: 'SHAME', icon: '🪓', title: 'Slaughter at the Start', desc: 'Lose 5 of your pieces before the placement phase even ends', points: 0, isDefault: true },
  { id: 'ach_087', tier: 'SHAME', icon: '🪶', title: 'Short Flight', desc: 'Reach the flying phase and then lose on the very next move', points: 0, isDefault: true },
  { id: 'ach_088', tier: 'SHAME', icon: '🙈', title: 'Gifted Mill', desc: 'Make a move that lets the opponent form a mill on the next move', points: 0, isDefault: true },
  { id: 'ach_089', tier: 'SHAME', icon: '🧱', title: 'Self-Builder', desc: 'Block your own piece with your own pieces', points: 0, isDefault: true },
  { id: 'ach_090', tier: 'SHAME', icon: '🐌', title: 'Asleep at the Move', desc: 'Lose 4 of your pieces without the opponent scoring a mill, and all of them within your first 5 moves', points: 0, isDefault: true },
  { id: 'ach_091', tier: 'SHAME', icon: '💔', title: 'Step from Glory', desc: 'Lose a game that was going well, where you had 2 more pieces than the opponent', points: 0, isDefault: true },
  { id: 'ach_092', tier: 'SHAME', icon: '💥', title: 'Express Defeat', desc: 'Lose in 10 total moves or fewer', points: 0, isDefault: true },
  { id: 'ach_093', tier: 'SHAME', icon: '🚷', title: 'Paralysis', desc: 'Have all your pieces blocked 3 times in a single game', points: 0, isDefault: true },
  { id: 'ach_094', tier: 'SHAME', icon: '🕳️', title: 'Persistent Loser', desc: 'Lose to the same AI level 3 times in a row', points: 0, isDefault: true },
  { id: 'ach_095', tier: 'SHAME', icon: '🗿', title: 'Turned to Stone', desc: 'Lose a game with one of your pieces sitting unmoved in a board corner the entire game', points: 0, isDefault: true },
  { id: 'ach_096', tier: 'SHAME', icon: '🎯', title: 'Missed Opportunity', desc: 'Lose a game where you had a potential mill and it was not used, even though the point was free', points: 0, isDefault: true },
  { id: 'ach_097', tier: 'SHAME', icon: '🎪', title: 'Comedy of Errors', desc: 'Pick white and lose the match within 3 minutes', points: 0, isDefault: true },
  { id: 'ach_098', tier: 'SHAME', icon: '🌧️', title: 'Seven Lean', desc: 'Lose while you still had 7 pieces on the board', points: 0, isDefault: true },
  { id: 'ach_099', tier: 'SHAME', icon: '⚡', title: 'Checkmate without a King', desc: 'Lose a game where you had an active mill at the moment of defeat', points: 0, isDefault: true },
  { id: 'ach_100', tier: 'SHAME', icon: '🏁', title: 'Fenwick', desc: 'Lose 100 games in the app', points: 0, isDefault: true }
];

// Helper function that merges the initial 100 with custom achievements from localStorage
export const getStoredAchievements = () => {
  let customList = [];
  try {
    const rawCustom = localStorage.getItem('mlin_custom_achievements');
    if (rawCustom) {
      const parsed = JSON.parse(rawCustom);
      if (Array.isArray(parsed)) customList = parsed;
    }
  } catch (e) {}

  let catalog = [...INITIAL_ACHIEVEMENTS];
  try {
    const saved = localStorage.getItem('mlin_achievements_catalog');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 100) {
        catalog = parsed;
      }
    }
  } catch (e) {}

  // Prepend custom achievements to the start so there are no duplicates
  const existingIds = new Set(catalog.map(a => a.id));
  const missingCustom = customList.filter(c => !existingIds.has(c.id));
  const finalCatalog = [...missingCustom, ...catalog];

  localStorage.setItem('mlin_achievements_catalog', JSON.stringify(finalCatalog));
  return finalCatalog;
};

export const saveStoredAchievements = (achievements) => {
  localStorage.setItem('mlin_achievements_catalog', JSON.stringify(achievements));
};

// Fetch all achievements from Firebase + merge with locally created ones
export const fetchAchievementsFromFirebase = async () => {
  const localCatalog = getStoredAchievements();
  try {
    const colRef = collection(db, 'achievements');
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      for (const ach of INITIAL_ACHIEVEMENTS) {
        await setDoc(doc(db, 'achievements', ach.id), ach);
      }
      return localCatalog;
    }

    const firebaseList = [];
    snapshot.forEach(docSnap => {
      firebaseList.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Ensure local custom achievements and all 100 initial ones are always present
    const mapById = new Map();
    INITIAL_ACHIEVEMENTS.forEach(a => mapById.set(a.id, a));
    firebaseList.forEach(a => {
      const num = parseInt((a.id || '').replace('ach_', ''), 10);
      const isCustom = a.isCustom || (!isNaN(num) && num > 100);
      mapById.set(a.id, { ...a, isDefault: !isCustom, isCustom });
    });
    localCatalog.forEach(a => {
      if (a.isCustom && !mapById.has(a.id)) {
        mapById.set(a.id, a);
      }
    });

    const merged = Array.from(mapById.values());
    localStorage.setItem('mlin_achievements_catalog', JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.error("Error fetching from Firebase, using local:", error);
    return localCatalog;
  }
};

// Add or edit achievements on Firebase and locally
export const saveAchievementToFirebase = async (ach) => {
  try {
    const current = getStoredAchievements();
    const exists = current.some(a => a.id === ach.id);
    const updated = exists ? current.map(a => a.id === ach.id ? ach : a) : [ach, ...current];
    localStorage.setItem('mlin_achievements_catalog', JSON.stringify(updated));
    if (ach.isCustom) {
      const customOnly = updated.filter(a => a.isCustom);
      localStorage.setItem('mlin_custom_achievements', JSON.stringify(customOnly));
    }
    await setDoc(doc(db, 'achievements', ach.id), ach);
  } catch (error) {
    console.error("Error saving achievement to Firebase:", error);
  }
};

// Delete achievements from Firebase
export const deleteAchievementFromFirebase = async (achId) => {
  try {
    await deleteDoc(doc(db, 'achievements', achId));
  } catch (error) {
    console.error("Error deleting achievement from Firebase:", error);
  }
};