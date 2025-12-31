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

    return (
        <motion.div
            className="board-container chalk-board"
            animate={boardShake ? { x: [-3, 3, -3, 3, 0], transition: { duration: 0.3 } } : {}}
            style={{
                position: 'relative', width: '100%', height: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gridTemplateRows: 'repeat(5, 1fr)',
                gap: '0', padding: '10px', overflow: 'hidden'
            }}
        >
            {/* Hand-Drawn Grid Lines */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
                <g filter="url(#chalk-filter)" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                    {[1, 2, 3, 4].map(i => (
                        <line key={`v${i}`} x1={`${i * 20}%`} y1="0" x2={`${i * 20}%`} y2="100%" />
                    ))}
                    {[1, 2, 3, 4].map(i => (
                        <line key={`h${i}`} x1="0" y1={`${i * 20}%`} x2="100%" y2={`${i * 20}%`} />
                    ))}
                </g>
            </svg>

            {/* Direction Marks - Guide for Pawn Movement */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 3 }}>
                <defs>
                    <marker id="path-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,0.15)" />
                    </marker>
                </defs>

                <g stroke="rgba(255,255,255,0.08)" strokeWidth="2" markerEnd="url(#path-arrow)" fill="none">
                    {/* Outer Ring Clockwise Path Guides */}
                    <path d="M 50% 90% L 10% 90% L 10% 10% L 90% 10% L 90% 90% L 55% 90%" />
                    {/* Inner Ring Spiral Path Guides */}
                    <path d="M 30% 70% L 30% 30% L 70% 30% L 70% 70% L 50% 70% L 50% 55%" />
                </g>
            </svg>

            {/* Entry Marks - Color coded to pawn colors */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                <defs>
                    <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                        <path d="M0,2 L6,5 L0,8 Z" fill="var(--pawn-red)" />
                    </marker>
                    <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                        <path d="M0,2 L6,5 L0,8 Z" fill="var(--pawn-green)" />
                    </marker>
                    <marker id="arrow-yellow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                        <path d="M0,2 L6,5 L0,8 Z" fill="var(--pawn-yellow)" />
                    </marker>
                    <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                        <path d="M0,2 L6,5 L0,8 Z" fill="var(--pawn-blue)" />
                    </marker>
                </defs>

                <g filter="url(#chalk-filter)">
                    {/* Start Entry Directions */}
                    <path d="M 50% 95% L 65% 95%" stroke="var(--pawn-red)" strokeWidth="3" markerEnd="url(#arrow-red)" />
                    <path d="M 95% 50% L 95% 35%" stroke="var(--pawn-green)" strokeWidth="3" markerEnd="url(#arrow-green)" />
                    <path d="M 50% 5% L 35% 5%" stroke="var(--pawn-yellow)" strokeWidth="3" markerEnd="url(#arrow-yellow)" />
                    <path d="M 5% 50% L 5% 65%" stroke="var(--pawn-blue)" strokeWidth="3" markerEnd="url(#arrow-blue)" />
                </g>
            </svg>

            {Array(25).fill(0).map((_, i) => {
                const pawns = getPawnsInCell(i);
                const isSafe = SAFE_ZONES.includes(i);
                const isValidTarget = validTargetSet.has(i);

                return (
                    <div
                        key={i}
                        className="cell"
                        style={{
                            zIndex: 1,
                            background: i === 12 ? 'var(--home-bg)' : (isSafe ? 'var(--safe-zone-bg)' : 'transparent'),
                            border: '1px solid rgba(255,255,255,0.05)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Safe Zone Mark - Centered Green X */}
                        {isSafe && i !== 12 && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                pointerEvents: 'none', opacity: 0.5,
                            }}>
                                <svg width="80%" height="80%" viewBox="0 0 100 100">
                                    <line x1="10" y1="10" x2="90" y2="90" stroke="#27ae60" strokeWidth="4" />
                                    <line x1="90" y1="10" x2="10" y2="90" stroke="#27ae60" strokeWidth="4" />
                                </svg>
                            </div>
                        )}

                        {/* HOME Label */}
                        {i === 12 && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                opacity: 0.8, userSelect: 'none', pointerEvents: 'none',
                                transform: 'scale(1.2)', zIndex: 0
                            }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#dbcc24' }}>ఇల్లు</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#dbcc24', letterSpacing: '3px' }}>HOME</span>
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
                                        onClick={() => isMoveable && movePawn(pData.pawnIdx)}
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
    );
};

export default GameBoard;
