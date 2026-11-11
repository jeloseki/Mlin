export const BOARD_THEMES = [
    {
        id: 'classic-blue-gold',
        name: 'Blue & Gold (Default)',
        price: 0,
        isDefault: true,
        background: '#071524',
        boardBackground: '#0b1d3a',
        linesColor: '#d4af37',
        nodeColor: '#1e3a8a',
        nodeHoverColor: '#3b82f6',
        whitePiece: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #cbd5e1 70%, #94a3b8 100%)',
        blackPiece: 'radial-gradient(circle at 30% 30%, #334155 0%, #0f172a 70%, #020617 100%)',
        fx: {
            glowColor: '#d4af37',
            glow: 6,
            signs: [{ text: 'MLIN', color: '#d4af37', left: '3%', top: '3%', size: '1.1rem', rotate: '-6deg' }],
            floaters: { glyphs: ['✦', '✧', '●'], color: '#d4af37', count: 9, mode: 'float' },
            bg: 'radial-gradient(circle at 50% 40%, rgba(212,175,55,0.16) 0%, transparent 55%), radial-gradient(circle at 18% 88%, rgba(37,99,235,0.12) 0%, transparent 45%), linear-gradient(180deg, rgba(2,6,23,0.18) 0%, transparent 35%, rgba(2,6,23,0.30) 100%)',
            texture: 'linear-gradient(90deg, transparent 45%, rgba(255,255,255,0.035) 50%, transparent 55%)',
            sheen: 'rgba(255,226,150,0.30)',
            tilt3d: 4,
            depthShadow: '0 34px 70px rgba(0,0,0,0.85), inset 0 3px 0 rgba(255,255,255,0.10), inset 0 -18px 34px rgba(0,0,0,0.40)'
        }
    },
    {
        id: 'classic-wood',
        name: 'Classic Wood',
        price: 0, // Početna tema
        background: 'linear-gradient(135deg, #8B5A2B 0%, #5C3A21 100%)',
        boardBackground: '#DEB887',
        linesColor: '#3E2723',
        nodeColor: '#5C3A21',
        nodeHoverColor: '#8D6E63',
        whitePiece: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #d1d5db 70%, #9ca3af 100%)',
        blackPiece: 'radial-gradient(circle at 30% 30%, #4b5563 0%, #1f2937 70%, #030712 100%)',
        fx: {
            glowColor: null,
            signs: [{ text: '♟ MLIN ♟', color: '#3E2723', left: '3%', top: '4%', size: '1rem', rotate: '-3deg' }],
            floaters: { glyphs: ['♟', '♙', '·'], color: '#5C3A21', count: 8, mode: 'float' },
            bg: 'repeating-linear-gradient(115deg, rgba(62,39,35,0.10) 0 3px, rgba(255,255,255,0.04) 3px 6px, rgba(62,39,35,0.06) 6px 14px), radial-gradient(ellipse at 78% 74%, rgba(101,67,33,0.22) 0 30px, rgba(101,67,33,0.10) 30px 48px, transparent 60px), linear-gradient(180deg, rgba(255,255,255,0.06), transparent 30%)',
            texture: 'repeating-linear-gradient(8deg, transparent 0 18px, rgba(62,39,35,0.08) 18px 21px)',
            sheen: 'rgba(255,244,214,0.35)',
            tilt3d: 3,
            depthShadow: '0 30px 55px rgba(43,26,8,0.70), inset 0 3px 0 rgba(255,255,255,0.25), inset 0 -16px 30px rgba(43,26,8,0.45)'
        }
    },
    {
        id: 'neon-cyberpunk',
        name: 'Neon Cyberpunk',
        price: 100,
        background: '#090d16',
        boardBackground: '#0f172a',
        linesColor: '#38bdf8',
        nodeColor: '#0284c7',
        nodeHoverColor: '#38bdf8',
        whitePiece: 'radial-gradient(circle at 30% 30%, #38bdf8 0%, #0284c7 70%, #0369a1 100%)',
        blackPiece: 'radial-gradient(circle at 30% 30%, #f43f5e 0%, #e11d48 70%, #9f1239 100%)',
        fx: {
            glowColor: '#38bdf8',
            glow: 10,
            signs: [
                { text: 'MLIN', color: '#22d3ee', left: '2%', top: '3%', size: '1.35rem', rotate: '-8deg' },
                { text: '3×3', color: '#f472b6', left: '78%', top: '6%', size: '1.15rem', rotate: '6deg' },
                { text: 'MILL·AR', color: '#a78bfa', left: '6%', top: '88%', size: '0.95rem', rotate: '-4deg' }
            ],
            floaters: { glyphs: ['✦', '◉', '⚡', '✧'], color: '#22d3ee', count: 12, mode: 'float' },
            bg: 'radial-gradient(circle at 12% 8%, rgba(244,114,182,0.15), transparent 42%), radial-gradient(circle at 88% 92%, rgba(167,139,250,0.15), transparent 42%), radial-gradient(circle at 50% 45%, rgba(56,189,248,0.18), transparent 60%), linear-gradient(rgba(56,189,248,0.07) 1px, transparent 1px) 0 0/ 26px 26px',
            texture: 'repeating-linear-gradient(0deg, rgba(2,6,23,0.30) 0 2px, transparent 2px 5px)',
            sheen: 'rgba(34,211,238,0.35)',
            tilt3d: 4,
            depthShadow: '0 34px 70px rgba(0,0,0,0.85), 0 0 46px rgba(56,189,248,0.30), inset 0 2px 0 rgba(56,189,248,0.35), inset 0 -14px 30px rgba(2,6,23,0.60)'
        }
    },
    {
        id: 'marble-gold',
        name: 'Marble & Gold',
        price: 250,
        background: '#18181b',
        boardBackground: '#f4f4f5',
        linesColor: '#d4af37',
        nodeColor: '#b45309',
        nodeHoverColor: '#f59e0b',
        whitePiece: 'radial-gradient(circle at 30% 30%, #fef08a 0%, #eab308 70%, #ca8a04 100%)',
        blackPiece: 'radial-gradient(circle at 30% 30%, #27272a 0%, #09090b 70%, #000000 100%)',
        fx: {
            glowColor: '#f59e0b',
            glow: 5,
            signs: [{ text: 'MLIN', color: '#b45309', left: '4%', top: '4%', size: '1.1rem', rotate: '0deg' }],
            floaters: { glyphs: ['✦', '❖', '·'], color: '#b45309', count: 9, mode: 'float' },
            bg: 'radial-gradient(circle at 30% 22%, rgba(120,113,108,0.16), transparent 38%), radial-gradient(circle at 72% 70%, rgba(245,158,11,0.13), transparent 42%), radial-gradient(circle at 84% 18%, rgba(63,63,70,0.14), transparent 30%), linear-gradient(120deg, rgba(180,83,9,0.10), transparent 40%, rgba(245,158,11,0.10))',
            texture: 'linear-gradient(105deg, transparent 42%, rgba(180,83,9,0.10) 46%, rgba(113,113,122,0.08) 48%, transparent 55%)',
            sheen: 'rgba(255,255,255,0.45)',
            tilt3d: 3,
            depthShadow: '0 32px 60px rgba(0,0,0,0.75), 0 0 40px rgba(245,158,11,0.18), inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -14px 28px rgba(0,0,0,0.25)'
        }
    },
    {
        id: 'midnight-dark',
        name: 'Midnight Dark',
        price: 150,
        background: '#020617',
        boardBackground: '#0f172a',
        linesColor: '#64748b',
        nodeColor: '#334155',
        nodeHoverColor: '#94a3b8',
        whitePiece: 'radial-gradient(circle at 30% 30%, #e2e8f0 0%, #94a3b8 100%)',
        blackPiece: 'radial-gradient(circle at 30% 30%, #1e293b 0%, #0f172a 100%)',
        fx: {
            glowColor: '#93c5fd',
            glow: 5,
            signs: [{ text: 'MLIN', color: '#cbd5e1', left: '4%', top: '4%', size: '1.05rem', rotate: '-3deg' }],
            floaters: { glyphs: ['✦', '·', '✧', '★'], color: '#cbd5e1', count: 12, mode: 'float' },
            bg: 'radial-gradient(circle at 18% 16%, rgba(226,232,240,0.90) 0 5px, transparent 7px), radial-gradient(circle at 34% 62%, rgba(226,232,240,0.55) 0 2px, transparent 4px), radial-gradient(circle at 58% 24%, rgba(147,197,253,0.50) 0 3px, transparent 5px), radial-gradient(circle at 76% 46%, rgba(226,232,240,0.45) 0 2px, transparent 4px), radial-gradient(circle at 88% 82%, rgba(147,197,253,0.35) 0 3px, transparent 5px), radial-gradient(circle at 8% 74%, rgba(226,232,240,0.40) 0 2px, transparent 4px), radial-gradient(circle at 82% 12%, rgba(203,213,225,0.16), transparent 35%)',
            texture: 'radial-gradient(circle at 50% 120%, rgba(2,6,23,0.55), transparent 70%)',
            sheen: 'rgba(186,230,253,0.25)',
            tilt3d: 4,
            depthShadow: '0 34px 70px rgba(0,0,0,0.90), inset 0 2px 0 rgba(148,163,184,0.30), inset 0 -16px 32px rgba(0,0,0,0.55)'
        }
    },
    {
        id: 'emerald-forest',
        name: 'Emerald Forest',
        price: 200,
        background: '#022c22',
        boardBackground: '#064e3b',
        linesColor: '#34d399',
        nodeColor: '#059669',
        nodeHoverColor: '#6ee7b7',
        whitePiece: 'radial-gradient(circle at 30% 30%, #a7f3d0 0%, #10b981 100%)',
        blackPiece: 'radial-gradient(circle at 30% 30%, #064e3b 0%, #022c22 100%)',
        fx: {
            glowColor: '#34d399',
            glow: 6,
            signs: [{ text: 'MLIN', color: '#6ee7b7', left: '4%', top: '4%', size: '1.05rem', rotate: '-4deg' }],
            floaters: { glyphs: ['🍃', '✦', '❧'], color: '#6ee7b7', count: 10, mode: 'float' },
            bg: 'radial-gradient(circle at 16% 22%, rgba(16,185,129,0.10), transparent 40%), radial-gradient(circle at 82% 68%, rgba(6,95,70,0.28), transparent 50%), radial-gradient(circle at 50% 100%, rgba(52,211,153,0.18), transparent 55%), linear-gradient(180deg, rgba(209,250,229,0.06), transparent 40%)',
            texture: 'radial-gradient(ellipse at 68% 30%, rgba(4,120,87,0.18) 0 24px, transparent 40px), radial-gradient(ellipse at 30% 62%, rgba(4,120,87,0.14) 0 20px, transparent 34px)',
            sheen: 'rgba(167,243,208,0.30)',
            tilt3d: 3,
            depthShadow: '0 30px 58px rgba(2,20,14,0.80), inset 0 3px 0 rgba(167,243,208,0.25), inset 0 -16px 30px rgba(2,44,34,0.55)'
        }
    },
    {
        id: 'royal-ruby',
        name: 'Royal Ruby',
        price: 200,
        background: '#4c0519',
        boardBackground: '#881337',
        linesColor: '#fda4af',
        nodeColor: '#e11d48',
        nodeHoverColor: '#fb7185',
        whitePiece: 'radial-gradient(circle at 30% 30%, #ffe4e6 0%, #f43f5e 100%)',
        blackPiece: 'radial-gradient(circle at 30% 30%, #4c0519 0%, #1f1315 100%)',
        fx: {
            glowColor: '#fb7185',
            glow: 7,
            signs: [{ text: '👑 MLIN', color: '#fda4af', left: '3%', top: '4%', size: '1.1rem', rotate: '-4deg' }],
            floaters: { glyphs: ['♦', '✦', '✧'], color: '#fb7185', count: 11, mode: 'float' },
            bg: 'radial-gradient(circle at 24% 28%, rgba(255,228,230,0.14) 0 14px, rgba(251,113,133,0.10) 14px 34px, transparent 48px), radial-gradient(circle at 74% 64%, rgba(255,228,230,0.10) 0 10px, rgba(251,113,133,0.08) 10px 26px, transparent 38px), radial-gradient(circle at 50% 30%, rgba(251,113,133,0.20), transparent 60%), linear-gradient(180deg, rgba(254,205,211,0.05), transparent 45%)',
            texture: 'radial-gradient(ellipse at 50% -18%, rgba(255,255,255,0.14), transparent 55%)',
            sheen: 'rgba(254,205,211,0.40)',
            tilt3d: 4,
            depthShadow: '0 32px 62px rgba(20,2,8,0.85), 0 0 42px rgba(244,63,94,0.25), inset 0 3px 0 rgba(255,228,230,0.30), inset 0 -16px 30px rgba(76,5,25,0.60)'
        }
    },
    {
        id: 'retro-arcade',
        name: 'Retro Arcade',
        price: 300,
        background: '#2e1065',
        boardBackground: '#4c1d95',
        linesColor: '#f472b6',
        nodeColor: '#db2777',
        nodeHoverColor: '#f472b6',
        whitePiece: 'radial-gradient(circle at 30% 30%, #fbcfe8 0%, #ec4899 100%)',
        blackPiece: 'radial-gradient(circle at 30% 30%, #312e81 0%, #1e1b4b 100%)',
        fx: {
            glowColor: '#f472b6',
            glow: 8,
            signs: [
                { text: 'PRESS START', color: '#f472b6', left: '3%', top: '3%', size: '0.95rem', rotate: '0deg' },
                { text: 'MLIN·84', color: '#22d3ee', left: '70%', top: '86%', size: '1rem', rotate: '4deg' }
            ],
            floaters: { glyphs: ['🕹️', '⬤', '✦'], color: '#f472b6', count: 10, mode: 'float' },
            bg: 'radial-gradient(circle at 50% 35%, rgba(236,72,153,0.16), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 4px) 0 0/ 100% 4px, radial-gradient(circle at 8% 10%, rgba(34,211,238,0.12), transparent 35%), radial-gradient(circle at 92% 90%, rgba(167,139,250,0.12), transparent 35%)',
            texture: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 3px, transparent 3px 6px)',
            sheen: 'rgba(244,114,182,0.30)',
            tilt3d: 5,
            depthShadow: '0 36px 68px rgba(10,2,26,0.90), 0 0 44px rgba(236,72,153,0.30), inset 0 3px 0 rgba(255,255,255,0.15), inset 0 -16px 32px rgba(10,2,26,0.60)'
        }
    },
    {
        id: 'matrix-code',
        name: 'Matrix Code',
        price: 350,
        background: '#02230e',
        boardBackground: '#033b19',
        linesColor: '#4ade80',
        nodeColor: '#16a34a',
        nodeHoverColor: '#86efac',
        whitePiece: 'radial-gradient(circle at 30% 30%, #bbf7d0 0%, #22c55e 100%)',
        blackPiece: 'radial-gradient(circle at 30% 30%, #052e16 0%, #02230e 100%)',
        fx: {
            glowColor: '#22c55e',
            glow: 7,
            signs: [
                { text: 'MLIN.exe', color: '#4ade80', left: '4%', top: '4%', size: '1rem', rotate: '0deg' },
                { text: '> run()', color: '#86efac', left: '70%', top: '88%', size: '0.85rem', rotate: '0deg' }
            ],
            floaters: { glyphs: ['1', '0', '1', '0', '≡', '·'], color: '#4ade80', count: 16, mode: 'fall' },
            bg: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.14), transparent 60%), linear-gradient(180deg, rgba(0,0,0,0.25), transparent 20%, transparent 80%, rgba(0,0,0,0.35)), repeating-linear-gradient(90deg, transparent 0 40px, rgba(34,197,94,0.05) 40px 41px)',
            texture: 'repeating-linear-gradient(0deg, transparent 0 14px, rgba(0,0,0,0.10) 14px 15px)',
            sheen: 'rgba(74,222,128,0.35)',
            tilt3d: 3,
            depthShadow: '0 26px 50px rgba(0,0,0,0.85), 0 0 34px rgba(34,197,94,0.28), inset 0 2px 0 rgba(74,222,128,0.15), inset 0 -14px 28px rgba(0,0,0,0.45)'
        }
    },
    {
        id: 'desert-sand',
        name: 'Desert Sand',
        price: 150,
        background: '#451a03',
        boardBackground: '#78350f',
        linesColor: '#fde68a',
        nodeColor: '#d97706',
        nodeHoverColor: '#fef3c7',
        whitePiece: 'radial-gradient(circle at 30% 30%, #fef3c7 0%, #f59e0b 100%)',
        blackPiece: 'radial-gradient(circle at 30% 30%, #292524 0%, #0c0a09 100%)',
        fx: {
            glowColor: '#f59e0b',
            glow: 5,
            signs: [
                { text: 'MLIN', color: '#fde68a', left: '4%', top: '4%', size: '1.05rem', rotate: '-3deg' },
                { text: '☀ 36°', color: '#fbbf24', left: '80%', top: '90%', size: '0.9rem', rotate: '2deg' }
            ],
            floaters: { glyphs: ['∴', '·', '≈', '🐪'], color: '#fde68a', count: 10, mode: 'fall' },
            bg: 'linear-gradient(180deg, rgba(245,158,11,0.10), rgba(120,53,15,0.28)), repeating-linear-gradient(100deg, rgba(255,255,255,0.04) 0 3px, transparent 3px 26px), radial-gradient(ellipse at 78% 84%, rgba(245,158,11,0.28) 0 24px, transparent 60px), radial-gradient(ellipse at 18% 22%, rgba(253,230,138,0.15) 0 20px, transparent 60px)',
            texture: 'repeating-linear-gradient(115deg, transparent 0 24px, rgba(255,255,255,0.05) 24px 26px)',
            sheen: 'rgba(253,230,138,0.45)',
            tilt3d: 3,
            depthShadow: '0 30px 55px rgba(43,26,8,0.80), inset 0 4px 0 rgba(253,230,138,0.35), inset 0 -18px 34px rgba(43,26,8,0.55)'
        }
    },
    {
        id: 'ocean-deep',
        name: 'Ocean Deep',
        price: 200,
        background: '#082f49',
        boardBackground: '#0369a1',
        linesColor: '#bae6fd',
        nodeColor: '#0284c7',
        nodeHoverColor: '#7dd3fc',
        whitePiece: 'radial-gradient(circle at 30% 30%, #e0f2fe 0%, #38bdf8 100%)',
        blackPiece: 'radial-gradient(circle at 30% 30%, #0f172a 0%, #020617 100%)',
        fx: {
            glowColor: '#7dd3fc',
            glow: 6,
            signs: [
                { text: 'MLIN', color: '#bae6fd', left: '4%', top: '4%', size: '1.05rem', rotate: '-3deg' },
                { text: '−12m', color: '#7dd3fc', left: '82%', top: '90%', size: '0.85rem', rotate: '3deg' }
            ],
            floaters: { glyphs: ['○', '◌', '·', '〰'], color: '#bae6fd', count: 12, mode: 'float' },
            bg: 'radial-gradient(circle at 50% 0%, rgba(186,230,253,0.22), transparent 55%), radial-gradient(circle at 20% 80%, rgba(14,116,144,0.30) 0 30px, transparent 70px), radial-gradient(circle at 82% 70%, rgba(14,116,144,0.25) 0 40px, transparent 80px), linear-gradient(180deg, rgba(8,47,73,0.15), rgba(8,47,73,0.45))',
            texture: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06) 0 1px, transparent 2px) 0 0/ 22px 22px',
            sheen: 'rgba(186,230,253,0.40)',
            tilt3d: 4,
            depthShadow: '0 34px 60px rgba(2,6,23,0.85), 0 0 40px rgba(56,189,248,0.28), inset 0 4px 0 rgba(186,230,253,0.30), inset 0 -18px 34px rgba(2,6,23,0.55)'
        }
    }
];