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
                    gap: '0', padding: '0', overflow: 'hidden'
                }}
            >
                {/* Liquid Gold Vein Grid */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
                    <defs>
                        <filter id="gold-vein-glow">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    <g stroke="var(--liquid-gold)" strokeWidth="0.8" opacity="0.2">
                        {[1, 2, 3, 4].map(i => (
                            <line key={`v${i}`} x1={`${i * 20}%`} y1="0" x2={`${i * 20}%`} y2="100%" />
                        ))}
                        {[1, 2, 3, 4].map(i => (
                            <line key={`h${i}`} x1="0" y1={`${i * 20}%`} x2="100%" y2={`${i * 20}%`} />
                        ))}
                    </g>
                    {/* Floating Gold Dust junctions */}
                    {[20, 40, 60, 80].map(x => [20, 40, 60, 80].map(y => (
                        <circle key={`${x}-${y}`} cx={`${x}%`} cy={`${y}%`} r="1.5" fill="var(--liquid-gold)" opacity="0.3" filter="url(#gold-vein-glow)" />
                    )))}
                </svg>

                {Array(25).fill(0).map((_, i) => {
                    const pawns = getPawnsInCell(i);
                    const isSafe = SAFE_ZONES.includes(i);
                    const isValidTarget = validTargetSet.has(i);
                    const entryPlayerIdx = Object.keys(ENTRIES).find(k => ENTRIES[k] === i);

                    let cellBg = 'transparent';
                    if (isSafe) cellBg = 'rgba(255, 215, 0, 0.02)';

                    return (
                        <div
                            key={i}
                            className="cell"
                            style={{
                                zIndex: 5, // Ensure interactive layer is high
                                background: cellBg,
                                position: 'relative',
                            }}
                        >
                            {/* Neon Glow Entry Circle */}
                            {entryPlayerIdx !== undefined && (
                                <div style={{
                                    position: 'absolute', width: '80%', height: '80%',
                                    borderRadius: '50%',
                                    border: `1.5px solid ${PLAYER_COLORS[entryPlayerIdx]}`,
                                    boxShadow: `0 0 15px ${PLAYER_COLORS[entryPlayerIdx]}`,
                                    opacity: 0.3,
                                    pointerEvents: 'none'
                                }} />
                            )}

                            {/* Minimalist Safe Zone Mark */}
                            {isSafe && i !== 12 && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    pointerEvents: 'none', opacity: 0.1
                                }}>
                                    <svg width="40%" height="40%" viewBox="0 0 100 100">
                                        <line x1="0" y1="0" x2="100" y2="100" stroke="var(--liquid-gold)" strokeWidth="2" />
                                        <line x1="100" y1="0" x2="0" y2="100" stroke="var(--liquid-gold)" strokeWidth="2" />
                                    </svg>
                                </div>
                            )}

                            {/* Home Obsidian Medallion */}
                            {i === 12 && (
                                <div style={{
                                    position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 215, 0, 0.05)',
                                    border: '1px solid var(--liquid-gold)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    zIndex: 0, opacity: 0.8
                                }}>
                                    <span style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--liquid-gold)', letterSpacing: '2px' }}>ఇల్లు</span>
                                    <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: 'var(--liquid-gold)', letterSpacing: '1px' }}>HOME</span>
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
                                                console.log("EXEC: Pawn Clicked", pData.pawnIdx, "Current Player", currentPlayerIndex);
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
