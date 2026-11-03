// src/boardsData.js
import { BOARD_THEMES } from './constants/boardThemes';

// Dohvat svih ploča iz lokalne memorije ili fallback na konstante
export const getStoredBoards = () => {
  try {
    const saved = localStorage.getItem('mlin_boards_catalog');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return BOARD_THEMES;
};

// Spremanje kataloga ploča
export const saveBoardsToStorage = (boards) => {
  try {
    localStorage.setItem('mlin_boards_catalog', JSON.stringify(boards));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {}
};

// Provjera koje su ploče defaultne (prva ploča je uvijek otključana svima)
export const getDefaultUnlockedBoardIds = () => {
  const boards = getStoredBoards();
  return boards.filter(b => b.price === 0 || b.isDefault).map(b => b.id);
};

// Evaluacija profila da se osigura da igrač ima barem defaultne ploče
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