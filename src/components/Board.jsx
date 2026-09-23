import React, { useRef } from 'react';
import { isPieceInMill } from '../logic/millEngine';

export const NODE_POSITIONS = [
  // Vanjski kvadrat (0-7)
  { x: 10, y: 10 }, { x: 50, y: 10 }, { x: 90, y: 10 },
  { x: 90, y: 50 }, { x: 90, y: 90 }, { x: 50, y: 90 },
  { x: 10, y: 90 }, { x: 10, y: 50 },
  // Srednji kvadrat (8-15)
  { x: 23.33, y: 23.33 }, { x: 50, y: 23.33 }, { x: 76.66, y: 23.33 },
  { x: 76.66, y: 50 }, { x: 76.66, y: 76.66 }, { x: 50, y: 76.66 },
  { x: 23.33, y: 76.66 }, { x: 23.33, y: 50 },
  // Unutarnji kvadrat (16-23)
  { x: 36.66, y: 36.66 }, { x: 50, y: 36.66 }, { x: 63.33, y: 36.66 },
  { x: 63.33, y: 50 }, { x: 63.33, y: 63.33 }, { x: 50, y: 63.33 },
  { x: 36.66, y: 63.33 }, { x: 36.66, y: 50 }
];

export default function Board({ 
  board, 
  onNodeInteract,
  onNodePick,
  selectedNode, 
  validMoves = [], 
  removableNodes = [],
  turn,
  isAIMode,
  aiColor,
  mustRemove
}) {
  const isAITurn = isAIMode && turn === aiColor;
  const boardRef = useRef(null);

  const findClosestNode = (clientX, clientY) => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const dropX = ((clientX - rect.left) / rect.width) * 100;
    const dropY = ((clientY - rect.top) / rect.height) * 100;

    let closestNode = null;
    let minDistance = Infinity;

    NODE_POSITIONS.forEach((pos, idx) => {
      const dist = Math.hypot(pos.x - dropX, pos.y - dropY);
      if (dist < minDistance) {
        minDistance = dist;
        closestNode = idx;
      }
    });

    return minDistance <= 16 ? closestNode : null;
  };

  const handleBoardMouseUp = (e) => {
    if (isAITurn || mustRemove) return;
    const closest = findClosestNode(e.clientX, e.clientY);
    if (closest !== null && onNodeInteract) {
      onNodeInteract(closest);
    }
  };

  return (
    <div 
      className="board-wrapper" 
      ref={boardRef}
      onMouseUp={handleBoardMouseUp}
    >
      <svg className="board-svg" viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" fill="none" stroke="#d4af37" strokeWidth="2.5" />
        <rect x="23.33" y="23.33" width="53.33" height="53.33" fill="none" stroke="#d4af37" strokeWidth="2.5" />
        <rect x="36.66" y="36.66" width="26.68" height="26.68" fill="none" stroke="#d4af37" strokeWidth="2.5" />

        <line x1="50" y1="10" x2="50" y2="36.66" stroke="#d4af37" strokeWidth="2.5" />
        <line x1="90" y1="50" x2="63.33" y2="50" stroke="#d4af37" strokeWidth="2.5" />
        <line x1="50" y1="90" x2="50" y2="63.33" stroke="#d4af37" strokeWidth="2.5" />
        <line x1="10" y1="50" x2="36.66" y2="50" stroke="#d4af37" strokeWidth="2.5" />

        {NODE_POSITIONS.map((pos, i) => (
          <circle
            key={`dot-${i}`}
            cx={pos.x}
            cy={pos.y}
            r="2.2"
            fill="#d4af37"
            stroke="#d4af37"
            strokeWidth="0.5"
            opacity="0.9"
          />
        ))}
      </svg>

      {NODE_POSITIONS.map((pos, idx) => {
        const piece = board[idx];
        const isSelected = selectedNode === idx;
        const isValidTarget = validMoves.includes(idx);
        const isRemovable = removableNodes.includes(idx);
        
        const canPickPiece = piece === turn && !isAITurn && !mustRemove;
        const inMill = piece ? isPieceInMill(board, idx, piece) : false;

        return (
          <div
            key={idx}
            className={`board-node-slot ${isValidTarget ? 'valid-target' : ''} ${isRemovable ? 'removable-target' : ''}`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              if (isAITurn) return;
              onNodeInteract(idx);
            }}
          >
            {!piece && isValidTarget && <div className="target-dot" />}

            {piece && (
              <div
                className={`piece-slot ${piece === 'WHITE' ? 'piece-white' : 'piece-black'} ${isSelected ? 'selected-piece' : ''} ${inMill ? 'in-mill-piece' : ''} ${isRemovable ? 'pulse-remove' : ''} ${canPickPiece || isRemovable ? 'draggable' : ''}`}
                onMouseDown={(e) => {
                  if (isAITurn) return;
                  e.stopPropagation();
                  if (canPickPiece) {
                    onNodePick(idx);
                  }
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}