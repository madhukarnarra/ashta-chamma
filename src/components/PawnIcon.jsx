import React from 'react';

const PawnIcon = ({ playerIndex, className = "" }) => {
    const colors = [
        "var(--pawn-red)",
        "var(--pawn-green)",
        "var(--pawn-yellow)",
        "var(--pawn-blue)"
    ];

    const pawnColor = colors[playerIndex] || colors[0];

    return (
        <svg viewBox="0 0 100 100" className={className} filter="url(#chalk-filter)">
            {/* Smudged chalk layer */}
            <circle cx="50" cy="50" r="45" fill={pawnColor} opacity="0.2" />
            {/* Outer wobbly line */}
            <circle cx="50" cy="50" r="40" stroke={pawnColor} strokeWidth="6" fill="none" />
            {/* Center dot/small circle */}
            <circle cx="50" cy="50" r="15" fill={pawnColor} opacity="0.6" />
        </svg>
    );
};

export default PawnIcon;
