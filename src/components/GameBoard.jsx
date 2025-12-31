import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Pawn from './Pawn';
import { SAFE_ZONES } from '../constants';

const GameBoard = ({ players, currentPlayerIndex, waitingForMove, movePawn, validMoves, boardShake }) => {
    const getPawnsInCell = (cellIndex) => {
        const list = [];
        players.forEach((p, pIdx) => {
            p.pawns.forEach((pos, pawnIdx) => {
                if (pos === cellIndex) {
                    list.push({ ...p, pawnIdx, playerIdx: pIdx });
                }
            });
        });
        return list;
    };

    const validTargetSet = new Set(Object.values(validMoves || {}));

    // Explicit Entry Definitions for Color Matching
    const ENTRIES = {
        0: 22, // Red
        1: 14, // Green
        2: 2,  // Yellow/Gold
        3: 10  // Blue
    };

    const PLAYER_COLORS = [
        'var(--p0-crystal)',
        'var(--p1-crystal)',
        'var(--p2-crystal)',
        'var(--p3-crystal)'
    ];

    return (
        <div className="board-3d-wrapper">
            <motion.div
                className="board-container chalk-board"
                animate={boardShake ? { x: [-3, 3, -3, 3, 0], transition: { duration: 0.3 } } : {}}
                style={{
                    position: 'relative', width: 'min(92vw, 55vh)', aspectRatio: '1/1',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gridTemplateRows: 'repeat(5, 1fr)',
                    gap: '0', padding: '8px', overflow: 'hidden'
                }}
            >
                {/* Liquid Gold Path Grid */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
                    <defs>
                        <filter id="gold-neon">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    <g stroke="var(--liquid-gold)" strokeWidth="1" opacity="0.3" filter="url(#gold-neon)">
                        {[1, 2, 3, 4].map(i => (
                            <line key={`v${i}`} x1={`${i * 20}%`} y1="0" x2={`${i * 20}%`} y2="100%" />
                        ))}
                        {[1, 2, 3, 4].map(i => (
                            <line key={`h${i}`} x1="0" y1={`${i * 20}%`} x2="100%" y2={`${i * 20}%`} />
                        ))}
                    </g>
                </svg>

                {/* Subdued Path Arrows */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                    <g stroke="rgba(255, 215, 0, 0.05)" strokeWidth="1" fill="none">
                        <path d="M 50% 90% L 10% 90% L 10% 10% L 90% 10% L 90% 90% L 55% 90%" />
                        <path d="M 30% 70% L 30% 30% L 70% 30% L 70% 70% L 50% 70% L 50% 55%" />
                    </g>
                </svg>

                {Array(25).fill(0).map((_, i) => {
                    const pawns = getPawnsInCell(i);
                    const isSafe = SAFE_ZONES.includes(i);
                    const isValidTarget = validTargetSet.has(i);

                    // Check if this is an entry point for a specific player
                    const entryPlayerIdx = Object.keys(ENTRIES).find(k => ENTRIES[k] === i);

                    let cellBg = 'transparent';
                    if (isSafe) cellBg = 'rgba(255, 215, 0, 0.03)';

                    return (
                        <div
                            key={i}
                            className="cell"
                            style={{
                                zIndex: 1,
                                background: cellBg,
                                position: 'relative',
                            }}
                        >
                            {/* Color-Matched Entry Box */}
                            {entryPlayerIdx !== undefined && (
                                <div style={{
                                    position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%',
                                    border: `2px solid ${PLAYER_COLORS[entryPlayerIdx]}`,
                                    borderRadius: '4px',
                                    boxShadow: `inset 0 0 10px ${PLAYER_COLORS[entryPlayerIdx]}`,
                                    opacity: 0.4,
                                    pointerEvents: 'none'
                                }} />
                            )}

                            {/* Gold Cross for Safe Zones */}
                            {isSafe && i !== 12 && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    pointerEvents: 'none', opacity: 0.15
                                }}>
                                    <svg width="40%" height="40%" viewBox="0 0 100 100">
                                        <line x1="0" y1="0" x2="100" y2="100" stroke="var(--liquid-gold)" strokeWidth="3" />
                                        <line x1="100" y1="0" x2="0" y2="100" stroke="var(--liquid-gold)" strokeWidth="3" />
                                    </svg>
                                </div>
                            )}

                            {/* Home Centerpiece */}
                            {i === 12 && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    zIndex: 0, border: '1px solid rgba(255, 215, 0, 0.2)'
                                }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--liquid-gold)', letterSpacing: '2px', textShadow: '0 0 10px var(--gold-glow)' }}>HOME</span>
                                </div>
                            )}

                            <AnimatePresence>
                                {pawns.map((pData, idx) => {
                                    const isOwner = pData.playerIdx === currentPlayerIndex;
                                    const isMoveable = isOwner && validMoves && validMoves[pData.pawnIdx] !== undefined;
                                    return (
                                        <Pawn
                                            key={`${pData.playerIdx}-${pData.pawnIdx}`}
                                            playerIdx={pData.playerIdx}
                                            isCurrentTurn={isMoveable}
                                            onClick={() => {
                                                console.log("Pawn clicked:", pData.pawnIdx, "isMoveable:", isMoveable);
                                                if (isMoveable) {
                                                    movePawn(pData.pawnIdx);
                                                }
                                            }}
                                            index={idx}
                                            countInCell={pawns.length}
                                        />
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default GameBoard;
