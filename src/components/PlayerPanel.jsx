import React from 'react';
import Pawn from './Pawn';

const PlayerPanel = ({ player, playerIdx, isActive, isTurn, movePawn, waitingForMove }) => {
    const basePawns = player.pawns.map((pos, idx) => ({ pos, idx })).filter(p => p.pos === -1);
    const finishedPawns = player.pawns.filter(p => p === 12).length;

    const colors = [
        "var(--pawn-red)",
        "var(--pawn-green)",
        "var(--pawn-yellow)",
        "var(--pawn-blue)"
    ];
    const playerColor = colors[playerIdx] || player.color;

    return (
        <div className={`player-panel ${isActive ? 'active' : ''}`} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '4px',
            backgroundColor: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
            border: isActive ? `2px solid ${playerColor}` : 'none',
            borderRadius: '4px',
            opacity: isActive ? 1 : 0.6,
            transition: 'all 0.3s',
            transform: isActive ? 'scale(1.1)' : 'scale(0.9)',
            filter: 'url(#chalk-filter)'
        }}>
            {/* Base Area */}
            <div className="base-area" style={{
                width: '50px',
                height: '50px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '50%',
                position: 'relative',
                marginBottom: '4px',
                border: `1px dashed ${playerColor}`
            }}>
                {basePawns.map((p, i) => (
                    <div key={p.idx} style={{
                        position: 'absolute', width: '22px', height: '22px',
                        top: i < 2 ? '2px' : '24px', left: (i % 2) * 24 + 2 + 'px'
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
                color: playerColor, fontWeight: 'bold',
                fontSize: '0.8rem', padding: '1px 6px',
                textShadow: `0 0 5px ${playerColor}44`
            }}>
                {player.name.substring(0, 3)} {player.hasKilled ? "⚔" : ""} ({finishedPawns})
            </div>
        </div>
    );
};

export default PlayerPanel;
