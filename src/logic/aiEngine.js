import { BOARD_CONNECTIONS } from '../constants/gameData';
import { checkFormsMill, isPieceInMill, MILL_TRIPLETS } from './millEngine';
import { bzvz }

const getOpponent = (color) => (color === 'WHITE' ? 'BLACK' : 'WHITE');

const getEmptyNodes = (board) =>
  board.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null);

const getPlayerNodes = (board, color) =>
  board.map((val, idx) => (val === color ? idx : null)).filter((val) => val !== null);

// Brojanje otvorenih konfiguracija od 2 figure s 1 praznim poljem
const countPotentialMills = (board, player) => {
  let count = 0;
  for (let triplet of MILL_TRIPLETS) {
    let pCount = 0;
    let emptyCount = 0;
    for (let idx of triplet) {
      if (board[idx] === player) pCount++;
      else if (board[idx] === null) emptyCount++;
    }
    if (pCount === 2 && emptyCount === 1) count++;
  }
  return count;
};

// Mobilnost (broj slobodnih legalnih pomaka)
const getMobility = (board, player, isFlying) => {
  if (isFlying) return getEmptyNodes(board).length;
  let moves = 0;
  const nodes = getPlayerNodes(board, player);
  for (let n of nodes) {
    const adj = BOARD_CONNECTIONS[n] || [];
    moves += adj.filter((target) => board[target] === null).length;
  }
  return moves;
};

// Heuristička evaluacija ploče
const evaluateBoard = (board, aiColor) => {
  const oppColor = getOpponent(aiColor);
  const aiNodes = getPlayerNodes(board, aiColor);
  const oppNodes = getPlayerNodes(board, oppColor);

  // Ako protivnik ima manje od 3 figure nakon faze postavljanja
  if (oppNodes.length < 3) return 10000;
  if (aiNodes.length < 3) return -10000;

  let score = 0;

  // 1. Razlika u broju figura
  score += (aiNodes.length - oppNodes.length) * 100;

  // 2. Mlinovi
  let aiMills = 0;
  let oppMills = 0;
  for (let t of MILL_TRIPLETS) {
    if (t.every((i) => board[i] === aiColor)) aiMills++;
    if (t.every((i) => board[i] === oppColor)) oppMills++;
  }
  score += (aiMills - oppMills) * 80;

  // 3. Dvojke (potencijalni mlinovi)
  score += (countPotentialMills(board, aiColor) - countPotentialMills(board, oppColor)) * 35;

  // 4. Mobilnost
  const aiMob = getMobility(board, aiColor, aiNodes.length === 3);
  const oppMob = getMobility(board, oppColor, oppNodes.length === 3);
  score += (aiMob - oppMob) * 6;

  // 5. Strateške točke s 4 veze (križanja: 1, 9, 17, 3, 11, 19, 5, 13, 21, 7, 15, 23)
  for (let n of aiNodes) {
    if ((BOARD_CONNECTIONS[n] || []).length === 4) score += 8;
  }
  for (let n of oppNodes) {
    if ((BOARD_CONNECTIONS[n] || []).length === 4) score -= 8;
  }

  return score;
};

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
  if (eligibleNodes.length === 1) return eligibleNodes[0];

  // Lako: nasumično bira, ali izbjegava one koje ništa ne ugrožavaju
  if (difficulty === 'EASY') {
    for (let node of eligibleNodes) {
      const adjacent = BOARD_CONNECTIONS[node] || [];
      if (adjacent.some((a) => board[a] === opponentColor)) return node;
    }
    return eligibleNodes[Math.floor(Math.random() * eligibleNodes.length)];
  }

  // Srednje i Teško: uklanja figuru koja protivniku ruši potencijalni mlin ili mu najviše smanjuje mobilnost
  let bestNode = eligibleNodes[0];
  let maxThreat = -Infinity;

  for (let node of eligibleNodes) {
    let threatScore = 0;

    // Ruši li protivničku 2-u-nizu prijetnju?
    for (let triplet of MILL_TRIPLETS) {
      if (triplet.includes(node)) {
        const others = triplet.filter((i) => i !== node);
        if (others.every((i) => board[i] === opponentColor)) {
          threatScore += 50; // Spas od neposrednog mlina
        }
      }
    }

    // Mobilnost protivničke figure
    const adjacent = BOARD_CONNECTIONS[node] || [];
    threatScore += adjacent.filter((a) => board[a] === null).length * 5;

    // Križno polje s 4 veze
    if (adjacent.length === 4) threatScore += 15;

    if (threatScore > maxThreat) {
      maxThreat = threatScore;
      bestNode = node;
    }
  }

  return bestNode;
};

