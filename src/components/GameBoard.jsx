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
            className="board-container chalk-box"
            animate={boardShake ? { x: [-3, 3, -3, 3, 0], transition: { duration: 0.3 } } : {}}
            style={{
                position: 'relative', width: '100%', height: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gridTemplateRows: 'repeat(5, 1fr)',
                gap: '0', padding: '1.5%', overflow: 'hidden'
            }}
        >
            {/* Direction Lines - Royal Blue for high contrast but pleasing look on cream */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.4, zIndex: 0 }}>
                <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 L0,0" fill="#2c3e50" />
                    </marker>
                </defs>

                <g stroke="#2c3e50" strokeWidth="1.5" strokeDasharray="3,3" markerEnd="url(#arrow)">
                    {/* Outer Ring */}
                    <line x1="90%" y1="10%" x2="10%" y2="10%" />
                    <line x1="10%" y1="10%" x2="10%" y2="90%" />
                    <line x1="10%" y1="90%" x2="90%" y2="90%" />
                    <line x1="90%" y1="90%" x2="90%" y2="10%" />

                    {/* Inner Ring */}
                    <line x1="30%" y1="30%" x2="70%" y2="30%" strokeDasharray="2,4" />
                    <line x1="70%" y1="30%" x2="70%" y2="70%" strokeDasharray="2,4" />
                    <line x1="70%" y1="70%" x2="30%" y2="70%" strokeDasharray="2,4" />
                    <line x1="30%" y1="70%" x2="30%" y2="30%" strokeDasharray="2,4" />

                    {/* Entry Arrows */}
                    <line x1="50%" y1="30%" x2="50%" y2="45%" strokeWidth="1" strokeDasharray="0" />
                    <line x1="30%" y1="50%" x2="45%" y2="50%" strokeWidth="1" strokeDasharray="0" />
                    <line x1="70%" y1="50%" x2="55%" y2="50%" strokeWidth="1" strokeDasharray="0" />
                    <line x1="50%" y1="70%" x2="50%" y2="55%" strokeWidth="1" strokeDasharray="0" />
                </g>
            </svg>

            {Array(25).fill(0).map((_, i) => {
                const pawns = getPawnsInCell(i);
                const isSafe = SAFE_ZONES.includes(i);
                const isValidTarget = validTargetSet.has(i);

                // Checkerboard Logic
                const isOdd = i % 2 !== 0;
                const cellBg = isOdd ? 'var(--cell-bg-1)' : 'var(--cell-bg-2)';

                // Center is Home (White/Gold?)
                const finalBg = (i === 12) ? '#fff8e1' : (isSafe ? 'var(--safe-zone-bg)' : cellBg);

                return (
                    <div
                        key={i}
                        className="cell"
                        style={{
                            position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',
                            zIndex: 1, background: finalBg,
                        }}
                    >
                        {/* Highlight for Valid Moves - Gold Glow */}
                        {isValidTarget && (
                            <motion.div
                                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1, 0.9] }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                                style={{
                                    position: 'absolute', top: 3, left: 3, right: 3, bottom: 3,
                                    border: '2px dashed #d4af37',
                                    backgroundColor: 'rgba(212, 175, 55, 0.2)',
                                    borderRadius: '50%', // Circle highlight looks nicer
                                    zIndex: 0
                                }}
                            />
                        )}

                        {/* Safe Zone Mark - Classy Flower Pattern */}
                        {isSafe && (
                            <div style={{
                                position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%',
                                pointerEvents: 'none', opacity: 0.15,
                            }}>
                                <svg width="100%" height="100%" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="5" fill="none" />
                                    <line x1="10" y1="10" x2="90" y2="90" stroke="black" strokeWidth="5" />
                                    <line x1="90" y1="10" x2="10" y2="90" stroke="black" strokeWidth="5" />
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
