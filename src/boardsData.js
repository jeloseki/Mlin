// src/boardsData.js
import { BOARD_THEMES } from './constants/boardThemes';

// Merge a stored board with the default values from BOARD_THEMES.
// This way older records in localStorage (without the 'fx' field) get visual
// effects, and new fields (glow, signs, floaters...) are not lost.
const mergeWithDefaults = (board) => {
  const base = BOARD_THEMES.find(t => t.id === board.id) || {};
  return {
    ...base,
    ...board,
    fx: { ...(base.fx || {}), ...(board.fx || {}) }
  };
};

// Fetch all boards from local storage or fall back to the constants
export const getStoredBoards = () => {
  try {
    const saved = localStorage.getItem('mlin_boards_catalog');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(mergeWithDefaults);
      }
    }
  } catch (e) {}
  return BOARD_THEMES;
};

// Saving the board catalog
export const saveBoardsToStorage = (boards) => {
  try {
    localStorage.setItem('mlin_boards_catalog', JSON.stringify(boards));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}
};

// Check which boards are default (the first board is always unlocked for everyone)
export const getDefaultUnlockedBoardIds = () => {
  const boards = getStoredBoards();
  return boards.filter(b => b.price === 0 || b.isDefault).map(b => b.id);
};

// Evaluate the profile to make sure the player has at least the default boards
export const evaluateGameBoards = (profile) => {
  const defaultIds = getDefaultUnlockedBoardIds();
  const currentUnlocked = Array.isArray(profile.unlockedBoards) ? profile.unlockedBoards : [];
  
  const mergedUnlocked = Array.from(new Set([...defaultIds, ...currentUnlocked]));
  
  return {
    ...profile,
    unlockedBoards: mergedUnlocked,
    activeBoard: profile.activeBoard || defaultIds[0] || 'classic-wood'
  };
};