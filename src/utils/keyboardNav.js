// Navigacijska mapa za 24 polja (0-23)
const NAV_MAP = {
  // --- VANJSKI KVADRAT ---
  0: { UP: 0, DOWN: 7, LEFT: 0, RIGHT: 1 },
  1: { UP: 1, DOWN: 9, LEFT: 0, RIGHT: 2 },
  2: { UP: 2, DOWN: 3, LEFT: 1, RIGHT: 2 },
  3: { UP: 2, DOWN: 4, LEFT: 11, RIGHT: 3 },
  4: { UP: 3, DOWN: 4, LEFT: 5, RIGHT: 4 },
  5: { UP: 13, DOWN: 5, LEFT: 6, RIGHT: 4 },
  6: { UP: 7, DOWN: 6, LEFT: 6, RIGHT: 5 },
  7: { UP: 0, DOWN: 6, LEFT: 7, RIGHT: 15 },

  // --- SREDNJI KVADRAT ---
  8:  { UP: 0, DOWN: 15, LEFT: 7, RIGHT: 9 },
  9:  { UP: 1, DOWN: 17, LEFT: 8, RIGHT: 10 },
  10: { UP: 2, DOWN: 11, LEFT: 9, RIGHT: 3 },
  11: { UP: 10, DOWN: 12, LEFT: 19, RIGHT: 3 },
  12: { UP: 11, DOWN: 4, LEFT: 13, RIGHT: 4 },
  13: { UP: 21, DOWN: 5, LEFT: 14, RIGHT: 12 },
  14: { UP: 15, DOWN: 6, LEFT: 7, RIGHT: 13 },
  15: { UP: 8, DOWN: 14, LEFT: 7, RIGHT: 23 },

  // --- UNUTARNJI KVADRAT ---
  16: { UP: 8, DOWN: 23, LEFT: 15, RIGHT: 17 },
  17: { UP: 9, DOWN: 17, LEFT: 16, RIGHT: 18 },
  18: { UP: 10, DOWN: 19, LEFT: 17, RIGHT: 11 },
  19: { UP: 18, DOWN: 20, LEFT: 19, RIGHT: 11 },
  20: { UP: 19, DOWN: 12, LEFT: 21, RIGHT: 11 },
  21: { UP: 21, DOWN: 13, LEFT: 22, RIGHT: 20 },
  22: { UP: 23, DOWN: 14, LEFT: 15, RIGHT: 21 },
  23: { UP: 16, DOWN: 22, LEFT: 15, RIGHT: 23 }
};

export const getNextNodeByDirection = (currentIndex, direction) => {
  if (currentIndex === null || currentIndex === undefined) return 0;

  const nodeMap = NAV_MAP[currentIndex];
  if (!nodeMap || nodeMap[direction] === undefined) return currentIndex;

  return nodeMap[direction];
};