import { BOARD_CONNECTIONS } from '../constants/gameData';

// 16 točnih trojki usklađenih s rasporedom točaka na ploči (0-23)
export const MILL_TRIPLETS = [
  // Vanjski kvadrat (0-7)
  [0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0],

  // Srednji kvadrat (8-15)
  [8, 9, 10], [10, 11, 12], [12, 13, 14], [14, 15, 8],

  // Unutarnji kvadrat (16-23)
  [16, 17, 18], [18, 19, 20], [20, 21, 22], [22, 23, 16],

  // Poprečne spojne linije (križ)
  [1, 9, 17],   // Gornja vertikala
  [3, 11, 19],  // Desna horizontala
  [5, 13, 21],  // Donja vertikala
  [7, 15, 23]   // Lijeva horizontala
];

// Provjera je li zadnji potez na poziciji 'node' zatvorio mlin
export const checkFormsMill = (board, node, player) => {
  return MILL_TRIPLETS.some(triplet => {
    if (!triplet.includes(node)) return false;
    return triplet.every(idx => board[idx] === player);
  });
};

// Provjera nalazi li se figura na zadanom čvoru unutar bilo kojeg mlina
export const isPieceInMill = (board, node, player) => {
  return MILL_TRIPLETS.some(triplet => {
    if (!triplet.includes(node)) return false;
    return triplet.every(idx => board[idx] === player);
  });
};

// Provjera ima li igrač barem jedan legalan potez (blokada = poraz)
export const hasLegalMoves = (board, player, isFlying) => {
  if (isFlying) return board.some(cell => cell === null);

  const playerNodes = board
    .map((val, idx) => (val === player ? idx : null))
    .filter(val => val !== null);

  return playerNodes.some(fromNode => {
    const neighbors = BOARD_CONNECTIONS[fromNode] || [];
    return neighbors.some(toNode => board[toNode] === null);
  });
};