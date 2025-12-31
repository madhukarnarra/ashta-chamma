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

            {/* Direction Marks - Color coded for each player */}
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
                    {/* Start Direction Arrows */}
                    <path d="M 50% 92% L 65% 92%" stroke="var(--pawn-red)" strokeWidth="3" markerEnd="url(#arrow-red)" opacity="0.8" />
                    <path d="M 92% 50% L 92% 35%" stroke="var(--pawn-green)" strokeWidth="3" markerEnd="url(#arrow-green)" opacity="0.8" />
                    <path d="M 50% 8% L 35% 8%" stroke="var(--pawn-yellow)" strokeWidth="3" markerEnd="url(#arrow-yellow)" opacity="0.8" />
                    <path d="M 8% 50% L 8% 65%" stroke="var(--pawn-blue)" strokeWidth="3" markerEnd="url(#arrow-blue)" opacity="0.8" />

                    {/* Inner Entry Arrows */}
                    <path d="M 30% 85% L 30% 75%" stroke="var(--pawn-red)" strokeWidth="2" markerEnd="url(#arrow-red)" opacity="0.5" strokeDasharray="3,3" />
                    <path d="M 85% 70% L 75% 70%" stroke="var(--pawn-green)" strokeWidth="2" markerEnd="url(#arrow-green)" opacity="0.5" strokeDasharray="3,3" />
                    <path d="M 70% 15% L 70% 25%" stroke="var(--pawn-yellow)" strokeWidth="2" markerEnd="url(#arrow-yellow)" opacity="0.5" strokeDasharray="3,3" />
                    <path d="M 15% 30% L 25% 30%" stroke="var(--pawn-blue)" strokeWidth="2" markerEnd="url(#arrow-blue)" opacity="0.5" strokeDasharray="3,3" />
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
                            background: isSafe ? 'var(--safe-zone-bg)' : 'transparent',
                        }}
                    >
                        {/* HOME Label */}
                        {i === 12 && (
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                opacity: 0.6, userSelect: 'none', pointerEvents: 'none',
                                filter: 'url(#chalk-filter)',
                                transform: 'scale(1.1)'
                            }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--chalk-white)' }}>ఇల్లు</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--chalk-white)', letterSpacing: '3px' }}>HOME</span>
                            </div>
                        )}

                        {/* Highlight for Valid Moves - Chalk Glow */}
                        {isValidTarget && (
                            <motion.div
                                animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.95, 1, 0.95] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                style={{
                                    position: 'absolute', top: 5, left: 5, right: 5, bottom: 5,
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '50%',
                                    filter: 'url(#chalk-filter)',
                                    zIndex: 0
                                }}
                            />
                        )}

                        {/* Safe Zone Mark - Simple Chalk X */}
                        {isSafe && i !== 12 && (
                            <div style={{
                                position: 'absolute', top: '15%', left: '15%', width: '70%', height: '70%',
                                pointerEvents: 'none', opacity: 0.3,
                                filter: 'url(#chalk-filter)'
                            }}>
                                <svg width="100%" height="100%" viewBox="0 0 100 100">
                                    <line x1="10" y1="10" x2="90" y2="90" stroke="white" strokeWidth="4" />
                                    <line x1="90" y1="10" x2="10" y2="90" stroke="white" strokeWidth="4" />
                                </svg>
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
