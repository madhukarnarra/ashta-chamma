import React from 'react';
import Pawn from './Pawn';

const PlayerPanel = ({ player, playerIdx, isActive, isTurn, movePawn, waitingForMove }) => {
    const basePawns = player.pawns.map((pos, idx) => ({ pos, idx })).filter(p => p.pos === -1);
    const finishedPawns = player.pawns.filter(p => p === 12).length;

    return (
        <div className={`player-panel ${isActive ? 'active' : ''}`} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '2px', // minimal padding
            backgroundColor: isActive ? 'rgba(0,0,0,0.5)' : 'transparent',
            border: isActive ? `2px solid ${player.color === '#ff4444' ? 'red' : player.color === '#44ff44' ? 'green' : player.color === '#eebb00' ? 'yellow' : 'blue'}` : 'none',
            borderRadius: '6px',
            opacity: isActive ? 1 : 0.7,
            transition: 'all 0.3s',
            transform: isActive ? 'scale(1.1)' : 'scale(0.9)' // Scale focused player up
        }}>
            {/* Base Area - Very small now */}
            <div className="base-area" style={{
                width: '45px',
                height: '45px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '50%',
                position: 'relative',
                marginBottom: '2px',
                border: `1px solid ${player.color}`
            }}>
                {basePawns.map((p, i) => (
                    <div key={p.idx} style={{
                        position: 'absolute', width: '18px', height: '18px',
                        top: i < 2 ? '4px' : '22px', left: (i % 2) * 20 + 2 + 'px'
                    }}>
                        <Pawn
                            playerIdx={playerIdx}
                            isCurrentTurn={isActive && waitingForMove}
                            onClick={() => isActive && movePawn(p.idx)}
                            index={i} countInCell={basePawns.length}
                        />
                    </div>
                ))}
            </div>

            {/* Name Tag */}
            <div style={{
                background: player.color, color: 'black', fontWeight: 'bold',
                fontSize: '0.6rem', padding: '1px 4px', borderRadius: '4px'
            }}>
                {player.name.substring(0, 3)} {player.hasKilled ? "⚔" : ""} ({finishedPawns})
            </div>
        </div>
    );
};

export default PlayerPanel;
