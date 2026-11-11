import React, { memo, useRef } from 'react';
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

const Board = ({ 
  board, 
  onNodeInteract,
  onNodePick,
  selectedNode, 
  validMoves = [], 
  removableNodes = [],
  showLegalMoves = true,
  turn,
  isAIMode,
  aiColor,
  mustRemove,
  focusedNode,
  theme // Primamo temu odabrane ploče
}) => {
  const isAITurn = isAIMode && turn === aiColor;
  const boardRef = useRef(null);

  // Izvlacimo boje iz teme, s fiksnim fallbackom na zlatno-plavo ako tema fali
  const linesColor = theme?.linesColor || '#d4af37';
  const boardBgColor = theme?.boardBackground || '';
  const fx = theme?.fx || null;
  const neonSignShadow = (color) => `${color} 0 0 3px, ${color} 0 0 8px, ${color} 0 0 16px, ${color} 0 0 32px`;

  // 3D + dubinska sjena — iz fx konfiguracije (po temi)
  const tilt3d = fx?.tilt3d || 0;
  const depthShadow = fx?.depthShadow || '0 24px 48px rgba(0,0,0,0.75)';
  const wrapperStyle = {
    ...(theme?.background ? { background: theme.background, borderColor: theme.linesColor } : {}),
    boxShadow: depthShadow,
    ...(tilt3d ? { '--board-tilt': `${tilt3d}deg` } : {}),
    transition: 'transform 0.35s ease, box-shadow 0.35s ease',
  };

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
      style={wrapperStyle}
    >
      {fx && (
        <div className="board-fx" aria-hidden="true">
          {fx.bg && <div className="board-fx-bg" style={{ background: fx.bg }} />}
          {fx.texture && <div className="board-fx-texture" style={{ background: fx.texture }} />}
          {fx.sheen && (
            <div
              className="board-fx-sheen"
              style={{
                backgroundImage: `linear-gradient(115deg, transparent 32%, ${fx.sheen} 50%, transparent 68%)`,
              }}
            />
          )}
          {Array.isArray(fx.floaters?.glyphs) && Array.from({ length: fx.floaters.count }).map((_, i) => {
            const glyph = fx.floaters.glyphs[i % fx.floaters.glyphs.length];
            return (
              <span
                key={`fx-f-${i}`}
                className={`board-fx-floater mode-${fx.floaters.mode || 'float'}`}
                style={{
                  left: `${(i * 53 + 7) % 94 + 3}%`,
                  color: fx.floaters.color,
                  animationDelay: `${(i * 0.9) % 7}s`,
                  animationDuration: `${6 + (i % 5)}s`,
                  fontSize: `${0.6 + (i % 4) * 0.14}rem`
                }}
              >
                {glyph}
              </span>
            );
          })}
          {Array.isArray(fx.signs) && fx.signs.map((s, i) => (
            <div
              key={`fx-s-${i}`}
              className="board-fx-sign"
              style={{
                color: '#fff',
                left: s.left,
                top: s.top,
                fontSize: s.size,
                transform: `rotate(${s.rotate || '0deg'})`,
                textShadow: neonSignShadow(s.color)
              }}
            >
              {s.text}
            </div>
          ))}
        </div>
      )}
      <svg 
        className="board-svg" 
        viewBox="0 0 100 100"
        style={{
          ...(boardBgColor ? { backgroundColor: boardBgColor, borderRadius: '10px' } : {}),
          ...(fx?.glowColor ? { filter: `drop-shadow(0 0 ${fx.glow || 6}px ${fx.glowColor})` } : {})
        }}
      >
        <rect x="10" y="10" width="80" height="80" fill="none" stroke={linesColor} strokeWidth="2.5" />
        <rect x="23.33" y="23.33" width="53.33" height="53.33" fill="none" stroke={linesColor} strokeWidth="2.5" />
        <rect x="36.66" y="36.66" width="26.68" height="26.68" fill="none" stroke={linesColor} strokeWidth="2.5" />

        <line x1="50" y1="10" x2="50" y2="36.66" stroke={linesColor} strokeWidth="2.5" />
        <line x1="90" y1="50" x2="63.33" y2="50" stroke={linesColor} strokeWidth="2.5" />
        <line x1="50" y1="90" x2="50" y2="63.33" stroke={linesColor} strokeWidth="2.5" />
        <line x1="10" y1="50" x2="36.66" y2="50" stroke={linesColor} strokeWidth="2.5" />

        {NODE_POSITIONS.map((pos, i) => (
          <circle
            key={`dot-${i}`}
            cx={pos.x}
            cy={pos.y}
            r="2.2"
            fill={linesColor}
            stroke={linesColor}
            strokeWidth="0.5"
            opacity="0.9"
          />
        ))}
      </svg>

      {NODE_POSITIONS.map((pos, idx) => {
        const piece = board[idx];
        const isSelected = selectedNode === idx;
        const isValidTarget = showLegalMoves && validMoves.includes(idx);
        const isRemovable = removableNodes.includes(idx);
        const isKeyboardFocused = focusedNode === idx;
        
        const canPickPiece = piece === turn && !isAITurn && !mustRemove;
        const inMill = piece ? isPieceInMill(board, idx, piece) : false;

        return (
          <div
            key={idx}
            className={`board-node-slot ${isValidTarget ? 'valid-target' : ''} ${isRemovable ? 'removable-target' : ''} ${isKeyboardFocused ? 'keyboard-focused' : ''}`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              if (isAITurn) return;
              onNodeInteract(idx);
            }}
          >
            {isKeyboardFocused && <div className="keyboard-focus-ring" />}
            {!piece && isValidTarget && <div className="target-dot" />}

            {piece && (
              <div
                className={`piece-slot ${piece === 'WHITE' ? 'piece-white' : 'piece-black'} ${isSelected ? 'selected-piece' : ''} ${inMill ? 'in-mill-piece' : ''} ${isRemovable ? 'pulse-remove' : ''} ${canPickPiece || isRemovable ? 'draggable' : ''}`}
                style={theme?.whitePiece && theme?.blackPiece ? {
                  background: piece === 'WHITE' ? theme.whitePiece : theme.blackPiece
                } : {}}
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
};

export default memo(Board);