/**
 * 2. AI FAZA POSTAVLJANJA
 */
export const getAIPlacementNode = (board, aiColor, difficulty = 'EASY') => {
  const emptyNodes = getEmptyNodes(board);
  if (emptyNodes.length === 0) return null;
  const oppColor = getOpponent(aiColor);

  // 1. ZATVORI VLASTITI MLIN (Apsolutni prioritet za pobjednički potez)
  for (let node of emptyNodes) {
    const simBoard = [...board];
    simBoard[node] = aiColor;
    if (checkFormsMill(simBoard, node, aiColor)) {
      return node;
    }
  }

  // 2. BLOKIRAJ PROTIVNIČKI MLIN (Ako protivnik ima 2 u nizu, AI MORA stati na 3. mjesto)
  for (let node of emptyNodes) {
    const simBoard = [...board];
    simBoard[node] = oppColor;
    if (checkFormsMill(simBoard, node, oppColor)) {
      return node;
    }
  }

  if (difficulty === 'EASY') {
    // Lako: traži polja koja stvaraju 2-u-nizu
    for (let node of emptyNodes) {
      const tempBoard = [...board];
      tempBoard[node] = aiColor;
      if (countPotentialMills(tempBoard, aiColor) > countPotentialMills(board, aiColor)) {
        return node;
      }
    }
    return emptyNodes[Math.floor(Math.random() * emptyNodes.length)];
  }

  // Srednje i Teško: strateško biranje najboljeg polja
  let bestScore = -Infinity;
  let bestNode = emptyNodes[0];

  for (let node of emptyNodes) {
    const tempBoard = [...board];
    tempBoard[node] = aiColor;

    let score = 0;

    // Stvaranje vlastitih dvojki
    const myPotentials = countPotentialMills(tempBoard, aiColor);
    score += myPotentials * 45;

    // Blokiranje protivničkih potencijala (dvojki)
    const oppPotentialsBefore = countPotentialMills(board, oppColor);
    const oppPotentialsAfter = countPotentialMills(tempBoard, oppColor);
    score += (oppPotentialsBefore - oppPotentialsAfter) * 35;

    // Kontrola raskrižja (polja s 4 veze: križevi)
    const connections = (BOARD_CONNECTIONS[node] || []).length;
    score += connections * 12;

    // Slobodna susjedna polja
    const freeNeighbors = (BOARD_CONNECTIONS[node] || []).filter((i) => board[i] === null).length;
    score += freeNeighbors * 8;

    if (difficulty === 'HARD') {
      // Izbjegavaj potez koji protivniku direktno otvara mlin u idućem koraku
      for (let oppNode of emptyNodes) {
        if (oppNode === node) continue;
        const testBoard = [...tempBoard];
        testBoard[oppNode] = oppColor;
        if (checkFormsMill(testBoard, oppNode, oppColor)) {
          score -= 50;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestNode = node;
    }
  }

  return bestNode;
};

/**
 * 3. AI FAZA POMICANJA / LETENJA (MINIMAX + ALPHA-BETA)
 */
export const getAIMove = (board, aiColor, difficulty = 'EASY') => {
  const aiNodes = getPlayerNodes(board, aiColor);
  const oppColor = getOpponent(aiColor);
  const isFlying = aiNodes.length === 3;

  const getAllMoves = (b, player, flying) => {
    const moves = [];
    const nodes = getPlayerNodes(b, player);
    for (let from of nodes) {
      const targets = flying
        ? getEmptyNodes(b)
        : (BOARD_CONNECTIONS[from] || []).filter((to) => b[to] === null);
      for (let to of targets) {
        moves.push({ from, to });
      }
    }
    return moves;
  };

  const legalMoves = getAllMoves(board, aiColor, isFlying);
  if (legalMoves.length === 0) return null;

  // 1. Trenutni mlin (apsolutni prioritet za sve težine)
  for (let move of legalMoves) {
    const tempBoard = [...board];
    tempBoard[move.from] = null;
    if (checkFormsMill(tempBoard, move.to, aiColor)) {
      return move;
    }
  }

  // 2. Blokiranje trenutnog protivničkog mlina
  for (let move of legalMoves) {
    const tempBoard = [...board];
    tempBoard[move.from] = null;
    if (checkFormsMill(tempBoard, move.to, oppColor)) {
      return move;
    }
  }

  if (difficulty === 'EASY') {
    // Lako: bira potez koji makar povećava mobilnost ili stvara prijetnju
    for (let move of legalMoves) {
      const tempBoard = [...board];
      tempBoard[move.from] = null;
      tempBoard[move.to] = aiColor;
      if (countPotentialMills(tempBoard, aiColor) > countPotentialMills(board, aiColor)) {
        return move;
      }
    }
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }

  // Minimax s Alpha-Beta rezanjem za Srednje (dubina 2) i Teško (dubina 3-4)
  const maxDepth = difficulty === 'HARD' ? 3 : 2;

  const minimax = (currentBoard, depth, alpha, beta, isMaximizing) => {
    const currentPlayer = isMaximizing ? aiColor : oppColor;
    const currentFlying = getPlayerNodes(currentBoard, currentPlayer).length === 3;
    const moves = getAllMoves(currentBoard, currentPlayer, currentFlying);

    if (depth === 0 || moves.length === 0) {
      return evaluateBoard(currentBoard, aiColor);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let m of moves) {
        const nextBoard = [...currentBoard];
        nextBoard[m.from] = null;
        nextBoard[m.to] = aiColor;

        const formsMill = checkFormsMill(nextBoard, m.to, aiColor);
        if (formsMill) {
          const toRemove = getAIPieceToRemove(nextBoard, oppColor, 'HARD');
          if (toRemove !== null) nextBoard[toRemove] = null;
        }

        const evaluation = minimax(nextBoard, depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let m of moves) {
        const nextBoard = [...currentBoard];
        nextBoard[m.from] = null;
        nextBoard[m.to] = oppColor;

        const formsMill = checkFormsMill(nextBoard, m.to, oppColor);
        if (formsMill) {
          const toRemove = getAIPieceToRemove(nextBoard, aiColor, 'HARD');
          if (toRemove !== null) nextBoard[toRemove] = null;
        }

        const evaluation = minimax(nextBoard, depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  let bestMove = legalMoves[0];
  let bestVal = -Infinity;

  for (let move of legalMoves) {
    const nextBoard = [...board];
    nextBoard[move.from] = null;
    nextBoard[move.to] = aiColor;

    if (checkFormsMill(nextBoard, move.to, aiColor)) {
      const toRemove = getAIPieceToRemove(nextBoard, oppColor, difficulty);
      if (toRemove !== null) nextBoard[toRemove] = null;
    }

    const moveVal = minimax(nextBoard, maxDepth - 1, -Infinity, Infinity, false);
    if (moveVal > bestVal) {
      bestVal = moveVal;
      bestMove = move;
    }
  }

  return bestMove;
};