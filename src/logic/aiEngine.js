import { BOARD_CONNECTIONS } from '../constants/gameData';
import { checkFormsMill, isPieceInMill } from './millEngine';

const getOpponent = (color) => (color === 'WHITE' ? 'BLACK' : 'WHITE');

const getEmptyNodes = (board) => 
  board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null);

const getPlayerNodes = (board, color) => 
  board.map((val, idx) => (val === color ? idx : null)).filter((val) => val !== null);

/**
 * 1. AI IZBACIVANJE FIGURA
 */
export const getAIPieceToRemove = (board, opponentColor, difficulty = 'EASY') => {
  const opponentNodes = getPlayerNodes(board, opponentColor);
  if (opponentNodes.length === 0) return null;

  const notInMillNodes = opponentNodes.filter(
    (idx) => !isPieceInMill(board, idx, opponentColor)
  );

  const eligibleNodes = notInMillNodes.length > 0 ? notInMillNodes : opponentNodes;

  if (difficulty === 'EASY') {
    const randomIdx = Math.floor(Math.random() * eligibleNodes.length);
    return eligibleNodes[randomIdx];
  }

  for (let node of eligibleNodes) {
    const adjacent = BOARD_CONNECTIONS[node] || [];
    const adjOpponents = adjacent.filter((adj) => board[adj] === opponentColor);
    if (adjOpponents.length >= 1) {
      return node;
    }
  }

  return eligibleNodes[0];
};

/**
 * 2. AI FAZA POSTAVLJANJA
 */
export const getAIPlacementNode = (board, aiColor, difficulty = 'EASY') => {
  const emptyNodes = getEmptyNodes(board);
  if (emptyNodes.length === 0) return null;

  const opponentColor = getOpponent(aiColor);

  // 1. ZATVORI VLASTITI MLIN
  for (let node of emptyNodes) {
    if (checkFormsMill(board, node, aiColor)) {
      return node;
    }
  }

  // 2. BLOKIRAJ PROTIVNIKA
  if (difficulty !== 'EASY') {
    for (let node of emptyNodes) {
      if (checkFormsMill(board, node, opponentColor)) {
        return node;
      }
    }
  }

  // 3. RASKRIŽJA I STRATEŠKA POLJA
  if (difficulty === 'HARD') {
    const strategicPriority = [4, 10, 12, 16, 1, 9, 14, 22, 3, 5, 18, 20];
    for (let prefNode of strategicPriority) {
      if (emptyNodes.includes(prefNode)) {
        return prefNode;
      }
    }
  }

  // 4. NASUMIČAN ODABIR
  const randomIndex = Math.floor(Math.random() * emptyNodes.length);
  return emptyNodes[randomIndex];
};

/**
 * 3. AI FAZA POMICANJA / LETENJA
 */
export const getAIMove = (board, aiColor, difficulty = 'EASY') => {
  const aiNodes = getPlayerNodes(board, aiColor);
  const opponentColor = getOpponent(aiColor);
  const isFlying = aiNodes.length === 3;

  const allLegalMoves = [];

  for (let fromNode of aiNodes) {
    const targets = isFlying
      ? getEmptyNodes(board)
      : (BOARD_CONNECTIONS[fromNode] || []).filter((toNode) => board[toNode] === null);

    for (let toNode of targets) {
      allLegalMoves.push({ from: fromNode, to: toNode });
    }
  }

  if (allLegalMoves.length === 0) return null;

  // 1. POTEZ ZA MLIN
  for (let move of allLegalMoves) {
    const tempBoard = [...board];
    tempBoard[move.from] = null;
    if (checkFormsMill(tempBoard, move.to, aiColor)) {
      return move;
    }
  }

  // 2. BLOKIRAJ PROTIVNIČKI MLIN
  if (difficulty !== 'EASY') {
    for (let move of allLegalMoves) {
      const tempBoard = [...board];
      tempBoard[move.from] = null;
      if (checkFormsMill(tempBoard, move.to, opponentColor)) {
        return move;
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * allLegalMoves.length);
  return allLegalMoves[randomIndex];
};